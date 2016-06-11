'use strict';

function Graph() {
    this.vertexes = [];
    this.radius = undefined;
    this.diameter = undefined;
}

Graph.prototype.clearDepthValues = function () {
    for (let i = 0; i < this.vertexes.length; i++) {
        let current = this.vertexes[i];
        current.depth = -1;
        current.parent = undefined;
    }
};

Graph.prototype.addEdge = function (data1, data2) {
    let vertex1;
    let vertex2;

    let index1 = this.vertexDataExists(data1);
    let index2 = this.vertexDataExists(data2);

    if (index1 >= 0) {
        vertex1 = this.vertexes[index1];
    }
    else {
        vertex1 = new Vertex(data1);
    }

    if (index2 >= 0) {
        vertex2 = this.vertexes[index2];
    }
    else {
        vertex2 = new Vertex(data2);
    }

    vertex1.addEdge(vertex2);
    vertex2.addEdge(vertex1);

    if (index1 === -1) {
        this.vertexes.push(vertex1);
    }

    if (index2 === -1) {
        this.vertexes.push(vertex2);
    }
};

// TODO remove vertex completely if there are no edges connected to it
Graph.prototype.removeEdge = function (data1) {
    let index = this.vertexDataExists(data1);
    if (index >= 0) {
        let vertex = this.vertexes[index];

        for (let i = 0; i < vertex.edges; i++) {

        }

        this.vertexes.splice(index, 1);
    }
};

Graph.prototype.calculateCentricities = function () {
    let startNode = this.vertexes[0];
    let lastElement = this.RunBFSOverGraph(startNode);
    let radius = startNode.centricity = lastElement.depth;

    let nextParent = lastElement.parent;

    printErr('vertexes length: ' + this.vertexes.length);

    let nodesToExplore = [];

    while (nextParent !== undefined) {

        nodesToExplore.push(nextParent);
        if (!nextParent.parent.equals(startNode)) {
            nextParent = nextParent.parent;
        }
        else {
            break;
        }
    }

    while (nodesToExplore.length > 0) {
        nextParent = nodesToExplore.shift();
        let result = this.RunBFSOverGraph(nextParent);

        if (radius > result.depth) {
            radius = nextParent.centricity = result.depth;
        }
    }

    this.radius = radius;
    this.diameter = this.radius * 2;
};

Graph.prototype.RunBFSOverGraph = function (node) {
    let queue = []; // ^_^ hope the shift will work this time
    this.clearDepthValues();
    let maxCost = 0;
    let lastElement;

    queue.push(node);

    while (queue.length > 0) {
        let first = queue.shift();
        first.depth = first.parent !== undefined ? first.parent.depth + 1 : 0;

        if (maxCost < first.depth) {
            maxCost = first.depth;
            lastElement = first;
        }

        for (let i = 0; i < first.edges.length; i++) {
            let neighbour = first.edges[i].getToVertex(first);
            if (!neighbour.IsVisited()) {
                neighbour.parent = first;
                queue.push(neighbour);
            }
        }
    }

    return lastElement;
};

Graph.prototype.vertexDataExists = function (data) {
    for (let i = 0; i < this.vertexes.length; i++) {
        if (this.vertexes[i].data === data) {
            return i;
        }
    }

    return -1;
};

Graph.prototype.vertexExists = function (vertex) {
    for (let i = 0; i < this.vertexes.length; i++) {
        if (this.vertexes[i].equals(vertex)) {
            return i;
        }
    }

    return -1;
};

function Vertex(data) {
    this.edges = [];
    this.depth = -1;
    this.data = data;
    this.parent = undefined;
    this.centricity = -1;
}

Vertex.prototype.IsVisited = function () {
    return this.depth >= 0;
};

Vertex.prototype.equals = function (edge) {
    if (edge.data === this.data) {
        return true;
    }

    return false;
};

Vertex.prototype.edgeExists = function (edge) {
    for (let i = 0; i < this.edges.length; i++) {
        if (this.edges[i].equals(edge)) {
            return i;
        }
    }

    return -1;
};

Vertex.prototype.addEdge = function (vertex, weight) {
    let edge = new Edge(this, vertex, weight);
    if (this.edgeExists(edge) === -1) {
        this.edges.push(edge);
        return true;
    }

    return false;
};

Vertex.prototype.removeEdge = function (vertex) {
    let edge = new Edge(this, vertex, 0);
    let index = this.edgeExists(edge);
    if (index >= 0) {
        this.edges.splice(index, 1);
        return true;
    }

    return false;
};

function Edge(vertex1, vertex2, weight) {
    this.vertex1 = vertex1;
    this.vertex2 = vertex2;
    this.weight = weight;
}

Edge.prototype.equals = function (edge) {
    if (edge.vertex1.equals(this.vertex1) && edge.vertex2.equals(this.vertex2)) {
        return true;
    }

    return false;
};

Edge.prototype.getToVertex = function (node) {
    return node.equals(this.vertex1) ? this.vertex2 : this.vertex1;
};

let network = new Graph();

let n = parseInt(readline()); // the number of adjacency relations
for (let i = 0; i < n; i++) {
    let inputs = readline().split(' ');
    let xi = parseInt(inputs[0]); // the ID of a person which is adjacent to yi
    let yi = parseInt(inputs[1]); // the ID of a person which is adjacent to xi

    network.addEdge(xi, yi);
}

network.calculateCentricities();

// The minimal amount of steps required to completely propagate the advertisement
print(network.radius);