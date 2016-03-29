/**
 * Solve this puzzle by writing the shortest code.
 * Whitespaces (spaces, new lines, tabs...) are counted in the total amount of chars.
 * These comments should be burnt after reading!
 **/

var inputs = readline().split(' ');
var LX = parseInt(inputs[0]); // the X position of the light of power
var LY = parseInt(inputs[1]); // the Y position of the light of power
var TX = parseInt(inputs[2]); // Thor's starting X position
var TY = parseInt(inputs[3]); // Thor's starting Y position

var currentX = TX; // current x position of Thor
var currentY = TY; // current y position of Thor

// game loop
while (true) {
    var remainingTurns = parseInt(readline()); // The remaining amount of turns Thor can move. Do not remove this line.

    var movePoint = '';
    
    // Set the next heigh value for Thor to move, based on the Y coordinates difference
    if(currentY > LY){
        movePoint += 'N';
        currentY -= 1;
    }
    else if(currentY < LY){
        movePoint += 'S';
        currentY += 1;
    }
    
    // Set the next width value for Thor to move, based on the X coordinates difference
    if(currentX > LX){
        movePoint += 'W';
        currentX -= 1;
    }
    else if (currentX < LX){
        movePoint += 'E';
        currentX += 1;
    }
    
    printErr(currentX);
    printErr(currentY);
    
    // Write an action using print()
    // To debug: printErr('Debug messages...');

    print(movePoint); // A single line providing the move to be made: N NE E SE S SW W or NW
}