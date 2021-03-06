// UMNE TALMAR RAHTAINE NIXENEN UMIR
// UMNE TALMAR RAHTAINE NIXENEN UBQR

'use strict';
const alphabetSize = 26;
let currentIndex = 0;
let previousIndex = 0;
let circles = 0;

let alphabet = new Map();
alphabet.set(' ', 0);
alphabet.set('A', 1);
alphabet.set('B', 2);
alphabet.set('C', 3);
alphabet.set('D', 4);
alphabet.set('E', 5);
alphabet.set('F', 6);
alphabet.set('G', 7);
alphabet.set('H', 8);
alphabet.set('I', 9);
alphabet.set('J', 10);
alphabet.set('K', 11);
alphabet.set('L', 12);
alphabet.set('M', 13);
alphabet.set('N', 14);
alphabet.set('O', 15);
alphabet.set('P', 16);
alphabet.set('Q', 17);
alphabet.set('R', 18);
alphabet.set('S', 19);
alphabet.set('T', 20);
alphabet.set('U', 21);
alphabet.set('V', 22);
alphabet.set('W', 23);
alphabet.set('X', 24);
alphabet.set('Y', 25);
alphabet.set('Z', 26);

var magicPhrase = readline();

let result = '';

for (let i = 0; i < magicPhrase.length; i++) {
    let index = alphabet.get(magicPhrase[i]);

    if (i > 29) {
        circles = Math.round(i / 29);
        let indexVal = i - (29 * circles);
        printErr('indexVal:' + indexVal);
        let nextIndex = magicPhrase[indexVal];
        printErr('nextIndex:' + nextIndex);
        currentIndex = alphabet.get(nextIndex);
    }

    printErr('circles:' + circles);
    printErr('currentIndex:' + currentIndex);
    printErr('i:' + i);
    printErr('previousIndex:' + previousIndex);
    printErr('index:' + index);
    printErr('###############');
    if (index === previousIndex) {
        result += '.';
    } else {
        result += '>';
        let plus = Math.abs(currentIndex - index); //todo
        let minus = Math.abs(index - currentIndex); //todo
        let sign = plus > minus ? '-' : '+';

        if (sign === '-') {
            for (let i = 0; i < minus; i++) {
                result += '-';
            }
        } else {
            for (let i = 0; i < plus; i++) {
                result += '+';
            }
        }

        result += '.';
    }

    previousIndex = index;
}

print(result);

// Write an action using print()
// To debug: printErr('Debug messages...');

// print('+.>-.');