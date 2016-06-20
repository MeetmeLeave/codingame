'use strict';

function DisktraNode(data, cost) {
    this.data = data;
    this.cost = cost;
}

function Dikstra(matrix, startNode) {
    let path = [];
    let visitedNodes = [];

    for (let i = 0; i < matrix.length; i++) {
        visitedNodes[i] = false;
        let node = new DisktraNode(i, Number.MAX_VALUE);
        path[i] = node;
    }

    path[startNode].cost = 0;

    for (let i = 0; i < matrix.length; i++) {

        let closestVertex;

        if (i > 0) {
            closestVertex = this.nextNode(path, visitedNodes);
        }
        else {
            closestVertex = path[startNode];
        }

        if (closestVertex !== undefined) {
            visitedNodes[closestVertex.data] = true;

            for (let j = 0; j < matrix.length; j++) {
                let combinedCost = closestVertex.cost + matrix[closestVertex.data][j];
                if (!visitedNodes[j]
                    && matrix[closestVertex.data][j] !== 0
                    && combinedCost < path[j].cost) {
                    path[j].parent = closestVertex;
                    path[j].cost = closestVertex.cost + matrix[closestVertex.data][j];
                }
            }
        }
    }

    return path;
}

Dikstra.prototype.nextNode = function (path, visitedNodes) {
    let result;

    for (let i = 0; i < path.length; i++) {
        if (!visitedNodes[i] && path[i].cost != Number.MAX_VALUE) {
            return path[i];
        }
    }

    return result;
};

let matrix = [];
let exits = [];

let inputs = readline().split(' ');
let N = parseInt(inputs[0]); // the total number of nodes in the level, including the gateways
let L = parseInt(inputs[1]); // the number of links
let E = parseInt(inputs[2]); // the number of exit gateways

for (let i = 0; i < N; i++) {
    let row = [];
    for (let j = 0; j < N; j++) {
        row.push(0);
    }
    matrix.push(row);
}

for (let i = 0; i < L; i++) {
    let inputs = readline().split(' ');
    let N1 = parseInt(inputs[0]); // N1 and N2 defines a link between these nodes
    let N2 = parseInt(inputs[1]);

    matrix[N1][N2] = 1;
    matrix[N2][N1] = 1;
}

// debug matrix
for (let i = 0; i < N; i++) {
    printErr(matrix[i]);
}

for (let i = 0; i < E; i++) {
    let EI = parseInt(readline()); // the index of a gateway node
    printErr('EI: ' + EI);
    exits.push(EI);
}

// game loop
while (true) {
    let SI = parseInt(readline()); // The index of the node on which the Skynet agent is positioned this turn
    printErr('SI: ' + SI);

    let path = new Dikstra(matrix, SI);

    for (let i = 0; i < path.length; i++) {
        printErr('Vertex: ' + path[i].data + ' Distance: ' + path[i].cost);
        if (path[i].parent !== undefined) {
            printErr('Parent: ' + path[i].parent.data);
        }
    }

    let closestPath = 99999;
    let closestExit = -1;
    let closestCell;

    for (let i = 0; i < exits.length; i++) {
        let exit = exits[i];
        let pathToExit = path[exit];

        if (closestPath > pathToExit.cost) {
            closestPath = pathToExit.cost;
            closestExit = exit;
            closestCell = pathToExit.parent;
        }
    }
    printErr('closestExit: ' + closestExit);
    printErr('closestCell.data: ' + closestCell.data);
    matrix[closestCell.data][closestExit] = 0;
    matrix[closestExit][closestCell.data] = 0;
    print('' + closestCell.data + ' ' + closestExit);

    //print('0 1'); // Example: 0 1 are the indices of the nodes you wish to sever the link between
}