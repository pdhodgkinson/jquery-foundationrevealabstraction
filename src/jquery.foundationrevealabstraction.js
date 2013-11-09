/*
 * FoundationRevealAbstraction - Jquery Plugin to abstract away the differences between Foundation 3 and
 * Foundation 4 Reveal libraries.
 *
 * First call $(elem).FoundationRevealModal(options) to set initial options (callbacks etc.)
 * Call $(elem).FoundationRevealModal(method) to programmatically open and close the modal. I.E. method is one of:
 *  'open'
 *  'close'
 * Callbacks will also get triggered in both libraries if using the built-in data-reveal-id DOM attribute (part of
 * both Foundation 3 and Foundation 4 Reveal libraries).
 *
 * References:
 *  Foundation 3 Reveal - http://foundation.zurb.com/old-docs/f3/reveal.php
 *  Foundation 4 Reveal - http://foundation.zurb.com/docs/components/reveal.html
 *
 *  Note 1: Foundation 3 has callbacks that can be configured at the time that the reveal modal is opened (as opposed
 *          to at initialization time). Currently these are not being leveraged, and instead the callbacks are being
 *          bound directly to the triggered events.
 *          This is done so that the callbacks get triggered regardless of whether the method is called
 *          programmatically or via a data-reveal-id, and to maintain consistency between libraries
 *  Note 2: The current implementation does not account nicely for re-initializing an already initialized modal.
 *          TODO: To handle this we should overwriting and unbinding existing callbacks. Make sure we use
 *          binding namespace to unbind this specific modal (using the id)
 *  Note 3: The current implementation does not abstract ALL possible initialization parameters. Specifically it
 *          only currently handles callbacks, and not things like: animation parameters, css and styling parameters
 *          TODO: To handle more initialization and 'open' method parameters
 *  Note 4: There is some weird behaviour of callbacks when opening one modal without closing another first.
 *          E.G. sometimes the 'close' callbacks doesn't seem to get called in Foundation 4 (maybe this is by
 *          design). Use the 'close' callback with caution.
 *
 * Copyright (c) 2013 Peter Hodgkinson
 * Licensed under the MIT license.
 */

(function (window, document, $, undefined) {

  /**
   * @param {Object|string} initialization options or a method name
   * @param [...] Optional arguments to pass into the method calls
   */
  $.fn.FoundationRevealModal = function () {
    var args = Array.prototype.slice.call(arguments),
      arg = args.shift(),
      options = {},
      method = null,
      init = true,
      plugin;

    if (arg !== undefined) {
      if ($.isPlainObject(arg)) {
        //if the first arg is an object then use it as initialization parameters
        options = arg;
      } else if ($.type(arg) === "string") {
        //if the first arg is a string, then assume it's a method call
        method = arg;
        if ($.inArray(method, $.FoundationRevealModal.methods) === -1) {
          throw "Method not found '" + method + ";";
        }
        //we are not initialization, we are calling a method
        init = false;
      } else {
        throw "Invalid argument";
      }
    }


    return $.each(this, function () {
      //get existing plugin
      plugin = $(this).data('FoundationRevealModal');

      if (init === true) {
        if (plugin === undefined || plugin === null) {
          // create a new instance of the plugin
          // pass the DOM element and the user-provided options as arguments
          plugin = new $.FoundationRevealModal(this, options);

          // store a reference to the plugin object
          $(this).data('FoundationRevealModal', plugin);
        } else {
          plugin.reinit(options);
        }
      } else {
        if (plugin === undefined || plugin === null) {
          throw "FoundationRevealModal not initialized";
        }
        if (plugin[method] === undefined) {
          throw "Method not defined '" + method + "'";
        }

        //call plugin method
        plugin[method].apply(plugin, args);
      }
    });

  };

  /**
   * The main Foundation Reveal Modal constructor object
   *
   * @param element the DOM element that this is being attached to
   * @param options input options, based around $.FoundationRevealModal.options
   * @returns {*}
   * @constructor
   */
  $.FoundationRevealModal = function (element, options) {
    // Override default options with passed-in options.
    this.options = $.extend({}, $.FoundationRevealModal.options, options);
    this.$element = $(element);  // reference to the jQuery version of DOM element
    this.eventNamespace = (function ($element) {
      //Generate a unique trigger event namespace. See:
      var eventNamespace = 'FoundationRevealModal',
        elementId = $element.attr('id');
      if (elementId === undefined) {
        elementId = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      eventNamespace = eventNamespace + '.' + elementId;
      return eventNamespace;
    }(this.$element));

    this.init(options);
  };

  $.FoundationRevealModal.prototype = {
    init: function (options) {
      var $element = this.$element;
      var namespace = this.eventNamespace;
      //bind callbacks
      $.each($.FoundationRevealModal.methods, function (idx, method) {
        var event = method;
        if ($.FoundationRevealModal.isF3 === true) {
          event = 'reveal:' + event;
        }
        event = event + '.' + namespace;
        $element.off(event); //unbind anything that was set before on this namespace
        if ($.isFunction(options[method])) {
          $element.on(event, options[method]);
        }
      });
    },

    reinit: function (options) {
      this.options = $.extend({}, $.FoundationRevealModal.options, options);
      this.init(options);
    },

    /**
     * Open the modal (based on whether we are using Foundation 3 or 4
     */
    open: function () {
      if ($.FoundationRevealModal.isF4) {
        return this.$element.foundation('reveal', 'open');
      } else if ($.FoundationRevealModal.isF3) {
        return this.$element.reveal();
        /*******
         *This is how you might do it if you didn't want to use 'bind'
         * ******
         $element.reveal({
                    open: options.open,
                    opened: options.opened,
                    close: options.close,
                    closed: options.closed
                });
         */

      }
    },
    /**
     * Close the modal (based on whether we are using Foundation 3 or 4
     */
    close: function () {
      if ($.FoundationRevealModal.isF4) {
        this.$element.foundation('reveal', 'close');
      } else if ($.FoundationRevealModal.isF3) {
        this.$element.trigger('reveal:close');
      }
    }
  };

  /**
   * True if Foundation 4 is in use
   *
   * @type {boolean}
   */
  $.FoundationRevealModal.isF4 = $(document).foundation !== undefined;

  /**
   * True if Foundatoin 3 is in use
   * @type {boolean}
   */
  $.FoundationRevealModal.isF3 = $(document).reveal !== undefined;

  /**
   * Callback methods that can be defined
   *
   * @type {Array}
   */
  $.FoundationRevealModal.methods = ['open', 'opened', 'close', 'closed'];

  // Static method default options.
  $.FoundationRevealModal.options = {
    /**
     * Specify a callback function that triggers 'before' the modal opens.
     *
     * @property open
     * @type {Function}
     * @default null
     */
    open: null,
    /**
     * Specify a callback function that triggers 'after' the modal is opened.
     *
     * @property opened
     * @type {Function}
     * @default null
     */
    opened: null,
    /**
     * Specify a callback function that triggers 'before' the modal prepares to close.
     *
     * @property close
     * @type {Function}
     * @default null
     */
    close: null,
    /**
     * Specify a callback function that triggers 'after' the modal is closed.
     *
     * @property closed
     * @type {Function}
     * @default null
     */
    closed: null
  };

})(this, this.document, this.jQuery);
