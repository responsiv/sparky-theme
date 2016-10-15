/*
 * Form validation specifically for OctoberCMS
 */

+function ($) { "use strict";

    //
    // Events
    //

    $(window).on('ajaxInvalidField', function(event, fieldElement, fieldName, errorMsg, isFirst) {
        event.preventDefault()

        // Only show one error at a time, remove this expression
        // to show errors on all invalid fields at once
        if (isFirst) {
            showError($(fieldElement), errorMsg, isFirst)
        }
    })

    $(document).on('ajaxPromise', '[data-request]', function() {
        hideErrors($(this).closest('form'))
    })

    //
    // Actions
    //

    function suppressAlert() {
        $(window).one('ajaxError', function(event, message){
            event.preventDefault()
        })
    }

    function showError($input, errorMsg, isFirst) {
        if (
            showAlertError($input, errorMsg, isFirst) ||
            showFormGroupError($input, errorMsg, isFirst)
        ) {
            suppressAlert()

            $input.on('change', function() {
                $(this).trigger('clearError')
            })
        }
    }

    function hideErrors($form) {
        if (!!$form.length) {
            $('input, select', $form).trigger('clearError')
        }
    }

    function showAlertError($input, message, focus) {
        var selector = $input.data('error-alert'),
            $target = $(selector)

        if (!selector) {
            return false
        }

        if ($.trim($target.text()).length == 0) {
            $target.text(message)
        }

        $target.addClass('form-field-error-alert').show()

        if (focus) {
            scrollToElement($target)
        }

        $input.off('clearError').on('clearError', function() {
            $target.hide()
        })

        return true
    }

    function showFormGroupError($input, message, focus) {
        var $group = $input.closest('.form-group'),
            $label = $('<span />').addClass('help-block'),
            $target = $input

        if (!$group.length) {
            return false
        }

        if (message) {
            $label.text(message.join(', '))
        }

        $label.addClass('form-field-error-label')
        $group.addClass('has-error')

        // Already error state
        if ($('.form-field-error-label', $group).length > 0) {
            return
        }

        // Target is a checkbox
        if ($input.parent().is('label')) {
            $target = $input.parent()
        }

        $target.after($label)

        if (focus) {
            scrollToElement($group, $input)
        }

        $input.off('clearError').on('clearError', function() {
            $label.remove()
            $group.removeClass('has-error')
        })

        return true
    }

    // Scroll to the form group, if not inside a modal window
    function scrollToElement($el, $input) {
        if (!!$el.closest('.modal-content').length) {
            return
        }

        var topVal = $el.offset().top - $('nav.navbar').outerHeight()

        $('html, body').animate({ scrollTop: topVal }, 500, function(){
            $input && $input.focus()
        })
    }

}(window.jQuery);
