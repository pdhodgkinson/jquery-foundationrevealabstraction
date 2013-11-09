(function (window, document, $, undefined) {
  'use strict';
  //Setup shortcut functions to open modals for testing
  (function () {
    var doCommand = function (selector, method) {
      return function () {
        $(selector).FoundationRevealModal(method);
      };
    };

    //Shortcuts to programmaticaly opening and closing the modals
    window.m1 = {
      open: doCommand('#m1', 'open'),
      close: doCommand('#m1', 'close')
    };
    window.m2 = {
      open: doCommand('#m2', 'open'),
      close: doCommand('#m2', 'close')
    };
  }());

  //On document ready
  $(function () {
    //create modals
    $('#m1').FoundationRevealModal({
      open: function () {
        console.log('M1 open');
      },
      opened: function () {
        console.log('M1 opened');
      },
      close: function () {
        console.log('M1 close');
      },
      closed: function () {
        console.log('M1 closed');
      }
    });

    $('#m2').FoundationRevealModal({
      open: function () {
        console.log('M2 open');
      },
      opened: function () {
        console.log('M2 opened');
      },
      close: function () {
        console.log('M2 close');
      },
      closed: function () {
        console.log('M2 closed');
      }
    });

    //Attach the programmatic functions to the button elements
    $(document).on('click', '[data-fuel-reveal-id]', function () {
      var revealId = $(this).data('fuelRevealId'),
        revealMethod = $(this).data('fuelRevealMethod');
      //call method
      window[revealId][revealMethod]();
    });

  });

})(this, this.document, this.jQuery);
