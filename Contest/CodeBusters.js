'use strict';

const STATE_SPAWNED = 'SPAWNED';
const STATE_RETREAT = 'RETREAT';
const STATE_SEAK = 'SEAK';
const STATE_RELEASE = 'RELEASE';
const STATE_CAPTURE = 'CAPTURE';

const RELEASE_DISTANCE = 1600;

const MOVE_DIRECTION_FIRST_TEAM = ['SE', 'S', 'E', 'NE', 'SW', 'NW', 'N', 'W'];
const MOVE_DIRECTION_SECOND_TEAM = ['NW', 'N', 'W', 'NE', 'SW', 'SE', 'S', 'E'];

const TYPE_GHOST = -1;

const MAP_LENGTH = 16001;
const MAP_HEIGHT = 9001;

function equlidianDistanceBetweenMobiles(mobile1, mobile2) {
    return Math.sqrt(Math.pow((mobile1.currentX - mobile2.currentX), 2) + Math.pow((mobile1.currentY - mobile2.currentY), 2));
}

function equlidianFromMobile(mobile1, x, y) {
    return Math.sqrt(Math.pow((mobile1.currentX - x), 2) + Math.pow((mobile1.currentY - y), 2));
}

function pickNextMoveCoordinatesForMobile(mobile, direction) {
    let moveResult = {
        x: mobile.currentX,
        y: mobile.currentY
    };

    switch (direction) {
        case 'SE':
            moveResult.x += mobile.speed;
            moveResult.y += mobile.speed;
            break;
        case 'S':
            moveResult.y += mobile.speed;
            break;
        case 'E':
            moveResult.x += mobile.speed;
            break;
        case 'NE':
            moveResult.x += mobile.speed;
            moveResult.y -= mobile.speed;
            break;
        case 'SW':
            moveResult.x -= mobile.speed;
            moveResult.y += mobile.speed;
            break;
        case 'NW':
            moveResult.x -= mobile.speed;
            moveResult.y -= mobile.speed;
            break;
        case 'N':
            moveResult.y -= mobile.speed;
            break;
        case 'W':
            moveResult.x -= mobile.speed;
            break;
    }

    return moveResult;
}

function validateMove(move) {
    let isValid = false;

    if (move.x >= 0 && move.x <= MAP_LENGTH && move.y >= 0 && move.y <= MAP_HEIGHT) {
        isValid = true;
    }

    return isValid;
}

class Mobile {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
    }

    get ID() {
        return this.id;
    }

    get currentX() {
        return this.x;
    }

    set currentX(value) {
        this.x = value;
    }

    get currentY() {
        return this.y;
    }

    set currentY(value) {
        this.y = value;
    }
}

class Buster extends Mobile {
    constructor(x, y, id, teamId) {
        super(x, y, id);
        this.team = teamId;
        this.state = STATE_SPAWNED;
        this.losRange = 2200;
        this.speed = 800;
        this.maxShootingRange = 1760;
        this.minShootingRange = 900;
        this.ghost = -1;
        this.currentTargetMobile = -1;
    }

    get capturedGhost() {
        return this.ghost;
    }

    set capturedGhost(value) {
        this.ghost = value;
    }

    updateState(planner) {
        if (this.capturedGhost != -1) {
            let distance = equlidianFromMobile(this, planner.basePositionX, planner.basePositionY)
            if (distance <= RELEASE_DISTANCE) {
                this.state = STATE_RELEASE;
            }
            else {
                this.state = STATE_RETREAT;
            }
        }
        else {
            let keys = Array.from(planner.ghosts.keys());
            if (keys.length > 0) {
                this.state = STATE_CAPTURE;
            }
            else {
                this.state = STATE_SEAK;
            }
        }
    }


    //print('MOVE 8000 4500'); // MOVE x y | BUST id | RELEASE
    performAction(planner) {
        let action = '';

        switch (this.state) {
            case STATE_RELEASE:
                action = 'RELEASE';
                break;
            case STATE_RETREAT:
                action = 'MOVE ' + planner.basePositionX + ' ' + planner.basePositionY;
                break;
            case STATE_CAPTURE:
                let closestGhostDistance = 9999999;
                let values = Array.from(planner.ghosts.values());

                for (let i = 0; i < values.length; i++) {
                    let ghost = values[i];

                    let distance = equlidianDistanceBetweenMobiles(this, ghost);
                    if (distance > this.minShootingRange && distance < this.maxShootingRange) {
                        this.currentTargetMobile = ghost;
                        action = 'BUST ' + ghost.ID;
                        break;
                    }

                    if (closestGhostDistance > distance) {
                        closestGhostDistance = distance;
                        this.currentTargetMobile = ghost;
                    }
                }

                if (action === '') {
                    if (closestGhostDistance > this.maxShootingRange) {
                        action = 'MOVE ' + this.currentTargetMobile.currentX + ' ' + this.currentTargetMobile.currentY;
                    }
                    else {
                        let moves = this.team === 0 ? MOVE_DIRECTION_FIRST_TEAM : MOVE_DIRECTION_SECOND_TEAM;

                        for (let i = 0; i < moves.length; i++) {
                            let move = pickNextMoveCoordinatesForMobile(this, moves[i]);
                            if (validateMove(move)) {
                                action = 'MOVE ' + move.x + ' ' + move.y;
                                break;
                            }
                        }
                    }
                }
                break;
            case STATE_SEAK:
                let moves = this.team === 0 ? MOVE_DIRECTION_FIRST_TEAM : MOVE_DIRECTION_SECOND_TEAM;

                for (let i = 0; i < moves.length; i++) {
                    let move = pickNextMoveCoordinatesForMobile(this, moves[i]);
                    if (validateMove(move)) {
                        action = 'MOVE ' + move.x + ' ' + move.y;
                        break;
                    }
                }

                break;
            case STATE_SPAWNED:
                printErr('## ERROR: id=' + this.id + ' STATE IS STILL SPAWNED');
                break;
        }

        return action;
    }
}

