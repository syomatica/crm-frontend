var filtri = false;
var fine = false;
var pagina = 0;
var dettagliProd = null;
var prezzoV = null;
var _idProdotto = null;

function refreshProdotti(filtroCategoria,filtroFornitore,filtroSottocategoria,filtroMarca,filtroProdotto,filtroCodice,filtroCI,filtroPrezzo){
    if(filtri){
        var data = {
            pagina: pagina,
            idFornitore: filtroFornitore,
            idMarca: filtroMarca,
            idCategoria: filtroCategoria,
            idScategoria: filtroSottocategoria,
            prodotto: filtroProdotto,
            codice: filtroCodice,
            ci: parseInt(filtroCI,10),
            prezzoV: parseInt(filtroPrezzo,10)
        };

        if(!data.idFornitore)delete data.idFornitore;
        if(!data.idMarca)delete data.idMarca;
        if(!data.idCategoria)delete data.idCategoria;
        if(!data.idScategoria)delete data.idScategoria;
        if(!data.prodotto.trim())delete data.prodotto;
        if(!data.codice.trim())delete data.codice;
        if(!data.ci)delete data.ci;
        if(!data.prezzoV)delete data.prezzoV;
        if(!data.idUm)delete data.idUm;

        if(!fine)
            var elencoProdotti = $.post(server+'secure/prodotti/filters/elenco',JSON.stringify(data));
    }else
        var elencoProdotti = $.getJSON(server+'secure/prodotti/elenco?pagina='+pagina);



    elencoProdotti.success(function(response){
        if(response.length<100)
            fine=true;
        if(pagina==0)
            $('#elencoProdotti').html('<tr><th>ID</th><th>ID Fornitore</th><th>Prodotto</th><th>Codice interno</th><th>CI</th><th>Prezzo</th><th>Sconto</th></tr>');
        for(i=0;i<response.length;i++){
            $('#elencoProdotti').append('<tr class="wow fadeInUp" onclick="dettagliProdotto('+response[i].id+')" style="cursor: pointer; cursor: hand;"><td>'+response[i].id+'</td><td>'+response[i].idfornitore+'</td><td>'+response[i].prodotto+'</td><td>'+response[i].codice+'</td><td>'+response[i].ci+'</td><td>'+response[i].prezzo+'</td><td>'+response[i].sconto+'</td></tr>');
        }
    });
}
var start=false;
$(window).scroll(function () {
    if ($(window).scrollTop() == $(document).height() - $(window).height()&&start&&$('.elencoProdotti').is(":visible")) {
        avanti();
    }
    start=true;
});

function applicaFiltri(){
    filtri = true;
    pagina = 0;
    fine=false;
    refreshProdotti($('#filtroCategoria').val(),$('#filtroFornitore').val(),$('#filtroSottocategoria').val(),$('#filtroMarca').val(),$('#filtroProdotto').val(),$('#filtroCodice').val(),$('#filtroCI').val(),$('#filtroPrezzo').val());
}

function resetFiltri(){
    filtri = false;
    pagina = 0;
    fine=false;
    $('#filtroCategoria,#filtroFornitore,#filtroSottocategoria,#filtroMarca,#filtroProdotto,#filtroCodice,#filtroCI,#filtroPrezzo').val(null).trigger('change');
    refreshProdotti();
}

function avanti(){
    pagina++;
    filtri?refreshProdotti($('#filtroCategoria').val(),$('#filtroFornitore').val(),$('#filtroSottocategoria').val(),$('#filtroMarca').val(),$('#filtroProdotto').val(),$('#filtroCodice').val(),$('#filtroCI').val(),$('#filtroPrezzo').val()):refreshProdotti();
}

var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

