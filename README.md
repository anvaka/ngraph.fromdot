# ngraph.fromdot [![Build Status](https://travis-ci.org/anvaka/ngraph.fromdot.svg)](https://travis-ci.org/anvaka/ngraph.fromdot)

Load [dot](https://en.wikipedia.org/wiki/DOT_(graph_description_language)) files into [`ngraph.graph`](https://github.com/anvaka/ngraph)

# usage

``` javascript
var dot = require('ngraph.fromdot');

// you can load empty graph:
var emptyGraph = dot('digraph G {}');

// or graph with edges only:
var twoEdgesGraph = dot('digraph G { a -> b }');

// above graph is the same as
var sameAsAbove = dot('digraph G { a; b; a -> b }');

// you can also "append" to existing graph if you wish so:
dot('digraph B { a -> b }', emptyGraph);

// now emptyGraph is no longer empty:
emptyGraph.getLinksCount(); // returns 1
emptyGraph.getNodesCount(); // returns 2
```

# install

With [npm](https://npmjs.org) do:

```
npm install ngraph.fromdot
```

# license

MIT
