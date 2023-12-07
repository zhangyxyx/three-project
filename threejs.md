# threejs知识点

*  线宽度设置
```JavaScript
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import { Line2 } from 'three/examples/jsm/lines/Line2'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'

var geometry = new LineGeometry()
var pointArr = [-100, 0, 0,-100, 100, 0]
geometry.setPositions(pointArr)
var material = new LineMaterial({
        color: "red",
        linewidth: 15
      })
material.resolution.set(window.innerWidth, window.innerHeight)
var line = new Line2(geometry, material)
line.computeLineDistances()
scene.add(line)

```
*  阴影设置
```JavaScript
//平行光 聚光灯 
var spotLight = new THREE.SpotLight(0xffffff ); 
spotLight.position.set( -800,50,150 ); 
spotLight.castShadow = true;   
this.scene.add( spotLight ); 

//渲染
this.renderer.shadowMap.enabled = true;

//模型 
mesh.castShadow = true // 投射阴影
mesh.receiveShadow = true // 接受阴影

```

*  背景透明度
```JavaScript
//平行光 聚光灯 
this.renderer.setClearAlpha(0.0)

```
*  场景整体移动
```JavaScript
//平行光 聚光灯 

scene.translateY(i);

```





*  发光
```JavaScript

/*后期处理*/
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'; 
renderPassFunc(mesharr){ 
        var that=this
        var THREE=this.THREE
        this.renderPass1=''
        this.OutlinePass1=''
        if(that.LoopId!=''){
                cancelAnimationFrame(that.LoopId) 
        }
        var that=this
        // 创建一个渲染器通道，场景和相机作为参数
        this.renderPass1 = new RenderPass(this.scene, this.camera); 
        // 创建OutlinePass通道,显示外轮廓边框
        this.OutlinePass1 = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene,this.camera,mesharr);
        // 后处理完成，设置renderToScreen为true，后处理结果在Canvas画布上显示
        this.OutlinePass1.renderToScreen = true;

        //OutlinePass相关属性设置
        this.OutlinePass1.visibleEdgeColor.set('0x1A92C6');//模型描边颜色，默认白色          
        this.OutlinePass1.edgeThickness = 4.0;//轮廓边缘描边厚度
        this.OutlinePass1.edgeStrength = 6.0;//边缘发光强度,数值大，更亮一些
        // OutlinePass.pulsePeriod = 2;//模型闪烁频率控制，默认0不闪烁
        // OutlinePass.hiddenEdgeColor.set(0x220101);//模型被遮挡部分描边颜色控制        
        // OutlinePass.edgeGlow = 0.0;//边缘发光，默认0.0
        // OutlinePass.downSampleRatio = 2;//下采样比,默认2
        // OutlinePass.usePatternTexture = false;//纹理,默认false

        //后期处理  
                        var composer = new EffectComposer(this.renderer); 
        composer.setSize(window.innerWidth, window.innerHeight);
                        composer.addPass(this.renderPass1);// 设置renderPass通道 
                        composer.addPass(this.OutlinePass1);// 设置OutlinePass通道

        composer.readBuffer.texture.encoding = THREE.sRGBEncoding;
        composer.writeBuffer.texture.encoding = THREE.sRGBEncoding;


        passrender()
        function passrender(){
                composer.render();  
                that.LoopId=requestAnimationFrame(passrender); 
        }
},

```


* FBX引入 
```JavaScript
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
 
var loader = new FBXLoader(); //创建一个FBX加载器
loader.load('model.FBX', function(obj) {
    var model=obj  
    that.model=model   
    
    model.children[0].material=glassMaterial 
    that.scene.add(model) 

    var params={
      THREE:THREE,
      scene:that.scene
    }
    that.$eventbus.$emit('addTip',params)
}, onProgress, onError) 
},

```

* GLTF引入
```JavaScript
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
 
var onProgress = function(xhr) {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;  
    }
};
var onError = function(xhr) { 
};  
var name='build'
new GLTFLoader()
    .setPath( '/public/views/model/'+name+'/' )
    .setDRACOLoader( new DRACOLoader().setDecoderPath( '/public/views/draco/gltf/' ) )
    .load( 'model.gltf', function ( gltf ) {   
      var model=gltd.scene
      this.scene.add(model)
    }, onProgress, onError  );
},

```

