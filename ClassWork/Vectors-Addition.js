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



function solveMeFirst(a, b) {
  // Hint: Type return a+b+c below
  var res=[];
  var i;
  for (i = 0; i < a.length; i++) { 
    res[i] = a[i] + b[i];
  }

  return res.join(' ');

}

function main() {
    // write your code here.
    // call `readLine()` to read a line.
    // use console.log() to write to stdout
    var a = parseLine(readLine(0));
    var b = parseLine(readLine(1));
    
    var res = solveMeFirst(a, b);
    console.log(res);

}