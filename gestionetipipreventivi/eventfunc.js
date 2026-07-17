function refresh() {
    $('#TipiEsistenti').html('<tr><th>Tipo Preventivo</th><th>Descrizione</th></tr>');
    var elencoTipo = $.getJSON(server + 'secure/tipoPreventivo/elenco');
    
    elencoTipo.done(function(response) {
        for (i = 0; i < response.length; i++) {
            
                $('#TipiEsistenti').append('<tr style="cursor: pointer; cursor: hand;" onclick="mostra('+response[i].id+')"><td>'+ response[i].tipoPreventivo +'</td><td>'+ response[i].descrizione +'</td><td></td></tr>');                    		
            
        }
        Waves.attach('.btn',['waves-float','waves-block']);
        Waves.init();
    })
}
function aggiungitipo(){
    annullamodifica();
    $('#form').addClass('animated pulse');
    $('#boxregistrati').block({message: null});
    $('#inserimentoMode').removeClass('hidden');
    $('input, select').prop('disabled',false);
    $('textarea').prop('disabled',false);
    
    $('#descrizione').removeClass("bg-yellow") ;
    resetSchedaicon();
    $('#scheda-icon').addClass("fa fa-plus-square") ;
    
}
function annullamodifica() {
    idTipo = null;

    $('#formtitolo').text('Dettagli');
    $('#modificaMode').addClass('hidden');
    $('#inserimentoMode').addClass('hidden');
    $('#form').removeClass('box-danger animated pulse');
    $('#form').addClass('box-success');
    $('#inserisci').text('Salva');
    $('#inserisci').show();
    $('#inserisci').addClass('disabled');
    $('input, select').prop('disabled',true);
    $('textarea').prop('disabled',true);
    $('#modifica,#elimina').hide();
    $('#descrizione').removeClass("bg-yellow") ;
    resetSchedaicon();
    $('#scheda-icon').addClass("fa fa-eye") ;
    $('#pulisci').click();
    $('#boxregistrati').unblock({message: null});
}
function resetSchedaicon(){
    $('#scheda-icon').removeClass("fa fa-plus-square") ;
    $('#scheda-icon').removeClass("fa fa-eye");
    $('#scheda-icon').removeClass("fa fa-edit");
}
function mostra(id){
    idTipo = id;
    $('input, select').prop('disabled',true);
    $('textarea').prop('disabled',true);
    $('#modifica').show();

    $('#inserisci').hide();

    var getTipo = $.getJSON(server + 'secure/tipoPreventivo/leggi', {
        idTipo : idTipo
    });

    getTipo.done(function(response) {
        $('#tipoPreventivo').val(response.tipoPreventivo);
        $('#descrizione').val(response.descrizione);
        $('#elimina').show();    	
        $('#inserisci').removeClass('disabled');
    });
}
function modificatipo() {
    refresh();
    $('#formtitolo').text('Modifica categoria');
    $('#modificaMode').removeClass('hidden');
    $('#form').removeClass('box-default');
    $('#form').addClass('box-danger animated pulse');
    $('#inserisci').text('Salva modifiche');
    $('#inserisci').show();
    $('input, select').prop('disabled',false);
    $('textarea').prop('disabled',false);
    $('#modifica,#elimina').hide();
    $('#tipoPreventivo').attr("disabled", true);
    resetSchedaicon();
    $('#scheda-icon').addClass("fa fa-edit");


    $('html, body').animate({
        scrollTop : 0
    }, 'fast');


    $('#boxregistrati').block({message: null});


}
function eliminatipo() {
    swal({
        title : "Attenzione!",
        text : "Il Tipo sarà eliminato definitivamente.",
        type : 'warning',
        confirmButtonText : "Elimina",
        cancelButtonText : "Annulla",
        showCancelButton : true,
        closeOnConfirm : false,
        showLoaderOnConfirm : true,
    }, function() {
        var eliminatipo = $.get(server + 'secure/tipoPreventivo/cancella?idTipo='+idTipo);
        
        eliminatipo.success(function() {
            if (!errore) {
                swal("Eliminata", "", "success");
                annullamodifica();
                refresh();
            }
            errore = false;
        });
            eliminatipo.error(function(){
            swal("Impossibile Eliminiare", "Sono presenti alcuni preventivi per questo tipo", "error");
            annullamodifica();
                refresh();
                errore = false;
        });
    });          
}
$('#inserisci').on('click', function(e) {
    if (!idTipo) {

        var datiIns = { 
            tipoPreventivo : $('#tipoPreventivo').val(),
            descrizione : $('#descrizione').val(),
            
        }

        var inserisciTipo = $.post(server + 'secure/tipoPreventivo/inserisci',JSON.stringify(datiIns));
            
            
        inserisciTipo.success(function() {
        
                if (!errore) {
                swal("Inserita", "", "success");
                annullamodifica();
                refresh();
                
            }
            errore = false;
        });
            inserisciTipo.error(function(){
            
            swal("Tipo esistente", "", "error");
            annullamodifica();
                errore = false;
                refresh();
            });
    } else {
        
                
        var dati = {  
            idTipo: idTipo,
            tipoPreventivo : $('#tipoPreventivo').val(),
            descrizione : $('#descrizione').val(),
            
        }
        
        var modificaTipo = $.post(server + 'secure/tipoPreventivo/modifica',JSON.stringify(dati));

        modificaTipo.success(function() {
            errore = false;
            if (!errore) {
                swal("Tipo aggiornato", "", "success");
                annullamodifica();
                refresh();
            }
            
            $('#descrizione').removeClass("bg-yellow") ;
        });
    }
    
    resetSchedaicon();
    $('#scheda-icon').addClass("fa fa-eye") ;
});
$('#tipoPreventivo, #descrizione').bind('keyup change ifChanged', function() {
    if (idTipo !="" && $('#tipoPreventivo').val().trim()  != "" && $('#descrizione').val().trim()  != "")
        $('#inserisci').removeClass('disabled');
    else
        $('#inserisci').addClass('disabled');
});