* 光源强度设置
```JavaScript
//平行光
var directional0 = new THREE.DirectionalLight(0xFFFFFF);//上面
directional0.position.set( 0,0,0 ); 
directional0.intensity = 3 //强度
this.scene.add(directional0); 
var directionalLightHelper0 = new THREE.DirectionalLightHelper( directional0, 20 );
this.scene.add( directionalLightHelper0 );

//聚光灯
var spotLight = new THREE.SpotLight(0xffffff ); 
spotLight.position.set( -800,50,150 ); 
spotLight.castShadow = true; //阴影
spotLight.intensity = 10  //强度
spotLight.distance = 1000; //距离
spotLight.angle=Math.PI/2   //角度
this.scene.add( spotLight );
var spointLightHelper = new THREE.SpotLightHelper( spotLight, 20 ); 
this.scene.add( spointLightHelper );

//面积光
let rectLight1=new THREE.RectAreaLight(0xffffff,  1.6,2.5,1);//颜色 强度 宽高
rectLight1.position.set(0.6 ,0.5, 0);
rectLight1.lookAt(0.6,0,0);
rectLight1.distance =20 //距离
this.scene.add(rectLight1); 
let rectLight1=new THREE.RectAreaLight(0xffffff,1.6,1.5,1);
rectLight1.position.set(0 ,0.5, 0);
rectLight1.lookAt(0 , 0,0);
rectLight1.distance =20
scene.add(rectLight1); 
var rectLightMesh1 = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( {side:THREE.DoubleSide} ) );
rectLightMesh1.scale.x = rectLight1.width;
rectLightMesh1.scale.y = rectLight1.height;
rectLight1.add(rectLightMesh1);//平面缓冲几何体替代平面光光源位置
      
//自然光
const light = new THREE.AmbientLight( 0x000000 ); 
this.scene.add( light );

//点光源
var point1 = new THREE.PointLight(0xffffff ); 
point1.position.set( -250,0,100 );
point1.intensity = 3  //强度
point1.name='pointleft'
this.scene.add( point1 );
var pointLightHelper1 = new THREE.PointLightHelper( point1, 20 );
this.scene.add( pointLightHelper1 );

//环境光
var defaultThreeReflection = '/public/views/hdr/symmetrical_garden_1k.hdr'
var envMap
var envPath = defaultThreeReflection
if (false) {  
var envFormat = defaultThreeReflection[1] 
envMap = new THREE.CubeTextureLoader().load([
  envPath + 'posx' + envFormat, envPath + 'negx' + envFormat,
  envPath + 'posy' + envFormat, envPath + 'negy' + envFormat,
  envPath + 'posz' + envFormat, envPath + 'negz' + envFormat
])
envMap.format = THREE.RGBFormat
scene.environment = envMap
} else { 
  var pmremGenerator = new THREE.PMREMGenerator(this.renderer)
  pmremGenerator.compileEquirectangularShader() 
  new RGBELoader()
  .setDataType(THREE.HalfFloatType)
  .load(envPath, (texture) => {
    envMap = pmremGenerator.fromEquirectangular(texture).texture 
    pmremGenerator.dispose()
    that.scene.environment = envMap
    that.scene.background = texture
    //applyBackground(mainViewModel.showBackground())
  })
}
```
* 提示框设置
```JavaScript
//不随着旋转 提示框旋转
//{title:'摸具制造车间',content:'环境', x:0,y:76,z:0,color:'#117c80',h:710,hh:2*10},  
renerthreedtip(data){  
    var THREE=this.THREE
    var that=this 
    var x=data.x,y=data.y,z=data.z 
    var hnum=data.content.split('\r').length 
    var canvas=renderCanvas(data)
    var texture = new THREE.CanvasTexture(canvas);
    var spriteMaterial = new THREE.SpriteMaterial({
      map: texture
    });
    // 创建精灵模型对象
    var sprite = new THREE.Sprite(spriteMaterial); 
    sprite.scale.set(4.5*10, hnum*data.hh , 1); 
    sprite.position.set(x,y,z)  
    sprite.name=`tip${data.title}pos${data.x}/${data.y}/${data.z}`
    this.spritearr.push(sprite)
    this.scene.add(sprite)
    /*提示框中canvas得公共函数*/
    function renderCanvas(data){ 
      var that=this 
      var canvas = document.createElement("canvas");
      var x=data.x,y=data.y,z=data.z,width=450,height=data.h//hnum*90
      var color=data.color
      canvas.width = width
      canvas.height = height
      var c = canvas.getContext('2d'); 
      if(color==='#6c3121'){
        var img=document.getElementById("screamred");
        c.drawImage(img,0, 0, width, data.type===1?height/2+50:height/2-50); 

      }else{
        var img=document.getElementById("scream");
        c.drawImage(img,0, 0, width, data.type===1?height/2+50:height/2-50); 

      }
      c.font = "bold 35px 微软雅黑"; 
      c.fillStyle = '#fff';
      c.fillText(data.title, 30, 70); 

      c.arc(width/2,height-40,15,0,2*Math.PI); 
      c.fillStyle = color;
      c.fill(); 
      c.arc(width/2,height-40,30,0,2*Math.PI); 
      c.lineWidth = 3;
      c.strokeStyle = color;
      c.stroke()

      c.lineWidth = 2;
      c.strokeStyle = color;
      c.beginPath(); 
      c.moveTo(40, height/2-50);
      c.lineTo(40, height/2);
      c.lineTo(width/2, height/2+150);
      c.lineTo(width/2, height-20);
      c.stroke();

      c.lineWidth = 6;
      c.strokeStyle = '#fff';
      c.beginPath();
      c.setLineDash([10,10]);
      c.moveTo(40, 100);
      c.lineTo(width-70, 100);
      c.stroke();

      drawtext(data.content,40,90,50,22,2,c) 
      function drawtext(text, x, y, width, fs, rowHeight, ctx){
        // 1 将字符串转换成数组
        let test = text.split("\r")
        let temp = ""       
        let row = [] 
        ctx.font = `${fs}px 微软雅黑`
        ctx.fillStyle = "#fff"
        ctx.textBaseline = "middle" 
        for(let i = 0;  i < test.length; i++ ){
            if( ctx.measureText(temp).width > width ){
                row.push(temp)
                temp = ""
            }
            temp += test[i]
        } 
        row.push(temp)
        // 1.4 遍历数组,输出文字
        for(let j = 0; j < row.length; j++){
            ctx.fillText( row[j], x, y+(j+1) * fs *rowHeight)
        }
      }
      
      return canvas
    }
},
//随着旋转提示框旋转
renerthreedtip2(data){  
    var THREE=this.THREE
    var scene=this.scene
    var texture = renderCanvas(data)
    var planeGeometry = new THREE.PlaneBufferGeometry(100,50);
    var planeMaterial = new THREE.MeshPhongMaterial({
      transparent:true, 
      side:THREE.DoubleSide, 
    });
    planeMaterial.map=texture;
    // var planeMaterial = new THREE.MeshPhongMaterial({ 
    //   map:texture,  
    //   side:THREE.DoubleSide, 
    //   opacity:0.1
    // });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(5, 100, -10);  
    scene.add(plane) 
    /*提示框中canvas得公共函数*/
    function renderCanvas(data){ 
      var that=this 
      var canvas = document.createElement("canvas");
      var x=data.x,y=data.y,z=data.z,width=450,height=data.h//hnum*90
      var color=data.color
      canvas.width = width
      canvas.height = height
      var c = canvas.getContext('2d');
      console.log(c)  
      


      if(color==='#6c3121'){
        var img=document.getElementById("screamred");
        c.drawImage(img,0, 0, width, data.type===1?height/2+50:height/2-50); 

      }else{
        var img=document.getElementById("scream");
        c.drawImage(img,0, 0, width, data.type===1?height/2+50:height/2-50); 

      }
      c.font = "bold 35px 微软雅黑"; 
      c.fillStyle = '#fff';
      c.fillText(data.title, 30, 70); 

      c.arc(width/2,height-40,15,0,2*Math.PI); 
      c.fillStyle = color;
      c.fill(); 
      c.arc(width/2,height-40,30,0,2*Math.PI); 
      c.lineWidth = 3;
      c.strokeStyle = color;
      c.stroke()

      c.lineWidth = 2;
      c.strokeStyle = color;
      c.beginPath(); 
      c.moveTo(40, height/2-50);
      c.lineTo(40, height/2);
      c.lineTo(width/2, height/2+150);
      c.lineTo(width/2, height-20);
      c.stroke();

      c.lineWidth = 6;
      c.strokeStyle = '#fff';
      c.beginPath();
      c.setLineDash([10,10]);
      c.moveTo(40, 100);
      c.lineTo(width-70, 100);
      c.stroke();

      drawtext(data.content,40,90,50,22,2,c) 
      function drawtext(text, x, y, width, fs, rowHeight, ctx){
        // 1 将字符串转换成数组
        let test = text.split("\r")
        let temp = ""       
        let row = [] 
        ctx.font = `${fs}px 微软雅黑`
        ctx.fillStyle = "#fff"
        ctx.textBaseline = "middle" 
        for(let i = 0;  i < test.length; i++ ){
            if( ctx.measureText(temp).width > width ){
                row.push(temp)
                temp = ""
            }
            temp += test[i]
        } 
        row.push(temp)
        // 1.4 遍历数组,输出文字
        for(let j = 0; j < row.length; j++){
            ctx.fillText( row[j], x, y+(j+1) * fs *rowHeight)
        }
      }

      c.fillStyle = "rgba(0,160,0,0)";   
      c.fillRect(0, 0, canvas.width, canvas.height);   


      var texture = new THREE.CanvasTexture( canvas );
      //texture.minFilter = texture.magFilter = THREE.NearestFilter;
      //texture.needsUpdate = true;
      return texture
    }
},
```
* 摩尔纹问题
```JavaScript
//在模型的mesh中添加
map.magFilter = THREE.LinearFilter
map.minFilter  = THREE.LinearMipMapLinearFilter 

```
* 设置场景比例

