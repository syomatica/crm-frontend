var categoria = sessionStorage.getItem('categoria');
var descrizione = sessionStorage.getItem('descrizione');
var idCategoria = sessionStorage.getItem('idCategoria');
var magoCategoria = sessionStorage.getItem('magoCategoria');
    
$( document ).ready(function() {

    refresh();

    $('#pulisci').on('click', function() {
        $("#categoria, #descrizione, #nota").val(null);
        $('#descrizione').css("background-color", "");
        $('#magoDiv').html("<small id='magolabel' class='label bg-orange-active'> Mago </small>");
        $('#inserisci').addClass('disabled');
        $('#magoDiv').show() ;
    });

    var idCategoria = null;
    
    $('#modifica, #elimina').hide();
    $('input, select').prop('disabled',true);
    $('textarea').prop('disabled',true);
    
    
});
