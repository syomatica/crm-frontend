filtri = false;
var i = 0;
pagina = 0;
fine = false;
var x=0;
var elencoPipelineTp;
var xx=true;
var elenco;
function resetFiltri(){
    
    filtri = false;
    pagina = 0;
    fine=true;
    $('#filtroAddetto,#filtroCliente,#filtroImpianto,#filtroTipo,#filtroScaduto').val(null).trigger('change');
    $('#elencoPipelineQ').html('<tr><th>Quadrim.</th><th>%V</th><th>Imponibile %V</th><th>Imponibile</th><th>Costo Tot</th><th>% M</th></tr>');
    $('#elencoPipelineA').html('<tr><th>Addetto</th><th>%V</th><th>Imponibile %V</th><th>Imponibile</th><th>Costo Tot</th><th>% M</th></tr>');
    $('#elencoPipelineTp').html('<tr style="text-align:center"><th>ID Preventivo</th><th>Codice</th><th>Descrizione</th><th>Data</th><th>Società</th><th>Scaduto</th><th>Data Scadenza</th><th>Termine Consegna Prev.</th><th>Q Stima Chiusura Contratto</th><th> % Vendita</th><th>% Completamento</th><th>Priorita</th><th>Ore Stimate</th><th>Imponibile Pesato</th><th>Imponibile</th><th>Costo Tot</th><th>M%</th><th>Addetto</th></tr>');
    applicaFiltri();
}
function applicaFiltri(){
  $('#elencoPipelineTp').html('<tr style="text-align:center"><th>ID Preventivo</th><th>Codice</th><th>Descrizione</th><th>Data</th><th>Società</th><th>Scaduto</th><th>Data Scadenza</th><th>Termine Consegna Prev.</th><th>Q Stima Chiusura Contratto</th><th> % Vendita</th><th>% Completamento</th><th>Priorita</th><th>Ore Stimate</th><th>Imponibile Pesato</th><th>Imponibile</th><th>Costo Tot</th><th>M%</th><th>Addetto</th></tr>');
    x++;
    filtri = true;
    elenco="";
    fine=false;
    pagina = 0; 
    refreshPipeline($('#filtroAddetto').val(),$('#filtroCliente').val(),$('#filtroImpianto').val(),$('#filtroTipo').val(),$('#filtroScaduto').val());
}