* 纹理透明度设置
```JavaScript 
material.transparent = true;//是否透明
material.opacity = 0.9;//透明度 

```
* tween对元素的移动和转动角度
```JavaScript 
//前后左右移动
var tween =new TWEEN.Tween( this.camera.position ).to( {x:0,y:10,z:-40},1000 ).start() 

//物体旋转
var jiexie1=new TWEEN.Tween(data.rotation).to( { z: (90 * Math.PI / 180)},5000 ).start()
var jiexie2 =  new TWEEN.Tween(data.rotation).to({ z: (0 * Math.PI / 180)},2000)  
jiexie1.chain(jiexie2); 
jiexie2.chain(jiexie1); 

//物体多个运动连续
var agv1=new TWEEN.Tween(data.position).to(pos1,9000+8000 )
agv1.onComplete(function(){})
var agv2=new TWEEN.Tween(data.position ).to( pos2,5000+8000 )
agv2.onComplete(function(){})
var agv3=new TWEEN.Tween(data.position ).to( pos3,10000+8000 )
agv2.onComplete(function(){})
var agv4=new TWEEN.Tween(data.position ).to( pos4,5000+8000 )  
var agv5=new TWEEN.Tween(data.position ).to( pos5,1000+8000 ) 

agv1.start()
agv1.chain(agv2); 
agv2.chain(agv3); 
agv3.chain(agv4); 
agv4.chain(agv5); 
agv5.chain(agv1);



```

