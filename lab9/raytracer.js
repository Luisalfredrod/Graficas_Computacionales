"use strict";

//CORE VARIABLES
var canvas, context, imageBuffer;

var DEBUG = false; //whether to show debug messages
var EPSILON = 0.00001; //error margins

//scene to render
var scene, camera, surfaces; //etc...

//initializes the canvas and drawing buffers
function init() {
  canvas = $('#canvas')[0];
  context = canvas.getContext("2d");
  imageBuffer = context.createImageData(canvas.width, canvas.height); //buffer for pixels

  loadSceneFile("assets/SphereTest.json");
}
//------------------------------------Class Camera------------------------------

class Camera {
  constructor(fovy, aspect, eye, at, up) {
      // Assign FOV and Aspect-ratio
      this.fovy = fovy;
      this.aspect = aspect;

      // Assign simple values to eye, looking at, and upwards vectors
      this.eye = new THREE.Vector3(eye[0], eye[1], eye[2]);
      this.at = new THREE.Vector3(at[0], at[1], at[2]);
      this.up = new THREE.Vector3(up[0], up[1], up[2]);

      // Instantiate backwards, upwards, and rightwards vectors originating
      // from the camera
      this.back = new THREE.Vector3().subVectors(this.eye, this.at).normalize();
      this.right = new THREE.Vector3().crossVectors(this.up, this.back).normalize();
      this.upward = new THREE.Vector3().crossVectors(this.back, this.right).normalize();

      // Calculates viewing volume (how many pixels rendered) as a product 
      // of FOV and and aspect ratio
      this.height = 2 * Math.tan(rad(this.fovy / 2.0));
      this.width = this.height * this.aspect;

      // Calculates pixel size in 3-dimensional space for ray intersection
      this.pxHeight = this.height / (canvas.height - 1);
      this.pxWidth = this.width / (canvas.width - 1);
  }


  castRay(x, y) {
      var fu = (this.width * x) / (canvas.width - 1);
      var fv = (-this.height * y) / (canvas.height - 1);
      var u = fu - (this.width / 2.0);
      var v = fv + (this.height / 2.0);

      // Rightwards pixel component
      var ur = this.right.clone();
      var uRight = ur.multiplyScalar(u);

      // Upwards pixel component
      var vu = this.upward.clone();
      var vUpward = vu.multiplyScalar(v);


      //Combination
      var vCompound = new THREE.Vector3().addVectors(uRight, vUpward);

      // Calculates facing direction for the eye
      var direc = this.back.clone().multiplyScalar(-1);
      var direction = new THREE.Vector3().addVectors(vCompound, direc);

      
      var ray = {
          "eye": this.eye, // origin of vector
          "direction": direction // direction the vector is facing
      };

      return ray;
  }
}
//------------------------------------------------------------------------------
//-----------------------------------CLASS SPHERE-------------------------------

class Sphere {
  constructor(name, shape, center, radius, material, transforms) {
      this.name = name;
      this.shape = shape;
      this.center = new THREE.Vector3(center[0], center[1], center[2]);
      this.radius = radius;
      this.material = new Material(material);
      this.transforms = transforms;
  }
  intersects(rayVector) {
      var radius = this.radius;
      var eye = new THREE.Vector3().subVectors(this.center, rayVector.eye);
      var dirdot = eye.clone();
      var direction = rayVector.direction.normalize();
      var b = dirdot.dot(direction);
      var radpow = Math.pow(radius, 2);
      var eyepow = Math.pow(eye.length(), 2);
      var bpow =  Math.pow(b, 2);
      var discriminant = radpow - eyepow + bpow;
      var f = Math.sqrt(discriminant);
      var t = b + f;
      var clonedir = direction.clone();
      var result = clonedir.multiplyScalar(t);
      return (discriminant > 0 ? rayVector.eye.clone().add(result) : null);
  }

  lightIntersects(ray, intersect) {
      var center = this.center;
      var intersection = intersect;
      var light = ray.clone().normalize();
      var radius = this.radius;

    //---------------
      var lightclone = light.clone();
      var interclone = intersection.clone();

    //---------------

      var a = lightclone.dot(light);
      var b_1 = lightclone.multiplyScalar(2);
      var b_2 = interclone.sub(center);
      var c_1 = interclone.sub(center);
      var c_2 = c_1.clone().dot(c_1);
      var b = b_1.dot(b_2);
      var c = c_2 - Math.pow(radius,2);

      if (((b * b) - 4 * (a * c)) > 0) {
          var t = (-b + Math.sqrt(b * b - 4 * a * c)) / 2 * a;
          var res = interclone.add(lightclone.multiplyScalar(t));
          return res;
      }

      else {
          return null;
      }
  }
  normal(intersection) {
      return new THREE.Vector3().subVectors(intersection, this.center).normalize();
  }
}

//------------------------------------------------------------------------------


