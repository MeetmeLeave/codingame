/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var N = parseInt(readline());
var Q = parseInt(readline());

var mymeTypes = new Map();

for (var i = 0; i < N; i++) {
    var inputs = readline().split(' ');
    var EXT = inputs[0];
    var MT = inputs[1];

    mymeTypes.set(EXT.toLowerCase(), MT);
}

for (var i = 0; i < Q; i++) {
    var FNAME = readline();
    var res = FNAME.split('.');

    if (res.length > 1) {
        var extension = res[res.length - 1].toLowerCase();
        if (mymeTypes.has(extension)) {
            print(mymeTypes.get(extension));
        }
        else {
            print('UNKNOWN');
        }
    }
    else {
        print('UNKNOWN');
    }
}