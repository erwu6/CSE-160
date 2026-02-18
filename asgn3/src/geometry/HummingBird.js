function hummingbird(offsetX = 0, offsetY = 0, offsetZ = 0){

//draw a body
  var body = new Cube();
  body.color = [10/255, 153/255 + g_yellowAngle/900, 136/255 + g_yellowAngle/900,1.0];
  body.matrix.translate(offsetX - 0.25, offsetY, offsetZ);
  body.textureNum = -2;
  body.matrix.rotate(-45, 0, 0, 1);
  body.matrix.scale(0.71, 0.31, 0.31);
  body.render();

  var tail = new TriPrism();
  tail.color = [10/255, 153/255 + g_yellowAngle/900, 136/255 + g_yellowAngle/300,1.0];
  tail.textureNum = -2;
  tail.matrix.translate(offsetX, offsetY, offsetZ);
  tail.matrix.rotate(-90, 0, 1, 0);
  tail.matrix.rotate(45, 1, 0, 0);
  tail.matrix.translate(0.001, -.5, -.13);
  tail.matrix.rotate(-10 * Math.sin(g_yellowAngle/50), 1, 0, 0);
  tail.matrix.scale(0.3, -0.3, 0.6);
  tail.render();

  var tailFan1 = new TriPrism();
  tailFan1.color = [10/255, 153/255 + g_yellowAngle/600, 136/255 + g_yellowAngle/300,1.0];
  tailFan1.textureNum = -2;
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
  tailFan2.textureNum = -2;
  tailFan2.matrix = new Matrix4(tail.matrix);
  tailFan2.matrix.translate(0.3 - g_yellowAngle/10000, 0.5 - g_yellowAngle/1000, 0.05 - g_yellowAngle/10000);
  tailFan2.matrix.scale(0.5, 0.5 + g_yellowAngle/1000, 0.3);
  tailFan2.matrix.rotate(5, 1, 0, 0);
  tailFan2.matrix.rotate(3, 1, 0, 1);
  tailFan2.render();

  var tailFan3 = new TriPrism();
  tailFan3.color = [10/255, 153/255 + g_yellowAngle/600, 136/255 + g_yellowAngle/300,1.0];
  tailFan3.textureNum = -2;
  tailFan3.matrix = new Matrix4(tail.matrix);
  tailFan3.matrix.translate(0.03 - g_yellowAngle/10000, 0.5 - g_yellowAngle/1000, 0.05 - g_yellowAngle/10000);
  tailFan3.matrix.scale(0.4, 0.5 + g_yellowAngle/1000, 0.3);
  tailFan3.matrix.rotate(5, 1, 0, 0);
  tailFan3.matrix.rotate(3, 1, 0, 1);
  tailFan3.matrix.rotate(10 * Math.sin(g_yellowAngle/50), 0, 0, 1);
  tailFan3.render();

  var head = new Cube();
  head.color = [105/255, 153/255 + g_yellowAngle/900, 136/255 + g_yellowAngle/900,1.0]
  head.matrix.translate(offsetX - 0.23, offsetY - 0.02, offsetZ + 0.013);
  head.textureNum = -2;
  head.matrix.rotate(30, 0, 0, 1);
  head.matrix.rotate(-5 * (g_blink/90 - 1), 0, 0, 1);
  head.matrix.scale(0.29, 0.29, 0.29);
  head.render();

  var beak = new Cube();
  // 148, 89, 52
  beak.color = [148/255, 89/255, 58/255, 1];
  beak.textureNum = -2;
  beak.matrix.translate(offsetX - ((g_blink/9000) + 0.1), offsetY + (g_blink/9000) + 0.18, offsetZ + 0.18);
  beak.matrix.rotate(25, 0, 0, 1);
  beak.matrix.rotate(180, 0, 1, 0);
  beak.matrix.rotate(10 * (g_blink/90 - 1), 0, 0, 1);
  beak.matrix.scale(0.6, 0.05, 0.05);
  beak.render();

  var eyes = new Cube();
  eyes.color = [0.0,0.0,0.0,1.0];
  eyes.textureNum = -2;
  eyes.matrix.translate(offsetX - 0.25, offsetY + 0.16, offsetZ);
  eyes.matrix.rotate(10, 0, 0, 1);
  eyes.matrix.scale(0.05, 0.05 * g_blink/90, 0.32);
  eyes.render();

  var bigRightWing = new TriPrism();
  bigRightWing.color = [10/255, 153/255 + g_yellowAngle/100, 136/255 + g_yellowAngle/300,1.0];
  bigRightWing.textureNum = -2;
  bigRightWing.matrix.translate(offsetX, offsetY, offsetZ);
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
  smallRightWing.textureNum = -2;
  smallRightWing.matrix = new Matrix4(bigRightWing.matrix);
  if (g_yellowAngle != 0){
    smallRightWing.color = [10/255, 153/255 + g_yellowAngle/100, 136/255 + g_yellowAngle/300,0.9];
  }
  smallRightWing.matrix.rotate(-6, 1, 0, 0);
  smallRightWing.matrix.translate(-.8, 0,0);
  smallRightWing.matrix.scale(1, 0.8, 0.9);
  smallRightWing.render();

  var smallerRightWing = new TriPrism();
  smallerRightWing.color = [10/255, 153/255 + g_yellowAngle/100, 136/255 + g_yellowAngle/300,1.0];
  smallerRightWing.textureNum = -2;
  smallerRightWing.matrix = new Matrix4(smallRightWing.matrix);
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
  bigLefttWing.textureNum = -2;
  // bigLefttWing.color = [1.0, 1.0, 0.0, 1.0];
  bigLefttWing.matrix.translate(offsetX, offsetY, offsetZ);
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
  smallLeftWing.textureNum = -2;
  smallLeftWing.matrix = new Matrix4(bigLefttWing.matrix);
  if (g_yellowAngle != 0 ){
    smallLeftWing.color = [10/255, 153/255 + g_yellowAngle/100, 136/255 + g_yellowAngle/300,0.9];
  }
  smallLeftWing.matrix.rotate(-6, 1, 0, 0);
  smallLeftWing.matrix.translate(.8, 0, 0);
  smallLeftWing.matrix.scale(1, 0.8, 0.9);
  smallLeftWing.render();

  var smallerLeftWing = new TriPrism();
  smallerLeftWing.color = [10/255, 153/255 + g_yellowAngle/100, 136/255 + g_yellowAngle/300,1.0];
  smallerLeftWing.textureNum = -2;
  smallerLeftWing.matrix = new Matrix4(smallLeftWing.matrix);
  if (g_yellowAngle != 0 ){
    smallerLeftWing.color = [10/255, 153/255 + g_yellowAngle/100, 136/255 + g_yellowAngle/300,0.8];
  }
  smallerLeftWing.matrix.rotate(-6, 1, 0, 0);
  smallerLeftWing.matrix.translate(.8, 0, 0);
  smallerLeftWing.matrix.scale(1, 0.8, 0.9);
  smallerLeftWing.render();

  var rightLeg = new Cube();
  rightLeg.color = [9/255, 77/255, 23/255, 1];
  rightLeg.textureNum = -2;
  rightLeg.matrix.translate(offsetX, offsetY, offsetZ);
  rightLeg.matrix.scale(0.03, 0.5, 0.03);
  // rightLeg.matrix.rotate(g_leg, 0, 1,0);
  rightLeg.matrix.rotate(10 * g_leg, 0, 1,0);
  rightLeg.matrix.translate(1.2,- 0.8, 1);
  rightLeg.render();

  var rightFoot = new Cube();
  rightFoot.color = [9/255, 77/255, 23/255, 1];
  rightFoot.textureNum = -2;
  rightFoot.matrix = new Matrix4(rightLeg.matrix);
  rightFoot.matrix.rotate(g_foot/2 + g_blink/90, 0, 0,1);
  rightFoot.matrix.translate(0.5, -0.01, 0.001);
  rightFoot.matrix.scale(-2.51,0.0501, 1.001);
  rightFoot.render();

  var rightTalon1 = new Cube();
  // 9, 77, 23
  rightTalon1.color = [0, 0,0, 1];
  rightTalon1.textureNum = -2;
  rightTalon1.matrix = new Matrix4(rightFoot.matrix);
  // rightTalon1.matrix.rotate(-g_talon, 0, 0,1);
  rightTalon1.matrix.rotate(10 * g_talon, 0, 0,1);
  rightTalon1.matrix.translate(1, 1, 0);
  rightTalon1.matrix.scale(0.5, 0.5, 0.5);
  rightTalon1.render();

  var rightTalon2 = new Cube();
  rightTalon2.color = [0, 0,0, 1];
  rightTalon2.textureNum = -2;
  rightTalon2.matrix = new Matrix4(rightTalon1.matrix);
  rightTalon2.matrix.translate(0, 0, 1.3);
  // rightTalon1.matrix.rotate(45 * g_talon, 0, 0,1);
  rightTalon2.render();

  var rightTalon3 = new Cube();
  rightTalon3.color = [0, 0,0, 1];
  rightTalon3.textureNum = -2;
  rightTalon3.matrix = new Matrix4(rightTalon1.matrix);
  rightTalon3.matrix.translate(0, 0, 1.3);
  rightTalon3.render();

  var leftLeg = new Cube();
  leftLeg.color = [9/255, 77/255, 23/255, 1];
  leftLeg.textureNum = -2;
  leftLeg.matrix.translate(offsetX, offsetY, offsetZ);
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
  leftFoot.matrix = new Matrix4(leftLeg.matrix);
  leftFoot.color = [9/255, 77/255, 23/255, 1];
  leftFoot.textureNum = -2;
  leftFoot.matrix.rotate(g_foot/2 + g_blink/90, 0, 0,1);
  leftFoot.matrix.translate(0.5, -0.01, 0.001);
  leftFoot.matrix.scale(-2.51,0.0501, 1.001);
  leftFoot.render();

  var leftTalon1 = new Cube();
  leftTalon1.color = [0,0,0,1];
  leftTalon1.textureNum = -2;
  leftTalon1.matrix = new Matrix4(leftFoot.matrix);
  leftTalon1.matrix.rotate(10 * g_talon, 0, 0,1);
  leftTalon1.matrix.translate(1, 1, 0);
  leftTalon1.matrix.scale(0.5, 0.5, 0.5);
  leftTalon1.render();

  var leftTalon2 = new Cube();
  leftTalon2.color = [0,0,0,1];
  leftTalon2.textureNum = -2;
  leftTalon2.matrix = new Matrix4(leftTalon1.matrix);
  leftTalon2.matrix.translate(0, 0, 1.3);
  leftTalon2.render();

  var leftTalon3 = new Cube();
  leftTalon3.color = [0,0,0,1];
  leftTalon3.textureNum = -2;
  leftTalon3.matrix = new Matrix4(leftTalon1.matrix);
  leftTalon3.matrix.translate(0, 0, 1.3);
  leftTalon3.render();
}