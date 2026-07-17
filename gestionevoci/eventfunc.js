function refresh() {
    $('#Esistenti').html('<tr><th>Voce</th><th>Descrizione</th></tr>');
    var elenco = $.getJSON(server + 'secure/voci/elenco');
    
    elenco.done(function(response) {
        for (i = 0; i < response.length; i++) {
            if(response[i].tipo=='V'){
                $('#Esistenti').append('<tr style="cursor: pointer; cursor: hand;" onclick="mostra('+response[i].id+')"><td>'+ response[i].voce +'</td><td>'+ response[i].descrizione +'</td><td></td></tr>');                    		
            }
        }
        Waves.attach('.btn',['waves-float','waves-block']);
        Waves.init();
    })
}
function aggiungi(){
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
    idVoce = null;

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
    idVoce = id;
    $('input, select').prop('disabled',true);
    $('textarea').prop('disabled',true);
    $('#modifica').show();

    $('#inserisci').hide();

    var getVoce = $.getJSON(server + 'secure/voci/leggi', {
        id : idVoce
    });

    getVoce.done(function(response) {
        $('#voce').val(response.voce);
        $('#descrizione').val(response.descrizione);
        $('#elimina').show();    	
        $('#inserisci').removeClass('disabled');
    });
}
function modifica() {
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
    $('#voce').attr("disabled", true);
    resetSchedaicon();
    $('#scheda-icon').addClass("fa fa-edit");


    $('html, body').animate({
        scrollTop : 0
    }, 'fast');


    $('#boxregistrati').block({message: null});


}
function elimina() {
    swal({
        title : "Attenzione!",
        text : "L'elemento sarà eliminato definitivamente.",
        type : 'warning',
        confirmButtonText : "Elimina",
        cancelButtonText : "Annulla",
        showCancelButton : true,
        closeOnConfirm : false,
        showLoaderOnConfirm : true,
    }, function() {
        var elimina = $.get(server + 'secure/voci/cancella?id='+idVoce);
        
        elimina.success(function() {
            if (!errore) {
                swal("Eliminata", "", "success");
                annullamodifica();
                refresh();
            }
            errore = false;
        });
            elimina.error(function(){
            swal("Attenzione", "non è possibile eliminare questo elemento", "error");
            annullamodifica();
                refresh();
                errore = false;
        });
    });          
}
$('#inserisci').on('click', function(e) {
    if (!idVoce) {

        var datiIns = { 
            tipo: 'V',
            voce : $('#voce').val(),
            descrizione : $('#descrizione').val(),
            
        }

        var inserisci = $.post(server + 'secure/voci/inserisci',JSON.stringify(datiIns));
            
            
        inserisci.success(function() {
        
            if (!errore) {
                swal("Inserita", "", "success");
                annullamodifica();
                refresh();
                
            }
            errore = false;
        });
        inserisci.error(function(){
        
            swal("già esistente", "", "error");
            annullamodifica();
            errore = false;
            refresh();
        });
    } else {
        
                
        var dati = {  
            id: idVoce,
            tipo: 'V',
            voce : $('#voce').val(),
            descrizione : $('#descrizione').val(),
            
        }
        
        var modifica = $.post(server + 'secure/voci/modifica',JSON.stringify(dati));

        modifica.success(function() {
            errore = false;
            if (!errore) {
                swal("aggiornato", "", "success");
                annullamodifica();
                refresh();
            }
            
            $('#descrizione').removeClass("bg-yellow") ;
        });
    }
    
    resetSchedaicon();
    $('#scheda-icon').addClass("fa fa-eye") ;
});
$('#voce, #descrizione').bind('keyup change ifChanged', function() {
    if (idVoce!="" && $('#voce').val().trim()  != "" && $('#descrizione').val().trim()  != "")
        $('#inserisci').removeClass('disabled');
    else
        $('#inserisci').addClass('disabled');
});