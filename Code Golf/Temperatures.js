/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var n = parseInt(readline()); // the number of temperatures to analyse

// if there are no numbers return 0
// if values are present, parse them out of the string and find value closest to zero
if (n > 0) {
    var temps = readline(); // the n temperatures expressed as integers ranging from -273 to 5526
    var tempArray = temps.split(' ');
    var result = tempArray[0];
    var resultAbs = Math.abs(result);

    for (var i = 1; i < n; i++) {
        // get next temperature value and its abs
        var currentValue = tempArray[i];
        var currentAbs = Math.abs(currentValue);
        
        // set new closest value if its abs is closer to zero  
        if (currentAbs < resultAbs) {
            result = currentValue;
            resultAbs = currentAbs;
        }
        // set new closest value if it is positive variant of the same number
        else if (currentAbs === resultAbs) {
            if (currentValue > result) {
                result = currentValue;
                resultAbs = currentAbs;    
            }
        }
    }

    // Write an action using print()
    // To debug: printErr('Debug messages...');

    print(result);
}
else {
    print(0);
}