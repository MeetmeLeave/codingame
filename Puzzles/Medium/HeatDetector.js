var inputs = readline().split(' ');
var W = parseInt(inputs[0]); // width of the building.
var H = parseInt(inputs[1]); // height of the building.
var N = parseInt(readline()); // maximum number of turns before game over.
var inputs = readline().split(' ');
var X0 = parseInt(inputs[0]);
var Y0 = parseInt(inputs[1]);

var computedX = 0;
var computedY = 0;
var computedWidthEdge = W - 1;
var computedHeightEdge = H - 1;
var coefficient = 1;
var dividerCoeffiecent = 2;

var previousDirection = 'NULL';
var sameDirectionCounter = 0;

// game loop
while (true) {    
    var bombDir = readline(); // the direction of the bombs from batman's current location (U, UR, R, DR, D, DL, L or UL)
    
    if(previousDirection == bombDir){
        sameDirectionCounter +=1;
        if(sameDirectionCounter >=3){
            dividerCoeffiecent = 1.5;
        }
    }
    else{
        dividerCoeffiecent = 2;
    }
    
    previousDirection = bombDir;
    print(determineCoordinatesToJump(bombDir));
}

function determineCoordinatesToJump(bombDir){
    let currentX0 = X0;
    let currentY0 = Y0;
    
    switch(bombDir){
        case 'U':
            computedX = X0;
            computedWidthEdge = X0;
            computedHeightEdge = Y0;
            Y0 = computedHeightEdge - parseInt(Math.abs((computedHeightEdge - computedY)/dividerCoeffiecent));
            
            if(currentY0 == Y0){
                Y0 -= coefficient;
            }
            
        break;
        case 'UR':
            computedX = X0;
            computedHeightEdge = Y0;
            Y0 = computedHeightEdge - parseInt(Math.abs((computedHeightEdge - computedY)/dividerCoeffiecent));
            X0 = X0 + parseInt(Math.abs((computedWidthEdge - computedX)/dividerCoeffiecent));
            
            if(currentX0 == X0){
                X0 += coefficient;
            }
            
            if(currentY0 == Y0){
                Y0 -= coefficient;
            }
            
        break;
        case 'R':
            computedY = Y0;
            computedHeightEdge = Y0;
            X0 = X0 + parseInt(Math.abs((computedWidthEdge - computedX)/dividerCoeffiecent));
            
            
            if(currentX0 == X0){
                X0 += coefficient;
            }
            
        break;
        case 'DR':
            computedY = Y0;
            computedX = X0;
            Y0 = Y0 + parseInt(Math.abs((computedHeightEdge - computedY)/dividerCoeffiecent));
            X0 = X0 + parseInt(Math.abs((computedWidthEdge - computedX)/dividerCoeffiecent));
            
        
            if(currentX0 == X0){
                X0 += coefficient;
            }
            
            if(currentY0 == Y0){
                Y0 += coefficient;
            }
        break;
        case 'D':
            computedX = X0;
            computedY = Y0;
            computedWidthEdge = X0;
            Y0 = Y0 + parseInt(Math.abs((computedHeightEdge - computedY)/dividerCoeffiecent));
            if(currentY0 == Y0){
                Y0 += coefficient;
            }
        break;
        case 'DL':
            computedY = Y0;
            computedWidthEdge = X0;
            Y0 = Y0 + parseInt(Math.abs((computedHeightEdge - computedY)/dividerCoeffiecent));
            X0 = computedWidthEdge - parseInt(Math.abs((computedWidthEdge - computedX)/dividerCoeffiecent));
            Y0 = Y0 > computedHeightEdge? computedWidthEdge : Y0;
            
            if(currentX0 == X0){
                X0 -= coefficient;
            }
            
            if(currentY0 == Y0){
                Y0 += coefficient;
            }
        break;
        case 'L':
            computedY = Y0;
            computedHeightEdge = Y0;
            computedWidthEdge = X0;
            X0 = computedWidthEdge - parseInt(Math.abs((computedWidthEdge - computedX)/dividerCoeffiecent));
            
            if(currentX0 == X0){
                X0 -= coefficient;
            }
        break;
        case 'UL':
            computedWidthEdge = X0;
            computedHeightEdge = Y0;
            Y0 = computedHeightEdge - parseInt(Math.abs((computedHeightEdge - computedY)/dividerCoeffiecent));
            X0 = computedWidthEdge - parseInt(Math.abs((computedWidthEdge - computedX)/dividerCoeffiecent));
            
            if(currentX0 == X0){
                X0 -= coefficient;
            }
            
            if(currentY0 == Y0){
                Y0 -= coefficient;
            }
        break;
    }
    return '' + X0 + ' ' + Y0;
}