/*
 * Account registration
 */

+function ($) { "use strict";

    var Page = function() {
        this.init()
    }

    Page.prototype.init = function() {
        this.$form = $('#accountRegisterForm')

        this.setActivePlanFromPage()
    }

    Page.prototype.showPlanDetails = function(el) {
        var $el = $(el),
            plan = this.getPlanFromElement($el)

        eModal.request({
            handler: 'onGetPlan',
            partial: 'plans/feature-list',
            title: plan.name,
            data: {
                selected_plan: plan.id
            },
            buttons: [
                { text: 'Close', style: 'default', close: true }
            ]
        })
    }

    Page.prototype.selectPlan = function(el) {
        var $el = $(el),
            plan = this.getPlanFromElement($el),
            $container = $el.closest('.plan-select-button')

        $container.addClass('plan-selected')

        $('.plan-select-button')
            .not($container)
            .removeClass('plan-selected')

        this.makePlanActive(plan)
    }

    Page.prototype.getPlanFromElement = function($el) {
        return $el.closest('[data-plan-object]').data()
    }

    Page.prototype.makePlanActive = function(plan) {
        $('input[name=selected_plan]').val(plan.id).trigger('change')

        $('[data-billing-form]').toggle(!plan.isFree)

        $('[data-common-form-submit]').toggle(!!plan.isFree)

        if (!plan.isFree) {
            this.updatePlanPricing(plan)
        }
    }

    Page.prototype.updatePlanPricing = function() {
        this.$form.request('onGetPlan', {
            update: {
                'plans/price-details': '#partialPlansPriceDetails'
            }
        })
    }

    Page.prototype.setActivePlanFromPage = function() {
        var id = $('input[name=selected_plan]').val(),
            $el = $('[data-plan-object][data-id='+(id ? id : 0)+']:first')

        if ($el.length) {
            this.selectPlan($el)
        }
    }

    $.page = new Page();

}(window.jQuery);
