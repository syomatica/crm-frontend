            function refresh() {
                $('#CauseMortiEsistenti').html('<tr><th>Cause Scadenza</th><th>Descrizione</th></tr>');
                var elencoCause = $.getJSON(server + 'secure/causemorti/elenco');
              
                elencoCause.done(function(response) {
                    for (i = 0; i < response.length; i++) {
                    	
                    		$('#CauseMortiEsistenti').append('<tr style="cursor: pointer; cursor: hand;" onclick="mostra('+response[i].idCausaMorte+')"><td>'+ response[i].causaMorte +'</td><td>'+ response[i].descrizione +'</td><td></td></tr>');                    		
                    	
                    }
                    Waves.attach('.btn',['waves-float','waves-block']);
                    Waves.init();
                })
            }
function aggiungiCausaMorte(){
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
                idCausaMorte = null;

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
                idCausaMorte = id;
                $('input, select').prop('disabled',true);
                $('textarea').prop('disabled',true);
                $('#modifica').show();

                $('#inserisci').hide();

                var getCausa = $.getJSON(server + 'secure/causemorti/leggi', {
                	idCausaMorte : idCausaMorte
                });

                getCausa.done(function(response) {
                    $('#causaMorte').val(response.causaMorte);
                    $('#descrizione').val(response.descrizione);
                    $('#elimina').show();    	
                    $('#inserisci').removeClass('disabled');
                });
            }
             function modificaCausa() {
                $('#formtitolo').text('Modifica Causa');
                $('#modificaMode').removeClass('hidden');
                $('#form').removeClass('box-default');
                $('#form').addClass('box-danger animated pulse');
                $('#inserisci').text('Salva modifiche');
                $('#inserisci').show();
                $('input, select').prop('disabled',false);
                $('textarea').prop('disabled',false);
                $('#modifica,#elimina').hide();
                $('#causaMorte').attr("disabled", false);
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-edit");
                
                
                $('html, body').animate({
                    scrollTop : 0
                }, 'fast');


                $('#boxregistrati').block({message: null});
                

            }
            function eliminaCausa() {
                swal({
                    title : "Attenzione!",
                    text : "La Causa sarà eliminata definitivamente.",
                    type : 'warning',
                    confirmButtonText : "Elimina",
                    cancelButtonText : "Annulla",
                    showCancelButton : true,
                    closeOnConfirm : false,
                    showLoaderOnConfirm : true,
                }, function() {
                    var eliminaCausa = $.get(server + 'secure/causemorti/cancella?idCausaMorte='+idCausaMorte);
                  
                    eliminaCausa.success(function() {
                        if (!errore) {
                            swal("Eliminata", "", "success");
                            annullamodifica();
                            refresh();
                        }
                        errore = false;
                    });
                      eliminaCausa.error(function(){
                        swal("Impossibile Eliminiare", "Sono presenti alcuni preventivi ", "error");
                        annullamodifica();
                            refresh();
                           errore = false;
                    }); 
                });          
            }
            $('#inserisci').on('click', function(e) {
                if (!idCausaMorte) {

                    var datiIns = { 
                        causaMorte : $('#causaMorte').val(),
                        descrizione : $('#descrizione').val(),
                        
                    }

                    var inserisciCausa = $.post(server + 'secure/causemorti/inserisci',JSON.stringify(datiIns));
                     
                       
                    inserisciCausa.success(function() {
                  
                         if (!errore) {
                            swal("Inserita", "", "success");
                            annullamodifica();
                            refresh();
                            
                        }
                        errore = false;
                    });
                      inserisciCausa.error(function(){
                       
                        swal("Causa esistente", "", "error");
                       annullamodifica();
                           errore = false;
                          refresh();
                       });
                } else {
                    
                         
                    var dati = {  
                    	idCausaMorte: idCausaMorte,
                    	causaMorte : $('#causaMorte').val(),
                        descrizione : $('#descrizione').val(),
                       
                    }
                    
                    var modificaCausa = $.post(server + 'secure/causemorti/modifica',JSON.stringify(dati));

                    modificaCausa.success(function() {
                        errore = false;
                        if (!errore) {
                            swal("Causa aggiornata", "", "success");
                            annullamodifica();
                            refresh();
                        }
                        
                    	$('#descrizione').removeClass("bg-yellow") ;
                    });
                }
                
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-eye") ;
            });
            $('#causaMorte, #descrizione').bind('keyup change ifChanged', function() {
                if (idCausaMorte !="" && $('#causaMorte').val().trim()  != "" && $('#descrizione').val().trim()  != "")
                    $('#inserisci').removeClass('disabled');
                else
                    $('#inserisci').addClass('disabled');
            });