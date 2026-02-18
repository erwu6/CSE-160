// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'precision mediump float;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_UV;\n' +
  'varying vec2 v_UV;\n' +
  // 'uniform float u_Size;\n' + 
  'uniform mat4 u_ModelMatrix;\n' + 
  'uniform mat4 u_GlobalRotateMatrix;\n' + 
  'uniform mat4 u_ViewMatrix;\n' + 
  'uniform mat4 u_ProjectionMatrix;\n' + 
  'void main() {\n' +
  '  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  // '  gl_PointSize = 10.0;\n' +
  // '  gl_PointSize = u_Size;\n' +
  '  v_UV = a_UV;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec2 v_UV;\n' +
  'uniform vec4 u_FragColor;\n' +  
  'uniform sampler2D u_Sampler0;\n' + 
  'uniform sampler2D u_Sampler1;\n' + 
  'uniform int u_whichTexture;\n' + 
  'void main() {\n' +
  ' if (u_whichTexture == -2) {\n' +
  '   gl_FragColor = u_FragColor;\n' +
  ' } else if (u_whichTexture == -1) {\n' +
  '   gl_FragColor = vec4(v_UV, 1.0, 1.0);\n' +
  ' } else if (u_whichTexture == 0) {\n' +
  '  gl_FragColor = texture2D(u_Sampler0, v_UV);\n' +
  ' } else if (u_whichTexture == 1) {\n' +
  '  gl_FragColor = texture2D(u_Sampler1, v_UV);\n' +
  ' } else {\n' +
  '  gl_FragColor = vec4(1,.2,.2,1);\n' +
  '}\n' + 
  '}\n';

// Global Variables
var stats; 
var canvas;
var gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;

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
  // u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  // if (!u_Size) {
  //   console.log('Failed to get the storage location of u_Size');
  //   return;
  // }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
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

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix){
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix){
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0){
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1){
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (u_whichTexture < 0){
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
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
let g_x = 0;
let g_y = 0;
let g_blink = 90;
let g_click = false;
let blinkHop = false;
let addBlock = false;
let removeBlock = false;
let ani = false;
let rain = false;
let win_x = 0;
let win_y = 0;

function addActionsForHtmlUI(){

  //Button Events (Shape Type)
  // document.getElementById('green').onclick = function(){ g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
  // document.getElementById('red').onclick = function(){ g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
  document.getElementById('startani').onclick = function(){g_yellowAngle = 0; ani = true;};
  document.getElementById('stopani').onclick = function(){ani = false;};

  document.getElementById('reset').onclick = function(){g_yellowAngle = 0;};

  document.getElementById('yellowSlide').addEventListener('input', function() {g_yellowAngle = this.value; renderScene(); } );
  document.getElementById('angleSlide').addEventListener('input', function() {g_globalAngle = this.value; renderScene(); } );
  
  document.getElementById('legSlide').addEventListener('input', function() {g_leg = this.value; renderScene(); } );

  document.getElementById('footSlide').addEventListener('input', function() {g_foot = this.value; renderScene(); } );

  document.getElementById('talonSlide').addEventListener('input', function() {g_talon = this.value; renderScene(); } );

  document.getElementById('addBlock').onclick = function(){addBlock = true; removeBlock = false;};
  document.getElementById('removeBlock').onclick = function(){removeBlock = true; addBlock = false;};

}

function initTextures(){
  // Load first texture
  var image0 = new Image();
  if (!image0){
    console.log('Failed to create the image object');
    return false;
  }
  image0.onload = function(){ sendTextureToTEXTURE0(image0); };
  image0.onerror = function() { console.log('Failed to load image: ' + image0.src); };
  image0.crossOrigin = "anonymous";
  image0.src = "leaves.jpg";

  // Load second texture
  var image1 = new Image();
  if (!image1){
    console.log('Failed to create the image object');
    return false;
  }
  image1.onload = function(){ sendTextureToTEXTURE1(image1); renderScene(); };
  image1.onerror = function() { console.log('Failed to load image: ' + image1.src); };
  image1.crossOrigin = "anonymous";
  image1.src = "floral.jpg";

  return true;
}

function sendTextureToTEXTURE0(image) {
  console.log('sendTextureToTEXTURE0 called with image:', image.width, 'x', image.height);
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);
  
  // gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
  console.log('Texture loaded');
  console.log('Texture loaded successfully');
}

function sendTextureToTEXTURE1(image) {
  console.log('sendTextureToTEXTURE1 called with image:', image.width, 'x', image.height);
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 1 to the sampler
  gl.uniform1i(u_Sampler1, 1);
  
  // gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
  console.log('Texture loaded successfully');
}

function raining(){
  if (g_shapesList.length == 0){
    for (let i=0;i<200;i++){
      g_shapesList.push({x: Math.random()*32-16, y: Math.random()*50, z: Math.random()*32-16});
    }
  }
  for (let i=0;i<200;i++){
    // var x = Math.random()*32-16;
    // var y = Math.random()*50;
    // var z = Math.random()*32-16;

    g_shapesList[i].y -= .5;
    if (g_shapesList[i].y < -16) {g_shapesList[i].y = Math.random()*50;};

    // drop.matrix.scale(0.02, 0.03, 0.02);
    var drop = new Cube();
    drop.color = [0, 0, 1, 1];
    drop.textureNum = -2;
    drop.matrix.translate(g_shapesList[i].x, g_shapesList[i].y, g_shapesList[i].z);
    drop.matrix.scale(0.08, 0.4, 0.08);
    // drop.matrix.translate(Math.random()*32-16, 16, Math.random()*32-16);
    // drop.matrix.translate(Math.random()*32-16, 16, Math.random()*32-16);
    // g_shapesList.push(drop);
    drop.renderFast();
  }
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
      addBlock = true;
    }; g_click = true; g_x = ev.clientX; g_y = ev.clientY; };
  canvas.onmouseup = function() { g_click = false; };
  canvas.onmousemove = function(ev){ 
    if (g_click) { 
      // g_globalAngle -= (ev.clientX - g_x) * 0.1; 
      // if (g_vertAngle < 45 && g_vertAngle > -15) {
      //   g_vertAngle -= (ev.clientY - g_y) * 0.1;
      // } else if (g_vertAngle >= 45){
      //   g_vertAngle = 44
      // } else {
      //   g_vertAngle = -14
      // }; 
      if (ev.clientX < g_x){
        g_camera.panRight(0.1);
      }
      if (ev.clientX > g_x){
        g_camera.panLeft(0.1);
      }
      if (ev.clientY > g_y){
        g_camera.panUp(0.1);
      }
      if (ev.clientY < g_y){
        g_camera.panDown(0.1);
      }
      g_x = ev.clientX; 
      g_y = ev.clientY;
      renderScene();
    }; 
  };

  document.onkeydown = keydown;

  initTextures();

  stats = new Stats();
  stats.dom.style.left = "auto";
  stats.dom.style.right = "0";
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);

  // Specify the color for clearing <canvas>
  gl.clearColor(150/255, 134/255, 166/255, 1.0);

  requestAnimationFrame(tick);
}

