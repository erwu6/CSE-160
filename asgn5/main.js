import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { Water } from 'three/addons/objects/Water.js';
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {RectAreaLightHelper} from 'three/addons/helpers/RectAreaLightHelper.js';

// function main() {
const canvas = document.querySelector('#c');
const view1Elem = document.querySelector('#view1');
const view2Elem = document.querySelector('#view2');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas, logarithmicDepthBuffer: true, alpha: true,});
const fov = 75;
const aspect = 2;  // the canvas default
const near = 0.00001;
const far = 500;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 3;
RectAreaLightUniformsLib.init();
camera.position.set( 0, 10, 20 );
const cameraHelper = new THREE.CameraHelper(camera);

class MinMaxGUIHelper {
  constructor(obj, minProp, maxProp, minDif) {
    this.obj = obj;
    this.minProp = minProp;
    this.maxProp = maxProp;
    this.minDif = minDif;
  }
  get min() {
    return this.obj[this.minProp];
  }
  set min(v) {
    this.obj[this.minProp] = v;
    this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
  }
  get max() {
    return this.obj[this.maxProp];
  }
  set max(v) {
    this.obj[this.maxProp] = v;
    this.min = this.min;  // this will call the min setter
  }
}

function updateCamera() {
  camera.updateProjectionMatrix();
}
 
const gui = new GUI();
// gui.add(camera, 'zoom', 0.01, 1, 0.01).listen();
gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
gui.add(minMaxGUIHelper, 'max', 0.1, 500, 0.1).name('far').onChange(updateCamera);

const controls = new OrbitControls( camera, view1Elem );
controls.target.set( 0, 5, 0 );
controls.update();

const camera2 = new THREE.PerspectiveCamera(
  60,  // fov
  2,   // aspect
  0.1, // near
  500, // far
);
camera2.position.set(40, 10, 30);
camera2.lookAt(0, 5, 0);
 
const controls2 = new OrbitControls(camera2, view2Elem);
controls2.target.set(0, 5, 0);
controls2.update();

const scene = new THREE.Scene();
// scene.background = new THREE.Color( 'black' );
scene.add(cameraHelper);

const boxWidth = 3;
const boxHeight = 3;
const boxDepth = 3;
const loadManager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader( loadManager );
const texture1 = loader.load( 'lib/floral.jpg' );
const cubes = [];
texture1.colorSpace = THREE.SRGBColorSpace;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
// const material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // greenish blue
const material = new THREE.MeshBasicMaterial({map: loadColorTexture('lib/flowers.jpg' )});
const materials = [
    new THREE.MeshBasicMaterial({map: loadColorTexture('lib/floral.jpg' )}),
    new THREE.MeshBasicMaterial({map: loadColorTexture('lib/leaves.jpg' )}),
    new THREE.MeshBasicMaterial({map: loadColorTexture('lib/sky.jpg' )}),
    new THREE.MeshBasicMaterial({map: loadColorTexture('lib/flowers.jpg' )}),
    new THREE.MeshBasicMaterial({map: loadColorTexture('lib/sky.jpg')}),
    new THREE.MeshBasicMaterial({map: loadColorTexture('lib/leaves.jpg' )}),
  ];

const loadingElem = document.querySelector('#loading');
const progressBarElem = loadingElem.querySelector('.progressbar');

loadManager.onLoad = () => {
    loadingElem.style.display = 'none';
    const cube = new THREE.Mesh(geometry, material);
	cube.position.set(12,45,-12);
    scene.add(cube);
    cubes.push(cube);  // add to our list of cubes to rotate
};

loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
    const progress = itemsLoaded / itemsTotal;
    progressBarElem.style.transform = `scaleX(${progress})`;
};

// const cube = ns
renderer.render(scene, camera);

function setScissorForElement(elem) {
  const canvasRect = canvas.getBoundingClientRect();
  const elemRect = elem.getBoundingClientRect();
 
  // compute a canvas relative rectangle
  const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
  const left = Math.max(0, elemRect.left - canvasRect.left);
  const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
  const top = Math.max(0, elemRect.top - canvasRect.top);
 
  const width = Math.min(canvasRect.width, right - left);
  const height = Math.min(canvasRect.height, bottom - top);
 
  // setup the scissor to only render to that part of the canvas
  const positiveYUpBottom = canvasRect.height - bottom;
  renderer.setScissor(left, positiveYUpBottom, width, height);
  renderer.setViewport(left, positiveYUpBottom, width, height);
 
  // return the aspect
  return width / height;
}

