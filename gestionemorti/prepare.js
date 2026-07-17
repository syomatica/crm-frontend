var causaMorte = sessionStorage.getItem('causaMorte');
var descrizione = sessionStorage.getItem('descrizione');
var idCausaMorte = sessionStorage.getItem('idCausaMorte');
$( document ).ready(function() {
   
   
    refresh();

    $('#pulisci').on('click', function() {
        $("#causaMorte, #descrizione").val(null);
        $('#descrizione').css("background-color", "");
        
        $('#inserisci').addClass('disabled');
        
    });

    var idTipo = null;
    
    $('#modifica, #elimina').hide();
    $('input, select').prop('disabled',true);
    $('textarea').prop('disabled',true);
  
});

