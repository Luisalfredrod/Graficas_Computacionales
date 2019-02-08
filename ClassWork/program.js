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

function solveMeFirst(a, b) {
    // Hint: Type return a+b+c below
    var f = 0;
    var t = a.split(" ");
    var v = b.split(" ");
    for(var i=0;i<t.length;i++){
      f = f +(parseInt(t[i])*parseInt(v[i]));
    }
    return f;

  }




function multiplyMatrices(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
		console.log("Matrices are not compatible");
    }

    var x = a.length,
        z = a[0].length,
        y = b[0].length;

    if (b.length !== z) {
        // XxZ & ZxY => XxY
	console.log("Matrices are not compatible");
    }

    var productRow = Array.apply(null, new Array(y)).map(Number.prototype.valueOf, 0);
    var product = new Array(x);
    for (var p = 0; p < x; p++) {
        product[p] = productRow.slice();
    }

    for (var i = 0; i < x; i++) {
        for (var j = 0; j < y; j++) {
            for (var k = 0; k < z; k++) {
                product[i][j] += a[i][k] * b[k][j];
            }
        }
    }

    return product;
}


function main() {
    // write your code here.
    // call `readLine()` to read a line.
    // use console.log() to write to stdout
    var a = readLine(0).split(" ");
    var b = readLine(1).split(" ");
    var c = readLine(2).split(" ");
    var d = readLine(3).split(" ");
    var e = readLine(4).split(" ");
    var f = readLine(5).split(" ");
    var all= [a,b,c,d,e,f]
    var go=1;
    for (var j=0;j<6; j++){
    	l=all[0].length;
    	if (all[j].length!=l){
    		console.log("Matrices are not compatible");
    		go=0;
    		break
    	}
    }
    if (go==1){
     var m1 = [a,b,c];
    var m2 = [d,e,f];
        //console.log(m1);
        //console.log(m2);
    
    var res=multiplyMatrices(m1,m2)
    for (var i =0; i<3; i++){
    	console.log(res[i][0]+" "+res[i][1]+" "+res[i][2]);
    
    
    }

    
    
    }
   
    
    
    
    
   
}