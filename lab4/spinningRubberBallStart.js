////////////////////////////////////////////////////////////////////////////////
/*global THREE, document, window  */
var camera, scene, renderer;
var cameraControls;
var canvasWidth = 600;
var canvasHeight = 400;
var canvas = document.getElementById('canvas');
var clock = new THREE.Clock();
var kooshball = new THREE.Object3D();
var spinSpeed = 0.05;
var spinAxis = new THREE.Vector3(0, 1, 0);
var spinAngle = 0;

function fillScene() {
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );

	// LIGHTS
	scene.add( new THREE.AmbientLight( 0x222222 ) );

	var light = new THREE.DirectionalLight( 0xffffff, 0.7 );
	light.position.set( 200, 500, 500 );

	scene.add( light );

	light = new THREE.DirectionalLight( 0xffffff, 0.9 );
	light.position.set( -200, -100, -400 );

	scene.add( light );

	//grid xz
	var gridXZ = new THREE.GridHelper(2000, 100);
	gridXZ.setColors( new THREE.Color(0xCCCCCC), new THREE.Color(0x888888) );
	scene.add(gridXZ);

	//axes
	var axes = new THREE.AxisHelper(150);
	axes.position.y = 1;
	scene.add(axes);

	drawKooshBall();
}

function drawKooshBall() {
	var cylinder;

	// MATERIALS
	var cylMats = [
		new THREE.MeshPhongMaterial( { color: 0x5500DD, specular: 0xD1F5FD, shininess: 100 } ),
		new THREE.MeshPhongMaterial( { color: 0x05FFFF, specular: 0xD1F5FD, shininess: 100 } ),
	];
	var cylinderGeo = new THREE.CylinderGeometry( 3, 3, 500, 32 );

	for (var i = 1; i <= 1200; i++) {
		var rx = Math.random() * 2 - 1; var ry = Math.random() * 2 - 1; var rz = Math.random() * 2 - 1;

		// get two diagonally-opposite corners.
		var maxCorner = new THREE.Vector3(  rx, ry, rz );
		var minCorner = new THREE.Vector3( -rx, -ry, -rz );

		var cylAxis = new THREE.Vector3().subVectors( maxCorner, minCorner );

		// take dot product of cylAxis and up vector to get cosine of angle.
		cylAxis.normalize();
		var theta = Math.acos( cylAxis.y );

		var cylinder = new THREE.Mesh( cylinderGeo, cylMats[i%2] );
		var rotationAxis = new THREE.Vector3(rx, ry, rz);
		rotationAxis.normalize(); // makeRotationAxis wants its axis normalized.

		// Use quaternions to set the rotation.
		var quaternion = new THREE.Quaternion().setFromAxisAngle( rotationAxis, theta );
		cylinder.rotation.setFromQuaternion( quaternion );


		kooshball.add( cylinder );
	}
	scene.add( kooshball ); // Only after the kooshball object has been fully built do we add it to the scene.
}

function init() {
	var canvasRatio = canvasWidth / canvasHeight;

	addMouseHandler(canvas);
	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0xAAAAAA, 1.0 );

	// CAMERA
	camera = new THREE.PerspectiveCamera( 45, canvasRatio, 1, 4000 );
	camera.position.set( -800, 600, 500);
	camera.lookAt( new THREE.Vector3(0, 0, 0));
}

function addToDOM() {
    canvas.appendChild(renderer.domElement);
}

function animate() {
	window.requestAnimationFrame(animate);
	render();
}

function render() {
	if (spinAngle > Math.PI * 2) {
		spinAngle = spinAngle - Math.PI * 2;
	}

	// Gradually slow speed down. If its below threshold, set to 0.
	if(spinSpeed < 0.0003){
		spinSpeed = 0;
	}else{
		spinSpeed -= 0.0001;
	}
	spinAngle = spinAngle + spinSpeed;

	// Setting matrix values directly requires disabling autoupdate.
	kooshball.matrixAutoUpdate = false;
	kooshball.matrix.makeRotationAxis( spinAxis, spinAngle);

	/*
	FYI: Below is an alternate way to set rotation axis to an arbitrary vector using
	quaternions. In this case, we don't disable matrixAutoUpdate because we
	aren't setting matrix values directly. You can use this instead of the two
	lines of code above, with the same effect.
	*/
	//var quaternion = new THREE.Quaternion().setFromAxisAngle( spinAxis, spinAngle );
	//kooshball.rotation.setFromQuaternion( quaternion );

	renderer.render(scene, camera);
}

var mouseDown;
var swipeStart;

// Returns a point "under the mouse" in the 3D space on the z = 0 plane by "unprojecting" the screen location of the mouse.
function getMousePoint(clientX, clientY){
	//Create vector based on the mouse location within the window (z is arbitrary).
	var vector = new THREE.Vector3();
	vector.set(
     ( clientX / window.innerWidth ) * 2 - 1,
     - ( clientY / window.innerHeight ) * 2 + 1,
	 0.5 );
	 
	/*
	To render 3D points to the window, we project them onto a
	2D viewing plane. The unproject method does the opposite. It takes a point
	in screen space and transforms it into a point in 3D space using the camera
	projection matrix. We then extend a ray from the camera location through this
	point to the z=0 plane to get an exact point in 3D space.
	*/
	vector.unproject( camera );
	var dir = vector.sub( camera.position ).normalize();
	var distance = -camera.position.z / dir.z;
	return camera.position.clone().add( dir.multiplyScalar( distance ) );
}

function onMouseDown(evt) {
	clock = new THREE.Clock(); // Reset clock.
	clock.start(); // Start clock.
	evt.preventDefault();
	mouseDown = true;
	swipeStart = getMousePoint(evt.clientX, evt.clientY); // Get a point in 3D space corresponding to the start of the mouse swipe.
}

function onMouseMove(evt) {
  if (!mouseDown) {
    return;
  } else {
		evt.preventDefault();

		swipeEnd = getMousePoint(evt.clientX, evt.clientY); // Get a point in 3D space corresponding to the end (so far) of the mouse swipe.

		var swipeVector = new THREE.Vector3();
		swipeVector.subVectors(swipeEnd.normalize(), swipeStart.normalize()); // Vector that represents the swipe so far.

		var swipedVector = swipeVector.clone().normalize();
		var cameraVector = camera.position.clone().normalize();
		spinAxis.crossVectors(swipedVector, cameraVector).normalize(); // Set spinAxis vector derived form the swipe vector and the camera position.

		clock.getElapsedTime(); // Get clock time until this point.
		spinSpeed = (swipeVector.length() / clock.oldTime) *100; // Set the spin speed based on the swipe.
		console.log(spinSpeed);
	}
}

function addMouseHandler(canvas) {
    canvas.addEventListener('mousemove', function (e) {
      onMouseMove(e);
    }, false);
    canvas.addEventListener('mousedown', function (e) {
      onMouseDown(e);
    }, false);
    canvas.addEventListener('mouseup', function (e) {
			e.preventDefault();
		  mouseDown = false;
    }, false);
		canvas.addEventListener ("mouseout", function (e) {
			e.preventDefault();
			mouseDown = false;
    }, false);
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