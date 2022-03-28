import * as THREE from "./three.module.js";
import * as Init from "./init.js";

export const canvasContainer = document.querySelector("#container-3d");

let initReturn,
  canvas,
  scene,
  camera,
  // controls,
  renderer,
  labelRenderer;
// transforms;

//START
createScene();
/**
 * Create threejs scene and get scene,camera,controls
 * @function
 */
function createScene() {
  initReturn = Init.init();

  //Canvas gets created inside canvas Container-ask for it after init so it exists
  canvas = canvasContainer.getElementsByTagName("canvas")[0];
  scene = initReturn.scene;
  camera = initReturn.camera;
  //controls = initReturn.controls;
  renderer = initReturn.renderer;
  labelRenderer = initReturn.labelRenderer;
  // transforms = initReturn.transforms;

  window.addEventListener("resize", onWindowResize);
  // window.addEventListener("keyup", function (event) {
  //   switch (event.keyCode) {
  //     case 16: // Shift
  //       transforms.setTranslationSnap(null);
  //       transforms.setRotationSnap(null);
  //       transforms.setScaleSnap(null);
  //       break;
  //   }
  // });

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
  }
}

/**
 * Delete all the objects of the Scene to restart it.
 * @function
 * @async
 */
export function destroyScene() {
  const info = disposeObject(scene);
  Init.addDirectionalLight(scene);
  Init.addAmbientLight(scene);
}

/**
 * removes all geometry, materials and textrues related to this object from memory.
 *
 * @param {THREE.Object3D} object - object to dispose
 * @returns {object} number of current geometries, programmes and textures (from renderer.info).
 */
function disposeObject(scene = new THREE.Scene()) {
  // console.log("before: ", renderer.info, renderer.info.memory.geometries)
  // from: https://stackoverflow.com/questions/33152132/three-js-collada-whats-the-proper-way-to-dispose-and-release-memory-garbag/33199591#33199591

  scene.traverse((object) => {
    const geometry = object.geometry;
    if (geometry) {
      geometry.dispose();
    }

    const material = object.material;
    if (material) {
      const materialArray = isArrayMaterial(material);
      if (materialArray) {
        materialArray.forEach(disposeMaterial(materialArray));
      } else {
        disposeMaterial(material);
      }
    }

    /**
     * checks the material to see if it is an array.
     *
     * @param {THREE.Material} material - the material to be tested
     * @returns {THREE.Material[] | boolean} material array if the material is mutli material, mesh face material or array, otherwise false.
     */
    function isArrayMaterial(material) {
      const isFaceMaterial = material instanceof THREE.MeshFaceMaterial;
      const isMultiMaterial = material instanceof THREE.MultiMaterial;

      // var materialArray;

      // if (isFaceMaterial || isMultiMaterial){
      //     materialArray = material.materials;
      // }
      // else if (material instanceof Array){
      //     materialArray = material;
      // }

      const materialArray =
        isFaceMaterial || isMultiMaterial
          ? material.materials
          : material instanceof Array
          ? material
          : false;
      return materialArray;
    }
    /**
     * @param {THREE.Material} material
     * @param {*} [idx]
     */

    function disposeMaterial(material, idx) {
      if (material.map) material.map.dispose();
      if (material.lightMap) material.lightMap.dispose();
      if (material.bumpMap) material.bumpMap.dispose();
      if (material.normalMap) material.normalMap.dispose();
      if (material.specularMap) material.specularMap.dispose();
      if (material.envMap) material.envMap.dispose();
      material.dispose();
    }
  });

  for (var i = scene.children.length - 1; i >= 0; i--) {
    const object = scene.children[i];
    scene.remove(object);
  }

  // renderer.renderLists.dispose();
  // renderer.dispose();
  // console.log("after", renderer.info, renderer.info.memory.geometries);

  return {
    geometries: renderer.info.memory.geometries,
    programs: renderer.info.programs.length,
    textures: renderer.info.memory.textures,
  };
}
