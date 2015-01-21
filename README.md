# ngraph.fromdot

Loads dot file format into ngraph

# usage

``` javascript
var load = require('ngraph.fromdot');

// you can load empty graph:
var emptyGraph = load('digraph G {}');

// or graph with edges only:
var twoEdgesGraph = load('digraph G { a -> b }');

// above graph is the same as
var sameAsAbove = load('digraph G { a; b; a -> b }');

// you can also "append" to existing graph if you wish so:
load('digraph B { a -> b }', emptyGraph);

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
