'use strict';

const STATE_SPAWNED = 'SPAWNED';
const STATE_RETREAT = 'RETREAT';
const STATE_SEAK = 'SEAK';
const STATE_RELEASE = 'RELEASE';
const STATE_CAPTURE = 'CAPTURE';

class Mobile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.id = undefined;
    }

    get currentX() {
        return this.x;
    }

    set currentX(value) {
        this.x = value;
    }

    get ID() {
        return this.id;
    }

    set ID(value) {
        if (this.id === undefined) {
            this.id = value;
        }
    }
}

class Buster extends Mobile {
    constructor(x, y, teamId) {
        super(x, y);
        this.team = teamId;
        this.state = STATE_SPAWNED;
        this.losRange = 2200;
        this.speed = 800;
        this.hasGhost = false;
        this.currentTargetMobile = undefined;
    }
}

class Ghost extends Mobile {
    constructor(x, y) {
        super(x, y);
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

    }
}

var bustersPerPlayer = parseInt(readline()); // the amount of busters you control
var ghostCount = parseInt(readline()); // the amount of ghosts on the map
var myTeamId = parseInt(readline()); // if this is 0, your base is on the top left of the map, if it is one, on the bottom right

let planner = new Planner();

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
    }

    for (var i = 0; i < bustersPerPlayer; i++) {

        // Write an action using print()
        // To debug: printErr('Debug messages...');

        print('MOVE 8000 4500'); // MOVE x y | BUST id | RELEASE
    }
}