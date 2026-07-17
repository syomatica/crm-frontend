            function refresh() {
                $('#canale').empty();
                $('#agente').empty();
                $('#tipo').empty();
                 var richiestaCombo = $.getJSON(server+'/secure/configvalues/combocanali');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //CAnale
                                var select;
                        
                                var length = r.length;
                                    select+='<option value=" "> </option>'
                               
                                    for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].id+'">'+r[i].id+'|'+r[i].canale+'</option>';
                                dati.canale = select;
                                $('#canale').append(dati.canale);

                                }); 
                var richiestaCombo = $.getJSON(server+'/secure/configvalues/comboagente');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //agenti
                                var select;
                        
                                var length = r.length;
                                    select+='<option value=" "> </option>'
                                for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].id+'">'+r[i].id+'|'+r[i].agente+'</option>';
                                dati.descrizione = select;
                                $('#agente').append(dati.descrizione);

                                }); 
                 var richiestaCombo = $.getJSON(server+'/secure/configvalues/combotipiclifo');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //tipiclifo
                                var select;
                        
                                var length = r.length;
                                    select+='<option value=" "> </option>'
                                for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].id+'">'+r[i].id+'|'+r[i].tipoCliFo+'</option>';
                                dati.tipoCliFo = select;
                                $('#tipo').append(dati.tipoCliFo);

                                }); 
                    Waves.attach('.btn',['waves-float','waves-block']);
                    Waves.init();
              
            }

function aggiungiFornitore(){
                
                annullamodifica();
                $('#form').addClass('animated pulse');
                $('#boxregistrati').block({message: null});
                $('#inserimentoMode').removeClass('hidden');
                $('input, select').prop('disabled',false);
                $('textarea').prop('disabled',false);
            	
            	
            	resetSchedaicon();
            	$('#scheda-icon').addClass("fa fa-plus-square") ;
            	
            }
function aggiungiCliente(){
                annullamodifica();
                $('#form2').addClass('animated pulse');
                $('#boxregistrati').block({message: null});
                $('#inserimentoMode').removeClass('hidden');
                $('input, select').prop('disabled',false);
                $('textarea').prop('disabled',false);
            	
            	
            	resetSchedaicon();
            	$('#scheda-icon2').addClass("fa fa-plus-square") ;
            	
            }
         function annullamodifica() {
                
                
                $('#formtitolo').text('Fornitore');
                $('#modificaMode').addClass('hidden');
                $('#inserimentoMode').addClass('hidden');
                $('#form').removeClass('box-danger animated pulse');
                $('#form').addClass('box-success');
                $('#form2').removeClass('box-danger animated pulse');
                $('#form2').addClass('box-success');
                $('#inserisci').text('Salva');
                $('#inserisci').show();
                
                $('input, select').prop('disabled',true);
                $('textarea').prop('disabled',true);
                $('#modifica,#elimina').hide();
                
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-eye") ;
                $('#scheda-icon2').addClass("fa fa-eye") ;
                $('#pulisci').click();
                $('#boxregistrati').unblock({message: null});
            }
      function resetSchedaicon(){
            	$('#scheda-icon').removeClass("fa fa-plus-square") ;
                $('#scheda-icon').removeClass("fa fa-eye");
                $('#scheda-icon').removeClass("fa fa-edit");
                $('#scheda-icon2').removeClass("fa fa-plus-square") ;
                $('#scheda-icon2').removeClass("fa fa-eye");
                $('#scheda-icon2').removeClass("fa fa-edit");
            }
       
            
           
            $('#inserisci').on('click', function(e) {
                if($('#bloccato').prop("checked")){
                    var bloccato=1
                }else{bloccato=0}

                    var datiInsC = { 
                        idTipo : parseInt($('#tipo').val()),
                        idCanale : parseInt($('#canale').val()),
                        idAgente : parseInt($('#agente').val()),
                        societa : $('#societa').val(),
                        cf : $('#cf').val(),
                        piva : $('#piva').val(),
                        bloccato : bloccato,
                        note : $('#note').val(),
                        prefisso : $('#prefisso').val(),
                        radicecnt : "",
                        via : $('#indirizzo').val(),
                        cap : $('#cap').val(),
                        citta : $('#citta').val(),
                        provincia : $('#provincia').val(),
                        nazione : $('#stato').val(),
                        titolo : $('#titolo').val(),
                        nome : $('#nome').val(),
                        cognome : $('#cognome').val(),
                        telefono : $('#telefono').val(),
                        cellulare : $('#cellulare').val(),
                        fax : $('#fax').val(),
                        email : $('#email').val(),   
                    }
                        
                        
                        
              /*       var datiInsI = {   
                        via : $('#indirizzo').val(),
                        cap : $('#cap').val(),
                        citta : $('#citta').val(),
                        provincia : $('#provincia').val(),
                        nazione : $('#stato').val(),
                        titolo : $('#titolo').val(),
                        nome : $('#nome').val(),
                        cognome : $('#cognome').val(),
                        telefono : $('#telefono').val(),
                        cellulare : $('#cellulare').val(),
                        fax : $('#fax').val(),
                        email : $('#email').val(),
                        
                     }*/
                        

                    var inserisciClifoRapido = $.post(server + 'secure/cliforapido/inserisci',JSON.stringify(datiInsC));
                     
                       
                    inserisciClifoRapido.success(function() {
                  
                         if (!errore) {
                            swal("Inserito", "", "success");
                            annullamodifica();
                            refresh();
                            
                        }
                        errore = false;
                    });
                      inserisciClifoRapido.error(function(){
                       
                        swal("Errore", "", "error");
                       annullamodifica();
                           errore = false;
                          refresh();
                       });
                         
                         
                /*          var inserisciIndirizzo = $.post(server + 'secure/cliforapido/inserisciI',JSON.stringify(datiInsI));
                     
                       
                    inserisciIndirizzo.success(function() {
                  
                         if (!errore) {
                            swal("Inserito", "", "success");
                            annullamodifica();
                            refresh();
                            
                        }
                        errore = false;
                    });
                      inserisciIndirizzo.error(function(){
                       
                        swal("Errore", "", "error");
                       annullamodifica();
                           errore = false;
                          refresh();
                       }); */
                
                
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-eye") ;
                $('#scheda-icon2').addClass("fa fa-eye") ;
            });
          