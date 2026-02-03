// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' + 
  'uniform mat4 u_ModelMatrix;\n' + 
  'uniform mat4 u_GlobalRotateMatrix;\n' + 
  'void main() {\n' +
  '  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  // '  gl_PointSize = 10.0;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

// Global Variables
var stats; 
var canvas;
var gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true})
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return; 
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix){
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix){
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
}

function showImage(){
  document.getElementById('drawing').style.visibility = "visible";
}

//Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

//Gloabls related UI elements
let g_selectedColor = [150/255, 134/255, 166/255,1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegments = 10;
let g_hflip = false;
let g_vflip = false;
let g_globalAngle = 0;
let g_yellowAngle = 0;
let g_leg = 0;
let g_foot = 0;
let g_talon = 0;
let g_vertAngle = 0;
let g_x = 0;
let g_y = 0;
let g_blink = 90;
let g_click = false;
let blinkHop = false;
let ani = false;

function addActionsForHtmlUI(){

  //Button Events (Shape Type)
  // document.getElementById('green').onclick = function(){ g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
  // document.getElementById('red').onclick = function(){ g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
  document.getElementById('startani').onclick = function(){g_yellowAngle = 0; ani = true;};
  document.getElementById('stopani').onclick = function(){ani = false;};

  document.getElementById('reset').onclick = function(){g_yellowAngle = 0;};

  document.getElementById('yellowSlide').addEventListener('input', function() {g_yellowAngle = this.value; renderAllShapes(); } );
  document.getElementById('angleSlide').addEventListener('input', function() {g_globalAngle = this.value; renderAllShapes(); } );
  
  document.getElementById('legSlide').addEventListener('input', function() {g_leg = this.value; renderAllShapes(); } );

  document.getElementById('footSlide').addEventListener('input', function() {g_foot = this.value; renderAllShapes(); } );

  document.getElementById('talonSlide').addEventListener('input', function() {g_talon = this.value; renderAllShapes(); } );

  document.getElementById('vertSlide').addEventListener('input', function() {g_vertAngle = this.value; renderAllShapes(); } );

}

function main() {

  setupWebGL();
  connectVariablesToGLSL();

  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  // canvas.onmousedown = click;
  // canvas.onmousemove = click;
  canvas.onmousedown = function(ev) { if (ev.shiftKey && ev.button === 0) {
      blinkHop = true;
    }; g_click = true; g_x = ev.clientX; g_y = ev.clientY; };
  canvas.onmouseup = function() { g_click = false; };
  canvas.onmousemove = function(ev){ if (g_click) { g_globalAngle += (ev.clientX - g_x); g_vertAngle += (ev.clientY - g_y); g_x = ev.clientX; g_y = ev.clientY; renderAllShapes(); }; };

  stats = new Stats();
  stats.dom.style.left = "auto";
  stats.dom.style.right = "0";
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);

  // Specify the color for clearing <canvas>
  gl.clearColor(150/255, 134/255, 166/255, 1.0);

  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);

  // renderAllShapes();
  requestAnimationFrame(tick);
}

var g_shapesList = [];

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];   // The array to store the size of a point

function connectCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x,y]);
}

