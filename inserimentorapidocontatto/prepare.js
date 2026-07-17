

$( document ).ready(function() {
   $('#tipo').select2({
       
       placeholder:"Seleziona il Tipo",
       allowClear: true,
       
   });
   $('#canale').select2({
       placeholder:"Seleziona il Canale",
       allowClear: true
   });
   $('#agente').select2({
       placeholder:"Seleziona l'Agente",
       allowClear: true
   });
    
   
    refresh();

   
    $('#pulisci').on('click', function() {
        $("#tipoMansione, #descrizione").val(null);
        $('#descrizione').css("background-color", "");
        
        
        
    });

   
    
    $('#modifica, #elimina').hide();
    $('input, select').prop('disabled',true);
    $('textarea').prop('disabled',true);
  
});

