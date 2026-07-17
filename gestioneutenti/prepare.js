var isAdministrator = sessionStorage.getItem('isAdministrator');
var email = sessionStorage.getItem('email');
var ruolo = sessionStorage.getItem('ruolo');
var name = sessionStorage.getItem('name');
var idUtente = sessionStorage.getItem('idUtente');
var tipoUtente = 0;

$( document ).ready(function() {

    refresh();
    
    

    $('#amministratore, #attivo, #dirigente, #dipendente, #auth-dominio, #auth-password').iCheck({
        checkboxClass : 'icheckbox_flat-green',
        radioClass : 'iradio_flat-green'
    });

    $('#pulisci').on('click', function() {
        $("#username, #password1, #password2, #name, #email, #ruolo,#addetto").val(null);
        $('#amministratore').iCheck('uncheck');
        $('#dirigente').iCheck('uncheck');
        $('#dipendente').iCheck('uncheck');
        $('#attivo').iCheck('check');
        $('#inserisci').addClass('disabled');
    });

    var idutente = null;

    $('#modifica, #elimina').hide();
    $('input, select').prop('disabled',true);
    
    $('#group-password').hide();



});
