            function refresh() {
                 $('#fornitore').empty();
                $('#fornitore2').empty();
                $('#elencoF').html(' <tr><th>Fornitore</th><th>Giorni Ritardo</th></tr>');
               
                 var richiestaCombo = $.getJSON(server+'secure/analisifornitore/combofornitore');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //CAnale
                                var select;
                        
                                var length = r.length;
                                    select+='<option value=" "> </option>'
                               
                                    for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].id+'">'+r[i].id+' | '+r[i].fornitore+'</option>';
                                dati.fornitore = select;
                                $('#fornitore').append(dati.fornitore);
                                $('#fornitore2').append(dati.fornitore);        
                                }); 
                
               
                    Waves.attach('.btn',['waves-float','waves-block']);
                    Waves.init();
                
                  var richiestaTot = $.getJSON(server+'secure/analisifornitore/giorniritardo');
                    richiestaTot.success(function(r) {
                        $('#gr2').empty(); 
                        $('#gr2').append(parseInt(r.avgPGiorniRitardo));
                    }); 
                
                
                var richiestaTotart = $.getJSON(server+'secure/analisifornitore/giorniritardoart');
                   
                richiestaTotart.success(function(e) {
                        $('#gr3').empty(); 
                        $('#gr3').append(e.avgPGiorniRitardoTot);
                    });
                var richiestaTotartPerFor = $.getJSON(server+'secure/analisifornitore/giorniritardoartperfor');
                   
                richiestaTotartPerFor.success(function(c) {
                        $('#gr5').empty(); 
                        $('#gr5').append(c.avgPGiorniRitardoTot);
                    });
                var richiestaTotartPerArt = $.getJSON(server+'secure/analisifornitore/giorniritardoartperart');
                   
                richiestaTotartPerArt.success(function(d) {
                        $('#gr6').empty(); 
                        $('#gr6').append(d.avgPGiorniRitardoTot);
                    }); 
              
            }
                               
                                 $('#fornitore').select2().on("change", function(e) {
                                    
                                     
                        var visualizzaAnalisi = $.getJSON(server + 'secure/analisifornitore/leggi', {
                	id:$('#fornitore').val(),
                  
                        
                    
                });
                     
                       
                    visualizzaAnalisi.success(function(r) {
                       refresh();
                         $('#gr').empty(); 
                        if(r.avgPGiorniRitardo==null){
                            var gr = 0;
                        }else{
                            gr=r.avgPGiorniRitardo;
                        }
                                       
                                          
                                         $('#gr').append(gr);  
                                            
                                     
                                     
                                            
                                            
                        }); 
                                     
                                 });
                     $('#fornitore2').select2().on("change", function(e) {
                                
                                     
                            var visualizzaAnalisi2 = $.getJSON(server + 'secure/analisifornitore/leggi2', {
                	           id:$('#fornitore2').val(),
                  
                        
                    
                                    });
                     
                       
                    visualizzaAnalisi2.success(function(r) {
                       refresh();
                         $('#gr4').empty(); 
                        if(r.avgGiorniRitardo==null){
                            var gr = 0;
                        }else{
                            gr=r.avgGiorniRitardo;
                        }
                                       
                                          
                                         $('#gr4').append(gr);  
                                            
                                     
                                     
                                            
                                            
                        }); 
                                     
                                 });

        
                     
                         
             
    
          