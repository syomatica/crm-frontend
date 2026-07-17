var tabFornitori;
$(document).ready(function() {

    moment.locale('it');

    refreshClifo();

    Waves.attach('.btn', ['waves-float']);
    Waves.init();
    new WOW().init();

    tabFornitori = $('#tabFornitori').DataTable({
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
    $('#tabFornitori tbody').on('click', 'tr', function (evt) {
    	var cell=$(evt.target).closest('td').index();
        if(cell>0){
			dettagliClifo(tabFornitori.cell(this,4).data());
        }
    } );

});
