/* =========================================================
 * bootstrap-schmodal.js v1.0.0
 * =========================================================
 * Copyright 2013 NetCrafters
 ;
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Schmodal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="schmodal"]', 'click.dismiss.schmodal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Schmodal.prototype = {

      constructor: Schmodal

    , toggle: function () {
        if (this.options.refresh) {
            return this.refresh()
        } else {
            return this[!this.isShown ? 'show' : 'hide']()
        }
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move schmodals dom position
          }

          // Re-position the modal
          var modal_body = that.$element.find('.modal-body');
          var modal_height = $(window).height() * 0.80;
          that.$element.css('margin-left', (-1 * (that.$element.width() / 2)));
          modal_body.css('height', modal_height - 49.0 - 60.0);
          that.$element.find('.modal-body').each(function(){
            $(this).css('height', modal_height - 49.0 - 60.0);
          });

          that.$element
            .show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , refresh: function (options) {
        var that = this
          , e = $.Event('refresh')

        this.$element.trigger(e)

        if (e.isDefaultPrevented()) return

        var modal_body = this.$element.find('.modal-body');
        modal_body.html('');

        this.options = $.extend({}, this.options, options)
        if (this.options.remote) {
            modal_body.load(this.options.remote, function () {
                that.$element.focus().trigger('refreshed')
                if (that.options.show) that.show()
            })
        } else {
            if (this.isShown) {
                this.$element.focus().trigger('shown')
                return
            }
            if (this.options.show) this.show()
        }
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.schmodal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideSchmodal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.schmodal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.schmodal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.schmodal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideSchmodal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideSchmodal()
        })
      }

    , hideSchmodal: function (that) {
        this.$element
          .hide()
          .trigger('hidden')

        this.backdrop()
      }

    , removeBackdrop: function () {
        this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, $.proxy(this.removeBackdrop, this)) :
            this.removeBackdrop()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  $.fn.schmodal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('schmodal')
        , options = $.extend({}, $.fn.schmodal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('schmodal', (data = new Schmodal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.refresh) data.refresh(options)
      else if (options.show) data.show()
    })
  }

  $.fn.schmodal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
    , refresh: false
  }

  $.fn.schmodal.Constructor = Schmodal


 /* MODAL DATA-API
  * ============== */

  $(document).on('click.schmodal.data-api', '[data-toggle="schmodal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('schmodal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .schmodal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);
