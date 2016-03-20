/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

/* 
    I think this is like a packman game, n ghosts and the player.
    From the analysis of the game, I found it is ending when any of the other mobiles is reaching same coordinates as player
    There is idea that enemies can walk through the walls and they aren't hunting player directly at least in most of the simulations
    Our goal is to awaid them as long as possible
*/

var firstInitInput = parseInt(readline()); // y size of the map or possible way out
var secondInitInput = parseInt(readline()); // x size of the map or possible way out
var thirdInitInput = parseInt(readline()); // count of mobiles (usually 5), last will be the player mobile

const assumedMaxMapSize = 30;

printErr('first: ' + firstInitInput);
printErr('second: ' + secondInitInput);

var emptyChar = '⚐';

var gameState = {
    map: build2dArray(assumedMaxMapSize, assumedMaxMapSize),
    gameModels: [],

    updateUnitState: function(index, x, y) {
        this.gameModels[i].updateState(this.map, x, y);
    },

    initializePlayer: function() {
        this.player = this.gameModels[this.gameModels.length - 1];

        this.player.getDirectionToTheFirstInputCoordinates = function() {
            var result = '';

            if (this.currentY > firstInitInput) {
                result += 'S';
            }
            else if (this.currentY < firstInitInput) {
                result += 'N';
            }

            if (this.currentX > secondInitInput) {
                result += 'W';
            }
            else if (this.currentX < secondInitInput) {
                result += 'E';
            }

            return result;
        };

        this.player.getMoveDirection = function() {
            var direction = this.getDirectionToTheFirstInputCoordinates();
            printErr(direction);
            printErr(this.currentX);
            printErr(this.currentY);
            switch (direction) {
                case 'S':
                    if (this.southTile === '_') {
                        return 'D';
                    }
                    break;
                case 'SW':
                    if (this.southTile === '_') {
                        return 'D';
                    }
                    else if (this.westTile === '_') {
                        return 'E';
                    }
                    break;
                case 'SE':
                    if (this.southTile === '_') {
                        return 'D';
                    }
                    else if (this.eastTile === '_') {
                        return 'A';
                    }
                    break;
                case 'N':
                    if (this.northTile === '_') {
                        return 'C';
                    }
                    break;
                case 'NW':
                    if (this.northTile === '_') {
                        return 'C';
                    }
                    else if (this.westTile === '_') {
                        return 'E';
                    }
                    break;
                case 'NE':
                    if (this.northTile === '_') {
                        return 'C';
                    }
                    else if (this.eastTile === '_') {
                        return 'A';
                    }
                    break;
                case 'W':
                    if (this.westTile === '_') {
                        return 'E';
                    }
                    break;
                case 'E':
                    if (this.eastTile === '_') {
                        return 'A';
                    }
                    break;

            }

            return 'B';
        };

        this.player.move = function() {
            /* 
                    C
                  E B A
                    D
                    
                C - go top
                E - go left
                B - wait
                A - go right
                D - go bottom
            */
            var move = this.getMoveDirection();
            printErr(move);
            return move;
        };
    },

    drawMap: function() {
        var mapCanvas = [];

        for (var k = 0; k < assumedMaxMapSize; k++) {
            mapCanvas.push([]);
        }

        for (var i = 0; i < this.map.length; i++) {
            for (var j = 0; j < this.map[i].length; j++) {
                mapCanvas[j][i] = this.map[i][j];
            }
        }

        for (var m = 0; m < this.gameModels.length; m++) {
            this.gameModels[m].drawModel(mapCanvas);
        }

        for (var p = 1; p < mapCanvas.length; p++) {
            mapCanvas[p].shift(0);
            printErr(mapCanvas[p]);
        }
    },

    buildModel: function(index, x, y, isPlayer) {
        var model = {
            index: index,
            isPlayer: isPlayer,
            previousX: x,
            previousY: y,
            currentX: x,
            currentY: y,
            northTile: '',
            southTile: '',
            eastTile: '',
            westTile:
            '',

            drawModel: function(mapCanvas) {
                switch (this.index) {
                    case 0:
                        mapCanvas[this.currentY][this.currentX] = '♣';
                        break;
                    case 1:
                        mapCanvas[this.currentY][this.currentX] = '♥';
                        break;
                    case 2:
                        mapCanvas[this.currentY][this.currentX] = '♦';
                        break;
                    case 3:
                        mapCanvas[this.currentY][this.currentX] = '♠';
                        break;
                    case 4:
                        mapCanvas[this.currentY][this.currentX] = '⛹'; // player
                        break;
                    default:
                        mapCanvas[this.currentY][this.currentX] = '♜';
                        break;
                }
            },

            updateState: function(map, x, y) {
                this.previousX = this.currentX;
                this.previousY = this.currentY;
                this.currentX = x;
                this.currentY = y;

                if (isPlayer) {
                    this.northTile = firstInput;
                    this.southTile = thirdInput;
                    this.eastTile = secondInput;
                    this.westTile = fourthInput;

                    var top = map[x][y + 1];
                    var left = map[x - 1][y];
                    var bottom = map[x][y - 1];
                    var right = map[x + 1][y];
                    if (top === emptyChar) {
                        map[x][y - 1] = firstInput;
                    }
                    if (left === emptyChar) {
                        map[x - 1][y] = fourthInput;
                    }
                    if (bottom === emptyChar) {
                        map[x][y + 1] = thirdInput;
                    }
                    if (right === emptyChar) {
                        map[x + 1][y] = secondInput;
                    }
                }
            }
        };

        this.gameModels.push(model);
    }
};

// game loop
while (true) {
    var firstInput = readline(); // north tile you can see (# - wall, _ - empty space)
    var secondInput = readline(); // east tile you can see (# - wall, _ - empty space)
    var thirdInput = readline(); // south tile you can see (# - wall, _ - empty space)
    var fourthInput = readline(); // west tile you can see (# - wall, _ - empty space)

    printErr('firstInput: ' + firstInput);
    printErr('secondInput: ' + secondInput);
    printErr('thirdInput: ' + thirdInput);
    printErr('fourthInput: ' + fourthInput);

    for (var i = 0; i < thirdInitInput; i++) {
        var inputs = readline().split(' '); // current coordinates for each mobile on the map, last will be player
        if (gameState.gameModels.length < thirdInitInput) {
            var isplayer = i + 1 == thirdInitInput ? true : false;
            gameState.buildModel(i, parseInt(inputs[0]), parseInt(inputs[1]), isplayer);

            if (isplayer) {
                gameState.initializePlayer();
            }
        }
        else {
            gameState.updateUnitState(i, parseInt(inputs[0]), parseInt(inputs[1]));
        }
    }

    gameState.drawMap();

    print(gameState.player.move());
}

function build2dArray(width, height) {
    var result = [];

    for (var i = 0; i < height; i++) {
        var line = [];

        for (var j = 0; j < width; j++) {
            line[j] = emptyChar;
        }

        result.push(line);
    }

    return result;
}