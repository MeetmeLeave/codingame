'use strict';

function Graph() {
    this.vertexes = [];
    this.exits = [];
    this.target = -1;
}

Graph.prototype.buildExitsMap = function (exits) {
    for (let i = 0; i < this.vertexes.length; i++) {
        if (exits.length === 0) {
            break;
        }

        for (let j = 0; j < exits.length; j++) {
            if (this.vertexes[i].data == exits[j]) {
                this.exits.push(i);
                exits.splice(j, 1);
                break;
            }
        }
    }
};

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
// Graph.prototype.removeEdge = function (data1) {
//     let index = this.vertexDataExists(data1);
//     if (index >= 0) {
//         let vertex = this.vertexes[index];

//         for (let i = 0; i < vertex.edges; i++) {

//         }

//         this.vertexes.splice(index, 1);
//     }
// };

Graph.prototype.findClosestExitToTargetAndRemoveEdge = function () {
    let result = '';
    let targetNode;

    for (let i = 0; i < this.vertexes.length; i++) {
        if (this.vertexes[i].data == this.target) {
            targetNode = this.vertexes[i];
            break;
        }
    }

    printErr('targetNode: ' + targetNode.data);

    for (let i = 0; i < targetNode.edges.length; i++) {
        let currentEdge = targetNode.edges[i];
        let neighbour = targetNode.edges[i].getToVertex(targetNode);
        printErr('neighbour: ' + neighbour.data);
        for (let j = 0; j < this.exits.length; j++) {
            let exit = this.vertexes[this.exits[j]];
            printErr('exit: ' + exit.data);
            if (neighbour.equals(exit)) {
                result = '' + currentEdge.vertex1.data + ' ' + currentEdge.vertex2.data;
                return result;
            }
        }
    }

    let closestToGoal;
    let shortestDistance = 99999;

    for (let i = 0; i < this.exits.length; i++) {
        let vertexIndex = this.exits[i];
        let goal = this.RunBFSOverGraph(this.vertexes[vertexIndex], this.target);
        printErr('goal.data: ' + goal.data);
        if (goal.data === this.target) {
            if (goal.depth < shortestDistance) {
                shortestDistance = goal.depth;
                closestToGoal = goal;
            }
        }
        else {
            this.exits.splice(i, 1);
        }
    }

    result = '' + closestToGoal.data + ' ' + closestToGoal.parent.data;

    return result;
};

Graph.prototype.RunBFSOverGraph = function (node, targetData) {
    let queue = []; // ^_^ hope the shift will work this time
    this.clearDepthValues();
    let maxCost = 0;
    let lastElement;
    printErr('node.data: ' + node.data);
    printErr('targetData: ' + targetData);
    queue.push(node);

    while (queue.length > 0) {
        let first = queue.shift();
        first.depth = first.parent !== undefined ? first.parent.depth + 1 : 0;
        printErr('first.data: ' + first.data);

        if (first.data == targetData) {
            maxCost = first.depth;
            lastElement = first;
            break;
        }
        else if (maxCost < first.depth) {
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

var inputs = readline().split(' ');
var N = parseInt(inputs[0]); // the total number of nodes in the level, including the gateways
var L = parseInt(inputs[1]); // the number of links
var E = parseInt(inputs[2]); // the number of exit gateways

for (var i = 0; i < L; i++) {
    var inputs = readline().split(' ');
    var N1 = parseInt(inputs[0]); // N1 and N2 defines a link between these nodes
    var N2 = parseInt(inputs[1]);

    network.addEdge(N1, N2);
}

let exits = [];

for (var i = 0; i < E; i++) {
    var EI = parseInt(readline()); // the index of a gateway node
    printErr('EI: ' + EI);
    exits.push(EI);
}

network.buildExitsMap(exits);

// game loop
while (true) {
    var SI = parseInt(readline()); // The index of the node on which the Skynet agent is positioned this turn
    network.target = SI;
    printErr('SI: ' + SI);
    let result = network.findClosestExitToTargetAndRemoveEdge();
    print(result);
    // Write an action using print()
    // To debug: printErr('Debug messages...');

    //print('0 1'); // Example: 0 1 are the indices of the nodes you wish to sever the link between
}