//loads and "parses" the scene file at the given path
function loadSceneFile(filepath) {
  scene = Utils.loadJSON(filepath); //load the scene

  //TODO - set up camera
  camera = new Camera(scene.camera.fovy, scene.camera.aspect, scene.camera.eye, scene.camera.at, scene.camera.up)

  //TODO - set up surfaces
  surfaces = [];

  // Iterate over each surface in the surfaces array
  for (let i = 0; i < scene.surfaces.length; i++) {
      var transformed = new THREE.Matrix4();
      var surface = scene.surfaces[i];

      // If the surface has transformations precompute them and add them to the shape
      if (surface.hasOwnProperty("transforms")) {
          surface.transforms.forEach(function (tr) {
              if (tr[0] == "Translate") {
                  transformed.multiply(new THREE.Matrix4().makeTranslation(tr[1][0], tr[1][1], tr[1][2]));
              }

              if (tr[0] == "Rotate") {
                  var thetaX = toRadian(tr[1][0]);
                  var thetaY = toRadian(tr[1][1]);
                  var thetaZ = toRadian(tr[1][2]);

                  transformed.multiply(new THREE.Matrix4().makeRotationZ(thetaZ));
                  transformed.multiply(new THREE.Matrix4().makeRotationY(thetaY));
                  transformed.multiply(new THREE.Matrix4().makeRotationX(thetaX));
              }

              if (tr[0] == "Scale") {
                  transformed.multiply(new THREE.Matrix4().makeScale(tr[1][0], tr[1][1], tr[1][2]));
              }


          });
      }

      // If its shape is a sphere, add a new sphere
      if (surface.shape == "Sphere") {
          if (!surface.hasOwnProperty("transforms")) {
              transformed = null;
          }
          surfaces.push(new Sphere(
              surface.name,
              surface.shape,
              surface.center,
              surface.radius,
              scene.materials[surface.material],
              transformed
          ));
      }

  }
  render(); //render the scene
}
//renders the scene
function render() {
  var start = Date.now(); //for logging
  var rowlimit = camera.height / camera.pxHeight;
  var collimit = camera.width / camera.pxWidth

  //TODO - fire a ray though each pixel

  for (let row = 0; row < rowlimit; row++) {
    for (let col = 0; col < collimit; col++) {
        setPixel(row, col, tracingRay(camera.castRay(row, col)));
    }
}

  //TODO - calculate the intersection of that ray with the scene

  //TODO - set the pixel to be the color of that intersection (using setPixel() method)

  //render the pixels that have been set
  context.putImageData(imageBuffer,0,0);

  var end = Date.now(); //for logging
  $('#log').html("rendered in: "+(end-start)+"ms");
  console.log("rendered in: "+(end-start)+"ms");
}

//----------------------------------Tracing Ray---------------------------------
// Contribution with Other Students

function tracingRay(rayVector) {
  var maxDistance = Number.MAX_SAFE_INTEGER;
  var intersection,vector;


  for (let i = 0; i < surfaces.length; i++) {
      var surface = surfaces[i];
      if (surface.transforms != null) {
          var transformInverse = new THREE.Matrix4().getInverse(surface.transforms);
          var transDir = new THREE.Vector4(rayVector.direction.x, rayVector.direction.y, rayVector.direction.z,0);
          var transformedDirection = transDir.applyMatrix4(transformInverse);
          var transOrg = new THREE.Vector4(rayVector.eye.x,rayVector.eye.y,rayVector.eye.z,1);
          var transformedOrigin = transOrg.applyMatrix4(transformInverse);

          var transformedRay = {
              "eye": transformedOrigin,           // origin of vector
              "direction": transformedDirection   // direction the vector is facing
          };

          intersection = surface.intersects(transformedRay);
      }else {
          intersection = surface.intersects(rayVector);
      }

      
      if (intersection != null) {

          if (surface.transforms != null) {
              vector = new THREE.Vector3().subVectors(intersection, transformedRay.eye);
          }else {
              vector = new THREE.Vector3().subVectors(intersection, rayVector.eye);
          }

          if(vector != null){
            if (vector.length() < maxDistance) {
              maxDistance = vector.length();
              closest = intersection;
              lastSurface = surface;
            }
          }else{
            console.log("Vector is NULL!!!");
          }
      }
  }


}

//------------------------------------------------------------------------------

//sets the pixel at the given x,y to the given color
/**
 * Sets the pixel at the given screen coordinates to the given color
 * @param {int} x     The x-coordinate of the pixel
 * @param {int} y     The y-coordinate of the pixel
 * @param {float[3]} color A length-3 array (or a vec3) representing the color. Color values should floating point values between 0 and 1
 */
function setPixel(x, y, color){
  var i = (y*imageBuffer.width + x)*4;
  imageBuffer.data[i] = (color[0]*255) | 0;
  imageBuffer.data[i+1] = (color[1]*255) | 0;
  imageBuffer.data[i+2] = (color[2]*255) | 0;
  imageBuffer.data[i+3] = 255; //(color[3]*255) | 0; //switch to include transparency
}

//converts degrees to radians
function rad(degrees){
  return degrees*Math.PI/180;
}

//on document load, run the application
$(document).ready(function(){
  init();
  render();

  //load and render new scene
  $('#load_scene_button').click(function(){
    var filepath = 'assets/'+$('#scene_file_input').val()+'.json';
    loadSceneFile(filepath);
  });

  //debugging - cast a ray through the clicked pixel with DEBUG messaging on
  $('#canvas').click(function(e){
    var x = e.pageX - $('#canvas').offset().left;
    var y = e.pageY - $('#canvas').offset().top;
    DEBUG = true;
    camera.castRay(x,y); //cast a ray through the point
    DEBUG = false;
  });
});