* 第一人称运动
```JavaScript 
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'; 
var tween1=new TWEEN.Tween( camera.position ).to( {x:data.position.x+0.05 ,y:data.position.y+0.01,z:data.position.z},4000 ).start() 
tween1.onUpdate(function() {  
  that.controls.target.x =pos.x-0.05;
  that.controls.target.y =pos.y;
  that.controls.target.z =pos.z;
  that.controls.update();
})

``` 
* 镜面反射效果
```JavaScript 
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'; 
renderplane(){  
  var THREE=this.THREE
  //创建圆形水平镜面，用于将胶囊体、甜圈圈、多面体小球映射到地面上
  let geometry = new THREE.CircleGeometry(400, 640);
  var groundMirror = new Reflector(geometry, {
    //clipBias: 1,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color:0x777777
  });
  groundMirror.position.x = 0;
  groundMirror.position.y = -5;
  groundMirror.position.z = 0.5;
  groundMirror.rotateX(-Math.PI / 2);
  groundMirror.name='mirror'
  this.scene.add(groundMirror);
}, 

```
* canvas透明度设置
* tween顺时针旋转
```JavaScript 
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'; 
var jiexie1=new TWEEN.Tween(data.rotation).to( { z: (90 * Math.PI / 180)},5000 ).start()
var jiexie2 =  new TWEEN.Tween(data.rotation).to({ z: (0 * Math.PI / 180)},2000)  
jiexie1.chain(jiexie2); 
jiexie2.chain(jiexie1); 

``` 

