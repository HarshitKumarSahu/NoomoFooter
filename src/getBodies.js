import * as THREE from "three";

const sceneMiddle = new THREE.Vector3(0, 0, 0);

// function getBody(RAPIER, world) {
//     const size = 0.15 + Math.random() * 0.25;
//     const range = 6;
//     const density = size  * 1.0;
//     let x = Math.random() * range - range * 0.5;
//     let y = Math.random() * range - range * 0.5 + 3;
//     let z = Math.random() * range - range * 0.5;
//     // physics
//     let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
//             .setTranslation(x, y, z);
//     let rigid = world.createRigidBody(rigidBodyDesc);
//     let colliderDesc = RAPIER.ColliderDesc.ball(size).setDensity(density);
//     world.createCollider(colliderDesc, rigid);
  
//     const geometry = new THREE.IcosahedronGeometry(size, 15);
//     const material = new THREE.MeshStandardMaterial({
//       color: "#C3CAD8",
//       flatShading: true
//     });
//     const mesh = new THREE.Mesh(geometry, material);
  
//     const wireMat = new THREE.MeshBasicMaterial({
//       color: "#C3CAD8",
//       wireframe: true
//     });
//     const wireMesh = new THREE.Mesh(geometry, wireMat);
//     wireMesh.scale.setScalar(1.01);
//     mesh.add(wireMesh);
    
//     function update () {
//       rigid.resetForces(true); 
//       let { x, y, z } = rigid.translation();
//       let pos = new THREE.Vector3(x, y, z);
//       let dir = pos.clone().sub(sceneMiddle).normalize();
//       rigid.addForce(dir.multiplyScalar(-0.5), true);
//       mesh.position.set(x, y, z);
//     }
//     return { mesh, rigid, update };
//   }

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/alpha.png");

function getBody(RAPIER, world) {
    const size = 0.15 + Math.random() * 0.25;
    const range = 6;
    const density = size * 1.0;
    let x = Math.random() * range - range * 0.5;
    let y = Math.random() * range - range * 0.5 + 3;
    let z = Math.random() * range - range * 0.5;

    // Physics
    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y, z);
    let rigid = world.createRigidBody(rigidBodyDesc);
    let colliderDesc = RAPIER.ColliderDesc.ball(size).setDensity(density);
    world.createCollider(colliderDesc, rigid);

    // Geometry
    const geometry = new THREE.IcosahedronGeometry(size, 15);

    // Material with texture
    const material = new THREE.MeshStandardMaterial({
        map: texture, // Apply texture
        roughness: 0.1, // Adjust material properties
        metalness: 0.1,
        flatShading: true
    });

    const mesh = new THREE.Mesh(geometry, material);

    // // Wireframe effect (optional)
    // const wireMat = new THREE.MeshBasicMaterial({
    //     color: "#C3CAD8",
    //     wireframe: true
    // });
    // const wireMesh = new THREE.Mesh(geometry, wireMat);
    // wireMesh.scale.setScalar(1.01);
    // mesh.add(wireMesh);

    function update() {
        rigid.resetForces(true);
        let { x, y, z } = rigid.translation();
        let pos = new THREE.Vector3(x, y, z);
        let dir = pos.clone().sub(sceneMiddle).normalize();
        rigid.addForce(dir.multiplyScalar(-0.5), true);
        mesh.position.set(x, y, z);
    }

    return { mesh, rigid, update };
}





//   function getMouseBall (RAPIER, world) {
//     const mouseSize = 0.1;
//     const geometry = new THREE.IcosahedronGeometry(mouseSize, 1);
//     const material = new THREE.MeshStandardMaterial({
//       color: 0xffffff,
//       emissive: 0xffffff,
//     });
//     const mouseLight = new THREE.PointLight(0xffffff, 0.1);
//     const mouseMesh = new THREE.Mesh(geometry, material);
//     mouseMesh.add(mouseLight);
//     // RIGID BODY
//     let bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0, 0, 0)
//     let mouseRigid = world.createRigidBody(bodyDesc);
//     let dynamicCollider = RAPIER.ColliderDesc.ball(mouseSize * 20.0);
//     world.createCollider(dynamicCollider, mouseRigid);
//     function update (mousePos) {
//       mouseRigid.setTranslation({ x: mousePos.x * 5, y: mousePos.y * 5, z: 0.2 });
//       let { x, y, z } = mouseRigid.translation();
//       mouseMesh.position.set(x, y, z);
//     }
//     return { mesh: mouseMesh, update };
//   }

//   export { getBody, getMouseBall };


function getMouseBall(RAPIER, world) {
    const mouseSize = 0.1;
    const geometry = new THREE.IcosahedronGeometry(mouseSize, 1);
    // const material = new THREE.MeshStandardMaterial({
    //     color: 0xffffff,
    //     emissive: 0xffffff,
    // });
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,  // Enable transparency
        opacity: 0,       // Adjust opacity (0 = fully transparent, 1 = fully opaque)
        emissive: 0xffffff,
    });
    const mouseMesh = new THREE.Mesh(geometry, material);

    // RIGID BODY
    let bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0, 0, 0);
    let mouseRigid = world.createRigidBody(bodyDesc);
    let dynamicCollider = RAPIER.ColliderDesc.ball(mouseSize * 20.0);
    world.createCollider(dynamicCollider, mouseRigid);

    function update(mousePos) {
        mouseRigid.setTranslation({ x: mousePos.x * 5, y: mousePos.y * 5, z: 0.2 });
        let { x, y, z } = mouseRigid.translation();
        mouseMesh.position.set(x, y, z);
    }

    return { mesh: mouseMesh, update };
}

export { getBody, getMouseBall };
