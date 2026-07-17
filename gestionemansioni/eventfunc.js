            function refresh() {
                $('#MansioniEsistenti').html('<tr><th>Tipo Mansione</th><th>Descrizione</th></tr>');
                var elencoMansione = $.getJSON(server + 'secure/mansioni/elenco');
              
                elencoMansione.done(function(response) {
                    for (i = 0; i < response.length; i++) {
                    	
                    		$('#MansioniEsistenti').append('<tr style="cursor: pointer; cursor: hand;" onclick="mostra('+response[i].idMansione+')"><td>'+ response[i].mansione +'</td><td>'+ response[i].descrizione +'</td><td></td></tr>');                    		
                    	
                    }
                    Waves.attach('.btn',['waves-float','waves-block']);
                    Waves.init();
                })
            }
function aggiungiMansione(){
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
                idMansione = null;

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
                idMansione = id;
                $('input, select').prop('disabled',true);
                $('textarea').prop('disabled',true);
                $('#modifica').show();

                $('#inserisci').hide();

                var getMansione = $.getJSON(server + 'secure/mansioni/leggi', {
                	idMansione : idMansione
                });

                getMansione.done(function(response) {
                    $('#tipoMansione').val(response.mansione);
                    $('#descrizione').val(response.descrizione);
                    $('#elimina').show();    	
                    $('#inserisci').removeClass('disabled');
                });
            }
             function modificaMansione() {
                $('#formtitolo').text('Modifica mansione');
                $('#modificaMode').removeClass('hidden');
                $('#form').removeClass('box-default');
                $('#form').addClass('box-danger animated pulse');
                $('#inserisci').text('Salva modifiche');
                $('#inserisci').show();
                $('input, select').prop('disabled',false);
                $('textarea').prop('disabled',false);
                $('#modifica,#elimina').hide();
                $('#tipoMansione').attr("disabled", false);
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-edit");
                
                
                $('html, body').animate({
                    scrollTop : 0
                }, 'fast');


                $('#boxregistrati').block({message: null});
                

            }
            function eliminaMansione() {
                swal({
                    title : "Attenzione!",
                    text : "La mansione sarà eliminata definitivamente.",
                    type : 'warning',
                    confirmButtonText : "Elimina",
                    cancelButtonText : "Annulla",
                    showCancelButton : true,
                    closeOnConfirm : false,
                    showLoaderOnConfirm : true,
                }, function() {
                    var eliminaMansione = $.get(server + 'secure/mansioni/cancella?idMansione='+idMansione);
                  
                    eliminaMansione.success(function() {
                        if (!errore) {
                            swal("Eliminata", "", "success");
                            annullamodifica();
                            refresh();
                        }
                        errore = false;
                    });
                     eliminaMansione.error(function(){
                        swal("Impossibile Eliminiare", "Sono presenti alcuni addetti con quelle mansioni ", "error");
                        annullamodifica();
                            refresh();
                          errore = false;
                    }); 
                });          
            }
            $('#inserisci').on('click', function(e) {
                if (!idMansione) {

                    var datiIns = { 
                        tipoMansione : $('#tipoMansione').val(),
                        descrizione : $('#descrizione').val(),
                        
                    }

                    var inserisciMansione = $.post(server + 'secure/mansioni/inserisci',JSON.stringify(datiIns));
                     
                       
                    inserisciMansione.success(function() {
                  
                         if (!errore) {
                            swal("Inserita", "", "success");
                            annullamodifica();
                            refresh();
                            
                        }
                        errore = false;
                    });
                      inserisciMansione.error(function(){
                       
                        swal("Mansione esistente", "", "error");
                       annullamodifica();
                           errore = false;
                          refresh();
                       });
                } else {
                    
                         
                    var dati = {  
                    	idMansione: idMansione,
                    	tipoMansione : $('#tipoMansione').val(),
                        descrizione : $('#descrizione').val(),
                       
                    }
                    
                    var modificaMansione = $.post(server + 'secure/mansioni/modifica',JSON.stringify(dati));

                    modificaMansione.success(function() {
                        errore = false;
                        if (!errore) {
                            swal("Mansione aggiornata", "", "success");
                            annullamodifica();
                            refresh();
                        }
                        
                    	$('#descrizione').removeClass("bg-yellow") ;
                    });
                }
                
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-eye") ;
            });
            $('#tipoMansione, #descrizione').bind('keyup change ifChanged', function() {
                if (idMansione !="" && $('#tipoMansione').val().trim()  != "")
                    $('#inserisci').removeClass('disabled');
                else
                    $('#inserisci').addClass('disabled');
            });