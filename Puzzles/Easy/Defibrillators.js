/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var LON = parseFloat(readline().replace(',', '.'));
var LAT = parseFloat(readline().replace(',', '.'));
var N = parseInt(readline());

var closestResult = '';
const closestDistance = 99999999999999;

for (var i = 0; i < N; i++) {
    var DEFIB = readline();

    var parsedDefibData = DEFIB.split(';');
    
    // defib longtitude
    var longB = parseFloat(parsedDefibData[4].replace(',', '.'));
    // defib latitude
    var latB = parseFloat(parsedDefibData[5].replace(',', '.'));
    
    var x = (longB - LON) * Math.cos((LAT + latB) / 2);
    var y = latB - LAT;
    
    // distance between defib and a person
    var distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) * 6371;

    if (closestDistance > distance) {
        closestDistance = distance;
        closestResult = parsedDefibData[1];
    }
}

print(closestResult);