/*  pipeline-preventivi.js
 *  Dashboard Pipeline Offerte (Preventivi)
 *  Dipendenze: jQuery 2.1.4, select2, moment, numeral, Chart.js (già inclusi nella pagina)
 */
(function ($) {
  'use strict';

  // -----------------------------
  // Config / Helpers
  // -----------------------------
  var API_PATH = 'api/secure/preventivi/db/filters/elenco'; // come da tua descrizione
  function resolveApiUrl() {
    // Se hai server.js che espone "server" (base url), usa quello. Altrimenti usa relativo.
    if (typeof window.server === 'string' && window.server.length > 0) {
      // In altri tuoi file usi: server + 'secure/...'
      // Quindi qui rimuoviamo 'api/' e usiamo pattern coerente.
      return window.server + 'secure/preventivi/db/filters/elenco';
    }
    return API_PATH;
  }

  function safeJsonParse(maybeJson) {
    // Alcune API ritornano una stringa JSON (es: "[{...}]"), altre ritornano già l'array
    if (maybeJson == null) return [];
    if ($.isArray(maybeJson)) return maybeJson;

    if (typeof maybeJson === 'object') return maybeJson;

    if (typeof maybeJson === 'string') {
      var s = $.trim(maybeJson);
      if (!s) return [];
      try { return JSON.parse(s); } catch (e) { /* noop */ }
      // Se l'API ha doppi apici strani o escaping, prova una normalizzazione minima
      try {
        // esempio: "\"[{...}]\"" (stringa di stringa)
        if (s.charAt(0) === '"' && s.charAt(s.length - 1) === '"') {
          return JSON.parse(JSON.parse(s));
        }
      } catch (e2) { /* noop */ }
    }
    return [];
  }

  function fmtMoney(v) {
    var n = (v == null || v === '') ? 0 : Number(v);
    if (isNaN(n)) n = 0;
    // compatibile con numeral + languages.min.js (se hai locale it)
    return numeral(n).format('0,0.00');
  }

  function fmtPct(v) {
    var n = (v == null || v === '') ? 0 : Number(v);
    if (isNaN(n)) n = 0;
    return numeral(n / 100).format('0%');
  }

  function parseDate(d) {
    // d tipo "2025-07-18T00:00"
    if (!d) return null;
    var m = moment(d);
    return m.isValid() ? m : null;
  }

  function quarterKey(m) {
    // m = moment
    return m.year() + '-Q' + m.quarter();
  }

  function quarterRangeFromKey(qKey) {
    // qKey: "2025-Q3"
    var parts = (qKey || '').split('-Q');
    if (parts.length !== 2) return null;
    var y = parseInt(parts[0], 10);
    var q = parseInt(parts[1], 10);
    if (isNaN(y) || isNaN(q) || q < 1 || q > 4) return null;

    var start = moment().year(y).quarter(q).startOf('quarter');
    var end = moment().year(y).quarter(q).endOf('quarter');
    return { start: start, end: end };
  }

  function uniqPush(map, key, label) {
    if (key == null || key === '') return;
    if (!map[key]) map[key] = label;
  }

  // -----------------------------
  // Normalizzazione record
  // -----------------------------
  function normalizeOffer(o) {
    var dt = parseDate(o.Data);
    var dtMorte = parseDate(o.DataMorte);

    // Heuristica stato (dato che nella response vediamo Status e Morto)
    // - WON: Status==2 e Morto=false
    // - EXPIRED: Morto=true e DataMorte < oggi
    // - LOST: Morto=true ma senza DataMorte o DataMorte >= oggi
    // - OPEN: default
    var today = moment().startOf('day');
    var status = 'OPEN';
    if (o && o.Morto === true) {
      if (dtMorte && dtMorte.isBefore(today)) status = 'EXPIRED';
      else status = 'LOST';
    } else if (o && Number(o.Status) === 2) {
      status = 'WON';
    } else {
      status = 'OPEN';
    }

    // Probabilità: se hai già un campo Probabilita/Probability usalo, altrimenti default per stato
    var prob = null;
    if (o && (o.Probabilita != null || o.Probability != null)) {
      prob = Number(o.Probabilita != null ? o.Probabilita : o.Probability);
      if (isNaN(prob)) prob = null;
    }
    if (prob == null) {
      if (status === 'WON') prob = 100;
      else if (status === 'OPEN') prob = 50;
      else prob = 0;
    }

    var amount = Number(o && o.TotalePreventivo != null ? o.TotalePreventivo : 0);
    if (isNaN(amount)) amount = 0;

    var customerName = (o && (o.societa || o.Societa)) ? (o.societa || o.Societa) : '';
    if (!customerName) customerName = (o && o.IDclifo) ? ('Cliente #' + o.IDclifo) : '(Cliente non valorizzato)';

    // Agente / Partner: dalla response non ci sono nomi, solo IDaddetto1; partner non appare.
    // Se in futuro aggiungi IDpartner / partnerName, qui si aggancia.
    var agentId = (o && o.IDaddetto1 != null) ? String(o.IDaddetto1) : '';
    var agentName = agentId && agentId !== '0' ? ('Agente #' + agentId) : '(Agente N/D)';

    var partnerId = (o && (o.IDpartner != null)) ? String(o.IDpartner) : '';
    var partnerName = (o && o.partner) ? String(o.partner) : (partnerId ? ('Partner #' + partnerId) : '(Partner N/D)');

    // Tipo preventivo come “tipo”
    var tipo = (o && (o.TipoPreventivo || o.TipoPreventivoDescr)) ? (o.TipoPreventivo || o.TipoPreventivoDescr) : '(Tipo N/D)';

    // “Stage” per chart pipeline per fase: qui uso lo stato come fase base
    // Se vuoi fasi più dettagliate (lead/qualification/proposal/negotiation) serve un campo dedicato.
    var stage = status; // OPEN/WON/LOST/EXPIRED

    // Quarter basato su Data
    var qk = dt ? quarterKey(dt) : 'N/A';

    var weighted = amount * (prob / 100);

    return {
      raw: o,
      id: (o && o.IDpreventivo != null) ? o.IDpreventivo : null,
      code: (o && o.Code) ? String(o.Code) : '',
      customer: customerName,
      tipo: tipo,
      agentId: agentId,
      agent: agentName,
      partnerId: partnerId,
      partner: partnerName,
      status: status,
      stage: stage,
      probability: prob,
      amount: amount,
      weighted: weighted,
      date: dt,
      quarter: qk
    };
  }

  // -----------------------------
  // Stato app
  // -----------------------------
  var App = {
    all: [],
    filtered: [],
    charts: {
      stage: null,
      trend: null
    },
    maps: {
      agents: {},   // id -> label
      partners: {}  // id -> label
    }
  };

  // -----------------------------
  // UI Init
  // -----------------------------
  function initSelects() {
    // select2 per multi
    if ($.fn.select2) {
      $('#fAgents').select2({ width: '100%', placeholder: 'Tutti', allowClear: true });
      $('#fPartners').select2({ width: '100%', placeholder: 'Tutti', allowClear: true });
      $('#fQuarter').select2({ width: '100%', minimumResultsForSearch: 10 });
      $('#fView').select2({ width: '100%' });
      $('#fCustomerType').select2({ width: '100%' });
      $('#fStatus').select2({ width: '100%' });
    }

    // Quarter list: ultimi 8 trimestri + corrente
    var qSel = $('#fQuarter');
    qSel.empty();
    var now = moment();
    var list = [];
    for (var i = 0; i < 9; i++) {
      var m = moment(now).subtract(i, 'quarters');
      list.push({
        key: m.year() + '-Q' + m.quarter(),
        label: 'Q' + m.quarter() + ' ' + m.year()
      });
    }
    // uniq e ordina dal più recente al più vecchio
    var seen = {};
    for (var j = 0; j < list.length; j++) {
      if (seen[list[j].key]) continue;
      seen[list[j].key] = true;
      qSel.append($('<option/>').val(list[j].key).text(list[j].label));
    }
    // default: trimestre corrente
    qSel.val(moment().year() + '-Q' + moment().quarter()).trigger('change');
  }

  function bindActions() {
    $('#btnApply').on('click', function () {
      applyFiltersAndRender();
    });

    $('#btnReset').on('click', function () {
      // reset controlli
      $('#fView').val('total').trigger('change');
      $('#fAgents').val(null).trigger('change');
      $('#fPartners').val(null).trigger('change');
      $('#fCustomerType').val('').trigger('change');
      $('#fStatus').val('').trigger('change');
      $('#fMinProb').val(0);

      // trimestre corrente
      $('#fQuarter').val(moment().year() + '-Q' + moment().quarter()).trigger('change');

      applyFiltersAndRender();
    });

    // Applica automatico quando cambi trimestre/vista (comodo)
    $('#fQuarter, #fView').on('change', function () {
      applyFiltersAndRender();
    });
  }

  // -----------------------------
  // Fetch data
  // -----------------------------
  function loadOffers() {
    var dfd = $.Deferred();

    // payload: qui puoi metterci filtri server-side se li supporti.
    // Mantengo coerente con gli altri tuoi punti: JSON.stringify(data)
    var payload = {};

    $.ajax({
      method: 'POST',
      url: resolveApiUrl(),
      data: JSON.stringify(payload),
      contentType: 'application/json; charset=utf-8'
      // Nota: gli header token di solito li gestisci in setupajax.js
    }).done(function (resp) {
      var arr = safeJsonParse(resp);
      dfd.resolve(arr);
    }).fail(function (xhr) {
      dfd.reject(xhr);
    });

    return dfd.promise();
  }

  // -----------------------------
  // Filtri
  // -----------------------------
  function applyFiltersAndRender() {
    var qKey = $('#fQuarter').val();
    var range = quarterRangeFromKey(qKey);

    var view = $('#fView').val(); // total | agent | partner
    var selectedAgents = $('#fAgents').val() || [];
    var selectedPartners = $('#fPartners').val() || [];
    var customerType = $('#fCustomerType').val(); // non presente nei dati -> placeholder
    var statusFilter = $('#fStatus').val(); // OPEN/WON/LOST/EXPIRED
    var minProb = Number($('#fMinProb').val() || 0);
    if (isNaN(minProb)) minProb = 0;

    // NOTE: customerType non esiste nella response; lo lascio pronto se aggiungerai campo (es: CustomerType)
    App.filtered = App.all.filter(function (o) {
      // quarter
      if (range && o.date) {
        if (o.date.isBefore(range.start) || o.date.isAfter(range.end)) return false;
      } else if (range && !o.date) {
        return false;
      }

      // agents
      if (selectedAgents.length > 0) {
        if (!o.agentId || selectedAgents.indexOf(String(o.agentId)) === -1) return false;
      }

      // partners
      if (selectedPartners.length > 0) {
        if (!o.partnerId || selectedPartners.indexOf(String(o.partnerId)) === -1) return false;
      }

      // status
      if (statusFilter) {
        if (o.status !== statusFilter) return false;
      }

      // min prob
      if (o.probability < minProb) return false;

      // customer type (se in futuro lo hai)
      if (customerType) {
        var ct = (o.raw && (o.raw.CustomerType || o.raw.customerType)) ? String(o.raw.CustomerType || o.raw.customerType) : '';
        if (ct !== customerType) return false;
      }

      return true;
    });

    renderAll(view, qKey);
  }

  // -----------------------------
  // Render
  // -----------------------------
  function renderAll(view, qKey) {
    renderKpi(qKey);
    renderStageChart();
    renderTrendChart();
    renderOpenTable();
    renderTopTable(view);
  }

  function renderKpi(qKey) {
    var list = App.filtered;

    var total = 0, weighted = 0, won = 0;
    for (var i = 0; i < list.length; i++) {
      total += list[i].amount;
      weighted += list[i].weighted;
      if (list[i].status === 'WON') won += list[i].amount;
    }

    var openCount = list.filter(function (x) { return x.status === 'OPEN'; }).length;
    var closedCount = list.filter(function (x) { return x.status === 'WON' || x.status === 'LOST' || x.status === 'EXPIRED'; }).length;
    var winRate = (closedCount > 0) ? (list.filter(function (x) { return x.status === 'WON'; }).length / closedCount) : 0;

    // KPI
    $('#kpiWeighted').text(fmtMoney(weighted));
    $('#kpiUnweighted').text(fmtMoney(total));
    $('#kpiWon').text(fmtMoney(won));
    $('#kpiWinRate').text(numeral(winRate).format('0%'));

    // Optional: tooltip title (debug/leggibilità)
    $('#kpiWeighted').attr('title', 'Quarter: ' + qKey + ' | Open: ' + openCount + ' | Closed: ' + closedCount);
  }

  /*
  function renderStageChart() {
    // Pipeline per fase (qui: OPEN/WON/LOST/EXPIRED)
    var list = App.filtered;

    var stages = { OPEN: 0, WON: 0, LOST: 0, EXPIRED: 0 };
    for (var i = 0; i < list.length; i++) {
      stages[list[i].stage] = (stages[list[i].stage] || 0) + list[i].weighted;
    }

    var labels = ['OPEN', 'WON', 'LOST', 'EXPIRED'];
    var data = labels.map(function (k) { return Math.round((stages[k] || 0) * 100) / 100; });

    var ctx = document.getElementById('chartStage').getContext('2d');
    if (App.charts.stage) {
      if (!App.charts.stage.data) {
        App.charts.stage.data = { labels: [], datasets: [{ data: [] }] };
      }
      App.charts.stage.data.labels = labels;
      App.charts.stage.data.datasets[0].data = data;
      App.charts.stage.update();
      return;
    }

    App.charts.stage = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Pipeline pesata',
          data: data
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              callback: function (value) { return fmtMoney(value); }
            }
          }]
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem) {
              return ' ' + fmtMoney(tooltipItem.yLabel);
            }
          }
        }
      }
    });
  }
  */
  function renderStageChart() {
  var list = App.filtered;

  var stages = { OPEN: 0, WON: 0, LOST: 0, EXPIRED: 0 };
  for (var i = 0; i < list.length; i++) {
    var k = list[i].stage;
    stages[k] = (stages[k] || 0) + list[i].weighted;
  }

  var labels = ['OPEN', 'WON', 'LOST', 'EXPIRED'];
  var values = labels.map(function (k) {
    return Math.round((stages[k] || 0) * 100) / 100;
  });

  var canvas = document.getElementById('chartStage');
  if (!canvas) return;

  // Chart.js 1.0.1: se esiste già, distruggi e ricrea
  if (App.charts.stage && typeof App.charts.stage.destroy === 'function') {
    App.charts.stage.destroy();
  }
  App.charts.stage = null;

  var ctx = canvas.getContext('2d');

  var data = {
    labels: labels,
    datasets: [{
      label: 'Pipeline pesata',
      fillColor: 'rgba(54, 162, 235, 0.5)',
      strokeColor: 'rgba(54, 162, 235, 0.9)',
      highlightFill: 'rgba(54, 162, 235, 0.75)',
      highlightStroke: 'rgba(54, 162, 235, 1)',
      data: values
    }]
  };

  var options = {
    responsive: true,
    maintainAspectRatio: false,
    scaleBeginAtZero: true,
    // Tooltip v1
    tooltipTemplate: "<%= label %>: <%= value %>"
  };

  // Chart.js 1.0.1: new Chart(ctx).Bar(...)
  App.charts.stage = new Chart(ctx).Bar(data, options);
}

  /*
  function renderTrendChart() {
    // Trend trimestrale: ultimi 6 trimestri (weighted + total)
    var byQuarter = {}; // qk -> { total, weighted }
    for (var i = 0; i < App.all.length; i++) {
      var o = App.all[i];
      if (!o.quarter || o.quarter === 'N/A') continue;
      if (!byQuarter[o.quarter]) byQuarter[o.quarter] = { total: 0, weighted: 0 };
      byQuarter[o.quarter].total += o.amount;
      byQuarter[o.quarter].weighted += o.weighted;
    }

    // costruisci ultimi 6 trimestri da oggi
    var labels = [];
    var totals = [];
    var weights = [];
    for (var k = 5; k >= 0; k--) {
      var m = moment().subtract(k, 'quarters');
      var qk = m.year() + '-Q' + m.quarter();
      labels.push('Q' + m.quarter() + ' ' + m.year());
      var v = byQuarter[qk] || { total: 0, weighted: 0 };
      totals.push(Math.round(v.total * 100) / 100);
      weights.push(Math.round(v.weighted * 100) / 100);
    }

    var ctx = document.getElementById('chartTrend').getContext('2d');
    if (App.charts.trend) {
      App.charts.trend.data.labels = labels;
      App.charts.trend.data.datasets[0].data = weights;
      App.charts.trend.data.datasets[1].data = totals;
      App.charts.trend.update();
      return;
    }

    App.charts.trend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Pesata',
          data: weights,
          fill: false
        }, {
          label: 'Totale',
          data: totals,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              var dsLabel = data.datasets[tooltipItem.datasetIndex].label || '';
              return ' ' + dsLabel + ': ' + fmtMoney(tooltipItem.yLabel);
            }
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              callback: function (value) { return fmtMoney(value); }
            }
          }]
        }
      }
    });
  }
  */
  function renderTrendChart() {
  var byQuarter = {};
  for (var i = 0; i < App.all.length; i++) {
    var o = App.all[i];
    if (!o.quarter || o.quarter === 'N/A') continue;
    if (!byQuarter[o.quarter]) byQuarter[o.quarter] = { total: 0, weighted: 0 };
    byQuarter[o.quarter].total += o.amount;
    byQuarter[o.quarter].weighted += o.weighted;
  }

  var labels = [];
  var totals = [];
  var weights = [];

  for (var k = 5; k >= 0; k--) {
    var m = moment().subtract(k, 'quarters');
    var qk = m.year() + '-Q' + m.quarter();
    labels.push('Q' + m.quarter() + ' ' + m.year());
    var v = byQuarter[qk] || { total: 0, weighted: 0 };
    totals.push(Math.round(v.total * 100) / 100);
    weights.push(Math.round(v.weighted * 100) / 100);
  }

  var canvas = document.getElementById('chartTrend');
  if (!canvas) return;

  if (App.charts.trend && typeof App.charts.trend.destroy === 'function') {
    App.charts.trend.destroy();
  }
  App.charts.trend = null;

  var ctx = canvas.getContext('2d');

  var data = {
    labels: labels,
    datasets: [
      {
        label: 'Pesata',
        fillColor: "rgba(75,192,192,0.2)",
        strokeColor: "rgba(75,192,192,1)",
        pointColor: "rgba(75,192,192,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(75,192,192,1)",
        data: weights
      },
      {
        label: 'Totale',
        fillColor: "rgba(153,102,255,0.2)",
        strokeColor: "rgba(153,102,255,1)",
        pointColor: "rgba(153,102,255,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(153,102,255,1)",
        data: totals
      }
    ]
  };

  var options = {
    responsive: true,
    maintainAspectRatio: false,
    scaleBeginAtZero: true,
    tooltipTemplate: "<%= datasetLabel %>: <%= value %>"
  };

  App.charts.trend = new Chart(ctx).Line(data, options);
}


  function renderOpenTable() {
    // Top offerte aperte: ordina per weighted desc, solo status OPEN
    var rows = App.filtered
      .filter(function (o) { return o.status === 'OPEN'; })
      .sort(function (a, b) { return b.weighted - a.weighted; })
      .slice(0, 10);

    var $tb = $('#tblOpen tbody');
    $tb.empty();

    if (rows.length === 0) {
      $tb.append('<tr><td colspan="7" class="text-muted">Nessuna offerta aperta per i filtri selezionati.</td></tr>');
      return;
    }

    for (var i = 0; i < rows.length; i++) {
      var o = rows[i];
      var tr = $('<tr/>');
      tr.append($('<td/>').text(o.customer));
      tr.append($('<td/>').text(o.tipo));
      tr.append($('<td/>').text(o.agent));
      tr.append($('<td/>').text(o.partner));
      tr.append($('<td class="text-right"/>').text(fmtMoney(o.amount)));
      tr.append($('<td class="text-right"/>').text(o.probability + '%'));
      tr.append($('<td class="text-right"/>').text(fmtMoney(o.weighted)));

      // click: apri dettaglio (se hai una pagina dettaglio)
      // tr.css('cursor', 'pointer').on('click', (function (id) { return function () { window.location.href = 'preventivo.html?id=' + id; }; })(o.id));

      $tb.append(tr);
    }
  }

  function renderTopTable(view) {
    // Top per agente o partner (o totale)
    var list = App.filtered;

    var keyField = null;
    var labelField = null;
    if (view === 'agent') {
      keyField = 'agentId';
      labelField = 'agent';
    } else if (view === 'partner') {
      keyField = 'partnerId';
      labelField = 'partner';
    }

    var agg = {}; // key -> { name, weighted, won }
    for (var i = 0; i < list.length; i++) {
      var o = list[i];
      var key = view === 'total' ? 'TOTAL' : (o[keyField] || '');
      var name = view === 'total' ? 'Totale' : (o[labelField] || '(N/D)');

      if (!agg[key]) agg[key] = { name: name, weighted: 0, won: 0 };
      agg[key].weighted += o.weighted;
      if (o.status === 'WON') agg[key].won += o.amount;
    }

    // to array + sort
    var arr = [];
    for (var k in agg) {
      if (!agg.hasOwnProperty(k)) continue;
      // se vista agent/partner, evita chiavi vuote
      if (view !== 'total' && (k === '' || k === '0')) continue;
      arr.push(agg[k]);
    }

    arr.sort(function (a, b) { return b.weighted - a.weighted; });
    if (view === 'total') arr = arr.slice(0, 1);
    else arr = arr.slice(0, 10);

    var $tb = $('#tblTop tbody');
    $tb.empty();

    if (arr.length === 0) {
      $tb.append('<tr><td colspan="3" class="text-muted">Nessun dato per la vista selezionata.</td></tr>');
      return;
    }

    for (var i2 = 0; i2 < arr.length; i2++) {
      var r = arr[i2];
      var tr = $('<tr/>');
      tr.append($('<td/>').text(r.name));
      tr.append($('<td class="text-right"/>').text(fmtMoney(r.weighted)));
      tr.append($('<td class="text-right"/>').text(fmtMoney(r.won)));
      $tb.append(tr);
    }
  }

  // -----------------------------
  // Populate filters (agents/partners) da dataset
  // -----------------------------
  function populateDynamicFilters() {
    App.maps.agents = {};
    App.maps.partners = {};

    for (var i = 0; i < App.all.length; i++) {
      var o = App.all[i];
      if (o.agentId && o.agentId !== '0') uniqPush(App.maps.agents, o.agentId, o.agent);
      if (o.partnerId && o.partnerId !== '0') uniqPush(App.maps.partners, o.partnerId, o.partner);
    }

    var $a = $('#fAgents');
    var $p = $('#fPartners');

    // Agents
    $a.empty();
    var agentKeys = Object.keys(App.maps.agents).sort(function (x, y) { return Number(x) - Number(y); });
    for (var j = 0; j < agentKeys.length; j++) {
      var id = agentKeys[j];
      $a.append($('<option/>').val(id).text(App.maps.agents[id]));
    }

    // Partners
    $p.empty();
    var partnerKeys = Object.keys(App.maps.partners).sort();
    for (var k = 0; k < partnerKeys.length; k++) {
      var pid = partnerKeys[k];
      $p.append($('<option/>').val(pid).text(App.maps.partners[pid]));
    }

    // se select2 attivo, refresh
    if ($.fn.select2) {
      $a.trigger('change.select2');
      $p.trigger('change.select2');
    }

    // Se non abbiamo dati reali, mantieni comunque la UI usabile
    if (agentKeys.length === 0) {
      $a.prop('disabled', true);
    } else {
      $a.prop('disabled', false);
    }
    if (partnerKeys.length === 0) {
      $p.prop('disabled', true);
    } else {
      $p.prop('disabled', false);
    }
  }

  // -----------------------------
  // Boot
  // -----------------------------
  function boot() {
    // Locale numeral (se disponibile)
    try {
      if (numeral && numeral.language) {
        numeral.language('it');
      } else if (numeral && numeral.locale) {
        numeral.locale('it');
      }
    } catch (e) { /* noop */ }

    initSelects();
    bindActions();

    // Loading UI
    if ($.blockUI) {
      $.blockUI({ message: '<h4>Caricamento pipeline...</h4>' });
    }

    loadOffers()
      .done(function (raw) {
        var norm = raw.map(normalizeOffer);
        App.all = norm;

        populateDynamicFilters();
        applyFiltersAndRender();
      })
      .fail(function (xhr) {
        var msg = 'Errore nel caricamento offerte.';
        try {
          if (xhr && xhr.responseText) msg += '\n' + xhr.responseText;
        } catch (e) { /* noop */ }

        if (window.swal) swal('Errore', msg, 'error');
        else alert(msg);
      })
      .always(function () {
        if ($.unblockUI) $.unblockUI();
      });
  }

  $(document).ready(boot);

})(jQuery);