function refreshPipeline(filtroAddetto,filtroCliente,filtroImpianto,filtroTipo,filtroScaduto){
    $('#countPagina').text(pagina);
    if(pagina==0){
        $('#tastoPrecedente').hide(); 
    }else{
        $('#tastoPrecedente').show();
    }
    if(filtri){
        var data = {
            pagina: pagina,
            idAddetto1: filtroAddetto,
            numero: filtroImpianto,
            idTipoPreventivo: filtroTipo,
            idClifo: filtroCliente,
            filtroScaduto :filtroScaduto
        };

        if(!data.idAddetto1)
            delete data.idAddetto1;
        if(!data.numero)
            delete data.numero;
        if(!data.idTipoPreventivo)
            delete data.idTipoPreventivo;
        if(!data.idClifo)
            delete data.idClifo;
        if(data.morto=='tutti'||!data.morto)
            delete data.morto;
      
        if(!fine){
            var elencoPipelineQ = $.post(server + 'secure/preventivi/db/filters/elenco', JSON.stringify(data));
            //var elencoPipelineQ = $.post(server+'secure/pipeline/filters/elenco?pagina='+pagina,JSON.stringify(data));
            var elencoPipelineA = $.post(server+'secure/pipeline/filters/elencoA?pagina='+pagina,JSON.stringify(data));
                elencoPipelineTp = $.post(server+'secure/pipeline/filters/elencoTp?pagina='+pagina,JSON.stringify(data));
            xx=true;
            
        }else{
            elencoPipelineTp = $.post(server+'secure/pipeline/filters/elencoTp?pagina='+pagina,JSON.stringify(data));
            //elencoPipelineTp = $.getJSON(server+'secure/pipeline/elenco?pagina='+pagina,JSON.stringify(data));
            xx = false;
        }

    }
    if(xx){
        elencoPipelineQ.success(function(response){
            if(response[0].m){
                if(response.length<100)
                    fine=true;
                    
                $('#elencoPipelineQ').html('<tr><th>Quadrim.</th><th>%V</th><th>Imponibile %V</th><th>Imponibile</th><th>Costo Tot</th><th>% M</th></tr>');
                var elenco;
                var gQm = new Array();
                var gQ = new Array();
                var gV = new Array();
                var gI = new Array();
                var gIm = new Array();
                var gM = new Array();
                var gT = new Array();
                var gTm = new Array();
                var elencoLength = response.length;
                for(i=0;i<elencoLength;i++){
                    var qNotNull;
                    if (response[i].q==null || response[i].q==undefined){
                        qNotNull="";
                    }else{
                        
                        qNotNull=response[i].q;
                        gQm[i]=response[i].q;
                        
                        console.log(gQm[i]);
                    }
                    elenco+='<tr><td>'+qNotNull+'</td><td>'+response[i].v+'%'+'</td><td>'+number_format(response[i].imponibileV)+' €'+'</td><td>'+number_format(response[i].imponibile)+' €'+'</td><td>'+number_format(response[i].costoTot)+' €'+'</td><td>'+number_format(response[i].m)+'%'+'</td></tr>';
                    
                    gQ[i] = qNotNull;
                    gV[i] = response[i].v;
                    gI[i] = parseInt(response[i].imponibile);
                    gM[i] = response[i].m;
                    gT[i] = parseInt(response[i].costoTot);
                    
                }
                var elencoDOM = $('#elencoPipelineQ');
                var padreDOM = elencoDOM.parent();
                elencoDOM.detach();
                elencoDOM.append(elenco);
                padreDOM.append(elencoDOM);

                var ctx = document.getElementById("myChart").getContext("2d");
                var data = {
                    labels: gQ,
                    datasets: [
                        {
                            label: "My First dataset",
                            fillColor: "rgba(0,192,239,0.2)",
                            strokeColor: "rgba(0,192,239,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: gV
                        },
                        {
                            label: "My First dataset",
                            fillColor: "rgba(221,75,57,0.2)",
                            strokeColor: "rgba(221,75,57,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: gM
                        }
                    ]
                };
                var ctx2 = document.getElementById("myChart2").getContext("2d");
                var gQm2=[];
                var ii_=0;
                for(i_=1;i_<gQm.length;i_++){
                    //   console.log(gQm[i_]);
                    if(gQm[i_]!=undefined && gQm[i_]!=null && gQm[i_]!="" ){
                        
                        gQm2[ii_]=gQm[i_];
                        gIm.push(parseInt(response[i_].imponibile));
                        gTm.push(parseInt(response[i_].costoTot));
                        
                        console.log(gQm2[ii_]+" "+gIm[i_]+" "+gTm[i_])
                        ii_++;
                    }
                }

                var data2 = {
                    labels: gQm2,
                    datasets: [
                        {
                            label: "My First dataset",
                            fillColor: "rgba(0,192,239,0.2)",
                            strokeColor: "rgba(0,192,239,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: gIm
                        },
                        {
                            label: "My First dataset",
                            fillColor: "rgba(221,75,57,0.2)",
                            strokeColor: "rgba(221,75,57,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: gTm
                        }
                    ]
                };
                var options2 = {
                    animation: false,
                    responsive: true,
                        
                };
                var options = {
                    animation: false,
                    responsive: true,
                };
                var myLineChart = new Chart(ctx).Line(data, options);
                var myLineChart2 = new Chart(ctx2).Line(data2, {scaleLabel:function(label){return  ' €' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}});
                if(gQm2.length==0){
                    $('#box_grafici').text('NESSUN RISULTATO PER QUADRIMESTRE');
                }
                if(x>0){
                    myLineChart.destroy();
                    myLineChart2.destroy();
                }

                
            }else{
                $('#elencoPipelineQ').html('<h3 class="box-title" style="margin-bottom: 20px;"><center>NESSUN RISULTATO</center></h3>')
            }
        });

        elencoPipelineA.success(function(response){
            if(response[0].m){
                if(response.length<100)
                    fine=true;
                
                $('#elencoPipelineA').html('<tr><th>Addetto</th><th>%V</th><th>Imponibile %V</th><th>Imponibile</th><th>Costo Tot</th><th>% M</th></tr>');
                var elenco;
                var elencoLength = response.length;
                for(i=0;i<elencoLength;i++)
                    elenco+='<tr><td>'+response[i].addetto+'</td><td>'+response[i].v+'%'+'</td><td>'+number_format(response[i].imponibileV)+' €'+'</td><td>'+number_format(response[i].imponibile)+' €'+'</td><td>'+number_format(response[i].costoTot)+' €'+'</td><td>'+number_format(response[i].m)+'%'+'</td></tr>';     
                var elencoDOM = $('#elencoPipelineA');
                var padreDOM = elencoDOM.parent();
                elencoDOM.detach();
                elencoDOM.append(elenco);
                padreDOM.append(elencoDOM);
            }else{
                $('#elencoPipelineA').html('<h3 class="box-title" style="margin-bottom: 20px;"><center>NESSUN RISULTATO</center></h3>')
            }
        });
    
    }
    elencoPipelineTp.success(function(response){
        if(response[0].idPreventivo){
            if(response.length<100)
                fine=true;
               
            $('#elencoPipelineTp').html('<tr style="text-align:center" ><th>ID Preventivo</th><th>Codice</th><th>Descrizione</th><th>Data</th><th>Società</th><th>Scaduto</th><th>Data Scadenza</th><th>Termine Consegna Prev.</th><th>Q Stima Chiusura Contratto</th><th> % Vendita</th><th>% Completamento</th><th>Priorita</th><th>Ore Stimate</th><th>Imponibile Pesato</th><th>Imponibile</th><th>Costo Tot</th><th>M%</th><th>Addetto</th></tr>');
            $('#tastoSuccessivo').show();
            var elenco;
            var elencoLength = response.length;
            for(i=0;i<elencoLength;i++){
                var datam =response[i].dataMorte;
                    if(datam==null){datam=""};
                var dataif =response[i].dataIpotesiFatturazione;
                    if(dataif==null){dataif=""};
                var dataiv =response[i].dataIpotesiVendita;
                    if(dataiv==null){dataiv=""};
                var scad =response[i].morto;
                    if(scad==true){scad="Si"}else{scad="No"};
            elenco+='<tr style="text-align:center" ><td>'+response[i].idPreventivo+'</td><td>'+response[i].code+'</td><td style="min-width:400px">'+response[i].descrizione+'</td><td width="10%">'+moment(response[i].data).format('lll')+'</td><td style="min-width:200px">'+response[i].societa+'</td><td>'+scad+'</td><td>'+datam+'</td><td>'+dataif+'</td><td>'+dataiv+'</td><td>'+response[i].percentualeSuccesso+'</td><td>'+response[i].percentualeCompletamento+'</td><td>'+response[i].priority+'</td><td>'+response[i].oreStimate+'</td><td>'+number_format(response[i].imponibilePesato)+'</td><td>'+number_format(response[i].imponibile)+' €'+'</td><td min-width="30px">'+number_format(response[i].costoTot)+' €'+'</td><td>'+number_format(response[i].m)+'%'+'</td><td>'+response[i].addetto+'</td></tr>'; 
            }    
            var elencoDOM = $('#elencoPipelineTp');
            var padreDOM = elencoDOM.parent();
            elencoDOM.detach();
            elencoDOM.append(elenco);
            padreDOM.append(elencoDOM);
        }else{
            $('#elencoPipelineTp').html('<h3 class="box-title" style="margin-bottom: 20px;"><center>NESSUN RISULTATO</center></h3>');
            $('#tastoSuccessivo').hide();
        }
    });



}  

  
var start=false;
/*   $(window).scroll(function () {
if ($(window).scrollTop() == $(document).height() - $(window).height()&&start&&$('.elencoPipelineTp').css("position")!='absolute') 
    avanti();
    start=true;
    
}); */

