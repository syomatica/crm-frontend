function prepimpostazioni() {
    $('.list-group.checked-list-box .list-group-item').each(function () {
        
        // Settings
        var $widget = $(this),
            $checkbox = $('<input type="checkbox" class="hidden" />'),
            color = ($widget.data('color') ? $widget.data('color') : "primary"),
            style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
            settings = {
                on: {
                    icon: 'glyphicon glyphicon-check'
                },
                off: {
                    icon: 'glyphicon glyphicon-unchecked'
                }
            };
            
        $widget.css('cursor', 'pointer')
        $widget.append($checkbox);

        // Event Handlers
        $widget.on('click', function () {
            $checkbox.prop('checked', !$checkbox.is(':checked'));
            $checkbox.triggerHandler('change');
            updateDisplay();
        });
        $checkbox.on('change', function () {
            updateDisplay();
        });
          

        // Actions
        function updateDisplay() {
            var isChecked = $checkbox.is(':checked');

            // Set the button's state
            $widget.data('state', (isChecked) ? "on" : "off");

            // Set the button's icon
            $widget.find('.state-icon')
                .removeClass()
                .addClass('state-icon ' + settings[$widget.data('state')].icon);

            // Update the button's color
            if (isChecked) {
                $widget.addClass(style + color + ' active');
            } else {
                $widget.removeClass(style + color + ' active');
            }
        }

        // Initialization
        function init() {
            
            if ($widget.data('checked') == true) {
                $checkbox.prop('checked', !$checkbox.is(':checked'));
            }
            
            updateDisplay();

            // Inject the icon if applicable
            if ($widget.find('.state-icon').length == 0) {
                $widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
            }
        }
        init();
    });
}

$('#applicaimpostazioni').on('click', function(event) {
    event.preventDefault();
    opzionitipo = [];
    $("#impostazioni li.active").each(function(idx, li) {
        opzionitipo.push($(this).attr('data-value'));
    });
    localStorage.setItem('tipo', opzionitipo);
    if(localStorage.getItem('tipo')){
    	localStorage.setItem('impostazioniattive',true);
    	impostazionifiltri();
    	applicafiltri();
    }else{
    	localStorage.setItem('impostazioniattive',false);
    	impostazionifiltri();
    	$('#resetfiltri').click();
    }
    noty({
		text : '<b>Impostazioni salvate</b>',
		type : 'success',
		layout : 'bottomCenter',
		timeout : 3000,
		animation : {
			open : 'animated flipInX',
			close : 'animated flipOutX',
			easing : 'swing',
			speed : 500
		}
	});
});