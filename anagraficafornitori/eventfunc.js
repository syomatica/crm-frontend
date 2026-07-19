var filtri = false;
var fine = false;
var pagina = 0;


function refreshClifo() {
  if (filtri) {
    var data = {
      pagina: pagina,
      idTipoClifo: 3
    };

    tabFornitori.clear();
    if (!fine)
      var elencoClifo = $.post(server + 'secure/cliforapido/filters/listaf', JSON.stringify(data));
  } else
    var elencoClifo = $.getJSON(server + 'secure/cliforapido/elencof?pagina=' + pagina);



  elencoClifo.success(function(response) {
    /* if (response.length < 100) */
    fine = true;
    /* if (pagina == 0) */
    tabFornitori.clear();
    $('#elencoClifo').html('');
    for (i = 0; i < response.length; i++) {
      $('#elencoClifo').append('<tr class="wow fadeInUp" onclick="dettagliClifo(' + response[i].id + ')" style="cursor: pointer; cursor: hand"><td>' + response[i].societa + '</td><td>' + response[i].citta + '</td><td>' + response[i].referente + '</td><td>' + response[i].noteInterne + '</td></tr>');
      var newRow;
      newRow = tabFornitori.row.add( [
        response[i].societa,
        response[i].citta,
        response[i].referente,
        response[i].noteInterne,
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
  refreshClifo();
}

function resetFiltri() {
  filtri = false;
  pagina = 0;
  fine = false;
  refreshClifo();
}

/* function avanti() {
  pagina++;
  filtri ? refreshClifo() : refreshClifo();
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


    //$('#idTipoClifo').val(response[0].tipoCliFo);
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
    $('.mascheraClifo').find('input, textarea, select').prop('disabled', false).prop('readonly', false);

    $('.btn-enable').prop('disabled', false).prop('readonly', false);

    $("#btnOpenUpd").hide();
    $("#btnEliminaCli").hide();
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
    const societa = $('#societa').val().trim();
    if (!societa) {
        $('#erroreSocieta').show();
        return;
    }
    $('#erroreSocieta').hide();


    const data = {
      id: _idClifo,
      tipoCliFo: 'FORNITORE',
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
      cfisc:       $('#cfisc').val(),
      alias:''
    };


    $.ajax({
        url: server + 'secure/cliforapido/update',
        type: 'POST',
        contentType: 'application/json',
        // CS-272: header Authorization gestito globalmente da setupajax.js (sessionStorage token)
        data: JSON.stringify(data),

        success: function () {
            noty({
                text:   (_idClifo<0) 
                  ? 'inserimento eseeguito'
                  : 'aggiornamento eseguito',
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
            refreshClifo();
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
              refreshClifo();
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










