import * as THREE from 'three';

const material=(color,roughness=.95)=>new THREE.MeshStandardMaterial({color,roughness});
const dark=material(0x302b27),trim=material(0xd2b176,.38,.35);
const groundMat=material(0x596c50),grassMats=[material(0x71805a),material(0x84906a),material(0x4c654d)],bark=material(0x594638),leafMats=[material(0x405d4b),material(0x526d50),material(0x6d7952)],stone=material(0x77796d),stoneLight=material(0x999482),wood=material(0x72543c),roof=material(0x493d38),warm=material(0xe9bd78);
const mesh=(g,m,p,pos,scale,rotY=0)=>{const o=new THREE.Mesh(g,m);o.position.set(...pos);o.scale.set(...scale);o.rotation.y=rotY;o.castShadow=true;o.receiveShadow=true;p.add(o);return o;};

export function createWorld(){
 const scene=new THREE.Scene();scene.background=new THREE.Color(0xb9b9a0);scene.fog=new THREE.FogExp2(0xb9b9a0,.012);
 const hemi=new THREE.HemisphereLight(0xdce2d2,0x59604c,2.0);scene.add(hemi);
 const sun=new THREE.DirectionalLight(0xffdfad,2.4);sun.position.set(-18,28,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-35;sun.shadow.camera.right=35;sun.shadow.camera.top=35;sun.shadow.camera.bottom=-35;sun.shadow.bias=-.00015;scene.add(sun);
 const fill=new THREE.DirectionalLight(0x9eb5c0,.55);fill.position.set(12,10,-20);scene.add(fill);
 const terrainGeo=new THREE.PlaneGeometry(150,150,100,100);terrainGeo.rotateX(-Math.PI/2);const pos=terrainGeo.attributes.position;
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);let h=Math.sin(x*.12)*.7+Math.cos(z*.1)*.65+Math.sin((x+z)*.07)*.55;h-=Math.exp(-((x*x)/110+(z*z)/80))*1.1;pos.setY(i,h);}
 terrainGeo.computeVertexNormals();const terrain=new THREE.Mesh(terrainGeo,groundMat);terrain.receiveShadow=true;scene.add(terrain);
 // rolling distant ridges
 for(let i=0;i<13;i++){const a=i/13*Math.PI*2,r=43+(i%3)*4,x=Math.cos(a)*r,z=Math.sin(a)*r;mesh(new THREE.ConeGeometry(10+(i%4)*2,13+(i%5)*2,7),i%2?material(0x7c866b):material(0x899078),scene,[x,5,z],[1,1.2,1],a);}
 // winding pale stone path
 const pts=[new THREE.Vector3(1,.12,8),new THREE.Vector3(.4,.12,4),new THREE.Vector3(-1,.12,0),new THREE.Vector3(-.2,.12,-5),new THREE.Vector3(3,.12,-11),new THREE.Vector3(8,.12,-17)];
 const curve=new THREE.CatmullRomCurve3(pts);const path=new THREE.Mesh(new THREE.TubeGeometry(curve,90,1.15,8,false),material(0x9b927d));path.position.y=-.02;path.receiveShadow=true;scene.add(path);
 // pond on the east side
 const water=new THREE.Mesh(new THREE.CircleGeometry(5,48),new THREE.MeshStandardMaterial({color:0x668d88,roughness:.23,metalness:.12,transparent:true,opacity:.88}));water.rotation.x=-Math.PI/2;water.position.set(12,.04,-5);scene.add(water);
 const shore=new THREE.Mesh(new THREE.TorusGeometry(5,.22,8,48),stoneLight);shore.rotation.x=Math.PI/2;shore.position.set(12,.04,-5);scene.add(shore);
 // trees: layered canopy and trunks, clustered away from the path
 const treePositions=[];
 for(let i=0;i<88;i++){const a=i*2.399,r=13+(i%9)*2.25,x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.abs(x)<5&&z>-13&&z<12)continue;if(x>6&&x<19&&z>-11&&z<2)continue;treePositions.push([x,z,i]);}
 for(const [x,z,i] of treePositions){const h=2.4+(i%5)*.3;mesh(new THREE.CylinderGeometry(.13,.23,h,7),bark,scene,[x,h/2-.1,z],[1,1,1],i);const lm=leafMats[i%3];mesh(new THREE.ConeGeometry(1.35+(i%3)*.2,2.8,8),lm,scene,[x,h+1,z],[1,1,1],i*.7);mesh(new THREE.ConeGeometry(1.05,2.4,8),lm,scene,[x,h+2.05,z],[1,1,1],i*.4);}
 // grass clumps and flowers
 for(let i=0;i<210;i++){const a=i*2.4,r=5+(i%23)*.72,x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.abs(x)<2.5&&z>-13&&z<10)continue;const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);for(let j=0;j<3;j++){const blade=mesh(new THREE.ConeGeometry(.07,.52,5),grassMats[(i+j)%3],g,[(j-1)*.12,.24,0],[.55,1,.55],j*.8);blade.rotation.z=(j-1)*.22;}if(i%8===0){const flower=mesh(new THREE.SphereGeometry(.09,8,6),i%16?material(0xd8c49a):material(0xb58a82),g,[.1,.47,.04],[1,.65,1]);}}
 // rocks
 for(let i=0;i<50;i++){const a=i*2.13,r=7+(i%11)*1.8,x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.abs(x)<3&&z>-12&&z<8)continue;const s=.22+(i%4)*.13;mesh(new THREE.DodecahedronGeometry(s,0),i%3?stone:stoneLight,scene,[x,s*.55,z],[1,.7,1.2],i);}
 // little cabin and porch at the far end
 const cabin=new THREE.Group();cabin.position.set(-9,0,-19);scene.add(cabin);
 mesh(new THREE.BoxGeometry(5,3.1,4),wood,cabin,[0,1.55,0],[1,1,1]);
 mesh(new THREE.ConeGeometry(3.8,2.25,4),roof,cabin,[0,4.05,0],[1,1,.82],Math.PI/4);
 mesh(new THREE.BoxGeometry(1.05,1.8,.12),dark,cabin,[0,.9,2.06],[1,1,1]);
 mesh(new THREE.CircleGeometry(.16,16),warm,cabin,[0,2.15,2.08],[1,1,1]); 
 for(const x of [-1.65,1.65])mesh(new THREE.CylinderGeometry(.08,.08,2.8,8),bark,cabin,[x,1.4,2.35],[1,1,1]);
  // close-range environment dressing around spawn: stone ring, bench, planted beds, small shrubs
 const focus=new THREE.Group();focus.name='SpawnGarden';scene.add(focus);
 // low stone seating arc
 for(let i=0;i<9;i++){const a=Math.PI*.12+i*Math.PI*.76/8;const x=Math.cos(a)*3.6,z=5.4+Math.sin(a)*2.5;mesh(new THREE.BoxGeometry(.78,.34,.42),stoneLight,focus,[x,.18,z],[1,1,1],-a);}
 // two wooden benches with back rails, placed off the path
 for(const [x,z,rot] of [[-4,3,.35],[4,4,-.4]]){
   const b=new THREE.Group();b.position.set(x,0,z);b.rotation.y=rot;focus.add(b);
   mesh(new THREE.BoxGeometry(1.55,.12,.42),wood,b,[0,.52,0],[1,1,1]);
   for(const px of [-.58,.58]){mesh(new THREE.BoxGeometry(.12,.5,.12),bark,b,[px,.28,0],[1,1,1]);mesh(new THREE.BoxGeometry(.12,.62,.12),bark,b,[px,.75,-.18],[1,1,1]);}
   mesh(new THREE.BoxGeometry(1.55,.1,.12),wood,b,[0,.83,-.2],[1,1,1]);
   for(let slat=0;slat<3;slat++)mesh(new THREE.BoxGeometry(1.5,.035,.035),trim,b,[0,.85+slat*.015,-.24+slat*.06],[1,1,1]);
 }
 // raised flower beds with varied foliage and blossoms
 for(const [x,z] of [[-5,-2],[5,1],[-4,7],[5,8]]){
   mesh(new THREE.CylinderGeometry(1.1,1.2,.22,18),bark,focus,[x,.1,z],[1,1,1]);
   for(let i=0;i<14;i++){const a=i*2.4,r=.5+(i%4)*.13,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r;const stemH=.25+(i%3)*.12;
     mesh(new THREE.CylinderGeometry(.018,.025,stemH,5),grassMats[i%3],focus,[px,.22+stemH/2,pz],[1,1,1]);
     mesh(new THREE.SphereGeometry(.12+(i%3)*.02,10,8),i%3?material(0xd8c49a):material(0xb58a82),focus,[px,.22+stemH,pz],[1,.8,1]);
     for(let q=0;q<3;q++){mesh(new THREE.SphereGeometry(.065,8,6),leafMats[(i+q)%3],focus,[px+Math.cos(q*2.1)*.12,.32+q*.06,pz+Math.sin(q*2.1)*.12],[1,.6,1]);}
   }
 }
 // soft path-side stones in the character's immediate clearing
 for(let i=0;i<24;i++){const a=i*2.399,r=4.6+(i%4)*.35;const x=Math.cos(a)*r,z=5.2+Math.sin(a)*r*.72,s=.16+(i%3)*.07;mesh(new THREE.DodecahedronGeometry(s,0),i%2?stone:stoneLight,focus,[x,s*.55,z],[1,.65,1.15],a);}
