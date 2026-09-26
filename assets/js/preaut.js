function eventMenu(){

    // CS-280 (PC-152): nasconde le voci di menu dei moduli disabilitati per il tenant corrente
    // (config backend crm.tenant.disabled-modules.<company>, es. Scadenzario su Schindler).
    (function(){
        function applyHide(csv){
            if(!csv) return;
            csv.split(',').forEach(function(m){
                m = (m||'').trim();
                if(m) $('#themenu a[href*="'+m+'"]').closest('li').hide();
            });
        }
        function fetchAndApply(){
            // PC-282: la variabile globale `server` e' definita da ../server.js, incluso in FONDO
            // alle pagine via document.write. Il callback di $.get("menu.mst") puo' scattare PRIMA
            // che server.js sia stato eseguito (su localhost quasi sempre, in prod a intermittenza):
            // in quel caso `server` e' undefined, la chiamata a /features saltava in silenzio e il
            // menu restava senza filtro. Rinviando a DOM ready tutti gli script sincroni della pagina
            // sono stati eseguiti e `server` esiste.
            $(function(){
                if (typeof server === 'undefined') return;
                $.get(server + 'secure/crm/features').done(function(r){
                    var list = (r && r.disabledModules) ? r.disabledModules.join(',') : '';
                    sessionStorage.setItem('disabledModules', list);
                    applyHide(list);
                });
            });
        }
        try {
            var dm = sessionStorage.getItem('disabledModules');
            if (dm) { applyHide(dm); }
            // cache assente o vuota ('' = lista vuota oppure risposta ottenuta senza tenant risolto):
            // si rilegge dal backend, la chiamata e' leggera e cosi' un '' anomalo non resta appiccicato.
            else { fetchAndApply(); }
        } catch(e){}
    })();

   
   
    var objs = $(".treeview a");

    $.each(objs, function(index, value) {
        if ($(objs[index]).attr("href").match("#")) {
            var a=objs[index];
            var b=this;
          
 var slide=true;
            var aa=0;
    var c=$(this),d=c.next();
           $(objs[index]).click (
              
               function(){
  
               
                    if(slide){
                        setTimeout(menuTendina,50);
                        function menuTendina() {
                        var e=c.parents("ul").first(),f=e.find("ul:visible");
                     
                            var g=c.parent("li");
                          d.slideDown("normal",function(){d.addClass("menu-open"),e.find("li.active").removeClass("active")});
                       slide=false;
                        aa=1;
                        }
                    }else{
                   
                        
                            d.slideUp("normal",function(){d.removeClass("menu-open")}),d.parent("li").removeClass("active");
                        
                        
                   slide=true;
                       
                        return;
                    }
                            
                    
                }
            );
        }
    });	
}



// PC-282: la progress bar (Pace + blockUI) e' opzionale. Le pagine che non la caricano
// (es. commessepme) devono comunque poter includere preaut.js per usare eventMenu(),
// altrimenti il filtro dei moduli disabilitati per tenant (CS-280) non viene applicato.
if (typeof Pace !== 'undefined' && typeof $.blockUI === 'function') {
    Pace.on('start', function(){
        $.blockUI({
            message: '<h1>Caricamento...</h1>',
            css: {
                border: 'none',
                padding: '15px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: .5,
                color: '#fff'
            } });
    });
    Pace.on('restart', function(){
        $.blockUI({
            message: '<h1>Caricamento...</h1>',
            css: {
                border: 'none',
                padding: '15px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: .5,
                color: '#fff'
            } });
    });
    Pace.on('done', function(){
        $.unblockUI();
    });
}