function elencoProdotti(){
    $('#elencoDepliant ul').text(null);
    Dropzone.forElement("#depliantIT,#depliantFR,#depliantSP,#depliantAR,#depliantEN").removeAllFiles(true);

    $('.mascheraProdotto').hide();
    $('.elencoProdotti').show().addClass('animated slideInLeft').one(animationEnd,function(){
        $(this).removeClass('animated slideInLeft');
    });
    $('.boxGenerali').hide();
    $('.boxFornitori').hide();
}

function dettagliProdotto(id){
    _idProdotto = id;
    var richiestaProdotto = $.getJSON(server+'secure/prodotti/readByKey?idProdotto='+id);

    richiestaProdotto.success(function(response){
        var richiestaDettagli = $.getJSON(server+'secure/prodotti/dettagli/readByKey?idDettagli='+id);

        $('#idProdotto').text(response.id);
        $('#l2mProdotto').text(response.magoArticolo);
        $('#prodotto').val(response.prodotto);
        $('#codiceinterno').val(response.codice);
        $('#merce').iCheck(response.isGood?'check':'uncheck');
        $('#disattivo').iCheck(response.obsoleto?'check':'uncheck');
        $('#disponibile').iCheck(response.utok?'check':'uncheck');
        $('#prezzovendita').val(response.prezzoV);
        $('#categoriaform').val(response.categoria.id?response.categoria.categoria+': '+response.categoria.descrizione:null);
        $('#scategoriaform').val(response.scategoria.id?response.scategoria.sottoCategoria+': '+response.scategoria.descrizione:null);
        $('#marcaform').val(response.marca.id?response.marca.marca+': '+response.marca.descrizione:null);
        $('#unitadimisura').val(response.um.id?response.um.um+': '+response.um.descrizione:null);
        $('#fornitorePref').text(response.fornitore.id?response.fornitore.societa:null);
        $('#prezzoPref').text(response.costoA);

        if(!response.depliant&&!response.depliantAR&&!response.depliantEN&&!response.depliantFR&&!response.depliantSP)
            $('#elencoDepliant ul').append('<h3 class="text-center">Non ci sono depliant per questo prodotto.</h3>');
        else{
            if(response.depliant)
                $('#elencoDepliant ul').append('<li class="item"><div class="product-img"><img src="../assets/img/pdf.png"></div><div class="product-info"><a onclick="openDocument(\''+response.id+'\',\'IT\')" href="#" class="product-title">Italiano</a><span class="product-description">'+response.depliant+'<span style="cursor: pointer; cursor: hand;" onclick="deleteDepliant('+response.id+',\'IT\')" class="label label-danger pull-right">ELIMINA</span></a></span></div></li>');
            if(response.depliantAR)
                $('#elencoDepliant ul').append('<li class="item"><div class="product-img"><img src="../assets/img/pdf.png"></div><div class="product-info"><a onclick="openDocument(\''+response.id+'\',\'AR\')" href="#" class="product-title">Arabo</a><span class="product-description">'+response.depliantAR+'<span style="cursor: pointer; cursor: hand;" onclick="deleteDepliant('+response.id+',\'AR\')" class="label label-danger pull-right">ELIMINA</span></a></span></div></li>');
            if(response.depliantEN)
                $('#elencoDepliant ul').append('<li class="item"><div class="product-img"><img src="../assets/img/pdf.png"></div><div class="product-info"><a onclick="openDocument(\''+response.id+'\',\'EN\')" href="#" class="product-title">Inglese</a><span class="product-description">'+response.depliantEN+'<span style="cursor: pointer; cursor: hand;" onclick="deleteDepliant('+response.id+',\'EN\')" class="label label-danger pull-right">ELIMINA</span></a></span></div></li>');
            if(response.depliantFR)
                $('#elencoDepliant ul').append('<li class="item"><div class="product-img"><img src="../assets/img/pdf.png"></div><div class="product-info"><a onclick="openDocument(\''+response.id+'\',\'FR\')" href="#" class="product-title">Francese</a><span class="product-description">'+response.depliantFR+'<span style="cursor: pointer; cursor: hand;" onclick="deleteDepliant('+response.id+',\'FR\')" class="label label-danger pull-right">ELIMINA</span></a></span></div></li>');
            if(response.depliantSP)
                $('#elencoDepliant ul').append('<li class="item"><div class="product-img"><img src="../assets/img/pdf.png"></div><div class="product-info"><a onclick="openDocument(\''+response.id+'\',\'SP\')" href="#" class="product-title">Spagnolo</a><span class="product-description">'+response.depliantSP+'<span style="cursor: pointer; cursor: hand;" onclick="deleteDepliant('+response.id+',\'SP\')" class="label label-danger pull-right">ELIMINA</span></a></span></div></li>');
        }
        prezzoV = response.prezzoV;
        $('#ci').val(response.ci);


        richiestaDettagli.success(function(response){
            dettagliProd=response;

            $('#idDettaglioprodotto').text(response[0].id);
            $('#l2mArticolo').text(response[0].magoArticolo);
            $('#l2mFornitore').text(response[0].magoFornitore);
            $('#codiceFornitore').val(response[0].codice);
            $('#costoLordo').val(response[0].prezzoA);
            $('#percentualeSconto1').val(response[0].scontoA1);
            $('#percentualeSconto2').val(response[0].scontoA2);
            $('#percentualeSconto3').val(response[0].scontoA3);
            $('#dettaglioData').val(moment(response[0].data,'YYYY-MM-DD HH:mm:ss').format('LLL'));
            $('#numerofornitori').val(Object.keys(response).length);

            $('#pagineFornitori').text(response.length);

            var costoNetto = parseFloat(response[0].prezzoA,10)*(1-parseFloat(response[0].scontoA1,10)/100)*(1-parseFloat(response[0].scontoA2,10)/100)*(1-parseFloat(response[0].scontoA3,10)/100);
            var ricarico = costoNetto != 0 ? 100*(parseFloat(prezzoV,10)-costoNetto)/costoNetto:0;

            $('#costoNetto').val(costoNetto.toFixed(2));
            $('#ricarico').val(ricarico.toFixed(2));

            $('#dettaglioFornitore').val(response[0].fornitore.id?response[0].fornitore.societa:null);
            $('#addetto').val(response[0].addetto.id?response[0].addetto.addetto:null);


        }); //richiestaDettagli

    }); //richiestaProdotto

    $('.elencoProdotti').hide();
    $('.mascheraProdotto').show().addClass('animated slideInRight').one(animationEnd,function(){
        $(this).removeClass('animated slideInRight');
    });

    if($('#generale').hasClass('active')){
        setTimeout(function(){
            $('.boxGenerali').show().addClass('animated bounceInDown').one(animationEnd,function(){
                $(this).removeClass('animated bounceInDown');
            });
        }, 400);
    }else{
        $('#tabgenerale').click();
    }
}

