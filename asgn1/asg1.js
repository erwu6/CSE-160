// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +  
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
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
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

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
}

function showImage(){
  document.getElementById('drawing').style.visibility = "visible";
}

function renderDrawing() {
  g_shapesList = [];

  let face = new Point();
  face.position = [0.0, 0.0];
  face.color = [1.0, 1.0, 0.0, 1.0];
  face.size = 100;
  g_shapesList.push(face);

  let eye = new Triangle();
  eye.position = [-0.1, -15/200];
  eye.color = [0.0, 0.0, 0.0, 1.0];
  eye.size = 33;
  g_shapesList.push(eye);

  let beak1 = new Triangle();
  beak1.position = [-50/200, -15/200, 1];
  beak1.color = [1.0, 0.5, 0.0, 1.0];
  beak1.size = 33;
  beak1.hflip = true;
  g_shapesList.push(beak1);

  let beak2 = new Triangle();
  beak2.position = [-50/200, -15/200, 0.5];
  beak2.color = [1.0, 0.5, 0.0, 1.0];
  beak2.size = 33;
  beak2.hflip = true;
  beak2.vflip = true;
  g_shapesList.push(beak2);

  let body = new Point();
  body.position = [0.15, -100/200];
  body.color = [1.0, 1.0, 0.0, 1.0];
  body.size = 100;
  g_shapesList.push(body);

  let wing = new Triangle();
  wing.position = [0.40, -50/200];
  wing.color = [1.0, 1.0, 0.0, 1.0];
  wing.size = 100;
  wing.vflip = true;
  g_shapesList.push(wing);

  let frontbody1 = new Triangle();
  frontbody1.position = [-0.1, -83/200]
  frontbody1.color = [1.0, 1.0, 0.0, 1.0];
  frontbody1.size = 33;
  frontbody1.hflip = true;
  g_shapesList.push(frontbody1);

  let frontbody2 = new Triangle();
  frontbody2.position = [-0.1, -118/200];
  frontbody2.color = [1.0, 1.0, 0.0, 1.0];
  frontbody2.size = 33;
  frontbody2.hflip = true;
  frontbody2.vflip = true;
  g_shapesList.push(frontbody2);

  let frontbody3 = new Point();
  frontbody3.position = [-35/200, -100/200];
  frontbody3.color = [1.0, 1.0, 0.0, 1.0];
  frontbody3.size = 36;
  g_shapesList.push(frontbody3);

  let leftFoot = new Triangle();
  leftFoot.position = [15/200, -184/200];
  leftFoot.color = [1.0, 0.5, 0.0, 1.0];
  leftFoot.size = 33;
  leftFoot.hflip = true;
  g_shapesList.push(leftFoot);

  let rightFoot = new Triangle();
  rightFoot.position = [45/200, -184/200];
  rightFoot.color = [1.0, 0.5, 0.0, 1.0];
  rightFoot.size = 33;
  rightFoot.hflip = true;
  g_shapesList.push(rightFoot);

  let flowerStem1 = new Triangle();
  flowerStem1.position = [-125/200, -184/200];
  flowerStem1.color = [0.0, 1.0, 0.0, 1.0];
  flowerStem1.size = 50;
  g_shapesList.push(flowerStem1);

  let flowerStem2 = new Triangle();
  flowerStem2.position = [-125/200, -184/200];
  flowerStem2.color = [0.0, 1.0, 0.0, 1.0];
  flowerStem2.size = 50;
  flowerStem2.hflip = true;
  g_shapesList.push(flowerStem2);

  let flowerPetal1 = new Point();
  flowerPetal1.position = [-125/200, -130/200];
  flowerPetal1.color = [1.0, 0.0, 0.5, 1.0];
  flowerPetal1.size = 30;
  g_shapesList.push(flowerPetal1);

  let flowerPetal2 = new Point();
  flowerPetal2.position = [-125/200, -70/200];
  flowerPetal2.color = [1.0, 0.0, 0.5, 1.0];
  flowerPetal2.size = 30;
  g_shapesList.push(flowerPetal2);

  let flowerPetal3 = new Point();
  flowerPetal3.position = [-95/200, -100/200];
  flowerPetal3.color = [1.0, 0.0, 0.5, 1.0];
  flowerPetal3.size = 30;
  g_shapesList.push(flowerPetal3);

  let flowerPetal4 = new Point();
  flowerPetal4.position = [-155/200, -100/200];
  flowerPetal4.color = [1.0, 0.0, 0.5, 1.0];
  flowerPetal4.size = 30;
  g_shapesList.push(flowerPetal4);

  let flowerDiagPetal = new Triangle();
  flowerDiagPetal.position = [-140/200, -85/200];
  flowerDiagPetal.color = [0.8, 0.2, 0.5, 1.0];
  flowerDiagPetal.size = 30;
  flowerDiagPetal.hflip = true;
  g_shapesList.push(flowerDiagPetal);

  let flowerDiagPetal2 = new Triangle();
  flowerDiagPetal2.position = [-110/200, -85/200];
  flowerDiagPetal2.color = [0.8, 0.2, 0.5, 1.0];
  flowerDiagPetal2.size = 30;
  g_shapesList.push(flowerDiagPetal2);

  let flowerDiagPetal3 = new Triangle();
  flowerDiagPetal3.position = [-110/200, -115/200];
  flowerDiagPetal3.color = [0.8, 0.2, 0.5, 1.0];
  flowerDiagPetal3.size = 30;
  flowerDiagPetal3.vflip = true;
  g_shapesList.push(flowerDiagPetal3);

  let flowerDiagPetal4 = new Triangle();
  flowerDiagPetal4.position = [-140/200, -115/200];
  flowerDiagPetal4.color = [0.8, 0.2, 0.5, 1.0];
  flowerDiagPetal4.size = 30;
  flowerDiagPetal4.vflip = true;
  flowerDiagPetal4.hflip = true;
  g_shapesList.push(flowerDiagPetal4);

  let flowerCenter = new Point();
  flowerCenter.position = [-125/200, -100/200];
  flowerCenter.color = [1.0, 0.5, 1.0, 1.0];
  flowerCenter.size = 30;
  g_shapesList.push(flowerCenter);

  let topEggshell = new Triangle();
  topEggshell.position = [50/200, 50/200];
  topEggshell.color = [0.9, 1.0, 1.0, 1.0];
  topEggshell.size = 33;
  topEggshell.hflip = true;
  topEggshell.vflip = true;
  g_shapesList.push(topEggshell);

  let topEggshell2 = new Triangle();
  topEggshell2.position = [17/200, 50/200];
  topEggshell2.color = [0.9, 1.0, 1.0, 1.0];
  topEggshell2.enterPoints = true;
  topEggshell2.points = [-15/200, 50/200, 17/200, 20/200, 17/200, 70/200];
  g_shapesList.push(topEggshell2);

  let topEggshell3 = new Triangle();
  topEggshell3.position = [50/200, -15/200];
  topEggshell3.color = [0.9, 1.0, 1.0, 1.0];
  topEggshell3.vflip = true;
  topEggshell3.size = 20;
  g_shapesList.push(topEggshell3);

  let topEggshell4 = new Triangle();
  topEggshell4.position = [17/200, 50/200];
  topEggshell4.color = [0.9, 1.0, 1.0, 1.0];
  topEggshell4.enterPoints = true;
  topEggshell4.points = [50/200, 50/200, 17/200, 50/200, 17/200, 70/200];
  g_shapesList.push(topEggshell4);

  let topEggshell5 = new Triangle();
  topEggshell5.color = [0.9, 1.0, 1.0, 1.0];
  topEggshell5.enterPoints = true;
  topEggshell5.points = [50/200, 50/200, 30/200, 0/200, 70/200, -15/200];
  g_shapesList.push(topEggshell5);

  let bottomShell = new Triangle();
  bottomShell.position = [180/200, -50/200];
  bottomShell.color = [0.9, 1.0, 1.0, 1.0];
  bottomShell.size = 60;
  bottomShell.hflip = true;
  g_shapesList.push(bottomShell);

  let bottomShell1 = new Triangle();
  bottomShell1.position = [120/200, -50/200];
  bottomShell1.color = [0.9, 1.0, 1.0, 1.0];
  bottomShell1.size = 30;
  g_shapesList.push(bottomShell1);

  let bottomShell2 = new Triangle();
  bottomShell2.position = [120/200, -50/200];
  bottomShell2.color = [0.9, 1.0, 1.0, 1.0];
  bottomShell2.enterPoints = true;
  bottomShell2.points = [120/200, -50/200, 150/200, -10/200, 150/200, -50/200];
  g_shapesList.push(bottomShell2);

  let wingE = new Triangle();
  wingE.position = [-20/200, -80/200];
  wingE.color = [1.0, 0.5, 0.0, 1.0];
  wingE.points = [-18/200, -80/200, -20/200, -100/200, 10/200, -80/200];
  wingE.enterPoints = true;
  g_shapesList.push(wingE);

  let wingE2 = new Triangle();
  wingE2.position = [-20/200, -95/200];
  wingE2.color = [1.0, 0.5, 0.0, 1.0];
  wingE2.size = 30;
  wingE2.points = [-20/200, -95/200, -20/200, -105/200, 10/200, -100/200];
  wingE2.enterPoints = true;
  g_shapesList.push(wingE2);

  let wingE3 = new Triangle();
  wingE3.position = [-20/200, -125/200];
  wingE3.color = [1.0, 0.5, 0.0, 1.0];
  wingE3.points = [-20/200, -100/200, -18/200, -115/200, 10/200, -115/200];
  wingE3.enterPoints = true;
  g_shapesList.push(wingE3);

  let wingW = new Triangle();
  wingW.position = [-20/200, -125/200];
  wingW.color = [1.0, 0.5, 0.0, 1.0];
  wingW.points = [20/200, -80/200, 20/200, -115/200, 15/200, -80/200];
  wingW.enterPoints = true;
  g_shapesList.push(wingW);

  let wingW2 = new Triangle();
  wingW2.position = [-20/200, -95/200];
  wingW2.color = [1.0, 0.5, 0.0, 1.0];
  wingW2.points = [20/200, -115/200, 30/200, -80/200, 40/200, -115/200];
  wingW2.enterPoints = true;
  g_shapesList.push(wingW2);

  let wingW3 = new Triangle();
  wingW3.position = [-20/200, -95/200];
  wingW3.color = [1.0, 0.5, 0.0, 1.0];
  wingW3.points = [40/200, -115/200, 40/200, -80/200, 125/200, -75/200];
  wingW3.enterPoints = true;
  g_shapesList.push(wingW3);
}


//Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

//Gloabls related UI elements
let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegments = 10;
let g_hflip = false;
let g_vflip = false;

function addActionsForHtmlUI(){

  //Button Events (Shape Type)
  // document.getElementById('green').onclick = function(){ g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
  // document.getElementById('red').onclick = function(){ g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
  document.getElementById('clearButton').onclick = function(){
    g_shapesList = [];
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    renderAllShapes();
    sendTextToHTML("Welcome to my Assignment 1 work! Check out the bottom buttons and click the space bar or enter key for mini easter eggs!", "description");

  };

  document.getElementById('pointButton').onclick = function(){g_selectedType=POINT};
  document.getElementById('triButton').onclick = function(){g_selectedType=TRIANGLE;};
  document.getElementById('circleButton').onclick = function(){g_selectedType=CIRCLE;};

  document.getElementById('hflipTriButton').onclick = function(){g_hflip=!g_hflip;};
  document.getElementById('vflipTriButton').onclick = function(){g_vflip=!g_vflip;};

  document.getElementById('drawButton').onclick = function(){
    showImage();
    renderDrawing();
    renderAllShapes();
  };

  //Slider Events 
  document.getElementById('redSlide').addEventListener('input', function() {g_selectedColor[0] = this.value/100; } );
  document.getElementById('greenSlide').addEventListener('input', function() {g_selectedColor[1] = this.value/100; } );
  document.getElementById('blueSlide').addEventListener('input', function() {g_selectedColor[2] = this.value/100; } );

  document.getElementById('sizeSlide').addEventListener('input', function() {g_selectedSize = this.value; } );
  document.getElementById('segmentSlide').addEventListener('input', function() {g_selectedSegments = this.value; } );
}