function avanti(){

          
    pagina++;
    filtri=true;
    
   refreshPipeline($('#filtroAddetto').val(),$('#filtroCliente').val(),$('#filtroImpianto').val(),$('#filtroTipo').val(),$('#filtroScaduto').val());
}  
function indietro(){

          
    pagina--;
    filtri=true;
    
   refreshPipeline($('#filtroAddetto').val(),$('#filtroCliente').val(),$('#filtroImpianto').val(),$('#filtroTipo').val(),$('#filtroScaduto').val());
}  
       
 function number_format(numero, decimali, dec_separatore, mig_separatore){

    // Elimino i caratteri che non sono numeri (lascio il segno meno e il punto)

 //  numero = (numero).replace(/[^0-9\.\-]?/gi,"");
     
    // Controllo se valore numerico

    var n = 0;

    if(isFinite(+numero)){

        n=numero;

    }

    // Controllo se i decimali sono accettabili

    var precisione = 0;

    if(isFinite(+decimali) && decimali>-1){

        precisione = decimali;

    }

    // Recupero caratteri separatori

    var separatore = '.';

    if(typeof mig_separatore != 'undefined'){

        separatore = mig_separatore;

    }

    var dec = ',';

    if(typeof dec_separatore != 'undefined'){

        var dec = dec_separatore;     

    }

     

    // Arrotondo il valore se necessario - Utilizzo funzione toFixedFix

    var s = '';

    if(precisione!=0){

        s = toFixedFix(n, precisione);    

    }else{

        s = '' + Math.round(n);

    }

    // Taglio il valore in parte intera e parte decimale

    s = s.split('.');

    // Aggiungo il separatore delle migliaia - ogni 3 numeri sulla parte intera

    if (s[0].length > 3) {        

        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, separatore);

    }

    // Formatto la parte decimale - aggiungo degli 0 se necessari

    if ((s[1] || '').length < precisione) {

        s[1] = s[1] || '';

        s[1] += new Array(precisione - s[1].length + 1).join('0');    

    }

    // Aggiungo parte decimale a parte intera - separati da separatore decimali

    return s.join(dec);

}

function toFixedFix(n, precisione) {

    // Funzione per arrotondare valore

    var k = Math.pow(10, precisione);            

    return '' + Math.round(n * k) / k;

}

 