function keydown(ev){
  if (ev.keyCode == 39 || ev.key == 'd'){
    g_camera.left(0.1);
  }
  if (ev.keyCode == 37 || ev.key == 'a'){
    g_camera.right(0.1);
  }
  if (ev.keyCode == 38 || ev.key == 'w'){
    g_camera.forward(0.1);
  }
  if (ev.keyCode == 40 || ev.key == 's'){
    g_camera.back(0.1);
  }
  if (ev.keyCode == 81 || ev.key == 'q'){
    g_camera.panLeft(0.5);
  }
  if (ev.keyCode == 69 || ev.key == 'e'){
    g_camera.panRight(0.5);
  }
  if (ev.keyCode == 82 || ev.key == 'r'){
    rain = !rain;
    if (!rain){
      raining();
      rain = false;
    }
  }

  console.log('g_camera:', g_camera);
  console.log(win_x, win_y);

  if ((g_camera.eye.x < win_x + 2) && (g_camera.eye.x > win_x - 2) && (g_camera.eye.z < win_y + 2) && (g_camera.eye.z > win_y - 2)){
    alert("You found the flowers!");
    g_camera.reset();
  }

  renderScene();
  console.log(ev.keyCode);
}

var g_shapesList = [];
// var g_up = [0,1,0];
// var g_eye = [0,0,3];
// var g_at = [0,0,-100];
var g_camera = new Camera();
// console.log('g_camera:', g_camera);

