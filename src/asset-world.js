import * as THREE from 'three';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
function loadAsset(local, remote, onLoad) {
  loader.load(local, onLoad, undefined, () => {
    if (remote) loader.load(remote, onLoad, undefined, error => console.warn('Remote asset unavailable:', remote, error));
  });
}
const animalSpecs = [
  { id:'corgi', file:'./assets/models/animals/corgi.glb', remote:'https://gobkit.com/freebies/animal/Corgi.glb', height:.92, position:[-7,0,1], path:[[-7,1],[-4,0],[-5,3],[-8,2]], speed:.72, clip:'walk' },
  { id:'duck', file:'./assets/models/animals/duck.glb', remote:'https://gobkit.com/freebies/animal/Duck.glb', height:.58, position:[4,0,-5], path:[[4,-5],[6,-4],[6,-6],[3,-6]], speed:.42, clip:'walk' },
  { id:'owl', file:'./assets/models/animals/owl.glb', remote:'https://gobkit.com/freebies/animalB/Owl.glb', height:.72, position:[7,0,4], path:[[7,4]], speed:0, clip:'idle' }
];

function fitModel(object, targetHeight) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const scale = targetHeight / Math.max(size.y, .001);
  object.scale.setScalar(scale);
  object.position.set(-center.x*scale, -box.min.y*scale, -center.z*scale);
}

export function loadWorldAssets(scene, groundHeight) {
  const actors = [];
  const mixers = [];
  const props = [
    {file:'./assets/models/environment/bush.glb', remote:'https://gobkit.com/freebies/environment/Bush001.glb', positions:[[-10,0,-5],[10,0,7],[1,0,12]] , height:1.35},
    {file:'./assets/models/environment/cliff.glb', remote:'https://gobkit.com/freebies/environment/Cliff001.glb', positions:[[-15,0,-13],[14,0,-15]], height:5.5},
    {file:'./assets/models/environment/grass.glb', remote:'https://gobkit.com/freebies/environment/Grass001.glb', positions:[[-5,0,8],[7,0,10],[-11,0,4],[12,0,1],[0,0,-10]], height:.75},
    {file:'./assets/models/environment/hill.glb', remote:'https://gobkit.com/freebies/environment/Hill001.glb', positions:[[-18,0,4],[18,0,0]], height:4.5}
  ];

  for (const spec of animalSpecs) {
    loadAsset(spec.file, spec.remote, gltf => {
      const actor = new THREE.Group();
      const model = gltf.scene;
      fitModel(model, spec.height);
      actor.add(model);
      actor.position.set(spec.position[0], groundHeight(spec.position[0], spec.position[2]), spec.position[2]);
      actor.userData.spec = spec;
      actor.userData.pathIndex = 0;
      actor.userData.pause = 1 + Math.random()*2;
      actor.userData.mixer = new THREE.AnimationMixer(model);
      if (gltf.animations?.length) {
        const source = gltf.animations[0];
        const from = spec.clip === 'walk' ? 90 : 0;
        const to = spec.clip === 'walk' ? 120 : 30;
        const clip = THREE.AnimationUtils.subclip(source, spec.clip, from, to, 24);
        actor.userData.mixer.clipAction(clip).play();
        mixers.push(actor.userData.mixer);
      }
      scene.add(actor);
      actors.push(actor);
      if (spec.id === 'owl') actor.position.y += 2.1;
    }, undefined, error => console.warn('Layla asset load failed:', spec.file, error));
  }

  for (const prop of props) {
    loadAsset(prop.file, prop.remote, gltf => {
      for (const [x,,z] of prop.positions) {
        const model = gltf.scene.clone(true);
        fitModel(model, prop.height);
        model.position.x += x;
        model.position.z += z;
        model.position.y += groundHeight(x,z);
        model.traverse(node => { if(node.isMesh){node.castShadow=true;node.receiveShadow=true;} });
        scene.add(model);
      }
    }, undefined, error => console.warn('Layla prop load failed:', prop.file, error));
  }

  return {
    actors,
    update(dt, time) {
      for (const mixer of mixers) mixer.update(dt);
      for (const actor of actors) {
        const spec = actor.userData.spec;
        if (!spec || spec.speed === 0) continue;
        actor.userData.pause -= dt;
        if (actor.userData.pause <= 0) {
          const index = actor.userData.pathIndex;
          const [tx,tz] = spec.path[index];
          const dx = tx-actor.position.x, dz = tz-actor.position.z;
          const dist = Math.hypot(dx,dz);
          if (dist < .22) {
            actor.userData.pathIndex = (index+1)%spec.path.length;
            actor.userData.pause = 1.2 + Math.random()*2.4;
          } else {
            const vx=dx/dist, vz=dz/dist;
            actor.position.x += vx*spec.speed*dt;
            actor.position.z += vz*spec.speed*dt;
            actor.rotation.y = Math.atan2(vx,vz);
          }
        }
        actor.position.y = groundHeight(actor.position.x,actor.position.z);
        if (spec.id === 'duck') actor.position.y += Math.sin(time*3)*.025;
      }
    }
  };
}
