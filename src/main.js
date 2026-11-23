import * as THREE from 'three';
import {createWorld} from './world.js';
import {createLayla} from './character.js';

const $=id=>document.getElementById(id);
const canvas=$('world'),loading=$('loading'),intro=$('intro'),hud=$('hud'),crosshair=$('crosshair'),mobile=$('mobile-controls'),interaction=$('interaction'),dialogue=$('dialogue');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
const {scene,lanterns,pollen}=createWorld();
const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,180);camera.position.set(0,4.2,10);
const player=new THREE.Group();scene.add(player);player.position.set(0,0,5.5);
const layla=createLayla();layla.position.set(-1.1,0,-3.5);layla.rotation.y=.25;scene.add(layla);
const groundRay=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0);
const keys=new Set();let started=false,dialogueOpen=false,nearLayla=false,yaw=0,pitch=.2,dragging=false,lastX=0,lastY=0,velocityY=0,onGround=true,walkTime=0;
const move={x:0,y:0};let stickPointer=null;
const camTarget=new THREE.Vector3(),desiredCamera=new THREE.Vector3();
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));}
addEventListener('resize',resize);
function start(){if(started)return;started=true;intro.hidden=true;hud.hidden=false;crosshair.hidden=false;mobile.hidden=innerWidth>800;$('bottom-hint').textContent=innerWidth>800?'W A S D للحركة · اسحب لتدوير الكاميرا · E للتفاعل':'استخدم عصا الحركة واسحب الشاشة لتدوير الكاميرا';}
$('start-button').addEventListener('click',start);
$('help-button').addEventListener('click',()=>$('help-panel').hidden=!$('help-panel').hidden);
$('close-help').addEventListener('click',()=>$('help-panel').hidden=true);
$('close-dialogue').addEventListener('click',()=>{dialogue.hidden=true;dialogueOpen=false;});
function interact(){if(!started||!nearLayla)return;dialogueOpen=true;dialogue.hidden=false;$('dialogue-text').textContent='أهلاً بك في الوادي. هذا المكان يتغيّر كلما اكتشفنا جزءاً جديداً منه. هل نبدأ جولتنا؟';}
addEventListener('keydown',e=>{keys.add(e.code);if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code==='KeyE')interact();if(e.code==='Space'&&onGround&&started){velocityY=5.4;onGround=false;}});
addEventListener('keyup',e=>keys.delete(e.code));
canvas.addEventListener('pointerdown',e=>{if(!started)return;dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!dragging||!started)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;yaw-=dx*.004;pitch=THREE.MathUtils.clamp(pitch+dy*.003,-.08,.62);});
canvas.addEventListener('pointerup',()=>dragging=false);canvas.addEventListener('pointercancel',()=>dragging=false);
$('mobile-action').addEventListener('click',interact);
const stick=$('stick'),knob=$('stick-knob');
stick.addEventListener('pointerdown',e=>{stickPointer=e.pointerId;stick.setPointerCapture(e.pointerId);updateStick(e);});
stick.addEventListener('pointermove',e=>{if(e.pointerId===stickPointer)updateStick(e);});
function updateStick(e){const r=stick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const len=Math.hypot(dx,dy),max=34;if(len>max){dx=dx/len*max;dy=dy/len*max;}move.x=dx/max;move.y=-dy/max;knob.style.transform=`translate(${dx}px,${dy}px)`;}
function releaseStick(e){if(e.pointerId!==stickPointer)return;stickPointer=null;move.x=move.y=0;knob.style.transform='translate(0,0)';}
stick.addEventListener('pointerup',releaseStick);stick.addEventListener('pointercancel',releaseStick);
function update(dt,t){
 const forward=(keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0)+move.y;
 const side=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0)+move.x;
 const inputLen=Math.hypot(forward,side),moving=inputLen>.08&&!dialogueOpen;
 if(moving){const f=Math.min(1,inputLen),dx=(Math.sin(yaw)*forward+Math.cos(yaw)*side)/Math.max(1,inputLen),dz=(-Math.cos(yaw)*forward+Math.sin(yaw)*side)/Math.max(1,inputLen);player.position.x+=dx*4.2*dt*f;player.position.z+=dz*4.2*dt*f;player.rotation.y=Math.atan2(dx,dz);walkTime+=dt*10;}
 velocityY-=12*dt;player.position.y+=velocityY*dt;if(player.position.y<0){player.position.y=0;velocityY=0;onGround=true;}
 player.position.x=THREE.MathUtils.clamp(player.position.x,-31,31);player.position.z=THREE.MathUtils.clamp(player.position.z,-32,28);
 const rig=layla.userData.rig;rig.legs.forEach((leg,i)=>{leg.rotation.x=moving?Math.sin(walkTime+i*Math.PI)*.48:0;});rig.arms.forEach((arm,i)=>{arm.rotation.x=moving?Math.sin(walkTime+i*Math.PI+Math.PI)*.22:0;});rig.body.position.y=moving?Math.abs(Math.sin(walkTime*2))*.035:0;
 const dist=player.position.distanceTo(layla.position);nearLayla=dist<2.65&&started&&!dialogueOpen;interaction.hidden=!nearLayla||dialogueOpen;
 const target=new THREE.Vector3(player.position.x,player.position.y+1.35,player.position.z);camTarget.lerp(target,1-Math.exp(-6*dt));
 const radius=7.5,cp=Math.cos(pitch),sp=Math.sin(pitch);desiredCamera.set(camTarget.x+Math.sin(yaw)*radius*cp,camTarget.y+2.1+sp*radius,camTarget.z+Math.cos(yaw)*radius*cp);camera.position.lerp(desiredCamera,1-Math.exp(-5*dt));camera.lookAt(camTarget);
 pollen.rotation.y=t*.012;lanterns.forEach((l,i)=>{l.intensity=1.15+Math.sin(t*2+i)*.13;});
}
let prev=performance.now();function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-prev)/1000,.04);prev=now;update(dt,now/1000);renderer.render(scene,camera);}
requestAnimationFrame(frame);
setTimeout(()=>loading.classList.add('done'),650);
setTimeout(()=>loading.remove(),1450);
$('location-name').textContent='بداية الوادي';