* tween停止
```JavaScript 
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'; 
 
for(var i=0;i<tweenarr.length;i++){
  tweenarr[i].stop()
} 

``` 
 
* camera转换角度 controls转换角度
```JavaScript 
//camera
var tween1=new TWEEN.Tween( camera.position ).to( {x:1,y:1,z:1.5},4000 ).start()
//controls
that.controls.target.x = 1;
that.controls.target.y = 0;
that.controls.target.z = 0;
that.controls.update();

``` 
* 平面网格
```JavaScript 
 size -- 网格宽度，默认为 10. 
divisions -- 等分数，默认为 10. 
colorCenterLine -- 中心线颜色，默认 0x444444 
colorGrid --  网格线颜色，默认为 0x888888

var rangeSize = 2000; //地面网格尺寸
var divisions = 200; //地面网格细分数
var gridHelper = new THREE.GridHelper(rangeSize, divisions, '#01293d', '#042d42');
this.scene.add(gridHelper); 

that.CreateGroundGrid(100, 300, 0x004444, 0.08, 0x00aaaa)
 CreateGroundGrid(rangeSize, divisions, color, R, RColor) {
  var THREE=this.THREE 
  var group = new THREE.Group();
  var gridHelper = new THREE.GridHelper(rangeSize, divisions, color, color);
  group.add(gridHelper);
  // console.log('gridHelper',gridHelper)
  gridHelper.material.depthWrite = false;
  gridHelper.renderOrder = -2;
  // CircleGeometry圆形平面几何体
  var geometry = new THREE.CircleGeometry(R, 20, 20);
  geometry.rotateX(Math.PI / 2); //从XOY平面旋转到XOZ平面
  // 可以选择基础网格材质，基础网格材质不受光照影响，和其它场景配合，颜色更稳定，而且节约渲染资源
  var material = new THREE.MeshBasicMaterial({
    color: RColor,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  // 共享材质和几何体数据，批量创建圆点mesh
  var 间距 = rangeSize / divisions
  var 范围一半 = rangeSize / 2
  for (let i = 0; i < divisions; i++) {
    for (let j = 0; j < divisions; j++) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = -1;
    mesh.translateX(-范围一半 + i * 间距);
    mesh.translateZ(-范围一半 + j * 间距);
    group.add(mesh)
    }
  }
  this.scene.add(group)
},

``` 

* 正方体 平面
* 模型变线框
* shader中渐变效果
* 模型循环遍历
```JavaScript 
model.traverse( function ( object ) {
    if ( object.isMesh ) {   
      object.material1=object.material  
    } 
});

``` 

* 对模型重定位到原点
```JavaScript 
var model= gltf.scene
gltf.scene.scale.set(0.09,0.09,0.09)
var box3 = new THREE.Box3();
box3.expandByObject(gltf.scene); // 计算模型包围盒
var center = new THREE.Vector3();
box3.getCenter(center); // 计算一个层级模型对应包围盒的几何中心坐标
//重新设置模型的位置  222.78981445312502, y: 33.70293766691505, z: -52.16312988204231
gltf.scene.position.x=-160//-=center.x;
gltf.scene.position.y=0//-=center.y;
gltf.scene.position.z=-10//-=center.z;
```


* 设置模型缩放、位置、旋转
```JavaScript 
//移动
mesh.position.x = 100;
mesh.position.y = 100;
mesh.position.z = 100; 
mesh.position.set(100, 100, 100);

//缩小 
mesh.scale.set(2, 1.5, 2);

//旋转
// 沿着XYZ分别旋转45°
mesh.rotation.x = Math.PI/4;
mesh.rotation.y = Math.PI/4;
mesh.rotation.z = Math.PI/4;
// 或者
mesh.rotateX(Math.PI/4)
mesh.rotateY(Math.PI/4)
mesh.rotateZ(Math.PI/4)
```

* 获取模型大小
```JavaScript 
const box3 = new THREE.Box3()
box3.expandByObject(gltf.scene)
const v3 = new THREE.Vector3()
box3.getSize(v3)
```
 
