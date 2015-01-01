var test = require('tap').test;
var load = require('../');

test('it can load graph', function(t) {
  var graph = load('graph G {}');
  t.equals(graph.getNodesCount(), 0, 'No nodes');
  t.equals(graph.getLinksCount(), 0, 'No links');
  t.end();
});

test('it can load graph', function(t) {
  var graph = load('digraph G { 1 -> 2}');
  t.equals(graph.getNodesCount(), 2, 'two nodes');
  t.equals(graph.getLinksCount(), 1, 'one link');
  var firstNode = graph.getNode(1);
  var secondNode = graph.getNode(2);
  t.equals(firstNode.id, 1, 'First node is here');
  t.equals(secondNode.id, 2, 'Second node is here');
  t.end();
});

test('it can load subgraphs', function(t) {
  test('left hand side', function(t) {
    var graph = load('digraph G { {1 2} -> 3}');
    t.equals(graph.getNodesCount(), 3, 'three nodes');
    t.equals(graph.getLinksCount(), 2, 'two links');
    var firstNode = graph.getNode(1);
    var secondNode = graph.getNode(2);
    var thirdNode = graph.getNode(3);
    t.equals(firstNode.id, 1, 'First node is here');
    t.equals(secondNode.id, 2, 'Second node is here');
    t.equals(thirdNode.id, 3, 'Third node is here');
    t.ok(graph.hasLink(1, 3), '1 -> 3');
    t.ok(graph.hasLink(2, 3), '1 -> 3');
    t.end();
  });

  test('right hand side', function(t) {
    var graph = load('digraph G { 1 -> {2 3}}');
    t.equals(graph.getNodesCount(), 3, 'three nodes');
    t.equals(graph.getLinksCount(), 2, 'two links');
    var firstNode = graph.getNode(1);
    var secondNode = graph.getNode(2);
    var thirdNode = graph.getNode(3);
    t.equals(firstNode.id, 1, 'First node is here');
    t.equals(secondNode.id, 2, 'Second node is here');
    t.equals(thirdNode.id, 3, 'Third node is here');
    t.ok(graph.hasLink(1, 2), '1 -> 2');
    t.ok(graph.hasLink(1, 3), '1 -> 3');
    t.end();
  });

  test('both', function(t) {
    var graph = load('digraph G { {1 2} -> {3 4}}');
    t.equals(graph.getNodesCount(), 4, 'four nodes');
    t.equals(graph.getLinksCount(), 4, 'four links');
    var firstNode = graph.getNode(1);
    var secondNode = graph.getNode(2);
    var thirdNode = graph.getNode(3);
    var fourthNode = graph.getNode(4);
    t.equals(firstNode.id, 1, 'First node is here');
    t.equals(secondNode.id, 2, 'Second node is here');
    t.equals(thirdNode.id, 3, 'Third node is here');
    t.equals(fourthNode.id, 4, 'Fourth node is here');

    t.ok(graph.hasLink(1, 3), '1 -> 4');
    t.ok(graph.hasLink(1, 4), '1 -> 3');
    t.ok(graph.hasLink(2, 3), '2 -> 4');
    t.ok(graph.hasLink(2, 4), '2 -> 3');
    t.end();
  });

  test('nested', function(t) {
    debugger;
    var graph = load('digraph G { {1 {2 3}} -> 4}');
    t.equals(graph.getNodesCount(), 4, 'four nodes');
    t.equals(graph.getLinksCount(), 3, 'three links');
    var firstNode = graph.getNode(1);
    var secondNode = graph.getNode(2);
    var thirdNode = graph.getNode(3);
    var fourthNode = graph.getNode(4);
    t.equals(firstNode.id, 1, 'First node is here');
    t.equals(secondNode.id, 2, 'Second node is here');
    t.equals(thirdNode.id, 3, 'Third node is here');
    t.equals(fourthNode.id, 4, 'Fourth node is here');

    t.ok(graph.hasLink(1, 4), '1 -> 4');
    t.ok(graph.hasLink(2, 4), '2 -> 3');
    t.ok(graph.hasLink(3, 4), '3 -> 4');
    t.end();
  });
  t.end();
});
