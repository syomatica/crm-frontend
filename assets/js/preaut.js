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
        try {
            var dm = sessionStorage.getItem('disabledModules');
            if (dm !== null) { applyHide(dm); }
            else if (typeof server !== 'undefined') {
                $.get(server + 'secure/crm/features').done(function(r){
                    var list = (r && r.disabledModules) ? r.disabledModules.join(',') : '';
                    sessionStorage.setItem('disabledModules', list);
                    applyHide(list);
                });
            }
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