\n // stepping stones around the clearing
 for(let i=0;i<18;i++){const a=i/18*Math.PI*2;const x=Math.cos(a)*7,z= Math.sin(a)*5;mesh(new THREE.CylinderGeometry(.42,.5,.13,7),stoneLight,scene,[x,.04,z],[1,1,1],a);}
 // lantern posts
 const lanterns=[];
 for(const [x,z] of [[-5,-1],[6,-11],[-12,-13],[15,7]]){const p=new THREE.Group();p.position.set(x,0,z);scene.add(p);mesh(new THREE.CylinderGeometry(.07,.1,2.2,8),bark,p,[0,1.1,0],[1,1,1]);mesh(new THREE.BoxGeometry(.42,.45,.42),wood,p,[0,2.25,0],[1,1,1]);const bulb=new THREE.PointLight(0xffc77e,1.3,8,2);bulb.position.set(0,2.25,0);p.add(bulb);lanterns.push(bulb);}
 // ambient floating pollen
 const pollenGeo=new THREE.BufferGeometry(),count=180,arr=new Float32Array(count*3);for(let i=0;i<count;i++){arr[i*3]=(Math.random()-.5)*34;arr[i*3+1]=Math.random()*5+.3;arr[i*3+2]=(Math.random()-.5)*34;}pollenGeo.setAttribute('position',new THREE.BufferAttribute(arr,3));const pollen=new THREE.Points(pollenGeo,new THREE.PointsMaterial({color:0xf4dca8,size:.055,transparent:true,opacity:.58,depthWrite:false}));scene.add(pollen);
 return {scene,lanterns,pollen};
}