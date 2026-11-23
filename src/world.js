import * as THREE from 'three';

const mat=(c,r=.82,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
const M={
 ground:mat(0x536b4b), grass:[mat(0x667d52),mat(0x819064),mat(0x435e43)],
 bark:mat(0x49352a),leaf:[mat(0x294d3c),mat(0x3c6248),mat(0x55734d)],
 stone:mat(0x77796d),stone2:mat(0xa49b82),wood:mat(0x745039),wood2:mat(0x493326),
 roof:mat(0x34383a),roof2:mat(0x55504a),plaster:mat(0xc8b89a),dark:mat(0x25282a),
 brass:mat(0xb89457,.38,.55),glass: new THREE.MeshPhysicalMaterial({color:0x8bb6b1,roughness:.16,metalness:.12,transparent:true,opacity:.72}),
 water:new THREE.MeshPhysicalMaterial({color:0x477d80,roughness:.14,metalness:.18,transparent:true,opacity:.86}),
 flower:[mat(0xe4cba1),mat(0xc78c91),mat(0x9caac0)]
};
const H=(x,z)=>{
 const d=Math.hypot(x,z);
 const edge=THREE.MathUtils.smoothstep(d,13,34);
 return (Math.sin(x*.12)*.48+Math.cos(z*.1)*.42+Math.sin((x+z)*.07)*.32)*edge;
};
const mesh=(g,m,p,x,y,z,sx=1,sy=1,sz=1,ry=0)=>{
 const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.rotation.y=ry;o.castShadow=true;o.receiveShadow=true;p.add(o);return o;
};
const onGround=(x,z,offset=0)=>H(x,z)+offset;
function makeTree(scene,x,z,i,obstacles){
 const group=new THREE.Group();group.position.set(x,onGround(x,z),z);scene.add(group);
 const h=3.1+(i%4)*.34;
 mesh(new THREE.CylinderGeometry(.19,.3,h,10),M.bark,group,0,h/2,0,1,1,1,i*.8);
 for(let k=0;k<3;k++){
  const r=1.55-k*.19, y=h+.65+k*.85;
  const crown=mesh(new THREE.IcosahedronGeometry(r,2),M.leaf[(i+k)%3],group,0,y,0,1,.88,1,i*.31+k);
  crown.castShadow=true;
 }
 // roots make trunks feel anchored rather than floating
 for(let a=0;a<4;a++){const ang=a*Math.PI/2;mesh(new THREE.CylinderGeometry(.045,.17,.8,7),M.bark,group,Math.cos(ang)*.34,.24,Math.sin(ang)*.34,1,1,1,ang);}
 obstacles.push({x,z,r:1.05});
}
function makeCabin(scene){
 const house=new THREE.Group();house.position.set(-10,onGround(-10,-20),-20);scene.add(house);
 // stone plinth and warm plaster walls
 mesh(new THREE.BoxGeometry(7.8,.48,6.5),M.stone,house,0,.24,0);
 mesh(new THREE.BoxGeometry(7.1,3.65,5.8),M.plaster,house,0,2.18,0);
 // heavy timber framing
 for(const x of [-3.35,0,3.35])for(const z of [-2.83,2.83])mesh(new THREE.BoxGeometry(.2,3.9,.2),M.wood2,house,x,2.2,z);
 for(const y of [.55,3.85])mesh(new THREE.BoxGeometry(7.25,.18,.18),M.wood,house,0,y,2.94);
 // steep roof, layered roof planes and ridge
 const roofA=mesh(new THREE.BoxGeometry(4.25,.22,7.2),M.roof,house,-1.95,4.28,0,1,1,1,-.48);
 const roofB=mesh(new THREE.BoxGeometry(4.25,.22,7.2),M.roof2,house,1.95,4.28,0,1,1,1,.48);
 mesh(new THREE.BoxGeometry(.22,.28,7.35),M.wood2,house,0,5.3,0);
 for(let z=-3.25;z<=3.26;z+=.65){mesh(new THREE.BoxGeometry(8.2,.12,.12),M.wood,house,0,4.25,z);}
 // front door, carved frame, handle and steps
 mesh(new THREE.BoxGeometry(1.25,2.45,.16),M.wood2,house,0,1.52,2.98);
 mesh(new THREE.BoxGeometry(.98,2.18,.08),M.wood,house,0,1.5,3.08);
 for(let x of [-.42,-.14,.14,.42])mesh(new THREE.BoxGeometry(.035,2.0,.025),M.wood2,house,x,1.5,3.14);
 mesh(new THREE.SphereGeometry(.065,12,10),M.brass,house,.38,1.45,3.2);
 mesh(new THREE.BoxGeometry(1.7,.2,.55),M.stone2,house,0,.12,3.35);
 // windows, sills and crossbars
 for(const x of [-2.25,2.25]){
  mesh(new THREE.BoxGeometry(1.12,1.35,.12),M.wood2,house,x,2.35,2.98);
  mesh(new THREE.BoxGeometry(.88,1.1,.07),M.glass,house,x,2.35,3.06);
  mesh(new THREE.BoxGeometry(.09,1.22,.12),M.wood,house,x,2.35,3.12);
  mesh(new THREE.BoxGeometry(.98,.09,.12),M.wood,house,x,2.35,3.12);
  mesh(new THREE.BoxGeometry(1.35,.16,.38),M.wood,house,x,1.62,3.12);
  for(const dx of [-.56,.56])mesh(new THREE.BoxGeometry(.12,1.5,.16),M.wood,house,x+dx,2.35,3.12);
 }
 // chimney, stone path, porch canopy and supports
 mesh(new THREE.BoxGeometry(.8,2.2,.85),M.stone,house,2.35,5.1,-1.2);
 mesh(new THREE.BoxGeometry(1.0,.2,1.05),M.stone2,house,2.35,6.25,-1.2);
 mesh(new THREE.BoxGeometry(4.6,.2,2.1),M.wood,house,0,3.45,4.0);
 for(const x of [-2,2])mesh(new THREE.CylinderGeometry(.09,.12,3.35,10),M.wood2,house,x,1.75,4.7);
 for(let z=4.2;z<10;z+=.85)mesh(new THREE.BoxGeometry(1.15,.12,.72),M.stone2,house,0,onGround(-10+0,-20+z,.12),z);
 // warm lamps by the entrance
 for(const x of [-1.35,1.35]){
  mesh(new THREE.BoxGeometry(.28,.36,.22),M.brass,house,x,2.55,3.12);
  const glow=new THREE.PointLight(0xffbd72,1.0,7,2);glow.position.set(x,2.55,3.45);house.add(glow);
 }
}
export function createWorld(){
 const scene=new THREE.Scene();scene.background=new THREE.Color(0xbac8c2);scene.fog=new THREE.Fog(0xbac8c2,42,105);
 scene.add(new THREE.HemisphereLight(0xe8f0e7,0x4d5140,1.65));
 const sun=new THREE.DirectionalLight(0xffe1b5,2.3);sun.position.set(-24,35,18);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-38;sun.shadow.camera.right=38;sun.shadow.camera.top=38;sun.shadow.camera.bottom=-38;sun.shadow.bias=-.00018;sun.shadow.normalBias=.025;scene.add(sun);
 const fill=new THREE.DirectionalLight(0xb4d0db,.7);fill.position.set(15,12,-20);scene.add(fill);
 const geo=new THREE.PlaneGeometry(150,150,120,120);geo.rotateX(-Math.PI/2);const p=geo.attributes.position;
 for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);p.setY(i,H(x,z));}geo.computeVertexNormals();
 const terrain=new THREE.Mesh(geo,M.ground);terrain.receiveShadow=true;scene.add(terrain);
 // grass surface detail follows the terrain height and stays out of the walkable clearing
 for(let i=0;i<420;i++){
  const a=i*2.399,r=15+(i%29)*.72,x=Math.cos(a)*r,z=Math.sin(a)*r;
  const tuft=new THREE.Group();tuft.position.set(x,onGround(x,z),z);scene.add(tuft);
  for(let j=0;j<3;j++){const blade=mesh(new THREE.ConeGeometry(.07,.48,5),M.grass[(i+j)%3],tuft,(j-1)*.12,.24,0,.7,1,.7,j*.8);blade.rotation.z=(j-1)*.2;}
  if(i%9===0)mesh(new THREE.SphereGeometry(.09,9,7),M.flower[i%3],tuft,.1,.48,.05,1,.7,1);
 }
 const obstacles=[];
 for(let i=0;i<76;i++){const a=i*2.399,r=18+(i%8)*2.05,x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.hypot(x+10,z+20)<11)continue;makeTree(scene,x,z,i,obstacles);}
 // a walkable stone path, lifted just enough to sit on the sculpted ground
 const points=[[0,12],[0,7],[-1,2],[-4,-5],[-8,-12],[-10,-18],[-10,-26]].map(([x,z])=>new THREE.Vector3(x,onGround(x,z,.09),z));
 const path=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),110,1.05,10,false),mat(0xa69b83));path.receiveShadow=true;scene.add(path);
 // pond with a layered natural bank
 const wx=13,wz=-7,wy=onGround(wx,wz,.06);
 mesh(new THREE.CircleGeometry(5.2,64),M.stone,scene,wx,wy-.12,wz,1,1,1);
 const water=new THREE.Mesh(new THREE.CircleGeometry(4.7,64),M.water);water.rotation.x=-Math.PI/2;water.position.set(wx,wy,wz);water.receiveShadow=true;scene.add(water);
 for(let i=0;i<32;i++){const a=i/32*Math.PI*2,x=wx+Math.cos(a)*5.1,z=wz+Math.sin(a)*5.1;mesh(new THREE.DodecahedronGeometry(.35,0),M.stone2,scene,x,onGround(x,z,.16),z,1,.65,1,a);}
 makeCabin(scene);
 // Solid interaction boundaries keep the player out of the cabin shell and pond.
 obstacles.push({x:-10,z:-20,r:4.9},{x:wx,z:wz,r:5.15});
 // clearing: stone edging, two benches, raised beds, low shrubs
 for(let i=0;i<14;i++){const a=i/14*Math.PI*2,x=Math.cos(a)*4.6,z=4+Math.sin(a)*3.4;mesh(new THREE.DodecahedronGeometry(.28,0),M.stone2,scene,x,onGround(x,z,.17),z,1,.7,1,a);}
 for(const [x,z,rot] of [[-4,3,.35],[4,4,-.4]]){
  const b=new THREE.Group();b.position.set(x,onGround(x,z),z);b.rotation.y=rot;scene.add(b);
  mesh(new THREE.BoxGeometry(1.9,.16,.52),M.wood,b,0,.62,0);
  for(const px of [-.68,.68]){mesh(new THREE.BoxGeometry(.14,.55,.14),M.wood2,b,px,.32,0);mesh(new THREE.BoxGeometry(.14,.7,.14),M.wood2,b,px,.87,-.22);}
  mesh(new THREE.BoxGeometry(1.9,.13,.14),M.wood,b,0,1.0,-.22);
 }
 for(const [x,z] of [[-5,-2],[5,1],[-4,8],[5,9]]){
  mesh(new THREE.CylinderGeometry(1.15,1.22,.3,20),M.wood2,scene,x,onGround(x,z,.15),z);
  for(let j=0;j<16;j++){const a=j*2.4,r=.45+(j%4)*.12,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r;mesh(new THREE.CylinderGeometry(.018,.025,.4,5),M.grass[j%3],scene,px,onGround(px,pz,.37),pz);mesh(new THREE.SphereGeometry(.12,10,8),M.flower[j%3],scene,px,onGround(px,pz,.62),pz,1,.8,1);}
 }
 const lanterns=[];
 for(const [x,z] of [[-5,-1],[6,-11],[-15,-14],[17,8]]){
  const y=onGround(x,z),g=new THREE.Group();g.position.set(x,y,z);scene.add(g);
  mesh(new THREE.CylinderGeometry(.07,.11,2.35,10),M.wood2,g,0,1.17,0);
  mesh(new THREE.BoxGeometry(.48,.52,.48),M.wood,g,0,2.45,0);
  mesh(new THREE.BoxGeometry(.32,.34,.32),M.glass,g,0,2.45,0);
  const bulb=new THREE.PointLight(0xffc77e,1.15,9,2);bulb.position.set(0,2.45,0);g.add(bulb);lanterns.push(bulb);
 }
 const pollenGeo=new THREE.BufferGeometry(),count=120,arr=new Float32Array(count*3);for(let i=0;i<count;i++){arr[i*3]=(Math.random()-.5)*36;arr[i*3+1]=Math.random()*5+.5;arr[i*3+2]=(Math.random()-.5)*36;}pollenGeo.setAttribute('position',new THREE.BufferAttribute(arr,3));
 const pollen=new THREE.Points(pollenGeo,new THREE.PointsMaterial({color:0xffe6b4,size:.045,transparent:true,opacity:.48,depthWrite:false}));scene.add(pollen);
 // Wildlife: small autonomous rabbits and circling birds. They are world creatures,
 // not decorative static props; their motion is updated every frame.
 const fauna=[];
 const rabbitM=mat(0x9a806b),rabbitLight=mat(0xcbb39a),rabbitDark=mat(0x4c3b35),rabbitEye=mat(0x211b1a);
 for(const [x,z,phase] of [[-7,6,.4],[7,7,2.2],[-13,-5,4.1]]){
  const animal=new THREE.Group();animal.position.set(x,onGround(x,z),z);scene.add(animal);
  mesh(new THREE.SphereGeometry(.25,16,12),rabbitM,animal,0,.28,0,1.25,.88,.9);
  mesh(new THREE.SphereGeometry(.17,14,12),rabbitLight,animal,0,.38,.19,.95,.9,.9);
  for(const s of [-1,1]){
   mesh(new THREE.CapsuleGeometry(.055,.25,5,8),rabbitM,animal,s*.105,.68,-.025,.8,1,1,[0,0,s*.12]);
   mesh(new THREE.SphereGeometry(.035,10,8),rabbitEye,animal,s*.095,.43,.34);
   mesh(new THREE.SphereGeometry(.045,10,8),rabbitLight,animal,s*.09,.12,-.12);
  }
  fauna.push({type:'rabbit',group:animal,x,z,phase,speed:.48+phase*.025});
 }
 const birdM=mat(0x48545a,.7),birdWing=mat(0x6d7775,.7);
 for(let i=0;i<5;i++){
  const bird=new THREE.Group();scene.add(bird);
  mesh(new THREE.SphereGeometry(.105,12,10),birdM,bird,0,0,0,1.25,.72,.72);
  const left=mesh(new THREE.ConeGeometry(.09,.42,5),birdWing,bird,-.22,0,0,1,1,1,0);
  const right=mesh(new THREE.ConeGeometry(.09,.42,5),birdWing,bird,.22,0,0,1,1,1,Math.PI);
  fauna.push({type:'bird',group:bird,phase:i*1.25,radius:5+i*1.1,wing:[left,right]});
 }
 const updateFauna=(dt,time)=>{
  for(const a of fauna){
   if(a.type==='rabbit'){
    const t=time*a.speed+a.phase,hop=Math.max(0,Math.sin(t*2.1))**8*.34;
    a.group.position.set(a.x+Math.sin(t*.42)*1.2,H(a.x+Math.sin(t*.42)*1.2,a.z+Math.cos(t*.31)*.8)+hop,a.z+Math.cos(t*.31)*.8);
    a.group.rotation.y=Math.atan2(Math.cos(t*.42),-Math.sin(t*.31));
    a.group.scale.y=1-hop*.45;
   }else{
    const t=time*.18+a.phase;
    a.group.position.set(Math.cos(t)*a.radius,5.8+Math.sin(t*2+a.phase)*.45,-5+Math.sin(t)*a.radius);
    a.group.rotation.y=-t;
    const flap=Math.sin(time*8+a.phase)*.48;
    a.wing[0].rotation.z=flap;a.wing[1].rotation.z=-flap;
   }
  }
 };
 return {scene,lanterns,pollen,obstacles,groundHeight:H,fauna,updateFauna};
}