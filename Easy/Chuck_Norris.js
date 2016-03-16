/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var MESSAGE = readline();

// result string
var output = '';

// stores previous char of the message
// will be used to identify that we need another space added
var prevChar = '';

printErr(MESSAGE);

for (var i = 0; i < MESSAGE.length; i++) {
    // Get ASCI code and make it binary
    var val = (MESSAGE.charCodeAt(i)).toString(2);
    
    // stupid js eats zeros at the beginning, to patching those back, until its 7 bits again
    while (val.length < 7) {
        val = '0' + val;
    }

    // convert binary to unary using task pattern
    for (var j = 0; j < val.length; j++) {
        var currentChar = val.charAt(j);
        
        if (prevChar === '' || prevChar !== currentChar) {
            // do not add blank spaces if this beginning of the output string, but add it if this another character
            if (output.length > 0) {
                output += ' ';
            }
            
            // replace 0 with 00
            if (currentChar === '0') {
                output += '00 0';
                prevChar = '0';

            }
            
            // replace 1 with 0 
            else {
                output += '0 0';
                prevChar = '1';
            }
        }
        // continue adding zeros if binary number is the same as previous eg. 00 or 11
        else {
            output += '0';
        }
    }
}

print(output);