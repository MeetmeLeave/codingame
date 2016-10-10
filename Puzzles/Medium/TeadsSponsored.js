'use strict';

function Graph() {
    this.vertexes = new Map();
    this.radius = undefined;
    this.diameter = undefined;
}

Graph.prototype.clearDepthValues = function() {
    this.vertexes.forEach(function(value, key, map) {
        value.depth = -1;
        value.parent = undefined;
    }, this);
};

Graph.prototype.addEdge = function(data1, data2) {
    let vertex1;
    let vertex2;

    if (this.vertexes.has(data1)) {
        vertex1 = this.vertexes.get(data1);
    } else {
        vertex1 = new Vertex(data1);
        this.vertexes.set(data1, vertex1);
    }

    if (this.vertexes.has(data2)) {
        vertex2 = this.vertexes.get(data2);
    } else {
        vertex2 = new Vertex(data2);
        this.vertexes.set(data2, vertex2);
    }

    vertex1.addEdge(vertex2);
    vertex2.addEdge(vertex1);
};

Graph.prototype.calculateCentricities = function() {
    let startNode = this.vertexes.values().next().value;
    let lastElement = this.RunBFSOverGraph(startNode);
    let radius = startNode.centricity = lastElement.depth;

    let nextParent = lastElement.parent;

    let nodesToExplore = [];

    while (nextParent !== undefined) {

        nodesToExplore.push(nextParent);
        if (!nextParent.parent.equals(startNode)) {
            nextParent = nextParent.parent;
        } else {
            break;
        }
    }

    // brute force it, if the path is small
    //     while (nodesToExplore.length > 0) {
    //         nextParent = nodesToExplore.shift();
    //         let result = this.RunBFSOverGraph(nextParent);

    //         if (radius > result.depth) {
    //             radius = nextParent.centricity = result.depth;
    //         }
    //     }
    // }

    // Instead of brute forcing the list of nodes.
    // We will start looking for the center nodes in the pass, untill there will be no verticles with lower centricity then current found
    // Also will use splice for the center elements, instead of enefficent shifting of array
    // For enormously large graphs it should be optimized on the level of nodes creation
    let turnesRadiusIsUnchanged = 0;

    for (let i = parseInt(nodesToExplore.length / 2); i < nodesToExplore.length;) {
        if (turnesRadiusIsUnchanged >= 5) {
            break;
        }

        nextParent = nodesToExplore[i];
        nodesToExplore.splice(i, 1);
        let result = this.RunBFSOverGraph(nextParent);

        if (radius > result.depth) {
            radius = nextParent.centricity = result.depth;
            turnesRadiusIsUnchanged = 0;
        } else {
            turnesRadiusIsUnchanged += 1;
        }
    }
    // }

    this.radius = radius;
    this.diameter = this.radius * 2;
};

Graph.prototype.RunBFSOverGraph = function(node) {
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

function Vertex(data) {
    this.edges = [];
    this.depth = -1;
    this.data = data;
    this.parent = undefined;
    this.centricity = -1;
}

Vertex.prototype.IsVisited = function() {
    return this.depth >= 0;
};

Vertex.prototype.equals = function(edge) {
    if (edge.data === this.data) {
        return true;
    }

    return false;
};

Vertex.prototype.edgeExists = function(edge) {
    for (let i = 0; i < this.edges.length; i++) {
        if (this.edges[i].equals(edge)) {
            return i;
        }
    }

    return -1;
};

Vertex.prototype.addEdge = function(vertex, weight) {
    let edge = new Edge(this, vertex, weight);
    if (this.edgeExists(edge) === -1) {
        this.edges.push(edge);
        return true;
    }

    return false;
};

Vertex.prototype.removeEdge = function(vertex) {
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

Edge.prototype.equals = function(edge) {
    if (edge.vertex1.equals(this.vertex1) && edge.vertex2.equals(this.vertex2)) {
        return true;
    }

    return false;
};

Edge.prototype.getToVertex = function(node) {
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