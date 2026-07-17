
function refresh() {
                $('#valoriDefaultEsistenti').html('<tr><th style="text-align:left">Parametro</th style="text-align:left"><th style="text-align:left">Valore</th><th style="text-align:left">Note</th></tr>');
                var elencoValoriDefault = $.getJSON(server + 'secure/configvalues/elenco');
                $('#valoreL').select2("close").parent().hide();
                $('#valore').show();
                elencoValoriDefault.done(function(response) {
                    for (i = 0; i < response.length; i++) {
                    	
                    		$('#valoriDefaultEsistenti').append('<tr style="cursor: pointer; cursor: hand;text-align:left" onclick="mostra('+response[i].idConfigValues+')"><td>'+ response[i].parametro +'</td><td>'+ response[i].valore +'</td><td style="min-width:400px" >'+ response[i].note +'</td><td></td></tr>');                    		
                    	
                    }
                    Waves.attach('.btn',['waves-float','waves-block']);
                    Waves.init();
                })
            }
/*function aggiungiCausaMorte(){
                annullamodifica();
                $('#form').addClass('animated pulse');
                $('#boxregistrati').block({message: null});
                $('#inserimentoMode').removeClass('hidden');
                $('input, select').prop('disabled',false);
                $('textarea').prop('disabled',false);
            	
            	$('#descrizione').removeClass("bg-yellow") ;
            	resetSchedaicon();
            	$('#scheda-icon').addClass("fa fa-plus-square") ;
            	
            } */
         function annullamodifica() {
                idConfigValues = null;
                $('#valoreL').select2({placeholder: "Select a state"});
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
                $('#valore').removeClass("bg-yellow") ;
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
               
                $('#valoreL').empty();
           
                if(id==9||id==10||id==11||id==12||id==13||id==17||id==18||id==19||id==20||id==22||id==25||id==26||id==27||id==28||id==29||id==30||id==31||id==32||id==36||id==37){
                    $('#valoreL').select2("close").parent().show();
                    $('#valore').hide();
                   }else{$('#valoreL').select2("close").parent().hide();$('#valore').prop('disabled',false);$('#valore').show();}
            
                switch (id) {
                    case 9:
                        var richiestaCombo = $.getJSON(server+'/secure/service/combomarche');
                                richiestaCombo.success(function(r){
                                
                                    var dati = {};

                                //MARCHE
                                var select;
                        //        var marche = r.marca;
                                var length = r.length;
                                for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].id+'">'+r[i].id+' | '+r[i].marca+'</option>';
                                dati.marche = select;
                              $('#valoreL').append(dati.marche);
                                     
                                  
                                });
                        break;
                    case 10:
                        $('#valoreL').show();
                       var richiestaCombo = $.getJSON(server+'/secure/service/combounitamisura');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //unitamisura
                                var select;
                        
                                var length = r.length;
                                for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].id+'">'+r[i].id+' | '+r[i].um+'</option>';
                                dati.um = select;
                                $('#valoreL').append(dati.um);

                                }); 
                        break;
                    case 11:
                        $('#valoreL').show();
                        var richiestaCombo = $.getJSON(server+'/secure/service/combosottocategorie');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //sottoCategoria
                                var select;
                        
                                var length = r.length;
                                for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].id+'">'+r[i].id+' | '+r[i].sottoCategoria+'</option>';
                                dati.sottoCategoria = select;
                                $('#valoreL').append(dati.sottoCategoria);

                                }); 
                                break;
                    case 12:
                        $('#valoreL').empty();
                         $('#valoreL').show();
                        var richiestaCombo = $.getJSON(server+'/secure/service/combocategorie');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //categoria
                                var select;
                        
                                var length = r.length;
                                for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].id+'">'+r[i].id+' | '+r[i].categoria+'</option>';
                                dati.categoria = select;
                                $('#valoreL').append(dati.categoria);
                             
                                }); 
                                break;
                    case 13:
                         $('#valoreL').show();
                        var richiestaCombo = $.getJSON(server+'/secure/service/combofornitori');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //fornitori
                                var select;
                        
                                var length = r.length;
                                for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].id+'">'+r[i].id+' | '+r[i].societa+'</option>';
                                dati.societa = select;
                                $('#valoreL').append(dati.societa);

                                }); 
                                break;
                    case 17:
                          $('#valoreL').show();
                        var richiestaCombo = $.getJSON(server+'/secure/configvalues/combotipiclifo');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //tipiclifo
                                var select;
                        
                                var length = r.length;
                                for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].id+'">'+r[i].id+' | '+r[i].tipoCliFo+'</option>';
                                dati.tipoCliFo = select;
                                $('#valoreL').append(dati.tipoCliFo);

                                }); 
                                break;
                    case 18:    
                        $('#valoreL').show();
                        var richiestaCombo = $.getJSON(server+'/secure/configvalues/combocanali');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //CAnale
                                var select;
                        
                                var length = r.length;
                                for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].id+'">'+r[i].id+' | '+r[i].canale+'</option>';
                                dati.canale = select;
                                $('#valoreL').append(dati.canale);

                                }); 
                                break;
                    case 19:
                         $('#valoreL').show();
                        var richiestaCombo = $.getJSON(server+'/secure/service/combofornitori');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //fornitori
                                var select;
                        
                                var length = r.length;
                                for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].id+'">'+r[i].id+' | '+r[i].societa+'</option>';
                                dati.societa = select;
                                $('#valoreL').append(dati.societa);

                                }); 
                                break;
                    case 20:
                         $('#valoreL').show();
                        var richiestaCombo = $.getJSON(server+'/secure/configvalues/comboclienti');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //clienti
                                var select;
                        
                                var length = r.length;
                                for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].id+'">'+r[i].id+' | '+r[i].societa+'</option>';
                                dati.societa = select;
                                $('#valoreL').append(dati.societa);

                                }); 
                                break;    
                    case 22:
                         $('#valoreL').show();
                        var richiestaCombo = $.getJSON(server+'/secure/configvalues/comboimpianti');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //impianti
                                var select;
                        
                                var length = r.length;
                                for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].id+'">'+r[i].id+' | '+r[i].descrizione+'</option>';
                                dati.descrizione = select;
                                $('#valoreL').append(dati.descrizione);

                                }); 
                                break;    
                    case 25:
                         $('#valoreL').show();
                        var richiestaCombo = $.getJSON(server+'/secure/configvalues/comboagente');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //agenti
                                var select;
                        
                                var length = r.length;
                                for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].id+'">'+r[i].id+' | '+r[i].agente+'</option>';
                                dati.descrizione = select;
                                $('#valoreL').append(dati.descrizione);

                                }); 
                                break;        
                     case 26:
                         $('#valoreL').show();
                        var richiestaCombo = $.getJSON(server+'/secure/categoriePreventivo/elenco');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //categoriepreventivo
                                var select;
                        
                                var length = r.length;
                                for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].idCategoria+'">'+r[i].idCategoria+' | '+r[i].categoria+'</option>';
                                dati.categoria = select;
                                $('#valoreL').append(dati.categoria);

                                }); 
                                break;    
                    case 27:
                         $('#valoreL').show();
                        var richiestaCombo = $.getJSON(server+'/secure/service/combocapitoli');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //capitoli/messaggi
                                var select;
                        
                                var length = r.length;
                                for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].id+'">'+r[i].id+' | '+r[i].titolo+'</option>';
                                dati.titolo = select;
                                $('#valoreL').append(dati.titolo);

                                }); 
                                break;            
                         
                    case 28:
                         $('#valoreL').show();
                        var richiestaCombo = $.getJSON(server+'/secure/tipoPreventivo/elenco');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //tipo preventivo
                                var select;
                        
                                var length = r.length;
                                for(i=0;i<length;i++)
                                    
                                select+='<option value="'+r[i].idTipo+'">'+r[i].idTipo+' | '+r[i].tipo+'</option>';
                                dati.tipo = select;
                                $('#valoreL').append(dati.tipo);

                                }); 
                                break;
                    case 29:
                         $('#valoreL').show();
                        var richiestaCombo = $.getJSON(server+'secure/configvalues/combotipiimpianto');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //tipiimpianto
                                var select;
                        
                                var length = r.length;
                                for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].id+'">'+r[i].id+' | '+r[i].tipoImpianto+'</option>';
                                dati.tipoImpianto = select;
                                $('#valoreL').append(dati.tipoImpianto);

                                }); 
                                break;       
                     case 30:
                         $('#valoreL').show();
                        var richiestaCombo = $.getJSON(server+'secure/configvalues/comboutentiimpianti');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //utentiimpianti
                                var select;
                        
                                var length = r.length;
                                for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].id+'">'+r[i].id+' | '+r[i].cognome+'</option>';
                                dati.cognome = select;
                                $('#valoreL').append(dati.cognome);

                                }); 
                                break; 
                     case 31:
                         $('#valoreL').show();
                        var richiestaCombo = $.getJSON(server+'secure/configvalues/combotecniciimpianto');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //tecniciimpianti
                                var select;
                        
                                var length = r.length;
                                for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].id+'">'+r[i].id+' | '+r[i].cognome+'</option>';
                                dati.cognome = select;
                                $('#valoreL').append(dati.cognome);

                                }); 
                                break; 
                     case 32:
                         $('#valoreL').show();
                        var richiestaCombo = $.getJSON(server+'secure/configvalues/combotipicontratto');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //tipicontratto
                                var select;
                        
                                var length = r.length;
                                for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].id+'">'+r[i].id+' | '+r[i].tipoContratto+'</option>';
                                dati.tipoContratto = select;
                                $('#valoreL').append(dati.tipoContratto);

                                }); 
                                break;        
                     case 36:
                         $('#valoreL').show();
                        var richiestaCombo = $.getJSON(server+'/secure/causemorti/elenco');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //causaMorte
                                var select;
                        
                                var length = r.length;
                                for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].idCausaMorte+'">'+r[i].idCausaMorte+' | '+r[i].causaMorte+'</option>';
                                dati.causaMorte = select;
                                $('#valoreL').append(dati.causaMorte);

                                }); 
                                break;            
                    case 37:
                         $('#valoreL').show();
                        var richiestaCombo = $.getJSON(server+'/secure/mansioni/elenco');
                                richiestaCombo.success(function(r){
                                var dati = {};

                                //mansione
                                var select;
                        
                                var length = r.length;
                                for(i=0;i<length;i++)
                                    select+='<option value="'+r[i].idMansione+'">'+r[i].idMansione+' | '+r[i].mansione+'</option>';
                                dati.mansione = select;
                                $('#valoreL').append(dati.mansione);

                                }); 
                                break;                  
                    default: 
                              $('#valoreL').select2("close").parent().hide();
                                
                            }
                                               
                                               
                
                
                idConfigValues = id;
                $('input, select').prop('disabled',true);
                $('textarea').prop('disabled',true);
                $('#modifica').show();

                $('#inserisci').hide();

                var getValues = $.getJSON(server + 'secure/configvalues/leggi', {
                	idConfigValues : idConfigValues
                });

                getValues.done(function(response) {
                    $('#parametro').val(response.parametro);
                    $('#valore').val(response.valore);
                    $('#valoreL').select2({placeholder:response.valore2});
                    $('#note').val(response.note);   	
                    $('#inserisci').removeClass('disabled');
                });
                
            }
             function modificaval() {
                 $('#valoreL').select2({placeholder: "Select a state",});
                $('#formtitolo').text('Modifica Valore');
                $('#modificaMode').removeClass('hidden');
                $('#form').removeClass('box-default');
                $('#form').addClass('box-danger animated pulse');
                $('#inserisci').text('Salva modifiche');
                $('#inserisci').show();
                $('input, select').prop('disabled',false);
                $('textarea').prop('disabled',true);
                $('#parametro').prop("disabled", true);
                $('#modifica,#elimina').hide();
                
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-edit");
                
                
                $('html, body').animate({
                    scrollTop : 0
                }, 'fast');


                $('#boxregistrati').block({message: null});
                

            }
                
    /*       function eliminaCausa() {
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
            }*/
            $('#inserisci').on('click', function(e) {
               
                        if($('#valoreL').val()){
                            var valore_ = $('#valoreL').val();
                        }else{var valore_ = $('#valore').val();}
                    var dati = {  
                    	idConfigValues: idConfigValues,
                    	parametro : $('#parametro').val(),
                        valore : valore_,
                        note : $('#note').val(),
                       
                    }
                    
                console.log(dati.valore);
                    var modificaCausa = $.post(server + 'secure/configvalues/modifica',JSON.stringify(dati));

                    modificaCausa.success(function() {
                        errore = false;
                        if (!errore) {
                            swal("Valore aggiornato", "", "success");
                            annullamodifica();
                            refresh();
                        }
                        
                    	$('#descrizione').removeClass("bg-yellow") ;
                    });
            //    } 
                
                resetSchedaicon();
                $('#scheda-icon').addClass("fa fa-eye") ;
            });
         /*   $('#causaMorte, #descrizione').bind('keyup change ifChanged', function() {
                if (idCausaMorte !="" && $('#causaMorte').val().trim()  != "" && $('#descrizione').val().trim()  != "")
                    $('#inserisci').removeClass('disabled');
                else
                    $('#inserisci').addClass('disabled');
            }); */

