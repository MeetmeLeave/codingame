'use strict';

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

let map = [];

let t1X = -1;
let t1Y = -1;
let t2X = -1;
let t2Y = -1;

function Bender() {
    this.currentState = STATE_START;
    this.isInBreakerMode = false;
    this.isMovePriorityReversed = false;
    this.currentTile = TILE_START;
    this.currentX = -1;
    this.currentY = -1;
}

Bender.prototype.isDead = function () {
    return this.currentState === STATE_DEAD;
};

Bender.prototype.isInLoop = function () {
    return this.currentState === STATE_LOOP;
};

Bender.prototype.setPosition = function (x, y) {
    this.currentX = x;
    this.currentY = y;
};

Bender.prototype.updatePosition = function () {
    switch (this.currentState) {
        case STATE_SOUTH:
            this.currentY += 1;
            break;
        case STATE_EAST:
            this.currentX += 1;
            break;
        case STATE_NORTH:
            this.currentY -= 1;
            break;
        case STATE_WEST:
            this.currentX -= 1;
            break;
        default:
            return;
    }

    this.currentTile = map[this.currentX][this.currentY];
};

Bender.prototype.move = function () {
    printErr('previousState: ' + this.currentState + ' !@#$%');
    this.updatePosition();
    this.updateState();
    printErr('currentState: ' + this.currentState + ' !@#$%');
    printErr('###########');
    return this.currentState;
};

Bender.prototype.updateState = function () {
    let nextState = this.currentState;
    printErr('currentTile: ' + this.currentTile + ' !@#$%');
    switch (this.currentTile) {
        case TILE_EMPTY:
            printErr('EMPTY');
            break;
        case TILE_START:
            if (this.currentState == STATE_START) {
                nextState = STATE_SOUTH;
            }
            break;
        case TILE_OBSTACLE:
            map[this.currentX][this.currentY] = TILE_EMPTY;
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
            }
            else {
                this.setPosition(t1X, t1Y);
            }
            break;
        case TILE_END:
            nextState = STATE_DEAD;
            break;
        default:
            printErr('ERROR');
            nextState = STATE_ERROR;
            break;
    }

    if (nextState != STATE_DEAD && nextState != STATE_ERROR) {
        nextState = this.getNextMovableState(nextState);
    }

    this.currentState = nextState;
};

Bender.prototype.getNextMovableState = function (direction) {
    let nextMoveState = 'ERROR';

    let tile = this.getMapTileByDirection(direction);

    if (!this.canMoveOnTile(tile)) {
        let priorities = this.getPossibleMovePriorities();

        for (let i = 0; i < priorities.length; i++) {
            let priority = priorities[i];
            printErr('priority: ' + priority);
            tile = this.getMapTileByDirection(priority);

            if (this.canMoveOnTile(tile)) {
                nextMoveState = priority;
                printErr('selected priority: ' + priority);
                break;
            }
        }
    }
    else {
        nextMoveState = direction;
    }

    return nextMoveState;
};

Bender.prototype.canMoveOnTile = function (tile) {
    if (tile == TILE_BORDER || tile == TILE_OBSTACLE && !this.isInBreakerMode) {
        return false;
    }

    return true;
};

Bender.prototype.getMapTileByDirection = function (direction) {
    let x = this.currentX;
    let y = this.currentX;

    switch (direction) {
        case STATE_SOUTH:
            y += 1;
            break;
        case STATE_EAST:
            x += 1;
            break;
        case STATE_NORTH:
            y -= 1;
            break;
        case STATE_WEST:
            x -= 1;
            break;
        default:
            break;
    }

    return map[x][y];
};

Bender.prototype.getPossibleMovePriorities = function () {
    let possibleMoves = [];

    if (this.isMovePriorityReversed) {
        possibleMoves.push(TILE_WEST);
        possibleMoves.push(TILE_NORTH);
        possibleMoves.push(TILE_EAST);
        possibleMoves.push(TILE_SOUTH);
    }
    else {
        possibleMoves.push(TILE_SOUTH);
        possibleMoves.push(TILE_EAST);
        possibleMoves.push(TILE_NORTH);
        possibleMoves.push(TILE_WEST);
    }

    return possibleMoves;
};

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
        map[i][j] = tileVal;

        if (tileVal == TILE_START) {
            bender.setPosition(i, j);
        }

        if (tileVal === TILE_TELEPORT) {
            if (t1X === -1) {
                t1X = i;
                t1Y = j;
            }
            else {
                t2X = i;
                t2Y = j;
            }
        }
    }
}

printErr('---------');

// Update this part for move set prediction
if (bender.isInLoop()) {
    print(STATE_LOOP);
}

while (!bender.isDead() || !bender.isInLoop()) {
    let benderMove = bender.move();
    print(benderMove);
}