class Ghost extends Mobile {
    constructor(x, y, id) {
        super(x, y, id);
        this.speed = 400;
        this.isCaptured = false;
        this.isReleased = false;
    }
}

class Planner {
    constructor(teamId, ghostCount, bustersPerPlayer) {
        this.potentialGhostsCount = ghostCount;
        this.teamId = teamId;
        this.ghostCount = ghostCount;
        this.bustersCount = bustersPerPlayer;

        this.busters = new Map();
        this.ghosts = new Map();
        this.enemyBusters = new Map();

        if (teamId === 0) {
            this.basePositionX = 0;
            this.basePositionY = 0;
            this.enemyBasePositionX = 16000;
            this.enemyBasePositionY = 9000;
        } else {
            this.basePositionX = 16000;
            this.basePositionY = 9000;
            this.enemyBasePositionX = 0;
            this.enemyBasePositionY = 0;
        }
    }

    updateMobile(id, x, y, type, state, value) {
        switch (type) {
            case this.teamId:
                if (!this.busters.has(id)) {
                    let buster = new Buster(x, y, id, type);
                    this.busters.set(id, buster);
                }
                else {
                    let buster = this.busters.get(id);
                    buster.currentX = x;
                    buster.currentY = y;
                    buster.capturedGhost = value;
                }
                break;
            case TYPE_GHOST:
                let ghost;
                if (!this.ghosts.has(id)) {
                    let ghost = new Ghost(x, y, id);
                    this.ghosts.set(id, ghost);
                }
                else {
                    if (state === -1) {
                        this.ghosts.delete(id);
                    }
                    else {
                        let ghost = this.ghosts.get(id);
                        ghost.currentX = x;
                        ghost.currentY = y;
                    }
                }
                break;
            default:
                if (!this.enemyBusters.has(id)) {
                    let buster = new Buster(x, y, id, type);
                    this.enemyBusters.set(id, buster);
                }
                else {
                    let buster = this.enemyBusters.get(id);
                    buster.currentX = x;
                    buster.currentY = y;
                    buster.capturedGhost = value;
                }
                break;
        }
    }

    planAndExecuteAction(id) {
        let buster = this.busters.get(id);
        buster.updateState(this);
        let action = buster.performAction(this);
        return action;
    }
}

var bustersPerPlayer = parseInt(readline()); // the amount of busters you control
var ghostCount = parseInt(readline()); // the amount of ghosts on the map
var myTeamId = parseInt(readline()); // if this is 0, your base is on the top left of the map, if it is one, on the bottom right

let planner = new Planner(myTeamId, ghostCount, bustersPerPlayer);

// game loop
while (true) {
    var entities = parseInt(readline()); // the number of busters and ghosts visible to you
    for (var i = 0; i < entities; i++) {
        var inputs = readline().split(' ');
        var entityId = parseInt(inputs[0]); // buster id or ghost id
        var x = parseInt(inputs[1]);
        var y = parseInt(inputs[2]); // position of this buster / ghost
        var entityType = parseInt(inputs[3]); // the team id if it is a buster, -1 if it is a ghost.
        var state = parseInt(inputs[4]); // For busters: 0=idle, 1=carrying a ghost.
        var value = parseInt(inputs[5]); // For busters: Ghost id being carried. For ghosts: number of busters attempting to trap this ghost.
        printErr('Entity id=' + entityId + ' x=' + x + ' y' + ' type=' + entityType + ' state=' + state + ' value');
        planner.updateMobile(entityId, x, y, entityType, state, value);
    }

    for (var i = 0; i < bustersPerPlayer; i++) {
        printErr('## buster: ' + i);
        let result = planner.planAndExecuteAction(i);
        printErr('## action: ' + result);
        print(result);
        printErr('***********');
    }
}