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
* 摩尔纹问题
```JavaScript
//在模型的mesh中添加
map.magFilter = THREE.LinearFilter
map.minFilter  = THREE.LinearMipMapLinearFilter 

```
* 设置场景比例
* 纹理透明度设置
* tween对元素的移动和转动角度
* 第一人称运动
* 镜面反射效果
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

