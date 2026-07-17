var idutente;
function aggiungiutente(){

    annullamodifica();
    $('#form').addClass('animated pulse');
    $('#boxregistrati').block({message: null});
    $('#inserimentoMode').removeClass('hidden');
    $('input, select').prop('disabled',false);
    
    $('#addetto').html('<option value="0" selected>Account non collegato a un Addetto</option>');
    
    var accountLiberi = $.getJSON(server + 'secure/addetti/addettiliberi');
    accountLiberi.success(function(response) {

        for (i = 0; i < response.length; i++)
            $('#addetto').append('<option value="' + response[i].idAddetto + '">' + response[i].addetto + '</option>');
    });
}

function eliminautente() {
    swal({
        title : "Attenzione!",
        text : "Eliminazione solo per credenziali di accesso. L'addetto collegato non sarà eliminato.",
        type : 'warning',
        confirmButtonText : "Elimina",
        cancelButtonText : "Annulla",
        showCancelButton : true,
        closeOnConfirm : true,
        showLoaderOnConfirm : true,
    }, function() {
        var eliminaUtente = $.get(server + 'secure/utenti/cancella?idUtente='+idutente);

        eliminaUtente.success(function () {
            noty({
                text: 'Utente eliminato con successo',
                layout: 'topCenter',
                type: 'success',
                killer: true,
                timeout: 2000,
                animation: {
                    open: 'animated bounceInDown',
                    close: 'animated bounceOutUp',
                    speed: 500
                }
            });
            refresh();

        });
        eliminaUtente.error(function () {
            noty({
                text: 'Errore generico',
                layout: 'topCenter',
                type: 'error',
                killer: true,
                timeout: 2000,
                animation: {
                    open: 'animated bounceInDown',
                    close: 'animated bounceOutUp',
                    speed: 500
                }
            });
        });
    });
}

function mostra(id){
    tipoUtente = 0;
    idutente = id;
    $('input, select').prop('disabled',true);
    $('#modifica, #elimina').show();

    $('#inserisci').hide();

    var getUtente = $.getJSON(server + 'secure/utenti/leggi', {
        idUtente : id
    });
    getUtente.success(function (responseString) {
        if (responseString.enabled) {
            $('#attivo').iCheck('check');
        } else {
            $('#attivo').iCheck('uncheck');
        }

        $('#username').val(responseString.username);

        if (responseString.sso) {
            $('#auth-dominio').iCheck('check');
        } else {
            $('#auth-password').iCheck('check');
        }

        if (responseString.administrator) {
            $('#amministratore').iCheck('check');
        } else {
            $('#amministratore').iCheck('uncheck')
        }

        if (responseString.dirigente) {
            $('#dirigente').iCheck('check');
        } else {
            $('#dirigente').iCheck('uncheck');
        }
        
        if (responseString.dipendente) {
            $('#dipendente').iCheck('check');
        } else {
            $('#dipendente').iCheck('uncheck');
        }
    });

    /* getUtente.done(function(response) {
        $('#username').val(response.username);
        $('#addetto').html('<option value="' + response.idAddetto + '" selected>' + response.addetto + '</option>');
        response.administrator ? $('#amministratore').iCheck('check') : $('#amministratore').iCheck('uncheck');
        response.dipendente ? $('#dipendente').iCheck('check') : $('#dipendente').iCheck('uncheck');
        response.dirigente ? $('#dirigente').iCheck('check') : $('#dirigente').iCheck('uncheck');
        response.domain ? $('#auth-dominio').iCheck('check') : $('#auth-password').iCheck('check'); 
        if(response.domain){
            $('#grou-password').hide();
        }else{
            $('#grou-password').show();
            $('#password').val("***");
        }
        response.enabled ? $('#attivo').iCheck('check') : $('#attivo').iCheck('uncheck');
        $('#inserisci').removeClass('disabled');
    }); */
    getUtente.fail(function(jqXHR, textStatus, errorThrown) {
        console.error("❌ Errore AJAX:", textStatus, errorThrown);
        console.error("Risposta server:", jqXHR.responseText);
    });
}

