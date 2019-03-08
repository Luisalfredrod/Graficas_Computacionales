////////////////////////////////////////////////////////////////////////////////
/*global THREE, document, window  */
var camera, scene, renderer;
var cameraControls;

var hip = Math.sqrt(42250000);

var clock = new THREE.Clock();
clock.start();

function fillScene() {
	scene = new THREE.Scene();

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

	drawElephant();
}

function drawElephant() {

	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {
		console.log( item, loaded, total );
	};

	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};
	var onError = function ( xhr ) {
	};

  /*
  The code below sets up image textures for the elephant and then imports
  the geometry from .obj files
  */
	var elephantTex = new THREE.Texture();
	var planeTex = new THREE.Texture();

	var loader = new THREE.ImageLoader( manager );
	loader.load( 'elephantColor.jpg', function ( image ) {
		elephantTex.image = image;
		elephantTex.needsUpdate = true;
	} );

	loader = new THREE.OBJLoader( manager );
		loader.load( 'elephantcomplete.obj', function ( object ) {
			object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					child.material.map = elephantTex;
				}
			} );
			object.position.y = 500;
			scene.add( object );
		}, onProgress, onError );

	loader = new THREE.ImageLoader( manager );
	loader.load( 'tex.jpg', function ( image ) {
		planeTex.image = image;
		planeTex.needsUpdate = true;
	} );

	loader = new THREE.OBJLoader( manager );
		loader.load( 'plane.obj', function ( object ) {
			object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					child.material.map = planeTex;
					child.material.shininess = 0;
				}
			} );
			object.position.y = 500;
			scene.add( object );
		}, onProgress, onError );

}

function init() {
	var canvasWidth = 600;
	var canvasHeight = 400;
	var canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0xAAAAAA, 1.0 );

	// CAMERA
	camera = new THREE.PerspectiveCamera( 10, canvasRatio, 1, 18000 );
	camera.position.set( -6500, 3000, 6500);

	// CONTROLS
	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0,480,0);
}

function addToDOM() {
    var canvas = document.getElementById('canvas');
    canvas.appendChild(renderer.domElement);
    console.log(canvas);
}

function animate() {
	window.requestAnimationFrame(animate);
	render();
}

function render() {
	var delta = clock.getElapsedTime();

	/*YOUR CODE GOES HERE
	Using the Pythagoras theorem calculate the camera position for every iteration
	*/
	camera.position.set(Math.sin(delta)*hip,3000,Math.cos(delta)*hip);


	cameraControls.update();
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

