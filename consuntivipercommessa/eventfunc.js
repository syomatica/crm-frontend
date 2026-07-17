 var pagina=0;
        function refresh() {
               
                $('#consuntivicommesse').html('<tr class="wow fadeInUp"><th>Num Ordine Cliente</th><th>Descrizione Commessa</th><th>Cliente</th><th>Descrizione Articolo</th><th>Quantità</th><th>Valore Unitario</th><th>Sconto 1</th><th>Sconto 2</th><th>Fornitore</th><th>Num Ordine Fornitore</th><th>Data Ordine</th></tr>');
                var consuntivicommesse = $.getJSON(server + 'secure/consuntivicommesse/elenco?pagina='+pagina);
              
                consuntivicommesse.done(function(response) {
                    for (i = 0; i < response.length; i++) {
           
                       
                    		$('#consuntivicommesse').append('<tr class="wow fadeInUp" style="cursor: pointer; cursor: hand;"><td>'+ response[i].nOrdineCliente +'</td><td>'+ response[i].descrizioneCommessa +'</td><td min-width="50px">'+ response[i].cliente +'</td><td>'+ response[i].descrizioneArticolo +'</td><td>'+ response[i].qty +'</td><td>'+ response[i].unitValue+'</td><td>'+ response[i].discount1 +'</td><td>'+ response[i].discount2 +'</td><td>'+ response[i].fornitore +'</td><td>'+ response[i].nOrdineFornitore +'</td><td>'+ response[i].orderDate +'</td></td><td></td></tr>');                    		
                    	
                    }
                    Waves.attach('.btn',['waves-float','waves-block']);
                    Waves.init();
                })
            }
var start=false;
$(window).scroll(function () {
    if ($(window).scrollTop() == $(document).height() - $(window).height()&&start&&$('.consuntivicommesse').css("position")!='absolute')
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