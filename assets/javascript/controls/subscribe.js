/*
 * Basic control for subscriptions
 */

+function ($) { "use strict";

    //
    // Properties
    //

    var $form

    function init() {
        $form = $('#accountRegisterForm')
        setActivePlanFromPage()
    }

    //
    // Public
    //

    window.showPlanDetails = function(el) {
        var $el = $(el),
            plan = getPlanFromElement($el)

        $el.ajaxModal({
            handler: 'onGetPlanDetails',
            updatePartial: 'plans/feature-list',
            extraData: {
                selected_plan: plan.id
            }
        })
    }

    window.selectPlan = function(el) {
        var $el = $(el),
            plan = getPlanFromElement($el),
            $container = $el.closest('.plan-select-button')

        $container.addClass('plan-selected')

        $('.plan-select-button')
            .not($container)
            .removeClass('plan-selected')

        makePlanActive(plan)
    }

    window.updatePlanPricing = function() {
        $form.request('onGetPlanDetails', {
            update: {
                'plans/price-details': '#partialPlansPriceDetails'
            }
        })
    }

    window.setActivePlanFromPage = function() {
        var id = $('input[name=selected_plan]').val(),
            $el = $('[data-plan-object][data-id='+(id ? id : 0)+']:first')

        if ($el.length) {
            selectPlan($el)
        }
    }

    //
    // Protected
    //

    function makePlanActive(plan) {
        $('input[name=selected_plan]').val(plan.id).trigger('change')

        $('[data-billing-form]').toggle(!plan.isFree)

        $('[data-common-form-submit]').toggle(!!plan.isFree)

        if (!plan.isFree) {
            updatePlanPricing(plan)
        }
    }

    function getPlanFromElement($el) {
        return $el.closest('[data-plan-object]').data()
    }

    //
    // Init
    //

    init()

}(window.jQuery);
