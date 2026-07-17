			function aggiungitipoprodotto(){
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

            function eliminatipoprodotto() {
                swal({
                    title : "Attenzione!",
                    text : "Il Tipo Prodotto sarà eliminato definitivamente.",
                    type : 'warning',
                    confirmButtonText : "Elimina",
                    cancelButtonText : "Annulla",
                    showCancelButton : true,
                    closeOnConfirm : false,
                    showLoaderOnConfirm : true,
                }, function() {
                    var eliminatipoprodotto = $.get(server + 'secure/sottocategorie/cancella?idScategoria='+idScategoria);

                    eliminatipoprodotto.done(function() {
                        if (!errore) {
                            swal("Eliminata", "", "success");
                            annullamodifica();
                        }
                        errore = false;
                    });
                });          
            }

            function mostra(id){
                idScategoria = id;
                $('input, select').prop('disabled',true);
                $('textarea').prop('disabled',true);
                $('#modifica').show();

                $('#inserisci').hide();

                var getTipoProdotto = $.getJSON(server + 'secure/sottocategorie/leggi', {
                	idScategoria : idScategoria
                });

                getTipoProdotto.done(function(response) {
                    $('#sottoCategoria').val(response.sottoCategoria);
                    $('#descrizione').val(response.descrizione);
                    $('#nota').val(response.nota);
                    magoTipoArt = response.magoTipoArt;
                    
                   	if(response.magoTipoArt){
                            $('#elimina').hide() ;
                            $('#descrizione').addClass("bg-yellow") ;
                            $('#magoDiv').html("<small id='magolabel' class='label bg-orange-active'> Mago "+ response.magoTipoArt+"</small>");
                        } else {
                        	$('#magoDiv').html("<small id='magolabel' class='label bg-orange-active'> Mago </small>");
    	                    $('#elimina').show();
    	                    $('#descrizione').removeClass("bg-yellow") ;
    	                    
                        }
                    	
                    $('#inserisci').removeClass('disabled');
                });
            }


            function modificatipoprodotto() {
                $('#formtitolo').text('Modifica tipo prodotto');
                $('#modificaMode').removeClass('hidden');
                $('#form').removeClass('box-default');
                $('#form').addClass('box-danger animated pulse');
                $('#inserisci').text('Salva modifiche');
                $('#inserisci').show();
                $('input, select').prop('disabled',false);
                $('textarea').prop('disabled',false);
                $('#modifica,#elimina').hide();
                $('#sottoCategoria').attr("disabled", true);
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-edit");
                if(magoTipoArt != "" && magoTipoArt != null){
                	$('#descrizione').addClass("bg-yellow") ;
                	$('#descrizione').attr("disabled", true);
                }
                
                $('html, body').animate({
                    scrollTop : 0
                }, 'fast');

                $('#boxregistrati').block({message: null});
            }

            function annullamodifica() {
                idScategoria = null;

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
                if (!idScategoria) {

                    var datiIns = { 
                    	sottoCategoria : $('#sottoCategoria').val(),
                        descrizione : $('#descrizione').val(),
                        nota : $('#nota').val() ,
                    }

                    var inserisciTipoProdotto = $.post(server + 'secure/sottocategorie/inserisci',JSON.stringify(datiIns));

                    inserisciTipoProdotto.done(function() {
                        if (!errore) {
                            swal("Inserita", "", "success");
                            annullamodifica();
                        }
                        errore = false;
                    });
                } else {

                    var dati = {  
                    	idScategoria: idScategoria,
                    	sottoCategoria : $('#sottoCategoria').val(),
                        descrizione : $('#descrizione').val(),
                        nota : $('#nota').val(),
                    }
                    
                    var modificaTipoProdotto = $.post(server + 'secure/sottocategorie/modifica',JSON.stringify(dati));

                    modificaTipoProdotto.done(function() {
                        if (!errore) {
                            swal("Tipo Prodotto aggiornato", "", "success");
                            annullamodifica();
                        }
                        errore = false;
                        $('#descrizione').removeClass("bg-yellow") ;
                    });
                }
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-eye") ;
            });

            $('#sottoCategoria, #descrizione, #nota').bind('keyup change ifChanged', function() {
                if (idScategoria !="" && $('#sottoCategoria').val().trim()  != "" && $('#descrizione').val().trim()  != "" && $('#nota').val().trim()  != "" )
                    $('#inserisci').removeClass('disabled');
                else
                    $('#inserisci').addClass('disabled');
            });

            function refresh() {
                $('#tipiprodottiEsistenti').html('<tr><th>Tipo Prodotto</th><th>Descrizione</th><th>Mago</th></tr>');
                var elencoTipiProdotti = $.getJSON(server + 'secure/sottocategorie/elenco');

                elencoTipiProdotti.done(function(response) {
                    for (i = 0; i < response.length; i++) {
                    	if(response[i].magoTipoArt!="" && response[i].magoTipoArt!=null){
                    		$('#tipiprodottiEsistenti').append('<tr style="cursor: pointer; cursor: hand;" onclick="mostra('+response[i].idScategoria+')"><td>'+ response[i].sottoCategoria +'</td><td>'+ response[i].descrizione +'</td>'
                    		+'<td><small id="magolabel" class="label bg-orange-active">'+ response[i].magoTipoArt+'</small></td></tr>');
                    	} else {
                    		$('#tipiprodottiEsistenti').append('<tr style="cursor: pointer; cursor: hand;" onclick="mostra('+response[i].idScategoria+')"><td>'+ response[i].sottoCategoria +'</td><td>'+ response[i].descrizione +'</td><td></td></tr>');                    		
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