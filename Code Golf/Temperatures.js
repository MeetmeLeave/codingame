var n = parseInt(readline());

if (n > 0) {
    var t = readline();
    var a = t.split(' ');
    var r = a[0];
    var b = Math.abs(r);

    for (var i = 1; i < n; i++) {
        var g = a[i];
        var c = Math.abs(g);
        
        if (c < b) {
            r = g;
            b = c;
        }
        else if (c === b) {
            if (g > r) {
                r = g;
                b = c;    
            }
        }
    }

    print(r);
}
else {
    print(0);
}