/**
 * @module 3DSceneManager
 * @description Creates the ThreeJS scene
 */

import * as THREE from "js/three.module.js";
import { OrbitControls } from "js/OrbitControls.js";
import { TransformControls } from "js/TransformControls.js";
import { canvasContainer } from "js/Viewer.js";
import { CSS2DRenderer } from "js/jsm/CSS2DRenderer.js";

//#region  Init - animate - update
let particle;
/**
 * Initialise scene, camera and controls
 * @function
 * @returns {Object} scene settings
 */
function init() {
  //create scene
  const scene = new THREE.Scene();

  //add scene lights
  var lights = [];
  lights[0] = new THREE.DirectionalLight(0xffffff, 1);
  lights[0].position.set(1, 0, 0);
  lights[1] = new THREE.DirectionalLight(0x11e8bb, 1);
  lights[1].position.set(0.75, 1, 0.5);
  lights[2] = new THREE.DirectionalLight(0x8200c9, 1);
  lights[2].position.set(-0.75, -1, 0.5);
  scene.add(lights[0]);
  scene.add(lights[1]);
  scene.add(lights[2]);

  //create camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 400;

  //create renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0.0);
  canvasContainer.appendChild(renderer.domElement);

  //create label renderer
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";
  labelRenderer.domElement.style.fontSize = "10px";
  labelRenderer.domElement.style.pointerEvents = "none";
  canvasContainer.appendChild(labelRenderer.domElement);

  //add orbit controls and transform controls
  const controls = new OrbitControls(camera, renderer.domElement);
  const transforms = new TransformControls(camera, renderer.domElement);
  transforms.name = "transforms";
  transforms.setSize(0.75);
  transforms.setSpace("local");
  scene.add(transforms);
  orbitControlsDefaults(controls);

  update(renderer, scene, camera, controls, labelRenderer);

  particle = new THREE.Object3D();
  scene.add(particle);
  var geometry = new THREE.TetrahedronGeometry(1, 0);
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading,
  });
  for (var i = 0; i < 1000; i++) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position
      .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
      .normalize();
    mesh.position.multiplyScalar(90 + Math.random() * 700);
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    particle.add(mesh);
  }
  function animate() {
    requestAnimationFrame(animate);
    particle.rotation.x += 0.0;
    particle.rotation.y -= 0.002;
    renderer.clear();

    renderer.render(scene, camera);
  }
  animate();
  return {
    scene: scene,
    camera: camera,
    // controls: controls,
    renderer: renderer,
    //transforms: transforms,
    labelRenderer: labelRenderer,
  };
}

/**
 * Update the scene
 * @function
 * @param {THREE.renderer} renderer
 * @param {THREE.scene} scene
 * @param {THREE.Camera} camera
 * @param {THREE.OrbitControls} controls
 * @param {CSS2DRenderer} labelRenderer
 */
function update(renderer, scene, camera, controls, labelRenderer) {
  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
  requestAnimationFrame(function () {
    update(renderer, scene, camera, controls, labelRenderer);
  });

  // for VR projects we use setAnimationloop instead of request animation frame
  //renderer.setAnimationLoop( function () {renderer.render( scene, camera );} );
}
//#endregion

//#region  Controls
/**
 * Define the defaults of the viewer's orbit controls
 * @function
 * @param {THREE.OrbitControls} controls
 */
function orbitControlsDefaults(controls) {
  // call this only in static scenes (i.e., if there is no animation loop)

  controls.enablePan = true;
  controls.panSpeed = 0.4;
  controls.screenSpacePanning = false;

  controls.enableZoom = true;
  controls.zoomSpeed = 1.5;

  controls.minDistance = 0;
  controls.maxDistance = 25000;

  controls.enableRotate = true;
  controls.rotateSpeed = 0.75;

  controls.maxPolarAngle = Math.PI / 2;
  controls.minPolarAngle = -Math.PI / 2;
  controls.maxAzimuthAngle = Math.PI;
  controls.minAzimuthAngle = -Math.PI;

  controls.enablekeys = true;
  controls.keyPanSpeed = 1.0;

  // an animation loop is required when either damping or auto-rotation are enabled
  controls.enableDamping = false;
  controls.dampingFactor = 0.1;

  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.5;
}
//#endregion

export { init };
