			function aggiungiunita(){
                annullamodifica();
                $('#form').addClass('animated pulse');
                $('#boxregistrati').block({message: null});
                $('#inserimentoMode').removeClass('hidden');
                $('input, select').prop('disabled',false);
                $('textarea').prop('disabled',false);
            	$('#magoDiv').hide() ;
            	$('#descrizione').removeClass("bg-yellow") ;
            	resetSchedaicon();
            	$('#scheda-icon').addClass("fa fa-plus-square") ;
            }

            function eliminaunita() {
                swal({
                    title : "Attenzione!",
                    text : "L'Unità di misura sarà eliminata definitivamente.",
                    type : 'warning',
                    confirmButtonText : "Elimina",
                    cancelButtonText : "Annulla",
                    showCancelButton : true,
                    closeOnConfirm : false,
                    showLoaderOnConfirm : true,
                }, function() {
                    var eliminaunita = $.get(server + 'secure/unitamisura/cancella?idUm='+idUm);

                    eliminaunita.done(function() {
                        if (!errore) {
                            swal("Eliminata", "", "success");
                            annullamodifica();
                        }
                        errore = false;
                    });
                });          
            }

            function mostra(id){
            	idUm = id;
                $('input, select').prop('disabled',true);
                $('textarea').prop('disabled',true);
                $('#modifica').show();

                $('#inserisci').hide();

                var getunita = $.getJSON(server + 'secure/unitamisura/leggi', {
                	idUm : idUm
                });

                getunita.done(function(response) {
                    $('#unita').val(response.um);
                    $('#descrizione').val(response.descrizione);
                    $('#nota').val(response.nota);
                    magoUM = response.magoUM;
                    
                   	if(response.magoUM){
                            $('#elimina').hide() ;
                            $('#descrizione').addClass("bg-yellow") ;
                            $('#magoDiv').html("<small id='magolabel' class='label bg-orange-active'> Mago "+ response.magoUM+"</small>");
                        } else {
                        	$('#magoDiv').html("<small id='magolabel' class='label bg-orange-active'> Mago </small>");
    	                    $('#elimina').show();
    	                    $('#descrizione').removeClass("bg-yellow") ;
    	                    
                        }
                    	
                    $('#inserisci').removeClass('disabled');
                });
            }


            function modificaunita() {
                $('#formtitolo').text('Modifica unita');
                $('#modificaMode').removeClass('hidden');
                $('#form').removeClass('box-default');
                $('#form').addClass('box-danger animated pulse');
                $('#inserisci').text('Salva modifiche');
                $('#inserisci').show();
                $('input, select').prop('disabled',false);
                $('textarea').prop('disabled',false);
                $('#modifica,#elimina').hide();
                $('#unita').attr("disabled", true);
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-edit");
                if(magoUM != "" && magoUM != null){
                	$('#descrizione').addClass("bg-yellow");
                	$('#descrizione').attr("disabled", true);
                }
                
                $('html, body').animate({
                    scrollTop : 0
                }, 'fast');

                $('#boxregistrati').block({message: null});
            }

            function annullamodifica() {
            	idUm = null;

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

            $('#inserisci').on('click', function(e) {
                if (!idUm) {

                    var datiIns = { 
                    	unita : $('#unita').val(),
                        descrizione : $('#descrizione').val(),
                        nota : $('#nota').val() ,
                    }

                    var inserisciunita = $.post(server + 'secure/unitamisura/inserisci',JSON.stringify(datiIns));

                    inserisciunita.done(function() {
                        if (!errore) {
                            swal("Inserita", "", "success");
                            annullamodifica();
                        }
                        errore = false;
                    });
                } else {

                    var dati = {  
                    	idUm: idUm,
                    	unita : $('#unita').val(),
                        descrizione : $('#descrizione').val(),
                        nota : $('#nota').val(),
                    }
                    
                    var modificaunita = $.post(server + 'secure/unitamisura/modifica',JSON.stringify(dati));

                    modificaunita.done(function() {
                        if (!errore) {
                            swal("Unità di misura aggiornata", "", "success");
                            annullamodifica();
                        }
                        errore = false;
                        $('#descrizione').removeClass("bg-yellow") ;
                    });
                }
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-eye") ;
            });

            $('#unita, #descrizione, #nota').bind('keyup change ifChanged', function() {
                if (idUm !="" && $('#unita').val().trim()  != "" && $('#descrizione').val().trim()  != "" && $('#nota').val().trim()  != "" )
                    $('#inserisci').removeClass('disabled');
                else
                    $('#inserisci').addClass('disabled');
            });

            function refresh() {
                $('#unitaEsistenti').html('<tr><th>Unità di misura</th><th>Descrizione</th><th>Mago</th></tr>');
                var elencoUnita = $.getJSON(server + 'secure/unitamisura/elenco');

                elencoUnita.done(function(response) {
                    for (i = 0; i < response.length; i++) {
                    	if(response[i].magoUM!="" && response[i].magoUM!=null){
                    		$('#unitaEsistenti').append('<tr style="cursor: pointer; cursor: hand;" onclick="mostra('+response[i].idUm+')"><td>'+ response[i].um +'</td><td>'+ response[i].descrizione +'</td>'
                    				+'<td><small id="magolabel" class="label bg-orange-active">'+ response[i].magoUM+'</small></td></tr>');
                    	} else {
                    		$('#unitaEsistenti').append('<tr style="cursor: pointer; cursor: hand;" onclick="mostra('+response[i].idUm+')"><td>'+ response[i].um +'</td><td>'+ response[i].descrizione +'</td><td></td></tr>');                    		
                    	}
                    }
                    Waves.attach('.btn',['waves-float','waves-block']);
                    Waves.init();
                });
            }
            
            function resetSchedaicon(){
            	$('#scheda-icon').removeClass("fa fa-plus-square") ;
                $('#scheda-icon').removeClass("fa fa-eye");
                $('#scheda-icon').removeClass("fa fa-edit");
            }