'use strict';

function linkedNodeList(x, y){
    this.x = x;
    this.y = y;
    this.nextNode = null;
    this.bottomNode = null;
}

linkedNodeList.prototype.addNode = function(x, y){
    
    if(this.nextNode == null){
        this.nextNode = new linkedNodeList(x,y);
    }
    else {
        this.nextNode.addNode(x,y);
    }
    
    if(this.bottomNode == null && this.x == x){
        this.bottomNode = new linkedNodeList(x,y);
    }
};

linkedNodeList.prototype.getCurrentNodeData = function(){
    let result = '' + this.x + ' ' + this.y + ' ';
    
    if(this.nextNode != null && this.nextNode.y == this.y){
        result += '' + this.nextNode.x + ' ' + this.nextNode.y + ' ';
    }
    else{
        result += '-1 -1 ';
    }
    
    if(this.bottomNode != null){
        result += '' + this.bottomNode.x + ' ' + this.bottomNode.y;
    }
    else{
        result += '-1 -1';
    }
    
    return result;
};

let width = parseInt(readline()); // the number of cells on the X axis
let height = parseInt(readline()); // the number of cells on the Y axis

let result = null;

for (let i = 0; i < height; i++) {
    let line = readline(); // width characters, each either 0 or .
    let arr = [];
    for(let j = 0; j< line.length; j++){
        if(line[j] == '0'){
            if(result == null){
                result = new linkedNodeList(j,i);
                printErr(j + ' ' + i);
            }
            else {
                result.addNode(j, i);
                printErr(j + ' ' + i);
            }
        }
    }
}

let nextNode = result;

while (nextNode != null){
    
    print(nextNode.getCurrentNodeData());
    
    nextNode = nextNode.nextNode;
}