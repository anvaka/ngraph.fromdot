module.exports = load;

var parseDot = require('dotparser');

/**
 * Loads graph from 'dot' string.
 *
 * @param {String} dotGraph a graph in `dot` format
 * @param {ngraph.graph=} appendTo optional argument if you want to append parsed
 * graph to an old graph.
 *
 * @return {ngraph.graph} Parsed graph
 * 
 * @see https://en.wikipedia.org/wiki/DOT_(graph_description_language)
 * @see https://github.com/anvaka/ngraph.graph
 */
function load(dotGraph, appendTo) {
  var dotAST = parseDot(dotGraph);
  if (dotAST.length > 1 && appendTo !== undefined) {
    throw new Error('Dot file contains multiple graphs. Cannot use `saveTo` in this case');
  }

  if (!appendTo) {
    appendTo = require('ngraph.graph')();
  }
  // by default load will only load first graph:

  return loadOne(appendTo, dotAST[0]);
}

function loadOne(graph, ast) {
  loadSubgraph(graph, ast);

  return graph;
}

function loadSubgraph(graph, ast) {
  var children = ast.children;
  if (!children) return graph;

  var addedNodes = [];

  for (var i = 0; i < children.length; ++i) {
    var child = children[i];
    if (child.type === 'edge_stmt') {
      concat(addedNodes, processEdgeStatement(graph, child));
    } else if (child.type === 'node_stmt') {
      concat(addedNodes, processNodeStatement(graph, child));
    } else if (child.type === 'subgraph') {
      concat(addedNodes, loadSubgraph(graph, child));
    }
  }

  return addedNodes;
}

function processEdgeStatement(graph, edgeAST) {
  var edges = edgeAST.edge_list;
  if (edges.length === 0) return; // wat?

  var first = edges[0];
  var addedNodes = [];
  var prevNode = addNode(graph, first);
  concat(addedNodes, prevNode);

  var attributes = parseAttributesAsData(edgeAST.attr_list);
  for (var i = 1; i < edges.length; ++i) {
    var nextNode = addNode(graph, edges[i]);
    concat(addedNodes, nextNode);

    addLink(graph, prevNode, nextNode, attributes);
    prevNode = nextNode;
  }

  return addedNodes;
}

function processNodeStatement(graph, nodeStatement) {
  return addNode(graph, nodeStatement.node_id, nodeStatement.attr_list);
}

function concat(head, tail) {
  for (var i = 0; i < tail.length; ++i) {
    head.push(tail[i]);
  }
  return head;
}

function addNode(graph, nodeAST, attributesList) {
  if (nodeAST.type === 'node_id') {
    var data = mergeNodeDataIfNeeded(
      parseAttributesAsData(attributesList),
      graph.getNode(nodeAST.id)
    );
    if (data) {
      graph.addNode(nodeAST.id, data);
    } else {
      graph.addNode(nodeAST.id);
    }
    return [nodeAST.id];
  } else if (nodeAST.type === 'subgraph') {
    return loadSubgraph(graph, nodeAST);
  }
}

function addLink(graph, from, to, data) {
  for (var i = 0; i < from.length; ++i) {
    for (var j = 0; j < to.length; ++j) {
      graph.addLink(from[i], to[j], data);
    }
  }
}

function parseAttributesAsData(attributesList) {
  if (!attributesList || !attributesList.length) return;
  var data = Object.create(null);
  for (var i = 0; i < attributesList.length; ++i) {
    var attr = attributesList[i];
    if (attr.type !== 'attr' || attr.id === undefined) continue;
    data[attr.id] = attr.eq;
  }
  return data;
}

function mergeNodeDataIfNeeded(newData, oldNode) {
  if (!oldNode || !oldNode.data) return newData;
  return Object.assign(oldNode.data, newData);
}