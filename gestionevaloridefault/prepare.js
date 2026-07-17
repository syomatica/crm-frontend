var causaMorte = sessionStorage.getItem('causaMorte');
var descrizione = sessionStorage.getItem('descrizione');
var idCausaMorte = sessionStorage.getItem('idCausaMorte');

// $(document).ready(function () {
//     $('#valoreL').select2({});

//     refresh();

//     $('#pulisci').on('click', function () {
//         $("#causaMorte, #descrizione").val(null);
//         $('#descrizione').css("background-color", "");
//         $('#inserisci').addClass('disabled');
//     });

//     var idTipo = null;

//     $('#modifica, #elimina').hide();
//     $('input, select').prop('disabled', true);
//     $('textarea').prop('disabled', true);
// });

$(document).ready(function () {
    /* nuova gestione lista e interazione parametri default */
    if ($('#valoriDefaultEsistenti').length > 0) {
        loadList();

        $('#btnModifica').on('click', enterEditMode);
        $('#btnAnnulla').on('click', cancelEdit);
        $('#btnSalva').on('click', saveValue);

        $('#valoriDefaultEsistenti').on('click', 'tr', function () {
            loadDetail($(this).data('id'));
        });

        $('#btnSalva, #btnAnnulla').addClass('hidden');
        $('#btnModifica').removeClass('hidden');
    }
});

