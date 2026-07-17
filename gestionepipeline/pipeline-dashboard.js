var PipelineDash = (function() {

  var state = {
    offers: [],
    agents: [],
    partners: [],
    charts: { stage: null, trend: null }
  };

  function money(n) { return numeral(n || 0).format('0,0') + ' €'; }
  function pct(n) { return (n || 0).toFixed(0) + '%'; }

  function safeParseJson(s, fallback) {
    try { return JSON.parse(s); } catch(e) { return fallback; }
  }

  function getQuarterRange(qStr) {
    // qStr esempio: "2026-Q1"
    var parts = qStr.split('-Q');
    var y = parseInt(parts[0], 10);
    var q = parseInt(parts[1], 10);
    var startMonth = (q - 1) * 3; // 0,3,6,9
    var from = moment([y, startMonth, 1]).startOf('day');
    var to = moment(from).add(3, 'months').endOf('day');
    return { from: from, to: to };
  }

  function buildQuarterOptions() {
    // ultimi 6 trimestri
    var opts = [];
    var m = moment().startOf('quarter');
    for (var i = 0; i < 6; i++) {
      var y = m.year();
      var q = m.quarter();
      opts.push(y + '-Q' + q);
      m = m.subtract(1, 'quarter');
    }
    return opts;
  }

  function readFilters() {
    return {
      quarter: $('#fQuarter').val(),
      view: $('#fView').val(),
      agentIds: $('#fAgents').val() || [],
      partnerIds: $('#fPartners').val() || [],
      customerType: $('#fCustomerType').val() || '',
      status: $('#fStatus').val() || '',
      minProb: parseInt($('#fMinProb').val() || '0', 10)
    };
  }

  function filterOffers(offers, f) {
    return offers.filter(function(o) {
      if (f.customerType && o.customerType !== f.customerType) return false;
      if (f.status && o.status !== f.status) return false;
      if (o.probability < f.minProb) return false;

      if (f.agentIds.length && f.agentIds.indexOf(String(o.agentId)) === -1) return false;
      if (f.partnerIds.length) {
        // se filtrano partner, offerta deve averlo e matchare
        if (!o.partnerId) return false;
        if (f.partnerIds.indexOf(String(o.partnerId)) === -1) return false;
      }
      return true;
    });
  }

  function computeKpi(offers) {
    var open = offers.filter(o => o.status === 'OPEN');
    var won = offers.filter(o => o.status === 'WON');
    var lost = offers.filter(o => o.status === 'LOST');

    var pipelineUnweighted = open.reduce((s,o)=>s+(o.amount||0),0);
    var pipelineWeighted = open.reduce((s,o)=>s+(o.amount||0)*(o.probability||0)/100,0);
    var wonAmount = won.reduce((s,o)=>s+(o.amount||0),0);

    var closed = won.length + lost.length;
    var winRate = closed ? (won.length / closed) * 100 : 0;

    return { pipelineWeighted, pipelineUnweighted, wonAmount, winRate };
  }

  function renderKpi(k) {
    $('#kpiWeighted').text(money(k.pipelineWeighted));
    $('#kpiUnweighted').text(money(k.pipelineUnweighted));
    $('#kpiWon').text(money(k.wonAmount));
    $('#kpiWinRate').text(pct(k.winRate));
  }

  function groupByStage(openOffers) {
    var map = {};
    openOffers.forEach(function(o){
      var s = o.stage || 'N/A';
      map[s] = (map[s] || 0) + (o.amount||0)*(o.probability||0)/100;
    });
    var labels = Object.keys(map);
    var data = labels.map(l => map[l]);
    return { labels, data };
  }

  function renderStageChart(stageAgg) {
    var ctx = document.getElementById('chartStage').getContext('2d');
    if (state.charts.stage) state.charts.stage.destroy();

    state.charts.stage = new Chart(ctx).Bar({
      labels: stageAgg.labels,
      datasets: [{ data: stageAgg.data }]
    }, { responsive: true, animation: false });
  }

  function groupTrend(offers, range) {
    // trend mensile nei 3 mesi del trimestre: pipeline pesata OPEN + vinto
    var months = [];
    var m = moment(range.from).startOf('month');
    for (var i=0;i<3;i++){
      months.push(moment(m).format('MMM'));
      m = m.add(1,'month');
    }

    function monthIndex(dateStr) {
      var d = moment(dateStr);
      return d.diff(moment(range.from).startOf('month'), 'months');
    }

    var open = offers.filter(o => o.status === 'OPEN');
    var won = offers.filter(o => o.status === 'WON');

    var openW = [0,0,0];
    open.forEach(function(o){
      var idx = monthIndex(o.updatedAt || o.createdAt);
      if (idx>=0 && idx<3) openW[idx] += (o.amount||0)*(o.probability||0)/100;
    });

    var wonA = [0,0,0];
    won.forEach(function(o){
      var idx = monthIndex(o.closeDate);
      if (idx>=0 && idx<3) wonA[idx] += (o.amount||0);
    });

    return { labels: months, openW: openW, wonA: wonA };
  }

  function renderTrendChart(tr) {
    var ctx = document.getElementById('chartTrend').getContext('2d');
    if (state.charts.trend) state.charts.trend.destroy();

    state.charts.trend = new Chart(ctx).Line({
      labels: tr.labels,
      datasets: [
        { data: tr.openW },
        { data: tr.wonA }
      ]
    }, { responsive: true, animation: false });
  }

  function renderTopOpen(openOffers) {
    var rows = openOffers
      .slice()
      .sort((a,b)=> ((b.amount*b.probability/100) - (a.amount*a.probability/100)))
      .slice(0, 10)
      .map(function(o){
        var weighted = (o.amount||0)*(o.probability||0)/100;
        return '<tr>'
          + '<td>'+ (o.customerName||'') +'</td>'
          + '<td>'+ (o.customerType||'') +'</td>'
          + '<td>'+ (o.agentName||'') +'</td>'
          + '<td>'+ (o.partnerName||'') +'</td>'
          + '<td class="text-right">'+ money(o.amount) +'</td>'
          + '<td class="text-right">'+ pct(o.probability) +'</td>'
          + '<td class="text-right">'+ money(weighted) +'</td>'
          + '</tr>';
      }).join('');

    $('#tblOpen tbody').html(rows || '<tr><td colspan="7" class="text-center text-muted">Nessun dato</td></tr>');
  }

  function renderTopEntities(offers, view) {
    // view: agent | partner
    var keyId = view === 'partner' ? 'partnerId' : 'agentId';
    var keyName = view === 'partner' ? 'partnerName' : 'agentName';

    var map = {};
    offers.forEach(function(o){
      if (!o[keyId]) return;
      var id = String(o[keyId]);
      if (!map[id]) map[id] = { name: o[keyName], weighted: 0, won: 0 };
      map[id].weighted += (o.amount||0)*(o.probability||0)/100;
      if (o.status === 'WON') map[id].won += (o.amount||0);
    });

    var arr = Object.keys(map).map(id => map[id])
      .sort((a,b)=>b.weighted-a.weighted)
      .slice(0, 10);

    var rows = arr.map(function(x){
      return '<tr>'
        + '<td>'+ (x.name||'') +'</td>'
        + '<td class="text-right">'+ money(x.weighted) +'</td>'
        + '<td class="text-right">'+ money(x.won) +'</td>'
        + '</tr>';
    }).join('');

    $('#tblTop tbody').html(rows || '<tr><td colspan="3" class="text-center text-muted">Nessun dato</td></tr>');
  }

  // ---- DATA LOAD ----
  function loadReferenceData() {
    // TODO: sostituisci con i tuoi endpoint reali
    // agents/partners possono arrivare anche da offers
    return $.Deferred().resolve().promise();
  }

  function loadOffersForQuarter(qStr) {
    var range = getQuarterRange(qStr);
    // TODO: qui chiamerai la tua API (es: server+'secure/offers?...')
    // Per ora placeholder:
    return $.getJSON(server + 'secure/offers', {
      from: range.from.format('YYYY-MM-DD'),
      to: range.to.format('YYYY-MM-DD')
    });
  }

  function refresh() {
    var f = readFilters();
    var range = getQuarterRange(f.quarter);

    $.when(loadOffersForQuarter(f.quarter)).done(function(offers){
      state.offers = offers || [];

      var filtered = filterOffers(state.offers, f);
      var kpi = computeKpi(filtered);
      renderKpi(kpi);

      var open = filtered.filter(o => o.status === 'OPEN');
      renderStageChart(groupByStage(open));
      renderTrendChart(groupTrend(filtered, range));
      renderTopOpen(open);

      var topView = (f.view === 'partner') ? 'partner' : 'agent';
      renderTopEntities(filtered, topView);
    });
  }

  function bind() {
    $('#btnApply').on('click', refresh);
    $('#btnReset').on('click', function(){
      $('#fAgents,#fPartners').val(null).trigger('change');
      $('#fCustomerType,#fStatus').val('');
      $('#fMinProb').val(0);
      refresh();
    });
  }

  function init() {
    // quarter select
    var opts = buildQuarterOptions().map(q => '<option value="'+q+'">'+q+'</option>').join('');
    $('#fQuarter').html(opts);

    // select2 se lo usi già
    $('#fAgents,#fPartners').select2({ placeholder: 'Seleziona', width: '100%' });

    bind();
    refresh();
  }

  return { init: init };

})();
