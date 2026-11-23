import * as THREE from 'three';

const mat=(color,roughness=.82)=>new THREE.MeshStandardMaterial({color,roughness});
const sphere=(geo,material,parent,pos,scale)=>{const m=new THREE.Mesh(geo,material);m.position.set(...pos);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};

export function createLayla(){
  const root=new THREE.Group();root.name='Layla';
  const skin=mat(0xd7a98d),skinLight=mat(0xe7bda2),hair=mat(0x38232b),hairLight=mat(0x59333b),dress=mat(0x536d68),dressLight=mat(0x718d82),dark=mat(0x302b31),white=mat(0xf4e8d8),iris=mat(0x668b80),gold=mat(0xc6a36b);
  const body=new THREE.Group();root.add(body);
  // torso and waist
  sphere(new THREE.CapsuleGeometry(.25,.48,5,10),dress,body,[0,1.02,0],[1,1, .72]);
  sphere(new THREE.SphereGeometry(.22,16,12),dressLight,body,[0,1.3,0],[1.12,.62,.78]);
  // neck and head
  sphere(new THREE.CylinderGeometry(.085,.105,.2,12),skin,body,[0,1.52,0],[1,1,1]);
  const head=new THREE.Group();head.position.set(0,1.83,0);body.add(head);
  sphere(new THREE.SphereGeometry(.28,24,18),skin,head,[0,0,0],[.83,1.08,.78]);
  // ears
  for(const s of [-1,1])sphere(new THREE.SphereGeometry(.07,12,10),skin,head,[s*.226,-.015,0],[.55,1,.5]);
  // eyes, lids, pupils and brows
  for(const s of [-1,1]){
    sphere(new THREE.SphereGeometry(.073,16,12),white,head,[s*.105,.045,.204],[1,.78,.48]);
    sphere(new THREE.SphereGeometry(.037,14,10),iris,head,[s*.105,.042,.235],[1,1,.55]);
    sphere(new THREE.SphereGeometry(.018,12,8),dark,head,[s*.105,.042,.25],[1,1,.55]);
    const brow=sphere(new THREE.SphereGeometry(.07,12,8),hair,head,[s*.108,.132,.205],[1,.22,.3]);brow.rotation.z=s*.12;
  }
  // nose and soft smile
  sphere(new THREE.SphereGeometry(.035,12,10),skinLight,head,[0,-.035,.23],[.7,1,.8]);
  const smile=new THREE.Mesh(new THREE.TorusGeometry(.052,.008,6,18,Math.PI),mat(0x985e61));smile.position.set(0,-.12,.205);smile.rotation.z=Math.PI;head.add(smile);
  // hair cap and long side locks
  sphere(new THREE.SphereGeometry(.285,24,16),hair,head,[0,.105,-.035],[.98,.78,.91]);
  for(const s of [-1,1]){
    const lock=sphere(new THREE.CapsuleGeometry(.075,.45,5,10),hairLight,head,[s*.235,-.18,-.015],[.9,1.12,.85]);lock.rotation.z=-s*.12;
  }
  const fringe=sphere(new THREE.SphereGeometry(.19,18,12),hair,head,[0,.12,.19],[1.18,.48,.38]);fringe.rotation.x=-.18;
  // arms with pivots
  const arms=[];
  for(const s of [-1,1]){
    const pivot=new THREE.Group();pivot.position.set(s*.255,1.29,0);body.add(pivot);arms.push(pivot);
    const upper=new THREE.Mesh(new THREE.CapsuleGeometry(.065,.31,4,8),dress);upper.position.y=-.19;upper.rotation.z=-s*.22;upper.castShadow=true;pivot.add(upper);
    const fore=new THREE.Group();fore.position.set(-s*.07,-.37,0);pivot.add(fore);
    const sleeve=new THREE.Mesh(new THREE.CapsuleGeometry(.052,.25,4,8),skin);sleeve.position.y=-.13;sleeve.rotation.z=s*.12;sleeve.castShadow=true;fore.add(sleeve);
    sphere(new THREE.SphereGeometry(.06,10,8),skin,fore,[0,-.3,.01],[.8,1,.65]);
  }
  // legs
  const legs=[];
  for(const s of [-1,1]){
    const hip=new THREE.Group();hip.position.set(s*.12,.79,0);body.add(hip);legs.push(hip);
    const thigh=new THREE.Mesh(new THREE.CapsuleGeometry(.085,.34,4,9),dress);thigh.position.y=-.22;thigh.castShadow=true;hip.add(thigh);
    const shin=new THREE.Group();shin.position.y=-.42;hip.add(shin);
    const lower=new THREE.Mesh(new THREE.CapsuleGeometry(.055,.32,4,9),skin);lower.position.y=-.19;lower.castShadow=true;shin.add(lower);
    const shoe=new THREE.Mesh(new THREE.SphereGeometry(.09,12,8),dark);shoe.position.set(0,-.39,.045);shoe.scale.set(1,.48,1.6);shoe.castShadow=true;shin.add(shoe);
  }
  // small pendant
  sphere(new THREE.SphereGeometry(.025,10,8),gold,body,[0,1.29,.17],[1,1,1]);
  root.userData.rig={body,head,arms,legs};
  root.scale.setScalar(1.08);
  return root;
}