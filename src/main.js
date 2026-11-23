import * as THREE from 'three';
import {createWorld} from './world.js';
import {createLayla} from './character.js';
import {loadWorldAssets} from './asset-world.js';

const $=id=>document.getElementById(id);
const canvas=$('world'),loading=$('loading'),intro=$('intro'),hud=$('hud'),crosshair=$('crosshair'),mobile=$('mobile-controls'),interaction=$('interaction'),dialogue=$('dialogue');
window.__LAYLA_BOOT_STAGE='Three.js module imported; creating WebGL renderer';
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<800?1.35:1.7));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
window.__LAYLA_BOOT_STAGE='WebGL renderer created; generating world';
const {scene,lanterns,pollen,obstacles,groundHeight,updateFauna}=createWorld();
const worldAssets=loadWorldAssets(scene,groundHeight);
const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,180);camera.position.set(0,4.2,10);
const player=new THREE.Group();scene.add(player);player.position.set(0,0,7.2);
window.__LAYLA_BOOT_STAGE='World generated; creating character';
const layla=createLayla();layla.position.set(-1.25,groundHeight(-1.25,-2.7),-2.7);layla.rotation.y=.25;scene.add(layla);
const groundRay=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0);
const keys=new Set();let started=false,dialogueOpen=false,nearLayla=false,yaw=0,pitch=.2,dragging=false,lastX=0,lastY=0,velocityY=0,onGround=true,walkTime=0;
const move={x:0,y:0};let stickPointer=null;
const camTarget=new THREE.Vector3(),desiredCamera=new THREE.Vector3();
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));}
addEventListener('resize',resize);
function start(){if(started)return;started=true;intro.hidden=true;hud.hidden=false;crosshair.hidden=false;mobile.hidden=innerWidth>800;const phone=innerWidth<=800;$('bottom-hint').textContent=phone?'عصا الحركة يسارًا · اسحب لتدوير الكاميرا':'W A S D للحركة · اسحب لتدوير الكاميرا · E للتفاعل';interaction.querySelector('span').textContent=phone?'':'اضغط E';}
$('start-button').addEventListener('click',start);
$('help-button').addEventListener('click',()=>$('help-panel').hidden=!$('help-panel').hidden);
$('close-help').addEventListener('click',()=>$('help-panel').hidden=true);
$('close-dialogue').addEventListener('click',()=>{dialogue.hidden=true;dialogueOpen=false;});
let laylaActivity='idle',laylaTarget=0,laylaPause=1.5,laylaClock=0,laylaGreeting=false;
const laylaRoute=[
 {x:-4,z:3,action:'sit',pause:8},
 {x:3.5,z:4,action:'sit',pause:7},
 {x:8,z:-1.5,action:'inspect',pause:3},
 {x:5,z:9,action:'inspect',pause:2.5},
 {x:-2,z:1,action:'idle',pause:2}
];
function interact(){
 if(!started||!nearLayla)return;
 dialogueOpen=true;dialogue.hidden=false;
 const lines={
   inspect:'كنت أتفقد المكان… انظر إلى هذه التفاصيل الصغيرة، الوادي مليء بأشياء قد لا تلاحظها من أول مرة.',
   walk:'كنت في جولة قصيرة. أحب أن أتمشى وأكتشف ما يتغير حولي.',
   greet:'أهلاً بك! كنت أريد أن أريك هذا المكان. هل لاحظت الطريق والحوض؟',
   idle:'جميل أنك هنا. خذ وقتك، لا داعي للاستعجال… يمكننا استكشاف الوادي معاً.'
 };
 $('dialogue-text').textContent=laylaGreeting?'أهلاً بعودتك. هل نكمل جولتنا؟':(lines[laylaActivity]||lines.idle);
 laylaGreeting=true;
}
addEventListener('keydown',e=>{keys.add(e.code);if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code==='KeyE')interact();if(e.code==='Space'&&onGround&&started){velocityY=5.4;onGround=false;}});
addEventListener('keyup',e=>keys.delete(e.code));
canvas.addEventListener('pointerdown',e=>{if(!started)return;dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!dragging||!started)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;yaw-=dx*.0052;pitch=THREE.MathUtils.clamp(pitch+dy*.004,-.12,.72);});
canvas.addEventListener('pointerup',()=>dragging=false);canvas.addEventListener('pointercancel',()=>dragging=false);
$('mobile-action').addEventListener('click',interact);
const stick=$('stick'),knob=$('stick-knob');
stick.addEventListener('pointerdown',e=>{stickPointer=e.pointerId;stick.setPointerCapture(e.pointerId);updateStick(e);});
stick.addEventListener('pointermove',e=>{if(e.pointerId===stickPointer)updateStick(e);});
function updateStick(e){const r=stick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const len=Math.hypot(dx,dy),max=34;if(len>max){dx=dx/len*max;dy=dy/len*max;}move.x=dx/max;move.y=-dy/max;knob.style.transform=`translate(${dx}px,${dy}px)`;}
function releaseStick(e){if(e.pointerId!==stickPointer)return;stickPointer=null;move.x=move.y=0;knob.style.transform='translate(0,0)';}
stick.addEventListener('pointerup',releaseStick);stick.addEventListener('pointercancel',releaseStick);
function updateLayla(dt,t){
 const target=laylaRoute[laylaTarget],dx=target.x-layla.position.x,dz=target.z-layla.position.z,dist=Math.hypot(dx,dz);
 const playerDist=Math.hypot(player.position.x-layla.position.x,player.position.z-layla.position.z);
 let state='idle',face=0;
 if(playerDist<4.2&&started&&!dialogueOpen){
   state=playerDist<2.7?'greet':'idle';
   face=Math.atan2(player.position.x-layla.position.x,player.position.z-layla.position.z)-layla.rotation.y;
   layla.rotation.y=THREE.MathUtils.damp(layla.rotation.y,Math.atan2(player.position.x-layla.position.x,player.position.z-layla.position.z),3,dt);
   if(!laylaGreeting&&playerDist<3.1)laylaActivity='greet';
 } else if(laylaPause>0){
   laylaPause-=dt;state=laylaActivity==='inspect'?'inspect':laylaActivity==='sit'?'sit':'idle';
   if(state==='inspect')face=.45*Math.sin(t*.8);
 } else if(dist<.38){
   laylaActivity=target.action;laylaPause=target.pause;laylaTarget=(laylaTarget+1)%laylaRoute.length;state=target.action;
 } else {
   state='walk';
   let vx=dx/Math.max(dist,.001),vz=dz/Math.max(dist,.001);
   // Soft steering around trees, pond and cabin; never push the character through an obstacle.
   for(const o of obstacles){const ox=layla.position.x-o.x,oz=layla.position.z-o.z,d=Math.hypot(ox,oz),safe=o.r+.62;if(d<safe+1.25&&d>.001){const force=(safe+1.25-d)/(safe+1.25);vx+=ox/d*force*1.8;vz+=oz/d*force*1.8;}}
   const len=Math.hypot(vx,vz)||1;vx/=len;vz/=len;
   const nx=layla.position.x+vx*1.15*dt,nz=layla.position.z+vz*1.15*dt;
   let clear=true;for(const o of obstacles){if(Math.hypot(nx-o.x,nz-o.z)<o.r+.5){clear=false;break;}}
   if(clear){layla.position.x=nx;layla.position.z=nz;}
   layla.rotation.y=THREE.MathUtils.damp(layla.rotation.y,Math.atan2(vx,vz),5,dt);
 }
 if(dialogueOpen)state='idle';
 layla.position.y=groundHeight(layla.position.x,layla.position.z);layla.userData.animate?.(dt,t,state,face);
}
function update(dt,t){
 const forward=(keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0)+move.y;
 const side=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0)+move.x;
 const inputLen=Math.hypot(forward,side),moving=inputLen>.08&&!dialogueOpen;
 if(moving){const f=Math.min(1,inputLen),dx=(Math.sin(yaw)*forward+Math.cos(yaw)*side)/Math.max(1,inputLen),dz=(-Math.cos(yaw)*forward+Math.sin(yaw)*side)/Math.max(1,inputLen);const nx=player.position.x+dx*5.2*dt*f,nz=player.position.z+dz*5.2*dt*f;let blocked=false;for(const o of obstacles){const ox=nx-o.x,oz=nz-o.z;if(ox*ox+oz*oz<(o.r+.38)*(o.r+.38)){blocked=true;break;}}if(!blocked){player.position.x=nx;player.position.z=nz;}player.rotation.y=Math.atan2(dx,dz);walkTime+=dt*10;}
 velocityY-=12*dt;player.position.y+=velocityY*dt;const floorY=groundHeight(player.position.x,player.position.z);if(player.position.y<floorY){player.position.y=floorY;velocityY=0;onGround=true;}
 player.position.x=THREE.MathUtils.clamp(player.position.x,-36,36);player.position.z=THREE.MathUtils.clamp(player.position.z,-38,34);
 updateLayla(dt,t);
 const dist=player.position.distanceTo(layla.position);nearLayla=dist<2.65&&started&&!dialogueOpen;interaction.hidden=!nearLayla||dialogueOpen;interaction.querySelector('span').textContent=innerWidth<=800?'':'اضغط E';
 const target=new THREE.Vector3(player.position.x,player.position.y+1.35,player.position.z);camTarget.lerp(target,1-Math.exp(-12*dt));
 const radius=6.4,cp=Math.cos(pitch),sp=Math.sin(pitch);desiredCamera.set(camTarget.x+Math.sin(yaw)*radius*cp,camTarget.y+2.1+sp*radius,camTarget.z+Math.cos(yaw)*radius*cp);camera.position.lerp(desiredCamera,1-Math.exp(-10*dt));camera.lookAt(camTarget);
 pollen.rotation.y=t*.012;updateFauna?.(dt,t);worldAssets.update(dt,t);lanterns.forEach((l,i)=>{l.intensity=1.15+Math.sin(t*2+i)*.13;});
}
window.__LAYLA_BOOT_STAGE='Character created; starting animation loop';
let prev=performance.now();function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-prev)/1000,.04);prev=now;update(dt,now/1000);renderer.render(scene,camera);}
requestAnimationFrame(frame);
window.__LAYLA_BOOT_STAGE='Animation loop started; scene rendering';
setTimeout(()=>loading.classList.add('done'),650);
setTimeout(()=>loading.remove(),1450);
$('location-name').textContent='بداية الوادي';


