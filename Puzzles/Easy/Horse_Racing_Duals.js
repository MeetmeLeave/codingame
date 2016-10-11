var horses = [];

function bottomUpMerge(
    array, leftPosition, chunkSize, workArray, compare) {
    var i;
    var rightPosition = leftPosition + chunkSize;
    var endPosition = Math.min(leftPosition + chunkSize * 2 - 1,
        array.length - 1);
    var leftIndex = leftPosition;
    var rightIndex = rightPosition;

    for (i = 0; i <= endPosition - leftPosition; i++) {
        if (leftIndex < rightPosition &&
            (rightIndex > endPosition ||
                compare(array[leftIndex], array[rightIndex]) <= 0)) {
            workArray[i] = array[leftIndex++];
        } else {
            workArray[i] = array[rightIndex++];
        }
    }

    for (i = leftPosition; i <= endPosition; i++) {
        array[i] = workArray[i - leftPosition];
    }
}

function sort(array, compare) {
    var workArray = new Array(array.length);
    var chunkSize = 1;
    while (chunkSize < array.length) {
        var i = 0;
        while (i < array.length - chunkSize) {
            bottomUpMerge(array, i, chunkSize, workArray, compare);
            i += chunkSize * 2;
        }
        chunkSize *= 2;
    }
    return array;
}

var swap = function(array, a, b) {
    var temp = array[a];
    array[a] = array[b];
    array[b] = temp;
};

var compare = function(a, b) {
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }
    return 0;
};

var N = parseInt(readline());
for (var i = 0; i < N; i++) {
    var pi = parseInt(readline());
    horses.push(pi);
    printErr('pi: ' + pi);
}

sort(horses, compare, swap);

var previous = 0;
var closest = 10000;

for (var i = 0; i < horses.length; i++) {
    var pi = horses[i];
    printErr(pi);
    if (i >= 1) {
        let newClosest = Math.abs(pi - previous);
        if (newClosest < closest) {
            closest = newClosest;
        }
    }

    previous = pi;
}

print(closest);