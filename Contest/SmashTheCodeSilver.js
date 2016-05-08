'use strict';

var turnsCounter = 0;

// game loop
while (true) {
    turnsCounter +=1;
    var selectedColumn = '-1';
    var selectedRotation = '-1';
    var currentColorA = 'NaN';
    var currentColorB = 'NaN';
    var filledBlocks = [];
    var next8Colors = [];
    var heights = [0,0,0,0,0,0];
    var smallestHeight = 3;
    var emptyLine = '......';
    var emptyLineArray = ['.','.','.','.','.','.'];

    gatherData();
    
    // if(turnsCounter < 20 || currentColorA == currentColorB){
        strategyThree();
    // }
    // else {
    //     strategyTwo();
    // }

    // opponent values
    for (let i = 0; i < 12; i++) {
        let row = readline(); // One line of the map ('.' = empty, '0' = skull block, '1' to '5' = colored block)
    }

    print(selectedColumn + ' ' + selectedRotation); // "x": the column in which to drop your blocks
}

function gatherData(){
    // get data for upcoming blocks
    for (let i = 0; i < 8; i++) {
        let inputs = readline().split(' ');
        let colorA = parseInt(inputs[0]); // color of the first block
        let colorB = parseInt(inputs[1]); // color of the attached block
        if(currentColorA == 'NaN'){
            currentColorA = ''+colorA;
        }
        
        if(currentColorB == 'NaN'){
            currentColorB = ''+colorB;
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
}

// function strategyOne(){
//     // TODO add another strategy for late game
//     // TODO possible thought for totally another strategy - play around upcoming blocks
//     // to build double chain for each score. This will be more aggresive play to try brakin opponents strategy
//     for(let i=0; i< heights.length; i++){
//         let currentHeight = heights[i];
//         let heightVal = filledBlocks.length - 1 - currentHeight;
//         let colorValue = filledBlocks[heightVal][i];

//         if(currentColorB == colorValue 
//             && currentHeight <= 10 ){
            
//             if(i == '5' && heights[5] <=10){
//                 selectedColumn = '4';
//                 selectedRotation = '0';
//             }
//             else if(heights[i+1] <=10){
//                 selectedColumn = ''+(i + 1);
//                 selectedRotation = '2';
//             }

//             break;
//         }
        
//         if(currentColorA == colorValue 
//             && currentHeight <= 10){

//             selectedColumn = ''+i;
            
//             if(i == '5' && heights[i-1] <=10){
//                 selectedRotation = '2';
//             }
//             else if(heights[i+1] <=10){
//                 selectedRotation = '0';
//             }

//             break;
//         }
//     }
    
//     // if nothing was found pick the smallest height
//     if(selectedColumn == '-1'){
//         selectedColumn = smallestHeight;
//     }

//     // if nothing was found pick the first position
//     if(selectedRotation == '-1'){
//         selectedRotation = '1';
//     }
    
// }

function strategyTwo(){
    // TODO add another strategy for late game
    // TODO possible thought for totally another strategy - play around upcoming blocks
    // to build double chain for each score. This will be more aggresive play to try brakin opponents strategy
    for(let i=1; i< heights.length; i++){
        let currentHeight = heights[i];
        let previousHeight;
        let nextHeight;
        let heightVal = filledBlocks.length - 1 - currentHeight;
        let colorValue = filledBlocks[heightVal][i];
        
        if(i < 5){
            nextHeight = heights[i + 1];
            previousHeight = heights[i-1];
            
            if(currentHeight > nextHeight) {
                let heightToCheck = nextHeight + 1;
                let colorOnTheCurrentHeight = filledBlocks[heightToCheck][i];
               
                if(i == 4){
                    if(currentColorA == colorOnTheCurrentHeight && heightToCheck <= 9){
                        selectedColumn = ''+(i + 1);
                        selectedRotation = '1';
                        break;
                    }
                    
                    if(currentColorB == colorOnTheCurrentHeight && heightToCheck <= 9){
                        selectedRotation = '3';
                        selectedColumn = '' + (i+1);
                        break;  
                    }
                }
                else{
                    if(currentColorA == colorOnTheCurrentHeight){
                        selectedColumn = ''+(i + 1);
                        
                        if(currentHeight > heights[i+2]){
                            selectedRotation = '0';
                        }
                        else {
                            selectedRotation = '2';
                        }

                        break;
                    }
                    
                    if(currentColorB == colorOnTheCurrentHeight){
                        if(currentHeight > heights[i+2]){
                            selectedRotation = '2';
                            selectedColumn = '' + (i+2);
                        }
                        else {
                            selectedRotation = '0';
                            selectedColumn = '' + i;
                        }
                        
                        break;
                    }
                }
            }
            else if(currentHeight > previousHeight) {
                let heightToCheck = previousHeight + 1;
                let colorOnTheCurrentHeight = filledBlocks[heightToCheck][i];
               
                if(i == 1){
                    if(currentColorA == colorOnTheCurrentHeight && heightToCheck <= 9){
                        selectedColumn = ''+(i - 1);
                        selectedRotation = '1';
                        break;
                    }
                    
                    if(currentColorB == colorOnTheCurrentHeight && heightToCheck <= 9){
                        selectedRotation = '3';
                        selectedColumn = '' + (i-1);
                        break;  
                    }
                }
                else{
                    if(currentColorA == colorOnTheCurrentHeight){
                        selectedColumn = ''+(i - 1);
                        
                        if(currentHeight > heights[i-2]){
                            selectedRotation = '0';
                        }
                        else {
                            selectedRotation = '2';
                        }

                        break;
                    }
                    
                    if(currentColorB == colorOnTheCurrentHeight){
                        if(currentHeight > heights[i-2]){
                            selectedRotation = '2';
                            selectedColumn = '' + (i-2);
                        }
                        else {
                            selectedRotation = '0';
                            selectedColumn = '' + i;
                        }
                        
                        break;
                    }
                }
            }
        }
    }
    
    if(selectedColumn == '-1'){
        strategyThree();
    }
}

function strategyThree(){
    for(let i=0; i< heights.length; i++){
        let currentHeight = filledBlocks.length - 1 - parseInt(heights[i]);
        let colorValue = filledBlocks[currentHeight][i];
        
        if(i == 0){
            if(heights[i] <= 9){
                let rightBlockColorValue = filledBlocks[currentHeight][i+1];
                    
                    if(currentColorB == rightBlockColorValue ){
                        selectedColumn = ''+i;
                        selectedRotation = '1';

                        break;
                    }
                    
                    if(currentColorA == rightBlockColorValue ){

                        selectedColumn = ''+i;
                        selectedRotation = '3';

                        break;
                }
                
                if(currentHeight > 0) {
                    let rightBlockColorValue = filledBlocks[currentHeight-1][i+1];
                    
                    if(currentColorB == rightBlockColorValue ){
                        selectedColumn = ''+i;
                        selectedRotation = '3';

                        break;
                    }
                    
                    if(currentColorA == rightBlockColorValue ){

                        selectedColumn = ''+i;
                        selectedRotation = '1';

                        break;
                    }
                    
                    if(currentHeight > 1){
                        let rightBlockTopColorValue = filledBlocks[currentHeight-2][i+1];
                        
                        if(currentColorB == rightBlockTopColorValue){
                            selectedColumn = ''+i;
                            selectedRotation = '1';

                            break;
                        }
                    
                        if(currentColorA == rightBlockTopColorValue){

                            selectedColumn = ''+i;
                            selectedRotation = '1';

                            break;
                        }
                    }
                }
                
                if(currentColorB == colorValue){
                    selectedColumn = ''+i;
                    selectedRotation = '3';

                    break;
                }
            
                if(currentColorA == colorValue){

                    selectedColumn = ''+i;
                    selectedRotation = '1';

                    break;
                }
            }
        }
        else if (i == 5){
            if(heights[i] <= 9){
                
                if(currentHeight > 0) {
                    let leftBlockColorValue = filledBlocks[currentHeight - 1][i-1];
                    
                    if(currentColorB == leftBlockColorValue ){
                        selectedColumn = ''+i;
                        selectedRotation = '1';

                        break;
                    }
                    
                    if(currentColorA == leftBlockColorValue ){

                        selectedColumn = ''+i;
                        selectedRotation = '3';

                        break;
                    }
                    
                    if(currentHeight > 1){
                        let leftBlockTopColorValue = filledBlocks[currentHeight-2][i-1];
                        if(currentColorB == leftBlockTopColorValue){
                            selectedColumn = ''+i;
                            selectedRotation = '3';

                            break;
                        }
                    
                        if(currentColorA == leftBlockTopColorValue){

                            selectedColumn = ''+i;
                            selectedRotation = '1';

                            break;
                        }
                    }
                }
                
                if(currentColorB == colorValue){
                    selectedColumn = ''+i;
                    selectedRotation = '3';

                    break;
                }
            
                if(currentColorA == colorValue){

                    selectedColumn = ''+i;
                    selectedRotation = '1';

                    break;
                }
            }
        }
        else {
            if(heights[i] <= 9){
                
                if(currentHeight > 0) {
                    let leftBlockColorValue = filledBlocks[currentHeight - 1][i-1];
                    let rightBlockColorValue = filledBlocks[currentHeight - 1][i+1];
                    
                    if(currentColorB == leftBlockColorValue ||currentColorB == rightBlockColorValue ){
                        selectedColumn = ''+i;
                        selectedRotation = '1';
                        printErr('test1');
                        break;
                    }
                    
                    if(currentColorA == leftBlockColorValue ||currentColorA == rightBlockColorValue){

                        selectedColumn = ''+i;
                        selectedRotation = '3';
                        printErr('test2');
                        break;
                    }
                    
                    if(currentHeight > 1){
                        let leftTopBlockColorValue = filledBlocks[currentHeight - 2][i-1];
                        let rightTopBlockColorValue = filledBlocks[currentHeight - 2][i+1];
                    
                        printErr('leftBlockColorValue: '+ leftBlockColorValue);
                        printErr('rightBlockColorValue: '+ rightBlockColorValue);
                        printErr('leftTopBlockColorValue: '+ leftTopBlockColorValue);
                        printErr('rightTopBlockColorValue: '+ rightTopBlockColorValue);
                        
                        if(currentColorB == leftTopBlockColorValue ||currentColorB == rightTopBlockColorValue){
                            selectedColumn = ''+i;
                            selectedRotation = '3';
                            printErr('test3');
                            break;
                        }
                    
                        if(currentColorA == leftTopBlockColorValue ||currentColorA == rightTopBlockColorValue){

                            selectedColumn = ''+i;
                            selectedRotation = '1';
                            printErr('test4');
                            break;
                        }
                    }
                }
                
                if(currentColorB == colorValue){
                    selectedColumn = ''+i;
                    selectedRotation = '3';
                    printErr('test5');
                    break;
                }
            
                if(currentColorA == colorValue){

                    selectedColumn = ''+i;
                    selectedRotation = '1';
                    printErr('test6');
                    break;
                }
            }
        }   
    }
    
    // if nothing was found pick the smallest height
    if(selectedColumn == '-1'){
        selectedColumn = smallestHeight;
    }

    // if nothing was found pick the first position
    if(selectedRotation == '-1'){
        selectedRotation = '1';
    }
}