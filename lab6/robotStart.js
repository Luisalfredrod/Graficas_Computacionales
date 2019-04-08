////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, document, window  */
var camera, scene, renderer;
var cameraControls;

var clock = new THREE.Clock();
var keyBoard = new KeyboardState();
var mult = 0;
var root;//, body, neck, headGroup, hip, HipLeft, HipRight, KneeRight, KneeLeft, footLeft,footRight, shldRight, shldLeft, elbowLeft, elbowRight, handLeft, handRight;

//-----------------------------------------------------------------------------
function fillScene() {
	scene = new THREE.Scene();
	//scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );

	// LIGHTS

	scene.add( new THREE.AmbientLight( 0x222222 ) );

	var light = new THREE.DirectionalLight( 0xffffff, 0.7 );
	light.position.set( 200, 500, 500 );

	scene.add( light );

	light = new THREE.DirectionalLight( 0xffffff, 0.9 );
	light.position.set( -200, -100, -400 );

	scene.add( light );

//grid xz
 var gridXZ = new THREE.GridHelper(2000, 100, new THREE.Color(0xCCCCCC), new THREE.Color(0x888888));
 scene.add(gridXZ);

 //axes
 var axes = new THREE.AxisHelper(150);
 axes.position.y = 1;
 scene.add(axes);

 drawRobot();
}
//-----------------------------------------------------------------------------
function drawRobot() {
	//STEPS DOCUMENTATION - https://miscursos.tec.mx/bbcswebdav/pid-13274413-dt-content-rid-74358968_1/courses/QRO.TC3022.1.1911.1585/labs/lab6.html
	root = new THREE.Group();
	root.position.y = -175;
	scene.add(root);

	let materialYellow = new THREE.MeshPhongMaterial({color: 0xffcc00});
	let materialGray = new THREE.MeshPhongMaterial({color: 0x333333});
	//////////////////////////////
	// MATERIALS

//----------------------------------------------------------------------------
	let tjoint = new THREE.Mesh(new THREE.SphereBufferGeometry(20,32,32), materialGray);
	let tbone = new THREE.Mesh(new THREE.CylinderBufferGeometry(20,10,100,32), materialYellow);
	let tpiece = new THREE.Group();
	tbone.position.y = -50;
	tpiece.add(tjoint);
	tpiece.add(tbone);
	//----------------------------------------------------------------------------

	//-------------------------Feet Piece---------------------------------------------
	//Foot
	let foot = new THREE.Mesh(new THREE.BoxBufferGeometry(40, 40, 75), materialYellow);
	foot.position.z = 20;
	foot.position.y = -30;
	//Group Feet to joint
	let feetGroup = new THREE.Group();
	// Ankle
	feetGroup.add(tjoint.clone());
	feetGroup.add(foot);
	//-----------------------------------------------------------------------------

	//-------------------------Hand Piece------------------------------------------
	let hand = new THREE.Mesh(new THREE.BoxBufferGeometry(10, 40, 50), materialYellow);
	hand.position.y = -25;

	//Group Hand to joint
	let wristPiece = new THREE.Group();
	//Wrist
	wristPiece.add(tjoint.clone());
	wristPiece.add(hand);
	//-----------------------------------------------------------------------------
		// var bodyMaterial = new THREE.MeshLambertMaterial();
		// bodyMaterial.color.setRGB( 0.5, 0.5, 0.5 );
		// var cylinder;
		// cylinder = new THREE.Mesh(
		// 	new THREE.CylinderGeometry( 60, 60, 150, 32 ), bodyMaterial );
		// cylinder.position.x = 0;
		// cylinder.position.y = 320;
		// cylinder.position.z = 0;
		// scene.add( cylinder );
	//----------------------------------------------------------------------------
		// MODELS

	//body
	var	body = new THREE.Group();
	root.add(body);
	//-----------------------------Main Body------------------------------
	let mainBody = new THREE.Mesh(new THREE.BoxBufferGeometry(150, 150, 105), materialYellow);
	mainBody.position.x = 0;
	mainBody.position.y = 470;
	mainBody.position.z = 0;
	body.add(mainBody);
	//----------------------------Head----------------------------------

	//Neck
	var neckGroup = new THREE.Group();
	let neck =new THREE.Mesh(new THREE.SphereBufferGeometry(20,32,32), materialGray);
	neckGroup.add(neck);
	neckGroup.position.y = 90;
	//Add neck to mainbody
	mainBody.add(neckGroup);
	
	var headGroup = new THREE.Group();
	let skull = new THREE.Mesh(new THREE.BoxBufferGeometry(100, 100, 75), materialYellow);
	headGroup.add(skull);

	//Mouth box
	let mouth = new THREE.Mesh(new THREE.BoxBufferGeometry(50, 10, 5), materialGray);
	mouth.position.y = -15;
	mouth.position.z = 40;
	headGroup.add(mouth);

	// Multi purpose sphere
	let features = new THREE.Mesh(new THREE.SphereBufferGeometry(15,0,0), materialGray);
	//Clone feature sphere for Ears 
	let rightEar = features.clone();
	let leftEar = features.clone();
	//Position Ears (take in count x of skull)
	rightEar.position.x = -50;
	leftEar.position.x = 50;
	headGroup.add(rightEar);
	headGroup.add(leftEar);

	//Clone feature sphere for Eyes
	let rightEye = features.clone();
	let leftEye = features.clone();
	// Position
	rightEye.position.x = -25;
	rightEye.position.y = 15;
	rightEye.position.z = 35;

	leftEye.position.x = 25;
	leftEye.position.y = 15;
	leftEye.position.z = 35;
	
	headGroup.add(leftEye);
	headGroup.add(rightEye);
	//ADD HEAD TO NECK IN BODY
	headGroup.position.y = 50;
	neckGroup.add(headGroup);
//------------------------------------------------------------------------------
//----------------------------Legs&Hip------------------------------------------
	var hip = new THREE.Group();
	let hipbox = new THREE.Mesh(new THREE.BoxBufferGeometry(150, 10, 75), materialYellow);
	let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(35,32,32), materialGray);
	hipbox.position.y = -25;
	hip.add(sphere);
	hip.add(hipbox);
	hip.position.y = 385;
	root.add(hip);

