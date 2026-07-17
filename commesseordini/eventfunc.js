 var pagina=0;
        function refresh() {
               
                $('#commesseordini').html('<tr class="wow fadeInUp"><th>Num Ordine Cliente</th><th>Descrizione</th><th>Società</th><th>Data Creazione</th><th>Data Preventivata</th><th>Data Inizio</th><th>Data Prevista Consegna</th><th>Data Consegna</th><th>Prezzo</th><th>Costo Previsto</th><th>Codice Gruppo</th></tr>');
                var commesseordini = $.getJSON(server + 'secure/commesseordini/elenco?pagina='+pagina);
              
                commesseordini.done(function(response) {
                    for (i = 0; i < response.length; i++) {
                    	   var ordCli="";
                        var b=convertDate(response[i].dtaCreaz);
                        if(response[i].nOrdineCliente==null){
                            ordCli="";}else{ordCli=response[i].nOrdineCliente;}
                    		$('#commesseordini').append('<tr class="wow fadeInUp" style="cursor: pointer; cursor: hand;"><td>'+ ordCli +'</td><td>'+ response[i].description +'</td><td min-width="50px">'+ response[i].companyName +'</td><td>'+ convertDate(response[i].dtaCreaz) +'</td><td>'+ convertDate(response[i].dtaPrevIn) +'</td><td>'+ convertDate(response[i].dtaInizio) +'</td><td>'+ convertDate(response[i].dtaPrevCon) +'</td><td>'+ convertDate(response[i].dtaConsegna) +'</td><td>'+ response[i].price +'</td><td>'+ response[i].expectedCost +'</td><td>'+ response[i].groupCode +'</td></td><td></td></tr>');                    		
                    	
                    }
                    Waves.attach('.btn',['waves-float','waves-block']);
                    Waves.init();
                })
            }
var start=false;
$(window).scroll(function () {
    if ($(window).scrollTop() == $(document).height() - $(window).height()&&start&&$('.commesseordini').css("position")!='absolute')
        avanti();
    start=true;
});
function avanti(){
    pagina++;
   refresh();
}
function convertDate(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat);
  return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
}