function renderScene(ev){

  var startTime = performance.now();
  
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0,1,0);
  var vertialRotMat = new Matrix4().rotate(g_vertAngle, 1, 0, 0);
  globalRotMat.multiply(vertialRotMat);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // gl.clear(gl.COLOR_BUFFER_BIT);

  //draw a body
  var body = new Cube();
  body.color = [10/255, 153/255 + g_yellowAngle/900, 136/255 + g_yellowAngle/900,1.0];
  body.matrix.translate(-.25, 0, 0.0);
  body.matrix.rotate(-45, 0, 0, 1);
  body.matrix.scale(0.71, 0.31, 0.31);
  body.render();

  var tail = new TriPrism();
  tail.color = [10/255, 153/255 + g_yellowAngle/900, 136/255 + g_yellowAngle/300,1.0];
  tail.matrix.rotate(-90, 0, 1, 0);
  tail.matrix.rotate(45, 1, 0, 0);
  tail.matrix.translate(0.001, -.5, -.13);
  tail.matrix.rotate(-10 * Math.sin(g_yellowAngle/50), 1, 0, 0);
  tail.matrix.scale(0.3, -0.3, 0.6);
  tail.render();

  var tailFan1 = new TriPrism();
  tailFan1.color = [10/255, 153/255 + g_yellowAngle/600, 136/255 + g_yellowAngle/300,1.0];
  tailFan1.matrix = new Matrix4(tail.matrix);
  tailFan1.matrix.translate(-1*(0.56 - g_yellowAngle/10000), 0.5 - g_yellowAngle/1000, 0.05 - g_yellowAngle/10000);
  tailFan1.matrix.translate(1.15,0,0 + g_yellowAngle/1000);
  tailFan1.matrix.scale(0.4, 0.5 + g_yellowAngle/1000, 0.3);
  tailFan1.matrix.rotate(5, 1, 0, 0);
  tailFan1.matrix.rotate(3, 1, 0, 1);
  tailFan1.matrix.rotate(-10* Math.sin(g_yellowAngle/50), 0, 0, 1);
  tailFan1.render();

  var tailFan2 = new TriPrism();
  tailFan2.color = [10/255, 153/255 + g_yellowAngle/600, 136/255 + g_yellowAngle/300,1.0];
  tailFan2.matrix = new Matrix4(tail.matrix);
  tailFan2.matrix.translate(0.3 - g_yellowAngle/10000, 0.5 - g_yellowAngle/1000, 0.05 - g_yellowAngle/10000);
  tailFan2.matrix.scale(0.5, 0.5 + g_yellowAngle/1000, 0.3);
  tailFan2.matrix.rotate(5, 1, 0, 0);
  tailFan2.matrix.rotate(3, 1, 0, 1);
  tailFan2.render();

  var tailFan3 = new TriPrism();
  tailFan3.color = [10/255, 153/255 + g_yellowAngle/600, 136/255 + g_yellowAngle/300,1.0];
  tailFan3.matrix = new Matrix4(tail.matrix);
  tailFan3.matrix.translate(0.03 - g_yellowAngle/10000, 0.5 - g_yellowAngle/1000, 0.05 - g_yellowAngle/10000);
  tailFan3.matrix.scale(0.4, 0.5 + g_yellowAngle/1000, 0.3);
  tailFan3.matrix.rotate(5, 1, 0, 0);
  tailFan3.matrix.rotate(3, 1, 0, 1);
  tailFan3.matrix.rotate(10 * Math.sin(g_yellowAngle/50), 0, 0, 1);
  tailFan3.render();

  var head = new Cube();
  head.color = [105/255, 153/255 + g_yellowAngle/900, 136/255 + g_yellowAngle/900,1.0]
  head.matrix.translate(-.23, -0.02, .013);
  head.matrix.rotate(30, 0, 0, 1);
  head.matrix.rotate(-5 * (g_blink/90 - 1), 0, 0, 1);
  head.matrix.scale(0.29, 0.29, 0.29);
  head.render();

  var beak = new Cube();
  // 148, 89, 52
  beak.color = [148/255, 89/255, 58/255, 1];
  beak.matrix.translate(-((g_blink/9000) + 0.1), (g_blink/9000) + 0.18, .18);
  beak.matrix.rotate(25, 0, 0, 1);
  beak.matrix.rotate(180, 0, 1, 0);
  beak.matrix.rotate(10 * (g_blink/90 - 1), 0, 0, 1);
  beak.matrix.scale(0.6, 0.05, 0.05);
  beak.render();

  var eyes = new Cube();
  eyes.color = [0.0,0.0,0.0,1.0];
  eyes.matrix.translate(-.25, 0.16, 0);
  eyes.matrix.rotate(10, 0, 0, 1);
  eyes.matrix.scale(0.05, 0.05 * g_blink/90, 0.32);
  eyes.render();

  var bigRightWing = new TriPrism();
  bigRightWing.color = [10/255, 153/255 + g_yellowAngle/100, 136/255 + g_yellowAngle/300,1.0];
  bigRightWing.matrix.rotate(90, 0, 1, 0);
  bigRightWing.matrix.rotate(-60, 1, 0, 0);
  bigRightWing.matrix.translate(-.32, .1, -0.1);
  if (g_yellowAngle != 0 ){
    bigRightWing.matrix.rotate(-60, 0, 0, 1);
    bigRightWing.matrix.rotate(60, 0, 1, 0);
    bigRightWing.color = [10/255, 153/255 + g_yellowAngle/100, 136/255 + g_yellowAngle/300,0.9];
  }
  bigRightWing.matrix.rotate(45 * (2*Math.sin(g_yellowAngle) * Math.cos(g_yellowAngle)), 0, 0, 1);
  bigRightWing.matrix.rotate(70 * (Math.sin(g_yellowAngle)), 1, 0, 0);
  bigRightWing.matrix.scale(0.02, -0.65, 0.5);
  bigRightWing.render();

  var smallRightWing = new TriPrism();
  smallRightWing.color = [10/255, 153/255 + g_yellowAngle/100, 136/255 + g_yellowAngle/300,1.0];
  smallRightWing.matrix = bigRightWing.matrix;
  if (g_yellowAngle != 0){
    smallRightWing.color = [10/255, 153/255 + g_yellowAngle/100, 136/255 + g_yellowAngle/300,0.9];
  }
  smallRightWing.matrix.rotate(-6, 1, 0, 0);
  smallRightWing.matrix.translate(-.8, 0,0);
  smallRightWing.matrix.scale(1, 0.8, 0.9);
  smallRightWing.render();

  var smallerRightWing = new TriPrism();
  smallerRightWing.color = [10/255, 153/255 + g_yellowAngle/100, 136/255 + g_yellowAngle/300,1.0];
  smallerRightWing.matrix = smallRightWing.matrix;
  if (g_yellowAngle != 0){
    smallerRightWing.color = [10/255, 153/255 + g_yellowAngle/100, 136/255 + g_yellowAngle/300,0.9];
  }
  smallerRightWing.matrix.rotate(-6, 1, 0, 0);
  smallerRightWing.matrix.translate(-.8, 0,0);
  smallerRightWing.matrix.scale(1, 0.8, 0.9);
  smallerRightWing.render();

  var bigLefttWing = new TriPrism();
  //115, 153, 136
  bigLefttWing.color = [10/255, 153/255 + g_yellowAngle/100, 136/255 + g_yellowAngle/300,1.0];
  // bigLefttWing.color = [1.0, 1.0, 0.0, 1.0];
  bigLefttWing.matrix.rotate(90, 0, 1, 0);
  bigLefttWing.matrix.rotate(-60, 1, 0, 0);
  bigLefttWing.matrix.translate(0, .1, -0.1);
  if (g_yellowAngle != 0 ){
    bigLefttWing.matrix.rotate(60, 0, 0, 1);
    bigLefttWing.matrix.rotate(-60, 0, 1, 0);
    bigLefttWing.color = [10/255, 153/255 + g_yellowAngle/100, 136/255 + g_yellowAngle/300,0.9];
  }
  bigLefttWing.matrix.rotate(-45 * (2*Math.sin(g_yellowAngle) * Math.cos(g_yellowAngle)), 0, 0, 1);
  bigLefttWing.matrix.rotate(70 * (Math.sin(g_yellowAngle)), 1, 0, 0);
  bigLefttWing.matrix.scale(0.02, -0.65, 0.5);
  bigLefttWing.render();

  var smallLeftWing = new TriPrism();
  smallLeftWing.color = [10/255, 153/255 + g_yellowAngle/100, 136/255 + g_yellowAngle/300,1.0];
  smallLeftWing.matrix = bigLefttWing.matrix;
  if (g_yellowAngle != 0 ){
    smallLeftWing.color = [10/255, 153/255 + g_yellowAngle/100, 136/255 + g_yellowAngle/300,0.9];
  }
  smallLeftWing.matrix.rotate(-6, 1, 0, 0);
  smallLeftWing.matrix.translate(.8, 0, 0);
  smallLeftWing.matrix.scale(1, 0.8, 0.9);
  smallLeftWing.render();

  var smallerLeftWing = new TriPrism();
  smallerLeftWing.color = [10/255, 153/255 + g_yellowAngle/100, 136/255 + g_yellowAngle/300,1.0];
  smallerLeftWing.matrix = smallLeftWing.matrix;
  if (g_yellowAngle != 0 ){
    smallerLeftWing.color = [10/255, 153/255 + g_yellowAngle/100, 136/255 + g_yellowAngle/300,0.8];
  }
  smallerLeftWing.matrix.rotate(-6, 1, 0, 0);
  smallerLeftWing.matrix.translate(.8, 0, 0);
  smallerLeftWing.matrix.scale(1, 0.8, 0.9);
  smallerLeftWing.render();

  var rightLeg = new Cube();
  rightLeg.color = [9/255, 77/255, 23/255, 1];
  rightLeg.matrix.scale(0.03, 0.5, 0.03);
  // rightLeg.matrix.rotate(g_leg, 0, 1,0);
  rightLeg.matrix.rotate(10 * g_leg, 0, 1,0);
  rightLeg.matrix.translate(1.2,- 0.8, 1);
  rightLeg.render();

  var rightFoot = new Cube();
  rightFoot.color = [9/255, 77/255, 23/255, 1];
  rightFoot.matrix = new Matrix4(rightLeg.matrix);
  rightFoot.matrix.rotate(g_foot/2 + g_blink/90, 0, 0,1);
  rightFoot.matrix.translate(0.5, -0.01, 0.001);
  rightFoot.matrix.scale(-2.51,0.0501, 1.001);
  rightFoot.render();

  var rightTalon1 = new Cube();
  // 9, 77, 23
  rightTalon1.color = [0, 0,0, 1];
  rightTalon1.matrix = new Matrix4(rightFoot.matrix);
  // rightTalon1.matrix.rotate(-g_talon, 0, 0,1);
  rightTalon1.matrix.rotate(10 * g_talon, 0, 0,1);
  rightTalon1.matrix.translate(1, 1, 0);
  rightTalon1.matrix.scale(0.5, 0.5, 0.5);
  rightTalon1.render();

  var rightTalon2 = new Cube();
  rightTalon2.color = [0, 0,0, 1];
  rightTalon2.matrix = new Matrix4(rightTalon1.matrix);
  rightTalon2.matrix.translate(0, 0, 1.3);
  // rightTalon1.matrix.rotate(45 * g_talon, 0, 0,1);
  rightTalon2.render();

  var rightTalon3 = new Cube();
  rightTalon3.color = [0, 0,0, 1];
  rightTalon3.matrix = new Matrix4(rightTalon1.matrix);
  rightTalon3.matrix.translate(0, 0, 1.3);
  rightTalon3.render();

  var leftLeg = new Cube();
  leftLeg.color = [9/255, 77/255, 23/255, 1];
  leftLeg.matrix.scale(0.03, 0.5, 0.03);
  leftLeg.matrix.translate(1.2,- 0.8, 1 + 6.5);
  leftLeg.matrix.rotate(10 * g_leg, 0, 1,0);
  leftLeg.render();
  // leftLeg.color = [9/255, 77/255, 23/255, 1];
  // leftLeg.matrix = rightLeg.matrix;
  // // leftLeg.matrix.scale( 1, 1 + g_leg/2,1);
  // leftLeg.matrix.translate(0,0, 6.5);
  // leftLeg.render();

  var leftFoot = new Cube();
  leftFoot.matrix = leftLeg.matrix;
  leftFoot.color = [9/255, 77/255, 23/255, 1];
  leftFoot.matrix.rotate(g_foot/2 + g_blink/90, 0, 0,1);
  leftFoot.matrix.translate(0.5, -0.01, 0.001);
  leftFoot.matrix.scale(-2.51,0.0501, 1.001);
  leftFoot.render();

  var leftTalon1 = new Cube();
  leftTalon1.color = [0,0,0,1];
  leftTalon1.matrix = new Matrix4(leftFoot.matrix);
  leftTalon1.matrix.rotate(10 * g_talon, 0, 0,1);
  leftTalon1.matrix.translate(1, 1, 0);
  leftTalon1.matrix.scale(0.5, 0.5, 0.5);
  leftTalon1.render();

  var leftTalon2 = new Cube();
  leftTalon2.color = [0,0,0,1];
  leftTalon2.matrix = new Matrix4(leftTalon1.matrix);
  leftTalon2.matrix.translate(0, 0, 1.3);
  leftTalon2.render();

  var leftTalon3 = new Cube();
  leftTalon2.color = [0,0,0,1];
  leftTalon3.matrix = new Matrix4(leftTalon1.matrix);
  leftTalon3.matrix.translate(0, 0, 1.3);
  leftTalon3.render();

  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + "  fps: " + Math.floor(10000/duration), "numdot");
}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm) {
    console.log("Failed to get " + htmlID + "from HTML")
    return;
  }
  htmlElm.innerHTML = text;
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;
var up = true;  // Move this outside tick() so it persists between frames

function tick(){
  stats.begin();
  // console.log(performance.now());
  g_seconds = performance.now()/1000.0-g_startTime;

  if (ani) {
    if (up){
      g_yellowAngle += 1;
    }
    if (g_yellowAngle > 90 || up == false) {
      g_yellowAngle -= 1;
      up = false;
    }
    if (g_yellowAngle < 0){
      up = true;
    }
  }
  if (blinkHop){
      g_blink -= 1;
    if (g_blink < 0){
      blinkHop = false;
      g_blink = 90;
    }
  }

  renderScene();
  stats.end();
  requestAnimationFrame(tick);
}