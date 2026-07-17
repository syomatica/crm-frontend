            function refresh() {
                $('#tipiCliFoEsistenti').html('<tr><th>Tipi CliFo</th><th>Descrizione</th></tr>');
                var elencoTipi = $.getJSON(server + 'secure/tipiclifo/elenco');
              
                elencoTipi.done(function(response) {
                    for (i = 0; i < response.length; i++) {
                    	
                    		$('#tipiCliFoEsistenti').append('<tr style="cursor: pointer; cursor: hand;" onclick="mostra('+response[i].id+')"><td>'+ response[i].tipoCliFo +'</td><td>'+ response[i].descrizione +'</td><td></td></tr>');                    		
                    	
                    }
                    Waves.attach('.btn',['waves-float','waves-block']);
                    Waves.init();
                })
            }
function aggiungiTipoCliFo(){
                annullamodifica();
                $('#form').addClass('animated pulse');
                $('#boxregistrati').block({message: null});
                $('#inserimentoMode').removeClass('hidden');
                $('input, select').prop('disabled',false);
                $('textarea').prop('disabled',false);
            	
            	$('#descrizione').removeClass("bg-yellow") ;
            	resetSchedaicon();
            	$('#scheda-icon').addClass("fa fa-plus-square") ;
            	
            }
         function annullamodifica() {
                idTipoCliFo = null;

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
                $('#descrizione').removeClass("bg-yellow") ;
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
                idTipoCliFo = id;
                $('input, select').prop('disabled',true);
                $('textarea').prop('disabled',true);
                $('#modifica').show();

                $('#inserisci').hide();

                var getTipo = $.getJSON(server + 'secure/tipiclifo/leggi', {
                	idTipoCliFo : idTipoCliFo
                });

                getTipo.done(function(response) {
                    $('#tipoCliFo').val(response.tipoCliFo);
                    $('#descrizione').val(response.descrizione);
                    $('#elimina').show();    	
                    $('#inserisci').removeClass('disabled');
                });
            }
             function modificaTipo() {
                $('#formtitolo').text('Modifica Causa');
                $('#modificaMode').removeClass('hidden');
                $('#form').removeClass('box-default');
                $('#form').addClass('box-danger animated pulse');
                $('#inserisci').text('Salva modifiche');
                $('#inserisci').show();
                $('input, select').prop('disabled',false);
                $('textarea').prop('disabled',false);
                $('#modifica,#elimina').hide();
                $('#tipoCliFo').attr("disabled", false);
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-edit");
                
                
                $('html, body').animate({
                    scrollTop : 0
                }, 'fast');


                $('#boxregistrati').block({message: null});
                

            }
            function eliminaTipo() {
                swal({
                    title : "Attenzione!",
                    text : "Il tipo sarà eliminato definitivamente.",
                    type : 'warning',
                    confirmButtonText : "Elimina",
                    cancelButtonText : "Annulla",
                    showCancelButton : true,
                    closeOnConfirm : false,
                    showLoaderOnConfirm : true,
                }, function() {
                    var eliminaTipo = $.get(server + 'secure/tipiclifo/cancella?idTipoCliFo='+idTipoCliFo);
                  
                    eliminaTipo.success(function() {
                        if (!errore) {
                            swal("Eliminata", "", "success");
                            annullamodifica();
                            refresh();
                        }
                        errore = false;
                    });
                      eliminaTipo.error(function(){
                        swal("Impossibile Eliminiare", "Sono presenti clienti o fornitori con questo tipo", "error");
                        annullamodifica();
                            refresh();
                           errore = false;
                    }); 
                });          
            }
            $('#inserisci').on('click', function(e) {
                if (!idTipoCliFo) {

                    var datiIns = { 
                        tipoCliFo : $('#tipoCliFo').val(),
                        descrizione : $('#descrizione').val(),
                        
                    }

                    var inserisciTipo = $.post(server + 'secure/tipiclifo/inserisci',JSON.stringify(datiIns));
                     
                       
                    inserisciTipo.success(function() {
                  
                         if (!errore) {
                            swal("Inserita", "", "success");
                            annullamodifica();
                            refresh();
                            
                        }
                        errore = false;
                    });
                      inserisciTipo.error(function(){
                       
                        swal("Tipo esistente", "", "error");
                       annullamodifica();
                           errore = false;
                          refresh();
                       });
                } else {
                    
                         
                    var dati = {  
                    	idTipoCliFo: idTipoCliFo,
                    	tipoCliFo : $('#tipoCliFo').val(),
                        descrizione : $('#descrizione').val(),
                       
                    }
                    
                    var modificaTipo = $.post(server + 'secure/tipiclifo/modifica',JSON.stringify(dati));

                    modificaTipo.success(function() {
                        errore = false;
                        if (!errore) {
                            swal("Tipo aggiornato", "", "success");
                            annullamodifica();
                            refresh();
                        }
                        
                    	$('#descrizione').removeClass("bg-yellow") ;
                    });
                }
                
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-eye") ;
            });
            $('#tipoCliFo, #descrizione').bind('keyup change ifChanged', function() {
                if (idTipoCliFo !="" && $('#tipoCliFo').val().trim()  != "" )
                    $('#inserisci').removeClass('disabled');
                else
                    $('#inserisci').addClass('disabled');
            });