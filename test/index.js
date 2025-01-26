var test = require('tap').test;
var load = require('../');

test('it can load graph', function(t) {
  var graph = load('graph G {}');
  t.equal(graph.getNodesCount(), 0, 'No nodes');
  t.equal(graph.getLinksCount(), 0, 'No links');
  t.end();
});

test('it loads graph with numeric labels', function(t) {
  var graph = load('digraph G { a;b; a -> b }');
  t.equal(graph.getNodesCount(), 2, 'two nodes');
  t.equal(graph.getLinksCount(), 1, 'one link');
  var firstNode = graph.getNode('a');
  var secondNode = graph.getNode('b');
  t.equal(firstNode.id, 'a', 'First node is here');
  t.equal(secondNode.id, 'b', 'Second node is here');
  t.end();
});

test('it can load graph', function(t) {
  var graph = load('digraph G { 1 -> 2}');
  t.equal(graph.getNodesCount(), 2, 'two nodes');
  t.equal(graph.getLinksCount(), 1, 'one link');
  var firstNode = graph.getNode(1);
  var secondNode = graph.getNode(2);
  t.equal(firstNode.id, 1, 'First node is here');
  t.equal(secondNode.id, 2, 'Second node is here');
  t.end();
});

test('it can parse node attributes', function(t) {
  var graph = load(`digraph {
      25 -> 26;
      25[fontname="Palatino-Bold" shape=box size=0];
  }`);
  var data25 = graph.getNode(25).data;
  t.equal(data25.fontname, 'Palatino-Bold', 'font is here');
  t.equal(data25.shape, 'box', 'shape is here');
  t.equal(data25.size, 0, 'size is here');
  t.end();
});

test('it keeps node attributes', function(t) {
  var graph = load(`digraph {
      25 [fontname="Palatino-Bold" shape=box size=0];
      25 -> 26;
  }`);
  var data25 = graph.getNode(25).data;
  t.equal(data25.fontname, 'Palatino-Bold', 'font is here');
  t.equal(data25.shape, 'box', 'shape is here');
  t.equal(data25.size, 0, 'size is here');
  t.end();
});

test('it can parse nodes that start with number', function(t) {
  var graph = load(`digraph {
      anvaka -> 5am;
  }`);
  t.ok(graph.getNode('anvaka'), 'anvaka was here');
  t.ok(graph.getNode('5am'), '5am was here');
  t.end();
});

test('it can load subgraphs', function(t) {
  test('left hand side', function(t) {
    var graph = load('digraph G { {1 2} -> 3}');
    t.equal(graph.getNodesCount(), 3, 'three nodes');
    t.equal(graph.getLinksCount(), 2, 'two links');
    var firstNode = graph.getNode(1);
    var secondNode = graph.getNode(2);
    var thirdNode = graph.getNode(3);
    t.equal(firstNode.id, 1, 'First node is here');
    t.equal(secondNode.id, 2, 'Second node is here');
    t.equal(thirdNode.id, 3, 'Third node is here');
    t.ok(graph.hasLink(1, 3), '1 -> 3');
    t.ok(graph.hasLink(2, 3), '1 -> 3');
    t.end();
  });

  test('right hand side', function(t) {
    var graph = load('digraph G { 1 -> {2 3}}');
    t.equal(graph.getNodesCount(), 3, 'three nodes');
    t.equal(graph.getLinksCount(), 2, 'two links');
    var firstNode = graph.getNode(1);
    var secondNode = graph.getNode(2);
    var thirdNode = graph.getNode(3);
    t.equal(firstNode.id, 1, 'First node is here');
    t.equal(secondNode.id, 2, 'Second node is here');
    t.equal(thirdNode.id, 3, 'Third node is here');
    t.ok(graph.hasLink(1, 2), '1 -> 2');
    t.ok(graph.hasLink(1, 3), '1 -> 3');
    t.end();
  });

  test('both', function(t) {
    var graph = load('digraph G { {1 2} -> {3 4}}');
    t.equal(graph.getNodesCount(), 4, 'four nodes');
    t.equal(graph.getLinksCount(), 4, 'four links');
    var firstNode = graph.getNode(1);
    var secondNode = graph.getNode(2);
    var thirdNode = graph.getNode(3);
    var fourthNode = graph.getNode(4);
    t.equal(firstNode.id, 1, 'First node is here');
    t.equal(secondNode.id, 2, 'Second node is here');
    t.equal(thirdNode.id, 3, 'Third node is here');
    t.equal(fourthNode.id, 4, 'Fourth node is here');

    t.ok(graph.hasLink(1, 3), '1 -> 4');
    t.ok(graph.hasLink(1, 4), '1 -> 3');
    t.ok(graph.hasLink(2, 3), '2 -> 4');
    t.ok(graph.hasLink(2, 4), '2 -> 3');
    t.end();
  });

  test('nested', function(t) {
    var graph = load('digraph G { {1 {2 3}} -> 4}');
    t.equal(graph.getNodesCount(), 4, 'four nodes');
    t.equal(graph.getLinksCount(), 3, 'three links');
    var firstNode = graph.getNode(1);
    var secondNode = graph.getNode(2);
    var thirdNode = graph.getNode(3);
    var fourthNode = graph.getNode(4);
    t.equal(firstNode.id, 1, 'First node is here');
    t.equal(secondNode.id, 2, 'Second node is here');
    t.equal(thirdNode.id, 3, 'Third node is here');
    t.equal(fourthNode.id, 4, 'Fourth node is here');

    t.ok(graph.hasLink(1, 4), '1 -> 4');
    t.ok(graph.hasLink(2, 4), '2 -> 3');
    t.ok(graph.hasLink(3, 4), '3 -> 4');
    t.end();
  });

  test('nested both sides', function(t) {
    var graph = load('digraph G { {1 {2 3}} -> {4 {5 6}}}');
    t.equal(graph.getNodesCount(), 6, 'four nodes');
    t.equal(graph.getLinksCount(), 9, 'nine links');
    for (var i = 1; i < 7; ++i) {
      t.equal(graph.getNode(i).id, i, 'Node ' + i + ' is there');
    }
    t.ok(graph.hasLink(1, 4), '1 -> 4');
    t.ok(graph.hasLink(1, 5), '1 -> 5');
    t.ok(graph.hasLink(1, 6), '1 -> 6');

    t.ok(graph.hasLink(2, 4), '2 -> 4');
    t.ok(graph.hasLink(2, 5), '2 -> 5');
    t.ok(graph.hasLink(2, 6), '2 -> 6');

    t.ok(graph.hasLink(3, 4), '3 -> 4');
    t.ok(graph.hasLink(3, 5), '3 -> 5');
    t.ok(graph.hasLink(3, 6), '3 -> 6');
    t.end();
  });

  t.end();
});

test('it can parse edge attributes', function(t) {
  var graph = load(`digraph {
      25 -> 26 [style=dotted width=2];
  }`);
  var linkData = graph.getLink(25, 26).data;
  t.equal(linkData.style, 'dotted', 'style is here');
  t.equal(linkData.width, 2, 'width is here');
  t.end();
});


test ('it can parse negative values', function(t) {
  var graph = load(`digraph {
      hello ["count"=-633];
  }`);
  t.equal(graph.getNode('hello').data.count, -633, 'value parsed');
  t.end();
});

test ('it can parse attributes with arrays', function(t) {
  var graph = load(`digraph {
      hello ["position"="[1,2,3]"];
  }`);
  t.same(graph.getNode('hello').data.position, [1, 2, 3], 'value parsed');
  t.end();
});