function mostraAddetto(idAddetto){

    tipoUtente = 1;
    idutente = idAddetto;
    $('input, select').prop('disabled',true);
    $('#modifica').show();

    $('#inserisci').hide();

    var getAddetto = $.getJSON(server + 'secure/addetti/leggi', {
        idAddetto : idAddetto
    });

    getAddetto.done(function(response) {
        $('#username').val(response.account);
        $('#addetto').html('<option value="' + idAddetto + '" selected>' + response.addetto + '</option>');
        $('#auth-dominio').iCheck('check');
        $('#password').val("");
        
        $('#amministratore').iCheck('uncheck');
        $('#dipendente').iCheck('uncheck');
        $('#dirigente').iCheck('uncheck');
        
        $('#attivo').iCheck('uncheck');
        
        $('#inserisci').removeClass('disabled');
    });
}


function modificautente() {
    $('#formtitolo').text('Modifica utente');
    $('#modificaMode').removeClass('hidden');
    $('#form').removeClass('box-default');
    $('#form').addClass('box-danger animated pulse');
    $('#inserisci').text('Salva modifiche');
    $('#inserisci').show();
    $('#inserisci').removeClass('disabled').prop('disabled', false);
    $('input, select').prop('disabled',false);
    //$('#username').prop('disabled',true);
    $('#modifica,#elimina').hide();
    $('html, body').animate({
        scrollTop : 0
    }, 'fast');

    //disabilito click lista

    $('#boxregistrati').block({message: null});
}

function annullamodifica() {
    idutente = null;

    $('#formtitolo').text('Dettagli');
    $('#modificaMode').addClass('hidden');
    $('#inserimentoMode').addClass('hidden');
    $('#form').removeClass('box-danger animated pulse');
    $('#form').addClass('box-success');
    $('#inserisci').text('Salva');
    $('#inserisci').show();
    $('#inserisci').addClass('disabled');
    $('input, select').prop('disabled',true);
    $('#modifica,#elimina').hide();
                    $('#labelAddetto').show();
                    $('#addetto').show();
    $('#pulisci').click();
    $('#boxregistrati').unblock({message: null});

}

$('#inserisci').on('click', function(e) {
    var err = false;
    var _admin = $('#amministratore').is(":checked");
    var _manager = $('#dirigente').is(":checked");
    var _user = $('#dipendente').is(":checked");
    var _authD = $('#auth-dominio').is(":checked");
    var _authP = $('#auth-password').is(":checked");
    var _password = $('#password').val(); 
    if(_authD){
        _password="";
    }
    if(!(_admin || _manager || _user)){
        err=true;
        noty({
            text : '<b>Attenzione!</b><br>Selezionare almeno un ruolo',
            type : 'warning',
            layout : 'topCenter',
            timeout : 3000,
            animation : {
                open : 'animated flipInX',
                close : 'animated flipOutX',
                easing : 'swing',
                speed : 500
            }
        });
    }else{
        if(_authP && _password.trim().localeCompare("")==0){
            err=true;
            noty({
                text : '<b>Attenzione!</b><br>Digitare la password di accesso',
                type : 'warning',
                layout : 'topCenter',
                timeout : 3000,
                animation : {
                    open : 'animated flipInX',
                    close : 'animated flipOutX',
                    easing : 'swing',
                    speed : 500
                }
            });
        }
    }

    if(!err){
        if (!idutente) {

            var dati = {
                    username : $('#username').val(),
                    password : _password,
                    //idAddetto : $('#addetto').val(),
                    idAddetto : 0,
                    administrator: _admin,
                    dirigente: _manager,
                    dipendente: _user,
                    enabled : $('#attivo').is(":checked")
            }


            var inserisciUtente = $.post(server + 'secure/utenti/inserisci',JSON.stringify(dati));

            inserisciUtente.done(function() {
                if (!errore) {
                    swal("Inserito", "", "success");
                    annullamodifica();
                                                    refresh();
                }
                errore = false;
            });
        } else {
            var dati = {
                idUtente: idutente,
                username : $('#username').val(),
                password : _password,
                //idAddetto : $('#addetto').val(),
                idAddetto : 0,
                administrator: _admin,
                dirigente: _manager,
                dipendente: _user,
                tipoUtente: tipoUtente,
                enabled : $('#attivo').is(":checked"),
                sso: $('#auth-dominio').is(":checked")
            }

                
            var modificaUtente = $.post(server + 'secure/utenti/modifica',JSON.stringify(dati));

            modificaUtente.done(function() {
                if (!errore) {
                    swal("Operazione Eseguita Correttamente", "", "success");
                    annullamodifica();
                    refresh();
                }
                errore = false;
            });
        }
    }
});