var count=0;
function avantiDettaglio(){
    if(count<dettagliProd.length-1)count++;
    if(dettagliProd.length>1&&count<=dettagliProd.length-1){
        console.log(count);
        $('#fornitori :input').val(null);
        $('#numerofornitori').val(dettagliProd.length);

        $('#idDettaglioprodotto').text(dettagliProd[count].id);
        $('#l2mArticolo').text(dettagliProd[count].magoArticolo);
        $('#l2mFornitore').text(dettagliProd[count].magoFornitore);
        $('#codiceFornitore').val(dettagliProd[count].codice);
        $('#costoLordo').val(dettagliProd[count].prezzoA);
        $('#percentualeSconto1').val(dettagliProd[count].scontoA1);
        $('#percentualeSconto2').val(dettagliProd[count].scontoA2);
        $('#percentualeSconto3').val(dettagliProd[count].scontoA3);
        $('#dettaglioData').val(moment(dettagliProd[count].data,'YYYY-MM-DD HH:mm:ss').format('LLL'));

        $('#pagineFornitori').text(count+1+'/'+response.length);

        var costoNetto = parseFloat(dettagliProd[count].prezzoA,10)*(1-parseFloat(dettagliProd[count].scontoA1,10)/100)*(1-parseFloat(dettagliProd[count].scontoA2,10)/100)*(1-parseFloat(dettagliProd[count].scontoA3,10)/100);
        var ricarico = costoNetto != 0 ? 100*(parseFloat(prezzoV,10)-costoNetto)/costoNetto:0;

        $('#costoNetto').val(costoNetto.toFixed(2));
        $('#ricarico').val(ricarico.toFixed(2));

        $('#dettaglioFornitore').val(dettagliProd[count].fornitore.id?dettagliProd[count].fornitore.societa:null);
        $('#addetto').val(dettagliProd[count].addetto.id?dettagliProd[count].addetto.addetto:null);

    }
}

