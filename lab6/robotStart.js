////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, document, window  */
var camera, scene, renderer;
var cameraControls;


var clock = new THREE.Clock();
var timer = 0;
var keyBoard = new KeyboardState();

function moveroboto(){
	timer += 0.1;
	let range = 0.1;

	rShld.rotateX(-Math.cos(timer)*range);
	rElbow.rotateX(-Math.sin(timer)*range*0.5);

	lShld.rotateX(Math.cos(timer)*range);
	lElbow.rotateX(-Math.sin(timer)*range*0.5);

	lHip.rotateX(-Math.cos(timer)*range);
	lKnee.rotateX(Math.sin(timer)*range*0.5);

	rHip.rotateX(Math.cos(timer)*range);
	rKnee.rotateX(Math.sin(timer)*range*0.5);
}
function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);
	renderer.render(scene, camera);
}

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

function drawRobot() {

	//////////////////////////////
	root = new THREE.Group();
	root.position.y = -175;
	scene.add(root);
	// MATERIALS

	let materialYellow = new THREE.MeshPhongMaterial({color: 0xffcc00});
	let materialGray = new THREE.MeshPhongMaterial({color: 0x333333});

	let joint = new THREE.Mesh(new THREE.SphereBufferGeometry(25,32,32), materialGray);
	let bone = new THREE.Mesh(new THREE.CylinderBufferGeometry(20,20,100,32), materialYellow);
	bone.position.y = -50;
	let piece = new THREE.Group();
	piece.add(joint);
	piece.add(bone);

	let hand = new THREE.Mesh(new THREE.BoxBufferGeometry(10, 40, 40), materialYellow);
	hand.position.y = -25;
	let wristPiece = new THREE.Group();
	wristPiece.add(joint.clone());
	wristPiece.add(hand);

	let feet = new THREE.Mesh(new THREE.BoxBufferGeometry(30, 20, 75), materialYellow);
	feet.position.y = -30;
	feet.position.z = 20;
	let feetPiece = new THREE.Group();
	feetPiece.add(joint.clone());
	feetPiece.add(feet);

	// MODELS

 	//body
	groupChest = new THREE.Group();
	root.add(groupChest);

	let chest = new THREE.Mesh(new THREE.BoxBufferGeometry(150, 150, 75), materialYellow);
	chest.position.x = 0;
	chest.position.y = 470;
	chest.position.z = 0;
	groupChest.add(chest);

	neck = new THREE.Group();
	chest.add(neck);
	let neckSphere = new THREE.Mesh(new THREE.SphereBufferGeometry(20,32,32), materialGray);
	neck.add(neckSphere);
	neck.position.y = 90;

	head = new THREE.Group();
	let smallSphere = new THREE.Mesh(new THREE.SphereBufferGeometry(10,32,32), materialGray);
	let face = new THREE.Mesh(new THREE.BoxBufferGeometry(100, 75, 75), materialYellow);
	head.add(face);

	let lEye = smallSphere.clone();
	lEye.position.x = 25;
	lEye.position.y = 15;
	lEye.position.z = 35;
	head.add(lEye);

	let rEye = smallSphere.clone();
	rEye.position.x = -25;
	rEye.position.y = 15;
	rEye.position.z = 35;
	head.add(rEye);

	let lEar = smallSphere.clone();
	lEar.position.x = 50;
	head.add(lEar);

	let rEar = smallSphere.clone();
	rEar.position.x = -50;
	head.add(rEar);

	let mouth = new THREE.Mesh(new THREE.BoxBufferGeometry(50, 10, 5), materialGray);
	mouth.position.y = -15;
	mouth.position.z = 40;
	head.add(mouth);

	head.position.y = 40;
	neck.add(head);

	rShld = piece.clone();
	rElbow = piece.clone();
	rElbow.position.y = -90;
	rShld.add(rElbow);
	rWrist = wristPiece.clone();
	rWrist.position.y = -90;
	rElbow.add(rWrist);
	rShld.position.x = -75;
	rShld.position.y = 60;
	rShld.position.z = 0;
	chest.add(rShld);
	rShld.rotateZ(-0.3);


	lShld = piece.clone();
	lElbow = piece.clone();
	lElbow.position.y = -90;
	lShld.add(lElbow);
	lWrist = wristPiece.clone();
	lWrist.position.y = -90;
	lElbow.add(lWrist);
	lShld.position.x = 75;
	lShld.position.y = 60;
	lShld.position.z = 0;
	chest.add(lShld);
	lShld.rotateZ(0.3);

	hips = new THREE.Group();
	let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(35,32,32), materialGray);
	let box = new THREE.Mesh(new THREE.BoxBufferGeometry(150, 30, 75), materialYellow);
	box.position.y = -35;
	hips.add(sphere);
	hips.add(box);
	hips.position.y = 385;
	root.add(hips);


	rHip = piece.clone();
	rKnee = piece.clone();
	rKnee.position.y = -90;
	rHip.add(rKnee);
	rAnkle = feetPiece.clone();
	rAnkle.position.y = -90;
	rKnee.add(rAnkle);
	rHip.position.x = -55;
	rHip.position.y = -40;
	hips.add(rHip);

	lHip = piece.clone();
	lKnee = piece.clone();
	lKnee.position.y = -90;
	lHip.add(lKnee);
	lAnkle = feetPiece.clone();
	lAnkle.position.y = -90;
	lKnee.add(lAnkle);
	lHip.position.x = 55;
	lHip.position.y = -40;
	hips.add(lHip);

}

function init() {
	var canvasWidth = 1200;
	var canvasHeight = 900;
	var canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );

	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0xAAAAAA, 1.0 );

	// CAMERA
	camera = new THREE.PerspectiveCamera( 30, canvasRatio, 1, 40000 );
	// CONTROLS
	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	camera.position.set( -500, 900, 3000);
	cameraControls.target.set(0,100,0);
}
var root, groupChest, neck, head, hips, lHip, rHip, rKnee, lKnee, lAnkle, rAnkle, rShld, lShld, lElbow, rElbow, lWrist, rWrist;

function addToDOM() {
    var canvas = document.getElementById('canvas');
    canvas.appendChild(renderer.domElement);
}

function animate() {

	keyBoard.update();

	 // Movement Constants
	 var moveSpeed = 15;
	 var eyeSpeed = 0.1;

	 var rotateSpeed = 2.5;
	 rotateSpeed *= Math.PI / 180;
	 // Forward vector
	 // Moving Forward
	 if (keyBoard.pressed("W")) {
			 root.translateZ(moveSpeed);
	 }
	 // Moving Back
	 if (keyBoard.pressed("S")) {
			 root.translateZ(-moveSpeed);
	 }
	 // Rotate Left
	 if (keyBoard.pressed("A")) {
			 root.rotateY(rotateSpeed);
	 }
	 // Rotate Right
	 if (keyBoard.pressed("D")) {
			 root.rotateY(-rotateSpeed);
	 }
	 // Move Legs
	 if (keyBoard.pressed("W") || keyBoard.pressed("A") || keyBoard.pressed("S") || keyBoard.pressed("D")) {
			 moveroboto();
	}
	window.requestAnimationFrame(animate);
	render();
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
