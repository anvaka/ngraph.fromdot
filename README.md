# ngraph.fromdot [![Build Status](https://travis-ci.org/anvaka/ngraph.fromdot.svg?branch=master)](https://travis-ci.org/anvaka/ngraph.fromdot)

Load [dot](https://en.wikipedia.org/wiki/DOT_(graph_description_language)) files into [`ngraph.graph`](https://github.com/anvaka/ngraph)

# usage

You can get the library from CDN:

``` html
<script src='https://cdn.jsdelivr.net/npm/ngraph.fromdot/dist/ngraph.fromDot.js'></script>
```

Or from npm:

```
npm install ngraph.fromdot
```

and then:

``` js
var fromDot = require('ngraph.fromdot');
```

After the library is loaded, it is straightforward to use:

``` js
// you can load empty graph:
var emptyGraph = fromDot('digraph G {}');

// or graph with edges only:
var twoEdgesGraph = fromDot('digraph G { a -> b }');

// above graph is the same as
var sameAsAbove = fromDot('digraph G { a; b; a -> b }');

// you can also "append" to existing graph if you wish so:
fromDot('digraph B { a -> b }', emptyGraph);

// now emptyGraph is no longer empty:
emptyGraph.getLinksCount(); // returns 1
emptyGraph.getNodesCount(); // returns 2
```

# license

MIT
