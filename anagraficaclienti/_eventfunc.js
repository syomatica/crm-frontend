var filtri = false;
var fine = false;
var pagina = 0;


function refreshClifo(filtroTipo, filtroSocieta) {
  if (filtri) {
    var data = {
      pagina: pagina,
      idTipoClifo: filtroTipo,
      id: filtroSocieta
    };

    if (!data.idTipoClifo) delete data.idTipoClifo;

    if (!data.id) delete data.id;

    tabClienti.clear();
    if (!fine)
      var elencoClifo = $.post(server + 'secure/cliforapido/filters/lista', JSON.stringify(data));
  } else
    var elencoClifo = $.getJSON(server + 'secure/cliforapido/elenco?pagina=' + pagina);



  elencoClifo.success(function(response) {
    /* if (response.length < 100) */
    fine = true;
    /* if (pagina == 0) */
    tabClienti.clear();
    $('#elencoClifo').html('');
    for (i = 0; i < response.length; i++) {
      $('#elencoClifo').append('<tr class="wow fadeInUp" onclick="dettagliClifo(' + response[i].id + ')" style="cursor: pointer; cursor: hand"><td>' + response[i].societa + '</td><td>' + response[i].citta + '</td><td>' + response[i].referente + '</td><td>' + response[i].tipoClifo + '</td></tr>');
      var newRow;
      newRow = tabClienti.row.add( [
        response[i].societa,
        response[i].citta,
        response[i].referente,
        response[i].tipoClifo,
        response[i].id
      ] ).draw();
    }
  });
}

/* var start = false;
$(window).scroll(function() {
  if ($(window).scrollTop() == $(document).height() - $(window).height() && start && $('.elencoClifo').is(":visible")) {
    avanti();
  }
  start = true;
}); */
function applicaFiltri() {
  filtri = true;
  pagina = 0;
  fine = false;
  refreshClifo($('#filtroTipo').val(), $('#filtroSocieta').val());
}

function resetFiltri() {
  filtri = false;
  pagina = 0;
  fine = false;
  $('#filtroTipo,#filtroSocieta').val(null).trigger('change');
  refreshClifo();
}
/* function avanti() {
  pagina++;
  filtri ? refreshClifo($('#filtroTipo').val(), $('#filtroSocieta').val()) : refreshClifo();
} */

function textAreaAdjust(o) {
    autosize(o);
}
var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

function elencoClifo() {

  $('.mascheraClifo').hide();
  $('.elencoClifo').show().addClass('animated slideInLeft').one(animationEnd, function() {
    $(this).removeClass('animated slideInLeft');
  });
  $('.boxGenerali').hide();
  $('.boxFornitori').hide();
}

function dettagliGenerali() {
  $('.boxFornitori').hide();
  $('.boxGenerali').show().addClass('animated bounceInDown').one(animationEnd, function() {
    $(this).removeClass('animated bounceInDown');
  });
}

function dettagliClifo(id) {
  _idClifo = id;
  var richiestaClifo = $.getJSON(server + 'secure/cliforapido/readByKey?idClifo=' + id);

  richiestaClifo.success(function(response) {
    //    var richiestaDettagli = $.getJSON(server + 'secure/cliforapido/dettagli/readByKey?idClifo=' + id);


    $('#idTipoClifo').val(response[0].tipoCliFo);
    $('#societa').val(response[0].societa);
    $('#idClifo').text(response[0].idClifo2);
    $('#indirizzo').val(response[0].via);
    $('#cap').val(response[0].cap);
    $('#citta').val(response[0].citta);
    $('#provincia').val(response[0].provincia);
    $('#nazione').val(response[0].nazione);
    $('#agente').val(response[0].agente);
    //Cliente
    $('#titoloC').val(response[0].titoloC);
    $('#nomeC').val(response[0].nomeC);
    $('#cognomeC').val(response[0].cognomeC);
    $('#cellulareC').val(response[0].cellulareC);
    $('#emailC').val(response[0].emailC);
    $('#telefono').val(response[0].telefono);
    $('#fax').val(response[0].fax);
    $('#noteInterne').val(response[0].noteInterne);
    $('#piva').val(response[0].piva);
    $('#cfisc').val(response[0].cf);
    $('#pec').val(response[0].pec);
    $('#telematico').val(response[0].telematico);

    /*
    $('#canale').val(response[0].canale);
    if (response[0].radiceCnt == 01011000) {
      tipoMago = "Cliente Italia";
    } else {
      tipoMago = "Cliente Estero";
    }
    $('#tipo').val(tipoMago);
    $('#cf').val(response[0].cf);
    $('#piva').val(response[0].piva);
    $('#bloccato').iCheck(response[0].bloccato ? 'check' : 'uncheck');
    $('#l2mtipo').text(response[0].magoTipoCliFor);
    $('#l2mcliFor').text(response[0].magoCliFor);
    */

    $('.elencoClifo').hide();
    $('.mascheraClifo').show().addClass('animated slideInRight').one(animationEnd, function() {
      $(this).removeClass('animated slideInRight');
    });
  });
  if ($('#generale').hasClass('active')) {
    setTimeout(function() {
      $('.boxGenerali').show().addClass('animated bounceInDown').one(animationEnd, function() {
        $(this).removeClass('animated bounceInDown');
      });
    }, 400);
  } else {
    $('#tabgenerale').click();
  }
  setupVisualizzazione();
}

