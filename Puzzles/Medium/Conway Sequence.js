'use strict';

function buildLookAndSaySequence(start, size) {
    let sequence = [];
    sequence.push('' + start);
    for (let i = 1; i <= size; i++) {
        let current = sequence[i - 1].split(' ');
        let next = '';

        let count = 1;
        let prevSymbol = current[0];
        for (let j = 1; j < current.length; j++) {
            let currentSymbol = current[j];
            if(prevSymbol === currentSymbol){
                count +=1;
            }
            else{
                next += count + ' ' + prevSymbol + ' ';
                count = 1;
                prevSymbol = currentSymbol;
            }
        }

        next += count + ' ' + prevSymbol;
        printErr(next);
        sequence.push(next);
    }

    return sequence[size - 1];
}


let R = parseInt(readline());
let L = parseInt(readline());

print(buildLookAndSaySequence(R, L));