function spacePressed(){
  gl.clearColor(Math.random(), Math.random(), Math.random(), 1.0);
  renderAllShapes();
}

function returnPressed(){
  // gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // renderAllShapes();
  sendTextToHTML("You have entered my mini game! You are the white dot and you get to eat all the red apples you want! Watch out, if you eat too many the game will finish. \n Clear the canvas to get back to the drawings.", "description");
  eatPixels();
}

function eatPixels(){
  g_shapesList = [];
  gl.clearColor(74/255, 193/255, 94/255, 1.0);
  
  var snake = new Point();
  snake.position = [-.9, .9];
  snake.color = [1, 1, 1, 1.0];
  snake.size = 25;
  g_shapesList.push(snake);

  var apple = new Point();
  apple.position = [Math.random()*2-1, Math.random()*2-1];
  apple.color = [1, 0, 0, 1.0];
  apple.size = 25;
  g_shapesList.push(apple);

  // var poisionApple = new Point();
  // poisionApple.position = [Math.random()*2-1, Math.random()*2-1];
  // poisionApple.color = [0, 0, 0, 1.0];
  // poisionApple.size = 25;

  renderAllShapes();

  document.addEventListener("keydown", function(event) {
    if (event.key === 'w' || event.key === 'ArrowUp') {
      snake.position = [snake.position[0], snake.position[1]+10/200];
    }; 
    if (event.key === 'a' || event.key === 'ArrowLeft') {
      snake.position = [snake.position[0]-10/200, snake.position[1]];
    }; 
    if (event.key === 's' || event.key === 'ArrowDown') {
      snake.position = [snake.position[0], snake.position[1]-10/200];

    }; 
    if (event.key === 'd' || event.key === 'ArrowRight') {
      snake.position = [snake.position[0]+10/200, snake.position[1]];
    }; 
    if ((snake.position[0] < apple.position[0] + 0.1 && snake.position[0] > apple.position[0] - 0.1) && (snake.position[1] < apple.position[1] + 0.1 && snake.position[1] > apple.position[1] - 0.1)){
      if (apple.size == 50) {
        snake.size += 20;
      }
      else {
        snake.size += 10;
      }
      apple.position = [Math.random()*2-1, Math.random()*2-1];
      g_shapesList.push(apple);
    }
    // if ((snake.position[0] < poisionApple.position[0] + 0.1 && snake.position[0] > poisionApple.position[0] - 0.1) && (snake.position[1] < poisionApple.position[1] + 0.1 && snake.position[1] > poisionApple.position[1] - 0.1)){
    //   alert("Game Over! If you would like to play again, please refresh the page.");
    //   return;
    // }
    if (snake.size % 50 == 0) {
      apple.size *= 5;
      // g_shapesList.push(poisionApple);
    }
    if (snake.position[0] > 1 || snake.position[0] < -1 || snake.position[1] > 1 || snake.position[1] < -1){
      snake.position = [-.9, .9];
      alert("Out of Bounds! If you would like to play again, please refresh the page.");
      return;
    }
    if (snake.size >= 400) {
      snake.size = 25;
      alert("You made it to the end! If you would like to play again, please refresh the page.");
      return;
    }
    renderAllShapes();
  })
  }
  

