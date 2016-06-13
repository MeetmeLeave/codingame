'use strict';

// Constants
const STATE_EMPTY = 'EMPTY';
const STATE_START = 'START';
const STATE_DEAD = 'DEAD';
const STATE_ERROR = 'ERROR';

const STATE_SOUTH = 'SOUTH';
const STATE_NORTH = 'NORTH';
const STATE_EAST = 'EAST';
const STATE_WEST = 'WEST';
const STATE_LOOP = 'LOOP';

const TILE_START = '@';
const TILE_BORDER = '#';
const TILE_OBSTACLE = 'X';
const TILE_END = '$';
const TILE_SOUTH = 'S';
const TILE_NORTH = 'N';
const TILE_EAST = 'E';
const TILE_WEST = 'W';
const TILE_INVERSE = 'I';
const TILE_BEAR = 'B';
const TILE_TELEPORT = 'T';
const TILE_EMPTY = ' ';

// Magic value ^_^
const TURNS_BEFORE_LOOP = 100;

// Map
let map = [];

let t1X = -1;
let t1Y = -1;
let t2X = -1;
let t2Y = -1;

function MapNode(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.isVisited = false;
    this.direction = ''
}

// Bender ( ‾ʖ̫‾)
function Bender() {
    this.currentState = STATE_START;
    this.isInBreakerMode = false;
    this.isMovePriorityReversed = false;
    this.currentTile = TILE_START;
    this.currentX = -1;
    this.currentY = -1;
    this.loopCounter = 0;
    this.path = [];
}

Bender.prototype.isDead = function() {
    return this.currentState === STATE_DEAD;
};

Bender.prototype.isInLoop = function() {
    return this.currentState === STATE_LOOP;
};

Bender.prototype.setPosition = function(x, y) {
    this.currentX = x;
    this.currentY = y;
};

Bender.prototype.updatePosition = function() {
    switch (this.currentState) {
        case STATE_SOUTH:
            this.currentX += 1;
            break;
        case STATE_EAST:
            this.currentY += 1;
            break;
        case STATE_NORTH:
            this.currentX -= 1;
            break;
        case STATE_WEST:
            this.currentY -= 1;
            break;
        default:
            return;
    }

    let tile = map[this.currentX][this.currentY];
    if (!tile.isVisited) {
        tile.isVisited = true;
        tile.direction = this.currentState;
        this.loopCounter -= 1;
    }

    if (tile.isVisited && tile.direction == this.currentState) {
        this.loopCounter += 1;
    }

    this.currentTile = tile.value;
};

Bender.prototype.buildPath = function(params) {
    // Update this part for move set prediction
    while (!bender.isDead() && !bender.isInLoop()) {
        bender.move();
    }

    return this.path;
};

Bender.prototype.move = function() {
    // printErr('previousState: ' + this.currentState + ' !@#$%');
    this.updatePosition();
    this.updateState();
    // printErr('coordinates: X: ' + this.currentX + '; Y: ' + this.currentY + ' !@#$%');
    printErr('currentState: ' + this.currentState + ' !@#$%');
    // printErr('###########');
};

