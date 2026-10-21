import json, math, struct, pathlib, random
P=pathlib.Path(__file__).parent
objects=[]
colors={'asphalt':'#50565d','road':'#62666a','cream':'#d5c9ad','roof':'#b9ad91','white':'#f0f0e9','red':'#d93932','green':'#72b742','black':'#242b31','glass':'#416170','metal':'#a8b0b5','yellow':'#edba20','leaf':'#427340','trunk':'#70523a','curb':'#c8c5b9'}
def box(name,pos,size,color,rot=0):
 objects.append(dict(name=name,pos=pos,size=size,color=colors.get(color,color),rot=rot))
def bar(name,a,b,width,color):
 dx=b[0]-a[0]; dz=b[2]-a[2]; length=math.hypot(dx,dz)
 box(name,[(a[i]+b[i])/2 for i in range(3)],[width,width,length],color,math.atan2(dx,dz))
def arrow(name,x,z,angle,color):
 # local arrow points -z
 box(name+' shaft',[x,.035,z],[.22,.025,1.25],color,angle)
 for s in [-1,1]:
  pts=[]
  for px,pz in [(0,-.9),(s*.55,-.2)]:pts.append([x+px*math.cos(angle)+pz*math.sin(angle),.04,z-px*math.sin(angle)+pz*math.cos(angle)])
  bar(name+' head',*pts,.18,color)
def camera(name,x,z,angle):
 box(name+' pole',[x,1.05,z],[.09,2.1,.09],'metal')
 box(name+' white body',[x,2.12,z],[.22,.22,.48],'white',angle)
 box(name+' lens',[x+math.sin(angle)*.25,2.12,z+math.cos(angle)*.25],[.18,.17,.025],'black',angle)
def barrier(name,x,z,dx,dz):
 box(name+' motor',[x,.55,z],[.4,1.1,.4],'white')
 box(name+' front panel',[x,.58,z-.205],[.29,.82,.025],'black')
 for i in range(16):
  d=(i+.5)*.25
  box(name+' arm '+str(i),[x+dx*d,1.02,z+dz*d],[.25 if dx else .09,.12,.25 if dz else .09],'red' if i%2 else 'white')
def car(name,x,z,angle,col):
 def part(n,px,py,pz,s,c):box(name+n,[x+px*math.cos(angle)+pz*math.sin(angle),py,z-px*math.sin(angle)+pz*math.cos(angle)],s,c,angle)
 part(' body',0,.6,0,[1.8,.6,4.2],col);part(' cabin',0,1.12,.15,[1.55,.65,2.15],'glass');part(' roof',0,1.47,.2,[1.5,.08,1.6],col)
 for xx in [-.91,.91]:
  for zz in [-1.3,1.3]:part(' wheel',xx,.34,zz,[.22,.6,.62],'black')
 for xx in [-.6,.6]:part(' headlight',xx,.68,-2.11,[.4,.15,.03],'white');part(' taillight',xx,.68,2.11,[.4,.15,.03],'red')
box('Parking asphalt',[30,-.12,20],[60,.24,40],'asphalt')
box('Front public road',[24,-.16,-5],[84,.25,8],'road')
box('Side road continues west',[-6,-.1,4.7],[20,.2,4.6],'asphalt')
box('Front sidewalk',[25,-.05,-.4],[82,.12,1.2],'curb')
# open central vehicle crossing
box('Main entry flush asphalt',[32,.015,-.4],[8.4,.04,1.3],'asphalt')
box('Fitness building',[-7,4.2,23], [14,8.4,31],'cream')
box('Building roof',[-7,8.48,23],[14.4,.16,31.4],'roof')
for z in range(11,37,5):box('Facade glazing', [.015,3.5,z],[.035,4,3],'glass')
box('Front door',[-6,1.4,7.48],[1.8,2.8,.04],'glass')
# curbs/fence boundary leaves main opening 28-36 unobstructed
for a,b in [(-15,28),(36,60)]:
 box('Front boundary curb',[(a+b)/2,.12,1.2],[b-a,.24,.22],'curb')
 for x in range(math.ceil(a),math.floor(b)+1,2):box('Fence post',[x,.8,1.2],[.06,1.5,.06],'metal')
 for h in [.45,.9,1.4]:box('Fence horizontal',[(a+b)/2,h,1.2],[b-a,.035,.035],'metal')
for z in range(2,40,2):box('Right fence post',[60,.8,z],[.06,1.5,.06],'metal')
for h in [.45,.9,1.4]:box('Right fence rail',[60,h,20],[.035,.035,40],'metal')
# barriers: side spans z=2.5..6.5, two main arms x=28..32 and36..32
barrier('B1 side entry',4,2.5,0,1)
barrier('B2 main entry',28,1.8,1,0)
barrier('B3 main exit',36,1.8,-1,0)
camera('C1 side camera',4.55,2.2,math.pi/2)
camera('C2 entry camera',27.4,1.7,math.pi)
camera('C3 exit camera',36.6,1.7,0)
# spike strip west of B1, crossing same east-west road
for i in range(16):
 box('One way spike strip module',[2.8,.09,2.5+(i+.5)*.25],[.45,.18,.25],'yellow' if i%2==0 else 'black')
 box('Spike tooth',[2.8,.23,2.5+(i+.5)*.25],[.05,.18,.07],'metal')
