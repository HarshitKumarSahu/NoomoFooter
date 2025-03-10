import * as THREE from "three";
import { getBody, getMouseBall } from "../src/getBodies.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import RAPIER from "@dimforge/rapier3d-compat";
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
// import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


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

const numBodies = 60;
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


// const loader = new GLTFLoader();
// loader.load("/Scene14.glb", (gltf) => {
//     const model = gltf.scene;
    
//     // Center the model at (0,0,0)
//     model.position.set(0, -23.75, 2.5);

//     // Adjust scale if needed
//     model.scale.set(0.5, 0.5, 0.5);

//     // Ensure the model is facing correctly
//     model.rotation.set(0, 0, 0);

//     // Add the model to the scene
//     scene.add(model);
// }, 
// // onProgress callback
// (xhr) => {
//     console.log(`Model ${(xhr.loaded / xhr.total) * 100}% loaded`);
// }, 
// // onError callback
// (error) => {
//     console.error("Error loading the model:", error);
// });



const loader = new GLTFLoader();
loader.load(
    "/Scene14.glb",
    (gltf) => {
        const model = gltf.scene;

        // ✅ Center the model at (0, 0, 0)
        model.position.set(0, -23.75, 2.5);

        // ✅ Adjust scale if needed
        model.scale.set(0.5, 0.5, 0.5);

        // ✅ Ensure the model is facing correctly
        model.rotation.set(0, 0, 0);

        // ✅ Update material properties (Metalness & Roughness)
        // model.traverse((child) => {
        //     if (child.isMesh && child.material) {
        //         child.material.metalness = 0.1;  // Higher reflectivity
        //         child.material.roughness = 0.1; // Smoother surface
        //         child.material.needsUpdate = true;
        //     }
        // });

        model.traverse((child) => {
          if (child.isMesh) {
              child.geometry.computeVertexNormals(); // Fix normal smoothing
      
              child.material = new THREE.MeshPhysicalMaterial({
                  color: child.material.color,
                  roughness: 0.0,
                  metalness: 1.0,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.0,
                  transmission: 1.0,
                  ior: 1.52,
                  thickness: 0.3,
                  envMapIntensity: 2.5,
                  side: THREE.DoubleSide
              });
      
              child.material.needsUpdate = true;
          }
      });
      
      
      

        // ✅ Add the model to the scene
        scene.add(model);
        console.log("Model loaded successfully!");
    },
    (xhr) => {
        console.log(`Model ${Math.round((xhr.loaded / xhr.total) * 100)}% loaded`);
    },
    (error) => {
        console.error("Error loading the model:", error);
    }
);



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





