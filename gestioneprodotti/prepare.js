$( document ).ready(function() {

    moment.locale('it');
    
    $('#filtroCategoria').select2({
        placeholder: 'Categoria Merceologica'
    });

    $('#filtroFornitore').select2({
        placeholder: 'Fornitore'
    });

    $('#filtroSottocategoria').select2({
        placeholder: 'Tipo prodotto'
    });

    $('#filtroMarca').select2({
        placeholder: 'Marca'
    });

    $('#filtroUnitaMisura').select2({
        placeholder: 'Unità di Misura'
    });

    $('#merce,#disattivo,#disponibile').iCheck({
        checkboxClass : 'icheckbox_flat-green',
    });

    $('#merce,#disattivo,#disponibile').iCheck('disable');
    
    $('#elencoDepliant').slimScroll({
        height: '200px'
    });
    
    var richiestaCategorie = $.getJSON(server+'secure/service/combocategorie');
    var richiestaSottoCategorie = $.getJSON(server+'secure/service/combosottocategorie');
    var richiestaMarche = $.getJSON(server+'secure/service/combomarche');
    var richiestaFornitori = $.getJSON(server+'secure/service/combofornitori');
    
    richiestaCategorie.success(function(response){
        for(i=0;i<response.length;i++)
            $('#filtroCategoria').append('<option value="'+response[i].id+'">'+response[i].categoria+': '+response[i].descrizione+'</option>');

    });

    richiestaSottoCategorie.success(function(response){
        for(i=0;i<response.length;i++)
            $('#filtroSottocategoria').append('<option value="'+response[i].id+'">'+response[i].sottoCategoria+': '+response[i].descrizione+'</option>');
    });

    richiestaMarche.success(function(response){
        for(i=0;i<response.length;i++)
            $('#filtroMarca').append('<option value="'+response[i].id+'">'+response[i].marca+': '+response[i].descrizione+'</option>');
    });

    richiestaFornitori.success(function(response){
        for(i=0;i<response.length;i++)
            $('#filtroFornitore').append('<option value="'+response[i].id+'">'+response[i].societa+'</option>');
    });
    
    refreshProdotti();

    Waves.attach('.btn', ['waves-float']);
    Waves.init();
    new WOW().init();
});
