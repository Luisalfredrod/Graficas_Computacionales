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


function matrix_invert(matrix) {
    if (matrix.length !== matrix[0].length) { return; }

    var ithRow = 0,
        j = 0,
        dimension = matrix.length, 
        diagonalElement = 0;

    var identityMatrix = [], 
        matrixCopy = [];
    
    for (var i = 0; i < dimension; i++) {

        
        identityMatrix[identityMatrix.length] = [];
        matrixCopy[matrixCopy.length] = [];

        for (j = 0; j < dimension; j++) {

            
            if (i == j) { identityMatrix[i][j] = 1; }
            else { identityMatrix[i][j] = 0; }

            
            matrixCopy[i][j] = matrix[i][j];
        }
    }

    
    for (var i = 0; i < dimension; i++) {
        
        diagonalElement = matrixCopy[i][i];

        
        if (diagonalElement == 0) {
            
            for (ithRow = i + 1; ithRow < dimension; ithRow += 1) {

                
                if (matrixCopy[ithRow][i] != 0) {

                    
                    for (j = 0; j < dimension; j++) {

                        diagonalElement = matrixCopy[i][j];                 
                        matrixCopy[i][j] = matrixCopy[ithRow][j];           
                        matrixCopy[ithRow][j] = diagonalElement;            
                        diagonalElement = identityMatrix[i][j];             
                        identityMatrix[i][j] = identityMatrix[ithRow][j];   
                        identityMatrix[ithRow][j] = diagonalElement;        
                    }
                    break;
                }
            }

            
            diagonalElement = matrixCopy[i][i];

            
            if (diagonalElement == 0) { return }
        }

        for (j = 0; j < dimension; j++) {
            matrixCopy[i][j] = matrixCopy[i][j] / diagonalElement;        
            identityMatrix[i][j] = identityMatrix[i][j] / diagonalElement;
        }

        for (ithRow = 0; ithRow < dimension; ithRow++) {

            if (ithRow == i) { continue; }

            
            diagonalElement = matrixCopy[ithRow][i];


            for (j = 0; j < dimension; j++) {
                matrixCopy[ithRow][j] -= diagonalElement * matrixCopy[i][j];            
                identityMatrix[ithRow][j] -= diagonalElement * identityMatrix[i][j];    
            }
        }
    }

    return identityMatrix;
}


function parseLine(textArray) {
    var stringArray = textArray.split(" ");

    var intArray = [];
    for (var i = 0; i < stringArray.length; i++) {
        intArray.push(parseInt(stringArray[i]));
    }

    return intArray;

}

function matrixMultiplication(matrixA, matrixB) {
    var aNumRows = matrixA.length,
        aNumCols = matrixA[0].length,
        bNumCols = matrixB[0].length,
        matrix = new Array(aNumRows);

    for (var row = 0; row < aNumRows; ++row) {
        matrix[row] = new Array(bNumCols);

        for (var col = 0; col < bNumCols; ++col) {
            matrix[row][col] = 0;

            for (var i = 0; i < aNumCols; ++i) {
                matrix[row][col] += matrixA[row][i] * matrixB[i][col];
            }
        }
    }

    return matrix;
}

function main() {

    var camera = readLine(0).split(" ").map(Number);
    var vectorA = readLine(1).split(" ").map(Number);
    var vectorB = readLine(2).split(" ").map(Number);
    var vectorC = readLine(3).split(" ").map(Number);

    var camVec = [
        [camera[0]],
        [camera[1]],
        [camera[2]]
    ];

    var aVec = [
        [vectorA[0]],
        [vectorA[1]],
        [vectorA[2]],
        [1]
    ];

    var bVec = [
        [vectorB[0]],
        [vectorB[1]],
        [vectorB[2]],
        [1]
    ];

    var cVec = [
        [vectorC[0]],
        [vectorC[1]],
        [vectorC[2]],
        [1]
    ];
    
    var vectorSize = Math.sqrt(camera[0] * camera[0] + camera[1] * camera[1] + camera[2] * camera[2]);

    var normalCamera = [
        [camera[0] / vectorSize],
        [camera[1] / vectorSize],
        [camera[2] / vectorSize]
    ];

    var backVector = normalCamera;

    var auxVectorNormalCam = [
        [camera[0] / vectorSize],
        [(camera[1] / vectorSize) - 1],
        [camera[2] / vectorSize]
    ];
    
    var rightVector = [
        [normalCamera[1][0] * auxVectorNormalCam[2][0] - normalCamera[2][0] * auxVectorNormalCam[1][0]],
        [normalCamera[2][0] * auxVectorNormalCam[0][0] - normalCamera[0][0] * auxVectorNormalCam[2][0]],
        [normalCamera[0][0] * auxVectorNormalCam[1][0] - normalCamera[1][0] * auxVectorNormalCam[0][0]]
    ];

    var rightSize = Math.sqrt(rightVector[0][0] * rightVector[0][0] + rightVector[1][0] * rightVector[1][0] + rightVector[2][0] * rightVector[2][0]);

    rightVector = [
        [rightVector[0][0] / rightSize],
        [rightVector[1][0] / rightSize],
        [rightVector[2][0] / rightSize]
    ];

    var upVector = [
        [backVector[1][0] * rightVector[2][0] - backVector[2][0] * rightVector[1][0]],
        [backVector[2][0] * rightVector[0][0] - backVector[0][0] * rightVector[2][0]],
        [backVector[0][0] * rightVector[1][0] - backVector[1][0] * rightVector[0][0]]
    ];

    var upSize = Math.sqrt(upVector[0][0] * upVector[0][0] + upVector[1][0] * upVector[1][0] + upVector[2][0] * upVector[2][0]);

    upVector = [
        [upVector[0][0] / upSize],
        [upVector[1][0] / upSize],
        [upVector[2][0] / upSize]
    ];

    var transposedMatrix = [
        [rightVector[0][0], upVector[0][0], backVector[0][0], camera[0]],
        [rightVector[1][0], upVector[1][0], backVector[1][0], camera[1]],
        [rightVector[2][0], upVector[2][0], backVector[2][0], camera[2]],
        [0, 0, 0, 1]
    ];
    
    var inverseTrasposed = matrix_invert(transposedMatrix);
    
    var finalA = matrixMultiplication(inverseTrasposed, aVec);
    var finalB = matrixMultiplication(inverseTrasposed, bVec);
    var finalC = matrixMultiplication(inverseTrasposed, cVec);

    console.log(finalA.map(Math.round).join(" "));
    console.log(finalB.map(Math.round).join(" "));
    console.log(finalC.map(Math.round).join(" "));
}
