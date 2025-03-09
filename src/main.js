import * as THREE from "three";
import { getBody, getMouseBall } from "../src/getBodies.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import RAPIER from "@dimforge/rapier3d-compat";
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
// import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
// camera.position.z = 4;

const aspect = w / h;
const frustumSize = 2; // Adjust this value to scale the view

const camera = new THREE.OrthographicCamera(
    -frustumSize * aspect, // Left
    frustumSize * aspect,  // Right
    frustumSize,           // Top
    -frustumSize,          // Bottom
    0.1,                   // Near
    1000                   // Far
);

camera.position.set(0, 0, 4); // Keep it at a fixed distance
camera.lookAt(0, 0, 0);       // Always look at the center

const canvas = document.querySelector('.canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true , alpha: true});
renderer.setSize(w, h);
// document.body.appendChild(renderer.domElement);

let mousePos = new THREE.Vector2();
await RAPIER.init();
const gravity = { x: 0.0, y: 0.0, z: 0 };
const world = new RAPIER.World(gravity);

const numBodies = 80;
const bodies = [];
for (let i = 0; i < numBodies; i++) {
  const body = getBody(RAPIER, world);
  body.rotation = { x: Math.random(), y: Math.random(), z: Math.random() };
  bodies.push(body);
  scene.add(body.mesh);
}

const mouseBall = getMouseBall(RAPIER, world);
scene.add(mouseBall.mesh);

const hemiLight = new THREE.HemisphereLight(0x00bbff, 0xaa00ff);
hemiLight.intensity = 0.2;
scene.add(hemiLight);

const rgbeLoader = new RGBELoader();
rgbeLoader.load("/photo_studio_01_1k.hdr", function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping; // Properly map the HDRI

  // Set the environment map for realistic lighting
  scene.environment = texture;
});

/*
// Post-processing (Commented Out)
// const renderScene = new RenderPass(scene, camera);
// const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 2.0, 0.0, 0.005);
// const composer = new EffectComposer(renderer);
// composer.addPass(renderScene);
// composer.addPass(bloomPass);
*/

function animate() {
  requestAnimationFrame(animate);
  world.step();
  mouseBall.update(mousePos);
  bodies.forEach(b => b.update());

  // Use renderer instead of composer since post-processing is removed
  renderer.render(scene, camera);  
}

animate();

function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);

function handleMouseMove (evt) {
  mousePos.x = (evt.clientX / window.innerWidth) * 2 - 1;
  mousePos.y = -(evt.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener('mousemove', handleMouseMove, false);