Bender.prototype.updateState = function() {
    let nextState = this.currentState;

    if (this.loopCounter >= TURNS_BEFORE_LOOP) {
        this.path = [];
        this.currentState = STATE_LOOP;
        this.path.push(this.currentState);
        return;
    }

    // printErr('currentTile: ' + this.currentTile + ' !@#$%');
    switch (this.currentTile) {
        case TILE_EMPTY:
            break;
        case TILE_START:
            if (this.currentState == STATE_START) {
                nextState = STATE_SOUTH;
            }
            break;
        case TILE_OBSTACLE:
            map[this.currentX][this.currentY].value = TILE_EMPTY;
            break;
        case TILE_SOUTH:
            nextState = STATE_SOUTH;
            break;
        case TILE_NORTH:
            nextState = STATE_NORTH;
            break;
        case TILE_EAST:
            nextState = STATE_EAST;
            break;
        case TILE_WEST:
            nextState = STATE_WEST;
            break;
        case TILE_INVERSE:
            this.isMovePriorityReversed = this.isMovePriorityReversed ? false : true;
            break;
        case TILE_BEAR:
            this.isInBreakerMode = this.isInBreakerMode ? false : true;
            break;
        case TILE_TELEPORT:
            if (this.currentX === t1X && this.currentY === t1Y) {
                this.setPosition(t2X, t2Y);
            } else {
                this.setPosition(t1X, t1Y);
            }
            break;
        case TILE_END:
            nextState = STATE_DEAD;
            break;
        default:
            nextState = STATE_ERROR;
            break;
    }

    if (nextState != STATE_DEAD && nextState != STATE_ERROR) {
        let moves = this.getNextMovableState(nextState);

        // DEBUG
        // for (let i = 0; i < moves.length - 1; i++) {
        //     this.path.push(moves[i]);
        // }

        nextState = moves[moves.length - 1];
    } else {
        this.currentState = nextState;
        return;
    }

    this.currentState = nextState;
    this.path.push(this.currentState);
};

Bender.prototype.getNextMovableState = function(direction) {
    let nextMoveStates = [];

    let tile = this.getMapTileByDirection(direction);
    if (!this.canMoveOnTile(tile)) {
        let priorities = this.getPossibleMovePriorities();

        for (let i = 0; i < priorities.length; i++) {
            let priority = priorities[i];
            tile = this.getMapTileByDirection(priority);
            nextMoveStates.push(priority);
            if (this.canMoveOnTile(tile)) {
                break;
            }
        }
    } else {
        nextMoveStates.push(direction);
    }

    return nextMoveStates;
};

Bender.prototype.canMoveOnTile = function(tile) {
    let canMove = true;

    if (tile == TILE_BORDER) {
        canMove = false;
    } else if (tile == TILE_OBSTACLE && !this.isInBreakerMode) {
        canMove = false;
    }

    return canMove;
};

Bender.prototype.getMapTileByDirection = function(direction) {
    let x = this.currentX;
    let y = this.currentY;
    switch (direction) {
        case STATE_SOUTH:
            x += 1;
            break;
        case STATE_EAST:
            y += 1;
            break;
        case STATE_NORTH:
            x -= 1;
            break;
        case STATE_WEST:
            y -= 1;
            break;
        default:
            break;
    }

    return map[x][y].value;
};

Bender.prototype.getPossibleMovePriorities = function() {
    let possibleMoves = [];

    if (this.isMovePriorityReversed) {
        possibleMoves.push(STATE_WEST);
        possibleMoves.push(STATE_NORTH);
        possibleMoves.push(STATE_EAST);
        possibleMoves.push(STATE_SOUTH);
    } else {
        possibleMoves.push(STATE_SOUTH);
        possibleMoves.push(STATE_EAST);
        possibleMoves.push(STATE_NORTH);
        possibleMoves.push(STATE_WEST);
    }

    return possibleMoves;
};

// Play the FSM
let bender = new Bender();

let inputs = readline().split(' ');
let L = parseInt(inputs[0]);
let C = parseInt(inputs[1]);
for (let i = 0; i < L; i++) {
    let row = readline();
    map[i] = [];
    printErr(row);
    for (let j = 0; j < row.length; j++) {
        let tileVal = row[j];
        map[i][j] = new MapNode(i, j, tileVal);

        if (tileVal == TILE_START) {
            bender.setPosition(i, j);
        }

        if (tileVal === TILE_TELEPORT) {
            if (t1X === -1) {
                t1X = i;
                t1Y = j;
            } else {
                t2X = i;
                t2Y = j;
            }
        }
    }
}

printErr('---------');

let path = bender.buildPath();
printErr('path: ' + path);
for (let i = 0; i < path.length; i++) {

    print(path[i]);
}