function nuovoClifo() {
    _idClifo = -1;
    $('#idTipoClifo').val("CLIENTE");
    $('#idTipoClifo2').val("CLIENTE");
    $('#societa').val("");
    $('#idClifo').text("");
    $('#indirizzo').val("");
    $('#cap').val("");
    $('#citta').val("");
    $('#provincia').val("");
    $('#nazione').val("");
    $('#agente').val("");
    $('#titoloC').val("");
    $('#nomeC').val("");
    $('#cognomeC').val("");
    $('#cellulareC').val("");
    $('#emailC').val("");
    $('#telefono').val("");
    $('#fax').val("");
    $('#noteInterne').val("");

    $('#piva').val("");
    $('#cfisc').val("");
    $('#pec').val("");
    $('#telematico').val("");

    $('.elencoClifo').hide();
    $('.mascheraClifo').show().addClass('animated slideInRight').one(animationEnd, function () {
        $(this).removeClass('animated slideInRight');
    });

    if ($('#generale').hasClass('active')) {
        setTimeout(function () {
            $('.boxGenerali').show().addClass('animated bounceInDown').one(animationEnd, function () {
                $(this).removeClass('animated bounceInDown');
            });
        }, 400);
    } else {
        $('#tabgenerale').click();
    }

    setupModifica();
}


function setupModifica() {
    isUpdate = true;

    // Sblocca tutto tranne #idTipoClifo
    /*
    $('input,textarea,select').not('#idTipoClifo,#filter-panel *,#modalStampaPreventivo *')
        .prop('disabled', false)
        .prop('readonly', false);
    */
   $('.mascheraClifo').find('input, textarea, select').prop('disabled', false).prop('readonly', false);
   $('#idTipoClifo').prop('disabled', true).prop('readonly', true);

    $('.btn-enable').prop('disabled', false).prop('readonly', false);
    //$('select').select2('enable', true);

    // tipo cliente mostro input o select in base a modifica/inserimento
    $("#idTipoClifo2").hide();
    $('#idTipoClifo').hide();
    if (_idClifo<0) {
        $('#idTipoClifo2').show();
    } else {
        $('#idTipoClifo').show();
    }

    $("#btnOpenUpd").hide();
    $('#btnEliminaCli').hide();
    $("#btnSaveUpd").show();
    $("#btnCancelUpd").show();
}



function setupVisualizzazione() {
    isUpdate = false;
    $('.mascheraClifo').find('input, textarea, select')
    .not('#filter-panel *, #modalStampaPreventivo *')
    .prop('disabled', true);
    $('.btn-enable').prop('disabled', true);
    $("#btnOpenUpd").show();
    $("#btnEliminaCli").show();
    if(_idClifo < 0){
      $('#btnEliminaCli').hide();
    }
    $("#btnSaveUpd").hide();
    $("#btnCancelUpd").hide();
    $('#idTipoClifo').show();
    $("#idTipoClifo2").hide();
}



function modificaCli() {
  setupModifica();
}


function anullaCli() {
  if(_idClifo<0){
    //Ritorno ad elenco perchè INSERIMENTO
    elencoClifo();
  } else {
    dettagliClifo(_idClifo);
  }
}

/**
 * Salva o aggiorna un CliFo.
 * – _idClifo = -1   inserimento
 * – _idClifo >= 0   modifica
 */
