let surface = [];
let bodies = new Map();
let coordinates = [];
let seen = new Map();

function BodyOfWater() {
    this.size = 0;
}

function flood(cell, bdy) {
    let y = parseInt(cell.split(' ')[0]);
    let x = parseInt(cell.split(' ')[1]);

    let body;
    if (bdy != undefined) {
        body = bdy;
    } else if (seen.has(cell)) {
        body = seen.get(cell);
        // printErr('cell: ' + cell + ' bodySize: ' + body.size);
    } else {
        body = new BodyOfWater();
    }

    if (surface[x][y] === '#' || seen.has(cell)) {
        return body.size;
    } else {
        // printErr('cell: ' + cell);
        seen.set(cell, body);
        body.size += 1;
        let x2 = x + 1;
        let x3 = x - 1;
        let y2 = y + 1;
        let y3 = y - 1;

        if (x2 < H) {
            flood(y + ' ' + x2, body);
        }
        if (x3 >= 0) {
            flood(y + ' ' + x3, body);
        }
        if (y2 < L) {
            flood(y2 + ' ' + x, body);
        }
        if (y3 >= 0) {
            flood(y3 + ' ' + x, body);
        }
        return body.size;
    }
}

let L = parseInt(readline());
let H = parseInt(readline());
for (let i = 0; i < H; i++) {
    let row = readline();
    printErr('row: ' + row);

    surface.push(row.split(''));
}

let N = parseInt(readline());
for (let i = 0; i < N; i++) {
    let inputs = readline();
    coordinates.push(inputs);
}

for (let i = 0; i < N; i++) {
    // printErr('coordinates: ' + coordinates[i] + '---');
    print(flood(coordinates[i], undefined));
}