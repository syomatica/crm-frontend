var unita = sessionStorage.getItem('unita');
var descrizione = sessionStorage.getItem('descrizione');
var idUm = sessionStorage.getItem('idUm');
var magoUM = sessionStorage.getItem('magoUM');
    
$( document ).ready(function() {

    refresh();

    $('#pulisci').on('click', function() {
        $("#unita, #descrizione, #nota").val(null);
        $('#descrizione').css("background-color", "");
        $('#mago').iCheck('uncheck');
        $('#magoDiv').html("<small id='magolabel' class='label bg-orange-active'> Mago </small>");
        $('#inserisci').addClass('disabled');
        $('#magoDiv').show() ;
    });

    var idCategoria = null;
    
    $('#modifica, #elimina').hide();
    $('input, select').prop('disabled',true);    
    $('textarea').prop('disabled',true);
    
});
