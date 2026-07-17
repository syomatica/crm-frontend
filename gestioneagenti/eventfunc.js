            function refresh() {
                $('#agentiEsistenti').html('<tr><th>Agenti</th><th>Mago</th></tr>');
                var elencoAgenti = $.getJSON(server + 'secure/agenti/elenco');
              
                elencoAgenti.done(function(response) {
                    for (i = 0; i < response.length; i++) {
                    	if(response[i].magoAgente!="" && response[i].magoAgente!=null){
                    		$('#agentiEsistenti').append('<tr style="cursor: pointer; cursor: hand;" onclick="mostra('+response[i].id+')"><td>'+ response[i].agente +'</td>'
                    				+"<td><small id='magolabel' class='label bg-orange-active'>"+ response[i].magoAgente+"</small></td></tr>");
                    	} else {
                    		$('#agentiEsistenti').append('<tr style="cursor: pointer; cursor: hand;" onclick="mostra('+response[i].id+')"><td>'+ response[i].agente +'</td><td></td></tr>');                    		
                    	}
                    }
                    Waves.attach('.btn',['waves-float','waves-block']);
                    Waves.init();
                    $('#magolabel').hide();
                })
            }
function aggiungiAgente(){
                annullamodifica();
                $('#form').addClass('animated pulse');
                $('#boxregistrati').block({message: null});
                $('#inserimentoMode').removeClass('hidden');
                $('input, select').prop('disabled',false);
                $('textarea').prop('disabled',false);
            	$('#magoDiv').hide() ;
            	resetSchedaicon();
            	$('#scheda-icon').addClass("fa fa-plus-square") ;
            	
            }
         function annullamodifica() {
                idAgente = null;
                $('#magolabel').hide();
                $('#formtitolo').text('Dettagli');
                $('#modificaMode').addClass('hidden');
                $('#inserimentoMode').addClass('hidden');
                $('#form').removeClass('box-danger animated pulse');
                $('#form').addClass('box-success');
                $('#inserisci').text('Salva');
                $('#inserisci').show();
                $('#inserisci').addClass('disabled');
                $('input, select').prop('disabled',true);
                $('textarea').prop('disabled',true);
                $('#modifica,#elimina').hide();
                
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-eye") ;
                $('#pulisci').click();
                $('#boxregistrati').unblock({message: null});
             refresh();
            }
      function resetSchedaicon(){
            	$('#scheda-icon').removeClass("fa fa-plus-square") ;
                $('#scheda-icon').removeClass("fa fa-eye");
                $('#scheda-icon').removeClass("fa fa-edit");
            }
            function mostra(id){
                idAgente = id;
                $('input, select').prop('disabled',true);
                $('textarea').prop('disabled',true);
                $('#modifica').show();
                
                $('#inserisci').hide();

                var getAgente = $.getJSON(server + 'secure/agenti/leggi', {
                	idAgente : idAgente
                });

                getAgente.success(function(response) {
                    $('#agente').val(response.agente);
                    
                    
                    magoAgente = response.magoAgente;
                    
                   	if(response.magoAgente){
                            $('#elimina').hide() ;
                            
                            $('#magoDiv').html("<small id='magolabel' class='label bg-orange-active'> Mago "+ response.magoAgente+"</small>");
                            
                        } else {
                        	$('#magolabel').hide();
                            //$('#magoDiv').html("<small id='magolabel' class='label bg-orange-active'> Mago </small>");
    	                    $('#elimina').show();
    	                    
                        }
                    	
                    $('#inserisci').removeClass('disabled');
                });
            }
             function modificaAgente() {
                // refresh();        
                $('#formtitolo').text('Modifica Agente');
                $('#modificaMode').removeClass('hidden');
                $('#form').removeClass('box-default');
                $('#form').addClass('box-danger animated pulse');
                $('#inserisci').text('Salva modifiche');
                $('#inserisci').show();
                 
                $('input, select').prop('disabled',false);
                $('textarea').prop('disabled',false);
                $('#modifica,#elimina').hide();
                $('#agente').attr("disabled", false);
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-edit");
               
                
                $('html, body').animate({
                    scrollTop : 0
                }, 'fast');


                $('#boxregistrati').block({message: null});
                

            }
            function eliminaAgente() {
                swal({
                    title : "Attenzione!",
                    text : "L'Agente sarà eliminata definitivamente.",
                    type : 'warning',
                    confirmButtonText : "Elimina",
                    cancelButtonText : "Annulla",
                    showCancelButton : true,
                    closeOnConfirm : false,
                    showLoaderOnConfirm : true,
                }, function() {
                    var eliminaAgente = $.get(server + 'secure/agenti/cancella?idAgente='+idAgente);
                  
                    eliminaAgente.success(function() {
                        if (!errore) {
                            swal("Eliminata", "", "success");
                            annullamodifica();
                            refresh();
                        }
                        errore = false;
                    });
                      eliminaAgente.error(function(){
                        swal("Impossibile Eliminiare", "Sono presenti alcuni clienti con questo agente", "error");
                          annullamodifica();
                          resetSchedaicon();  
                          refresh();
                         errore = false;
                    });
                });          
            }
            $('#inserisci').on('click', function(e) {
                if (!idAgente) {

                    var datiIns = { 
                        agente : $('#agente').val(),
                        
                        
                    }

                    var inserisciAgente = $.post(server + 'secure/agenti/inserisci',JSON.stringify(datiIns));
                     
                       
                    inserisciAgente.success(function() {
                        
                         if (!errore) {
                            swal("Inserita", "", "success");
                            annullamodifica();
                            refresh();
                            
                        }
                        errore = false;
                    });
                      inserisciAgente.error(function(){
                       
                        swal("Agente esistente", "", "error");
                       annullamodifica();
                           errore = false;
                          refresh();
                       });
                } else {
                    
                         
                    var dati = {  
                    	idAgente: idAgente,
                    	agente : $('#agente').val(),
                            
                    }
                    
                    var modificaAgente = $.post(server + 'secure/agenti/modifica',JSON.stringify(dati));

                    modificaAgente.success(function() {
                        errore = false;
                        if (!errore) {
                            swal("Agente aggiornato", "", "success");
                            annullamodifica();
                            refresh();
                        }
                        
                    	
                    });
                }
                
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-eye") ;
            });
            $('#agente').bind('keyup change ifChanged', function() {
                if (idAgente !="" && $('#agente').val().trim()  != "")
                    $('#inserisci').removeClass('disabled');
                else
                    $('#inserisci').addClass('disabled');
            });