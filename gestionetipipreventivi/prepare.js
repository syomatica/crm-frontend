var tipo = sessionStorage.getItem('tipo');
var descrizione = sessionStorage.getItem('descrizione');
var idTipo = sessionStorage.getItem('idTipo');
$( document ).ready(function() {
   
   
    refresh();

    $('#pulisci').on('click', function() {
        $("#tipoPreventivo, #descrizione").val(null);
        $('#descrizione').css("background-color", "");
        
        $('#inserisci').addClass('disabled');
        
    });

    var idTipo = null;
    
    $('#modifica, #elimina').hide();
    $('input, select').prop('disabled',true);
    $('textarea').prop('disabled',true);
  
});