// Conversation shell: the browser never talks directly to an AI provider or stores secrets.
// The same-origin private server must implement POST /api/layla/chat.
const chatPanel=$('chat-panel'),chatMessages=$('chat-messages'),chatForm=$('chat-form'),chatInput=$('chat-input'),chatSend=$('chat-send'),chatStatus=$('chat-status');
let chatConversationId='layla-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
function addChatMessage(text,kind='assistant'){
 const empty=chatMessages.querySelector('.chat-empty');if(empty)empty.remove();
 const node=document.createElement('div');node.className='chat-message '+kind;node.textContent=text;
 chatMessages.appendChild(node);chatMessages.scrollTop=chatMessages.scrollHeight;return node;
}
function toggleChat(open){
 chatPanel.hidden=!open;
 if(open){$('help-panel').hidden=true;chatInput.focus();}
}
$('chat-button').addEventListener('click',()=>toggleChat(chatPanel.hidden));
$('chat-close').addEventListener('click',()=>toggleChat(false));
chatForm.addEventListener('submit',async event=>{
 event.preventDefault();
 const message=chatInput.value.trim();if(!message||chatSend.disabled)return;
 addChatMessage(message,'user');chatInput.value='';chatSend.disabled=true;chatStatus.textContent='تكتب ليلى...';
 try{
  const response=await fetch('/api/layla/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,conversation_id:chatConversationId,source:'layla-web'})});
  if(!response.ok)throw new Error('HTTP '+response.status);
  const data=await response.json();
  const reply=typeof data.reply==='string'?data.reply:(typeof data.message==='string'?data.message:'');
  if(!reply)throw new Error('EMPTY_REPLY');
  addChatMessage(reply,'assistant');chatStatus.textContent='متصلة';
 }catch(error){
  addChatMessage('لم يصلني رد من خادم ليلى. واجهة المحادثة جاهزة، لكن خدمة العقل غير متصلة أو أن مسار /api/layla/chat غير مفعّل بعد. لم أختلق ردًا بدلًا منها.','error');
  chatStatus.textContent='الخادم غير متصل';
  console.warn('Layla chat endpoint unavailable:',error);
 }finally{chatSend.disabled=false;chatInput.focus();}
});
chatInput.addEventListener('keydown',event=>{
 if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();chatForm.requestSubmit();}
});
