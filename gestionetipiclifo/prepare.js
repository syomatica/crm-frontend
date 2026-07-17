var tipoCliFo = sessionStorage.getItem('tipoCliFo');
var descrizione = sessionStorage.getItem('descrizione');
var idTipoCliFo = sessionStorage.getItem('idTipoCliFo');
$( document ).ready(function() {
   
   
    refresh();

    $('#pulisci').on('click', function() {
        $("#tipoCliFo, #descrizione").val(null);
        $('#descrizione').css("background-color", "");
        
        $('#inserisci').addClass('disabled');
        
    });

    var idTipo = null;
    
    $('#modifica, #elimina').hide();
    $('input, select').prop('disabled',true);
    $('textarea').prop('disabled',true);
  
});

