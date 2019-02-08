var scene;
var camera;
initializeScene();
renderScene();

function initializeScene() {
    if (Detector.webgl) {
        renderer = new THREE.WebGLRenderer({ antialias: true });
    }

    else {
        renderer = new THREE.CanvasRenderer();
    }

    renderer.setClearColor(0x000000, 1);

    canvasWidth = 800;
    canvasHeight = 800;

    renderer.setSize(canvasWidth, canvasHeight);
    document.getElementById("canvas").appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 100);

    camera.position.set(0, 0, 10);
    camera.lookAt(scene.position);
    scene.add(camera);

    // The length between each two vertices in a spoke
    var increments = 0.2;
    var angle = 2 * Math.PI / 360;
    var external_radius = 3.6;
    var num_increments = 8;
    var internal_radius = external_radius - increments * num_increments;

    // Declares the colors for each ring
    var colorArray = [
        new THREE.Color(0xFF0000),
        new THREE.Color(0xFF8000),
        new THREE.Color(0xFFFF00),
        new THREE.Color(0x0000FF),
        new THREE.Color(0x00FF00),
        new THREE.Color(0xCC00CC),
        new THREE.Color(0xFFFF00),
        new THREE.Color(0x0000FF),
        new THREE.Color(0xFF0000)
    ];

    // Creates rings programaticcaly by using the angle as step
    for (var i = 0; i <= 2 * Math.PI / 360 * 360; i += angle) {
        for (var j = 0; j < num_increments; j++) {

            var vertexDownOne = new THREE.Vector3(Math.cos(i) * (internal_radius + j * increments), Math.sin(i) * (internal_radius + j * increments), 0);
            var vertexDownTwo = new THREE.Vector3(Math.cos((i + angle)) * (internal_radius + j * increments), Math.sin(i + angle) * (internal_radius + j * increments), 0);
            var vertexUpOne = new THREE.Vector3(Math.cos(i) * (internal_radius + (j + 1) * increments), Math.sin(i) * (internal_radius + (j + 1) * increments), 0);
            var vertexUpTwo = new THREE.Vector3(Math.cos(i + angle) * (internal_radius + (j + 1) * increments), Math.sin(i + angle) * (internal_radius + (j + 1) * increments), 0);

            // Downwards triangle
            var triangleGeometry = new THREE.Geometry();

            triangleGeometry.vertices.push(vertexDownTwo);
            triangleGeometry.vertices.push(vertexDownOne);
            triangleGeometry.vertices.push(vertexUpOne);
            triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));

            // Color selection
            triangleGeometry.faces[0].vertexColors[0] = colorArray[j];
            triangleGeometry.faces[0].vertexColors[1] = colorArray[j];
            triangleGeometry.faces[0].vertexColors[2] = colorArray[j + 1];

            var triangleMaterial = new THREE.MeshBasicMaterial({
                vertexColors: THREE.VertexColors,
                side: THREE.DoubleSide
            });

            var triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);

            triangleMesh.position.set(0.0, 0.0, 0.0);
            scene.add(triangleMesh);

            // Triangle up geometry
            var triangleGeometryUp = new THREE.Geometry();

            triangleGeometryUp.vertices.push(vertexUpTwo);
            triangleGeometryUp.vertices.push(vertexDownTwo);
            triangleGeometryUp.vertices.push(vertexUpOne);
            triangleGeometryUp.faces.push(new THREE.Face3(0, 1, 2));

            // Change the color
            triangleGeometryUp.faces[0].vertexColors[0] = colorArray[j + 1];
            triangleGeometryUp.faces[0].vertexColors[1] = colorArray[j];
            triangleGeometryUp.faces[0].vertexColors[2] = colorArray[j + 1];

            var triangleMaterial2 = new THREE.MeshBasicMaterial({
                vertexColors: THREE.VertexColors,
                side: THREE.DoubleSide
            });

            var triangleMesh2 = new THREE.Mesh(triangleGeometryUp, triangleMaterial2);

            triangleMesh2.position.set(0.0, 0.0, 0.0);
            scene.add(triangleMesh2);
        }
    }
}

function renderScene() {
    renderer.render(scene, camera);
}