* 相机控制器的指向
```JavaScript 
var tween1=new TWEEN.Tween( camera.position ).to( {x:data.position.x+0.05 ,y:data.position.y+0.01,z:data.position.z},4000 ).start() 
tween1.onUpdate(function() {  
  that.controls.target.x =pos.x-0.05;
  that.controls.target.y =pos.y;
  that.controls.target.z =pos.z;
  that.controls.update();
})
```


* 射线与相机位置
```JavaScript 
window.addEventListener( 'click', choose, false ); 
function choose(event) { 
  var arr=[]
  var data=that.scene.children //之选中某些模型
  for(var i=0;i<data.length;i++){ 
    if(data[i].type3d==='设备'){
      arr.push(data[i])
        var res1=data[i].children[0].children
        for(var j=0;j<res1.length;j++){
        arr.push(res1[j]) 
        }
    }
  } 

  var Sx = event.clientX;  
  var Sy = event.clientY;  
  var width = window.innerWidth;  
  var height =window.innerHeight;  
  var container=document.getElementById('threemap')//在当亲div中获取元素
  let getBoundingClientRect = container.getBoundingClientRect()

  var x = ((event.clientX - getBoundingClientRect .left) / container.offsetWidth) * 2 - 1;
  var y = -((event.clientY - getBoundingClientRect .top) / container.offsetHeight) * 2 + 1;  
  var raycaster = new THREE.Raycaster(); 
  raycaster.setFromCamera(new THREE.Vector2(x, y), that.camera); 
  var intersects = raycaster.intersectObjects(arr,true);

  if (intersects.length > 0) {}
} 

```


* 模型闪烁问题
```JavaScript 
object.material.map.magFilter = THREE.LinearFilter
object.material.map.minFilter  = THREE.LinearMipMapLinearFilter 
```
* shader中渐变效果
```JavaScript 
   shadermaterial(geometry,h,color){
       var material = new THREE.MeshLambertMaterial({
        color: color, //三角面颜色
        side: THREE.DoubleSide, //两面可见
        transparent: true, //需要开启透明度计算，否则着色器透明度设置无效
        opacity: 0.5,//整体改变透明度
        depthTest: false,
      });

      var posAtt = geometry.attributes.position; //几何体顶点位置缓冲对象
      var num = geometry.attributes.position.count;//几何体顶点数量
      var alphaArr = []; //每个顶点创建一个透明度数据(随着高度渐变)
      for (var i = 0; i < num; i++) {
        // 线性渐变
        alphaArr.push(1 - posAtt.getZ(i) / h);
      }
      // BufferGeometory自定义一个.attributes.alpha属性,类比.attributes.position
      // 几何体的属性.alpha和顶点着色器变量alpha是对应的
      geometry.setAttribute('alpha', new THREE.BufferAttribute(new Float32Array(alphaArr), 1));

      // GPU执行material对应的着色器代码前，通过.onBeforeCompile()插入新的代码，修改已有的代码
      material.onBeforeCompile = function (shader) {
        // console.log('shader.fragmentShader', shader.fragmentShader)
        // 插入代码：在顶点着色器主函数'void main() {'前面插入alpha变量的声明代码
        shader.vertexShader = shader.vertexShader.replace(
          'void main() {',
          ['attribute float alpha;//透明度分量',
            'varying float vAlpha;',
            'void main() {',
            'vAlpha = alpha;', // 顶点透明度进行插值计算
          ].join('\n') // .join()把数组元素合成字符串
        );
        // 插入代码：片元着色器主函数前面插入`varying float vAlpha;`
        shader.fragmentShader = shader.fragmentShader.replace(
          'void main() {',
          ['varying float vAlpha;',
            'void main() {',
          ].join('\n')
        );
        shader.fragmentShader = shader.fragmentShader.replace('#include <output_fragment>', output_fragment);
      };
      return material
    },
```

* 灯光指向target
```JavaScript 
 const targetObject = new THREE.Object3D();
scene.add(targetObject);

light.target = targetObject;

```


* 控制器重置
```JavaScript 
that.controls.reset();

```

