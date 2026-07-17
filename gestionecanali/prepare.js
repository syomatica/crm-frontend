var canale = sessionStorage.getItem('canale');

var idCanale = sessionStorage.getItem('idCanale');
$( document ).ready(function() {
   
   
    refresh();

    $('#pulisci').on('click', function() {
        $("#canale").val(null);
        
        
        $('#inserisci').addClass('disabled');
        
    });

    var idTipo = null;
    
    $('#modifica, #elimina').hide();
    $('input, select').prop('disabled',true);
    $('textarea').prop('disabled',true);
  
});