function indietroDettaglio(){
    if(count>0)count--;
    if(dettagliProd.length>1&&count>=0){
        console.log(count);

        $('#idDettaglioprodotto').text(dettagliProd[count].id);
        $('#l2mArticolo').text(dettagliProd[count].magoArticolo);
        $('#l2mFornitore').text(dettagliProd[count].magoFornitore);
        $('#codiceFornitore').val(dettagliProd[count].codice);
        $('#costoLordo').val(dettagliProd[count].prezzoA);
        $('#percentualeSconto1').val(dettagliProd[count].scontoA1);
        $('#percentualeSconto2').val(dettagliProd[count].scontoA2);
        $('#percentualeSconto3').val(dettagliProd[count].scontoA3);
        $('#dettaglioData').val(moment(dettagliProd[count].data,'YYYY-MM-DD HH:mm:ss').format('LLL'));

        $('#pagineFornitori').text(count+1+'/'+response.length);

        var costoNetto = parseFloat(dettagliProd[count].prezzoA,10)*(1-parseFloat(dettagliProd[count].scontoA1,10)/100)*(1-parseFloat(dettagliProd[count].scontoA2,10)/100)*(1-parseFloat(dettagliProd[count].scontoA3,10)/100);
        var ricarico = costoNetto !== 0 ? 100+(parseFloat(prezzoV,10)-costoNetto)/costoNetto:0;

        $('#costoNetto').val(costoNetto.toFixed(2));
        $('#ricarico').val(ricarico.toFixed(2));

        $('#dettaglioFornitore').val(dettagliProd[count].fornitore.id?dettagliProd[count].fornitore.societa:null);
        $('#addetto').val(dettagliProd[count].addetto.id?dettagliProd[count].addetto.addetto:null);
    }
}

function openDocument(id,ln){
    var data = {
        file: server+'secure/prodotti/downloadDepliant',
        id: id,
        ln: ln
    };
    window.open('../assets/viewer.html?'+$.param(data));
}

function dettagliFornitore(){
    $('.boxGenerali').hide();
    $('.boxFornitori').show().addClass('animated bounceInDown').one(animationEnd,function(){
        $(this).removeClass('animated bounceInDown');
    });
}

function dettagliGenerali(){
    $('.boxFornitori').hide();
    $('.boxGenerali').show().addClass('animated bounceInDown').one(animationEnd,function(){
        $(this).removeClass('animated bounceInDown');
    });
}

