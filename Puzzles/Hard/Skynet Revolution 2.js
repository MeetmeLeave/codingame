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
        } else {
            closestVertex = path[startNode];
        }

        if (closestVertex !== undefined) {
            visitedNodes[closestVertex.data] = true;

            for (let j = 0; j < matrix.length; j++) {
                let combinedCost = closestVertex.cost + matrix[closestVertex.data][j];
                if (!visitedNodes[j] && matrix[closestVertex.data][j] !== 0 && combinedCost < path[j].cost) {
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

function VirusStepNode() {
    this.edgeA = -1;
    this.edgeB = -1;

    this.agentNextStep = -1;
}

let matrix = [];
let exits = [];
let dangerNodes = [];

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
    // printErr('graphNode: ' + N1 + ' ' + N2);
    matrix[N1][N2] = 1;
    matrix[N2][N1] = 1;
}

// debug matrix
// for (let i = 0; i < N; i++) {
//     printErr(matrix[i]);
// }

let potentialDangerNodes = [];

for (let i = 0; i < E; i++) {
    let EI = parseInt(readline()); // the index of a gateway node
    printErr('EI: ' + EI);
    exits.push(EI);
}

for (let j = 0; j < matrix.length; j++) {
    for (let i = 0; i < E; i++) {
        let EI = exits[i];

        let nodeVal = matrix[j][EI];
        if (nodeVal !== 0) {
            if (potentialDangerNodes.includes(j) && !dangerNodes.includes(j)) {
                printErr('EI: ' + EI);
                printErr('j: ' + j);
                dangerNodes.push(j);
            } else if (!potentialDangerNodes.includes(j)) {
                printErr('EI potential: ' + EI);
                printErr('j potential: ' + j);
                potentialDangerNodes.push(j);
            }
        }
    }
}

// game loop
while (true) {
    let SI = parseInt(readline()); // The index of the node on which the Skynet agent is positioned this turn
    printErr('SI: ' + SI);

    let path = new Dikstra(matrix, SI);

    // debug distances
    // for (let i = 0; i < path.length; i++) {
    //     printErr('Vertex: ' + path[i].data + ' Distance: ' + path[i].cost);
    //     if (path[i].parent !== undefined) {
    //         printErr('Parent: ' + path[i].parent.data);
    //     }
    // }

    let edge = getClosestEdgeToRemove(path, matrix, dangerNodes, exits, SI);

    printErr('nodeA: ' + edge.edgeA);
    printErr('nodeB: ' + edge.edgeB);
    matrix[edge.edgeA][edge.edgeB] = 0;
    matrix[edge.edgeB][edge.edgeA] = 0;
    print('' + edge.edgeA + ' ' + edge.edgeB);
}

function getClosestEdgeToRemove(path, matrix, dangerNodes, exits, agentPosition) {
    let edge = new VirusStepNode();

    let closestPath = 99999;
    let closestExit = -1;
    let closestCell;
    let closestExitNode;

    for (let i = 0; i < exits.length; i++) {
        let exit = exits[i];
        let pathToExit = path[exit];

        if (closestPath > pathToExit.cost) {
            closestPath = pathToExit.cost;
            closestExit = exit;
            closestCell = pathToExit.parent;
            closestExitNode = pathToExit;
        }
    }

    let nextAgentNode = closestExitNode;

    while (true) {

        if (nextAgentNode.parent.data == agentPosition) {
            edge.agentNextStep = nextAgentNode.data;
            break;
        }

        nextAgentNode = nextAgentNode.parent;
    }

    // find danger nodes to close
    if (closestPath > 1 && dangerNodes.length > 0) {
        printErr('dangerNodes.length: ' + dangerNodes.length);
        closestPath = 99999;
        let indexToRemove;
        for (let i = 0; i < dangerNodes.length; i++) {
            let exit = dangerNodes[i];
            let pathToExit = path[exit];

            if (closestPath > pathToExit.cost) {
                closestPath = pathToExit.cost;
                closestExit = exit;
                closestCell = pathToExit.parent;
                indexToRemove = i;
            }
        }

        let exitNodeToClose;

        for (let i = 0; i < exits.length; i++) {
            if (matrix[closestExit][exits[i]] !== 0) {
                exitNodeToClose = exits[i];
                break;
            }
        }

        dangerNodes.splice(indexToRemove, 1);
        edge.edgeA = exitNodeToClose;
        edge.edgeB = closestExit;
    }
    // find exit nodes to close
    else {
        edge.edgeA = closestCell.data;
        edge.edgeB = closestExit;
    }

    printErr('nextAgentNode.data: '+ nextAgentNode.data);

    return edge;
}

function simulateAgent(agentDefaultPosition, matrix, dangerNodes, exits) {
    let copyOfMatrix = matrix.splice(0);
    let copyOfDanger = dangerNodes.splice(0);
    let copyOfExits = exits.splice(0);

    let finished = false;
    let listOfMoves = [];
    let dangerIndexOrder = [];
    let isSuccessfull;

    for (let i = 0; i < copyOfDanger.length; i++) {
        dangerIndexOrder.push(i);
    }

    while (!finished) {
        let path = new Dikstra(copyOfMatrix, agentDefaultPosition);

        let node = getClosestEdgeToRemove(path, copyOfMatrix, copyOfDanger, copyOfExits, dangerIndexOrder);
        copyOfMatrix[edge.edgeA][edge.edgeB] = 0;
        copyOfMatrix[edge.edgeB][edge.edgeA] = 0;
    }
}