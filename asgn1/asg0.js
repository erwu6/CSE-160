// DrawTriangle.js (c) 2012 matsuda
let ctx;

function main() {  
  // Retrieve <canvas> element
  var canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  ctx = canvas.getContext('2d');

  // Draw a black rectangle
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to black
  ctx.fillRect(0, 0, 400, 400);        // Fill a rectangle with the color

  let v1 = new Vector3([2.25, 2.25,0]);
  drawVector(v1, "red");
}

function angleBetween(v1, v2){
  let d = Vector3.dot(v1,v2);
  d /= v1.magnitude();
  d /= v2.magnitude();

  return Math.acos(d) * 180 / Math.PI;
}

function areaTriangle(v1, v2){
  let a = Vector3.cross(v1,v2);
  let areaOfparallelogram = a.magnitude();

  return areaOfparallelogram / 2;
}

function drawVector(v, color){
  let cx = 400/2;
  let cy = 400/2;

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + v.elements[0] * 20, cy - v.elements[1] * 20);
  ctx.strokeStyle = color;
  ctx.stroke();
}

function handleDrawEvent(){
  ctx.fillRect(0, 0, 400, 400);  //clear the canvas

  let v1x = document.getElementById("v1FirstPoint").value;
  let v1y = document.getElementById("v1SecondPoint").value;

  let v1 = new Vector3([v1x, v1y, 0]);
  drawVector(v1, "red")

  let v2x = document.getElementById("v2FirstPoint").value;
  let v2y = document.getElementById("v2SecondPoint").value;
  
  let v2 = new Vector3([v2x, v2y, 0]);
  drawVector(v2, "blue")
}

function handleDrawOperationEvent(){
  ctx.fillRect(0, 0, 400, 400);  //clear the canvas

  let v1x = document.getElementById("v1FirstPoint").value;
  let v1y = document.getElementById("v1SecondPoint").value;

  let v1 = new Vector3([v1x, v1y, 0]);
  drawVector(v1, "red")

  let v2x = document.getElementById("v2FirstPoint").value;
  let v2y = document.getElementById("v2SecondPoint").value;
  
  let v2 = new Vector3([v2x, v2y, 0]);
  drawVector(v2, "blue")

  // Read the value of the selector and call the respective Vector3 function.
  let v3 = new Vector3(); 
  let v4 = new Vector3(); 
  let operation = document.getElementById("operation").value;
  let scalar = document.getElementById("scale").value;
  if (operation == "add"){
    v3.set(v1).add(v2);
    drawVector(v3, "green");
  }
  else if (operation == "subtract"){
    v3.set(v1).sub(v2);
    drawVector(v3, "green");
  }
  else if (operation == "multiply"){
    v3.set(v1).mul(scalar);
    v4.set(v2).mul(scalar);
    drawVector(v3, "green");
    drawVector(v4, "green");
  }
  else if (operation == "divide"){
    v3.set(v1).div(scalar);
    v4.set(v2).div(scalar);
    drawVector(v3, "green");
    drawVector(v4, "green");
  }
  else if (operation == "magnitude"){
    console.log(`Magnitude V1: ` + v1.magnitude() )
    console.log(`Magnitude V2: ` + v2.magnitude() )
  }
  else if (operation == "normalize"){
    drawVector(v1.normalize(), "green");
    drawVector(v2.normalize(), "green");
  }
  else if (operation == "dot"){
    console.log(`Angle Between: ` + angleBetween(v1,v2) )
  }
  else if (operation == "area"){
    console.log(`Area of the Triangle: ` + areaTriangle(v1,v2) )
  }
}