// Clone Hips 
	HipRight = tpiece.clone();
	HipRight.position.x = -55;
	HipRight.position.y = -40;

	HipLeft = tpiece.clone();
	HipLeft.position.x = 55;
	HipLeft.position.y = -40;
	
	// Clone Knees
	KneeRight = tpiece.clone();
	KneeRight.position.y = -90;

	KneeLeft = tpiece.clone();
	KneeLeft.position.y = -90;

// Clone Feet
	footRight = feetGroup.clone();
	footRight.position.y = -90;
	footLeft = feetGroup.clone();
	footLeft.position.y = -90;
	
//Join HipJoint - Knee
	HipRight.add(KneeRight);
	HipLeft.add(KneeLeft);
//Join Knee - Foot
	KneeRight.add(footRight);
	KneeLeft.add(footLeft);
//Join Hip - HipJoint
	hip.add(HipRight);
	hip.add(HipLeft);
	//-----------------------------Arms+Hands------------------------------------
//Sholders
	shldRight = tpiece.clone();
	shldRight.position.x = -85;
	shldRight.position.y = 60;
	shldRight.position.z = 0;
	shldRight.rotateZ(-0.3);

	shldLeft = tpiece.clone();
	shldLeft.position.x = 85;
	shldLeft.position.y = 60;
	shldLeft.position.z = 0;
	shldLeft.rotateZ(0.3);

//Elbows
	elbowLeft = tpiece.clone();
	elbowLeft.position.y = -100;
	
	elbowRight = tpiece.clone();
	elbowRight.position.y = -100;
//Hands
	handRight = wristPiece.clone();
	handRight.position.y = -100;
	handLeft = wristPiece.clone();
	handLeft.position.y = -100;
	
	// Join and add to main body
	shldRight.add(elbowRight);
	shldLeft.add(elbowLeft);
	elbowRight.add(handRight);
	elbowLeft.add(handLeft);
	mainBody.add(shldLeft);
	mainBody.add(shldRight);

}


function moveRobot(){
	mult += 0.2;
	let range = 0.2;
// Rotation of arms
	shldRight.rotateX(-Math.cos(mult)*range);
	shldLeft.rotateX(Math.cos(mult)*range);
	elbowRight.rotateX(-Math.sin(mult)*range*0.5);
	elbowLeft.rotateX(Math.sin(mult)*range*0.5);
// Rotation of legs
	HipLeft.rotateX(-Math.cos(mult)*range);
	HipRight.rotateX(Math.cos(mult)*range);
	KneeLeft.rotateX(Math.sin(mult)*range*0.5);
	KneeRight.rotateX(Math.sin(mult)*range*0.5);


}

function init() {
	var canvasWidth = 1400;
	var canvasHeight = 1000;
	var canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );

	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0xAAAAAA, 1.0 );

	// CAMERA
	camera = new THREE.PerspectiveCamera( 45, canvasRatio, 1, 4000 );
	// CONTROLS
	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	camera.position.set( -800, 900, 3000);
	cameraControls.target.set(0,100,0);
}

function addToDOM() {
    var canvas = document.getElementById('canvas');
    canvas.appendChild(renderer.domElement);
}


function animate() {
	//Catch keyboard strokes
	keyBoard.update();

	var moveSpeed = 15;
	var rotateSpeed = 2.5;
	rotateSpeed *= Math.PI / 180;
//Movements
	if (keyBoard.pressed("W")) {
		//Foward translate movement
			root.translateZ(moveSpeed);
	}
	if (keyBoard.pressed("S")) {
		//Backward translate movement
			root.translateZ(-moveSpeed);
	}
	//-----------------Change direction--------------------------------
	if (keyBoard.pressed("A")) {
		
			root.rotateY(rotateSpeed);
	}
	if (keyBoard.pressed("D")) {
			root.rotateY(-rotateSpeed);
	}
	//-----------------------------------------------------------------
	//---------------------Animation of arms and legs -------------------------
	if (keyBoard.pressed("W") || keyBoard.pressed("S")) {
			moveRobot();
 }
 //--------------------render-------------------------------------------------
	window.requestAnimationFrame(animate);
	render();
}

function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);
	renderer.render(scene, camera);
}

try {
  init();
  fillScene();
  addToDOM();
  animate();
} catch(error) {
    console.log("Your program encountered an unrecoverable error, can not draw on canvas. Error was:");
    console.log(error);
}
