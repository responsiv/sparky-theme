/*
 * Ajax Modal plugin
 *
 * Options:
 * - content: content HTML string or callback
 * 
 * Data attributes:
 * - data-control="ajax-modal" - enables the ajax modal plugin
 * - data-handler="onDoSomething" - October ajax request name
 * - data-update-partial="some partial" - Partial to popuplate the modal
 * - data-request-data="file_id: 1" - October ajax request data
 * - data-modal-class="modal-lg" - Modal class for styling
 *
 * JavaScript API:
 * $('a#someLink').ajaxModal({ handler: 'onOpenModalForm' })
 *
 * Dependences:
 * - Semantic UI Modal (modal.js)
 */

+function ($) { "use strict";

    // AJAX MODAL CLASS DEFINITION
    // ============================

    var Modal = function(element, options) {
        var self = this
        this.options    = options
        this.$el        = $(element)
        this.isOpen     = false

        this.init()
    }

    Modal.DEFAULTS = {
        handler: null,
        updatePartial: null,
        extraData: {},
        modalId: null,
        modalClass: null,
        closable: true
    }

    Modal.prototype.init = function(){
        var self = this

        /*
         * Do not allow the same modal to open twice
         */
        if (self.isOpen)
            return

        this.$modal = $('<div />').addClass('modal fade').html('<div class="modal-dialog"><div class="modal-content"></div></div>')
        this.$loader = $('<div />').addClass('modal-body').html('<h5>Loading...</h5><div class="progress"><div class="progress-bar progress-bar-striped active" style="width: 100%"></div></div>')

        $('body').append(this.$modal)
        this.$modalDialog = $('.modal-dialog', this.$modal)
        this.$modalContent = $('.modal-content', this.$modal)
        this.$modalContent.append(this.$loader)

        if (this.options.modalId)
            this.$modalContent.attr('id', this.options.modalId)

        if (this.options.modalClass)
            this.$modalDialog.addClass(this.options.modalClass)

        this.$modal.modal().on('hidden.bs.modal', function() {
            self.destroy()
        })

        var updateObj = {}
        updateObj[this.options.updatePartial] = this.$modalContent

        /*
         * October AJAX
         */
        if (this.options.handler) {

            this.$el.request(this.options.handler, {
                data: this.options.extraData,
                update: updateObj,
                success: function(data, textStatus, jqXHR) {
                    self.$loader.hide()

                    this.success(data, textStatus, jqXHR).done(function(){
                        $(window).trigger('ajaxUpdateComplete', [this, data, textStatus, jqXHR])
                        self.$loader.remove()
                    })
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // alert(jqXHR.responseText.length ? jqXHR.responseText : jqXHR.statusText)
                    self.$loader.remove()
                    self.$modal.modal('hide')
                    self.destroy()
                    this.error(jqXHR, textStatus, errorThrown)
                }
            })

        }
    }

    Modal.prototype.destroy = function() {
        this.$modal.remove()
        this.$loader.remove()
        this.$el.data('ui.ajax-modal', null)
    }

    // AJAX MODAL PLUGIN DEFINITION
    // ============================

    var old = $.fn.ajaxModal

    $.fn.ajaxModal = function (option) {
        var args = Array.prototype.slice.call(arguments, 1)
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('ui.ajax-modal')
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('ui.ajax-modal', (data = new Modal(this, options)))
            else if (typeof option == 'string') data[option].apply(data, args)
        })
    }

    $.fn.ajaxModal.Constructor = Modal

    // AJAX MODAL NO CONFLICT
    // =================

    $.fn.ajaxModal.noConflict = function () {
        $.fn.ajaxModal = old
        return this
    }

    // AJAX MODAL DATA-API
    // ===============

    $(document).on('click.ui.ajax-modal', '[data-control="ajax-modal"]', function() {
        $(this).ajaxModal()

        return false
    });

    /*
     * Automatically close modals when a form reaches success
     * Example:
     *
     *   <form data-request="onSomething" data-modal-hide-success>
     *       If this form uses this handler (onSomething)
     *       successfully, the modal will hide
     *   </form>
     */
    $(document)
        .on('ajaxDone', '[data-modal-hide-success]', function(event, context) {
            if ($(this).data('request') != context.handler) return
            $(this).closest('.modal').modal('hide')
        })

}(window.jQuery);
