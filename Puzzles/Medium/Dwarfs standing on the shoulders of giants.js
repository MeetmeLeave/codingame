'use strict';

function Graph() {
    this.vertexes = [];
    this.influencers = [];
    this.distance = undefined;
}

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
    printErr('vertex - ' + vertex2.data + ' parent - ' + vertex1.data);
    vertex2.parents.push(vertex1);

    if (index1 === -1) {
        this.vertexes.push(vertex1);
    }

    if (index2 === -1) {
        this.vertexes.push(vertex2);
    }
};

Graph.prototype.calculateCentricities = function () {
    let distance = 0;

    for (let i = 0; i < this.vertexes.length; i++) {
        let vertex = this.vertexes[i];
        if (vertex.isInfluencer) {
            this.influencers.push(vertex);
        }
    }

    printErr('influencers.length: ' + this.influencers.length);
    printErr('@@@@@@');
    let graphs = this.FindAllDisconnectedParts();
    printErr('@@@@@@');
    printErr('graphs.length: ' + graphs.length);
    printErr('influencers.length: ' + this.influencers.length);
    for (let j = 0; j < graphs.length; j++) {
        for (let i = 0; i < graphs[j].length; i++) {
            let startNode = graphs[j][i];
            printErr('startNode.data: ' + startNode.data);
            let lastElement = this.RunBFSOverGraph(startNode, true);

            if (lastElement.depth > distance) {
                distance = lastElement.depth;
            }
        }
    }
    printErr('@@@@@@');
    this.distance = distance;
};

Graph.prototype.FindAllDisconnectedParts = function () {
    let groupedGraphs = [];
    let vertexesToExamine = this.vertexes.splice(0);
    let currentGraph = [];

    while (vertexesToExamine.length > 0) {
        this.RunBFSOverGraph(vertexesToExamine[0], false);
        printErr('vertexesToExamine.length: ' + vertexesToExamine.length);
        for (let i = 0; i < vertexesToExamine.length;) {
            let vert = vertexesToExamine[i];
            printErr('vert.data: ' + vert.data);
            printErr('vert.isVisited: ' + vert.isVisited);
            printErr('i: ' + i);

            if (vert.isVisited) {
                for (let j = 0; j < this.influencers.length; j++) {
                    let inf = this.influencers[j];
                    if (inf.equals(vert)) {
                        currentGraph.push(inf);
                        break;
                    }
                }
                printErr('currentGraph.leng: ' + currentGraph.length);
                vertexesToExamine.splice(i, 1);
            } else {
                ++i;
                printErr('i++: ' + i);
            }

            printErr('vertexesToExamine.length: ' + vertexesToExamine.length);
        }
        
        groupedGraphs.push(currentGraph);
        currentGraph = [];
    }

    return groupedGraphs;
};

Graph.prototype.RunBFSOverGraph = function (node, isDirected) {
    let queue = []; // ^_^ hope the shift will work this time
    let maxCost = 0;
    let lastElement;
    node.parent = undefined;
    node.depth = -1;

    queue.push(node);

    while (queue.length > 0) {
        let first = queue.shift();
        first.isVisited = true;
        printErr('first.data: ' + first.data);
        first.depth = first.parent !== undefined ? first.parent.depth + 1 : 1;
        printErr('first.depth:' + first.depth);
        if (maxCost < first.depth) {
            maxCost = first.depth;
            lastElement = first;
        }

        for (let i = 0; i < first.edges.length; i++) {
            let edge = first.edges[i];
            printErr('edge.weight:' + edge.weight);
            if (isDirected) {
                if (edge.weight > 0) {
                    let neighbour = edge.getToVertex(first);
                    //if (neighbour.parents.length == 1) {
                        neighbour.parent = first;
                        queue.push(neighbour);
                    //}
                }
            } else {
                let neighbour = edge.getToVertex(first);
                if (!neighbour.isVisited) {
                    neighbour.parent = first;
                    queue.push(neighbour);
                    neighbour.isVisited = true;
                }
            }
        }
    }

    printErr('maxcost: ' + maxCost);
    printErr('lastElement.depth: ' + lastElement.depth);

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
    
    if (inputs.length == 2) {
        printErr(inputs);
        network.addEdge(xi, yi);
    }
}

network.calculateCentricities();

// The minimal amount of steps required to completely propagate the advertisement
print(network.distance);