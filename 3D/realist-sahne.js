const scene=new Scene();scene.background=new Color('#b9cbd5');scene.fog=new Fog('#b9cbd5',145,330);
const renderer=new WebGLRenderer({antialias:true});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=PCFSoftShadowMap;renderer.toneMapping=ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;document.body.appendChild(renderer.domElement);
const camera=new PerspectiveCamera(40,innerWidth/innerHeight,.15,600);
scene.add(new HemisphereLight('#dbeeff','#716657',2));
const sun=new DirectionalLight('#fff0d4',3.2);sun.position.set(-4,55,-30);sun.target.position.set(-27,0,15);sun.castShadow=true;sun.shadow.mapSize.set(4096,4096);Object.assign(sun.shadow.camera,{left:-85,right:85,top:65,bottom:-65,near:1,far:180});sun.shadow.normalBias=.035;sun.shadow.bias=-.00015;scene.add(sun,sun.target);
const model=new Group();model.name='Aura Fitness — detailed local concept';scene.add(model);
let seed=132;function rng(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
function surface(base,tile){const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');ctx.fillStyle=base;ctx.fillRect(0,0,512,512);for(let i=0;i<55000;i++){const v=rng()>.5?255:0;ctx.fillStyle=`rgba(${v},${v},${v},${rng()*.10})`;ctx.fillRect(rng()*512,rng()*512,1+rng()*2,1+rng()*2)}if(tile){ctx.strokeStyle='#93938d';ctx.lineWidth=2;for(let i=0;i<=512;i+=128){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,512);ctx.moveTo(0,i);ctx.lineTo(512,i);ctx.stroke()}}const t=new CanvasTexture(c);t.colorSpace=SRGBColorSpace;t.wrapS=t.wrapT=RepeatWrapping;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t}
const asphalt=surface('#55595c',false),paving=surface('#beb9ad',true);
const paint={};function mat(color,metalness=0,roughness=.65){return new MeshStandardMaterial({color,metalness,roughness})}
const black=mat('#151b20',.2,.35),chrome=mat('#aeb5b9',.8,.23),rubber=mat('#141719',0,.94),glass=new MeshPhysicalMaterial({color:'#243c48',metalness:.45,roughness:.13,clearcoat:1});
function addMesh(g,m,pos,rot=0,parent=model){const mesh=new Mesh(g,m);mesh.position.set(...pos);mesh.rotation.y=rot;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
function block(pos,size,m,rot=0,parent=model){const o=addMesh(new BoxGeometry(...size),m,pos,rot,parent);return o}
function bevel(w,h,d,r=.08){const shape=new Shape();const x=-w/2,y=-h/2;shape.moveTo(x+r,y);shape.lineTo(x+w-r,y);shape.quadraticCurveTo(x+w,y,x+w,y+r);shape.lineTo(x+w,y+h-r);shape.quadraticCurveTo(x+w,y+h,x+w-r,y+h);shape.lineTo(x+r,y+h);shape.quadraticCurveTo(x,y+h,x,y+h-r);shape.lineTo(x,y+r);shape.quadraticCurveTo(x,y,x+r,y);const g=new ExtrudeGeometry(shape,{depth:d-2*r,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:r,bevelThickness:r,curveSegments:6});g.translate(0,0,-d/2+r);return g}
const removedCars=new Set(['Parked car 0 13 body','Parked car 1 13 body']);
const cars=items.filter(o=>/^(Parked car|West car)/.test(o.name)&&o.name.endsWith(' body')&&!removedCars.has(o.name));const treeItems=items.filter(o=>o.name==='Tree trunk');
for(const o of items){if(/^(Parked car|West car)/.test(o.name)||o.name.startsWith('Tree '))continue;
if(/^C[123] /.test(o.name)||/^B[123] .* arm /.test(o.name))continue;
if(o.name==='Parking bay line' && o.pos[0]<-51 && o.pos[2]<30)continue;
let m=paint[o.color]??=mat(o.color);let g=new BoxGeometry(...o.size);
if(/asphalt|public road/i.test(o.name)){const t=asphalt.clone();t.needsUpdate=true;t.repeat.set(o.size[0]/4,o.size[2]/4);m=new MeshStandardMaterial({map:t,roughness:.98,bumpMap:t,bumpScale:.025})}
if(/sidewalk|curb/i.test(o.name)){const t=paving.clone();t.needsUpdate=true;t.repeat.set(o.size[0]/2,o.size[2]/2);m=new MeshStandardMaterial({map:t,roughness:.95})}
if(/glazing|door/i.test(o.name))m=glass;
if(/motor/.test(o.name)){g=bevel(...o.size,.04);m=mat('#e7e9e8',.65,.28)}
if(/pole|Fence|rail/.test(o.name))m=chrome;
const mesh=addMesh(g,m,o.pos,o.rot);mesh.name=o.name;
}
// Rounded vehicle bodies, curved tyres, alloy wheels, glazing, mirrors and lights.
for(const o of cars){const group=new Group();group.name=o.name.replace(' body','');group.position.set(o.pos[0],0,o.pos[2]);group.rotation.y=o.rot;model.add(group);const body=new MeshPhysicalMaterial({color:o.color,metalness:.65,roughness:.25,clearcoat:1,clearcoatRoughness:.13});
addMesh(bevel(1.72,.52,4.05,.12),body,[0,.69,0],0,group);addMesh(bevel(1.42,.59,2.03,.10),glass,[0,1.17,.15],0,group);addMesh(bevel(1.4,.07,1.62,.03),body,[0,1.49,.22],0,group);
block([0,.89,-1.45],[1.61,.08,.95],body,0,group);block([0,.49,-2.04],[1.5,.18,.08],black,0,group);block([0,.51,2.04],[1.5,.14,.08],black,0,group);
for(const x of [-.88,.88]){for(const z of [-1.29,1.29]){const tyre=addMesh(new CylinderGeometry(.34,.34,.22,24),rubber,[x,.36,z],0,group);tyre.rotation.z=Math.PI/2;const hub=addMesh(new CylinderGeometry(.22,.22,.235,16),chrome,[x,.36,z],0,group);hub.rotation.z=Math.PI/2}block([x,1.13,-.52],[.18,.13,.27],body,0,group)}
for(const x of [-.55,.55]){block([x,.77,-2.04],[.45,.13,.035],mat('#e8f0ed',.2,.15),0,group);block([x,.77,2.04],[.44,.12,.035],mat('#ac1e20',.1,.25),0,group)}
for(const z of [-.75,.9])block([0,1.19,z],[1.46,.60,.045],body,0,group);
block([0,.58,-2.09],[.42,.1,.015],mat('#eeeeeb'),0,group);
}

// Bullet camera assembly: mounting plate, adjustable joint, sunshield, optical glass and IR emitters.
const cameraWhite=mat('#eeefeb',.35,.32),lensGlass=new MeshPhysicalMaterial({color:'#152f46',metalness:.5,roughness:.06,clearcoat:1});
function securityCamera(name,x,z,plateTarget){
 const g=new Group();g.name=name;g.position.set(x,0,z);model.add(g);
 addMesh(new CylinderGeometry(.045,.065,2.0,20),chrome,[0,1,0],0,g);
 block([0,.035,0],[.24,.07,.24],chrome,0,g);
 const head=new Group();head.name=name+'_head';head.position.set(0,2.05,0);head.quaternion.setFromRotationMatrix(new Matrix4().lookAt(new Vector3(x,2.20,z),new Vector3(...plateTarget),new Vector3(0,1,0)));g.add(head);
 const plate=addMesh(new CylinderGeometry(.105,.105,.04,24),cameraWhite,[0,-.02,.16],0,head);plate.rotation.x=Math.PI/2;
 block([0,.04,.12],[.055,.12,.12],chrome,0,head);
 addMesh(new SphereGeometry(.055,12,8),chrome,[0,.09,.10],0,head);
 addMesh(bevel(.21,.20,.43,.025),cameraWhite,[0,.15,-.08],0,head);
 addMesh(bevel(.19,.18,.022,.009),black,[0,.15,-.303],0,head);
 const ring=addMesh(new CylinderGeometry(.061,.061,.018,32),black,[0,.15,-.324],0,head);ring.rotation.x=Math.PI/2;
 const lens=addMesh(new CylinderGeometry(.047,.047,.02,32),lensGlass,[0,.15,-.337],0,head);lens.rotation.x=Math.PI/2;
 for(const dx of [-.068,.068])for(const dy of [-.047,.047]){const led=addMesh(new SphereGeometry(.012,10,8),mat('#939b9f',.5,.2),[dx,.15+dy,-.326],0,head)}
 block([0,.265,-.10],[.25,.025,.51],cameraWhite,0,head);
 for(const dx of [-.075,.075])block([dx,.015,.185],[.012,.012,.01],chrome,0,head);
}
securityCamera('C1_detailed_bullet_camera',-4.55,2.2,[-1.9,.58,4.5]);
securityCamera('C2_detailed_bullet_camera',-27.4,.5,[-30,.58,3.9]);
securityCamera('C3_detailed_bullet_camera',-36.6,3.6,[-34,.58,.1]);
// Each arm has a genuine hinge at the motor housing.
function boom(name,x,z,angle){const pivot=new Group();pivot.name=name;pivot.position.set(x,1.02,z);pivot.rotation.y=angle;model.add(pivot);const arm=new Group();arm.name=name+'_lifting_arm';pivot.add(arm);
for(let i=0;i<16;i++)block([(i+.5)*.25,0,0],[.25,.12,.09],i%2?mat('#df3934',.2,.4):mat('#f5f2e8',.3,.35),0,arm);
addMesh(new SphereGeometry(.11,16,12),chrome,[0,0,0],0,pivot);return arm}
const sideArm=boom('Side_barrier',-4,2.5,-Math.PI/2);
const exitArm=boom('Exit_barrier',-28,1.8,Math.PI);
const entryArm=boom('Entry_barrier',-36,1.8,0);
// One demonstration car follows the approved free circulation aisle.
const demoCar=model.children.find(o=>o.name==='Parked car 0 0').clone(true);demoCar.name='Animated_demo_vehicle';demoCar.position.set(-34,0,-6);demoCar.rotation.set(0,Math.PI,0);model.add(demoCar);
const route=new CatmullRomCurve3([[-34,6],[-35,8.5],[-49,8.5],[-55,11],[-56,23],[-52,28],[-17,28],[-11,25],[-11,12],[-15,8.8],[-26,8.8],[-30,6]].map(([x,z])=>new Vector3(x,0,z)),false,'centripetal');
const approachRoute=new CatmullRomCurve3([[-62,-5],[-48,-5],[-39,-5],[-35.5,-4.5],[-34,-3.2],[-34,-2]].map(([x,z])=>new Vector3(x,0,z)),false,'centripetal');
const departureRoute=new CatmullRomCurve3([[-30,6],[-30,2],[-30,-1.5],[-28.8,-3.8],[-25,-5],[-10,-5],[4,-5]].map(([x,z])=>new Vector3(x,0,z)),false,'centripetal');
const duration=64;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
function gateValue(t,start,fully,close,end){return (Math.PI/2-.05)*smooth((t-start)/(fully-start))*(1-smooth((t-close)/(end-close)))}
function sample(t){let p,dir;
if(t<8){const u=smooth(t/8);p=approachRoute.getPointAt(u);dir=approachRoute.getTangentAt(u)}
else if(t<10){p=new Vector3(-34,0,-2);dir=new Vector3(0,0,1)}
else if(t<15){p=new Vector3(-34,0,-2+8*smooth((t-10)/5));dir=new Vector3(0,0,1)}
else if(t<45){const u=(t-15)/30;p=route.getPointAt(u);dir=route.getTangentAt(u)}
else if(t<48){p=new Vector3(-30,0,6);dir=new Vector3(0,0,-1)}
else if(t<62){const u=smooth((t-48)/14);p=departureRoute.getPointAt(u);dir=departureRoute.getTangentAt(u)}
else{p=new Vector3(4,0,-5);dir=new Vector3(1,0,0)}
return {p,q:new Quaternion().setFromAxisAngle(new Vector3(0,1,0),Math.atan2(-dir.x,-dir.z)),entry:gateValue(t,8,10,16,18),exit:Math.max(gateValue(t,20,22,29,31),gateValue(t,36,38,45,47),gateValue(t,46,48,57,59))}}
const times=[],positions=[],orientations=[],entryRot=[],exitRot=[];
for(let i=0;i<=duration*10;i++){const t=i/10,v=sample(t);times.push(t);positions.push(...v.p.toArray());orientations.push(...v.q.toArray());entryRot.push(...new Quaternion().setFromAxisAngle(new Vector3(0,0,1),v.entry).toArray());exitRot.push(...new Quaternion().setFromAxisAngle(new Vector3(0,0,1),v.exit).toArray())}
const demoClip=new AnimationClip('Vehicle_entry_circulation_exit',duration,[new VectorKeyframeTrack(demoCar.name+'.position',times,positions),new QuaternionKeyframeTrack(demoCar.name+'.quaternion',times,orientations),new QuaternionKeyframeTrack(entryArm.name+'.quaternion',times,entryRot),new QuaternionKeyframeTrack(exitArm.name+'.quaternion',times,exitRot)]);

// Additional traffic uses vacated bays, with staggered gate reservations.
const curve=pts=>new CatmullRomCurve3(pts.map(([x,z])=>new Vector3(x,0,z)),false,'centripetal');
function travel(path,u,reverse=false){u=Math.max(0,Math.min(1,u));const d=path.getTangentAt(u);return {p:path.getPointAt(u),q:new Quaternion().setFromAxisAngle(new Vector3(0,1,0),Math.atan2(-d.x,-d.z)+(reverse?Math.PI:0))}}
const parkedOne=model.children.find(o=>o.name==='Parked car 0 3');parkedOne.name='Departing_parked_car_one';
const parkedTwo=model.children.find(o=>o.name==='Parked car 0 9');parkedTwo.name='Departing_parked_car_two';
const sideVehicle=demoCar.clone(true);sideVehicle.name='Side_gate_arriving_vehicle';model.add(sideVehicle);
const departureOne=curve([[-24,16],[-25.3,12],[-27,9.5],[-30,8],[-30,6]]);
const departureTwo=curve([[-42,16],[-43.3,12],[-40,9.5],[-34,9.5],[-30,8],[-30,6]]);
const extraOut=curve([[-30,6],[-30,1],[-30,-2],[-28,-4.5],[-22,-5],[13,-5]]);
const sideApproach=curve([[12,4.5],[5,4.5],[.5,4.5]]);
const sideInside=curve([[.5,4.5],[-5,4.5],[-11,5],[-18,8.6],[-23,10.5],[-25.7,10.8]]);
const parkReverse=curve([[-25.7,10.8],[-25.1,12.6],[-24,16]]);
function depart(t,start,stop,go,end,path){if(t<start)return {p:path.getPointAt(0),q:new Quaternion().setFromAxisAngle(new Vector3(0,1,0),.32)};if(t<stop)return travel(path,smooth((t-start)/(stop-start)));if(t<go)return travel(path,1);return travel(extraOut,smooth((t-go)/(end-go)))}
function additional(t){let side;
if(t<14)side=travel(sideApproach,0);
else if(t<19)side=travel(sideApproach,smooth((t-14)/5));
else if(t<21)side=travel(sideApproach,1);
else if(t<30)side=travel(sideInside,smooth((t-21)/9));
else if(t<32){side=travel(sideInside,1);side.q.slerp(new Quaternion().setFromAxisAngle(new Vector3(0,1,0),.32),smooth((t-30)/2))}
else if(t<37)side=travel(parkReverse,smooth((t-32)/5),true);
else side={p:new Vector3(-24,0,16),q:new Quaternion().setFromAxisAngle(new Vector3(0,1,0),.32)};
return [depart(t,15,20,22,31,departureOne),depart(t,30,36,38,47,departureTwo),side]}
const extraActors=[parkedOne,parkedTwo,sideVehicle];
for(let k=0;k<extraActors.length;k++){const ps=[],qs=[];for(const t of times){const v=additional(t)[k];ps.push(...v.p.toArray());qs.push(...v.q.toArray())}demoClip.tracks.push(new VectorKeyframeTrack(extraActors[k].name+'.position',times,ps),new QuaternionKeyframeTrack(extraActors[k].name+'.quaternion',times,qs))}
for(let k=0;k<2;k++){const scales=[];for(const t of times){const v=t>=(k===0?31:47)?.001:1;scales.push(v,v,v)}demoClip.tracks.push(new VectorKeyframeTrack(extraActors[k].name+'.scale',times,scales))}
const sideRot=[];for(const t of times)sideRot.push(...new Quaternion().setFromAxisAngle(new Vector3(0,0,1),gateValue(t,19,21,27,29)).toArray());demoClip.tracks.push(new QuaternionKeyframeTrack(sideArm.name+'.quaternion',times,sideRot));
let simTime=0,playing=true,previousFrame=null;
window.toggleSimulation=()=>{playing=!playing;document.querySelector('#play').textContent=playing?'Duraklat':'Oynat'};
window.resetSimulation=()=>{simTime=0;applySimulation(0)};
function applySimulation(t){additional(t).forEach((v,i)=>{extraActors[i].position.copy(v.p);extraActors[i].quaternion.copy(v.q);if(i<2)extraActors[i].scale.setScalar(t>=(i===0?31:47)?.001:1)});sideArm.rotation.z=gateValue(t,19,21,27,29);const v=sample(t);demoCar.position.copy(v.p);demoCar.quaternion.copy(v.q);entryArm.rotation.z=v.entry;exitArm.rotation.z=v.exit;const status=t<8?'Araç sağdan geliyor ve girişe dönüyor':t<10?'Giriş bariyeri açılıyor':t<18?'Araç giriş yapıyor':t<45?'Araç otopark içinde dolaşıyor':t<48?'Çıkış bariyeri açılıyor':t<62?'Araç çıkıştan sola devam ediyor':'Yeni geçiş bekleniyor';document.querySelector('#sim-status').textContent=t>=15&&t<37?'Parktan çıkış ve yan kapı girişi':t>=37&&t<47?'Parktan çıkan araç ana kapıya ilerliyor':status}

// Organic crowns with clustered volumes and visible branching.
for(const o of treeItems){const [x,,z]=o.pos;const trunk=addMesh(new CylinderGeometry(.11,.18,2.6,10),mat('#6a5140'),[x,1.3,z]);for(let j=0;j<16;j++){const a=rng()*Math.PI*2,rad=rng()*1.25;const crown=addMesh(new IcosahedronGeometry(.65+rng()*.55,2),mat(new Color().setHSL(.25+rng()*.06,.27+rng()*.15,.20+rng()*.1)),[x+Math.cos(a)*rad,2.6+rng()*1.8,z+Math.sin(a)*rad]);crown.scale.y=1.2}}
// Glazing mullions, stone facade bands and metal roof edges.
for(const [x,z,w,d,h] of [[7,23,14,31,8.4],[-69,23,16,31,12]]){
const stone=mat('#d8d0bc',0,.91),trim=mat('#41494b',.65,.38);
for(let level=1;level<h;level+=3.2){block([x,level,z-d/2-.025],[w,.10,.10],stone);block([x+w/2+.025,level,z],[.10,.10,d],stone)}
for(let xx=x-w/2+.3;xx<x+w/2;xx+=2.3)block([xx,3.2,z-d/2-.055],[.06,5,.08],trim);
block([x,h+.28,z-d/2],[w,.35,.13],trim);block([x,h+.28,z+d/2],[w,.35,.13],trim);
for(let zz=10;zz<37;zz+=1.5)block([x+w/2+.04,3.6,zz],[.08,5.5,.06],trim);
}
// Flexible orange lane separators: no raised median, existing booms preserved.
const orange=mat('#f36b13',.05,.43),reflector=mat('#f6f4e7',.15,.24);
for(const z of [3.2,5.05,6.9]){
 const base=addMesh(new CylinderGeometry(.19,.22,.07,24),rubber,[-32,.05,z]);base.name='Delineator base';
 const post=addMesh(new CylinderGeometry(.065,.085,.73,20),orange,[-32,.445,z]);post.name='Orange lane delineator';
 for(const y of [.53,.70]){const band=addMesh(new CylinderGeometry(.072,.075,.075,20),reflector,[-32,y,z]);band.name='Delineator reflective band'}
}
// Route runs from the right entry around the parked rows and back to the left exit.
function routeArrow(x,z,dx,dz){const shape=new Shape();shape.moveTo(-.12,.65);shape.lineTo(.12,.65);shape.lineTo(.12,-.05);shape.lineTo(.44,-.05);shape.lineTo(0,-.65);shape.lineTo(-.44,-.05);shape.lineTo(-.12,-.05);shape.closePath();const mesh=new Mesh(new ShapeGeometry(shape),mat('#e5e4d9',0,.9));mesh.rotation.x=-Math.PI/2;mesh.rotation.z=Math.atan2(dx,dz);mesh.position.set(x,.03,z);mesh.name='Circulation route arrow';model.add(mesh)}
routeArrow(-43,8,-1,0);routeArrow(-55,14,0,1);routeArrow(-55,22,0,1);routeArrow(-45,28,1,0);routeArrow(-28,28,1,0);routeArrow(-11,22,0,-1);routeArrow(-11,13,0,-1);routeArrow(-22,8,-1,0);

// Road-side context and small foundation pads around equipment.
block([-28,-.34,16],[150,.25,110],mat('#858779'));
for(const o of items.filter(o=>o.name.endsWith('motor')))block([o.pos[0],.05,o.pos[2]],[.68,.10,.68],mat('#bcb8ad'));
const texture=new TextureLoader().load(signURL);texture.colorSpace=SRGBColorSpace;texture.anisotropy=8;
for(const [pos,angle] of [[[-69,9.3,7.28],Math.PI],[[-60.78,9.3,23],Math.PI/2]]){const sign=addMesh(new PlaneGeometry(14,5),new MeshStandardMaterial({map:texture,roughness:.65,side:DoubleSide,emissive:'#ffffff',emissiveMap:texture,emissiveIntensity:.12}),pos,angle);sign.name='Aura Fitness illuminated sign'}
let target=new Vector3(-31,0,17),r=Math.max(118,122/Math.max(.65,innerWidth/innerHeight)),theta=.12,phi=.83;
function update(){camera.position.set(target.x+r*Math.sin(theta)*Math.sin(phi),target.y+r*Math.cos(phi),target.z-r*Math.cos(theta)*Math.sin(phi));camera.lookAt(target)}
window.view=(s)=>{if(s==='all'){target.set(-31,0,17);r=Math.max(118,122/Math.max(.65,innerWidth/innerHeight));theta=.12;phi=.83}if(s==='side'){target.set(-4,1,5);r=19;theta=.35;phi=1.20}if(s==='main'){target.set(-32,1,2);r=22;theta=.2;phi=1.18}if(s==='camera'){target.set(-36.6,2.18,3.6);r=1.7;theta=.65;phi=1.35}if(s==='building'){target.set(-66,5,16);r=39;theta=.75;phi=1.15}update()};
window.exportModel=async()=>{const button=document.querySelector('#export');button.textContent='Hazırlanıyor…';try{const result=await new GLTFExporter().parseAsync(model,{binary:true,animations:[demoClip]});const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([result],{type:'model/gltf-binary'}));a.download='aura-otopark-realist.glb';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000)}finally{button.textContent='GLB indir'}};
let drag=null;renderer.domElement.oncontextmenu=e=>e.preventDefault();renderer.domElement.onpointerdown=e=>{drag={x:e.clientX,y:e.clientY,b:e.button};renderer.domElement.setPointerCapture(e.pointerId)};renderer.domElement.onpointerup=()=>drag=null;renderer.domElement.onpointermove=e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(drag.b===2){target.x-=dx*r*.001;target.z-=dy*r*.001}else{theta-=dx*.006;phi=Math.max(.05,Math.min(1.5,phi+dy*.006))}drag.x=e.clientX;drag.y=e.clientY;update()};renderer.domElement.onwheel=e=>{e.preventDefault();r=Math.max(8,Math.min(240,r*Math.exp(e.deltaY*.001)));update()};onresize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)};update();renderer.setAnimationLoop(ms=>{if(previousFrame!==null&&playing)simTime=(simTime+Math.min((ms-previousFrame)/1000,.1))%duration;previousFrame=ms;applySimulation(simTime);renderer.render(scene,camera)});
