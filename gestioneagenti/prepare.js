var agente = sessionStorage.getItem('agente');

var idAgente = sessionStorage.getItem('idAgente');
$( document ).ready(function() {
   
   
    refresh();

    $('#pulisci').on('click', function() {
        $("#agente, #descrizione, #nota").val(null);
        
        $('#magoDiv').html("<small id='magolabel' class='label bg-orange-active'> Mago </small>");
        $('#inserisci').addClass('disabled');
        $('#magoDiv').show() ;
    });

    var idCategoria = null;
    
    $('#modifica, #elimina').hide();
    $('input, select').prop('disabled',true);
    $('textarea').prop('disabled',true);
  
});