* 经纬度转化为球面坐标
```JavaScript 
    createPosition(lnglat) { 
      let spherical = new THREE.Spherical
      spherical.radius = this.radius;
      const lng = lnglat[0]
      const lat = lnglat[1]
      const theta = (lng + 90) * (Math.PI / 180)
      const phi = (90 - lat) * (Math.PI / 180)
      spherical.phi = phi; // phi是方位面（水平面）内的角度，范围0~360度
      spherical.theta = theta; // theta是俯仰面（竖直面）内的角度，范围0~180度
      let position = new THREE.Vector3()
      position.setFromSpherical(spherical)
      return position
    },
    lon2xyz(lonlat) {
        const lon = lonlat[0] * Math.PI / 180;
        const lat = lonlat[1] * Math.PI / 180;
        const x = 120 * Math.cos(lat) * Math.sin(lon);
        const y = 120 * Math.sin(lat);
        const z = 120 * Math.cos(lon) * Math.cos(lat);
        return { x:x, y:y, z:z };
    } 

```


* 模型放在地球面上
```JavaScript 
function bar1(lnglat,name){  
    var geometry1 = new THREE.PlaneBufferGeometry(10, 100); //默认在XOY平面上
    var textureLoader = new THREE.TextureLoader(); // TextureLoader创建一个纹理加载器对象
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        color: 0x44ffaa, //光柱颜色，光柱map贴图是白色，可以通过color调节颜色   
        transparent: true, //使用背景透明的png贴图，注意开启透明计算
        side: THREE.DoubleSide, //双面可见
        depthWrite:false,//是否对深度缓冲区有任何的影响
    });
    var mesh1 = new THREE.Mesh(geometry1, material);
    var group1 = new THREE.Group()
    // 两个光柱交叉叠加
    group1.add(mesh1, mesh1.clone().rotateY(Math.PI / 2), mesh1.clone().rotateY(Math.PI / 4)) 
    const coord2 = that.createPosition1(lnglat) 
    const coordVec23 = new THREE.Vector3(coord2.x, coord2.y, coord2.z).normalize();
    group1.position.set(coord2.x, coord2.y, coord2.z);
    group1.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), coordVec23);  
    var coord1=group1.position
    that.renderstat(coord1,'text',name) 
} 

```


* 文字放在球面上
```JavaScript 
rendertext(){
    var that=this
    var data=this.text
    // 循环创建地标，文字标签
    for (var i=0;i<data.length;i++) {
    const name = data[i].name
    this.renderstat(data[i].position,'text',data[i].name) 
    }
    var label=this.labeldata
    for (var i=0;i<label.length;i++) {
    const name = label[i].name 
    const position = this.createPosition(label[i].position) 
    createTextCanvas(position,name); 
    }
    //贴图标签，标签与球面融为一体
    function createTextCanvas(position,name) {
        //用canvas生成图片
        let w = 200;
        let h = 100;
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext('2d');
        canvas.width = w;
        canvas.height = h;
        //左右翻转
        ctx.scale(-1, 1);
        ctx.translate(-w, 0);
        //制作矩形
        ctx.fillStyle = "#2c9d9a";
        ctx.fillRect(0, 0, w, h)
        //设置文字						
        ctx.fillStyle = "black";
        ctx.font = h/2 + 'px "微软雅黑"';
        ctx.textAlign = 'center';
        ctx.fillText(name, h, h/2+20);
        
        //生成图片
        let url = canvas.toDataURL('image/png');
        //几何体--长方形
        let geometry1 = new THREE.PlaneGeometry(6, 3);
        //将图片构建到纹理中
        let material1 = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(url),
            side: THREE.DoubleSide, //两面可见
            opacity: 1
        });
        let txtMesh = new THREE.Mesh(geometry1, material1);	 
        txtMesh.position.copy(position);				
        txtMesh.lookAt(new THREE.Vector3(0,0,0));					
        that.scene.add(txtMesh);
    } 
},
```

