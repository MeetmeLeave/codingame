/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/


// game loop
while (true) {
    for (var i = 0; i < 8; i++) { // upcoming pairs
        var inputs = readline().split(' ');
        var colorA = parseInt(inputs[0]); // color of the first block
        var colorB = parseInt(inputs[1]); // color of the attached block
        printErr(inputs);    
    }
    printErr('-----------');
    for (var i = 0; i < 12; i++) { // my field - starts from top
        var row = readline();
        printErr(i);
        printErr(row);
    }
    printErr('-----------');
    for (var i = 0; i < 12; i++) { // opponent field - starts from top
        var row = readline(); // One line of the map ('.' = empty, '0' = skull block, '1' to '5' = colored block)
        printErr(i);
        printErr(row);
    }

    // Write an action using print()
    // To debug: printErr('Debug messages...');

    print('0'); // "x": the column in which to drop your blocks
}