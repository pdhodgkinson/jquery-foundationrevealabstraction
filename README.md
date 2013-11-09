# Foundation Reveal Modal Abstraction jQuery plugin

Abstracts the differences between Foundation 3 and Foundation 4's Reveal libraries.
Developers can write code for this plugin and have it work interchangeably with both libraries.
Useful if you need to support both Foundation 3 (e.g. for IE8) and Foundation 4 (e.g. modern browsers).

## Getting Started

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/pdhodgkinson/jquery-foundationrevealabstraction/master/dist/jquery.foundationrevealabstraction.min.js
[max]: https://raw.github.com/pdhodgkinson/jquery-foundationrevealabstraction/master/dist/jquery.foundationrevealabstraction.js

In your web page:

```html
<script src="jquery.js"></script>
<!-- if Foundation 3 -->
<script src="foundation/jquery.foundation.reveal.js"></script>
<!-- endif -->
<!-- if Foundation 4 -->
<script src="foundation/foundation.js"></script>
<script src="foundation/foundation.reveal.js"></script>
<!-- endif -->
<script src="dist/jquery.foundationrevealabstraction.min.js"></script>
<div id="modal1" class="reveal-modal">
    <p>Modal 1.</p>
    <a class="close-reveal-modal">&#215;</a>
</div>
<script>
jQuery(function($) {
  $("#modal1).FoundationRevealModal();
});
</script>
```

## Documentation


## Examples
[demo](demo/index.html)

## Release History

### 0.0.1
First release
