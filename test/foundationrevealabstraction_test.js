/**
 * Foundation Reveal Tests. These tests should be the identical suite that works in both
 * Foundation 4 and Foundation 3
 */
(function ($) {
  module('jQuery#FoundationRevealModal', {
    setup: function () {
      this.elems = $('#reveal-modal');
      this.m1 = $('#m1');
      this.m2 = $('#m2');
    }
  });

  test('is chainable', function () {
    // Not a bad test to run on collection methods.
    strictEqual(this.elems.FoundationRevealModal(), this.elems, 'should be chainable');
  });

  test('is reset and data populated', function () {
    equal(this.m1.data('FoundationRevealModal'), undefined, 'data should be undefined');
    this.m1.FoundationRevealModal();
    notEqual(this.m1.data('FoundationRevealModal'), undefined, 'data should be defined');
  });

  /**
   * Test using the built-in data-reveal-id trigger
   */
  module('FoundationRevealModal.data-reveal-id', {
    setup: function () {
    }
  });

  asyncTest('modal opens', 2, function () {
    var m1 = $('#m1').FoundationRevealModal(),
      m1reveal = $('[data-reveal-id=m1]');
    ok(!m1.hasClass('open'), 'is closed');
    m1reveal.trigger('click');
    setTimeout(function() {
      ok(m1.hasClass('open'), 'is open');
      start();
    }, 300);
  });

  /**
   * Test that all the necessary callbacks get fired at appropriate times
   */
  asyncTest('callbacks get fired', 7, function () {
    var m1 = $('#m1'),
      m1reveal = $('[data-reveal-id=m1]'),
      m1close = m1.find('.close-reveal-modal'),
      open = function () {
        ok(true, "open fired");
      },
      opened = function () {
        ok(true, "opened fired");
        ok(m1.hasClass('open'), 'is open');
        start();
        stop();
        setTimeout(function () {
          m1close.trigger('click');
        }, 50);
      },
      close = function () {
        ok(true, "close fired");
      },
      closed = function () {
        ok(true, "closed fired");
        start();
        stop();
        setTimeout(function () {
          ok(!m1.hasClass('open'), 'is closed');
          start();
        }, 50);
      };

    m1 = $('#m1').FoundationRevealModal({open: open,
      opened: opened,
      close: close,
      closed: closed
    });

    ok(!m1.hasClass('open'), 'is closed');
    m1reveal.trigger('click');
  });

  /**
   * Test around the direct programmtic open and close
   */
  module('FoundationRevealModal programmatically', {
    // This will run before each test in this module.
    setup: function () {
    }
  });

  asyncTest('modal opens', 2, function () {
    var m1 = $('#m1').FoundationRevealModal();
    ok(!m1.hasClass('open'), 'is closed');
    m1.FoundationRevealModal('open');
    setTimeout(function() {
      ok(m1.hasClass('open'), 'is open');
      start();
    }, 300);
  });

  /**
   * Test that all the callbacks get fired at the appropriate times
   */
  asyncTest('modal opens programmatically with callbacks', 7, function () {
    var m1 = $("#m1"),
      open = function () {
        ok(true, "open fired");
      },
      opened = function () {
        ok(true, "opened fired");
        ok(m1.hasClass('open'), 'is open');
        start();
        stop();
        setTimeout(function () {
          m1.FoundationRevealModal('close');
        }, 50);
      },
      close = function () {
        ok(true, "close fired");
      },
      closed = function () {
        ok(true, "closed fired");
        start();
        stop();
        setTimeout(function () {
          ok(!m1.hasClass('open'), 'is closed');
          start();
        }, 50);
      };
    m1 = $('#m1').FoundationRevealModal({open: open,
      opened: opened,
      close: close,
      closed: closed
    });
    ok(!m1.hasClass('open'), 'is closed');
    m1.FoundationRevealModal('open');
  });

  /**
   * Tests on initialization parameters
   */
  module('initialization', {
    setup: function () {
    }
  });

  /**
   * Test re-initialization of callbacks
   */
  asyncTest('re-init works for callbacks', 3, function () {
    var m1 = $("#m1"),
      open = function () {
        ok(true, "open fired");
      },
      opened = function () {
        ok(true, "opened fired");
        start();
        stop();
        setTimeout(function () {
          m1.FoundationRevealModal('close');
        }, 50);
      },
      close = function () {
        ok(true, "close fired");
      },
      closed = function () {
        ok(true, "closed fired");
        start();
        stop();
        setTimeout(function () {
          ok(!m1.hasClass('open'), 'is closed');
          start();
        }, 50);
      };
    m1 = $('#m1').FoundationRevealModal({open: open,
      opened: opened,
      close: close,
      closed: closed
    });
    ok(!m1.hasClass('open'), 'is closed');
    //lets re-init
    m1 = $('#m1').FoundationRevealModal();
    m1.FoundationRevealModal('open');
    setTimeout(function () {
      ok(m1.hasClass('open'), 'is open');
      ok(true, 'no unexpected callbacks fired');
      start();
    }, 300);
  });

}(jQuery));