var g_map=[
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,1,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,1,1,0,1,1,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
[1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1],
[1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,1,1,0,0,0,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1],
[1,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,1,0,1],
[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,1,0,1],
[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,1,0,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

g_map[Math.floor(Math.random()*32)][Math.floor(Math.random()*32)] = -5;

function drawMap() {
  for (x=0;x<32;x++){
    for (y=0;y<32;y++){
      if (g_map[x][y] >= 1){
      var map = new Cube();
      map.color = [1,1,1,1];
      map.textureNum = 0;
      // map.matrix.scale(.5, 0.5, .5);
      map.matrix.translate(x-16, -0.75, y-16);
      map.renderFast();
      for (let i=1; i<g_map[x][y]; i++){
        var map = new Cube();
        map.color = [1,1,1,1];
        map.textureNum = 0;
        map.matrix.translate(x-16, -0.75 + i, y-16);
        map.renderFast();
      }
    }
      if (g_map[x][y] <= -5){
        win_x = x-16;
        win_y = y-16;
        var flower = new Cube();
        flower.color = [1,1,1,1];
        flower.textureNum = 1;
        // flower.matrix.scale(.5, 0.5, .5);
        flower.matrix.translate(x-16, -0.75, y-16);
        flower.renderFast();
        for (let i=-5; i>g_map[x][y]; i--){
          var map = new Cube();
          map.color = [1,1,1,1];
          map.textureNum = 1;
          map.matrix.translate(x-16, -0.75 + Math.abs(i)-4, y-16);
          map.renderFast();
        }
      }

      // if (x<1 || x == 31 || y == 0 || y == 31){
      //   var map = new Cube();
      //   map.color = [1,1,1,1];
      //   map.textureNum = 0;
      //   map.matrix.translate(0, -0.75, 0);
      //   map.matrix.scale(.4, 0.4, .4);
      //   map.matrix.translate(x-16, 0, y-16);
      //   map.renderFast();
      // }
    }
  }
}

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
  
  var projMat = new Matrix4();
  projMat.setPerspective(50, canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  viewMat.setLookAt(g_camera.eye.x, g_camera.eye.y, g_camera.eye.z, g_camera.at.x, g_camera.at.y, g_camera.at.z, g_camera.up.x, g_camera.up.y, g_camera.up.z);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0,1,0);
  // var vertialRotMat = new Matrix4().rotate(g_vertAngle, 1, 0, 0);
  // globalRotMat.multiply(vertialRotMat);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // gl.clear(gl.COLOR_BUFFER_BIT);
// Set texture mode to use colors (not texture)
  // gl.uniform1i(u_whichTexture, -1);
  // console.log('u_whichTexture after set:', gl.getUniform(gl.program, u_whichTexture), 'glErr:', gl.getError());
  
  //floor
  var floor = new Cube();
  floor.color = [0,1,0,1];
  floor.textureNum = -2;
  floor.matrix.translate(0, -0.75, 0);
  floor.matrix.scale(35, 0.01, 35);
  floor.matrix.translate(-.5,0,-.5);
  floor.render();

  //sky
  var sky = new Cube();
  sky.color = [125/255, 175/255, 255/255,1];
  sky.textureNum = -2;
  sky.matrix.scale(50,50,50);
  sky.matrix.translate(-.5, -.5, -.5);
  sky.render();

  drawMap();

  hummingbird(0, 0, 0);

  if (rain){
    raining();
  }

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

function addACube(){
  var f = g_camera.at.subtract(g_camera.eye);
  f = f.divide(f.length());

  let locationX = Math.round(g_camera.eye.x + f.x *2) + 16;
  let locationY = Math.round(g_camera.eye.y + f.y);
  let locationZ = Math.round(g_camera.eye.z + f.z *2) + 16;

  if (locationX >= 0 && locationX < 32 && locationZ >= 0 && locationZ < 32) {
    g_map[locationX][locationZ] += 1;
    console.log('Added a cube at:', locationX - 16, locationY, locationZ - 16);
  }
    // renderScene();
}

function removeACube(){
  var f = g_camera.at.subtract(g_camera.eye);
  f = f.divide(f.length());

  let locationX = Math.round(g_camera.eye.x + f.x *2) + 16;
  let locationY = Math.round(g_camera.eye.y + f.y);
  let locationZ = Math.round(g_camera.eye.z + f.z *2) + 16;

  if (locationX >= 0 && locationX < 32 && locationZ >= 0 && locationZ < 32) {
    g_map[locationX][locationZ] -= 1;
    console.log('Removed a cube at:', locationX - 16, locationY, locationZ - 16);
  }
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

  if (addBlock){
    addACube();
    addBlock = false;
  }

  if (removeBlock){
    removeACube();
    removeBlock = false;
  }

  renderScene();
  stats.end();
  requestAnimationFrame(tick);
}