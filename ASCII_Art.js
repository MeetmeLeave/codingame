/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
'use strict';

var L = parseInt(readline());
var H = parseInt(readline());
var T = readline();
const symbolsArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '?'];
const symbolsCount = symbolsArray.length;

var symbolsMap = new Map();

// Parse strings to create association between the character and array of # strings
for (var i = 0; i < H; i++) {
    var ROW = readline();
    var parsingPoint = 0;

    for (var j = 0; j < symbolsCount; j++) {
        var key = symbolsArray[j];
        var val;

        if (!symbolsMap.has(key)) {
            val = [];
            symbolsMap.set(key, val);
        }
        else {
            val = symbolsMap.get(key);
        }

        var nextParsingPoint = parsingPoint + L;
        val.push(ROW.substring(parsingPoint, nextParsingPoint));

        parsingPoint = nextParsingPoint;
    }
}

// Build output by parsing string which we want to display
for (var j = 0; j < H; j++) {
    var output = '';

    for (var i = 0; i < T.length; i++) {
        var char = T.charAt(i).toUpperCase();

        if (symbolsMap.has(char)) {

            output += symbolsMap.get(char)[j];
        }
        else {
            output += symbolsMap.get('?')[j];
        }
    }

    print(output);
}