function loadColorTexture( path ) {
    const texture = loader.load( path );
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

class DegRadHelper {

	constructor( obj, prop ) {

		this.obj = obj;
		this.prop = prop;

	}
	get value() {

		return THREE.MathUtils.radToDeg( this.obj[ this.prop ] );

	}
	set value( v ) {

		this.obj[ this.prop ] = THREE.MathUtils.degToRad( v );

	}

}

class StringToNumberHelper {

	constructor( obj, prop ) {

		this.obj = obj;
		this.prop = prop;

	}
	get value() {

		return this.obj[ this.prop ];

	}
	set value( v ) {

		this.obj[ this.prop ] = parseFloat( v );

	}

}

	const wrapModes = {
		'ClampToEdgeWrapping': THREE.ClampToEdgeWrapping,
		'RepeatWrapping': THREE.RepeatWrapping,
		'MirroredRepeatWrapping': THREE.MirroredRepeatWrapping,
	};

	function updateTexture() {

		texture.needsUpdate = true;

	}

	function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
	const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
	const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
	const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
 
	// compute a unit vector that points in the direction the camera is now
	// in the xz plane from the center of the box
	const direction = (new THREE.Vector3())
	.subVectors(camera.position, boxCenter)
	.multiply(new THREE.Vector3(1, 0, 1))
	.normalize();

  // move the camera to a position distance units way from the center
  // in whatever direction the camera was from the center already
  camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
 
  // pick some near and far values for the frustum that
  // will contain the box.
  camera.near = boxSize / 100;
  camera.far = boxSize * 100;
 
  camera.updateProjectionMatrix();
 
  // point the camera to look at the center of the box
  camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
}

	const mtlLoader = new MTLLoader();
	mtlLoader.load('lib/Duck_01.mtl', (mtl) => {
		mtl.preload();
		for (const material of Object.values(mtl.materials)) {
			material.side = THREE.DoubleSide;
		}
		const objLoader = new OBJLoader();
		objLoader.setMaterials(mtl);
		objLoader.load('lib/Duck_01.obj', (root) => {
		scene.add(root);
			// compute the box that contains all the stuff
			// from root and below
			const box = new THREE.Box3().setFromObject(root);
		
			const boxSize = box.getSize(new THREE.Vector3()).length();
			const boxCenter = box.getCenter(new THREE.Vector3());
		
			// set the camera to frame the box
			frameArea(boxSize * 1.2, boxSize, boxCenter, camera);
		
			// update the Trackball controls to handle the new size
			controls.maxDistance = boxSize * 10;
			controls.target.copy(boxCenter);
			controls.update();
		});
	});

