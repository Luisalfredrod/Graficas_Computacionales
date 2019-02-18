// start processing user input
process.stdin.resume();
process.stdin.setEncoding('ascii');
// declare global variables
var input_stdin = "";
var input_stdin_array = "";
// standard input is stored into input_stdin
process.stdin.on('data', function (data) {
    input_stdin += data;
});
// standard input is done and stored into an array
// then main is called so that you can start processing your data
process.stdin.on('end', function () {
    input_stdin_array = input_stdin.split("\n");
    main();
});
// reads a line from the standard input array
// returns string
function readLine(_line_number) {
    return input_stdin_array[_line_number];
}


function parseLine(_textArray){

    var stringArray = _textArray.split(" ");
    var intArray = [];
    for(var i=0;i<stringArray.length;i++){
        intArray.push(parseInt(stringArray[i]));
    }

    return intArray;
}

function multiply(a, b) {
  var aNumRows = a.length, aNumCols = a[0].length,
      bNumRows = b.length, bNumCols = b[0].length,
      m = new Array(aNumRows);  // initialize array of rows
  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols); // initialize the current row
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0;             // initialize the current cell
      for (var i = 0; i < aNumCols; ++i) {
        m[r][c] += a[r][i] * b[i][c];
      }
    }
  }
  return m;
}
// function mat_to_arr(){
//     for()
// }

function main() {
    // write your code here.
    // call `readLine()` to read a line.
    // use console.log() to write to stdout
    var a = parseLine(readLine(0)); 
    var b = parseLine(readLine(1)); 
    var c = parseLine(readLine(2)); 
    var d = parseInt(readLine(3)); 
    var e = parseLine(readLine(4));

    //Average
    var xp = (a[0]+b[0]+c[0])/3;
    var yp = (a[1]+b[1]+c[1])/3;
    var zp = (a[2]+b[2]+c[2])/3;

    //Matrix for operations
    var tr = [[1,0,0,-xp],
              [0,1,0,-yp],
              [0,0,1,-zp],
              [0,0,0,1]];
    var trInv = [[1,0,0,xp],
                 [0,1,0,yp],
                 [0,0,1,zp],
                 [0,0,0,1]];
    var trFin = [[1,0,0,e[0]],
                 [0,1,0,e[1]],
                 [0,0,1,e[2]],
                 [0,0,0,1]];
    

    //Move to origin             
    var av = [[a[0]],[a[1]],[a[2]],[a[3]]];
    var bv = [[b[0]],[b[1]],[b[2]],[b[3]]];
    var cv = [[c[0]],[c[1]],[c[2]],[c[3]]];
    var acenter = multiply(tr,av);
    var bcenter = multiply(tr,bv);
    var ccenter = multiply(tr,cv);

    // |cos θ   −sin θ   0      0| |x|   |x cos θ − y sin θ      0|   |x'|
    // |sin θ    cos θ   0      0| |y| = |x sin θ + y cos θ      0| = |y'|
    // |  0       0      1      0| |z|   |        z               |   |z'|      
    // |  0       0      0      1| |1|   |        1               |   |1'|  
    var rotate = [[Math.cos(d*Math.PI/180),-Math.sin(d*Math.PI/180),0,0],
              [Math.sin(d*Math.PI/180),Math.cos(d*Math.PI/180),0,0],
              [0,0,1,0],
              [0,0,0,1]];
    var arot = multiply(rotate,acenter);
    var brot = multiply(rotate,bcenter);
    var crot = multiply(rotate,ccenter);
    //Multiply Inverse
    arot = multiply(trInv,arot);
    brot = multiply(trInv,brot);
    crot = multiply(trInv,crot);
    
    arot = multiply(trFin,arot);
    brot = multiply(trFin,brot);
    crot = multiply(trFin,crot);
    console.log(Math.round(arot[0])+" "+Math.round(arot[1])+" "+Math.round(arot[2])+" "+Math.round(arot[3]));
    console.log(Math.round(brot[0])+" "+Math.round(brot[1])+" "+Math.round(brot[2])+" "+Math.round(brot[3]));
    console.log(Math.round(crot[0])+" "+Math.round(crot[1])+" "+Math.round(crot[2])+" "+Math.round(crot[3]));

}
