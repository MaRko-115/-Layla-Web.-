import * as THREE from 'three';

const M=(c,r=.72,metal=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:metal});
const part=(g,m,p,pos,scale,rot=[0,0,0])=>{const o=new THREE.Mesh(g,m);o.position.set(...pos);o.scale.set(...scale);o.rotation.set(...rot);o.castShadow=true;o.receiveShadow=true;p.add(o);return o;};
const ell=(m,p,pos,scale)=>part(new THREE.SphereGeometry(1,32,24),m,p,pos,scale);

export function createLayla(){
 window.__LAYLA_BOOT_STAGE='Character: function entered';
 const root=new THREE.Group();root.name='Layla';
 const skin=M(0xd7a17e),skinHi=M(0xe8bd9b),skinShade=M(0xb87d61),hair=M(0x201923,.48),hair2=M(0x34232b,.5),hairGlow=M(0x50333c,.55),dress=M(0x263e4b),cloth=M(0x38596a),clothHi=M(0x557486),trim=M(0xd2b176,.38,.35),dark=M(0x191c25),eyeWhite=M(0xf3e8dd),iris=M(0x547c78,.32),pupil=M(0x17272a,.2),lip=M(0x9e5e60),blush=M(0xc78376);
 const body=new THREE.Group();root.add(body);
 window.__LAYLA_BOOT_STAGE='Character: body and dress';
 // layered dress silhouette, fitted bodice and flowing skirt
 part(new THREE.CylinderGeometry(.19,.34,.52,32,1,true),dress,body,[0,.98,0],[1,1,.8]);
 part(new THREE.CylinderGeometry(.22,.48,.66,40,2,true),cloth,body,[0,.48,0],[1,1,.78]);
 ell(cloth,body,[0,1.24,0],[.26,.16,.19]);
 part(new THREE.TorusGeometry(.205,.014,8,40),trim,body,[0,.78,0],[1,.8,1]);
 // skirt panel folds
 for(let i=0;i<12;i++){const a=i*Math.PI*2/12;part(new THREE.ConeGeometry(.065,.58,8),clothHi,body,[Math.sin(a)*.29,.49,Math.cos(a)*.24],[.55,1,.65],[0,a,0]);}
 // collar and neck
 part(new THREE.CylinderGeometry(.075,.09,.18,20),skin,body,[0,1.43,0],[1,1,1]);
 part(new THREE.TorusGeometry(.092,.018,8,24),trim,body,[0,1.38,0]);
 window.__LAYLA_BOOT_STAGE='Character: head setup';
 const head=new THREE.Group();head.position.set(0,1.72,0);body.add(head);
 ell(skin,head,[0,0,0],[.255,.33,.225]);
 // cheek shading and highlights
 ell(blush,head,[-.15,-.095,.16],[.055,.035,.018]);ell(blush,head,[.15,-.095,.16],[.055,.035,.018]);
 ell(skinHi,head,[0,-.12,.2],[.06,.05,.025]);
 // eyes, sculpted eyelids, eye corners, iris highlights
 for(const s of [-1,1]){
   ell(dark,head,[s*.098,.045,.192],[.079,.046,.035]);
   ell(eyeWhite,head,[s*.098,.044,.215],[.067,.032,.022]);
   ell(iris,head,[s*.098,.04,.235],[.031,.032,.014]);
   ell(pupil,head,[s*.098,.04,.246],[.016,.021,.009]);
   ell(eyeWhite,head,[s*.088,.055,.254],[.008,.008,.006]);
   part(new THREE.TorusGeometry(.068,.009,8,24,Math.PI),hair2,head,[s*.098,.047,.22],[1,.48,1],[0,0,s*.08]);
   const brow=ell(hair,head,[s*.1,.13,.195],[.074,.018,.022]);brow.rotation.z=-s*.08;
 }
 // nose bridge and tip, mouth with soft lip
 ell(skinShade,head,[0,-.008,.214],[.018,.06,.018]);ell(skinHi,head,[0,-.052,.226],[.026,.02,.016]);
 part(new THREE.TorusGeometry(.034,.006,8,20,Math.PI),lip,head,[0,-.15,.204],[1,.62,1],[0,0,Math.PI]);
 ell(lip,head,[0,-.16,.203],[.027,.008,.008]);
 // ears
 for(const s of [-1,1]){ell(skin,head,[s*.247,-.015,0],[.045,.075,.045]);ell(skinShade,head,[s*.257,-.015,.022],[.018,.035,.012]);}
 window.__LAYLA_BOOT_STAGE='Character: face completed; hairstyle';
 // hairstyle cap + side curtain, swept fringe, long flowing back hair
 ell(hair,head,[0,.19,-.055],[.28,.22,.25]);
 ell(hair2,head,[0,.12,-.13],[.285,.27,.21]);
 const back=part(new THREE.CapsuleGeometry(.25,.5,8,18),hair,head,[0,-.22,-.14],[1.08,1.25,.72]);back.rotation.x=-.16;
 for(const s of [-1,1]){
   const lock=part(new THREE.CapsuleGeometry(.075,.48,8,12),hair2,head,[s*.225,-.24,-.015],[1,1.28,.9],[0,0,-s*.12]);
   part(new THREE.CapsuleGeometry(.035,.36,6,10),hairGlow,head,[s*.235,-.31,.015],[.7,1,.6],[0,0,-s*.14]);
 }
 // tapered bangs, sculpted into three locks
 for(let i=-1;i<=1;i++){const bang=part(new THREE.CapsuleGeometry(.065,.14,6,12),hair2,head,[i*.085,.17,.18],[1.1,1.2,.6],[0,0,-i*.22]);}
 window.__LAYLA_BOOT_STAGE='Character: hair completed; limbs';
 // shoulders, articulated arms, cuffs, fingers
 const arms=[],legs=[];
 for(const s of [-1,1]){
  const arm=new THREE.Group();arm.position.set(s*.27,1.25,0);body.add(arm);arms.push(arm);
  part(new THREE.CapsuleGeometry(.075,.28,8,12),cloth,arm,[s*.035,-.18,0],[1,1,1],[0,0,-s*.2]);
  const elbow=new THREE.Group();elbow.position.set(s*.06,-.34,.015);arm.add(elbow);
  part(new THREE.CapsuleGeometry(.052,.26,8,12),skin,elbow,[0,-.14,.015],[1,1,1],[0,0,s*.1]);
  part(new THREE.TorusGeometry(.054,.009,8,20),trim,elbow,[0,-.025,.015]);
  ell(skin,elbow,[0,-.29,.025],[.055,.07,.045]);
  for(let f=0;f<4;f++)part(new THREE.CapsuleGeometry(.012,.05,4,6),skin,elbow,[(f-1.5)*.022,-.34,.04],[1,1,1]);
  const hip=new THREE.Group();hip.position.set(s*.12,.48,0);body.add(hip);legs.push(hip);
  part(new THREE.CapsuleGeometry(.09,.25,8,12),dress,hip,[0,-.16,0],[1,1,1]);
  part(new THREE.CapsuleGeometry(.052,.3,8,12),skin,hip,[0,-.43,.012],[1,1,1]);
  part(new THREE.CapsuleGeometry(.065,.12,8,12),dark,hip,[0,-.63,.075],[1,.65,1.5]);
 }
 window.__LAYLA_BOOT_STAGE='Character: limbs completed; finishing';
 // fine belt, pendant, embroidered hem accents
 part(new THREE.TorusGeometry(.24,.012,8,40),trim,body,[0,.72,0],[1,.8,1]);
 part(new THREE.ConeGeometry(.024,.055,8),trim,body,[0,1.2,.2],[1,1,1]);
 root.userData.rig={body,head,arms,legs};
 root.scale.setScalar(1.12);
 window.__LAYLA_BOOT_STAGE='Character: finished';
 return root;
}