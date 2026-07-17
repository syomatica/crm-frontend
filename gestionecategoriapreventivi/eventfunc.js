            function refresh() {
                $('#categorieEsistenti').html('<tr><th>Categoria</th><th>Descrizione</th><th>Mago</th></tr>');
                var elencoCategorie = $.getJSON(server + 'secure/categoriePreventivo/elenco');
              
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
                    $('#magolabel').hide();
                })
            }
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
         function annullamodifica() {
                idCategoria = null;
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
                $('#descrizione').removeClass("bg-yellow") ;
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
                idCategoria = id;
                $('input, select').prop('disabled',true);
                $('textarea').prop('disabled',true);
                $('#modifica').show();
                
                $('#inserisci').hide();

                var getCategoria = $.getJSON(server + 'secure/categoriePreventivo/leggi', {
                	idCategoria : idCategoria
                });

                getCategoria.success(function(response) {
                    $('#categoria').val(response.categoria);
                    $('#descrizione').val(response.descrizione);
                    
                    magoCategoria = response.magoCategoria;
                    
                   	if(response.magoCategoria){
                            $('#elimina').hide() ;
                            $('#descrizione').addClass("bg-yellow") ;
                            $('#magoDiv').html("<small id='magolabel' class='label bg-orange-active'> Mago "+ response.magoCategoria+"</small>");
                            
                        } else {
                        	$('#magolabel').hide();
                            //$('#magoDiv').html("<small id='magolabel' class='label bg-orange-active'> Mago </small>");
    	                    $('#elimina').show();
    	                    $('#descrizione').removeClass("bg-yellow") ;
                        }
                    	
                    $('#inserisci').removeClass('disabled');
                });
            }
             function modificacategoria() {
                // refresh();        
                $('#formtitolo').text('Modifica categoria');
                $('#modificaMode').removeClass('hidden');
                $('#form').removeClass('box-default');
                $('#form').addClass('box-danger animated pulse');
                $('#inserisci').text('Salva modifiche');
                $('#inserisci').show();
                 
                $('input, select').prop('disabled',false);
                $('textarea').prop('disabled',false);
                $('#modifica,#elimina').hide();
                $('#categoria').attr("disabled", false);
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-edit");
                if(magoCategoria != "" && magoCategoria != null){
                	$('#descrizione').addClass("bg-yellow") ;
                	$('#descrizione').attr("disabled", false);
                }
                
                $('html, body').animate({
                    scrollTop : 0
                }, 'fast');


                $('#boxregistrati').block({message: null});
                

            }
            function eliminacategoria() {
                swal({
                    title : "Attenzione!",
                    text : "La Categoria sarà eliminata definitivamente.",
                    type : 'warning',
                    confirmButtonText : "Elimina",
                    cancelButtonText : "Annulla",
                    showCancelButton : true,
                    closeOnConfirm : false,
                    showLoaderOnConfirm : true,
                }, function() {
                    var eliminacategoria = $.get(server + 'secure/categoriePreventivo/cancella?idCategoria='+idCategoria);
                  
                    eliminacategoria.success(function() {
                        if (!errore) {
                            swal("Eliminata", "", "success");
                            annullamodifica();
                            refresh();
                        }
                        errore = false;
                    });
                      eliminacategoria.error(function(){
                        swal("Impossibile Eliminiare", "Sono presenti alcuni preventivi per questa categoria", "error");
                          annullamodifica();
                          resetSchedaicon();  
                          refresh();
                         errore = false;
                    });
                });          
            }
            $('#inserisci').on('click', function(e) {
                if (!idCategoria) {

                    var datiIns = { 
                        categoriaPreventivo : $('#categoria').val(),
                        descrizione : $('#descrizione').val(),
                        
                    }

                    var inserisciCategoria = $.post(server + 'secure/categoriePreventivo/inserisci',JSON.stringify(datiIns));
                     
                       
                    inserisciCategoria.success(function() {
                        
                         if (!errore) {
                            swal("Inserita", "", "success");
                            annullamodifica();
                            refresh();
                            
                        }
                        errore = false;
                    });
                      inserisciCategoria.error(function(){
                       
                        swal("Categoria esistente", "", "error");
                       annullamodifica();
                           errore = false;
                          refresh();
                       });
                } else {
                    
                         
                    var dati = {  
                    	idCategoria: idCategoria,
                    	categoriaPreventivo : $('#categoria').val(),
                        descrizione : $('#descrizione').val(),
                       
                    }
                    
                    var modificaCategoria = $.post(server + 'secure/categoriePreventivo/modifica',JSON.stringify(dati));

                    modificaCategoria.success(function() {
                        errore = false;
                        if (!errore) {
                            swal("Categoria aggiornata", "", "success");
                            annullamodifica();
                            refresh();
                        }
                        
                    	$('#descrizione').removeClass("bg-yellow") ;
                    });
                }
                
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-eye") ;
            });
            $('#categoria, #descrizione').bind('keyup change ifChanged', function() {
                if (idCategoria !="" && $('#categoria').val().trim()  != "" && $('#descrizione').val().trim()  != "")
                    $('#inserisci').removeClass('disabled');
                else
                    $('#inserisci').addClass('disabled');
            });