function refreshDepliant(){
    var richiestaProdotto = $.getJSON(server+'secure/prodotti/readByKey?idProdotto='+_idProdotto);

    richiestaProdotto.success(function(response){
        $('#elencoDepliant ul').text(null);
        if(!response.depliant&&!response.depliantAR&&!response.depliantEN&&!response.depliantFR&&!response.depliantSP)
            $('#elencoDepliant ul').append('<h3 class="text-center">Non ci sono depliant per questo prodotto.</h3>');
        else{
            if(response.depliant)
                $('#elencoDepliant ul').append('<li class="item"><div class="product-img"><img src="../assets/img/pdf.png"></div><div class="product-info"><a onclick="openDocument(\''+response.id+'\',\'IT\')" href="#" class="product-title">Italiano</a><span class="product-description">'+response.depliant+'<span style="cursor: pointer; cursor: hand;" onclick="deleteDepliant('+response.id+',\'IT\')" class="label label-danger pull-right">ELIMINA</span></a></span></div></li>');
            if(response.depliantAR)
                $('#elencoDepliant ul').append('<li class="item"><div class="product-img"><img src="../assets/img/pdf.png"></div><div class="product-info"><a onclick="openDocument(\''+response.id+'\',\'AR\')" href="#" class="product-title">Arabo</a><span class="product-description">'+response.depliantAR+'<span style="cursor: pointer; cursor: hand;" onclick="deleteDepliant('+response.id+',\'AR\')" class="label label-danger pull-right">ELIMINA</span></a></span></div></li>');
            if(response.depliantEN)
                $('#elencoDepliant ul').append('<li class="item"><div class="product-img"><img src="../assets/img/pdf.png"></div><div class="product-info"><a onclick="openDocument(\''+response.id+'\',\'EN\')" href="#" class="product-title">Inglese</a><span class="product-description">'+response.depliantEN+'<span style="cursor: pointer; cursor: hand;" onclick="deleteDepliant('+response.id+',\'EN\')" class="label label-danger pull-right">ELIMINA</span></a></span></div></li>');
            if(response.depliantFR)
                $('#elencoDepliant ul').append('<li class="item"><div class="product-img"><img src="../assets/img/pdf.png"></div><div class="product-info"><a onclick="openDocument(\''+response.id+'\',\'FR\')" href="#" class="product-title">Francese</a><span class="product-description">'+response.depliantFR+'<span style="cursor: pointer; cursor: hand;" onclick="deleteDepliant('+response.id+',\'FR\')" class="label label-danger pull-right">ELIMINA</span></a></span></div></li>');
            if(response.depliantSP)
                $('#elencoDepliant ul').append('<li class="item"><div class="product-img"><img src="../assets/img/pdf.png"></div><div class="product-info"><a onclick="openDocument(\''+response.id+'\',\'SP\')" href="#" class="product-title">Spagnolo</a><span class="product-description">'+response.depliantSP+'<span style="cursor: pointer; cursor: hand;" onclick="deleteDepliant('+response.id+',\'SP\')" class="label label-danger pull-right">ELIMINA</span></a></span></div></li>');
        }
    });
}

function deleteDepliant(id,ln){
    var eliminaDepliant = null;

    swal({
        title: '',
        text : "Il depliant sarà dissociato da questo prodotto",
        type : 'warning',
        confirmButtonText : "Dissocia",
        cancelButtonText : "Annulla",
        showCancelButton : true,
        closeOnConfirm : false,
        showLoaderOnConfirm : true
    }, function() {
        if(ln=="IT")
            eliminaDepliant =$.post(server+'secure/prodotti/modifica',JSON.stringify({
                depliant: null,
                idProdotto: id
            }));
        else if(ln=="AR")
            eliminaDepliant =$.post(server+'secure/prodotti/modifica',JSON.stringify({
                depliantAR: null,
                idProdotto: id
            }));
        else if(ln=="FR")
            eliminaDepliant =$.post(server+'secure/prodotti/modifica',JSON.stringify({
                depliantFR: null,
                idProdotto: id
            }));
        else if(ln=="SP")
            eliminaDepliant =$.post(server+'secure/prodotti/modifica',JSON.stringify({
                depliantSP: null,
                idProdotto: id
            }));
        else if(ln=="EN")
            eliminaDepliant =$.post(server+'secure/prodotti/modifica',JSON.stringify({
                depliantEN: null,
                idProdotto: id
            }));

        eliminaDepliant.success(function(){
            swal("", "Dissociato con successo", "success");
            refreshDepliant();
        });
    });
}

$('#dettagliProdotto :input').keydown(false);
