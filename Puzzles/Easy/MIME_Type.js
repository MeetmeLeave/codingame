/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var N = parseInt(readline());
var Q = parseInt(readline());

var mimeTypes = new Map();

// get association between MIME types and extensions
for (var i = 0; i < N; i++) {
    var inputs = readline().split(' ');
    var EXT = inputs[0];
    var MT = inputs[1];

    mimeTypes.set(EXT.toLowerCase(), MT);
}

// display correct results for each extension passed
for (var i = 0; i < Q; i++) {
    var FNAME = readline();
    var res = FNAME.split('.');

    // this checks that there is at least string for name of the file and name for extension after dot
    // this check covers following items : 1) a 2) .pdf - both should be UNKNOWN
    if (res.length > 1) {
        var extension = res[res.length - 1].toLowerCase();
        
        //
        if (mimeTypes.has(extension)) {
            print(mimeTypes.get(extension));
        }
        else {
            print('UNKNOWN');
        }
    }
    else {
        print('UNKNOWN');
    }
}