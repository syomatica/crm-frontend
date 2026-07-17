
$( document ).ready(function() {
   
   
    refresh();

    $('#pulisci').on('click', function() {
        $("#voce, #descrizione").val(null);
        $('#descrizione').css("background-color", "");
        
        $('#inserisci').addClass('disabled');
        
    });

    var idVoce = null;
    
    $('#modifica, #elimina').hide();
    $('input, select').prop('disabled',true);
    $('textarea').prop('disabled',true);
  
});

