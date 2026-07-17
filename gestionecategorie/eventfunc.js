			function aggiungicategoria(){
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

            function eliminacategoria() {
                swal({
                    title : "Attenzione!",
                    text : "La Categoria sarà eliminato definitivamente.",
                    type : 'warning',
                    confirmButtonText : "Elimina",
                    cancelButtonText : "Annulla",
                    showCancelButton : true,
                    closeOnConfirm : false,
                    showLoaderOnConfirm : true,
                }, function() {
                    var eliminacategoria = $.get(server + 'secure/categorie/cancella?idCategoria='+idCategoria);

                    eliminacategoria.done(function() {
                        if (!errore) {
                            swal("Eliminata", "", "success");
                            annullamodifica();
                        }
                        errore = false;
                    });
                });          
            }

            function mostra(id){
                idCategoria = id;
                $('input, select').prop('disabled',true);
                $('textarea').prop('disabled',true);
                $('#modifica').show();

                $('#inserisci').hide();

                var getCategoria = $.getJSON(server + 'secure/categorie/leggi', {
                	idCategoria : idCategoria
                });

                getCategoria.done(function(response) {
                    $('#categoria').val(response.categoria);
                    $('#descrizione').val(response.descrizione);
                    $('#nota').val(response.nota);
                    magoCategoria = response.magoCategoria;
                    
                   	if(response.magoCategoria){
                            $('#elimina').hide() ;
                            $('#descrizione').addClass("bg-yellow") ;
                            $('#magoDiv').html("<small id='magolabel' class='label bg-orange-active'> Mago "+ response.magoCategoria+"</small>");
                            
                        } else {
                        	$('#magoDiv').html("<small id='magolabel' class='label bg-orange-active'> Mago </small>");
    	                    $('#elimina').show();
    	                    $('#descrizione').removeClass("bg-yellow") ;
                        }
                    	
                    $('#inserisci').removeClass('disabled');
                });
            }


            function modificacategoria() {
                $('#formtitolo').text('Modifica categoria');
                $('#modificaMode').removeClass('hidden');
                $('#form').removeClass('box-default');
                $('#form').addClass('box-danger animated pulse');
                $('#inserisci').text('Salva modifiche');
                $('#inserisci').show();
                $('input, select').prop('disabled',false);
                $('textarea').prop('disabled',false);
                $('#modifica,#elimina').hide();
                $('#categoria').attr("disabled", true);
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-edit");
                if(magoCategoria != "" && magoCategoria != null){
                	$('#descrizione').addClass("bg-yellow") ;
                	$('#descrizione').attr("disabled", true);
                }
                
                $('html, body').animate({
                    scrollTop : 0
                }, 'fast');


                $('#boxregistrati').block({message: null});
                

            }

            function annullamodifica() {
                idCategoria = null;

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
                if (!idCategoria) {

                    var datiIns = { 
                        categoria : $('#categoria').val(),
                        descrizione : $('#descrizione').val(),
                        nota : $('#nota').val() ,
                    }

                    var inserisciCategoria = $.post(server + 'secure/categorie/inserisci',JSON.stringify(datiIns));

                    inserisciCategoria.done(function() {
                        if (!errore) {
                            swal("Inserita", "", "success");
                            annullamodifica();
                        }
                        errore = false;
                    });
                } else {

                    var dati = {  
                    	idCategoria: idCategoria,
                    	categoria : $('#categoria').val(),
                        descrizione : $('#descrizione').val(),
                        nota : $('#nota').val(),
                    }
                    
                    var modificaCategoria = $.post(server + 'secure/categorie/modifica',JSON.stringify(dati));

                    modificaCategoria.done(function() {
                        if (!errore) {
                            swal("Categoria aggiornata", "", "success");
                            annullamodifica();
                        }
                        errore = false;
                    	$('#descrizione').removeClass("bg-yellow") ;
                    });
                }
                
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-eye") ;
            });

            $('#categoria, #descrizione, #nota').bind('keyup change ifChanged', function() {
                if (idCategoria !="" && $('#categoria').val().trim()  != "" && $('#descrizione').val().trim()  != "" && $('#nota').val().trim()  != "" )
                    $('#inserisci').removeClass('disabled');
                else
                    $('#inserisci').addClass('disabled');
            });

            function refresh() {
                $('#categorieEsistenti').html('<tr><th>Categoria</th><th>Descrizione</th><th>Mago</th></tr>');
                var elencoCategorie = $.getJSON(server + 'secure/categorie/elenco');

                elencoCategorie.done(function(response) {
                    for (i = 0; i < response.length; i++) {
                    	if(response[i].magoCategoria!="" && response[i].magoCategoria!=null){
                    		$('#categorieEsistenti').append('<tr style="cursor: pointer; cursor: hand;" onclick="mostra('+response[i].idCategoria+')"><td>'+ response[i].categoria +'</td><td>'+ response[i].descrizione +"</td>"
                    				+"<td><small id='magolabel' class='label bg-orange-active'>"+ response[i].magoCategoria+"</small></td></tr>");
                    	} else {
                    		$('#categorieEsistenti').append('<tr style="cursor: pointer; cursor: hand;" onclick="mostra('+response[i].idCategoria+')"><td>'+ response[i].categoria +'</td><td>'+ response[i].descrizione +'</td><td></td></tr>');                    		
                    	}
                    }
                    Waves.attach('.btn',['waves-float','waves-block']);
                    Waves.init();
                })
            }
            
            function resetSchedaicon(){
            	$('#scheda-icon').removeClass("fa fa-plus-square") ;
                $('#scheda-icon').removeClass("fa fa-eye");
                $('#scheda-icon').removeClass("fa fa-edit");
            }