function salvaCli() {
    var tipo = $("#idTipoClifo").val();
    if(_idClifo<0){
      tipo = $("#idTipoClifo2").val();
    }
    const societa = $('#societa').val().trim();
    if (!societa) {
        $('#erroreSocieta').show();
        return;
    }
    $('#erroreSocieta').hide();

    //se cliente, verifica campi obbligatori
    if (tipo == 'CLIENTE') {
        const piva       = $('#piva').val();
        const pec        = $('#pec').val();
        const telematico = $('#telematico').val();
        const via        = $('#indirizzo').val();
        const citta      = $('#citta').val();
        const cap        = $('#cap').val();
        const provincia  = $('#provincia').val();

        if (!piva) {
            swal("Errore", "Partita IVA obbligatoria per i CLIENTI", "warning");
            return;
        }
        if (!pec && !telematico) {
            swal("Errore", "Inserire almeno PEC o Indirizzo Telematico", "warning");
            return;
        }
        if (!via || !citta || !cap || !provincia) {
            swal("Errore",
                 "Compilare l'indirizzo completo: via, città, CAP e provincia",
                 "warning");
            return;
        }
    }

    const data = {
      id: _idClifo,
      tipoCliFo: tipo,
      societa: societa,
      via: $('#indirizzo').val(),
      cap: $('#cap').val(),
      citta: $('#citta').val(),
      provincia: $('#provincia').val(),
      nazione: $('#nazione').val(),
      titoloC: $('#titoloC').val(),
      nomeC: $('#nomeC').val(),
      cognomeC: $('#cognomeC').val(),
      cellulareC: $('#cellulareC').val(),
      emailC: $('#emailC').val(),
      telefono: $('#telefono').val(),
      fax: $('#fax').val(),
      noteInterne: $('#noteInterne').val(),
      pec:         $('#pec').val(),
      telematico:  $('#telematico').val(),
      piva:        $('#piva').val(),
      cfisc:       $('#cfisc').val()

    };


    $.ajax({
        url: server + 'secure/cliforapido/update',
        type: 'POST',
        contentType: 'application/json',
        headers: { 
          'Authorization': 'Bearer ' + localStorage.getItem('jwt') 
        },
        data: JSON.stringify(data),

        success: function () {
            noty({
                text:   (_idClifo<0) 
                  ? tipo + ' inserito con successo'
                  : 'Modifiche salvate con successo',
                layout: 'topCenter',
                type:   'success',
                killer: true,
                timeout: 2000,
                animation: {
                    open:  'animated bounceInDown',
                    close: 'animated bounceOutUp',
                    speed: 500
                }
            });
            $("#btnOpenUpd").show();
            $('#btnEliminaCli').show();
            $("#btnSaveUpd").hide();
            $("#btnCancelUpd").hide();
            refreshClifo($('#filtroTipo').val(), $('#filtroSocieta').val());
            if(_idClifo>=0){
              dettagliClifo(_idClifo);
            }
        },

        error: function (xhr) {
            swal("Errore", "Errore nel salvataggio", "error");
        }
    });

}



function eliminaCli() {
    swal({
        title: "",
        text: "L’operazione eliminerà definitivamente questa anagrafica dall’archivio. Si prega di confermare.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d9534f",
        confirmButtonText: "Sì, elimina",
        cancelButtonText: "Annulla",
        closeOnConfirm: true,
        allowEscapeKey: false,
        allowOutsideClick: false
    }, function (isConfirm) {
        if (!isConfirm) return;

        $.ajax({
            url: server + 'secure/cliforapido/elimina',
            type: 'POST',
            data: JSON.stringify({ id: _idClifo }),
            contentType: 'application/json',
            success: function () {
              noty({
                text:   'Anagrafica rimossa correttamente.',
                layout: 'topCenter',
                type:   'success',
                killer: true,
                timeout: 2000,
                animation: {
                    open:  'animated bounceInDown',
                    close: 'animated bounceOutUp',
                    speed: 500
                }
              });
              refreshClifo($('#filtroTipo').val(), $('#filtroSocieta').val());
              elencoClifo();
            },
            error: function (r) {
                var msg = "Errore generico.";
                try { msg = JSON.parse(r.responseText).ERROR || msg; } catch (e) {}
                swal({
                    title: "Errore",
                    text: msg,
                    type: "error",
                    allowEscapeKey: false,
                    allowOutsideClick: false
                });
            }
        });
    });
}










