

                function aggiungiaddetto(){
                annullamodifica();
                $('#form').addClass('animated pulse');
                $('#boxregistrati').block({message: null});
                $('#inserimentoMode').removeClass('hidden');
                $('input, select').prop('disabled',false);
            }

         

            function mostra(id){
                idaddetto = id;
                $('input, select').prop('disabled',true);
                $('#modifica, #elimina').show();

                $('#inserisci').hide();

                var getAddetto = $.getJSON(server + 'secure/addetti/leggi', {
                    idAddetto : id
                });

      

                getAddetto.done(function(response) {
                    $('#titolo').val(response.titolo);
                    $('#addetto').val(response.addetto);
                    $('#telefono').val(response.telefono);
                    $('#fax').val(response.fax);
                    $('#cellulare').val(response.cellulare);
                    $('#mansione').val(response.idMansione);
                    $('#account').val(response.account);
                });
            }


            function modificaaddetto() {
                $('#formtitolo').text('Modifica addetto');
                $('#modificaMode').removeClass('hidden');
                $('#form').removeClass('box-default');
                $('#form').addClass('box-danger animated pulse');
                $('#inserisci').text('Salva modifiche');
                $('#inserisci').show();
                $('input, select').prop('disabled',false);
                $('#account').prop('disabled',true);
                $('#modifica,#elimina').hide();

                $('html, body').animate({
                    scrollTop : 0
                }, 'fast');

                //disabilito click lista

                $('#boxregistrati').block({message: null});
            }

            function annullamodifica() {
                idaddetto = null;
                $('#formtitolo').text('Dettagli');
                $('#modificaMode').addClass('hidden');
                $('#inserimentoMode').addClass('hidden');
                $('#form').removeClass('box-danger animated pulse');
                $('#form').addClass('box-success');
                $('#inserisci').text('Salva');
                $('#inserisci').show();
                $('#inserisci').addClass('disabled');
                $('input, select').prop('disabled',true);
                $('#modifica,#elimina').hide();
                $('#pulisci').click();
                $('#boxregistrati').unblock({message: null});
            }
            $('#inserisci').on('click', function(e) {
                if(!(($('#addetto').val()) && ($('#mansione').val()))){
                    noty({
                        text: '<b>Campo addetto e mansione sono obbligatori!</b>',
                        type: 'warning',
                        layout: 'topCenter',
                        timeout: 5000,
                        animation: {
                            open: 'animated flipInX',
                            close: 'animated flipOutX',
                            easing: 'swing',
                            speed: 500
                        }
                    });
                }else{
                    if (!idaddetto) {
                        var dati = {
                            titolo : $('#titolo').val(),
                            addetto : $('#addetto').val(),
                            telefono : $('#telefono').val(),
                            fax : $('#fax').val(),
                            cellulare: $('#cellulare').val(),
                            idMansione: parseInt($('#mansione').val()),
                            account : $('#account').val(),
                            email: "s",
                            pw: "s",
                            mansione: "s",
                            sincronizzaConMago: $('#sincronizza').is(":checked"),
                            firmaS: "s"
                        }
                        var inserisciAddetto = $.post(server + 'secure/addetti/inserisci',JSON.stringify(dati));

                        inserisciAddetto.done(function() {
                            if (!errore) {
                                swal("Inserito", "", "success");
                                annullamodifica();
                            }
                            errore = false;
                        });
                    } else {

                        var dati = {
                            idAddetto: idaddetto,

                            titolo : $('#titolo').val(),
                            addetto: $('#addetto').val(),
                            telefono : $('#telefono').val(),
                            fax : $('#fax').val(),
                            cellulare: $('#cellulare').val(),
                            idMansione: parseInt($('#mansione').val()),
                            account : $('#account').val(),

                        }
                        var modificaAddetto = $.post(server + 'secure/addetti/modifica',JSON.stringify(dati));

                        modificaAddetto.done(function() {
                            if (!errore) {
                                swal("Utente aggiornato", "", "success");
                                annullamodifica();
                                refresh();
                            }
                            errore = false;
                        });
                    }
                }
            });

            $('#titolo, #addetto, #telefono, #fax,#cellulare, #mansione, #account').bind('keyup change ifChanged', function() {
                if (!idaddetto && $('#titolo').val() != "" && $('#addetto').val() != "" && $('#telefono').val() != "" && $('#fax').val() != "" && $('#cellulare').val() != "" && $('#mansione').val() != "" && $('#account').val() != "")
                    $('#inserisci').removeClass('disabled');
                else if (idaddetto != "")
                    $('#inserisci').removeClass('disabled');
                else
                    $('#inserisci').addClass('disabled');
            });

            function refresh() {
                $('#addettiregistrati').html('<tr><th>Addetto</th><th>Mansione</th><th>Account</th></tr>');
                var elencoAddetti = $.getJSON(server + 'secure/addetti/elencoUtenti');

                elencoAddetti.done(function(response) {
                    for (i = 0; i < response.length; i++) {

                            $('#addettiregistrati').append('<tr style="cursor: pointer; cursor: hand;" onclick="mostra('+response[i].idAddetto+')"><td>'+response[i].addetto+'</td><td>'+ response[i].mansione +'</td><td>' + response[i].account + '</td></tr>');

                    }
                    Waves.attach('.btn',['waves-float','waves-block']);
                    Waves.init();
                });//utenti registrati
            }