{
  const cubeSize = 2;
  const cubeGeo = new THREE.BoxGeometry(cubeSize + 1, cubeSize, cubeSize);
  const cubeMat = new THREE.MeshStandardMaterial({color: '#8AC'});
  const mesh = new THREE.Mesh(cubeGeo, cubeMat);
  mesh.position.set(cubeSize -4, cubeSize / 2, -5);
  scene.add(mesh);

  const cube2Size = 1;
  const cube2Geo = new THREE.BoxGeometry(cubeSize + 1, cubeSize/2, cubeSize);
  const cube2Mat = new THREE.MeshStandardMaterial({color: '#8AC'});
  const mesh2 = new THREE.Mesh(cube2Geo, cube2Mat);
  mesh2.position.set(cube2Size - 3, cube2Size / 2 , -6);
  scene.add(mesh2);
}
{
  const sphereRadius = 2;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
  const textureLoader = new THREE.TextureLoader();
  const sphereTexture = textureLoader.load('lib/brown_planks_03_diff_4k.jpg');
  sphereTexture.colorSpace = THREE.SRGBColorSpace;
  const sphereMat = new THREE.MeshStandardMaterial({map: sphereTexture});
  const mesh = new THREE.Mesh(sphereGeo, sphereMat);
  mesh.position.set(12, 23, -12);
  scene.add(mesh);
}
{
	const rect1Geo = new THREE.BoxGeometry(12, 2, 2);
	const rect1Mat = new THREE.MeshStandardMaterial({color: '#8AC'});
	const rect1 = new THREE.Mesh(rect1Geo, rect1Mat);
	rect1.position.set(1,1,4);
	scene.add(rect1);
	const rect2Geo = new THREE.BoxGeometry(2, 2, 10);
	const rect2Mat = new THREE.MeshStandardMaterial({color: '#8AC'});
	const rect2 = new THREE.Mesh(rect2Geo, rect2Mat);
	rect2.position.set(6,1,0);
	scene.add(rect2);
	const rect3Geo = new THREE.BoxGeometry(12, 2, 2);
	const rect3Mat = new THREE.MeshStandardMaterial({color: '#8AC'});
	const rect3 = new THREE.Mesh(rect3Geo, rect3Mat);
	rect3.position.set(-1,1,-4);
	scene.add(rect3);
	const rect4Geo = new THREE.BoxGeometry(2, 2, 10);
	const rect4Mat = new THREE.MeshStandardMaterial({color: '#8AC'});
	const rect4 = new THREE.Mesh(rect4Geo, rect4Mat);
	rect4.position.set(-6,1,0);
	scene.add(rect4);
}
	const waterGeo = new THREE.BoxGeometry(10, 8);
	const water = new Water(waterGeo, {
		textureWidth: 512,
		textureHeight: 512,
		waterNormals: new THREE.TextureLoader().load(
		'https://threejs.org/examples/textures/waternormals.jpg',
		function (texture) {
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		}
		),
		waterColor: 0x0f5e9c,
		distortionScale: 3.7,
		fog: scene.fog !== undefined
	});
	water.position.set(0,1.25,0);
	water.rotation.x = -Math.PI / 2;
	scene.add(water);
{
	const pillarGeo = new THREE.BoxGeometry(3, 20, 3);
	const pillarMat = new THREE.MeshStandardMaterial({color: '#8AC'});
	const pillar = new THREE.Mesh(pillarGeo, pillarMat);
	pillar.position.set(-12,10,12);
	scene.add(pillar);
}
{
	const pillarGeo = new THREE.BoxGeometry(3, 40, 3);
	const pillarMat = new THREE.MeshStandardMaterial({color: '#8AC'});
	const pillar = new THREE.Mesh(pillarGeo, pillarMat);
	pillar.position.set(-12,20,-12);
	scene.add(pillar);
}
{
	const pillarGeo = new THREE.BoxGeometry(3, 20, 3);
	const pillarMat = new THREE.MeshStandardMaterial({color: '#8AC'});
	const pillar = new THREE.Mesh(pillarGeo, pillarMat);
	pillar.position.set(12,10,12);
	scene.add(pillar);
}
{
	const pillarGeo = new THREE.BoxGeometry(3, 20, 3);
	const pillarMat = new THREE.MeshStandardMaterial({color: '#8AC'});
	const pillar = new THREE.Mesh(pillarGeo, pillarMat);
	pillar.position.set(12,10,-12);
	scene.add(pillar);
}
{
	const wallGeo = new THREE.BoxGeometry(27, 3, 3);
	const wallMat = new THREE.MeshStandardMaterial({color: '#8AC'});
	const wall = new THREE.Mesh(wallGeo, wallMat);
	wall.position.set(0,20,-12);
	scene.add(wall);
}
{
	const wallGeo = new THREE.BoxGeometry(3, 3, 27);
	const wallMat = new THREE.MeshStandardMaterial({color: '#8AC'});
	const wall = new THREE.Mesh(wallGeo, wallMat);
	wall.position.set(12,20,0);
	scene.add(wall);
}
{
	const wallGeo = new THREE.BoxGeometry(27, 3, 3);
	const wallMat = new THREE.MeshStandardMaterial({color: '#8AC'});
	const wall = new THREE.Mesh(wallGeo, wallMat);
	wall.position.set(0,40,-12);
	scene.add(wall);
}
{
	const wallGeo = new THREE.BoxGeometry(3, 3, 27);
	const wallMat = new THREE.MeshStandardMaterial({color: '#8AC'});
	const wall = new THREE.Mesh(wallGeo, wallMat);
	wall.position.set(-12,20,0);
	scene.add(wall);
}
// stairs
{
	let y = 20;
	const wallMat = new THREE.MeshStandardMaterial({ color: '#8AC' });
	for (let i = 0; i < 10; i++) {
		const wallGeo = new THREE.BoxGeometry(y, 3, 3);
		const wall = new THREE.Mesh(wallGeo, wallMat);
		wall.position.set(-1 - i, 1 + i * 2, 12);
  		scene.add(wall);
		y -=2;
	}
}
{
	let y = 20;
	const wallMat = new THREE.MeshStandardMaterial({ color: '#8AC' });
	for (let i = 0; i < 10; i++) {
		const wallGeo = new THREE.BoxGeometry(3, 3, y);
		const wall = new THREE.Mesh(wallGeo, wallMat);
		wall.position.set(-12, 22 + i * 2, -1 - i);
  		scene.add(wall);
		y -=2;
	}
}
	function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}