function main() {

  setupWebGL();
  connectVariablesToGLSL();

  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  // canvas.onmousemove = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) {click(ev)} };

  document.addEventListener("keydown", function(event) {
    if (event.key === ' ') {
      spacePressed();
    }; 
    if (event.key === 'Enter') {
      returnPressed();
    };
    if (event.key === 'Enter') {
      returnPressed();
    };
  });

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];   // The array to store the size of a point

function click(ev) {

  let [x,y] = connectCoordinatesEventToGL(ev);

  let point;
  if (g_selectedType==POINT) {
    point = new Point();
  }
  else if (g_selectedType==TRIANGLE) {
    point = new Triangle();
    point.hflip = g_hflip;
    point.vflip = g_vflip;
  }
  else {
    point = new Circle();
    point.segments = g_selectedSegments;
  }
  point.position = [x, y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);
  
  // Store the coordinates to g_points array
  // g_points.push([x, y]);

  // g_colors.push(g_selectedColor.slice());

  // g_sizes.push(g_selectedSize);

  // Store the coordinates to g_points array
  // if (x >= 0.0 && y >= 0.0) {      // First quadrant
  //   g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  // } else if (x < 0.0 && y < 0.0) { // Third quadrant
  //   g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  // } else {                         // Others
  //   g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  // }

  renderAllShapes();

}

function connectCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x,y]);
}

function renderAllShapes(ev){

  var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // var len = g_points.length;
  var len = g_shapesList.length;

  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + "  fps: " + Math.floor(10000/duration), "numdot");
}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm) {
    console.log("Failed to get " + htmlID + "from HTML")
    return;
  }
  htmlElm.innerHTML = text;
}
