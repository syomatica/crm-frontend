var marca = sessionStorage.getItem('marca');
var descrizione = sessionStorage.getItem('descrizione');
var idMarca = sessionStorage.getItem('idMarca');
var magoCatOmo = sessionStorage.getItem('magoCatOmo');
    
$( document ).ready(function() {

    refresh();

    $('#pulisci').on('click', function() {
        $("#marca, #descrizione, #nota").val(null);
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
