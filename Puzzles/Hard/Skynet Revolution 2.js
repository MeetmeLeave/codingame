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

Dikstra.prototype.nextNode = function(path, visitedNodes) {
    let result;

    for (let i = 0; i < path.length; i++) {
        if (!visitedNodes[i] && path[i].cost != Number.MAX_VALUE) {
            return path[i];
        }
    }

    return result;
};

function VirusSimulationStep() {
    this.closestPath = 99999;
    this.closestCell;
    this.closestExitNode;

    this.edgeA = -1;
    this.edgeB = -1;
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
                dangerNodes.push(j);
            } else if (!potentialDangerNodes.includes(j)) {
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

    //simulateAgent(SI, matrix, dangerNodes, exits);

    let edge = getClosestEdgeToRemove(path, matrix, dangerNodes, exits);

    print('' + edge.edgeA + ' ' + edge.edgeB);
}

function getClosestEdgeToRemove(path, matrix, dangerNodes, exits) {
    let edge = getClosestExitNode(path, exits);

    // find danger nodes to close
    if (edge.closestPath > 1 && dangerNodes.length > 0) {
        edge = getClosestDangerNode(path, matrix, dangerNodes, exits)
    }

    printErr('nodeA: ' + edge.edgeA);
    printErr('nodeB: ' + edge.edgeB);
    matrix[edge.edgeA][edge.edgeB] = 0;
    matrix[edge.edgeB][edge.edgeA] = 0;

    return edge;
}

function getClosestExitNode(path, exits) {
    let step = new VirusSimulationStep();

    for (let i = 0; i < exits.length; i++) {
        let exit = exits[i];
        let pathToExit = path[exit];

        if (step.closestPath > pathToExit.cost) {
            step.closestPath = pathToExit.cost;
            step.closestCell = pathToExit.parent;
            step.closestExitNode = pathToExit;
        }
    }

    step.edgeA = step.closestCell.data;
    step.edgeB = step.closestExitNode.data;

    return step;
}

function getClosestDangerNode(path, matrix, dangerNodes, exits) {
    let step = new VirusSimulationStep();

    let indexToRemove;
    for (let i = 0; i < dangerNodes.length; i++) {
        let exit = dangerNodes[i];
        let pathToExit = path[exit];

        if (step.closestPath > pathToExit.cost) {
            step.closestPath = pathToExit.cost;
            step.closestCell = pathToExit.parent;
            step.closestExitNode = pathToExit;
            indexToRemove = i;
        }
    }

    let exitNodeToClose;

    for (let i = 0; i < exits.length; i++) {
        if (matrix[step.closestExitNode.data][exits[i]] !== 0) {
            exitNodeToClose = exits[i];
            break;
        }
    }

    dangerNodes.splice(indexToRemove, 1);
    step.edgeA = exitNodeToClose;
    step.edgeB = step.closestExitNode.data;

    return step;
}

function makeAgentMove(closestExitNode, agentPosition) {
    let nextAgentNode = closestExitNode;

    while (true) {
        if (nextAgentNode.parent.data == agentPosition) {
            break;
        }

        nextAgentNode = nextAgentNode.parent;
    }

    printErr('nextAgentNode.data: ' + nextAgentNode.data);

    return nextAgentNode.data;
}

function simulateAgent(agentDefaultPosition, matrix, dangerNodes, exits) {
    let copyOfMatrix = matrix.splice(0);
    let copyOfDanger = dangerNodes.splice(0);
    let copyOfExits = exits.splice(0);

    let listOfMoves = [];
    //let dangerIndexOrder = [];
    let isSuccessfull = true;
    let node;

    // for (let i = 0; i < copyOfDanger.length; i++) {
    //     dangerIndexOrder.push(i);
    // }

    for (let i = 0; i < 50; i++) {
        if (i !== 0) {
            agentDefaultPosition = makeAgentMove(node.closestExitNode, agentDefaultPosition);
        }

        let path = new Dikstra(copyOfMatrix, agentDefaultPosition);

        node = getClosestEdgeToRemove(path, copyOfMatrix, copyOfDanger, copyOfExits);

        for (let i = 0; i < exits.length; i++) {
            let exit = exits[i];

            if (exit.data == agentDefaultPosition) {
                isSuccessfull = false;
                break;
            }
        }
    }
}