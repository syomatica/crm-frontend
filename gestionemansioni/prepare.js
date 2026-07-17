var Mansione = sessionStorage.getItem('Mansione');
var descrizione = sessionStorage.getItem('descrizione');
var idMansione = sessionStorage.getItem('idMansione');
$( document ).ready(function() {
   
   
    refresh();

    $('#pulisci').on('click', function() {
        $("#tipoMansione, #descrizione").val(null);
        $('#descrizione').css("background-color", "");
        
        $('#inserisci').addClass('disabled');
        
    });

    var idTipo = null;
    
    $('#modifica, #elimina').hide();
    $('input, select').prop('disabled',true);
    $('textarea').prop('disabled',true);
  
});

