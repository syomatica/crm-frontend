var isAdministrator = sessionStorage.getItem('isAdministrator');
var email = sessionStorage.getItem('email');
var ruolo = sessionStorage.getItem('ruolo');
var name = sessionStorage.getItem('name');
var idUtente = sessionStorage.getItem('idUtente');
    
$( document ).ready(function() {

    refresh();

    var mans = $.getJSON(server + 'secure/mansioni/elenco');
    
    mans.success(function(response) {

        for (i = 0; i < response.length; i++)
            $('#mansione').append('<option value="' + response[i].idMansione + '">' + response[i].mansione + '</option>');
    });

    refresh();
    $('#modifica, #elimina').hide();
    $('input, select').prop('disabled',true);    
    
    
});
