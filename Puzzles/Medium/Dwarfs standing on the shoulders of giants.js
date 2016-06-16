'use strict';

function Graph() {
    this.vertexes = [];
    this.influencers = [];
    this.distance = undefined;
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
    } else {
        vertex1 = new Vertex(data1);
    }

    if (index2 >= 0) {
        vertex2 = this.vertexes[index2];
    } else {
        vertex2 = new Vertex(data2);
    }

    vertex1.addEdge(vertex2, 1);
    vertex2.isInfluencer = false;
    vertex2.addEdge(vertex1, 0);
    vertex2.parents.push(vertex1);

    if (index1 === -1) {
        this.vertexes.push(vertex1);
    }

    if (index2 === -1) {
        this.vertexes.push(vertex2);
    }
};

Graph.prototype.calculateCentricities = function () {
    let distance = -1;

    for (let i = 0; i < this.vertexes.length; i++) {
        let vertex = this.vertexes[i];
        if (vertex.isInfluencer) {
            this.influencers.push(vertex);
        }
    }

    for (let i = 0; i < this.influencers.length; i++) {
        let startNode = this.influencers[i];
        let lastElement = this.RunBFSOverGraph(startNode, true);

        if (lastElement.depth > distance) {
            distance = lastElement.depth;
        }
    }

    this.distance = distance;
};

Graph.prototype.FindAllDisconnectedParts = function (influencers) {  
    let groupedGraphs = new Map();
    let vertexesToExamine = 

    let currentGraph = []; 

    for (let i = 0; i < this.vertexes.length; i++) {
        
    }

    return graphs;
};

Graph.prototype.RunBFSOverGraph = function (node, isDirected) {
    let queue = []; // ^_^ hope the shift will work this time
    this.clearDepthValues();
    let maxCost = 0;
    let lastElement;

    queue.push(node);

    while (queue.length > 0) {
        let first = queue.shift();
        first.depth = first.parent !== undefined ? first.parent.depth + 1 : 1;

        if (maxCost < first.depth) {
            maxCost = first.depth;
            lastElement = first;
        }

        for (let i = 0; i < first.edges.length; i++) {
            let edge = first.edges[i];
            if (isDirected) {
                if (edge.weight > 0) {
                    let neighbour = edge.getToVertex(first);
                    if (neighbour.parents.length == 1) {
                        neighbour.parent = first;
                        queue.push(neighbour);
                    }
                }
            }
            else {
                let neighbour = edge.getToVertex(first);
                if (neighbour.parents.length == 1) {
                    neighbour.parent = first;
                    queue.push(neighbour);
                    neighbour.isVisited = true;
                } else {
                    neighbour.isVisited = true;
                }
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
    this.parents = [];
    this.depth = -1;
    this.data = data;
    this.parent = undefined;
    this.centricity = -1;
    this.isInfluencer = true;
    this.isVisited = false;
}

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

let network = new Graph(true);

let n = parseInt(readline()); // the number of adjacency relations
for (let i = 0; i < n; i++) {
    let inputs = readline().split(' ');
    let xi = parseInt(inputs[0]); // the ID of a person which is adjacent to yi
    let yi = parseInt(inputs[1]); // the ID of a person which is adjacent to xi
    printErr(inputs);
    if (inputs.length == 2) {
        network.addEdge(xi, yi);
    }
}

network.calculateCentricities();

// The minimal amount of steps required to completely propagate the advertisement
print(network.distance);