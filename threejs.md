# threejs知识点

*  线宽度设置

```JavaScript
var textureLoader = new THREE.TextureLoader();
var plane = new THREE.PlaneGeometry(40, 40); // 创建一个矩形几何体
//标签使用基础网格材质即可
var planeMaterial = new THREE.MeshBasicMaterial({
  //矩形平面网格模型设置纹理贴图
  map: textureLoader.load('./标签图片/红豆.png'),
  side: THREE.DoubleSide, // 双面显示
  transparent: true, // 开启透明效果，否则颜色贴图map的透明不起作用
});
var planeMesh = new THREE.Mesh(plane, planeMaterial);
// mesh网格模型表示一个红豆的仓库
planeMesh.position.copy(mesh.position)
planeMesh.position.y += 80
scene.add(planeMesh)
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
* 第一人称运动
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
* tween停止
* tween时间分配
* camera转换角度 controls转换角度
* 平面网格
* 模型变线框
* shader中渐变效果
* 模型循环遍历
* 对模型重定位到原点
* 设置模型缩放、位置、旋转
* 面积灯光使用
* 获取模型大小
* 相机控制器的指向
* 射线与相机位置