function loadList() {
    const $tbody = $('#valoriDefaultEsistenti'); 
    $tbody.empty();

    $.getJSON(server + 'secure/parametri/list', function (rows) {
        rows.forEach(r => {
            $tbody.append(`
                <tr data-id="${r.id}" style="cursor:pointer">
                    <td>${r.note}</td>
                </tr>
            `);
        });
    });
}




// CLICK RIGHE
$('#valoriDefaultEsistenti').on('click', 'tr', function () {
    loadDetail($(this).data('id'));
});


let currentItem = null;

function loadDetail(id) {
    $.getJSON(server + 'secure/parametri/getById', { id: id }, function (obj) {
        currentItem = obj;

        $('#schedaTitolo').text(obj.note);
        renderValue(obj, false);
        $('#btnModifica').removeClass('hidden');
        $('#btnSalva, #btnAnnulla').addClass('hidden');
    });
}

function renderValue(item, editable) {
    const $v = $('#valueContainer');
    const dis = editable ? '' : 'disabled';
    let html = '';

    switch (item.campo) {
        case 'TEXT':
            html = `<textarea id="valField" rows="6" class="form-control" ${dis}>${item.valore || ''}</textarea>`;
            break;

        case 'INT':
            html = `<input id="valField" type="text" pattern="\\d+" inputmode="numeric" class="form-control" value="${item.valore || ''}" ${dis}>`;
            break;

        case 'MONEY':
        case 'EUR': {
            if (!editable) {
                const val = (item.valore !== null && item.valore !== undefined)
                    ? parseFloat(item.valore).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })
                    : '—';
                html = `<p class="form-control-static">${val}</p>`;
            } else {
                const val = (item.valore !== null && item.valore !== undefined) ? item.valore : '0.00';
                html = `<input id="valField" type="number" step="0.01" class="form-control" value="${val}">`;
            }
            break;
        }

        case 'DOUBLE':
        case 'DBL': 
            if (!editable) {
                const val = (item.valore !== null && item.valore !== undefined)
                    ? parseFloat(item.valore).toLocaleString('it-IT', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
                    : '—';
                html = `<p class="form-control-static">${val}</p>`;
            } else {
                const val = (item.valore !== null && item.valore !== undefined) ? item.valore : '0.0000';
                html = `<input id="valField" type="number" step="0.0001" class="form-control" value="${val}">`;
            }
            break;

        case 'IMG': {
            const src = item.valore
                ? `data:image/*;base64,${item.valore}`
                : '';
            if (editable) {
                // input visibile + img vuota (o pre-caricata) che si aggiorna al change
                html  = `<img id="imgPreview" src="${src}" class="img-responsive center-block mb-2"/>`;
                html += `<input id="valField" type="file"
                            accept=".jpg,.jpeg,.png"
                            class="form-control">`;
            } else {
                // solo preview se NON in edit
                html = src
                    ? `<img src="${src}" class="img-responsive center-block mb-2"/>`
                    : '<p class="text-muted">(nessuna immagine)</p>';
            }
            break;
        }

    }
    $v.html(html);
    if (item.campo === 'IMG' && editable) {
    $('#valField').on('change', function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => $('#imgPreview').attr('src', e.target.result);
        reader.readAsDataURL(file);
    });
}

}