function render(time) {
  time *= 0.001;  // convert time to seconds

  cubes.forEach((cube, ndx) => {
    const speed = 1 + ndx * .1;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  });
	resizeRendererToDisplaySize(renderer);

	const speed = 0.5;
	water.material.uniforms['time'].value = Math.sin(time * speed);
 
    // turn on the scissor
    renderer.setScissorTest(true);
 
    // render the original view
    {
      const aspect = setScissorForElement(view1Elem);
 
      // adjust the camera for this aspect
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      cameraHelper.update();
 
      // don't draw the camera helper in the original view
      cameraHelper.visible = false;
 
    //   scene.background.set(0x000000);
 
      // render
      renderer.render(scene, camera);
    }
 
    // render from the 2nd camera
    {
      const aspect = setScissorForElement(view2Elem);
 
      // adjust the camera for this aspect
      camera2.aspect = aspect;
      camera2.updateProjectionMatrix();
 
      // draw the camera helper in the 2nd view
      cameraHelper.visible = true;
 
      renderer.render(scene, camera2);
    }

	requestAnimationFrame(render);
}

requestAnimationFrame(render);

const planeSize = 40;

const texture = loader.load( 'lib/grey_tiles_diff_4k.jpg' );
texture.colorSpace = THREE.SRGBColorSpace;
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
const repeats = planeSize / 2;
texture.repeat.set( repeats, repeats );

const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
const planeMat = new THREE.MeshStandardMaterial( {
	map: texture,
	side: THREE.DoubleSide,
} );
const barMat = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
const mesh = new THREE.Mesh( planeGeo, planeMat );
mesh.rotation.x = Math.PI * - .5;
scene.add( mesh );

const exrLoader = new EXRLoader();

exrLoader.load('lib/ferndale_studio_12_4k.exr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(8, 20, 0);
light.target.position.set(0, 0, 0);
scene.add(light);
scene.add(light.target);

const light1 = new THREE.AmbientLight(color, intensity);
scene.add(light1);

const width = 20;
const height = 4;
const light2 = new THREE.RectAreaLight(color, intensity, width, height);
light2.position.set(0, 40, -12);
light2.rotation.x = THREE.MathUtils.degToRad(-90);
scene.add(light2);
 
const helper2 = new RectAreaLightHelper(light2);
light2.add(helper2);

class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return '#' + this.object[this.prop].getHexString();
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

function makeXYZGUI(gui, vector3, name, onChangeFn) {
  const folder = gui.addFolder(name);
  folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
  folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
  folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
  folder.open();
}

const rectLightFolder = gui.addFolder("RectAreaLight");
rectLightFolder.addColor(new ColorGUIHelper(light2, 'color'), 'value').name('color');
rectLightFolder.add(light2, 'intensity', 0, 10, 0.01);

const ambientLightFolder = gui.addFolder("AmbientLight");
ambientLightFolder.addColor(new ColorGUIHelper(light1, 'color'), 'value').name('color');
ambientLightFolder.add(light1, 'intensity', 0, 5, 0.01);

const helper = new THREE.DirectionalLightHelper(light);
scene.add(helper);

function updateLight() {
  light.target.updateMatrixWorld();
  helper.update();
}
updateLight();

const DirectionalLightFolder = gui.addFolder("DirectionalLight");
DirectionalLightFolder.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
DirectionalLightFolder.add(light, 'intensity', 0, 5, 0.01);
makeXYZGUI(DirectionalLightFolder, light.position, 'position', updateLight);
makeXYZGUI(DirectionalLightFolder, light.target.position, 'target', updateLight);