* 地球上的飞线
```JavaScript 
    renderLine(){
      var that=this
      var R=this.radius
      var groupLines=new THREE.Group(),aGroup=new THREE.Group(),animateDots = [];
      
      var data=this.linedata
      for(var i=0;i<data.length;i++){
        if(data[i].name==='1'){
          var start=that.createPosition(data[i].start)
          var end=that.createPosition(data[i].end)
        }else if(data[i].name==='2'){
          var start=that.createPosition(data[i].start)
          var end=data[i].end
        }else{
          var start=that.createPosition(data[i].start)
          var end=data[i].end
        }
       
        var line = addLines(new THREE.Vector3(start.x,start.y,start.z),new THREE.Vector3(end.x,end.y,end.z),data[i].name); 
        line.lineMesh.name=data[i].name
        if(data[i].name!='1'&&data[i].name!='2'){
          line.lineMesh.computeLineDistances();
        }     
        groupLines.name='line'
        groupLines.add(line.lineMesh);
        animateDots.push({data:line.curve.getPoints(80),name:data[i].name});
      }

      // 添加动画
			for (let i = 0; i < animateDots.length; i++) { 
				let aGeo = new THREE.SphereGeometry(0.5,10,10);
				let aMater = new THREE.MeshPhongMaterial({ color: '#fff' });
				let aMesh = new THREE.Mesh(aGeo, aMater);
        aMesh.name=animateDots[i].name
				aGroup.add(aMesh);
			} 
      this.scene.add(groupLines);

      var vIndex = 0;
			function animateLine() { 
				aGroup.children.forEach((elem, index) => { 
					let v = animateDots[index].data[vIndex];
					elem.position.set(v.x, v.y, v.z);
				});
				vIndex++;
				if (vIndex > 80) {
					vIndex = 0;
				}
				setTimeout(animateLine, 20);
			}
      aGroup.name='point'
			this.scene.add(aGroup);  
			animateLine();

      // 添加线条
      function addLines(v0, v3,name) { 
        // 夹角
        var angle = (v0.angleTo(v3) * 1.8) / Math.PI / 0.1; // 0 ~ Math.PI
        var aLen = angle * 2,
          hLen = angle * angle * 120;
        var p0 = new THREE.Vector3(0, 0, 0); 

        // 法线向量
        var rayLine = new THREE.Ray(p0, getVCenter(v0.clone(), v3.clone()));
        var temp = new THREE.Vector3();
        // 顶点坐标
        var vtop = rayLine.at(hLen / rayLine.at(1,temp).distanceTo(p0),temp);

        // 控制点坐标
        var v1 = getLenVcetor(v0.clone(), vtop, aLen);
        var v2 = getLenVcetor(v3.clone(), vtop, aLen);

        // 绘制贝塞尔曲线
        var curve = new THREE.CubicBezierCurve3(v0, v1, v2, v3);
        var geometry = new THREE.BufferGeometry();
        const pointsArray =curve.getPoints(20) 
        var points=[],colors=[]
        for(var i=0;i<pointsArray.length;i++){
          points.push(pointsArray[i].x,pointsArray[i].y,pointsArray[i].z) 
          var color= new THREE.Color('#00F5B8')
          colors.push(color.r, color.g, color.b); 
        }  
        if(name!='1'&&name!='2'){
          var material = new THREE.LineDashedMaterial({ 
            vertexColors: true,
            dashSize: 1,//短划线的大小
            gapSize: 3,//短划线之间的距离 
          });
        } else{
          var material = new THREE.LineDashedMaterial({ 
            vertexColors: true,  
            lineWidth:2,
          }); 
        }
        // var material = new THREE.LineDashedMaterial({ 
        //   vertexColors: true,  
        // }); 
 
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
        geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3)); 

        var mesh=new THREE.Line(geometry, material)
        mesh.name=name
        curve.name=name
        return {
          curve: curve,
          lineMesh: mesh
        };
      } 
      // 计算v1,v2 的中点
      function getVCenter(v1, v2) {
        let v = v1.add(v2);
        return v.divideScalar(2);
      } 
      // 计算V1，V2向量固定长度的点
      function getLenVcetor(v1, v2, len) {
        let v1v2Len = v1.distanceTo(v2);
        return v1.lerp(v2, len / v1v2Len);
      }
    },  

```

* 防止深度优化 纹理闪烁
```JavaScript 
this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true
      });

```
* 渲染大量数据
```JavaScript 
function renderTrajectory(data) {
    var that = this
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    let material = new THREE.MeshBasicMaterial({ color: 'red' });
    let boxes
    const geometryBox = new THREE.BoxBufferGeometry(9999, 9999, 9999);
    boxes = new THREE.InstancedMesh(geometryBox, material, data.length);
    boxes.castShadow = true;
    boxes.receiveShadow = true;
    for (let i = 0; i < data.length; i++) {
        matrix.setPosition(data[i].x, data[i].y, data[i].z);
        boxes.setMatrixAt(i, matrix);
    }
    return boxes

}

```

 






