/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 * ---
 * Hint: You can use the debug stream to print initialTX and initialTY, if Thor seems not follow your orders.
 **/

var inputs = readline().split(' ');
var lightX = parseInt(inputs[0]); // the X position of the light of power
var lightY = parseInt(inputs[1]); // the Y position of the light of power
var initialTX = parseInt(inputs[2]); // Thor's starting X position
var initialTY = parseInt(inputs[3]); // Thor's starting Y position

var currentX = initialTX; // current x position of Thor
var currentY = initialTY; // current y position of Thor

// game loop
while (true) {
    var remainingTurns = parseInt(readline()); // The remaining amount of turns Thor can move. Do not remove this line.

    var movePoint = '';
    
    // Set the next heigh value for Thor to move, based on the Y coordinates difference
    if(currentY > lightY){
        movePoint += 'N';
        currentY -= 1;
    }
    else if(currentY < lightY){
        movePoint += 'S';
        currentY += 1;
    }
    
    // Set the next width value for Thor to move, based on the X coordinates difference
    if(currentX > lightX){
        movePoint += 'W';
        currentX -= 1;
    }
    else if (currentX < lightX){
        movePoint += 'E';
        currentX += 1;
    }
    
    printErr(currentX);
    printErr(currentY);
    
    // Write an action using print()
    // To debug: printErr('Debug messages...');

    print(movePoint); // A single line providing the move to be made: N NE E SE S SW W or NW
}