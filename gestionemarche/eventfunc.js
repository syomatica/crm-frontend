			function aggiungimarca(){
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

            function eliminamarca() {
                swal({
                    title : "Attenzione!",
                    text : "La Marca sarà eliminata definitivamente.",
                    type : 'warning',
                    confirmButtonText : "Elimina",
                    cancelButtonText : "Annulla",
                    showCancelButton : true,
                    closeOnConfirm : false,
                    showLoaderOnConfirm : true,
                }, function() {
                    var eliminamarca = $.get(server + 'secure/marche/cancella?idMarca='+idMarca);

                    eliminamarca.done(function() {
                        if (!errore) {
                            swal("Eliminata", "", "success");
                            annullamodifica();
                        }
                        errore = false;
                    });
                });          
            }

            function mostra(id){
            	idMarca = id;
                $('input, select').prop('disabled',true);
                $('textarea').prop('disabled',true);
                $('#modifica').show();

                $('#inserisci').hide();

                var getmarca = $.getJSON(server + 'secure/marche/leggi', {
                	idMarca : idMarca
                });

                getmarca.done(function(response) {
                    $('#marca').val(response.marca);
                    $('#descrizione').val(response.descrizione);
                    $('#nota').val(response.nota);
                    magoCatOmo = response.magoCatOmo;
                    
                   	if(response.magoCatOmo){
                            $('#elimina').hide() ;
                            $('#descrizione').addClass("bg-yellow") ;
                            $('#magoDiv').html("<small id='magolabel' class='label bg-orange-active'> Mago "+ response.magoCatOmo+"</small>");
                        } else {
                        	$('#magoDiv').html("<small id='magolabel' class='label bg-orange-active'> Mago </small>");
    	                    $('#elimina').show();
    	                    $('#descrizione').removeClass("bg-yellow") ;
    	                    
                        }
                    	
                    $('#inserisci').removeClass('disabled');
                });
            }


            function modificamarca() {
                $('#formtitolo').text('Modifica marca');
                $('#modificaMode').removeClass('hidden');
                $('#form').removeClass('box-default');
                $('#form').addClass('box-danger animated pulse');
                $('#inserisci').text('Salva modifiche');
                $('#inserisci').show();
                $('input, select').prop('disabled',false);
                $('textarea').prop('disabled',false);
                $('#modifica,#elimina').hide();
                $('#marca').attr("disabled", true);
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-edit");
                if(magoCatOmo != "" && magoCatOmo != null){
                	$('#descrizione').addClass("bg-yellow") ;
                	$('#descrizione').attr("disabled", true);
                }
                
                $('html, body').animate({
                    scrollTop : 0
                }, 'fast');

                $('#boxregistrati').block({message: null});
            }

            function annullamodifica() {
            	idMarca = null;

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
                if (!idMarca) {

                    var datiIns = { 
                    	marca : $('#marca').val(),
                        descrizione : $('#descrizione').val(),
                        nota : $('#nota').val() ,
                    }

                    var inseriscimarca = $.post(server + 'secure/marche/inserisci',JSON.stringify(datiIns));

                    inseriscimarca.done(function() {
                        if (!errore) {
                            swal("Inserita", "", "success");
                            annullamodifica();
                        }
                        errore = false;
                    });
                } else {

                    var dati = {  
                    	idMarca: idMarca,
                    	marca : $('#marca').val(),
                        descrizione : $('#descrizione').val(),
                        nota : $('#nota').val(),
                    }
                    
                    var modificamarca = $.post(server + 'secure/marche/modifica',JSON.stringify(dati));

                    modificamarca.done(function() {
                        if (!errore) {
                            swal("Marca aggiornata", "", "success");
                            annullamodifica();
                        }
                        errore = false;
                        $('#descrizione').removeClass("bg-yellow") ;
                    });
                }
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-eye") ;
            });

            $('#marca, #descrizione, #nota').bind('keyup change ifChanged', function() {
                if (idMarca !="" && $('#marca').val().trim()  != "" && $('#descrizione').val().trim()  != "" && $('#nota').val().trim()  != "" )
                    $('#inserisci').removeClass('disabled');
                else
                    $('#inserisci').addClass('disabled');
            });

            function refresh() {
                $('#marcheEsistenti').html('<tr><th>Marca</th><th>Descrizione</th><th>Mago</th></tr>');
                var elencoMarche = $.getJSON(server + 'secure/marche/elenco');

                elencoMarche.done(function(response) {
                    for (i = 0; i < response.length; i++) {
                    	if(response[i].magoCatOmo!="" && response[i].magoCatOmo!=null){
                    		$('#marcheEsistenti').append('<tr style="cursor: pointer; cursor: hand;" onclick="mostra('+response[i].idMarca+')"><td>'+ response[i].marca +'</td><td>'+ response[i].descrizione +'</td>'
                    				+'<td><small id="magolabel" class="label bg-orange-active">'+ response[i].magoCatOmo+'</small></td></tr>');
                    	} else {
                    		$('#marcheEsistenti').append('<tr style="cursor: pointer; cursor: hand;" onclick="mostra('+response[i].idMarca+')"><td>'+ response[i].marca +'</td><td>'+ response[i].descrizione +'</td><td></td></tr>');                    		
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