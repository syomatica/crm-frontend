$( document ).ready(function() {
  
		

    moment.locale('it'); 
    applicaFiltri();
    $('#filtroAddetto').select2({
        placeholder: 'Addetti'
    });
    $('#filtroCliente').select2({
        placeholder: 'Cliente/Contatto'
    });

    $('#filtroImpianto').select2({
        placeholder: 'Impianto'
    });

    $('#filtroTipo').select2({
        placeholder: 'Tipo'
    });
    $('#filtroScaduto').select2({
        placeholder: 'Scaduto'
    });
//Caricamento combo filtri
    var richiestaCombo = $.getJSON(server+'secure/pipeline/comboPipeline');

    richiestaCombo.success(function(r){
        var dati = {};

        //ADDETTI
        var select;
        var addetti = r.addetti;
        var length = addetti.length;
        for(i=0;i<length;i++)
            select+='<option value="'+addetti[i].idAddetto+'">'+addetti[i].addetto+'</option>';
        dati.addetti = select;
       
        //CLIENTI
        var select='';
        var clienti = r.clienti;
        var length = clienti.length;
        for(i=0;i<length;i++)
            select+='<option value="'+clienti[i].idCliente+'">'+clienti[i].societa+'</option>';
        dati.clienti = select;   
        
        //TIPI
        select='';
        var tipi = r.tipi;
        length = tipi.length;
        for(i=0;i<length;i++)
            select+='<option value="'+tipi[i].idTipo+'">'+tipi[i].tipoPreventivo+'</option>';
        dati.tipi = select;
        
        //IMPIANTI
        var filtroImpianto='';
        var impianto='';
        var nomeImpianto='';
        var impianti = r.impianti;
        length = impianti.length;
        for(i=0;i<length;i++){
            filtroImpianto+='<option value="'+impianti[i].idImpianto+'">'+impianti[i].numero+' | '+impianti[i].descrizione+'</option>';
            impianto+='<option value="'+impianti[i].numero+'">'+impianti[i].numero+'</option>';
            nomeImpianto+='<option value="'+impianti[i].numero+'">'+impianti[i].descrizione+'</option>';
        }
        dati.filtroImpianto = filtroImpianto;
        dati.impianto = impianto;
        dati.nomeImpianto = nomeImpianto;
        $('#filtroAddetto').append(dati.addetti);
        $('#filtroCliente').append(dati.clienti);
        $('#filtroImpianto').append(dati.filtroImpianto);
        $('#filtroTipo').append(dati.tipi);
        
   
    });
    
	});

  /*  $('#elencoPipelineTp').DataTable( {
        "scrollX": true
    } ); */

    
         Waves.attach('.btn', ['waves-float']);
         Waves.init();
         new WOW().init(); 
    $('#tastoPrecedente').hide();