function enterEditMode() {
    $('#btnModifica').addClass('hidden');
    $('#btnSalva, #btnAnnulla').removeClass('hidden');
    renderValue(currentItem, true);
}

function cancelEdit() {
    renderValue(currentItem, false);
    $('#btnModifica').removeClass('hidden');
    $('#btnSalva, #btnAnnulla').addClass('hidden');

}

function saveValue() {
    const send = val => {
        $.ajax({
            url: server + 'secure/parametri/update',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: currentItem.id,
                valore: val
            }),
            success: () => {
                currentItem.valore = val;
                renderValue(currentItem, false);
                $('#btnModifica').removeClass('hidden');
                $('#btnSalva, #btnAnnulla').addClass('hidden');
            }
        });
    };

    const rawVal = $('#valField').val().trim();

    if (currentItem.campo === 'INT') {
        if (!/^-?\d+$/.test(rawVal)) {
            swal("Errore", "Inserisci un numero intero valido (senza virgole o punti).", "error");
            return;
        }
    }

    if (currentItem.campo === 'IMG') {
        const file = $('#valField')[0].files[0];
        if (!file) return;
        const r = new FileReader();
        r.onload = e => send(e.target.result.split(',')[1]);
        r.readAsDataURL(file);
    } else {
        send(rawVal);
    }
}




$(function () {
    $('#btnModifica').on('click', enterEditMode);
    $('#btnAnnulla').on('click', cancelEdit);
    $('#btnSalva').on('click', saveValue);
});


