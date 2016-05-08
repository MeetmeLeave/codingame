'use strict';

// game loop
while (true) {
    var selectedColumn = '-1';
    var currentColor = 'NaN';
    var filledBlocks = [];
    var next8Colors = [];
    var heights = [0,0,0,0,0,0];
    var smallestHeight = 0;
    var emptyLine = '......';
    var emptyLineArray = ['.','.','.','.','.','.'];

    // get data for upcoming blocks
    for (let i = 0; i < 8; i++) {
        let inputs = readline().split(' ');
        let colorA = parseInt(inputs[0]); // color of the first block
        let colorB = parseInt(inputs[1]); // color of the attached block
        if(currentColor == 'NaN'){
            currentColor = ''+colorA;
        }
        
        next8Colors.push(colorA);
    }

    // get heights colors
    for (let i = 0; i < 12; i++) {
        let row = readline();
        
        if(row != emptyLine){
            let line = [];
            for (let j = 0; j < row.length; j++){
                line.push(row[j]);

                if(row[j] != '.' && heights[j] == 0 || i == 11 && heights[j] == 0){
                    heights[j] = 11 - i;
                    if(heights[smallestHeight] > heights[j]){
                        smallestHeight = j;
                    }
                }
            }
            filledBlocks.push(line);
        }
    }

    if(filledBlocks.length == 0){
        filledBlocks.push(emptyLineArray);
    }

    strategyOne();

    // opponent values
    for (let i = 0; i < 12; i++) {
        let row = readline(); // One line of the map ('.' = empty, '0' = skull block, '1' to '5' = colored block)
    }

    print(selectedColumn); // "x": the column in which to drop your blocks
}

function strategyOne(){
    // find corresponding color from heights
    for(let i=0; i<filledBlocks.length; i++){
        let currentArr = filledBlocks[i];
        for(let j=0; j<currentArr.length; j++){

            // TODO update this part to search for combinations on sides and heights
            if(currentColor == currentArr[j] && heights[j] <= 9){
                selectedColumn = ''+j;
                break;
            }
        }
    }
    
    // if nothing was found pick first line
    if(selectedColumn == '-1'){
        selectedColumn = smallestHeight;
    }
}