arrow('Side right to left before',8,4.5,math.pi/2,'red');arrow('Side right to left after',-1,4.5,math.pi/2,'red')
arrow('Main entry',30,0,math.pi,'red');arrow('Main exit',34,0,0,'green')
arrow('Entry internal',30,6,math.pi,'white');arrow('Exit internal',34,6,0,'white')
random.seed(12)
cs=['#b9bdc2','#eeeeea','#313941','#782e2b','#77888f']
for row,z in enumerate([16,22,35]):
 for j,x in enumerate(range(15,57,3)):
  angle=0 if row==2 else (-.32 if row==0 else 2.82)
  car('Parked car %d %d'%(row,j),x,z,angle,random.choice(cs))
  box('Parking bay line',[x-1.4,.018,z],[.055,.02,5],'white',angle)
for z in [11,17,23,29,35]:car('West car '+str(z),5,z,math.pi/2,random.choice(cs))
for x,z in [(58,9),(58,27),(9,38),(22,38),(38,38),(54,38),(-1,15),(-1,25)]:
 box('Tree trunk',[x,1.15,z],[.22,2.3,.22],'trunk');box('Tree foliage',[x,2.8,z],[2.2,2.6,2.2],'leaf')
# Orient the model to match the approved presentation from the front.
for o in objects:
 o['pos'][0] *= -1
 o['rot'] *= -1
# cube geometry for all independently named model nodes
verts=[[-.5,-.5,-.5],[.5,-.5,-.5],[.5,.5,-.5],[-.5,.5,-.5],[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]]
faces=[(0,3,2,1),(4,5,6,7),(0,4,7,3),(1,2,6,5),(0,1,5,4),(3,7,6,2)]
flat=[];norm=[];inds=[]
for face in faces:
 a,b,c=[verts[i] for i in face[:3]];u=[b[i]-a[i] for i in range(3)];v=[c[i]-a[i] for i in range(3)]
 n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]
 start=len(flat)//3
 for k in face:flat+=verts[k];norm+=n
 inds += [start,start+1,start+2,start,start+2,start+3]
parts=[struct.pack('<%sf'%len(flat),*flat),struct.pack('<%sf'%len(norm),*norm),struct.pack('<%sH'%len(inds),*inds)]
binary=b''.join(parts);palette=list(dict.fromkeys(o['color'] for o in objects))
g={'asset':{'version':'2.0','generator':'Aura conceptual model; units metres; Y up'},'scene':0,'scenes':[{'nodes':list(range(len(objects)))}],'nodes':[],'meshes':[],'materials':[],'buffers':[{'byteLength':len(binary)}],'bufferViews':[],'accessors':[{'bufferView':0,'componentType':5126,'count':24,'type':'VEC3','min':[-.5]*3,'max':[.5]*3},{'bufferView':1,'componentType':5126,'count':24,'type':'VEC3'},{'bufferView':2,'componentType':5123,'count':36,'type':'SCALAR'}]}
offset=0
for p in parts:g['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':len(p)});offset+=len(p)
for col in palette:
 rgb=[int(col[i:i+2],16)/255 for i in [1,3,5]]
 g['materials'].append({'name':col,'pbrMetallicRoughness':{'baseColorFactor':rgb+[1],'metallicFactor':.05,'roughnessFactor':.75}})
 g['meshes'].append({'primitives':[{'attributes':{'POSITION':0,'NORMAL':1},'indices':2,'material':len(g['materials'])-1}]})
for o in objects:g['nodes'].append({'name':o['name'],'mesh':palette.index(o['color']),'translation':o['pos'],'scale':o['size'],'rotation':[0,math.sin(o['rot']/2),0,math.cos(o['rot']/2)]})
j=json.dumps(g,separators=(',',':')).encode();j+=b' '*((-len(j))%4);binary+=b'\0'*((-len(binary))%4)
(P/'aura-otopark.glb').write_bytes(struct.pack('<III',0x46546c67,2,12+8+len(j)+8+len(binary))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(binary),0x004e4942)+binary)
# OBJ interchange, metres and named objects
out=['# Aura Fitness Club concept; units metres; Y up'];idx=1
for o in objects:
 out.append('o '+o['name'].replace(' ','_'));co=math.cos(o['rot']);si=math.sin(o['rot'])
 for v in verts:
  x,y,z=[v[k]*o['size'][k] for k in range(3)];out.append('v %.5f %.5f %.5f'%(x*co+z*si+o['pos'][0],y+o['pos'][1],-x*si+z*co+o['pos'][2]))
 for f in faces:out.append('f '+' '.join(str(idx+k) for k in f))
 idx+=8
(P/'aura-otopark.obj').write_text('\n'.join(out))
(P/'scene.json').write_text(json.dumps(objects))
print('Exported',len(objects),'named objects;', (P/'aura-otopark.glb').stat().st_size,'GLB bytes')
