var tabClienti;
$(document).ready(function() {

    moment.locale('it');

    /* $('#filtroTipo').select2({
        placeholder: 'Tipo'
    });
    $('#filtroSocieta').select2({
        placeholder: 'Societa'
    });

    var richiesta = $.getJSON(server + 'secure/cliforapido/tipoClifo');
    var richiestaS = $.getJSON(server + 'secure/cliforapido/societa');

    richiesta.success(function(response) {


        for (i = 0; i < response.length; i++)
            $('#filtroTipo').append('<option value="' + response[i].id + '">' + response[i].tipoCliFo + '</option>');
    });
    richiestaS.success(function(response) {

        for (i = 0; i < response.length; i++)
            $('#filtroSocieta').append('<option value="' + response[i].id + '">' + response[i].societa + '</option>');
    }); */

    refreshClifo();

    Waves.attach('.btn', ['waves-float']);
    Waves.init();
    new WOW().init();

    tabClienti = $('#tabClienti').DataTable({
		"createdRow": function(row, data, dataIndex) {
				$(row).addClass("rowPointer");
			},
		"language": {url: 'https://cdn.datatables.net/plug-ins/1.10.12/i18n/Italian.json'},
		"scrollX": false,
        "columnDefs" : [{
			"searchable": false,
			"orderable": false, 
			"targets" : [4],
            "visible": false
		}],
        order: [[0, 'asc']]
	});
    $('#tabClienti tbody').on('click', 'tr', function (evt) {
    	var cell=$(evt.target).closest('td').index();
        if(cell>0){
			dettagliClifo(tabClienti.cell(this,4).data());
        }
    } );

});
