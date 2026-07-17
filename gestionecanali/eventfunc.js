            function refresh() {
                $('#canaliEsistenti').html('<tr><th>Canali</th></tr>');
                var elencoCanali = $.getJSON(server + 'secure/canali/elenco');
              
                elencoCanali.done(function(response) {
                    for (i = 0; i < response.length; i++) {
                    	
                    		$('#canaliEsistenti').append('<tr style="cursor: pointer; cursor: hand;" onclick="mostra('+response[i].id+')"><td>'+ response[i].canale +'</td></tr>');                    		
                    	
                    }
                    Waves.attach('.btn',['waves-float','waves-block']);
                    Waves.init();
                })
            }
function aggiungiCanale(){
                annullamodifica();
                $('#form').addClass('animated pulse');
                $('#boxregistrati').block({message: null});
                $('#inserimentoMode').removeClass('hidden');
                $('input, select').prop('disabled',false);
                $('textarea').prop('disabled',false);
            	
            	
            	resetSchedaicon();
            	$('#scheda-icon').addClass("fa fa-plus-square") ;
            	
            }
         function annullamodifica() {
                idCanale = null;

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
            }
      function resetSchedaicon(){
            	$('#scheda-icon').removeClass("fa fa-plus-square") ;
                $('#scheda-icon').removeClass("fa fa-eye");
                $('#scheda-icon').removeClass("fa fa-edit");
            }
            function mostra(id){
                idCanale = id;
                $('input, select').prop('disabled',true);
                $('textarea').prop('disabled',true);
                $('#modifica').show();

                $('#inserisci').hide();

                var getCanale = $.getJSON(server + 'secure/canali/leggi', {
                	idCanale : idCanale
                });

                getCanale.done(function(response) {
                    $('#canale').val(response.canale);
                    
                    $('#elimina').show();    	
                    $('#inserisci').removeClass('disabled');
                });
            }
             function modificaCanale() {
                $('#formtitolo').text('Modifica Canale');
                $('#modificaMode').removeClass('hidden');
                $('#form').removeClass('box-default');
                $('#form').addClass('box-danger animated pulse');
                $('#inserisci').text('Salva modifiche');
                $('#inserisci').show();
                $('input, select').prop('disabled',false);
                $('textarea').prop('disabled',false);
                $('#modifica,#elimina').hide();
                $('#canale').attr("disabled", false);
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-edit");
                
                
                $('html, body').animate({
                    scrollTop : 0
                }, 'fast');


                $('#boxregistrati').block({message: null});
                

            }
            function eliminaCanale() {
                swal({
                    title : "Attenzione!",
                    text : "Il canale sarà eliminato definitivamente.",
                    type : 'warning',
                    confirmButtonText : "Elimina",
                    cancelButtonText : "Annulla",
                    showCancelButton : true,
                    closeOnConfirm : false,
                    showLoaderOnConfirm : true,
                }, function() {
                    var eliminaCanale = $.get(server + 'secure/canali/cancella?idCanale='+idCanale);
                  
                    eliminaCanale.success(function() {
                        if (!errore) {
                            swal("Eliminata", "", "success");
                            annullamodifica();
                            refresh();
                        }
                        errore = false;
                    });
                      eliminaCanale.error(function(){
                        swal("Impossibile Eliminiare", "Sono presenti clienti con questo canale", "error");
                        annullamodifica();
                            refresh();
                           errore = false;
                    }); 
                });          
            }
            $('#inserisci').on('click', function(e) {
                if (!idCanale) {

                    var datiIns = { 
                        canale : $('#canale').val(),
                        
                        
                    }

                    var inserisciCanale = $.post(server + 'secure/canali/inserisci',JSON.stringify(datiIns));
                     
                       
                    inserisciCanale.success(function() {
                  
                         if (!errore) {
                            swal("Inserita", "", "success");
                            annullamodifica();
                            refresh();
                            
                        }
                        errore = false;
                    });
                      inserisciCanale.error(function(){
                       
                        swal("Canale esistente", "", "error");
                       annullamodifica();
                           errore = false;
                          refresh();
                       });
                } else {
                    
                         
                    var dati = {  
                    	idCanale: idCanale,
                    	canale : $('#canale').val(),
                        
                       
                    }
                    
                    var modificaCanale = $.post(server + 'secure/canali/modifica',JSON.stringify(dati));

                    modificaCanale.success(function() {
                        errore = false;
                        if (!errore) {
                            swal("Canale aggiornato", "", "success");
                            annullamodifica();
                            refresh();
                        }
                        
                    	
                    });
                }
                
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-eye") ;
            });
            $('#canale').bind('keyup change ifChanged', function() {
                if (idCanale !="" && $('#canale').val().trim()  != "" )
                    $('#inserisci').removeClass('disabled');
                else
                    $('#inserisci').addClass('disabled');
            });