/**
 * Send your busters out into the fog to trap ghosts and bring them home!
 **/

var bustersPerPlayer = parseInt(readline()); // the amount of busters you control
var ghostCount = parseInt(readline()); // the amount of ghosts on the map
var myTeamId = parseInt(readline()); // if this is 0, your base is on the top left of the map, if it is one, on the bottom right

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