$('#username ').bind('keyup change ifChanged', function() {
    if (!idutente && $('#username').val() != "" )
        $('#inserisci').removeClass('disabled');
    else if (idutente && $('#username').val() != "")
        $('#inserisci').removeClass('disabled');
    else
        $('#inserisci').addClass('disabled');
});

$('#auth-dominio').on("ifChanged", function() {
    $('#group-password').hide();
});
$('#auth-password').on('ifChanged', function() {
    $('#group-password').show();
});

function refresh() {
    $('#attivo').iCheck('uncheck');
    $('#username').val("");
    $('#password').val("");
    $('#amministratore').iCheck('uncheck');
    $('#dirigente').iCheck('uncheck');
    $('#dipendente').iCheck('uncheck');


    $('#utentiregistrati').html('<tr><th style="text-align: left;">Username</th><th style="text-align: left;">Addetto</th><th style="text-align: left;">Profilo</th></tr>');
    var elencoUtenti = $.getJSON(server + 'secure/utenti/elenco');

    elencoUtenti.done(function(response) {
            for (i = 0; i < response.length; i++) {
                var rigaTabella="";
                var terzaColonna="";
                if(response[i].enabled){
                    terzaColonna +='<small class="label label-success">ATTIVO</small>';
                }
                if(!response[i].enabled){
                    terzaColonna +='<small class="label label-danger">BLOCCATO</small>';
                }
                if(response[i].administrator){
                    terzaColonna +='<small style="margin-left: 5px" class="label bg-orange-active">Admin</small>';
                }
                if(response[i].dirigente){
                    terzaColonna +='<small style="margin-left: 5px" class="label bg-orange-active">Manager</small>';
                }
                if(response[i].dipendente){
                    terzaColonna +='<small style="margin-left: 5px" class="label bg-orange-active">User</small>';
                }

                rigaTabella = '<tr style="cursor: pointer; cursor: hand;" onclick="mostra('+response[i].idUtente+')">';
                rigaTabella += "<td>" + response[i].username + "</td>";    // <--- prima colonna
                rigaTabella += "<td>"+response[i].name+"</td>";     // <---- seconda colonna
                rigaTabella += "<td>" + terzaColonna + "</td>",   // <-- terza colonna
                rigaTabella += "</tr>";                // <-- fine riga


                    $("#utentiregistrati").append(rigaTabella);

            }
            
            //addetti senza accesso
            /*
            var elencoAddetti = $.getJSON(server + 'secure/addetti/elenconoaccesso');

            elencoAddetti.done(function(response) {
                    if(response && response.length>0){
                        var addH = "<div class='box-header'><i class='fa fa-users'></i><h3 class='box-title'>Addetti senza Accesso</h3></div>";
                        $("#utentiregistrati").append("<tr><td colspan='3'>"+addH+"</td></tr>");
                    }
                    for (i = 0; i < response.length; i++) {
                        var rigaTabella="";
                        var terzaColonna="";
                        terzaColonna +='<small class="label label-danger">BLOCCATO</small>';

                        rigaTabella = '<tr style="cursor: pointer; cursor: hand;" onclick="mostraAddetto('+response[i].idAddetto+')">';
                        rigaTabella += "<td>" + response[i].account + "</td>";    // <--- prima colonna
                        rigaTabella += "<td>"+response[i].addetto+"</td>";     // <---- seconda colonna
                        rigaTabella += "<td>" + terzaColonna + "</td>",   // <-- terza colonna
                        rigaTabella += "</tr>";                // <-- fine riga


                            $("#utentiregistrati").append(rigaTabella);

                    }
                    
                    Waves.attach('.btn',['waves-float','waves-block']);
                    Waves.init();
            });
            */
            
    });
        
        
}
    
