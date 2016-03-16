/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var road = parseInt(readline()); // the length of the road before the gap.
var gap = parseInt(readline()); // the length of the gap.
var platform = parseInt(readline()); // the length of the landing platform.

var amountOfTilesBeforeJump; //  
var slowdown = false; // flags that motob jumped and we need to slowdown
const requiredSpeed = gap + 1; // minimal speed required to pass the chasm

// game loop
while (true) {
    var speed = parseInt(readline()); // the motorbike's speed.
    var coordX = parseInt(readline()); // the position on the road of the motorbike.
    amountOfTilesBeforeJump = road - coordX;

    // Write an action using print()
    // To debug: printErr('Debug messages...');
    
    var action = 'WAIT';// A single line containing one of 4 keywords: SPEED, SLOW, JUMP, WAIT.
    
    // if we already jumped, jsut stop to not fall off the bridge
    if(slowdown){
        action = 'SLOW';
    }
    else{
        // until we have required speed to pass the chasm, just speed up 
        if(speed < requiredSpeed){
            action = 'SPEED';
        }
        // if our starting speed is more then required, slowdown to not fall off after the jump
        else if (speed > requiredSpeed){
            action = 'SLOW';
        }
        // if we already can pass the chasm - JUMP
        else if(amountOfTilesBeforeJump <= speed){
            action = 'JUMP';
            slowdown = true;
        }
    }
    
    print(action);
}