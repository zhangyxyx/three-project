# three-project
three  project 

## three build
可以引入模型的

## three.js

## three map
three.js画地图，可以显示出各个国家在地图的轮廓 

## project

![Image text](./project/demo.gif)

## 基础知识
1. 使用到的插件 
three.js </br>
OrbitControls.js </br>
threeBSP.js </br>


2. 基础知识  
> 基础知识
需要知道基本的概念：场景 照相机 灯光 渲染器 </br>
获取到/data/world1.json世界地图的基本数据，使用ExtrudeGeometry几个体绘制出地图的基本轮廓，至于地图的颜色是否倾斜，就可以根据自己实际需求进行设置 </br>
我们想在地图上画出国家的名称：用到的是TextGeometry,需要注意的是如果是中文显示需要另外load一下js/three/MicrosoftYaHei_Regular.json这个文件</br>
在地图上面显示点和线的时候：几何体都可以，目前这里面用倒的是SphereGeometry </br> 
如果想要检测鼠标移动到哪儿了：利用射线Raycaster进行碰撞检测 </br>

> 分部解析
+ 阴影
render中告知需要有阴影:renderer.shadowMapEnabled=true
然后需要定义哪个物体投射阴影，哪个物体接收阴影：plane.receiveShadow=true cube.castShadow=true
告知哪个光源可以产生阴影：spotLight.castShdow=true
+ 动画
用requestAnimationFrame(),利用这个方法我们可以旋转方块
```
function renderScene(){
    cube.rotation.x+=0.2
    cube.rotation.y+=0.2
    cube.rotation.z+=0.2
    requestAnimationFrame(renderScene)
    renderer.render(scene.camera)
}
```
我们可以通过Stat监控每秒显示的帧数FPS
+ 场景
Scene包含全部需要的东西</br>
scend.add()将物体添加到场景中</br>
+ 相机
正投影 物体不管远近都是一样的大小 new THREE.PersepectiveCamera()
透视 近大远小 尽量用这种    new THREE.OrthographicCamera()
我们的相机一般指向中心点 camera.lookAt(new THREE.Vector3(x,y,z))
+ 光源
AmbientLight 基础光源 不能产生阴影 不用设置位置 不能单独使用，需要和其他光源合并使用 主要为了给物体添加光源颜色 
PointLight 点光源  不会产生阴影 可以设置位置 
SpotLight 聚光灯光源 类似天花板的吊灯 产生阴影的时候最好用这个 可以设置位置 
DirectionalLight 方向光 光源是平行的 类似太阳光
HemisphereLight 半球光 可以模拟光线微弱的天空
AreaLight 面光源
LensFlare 镜头眩光
+ 纹理
纹理就好像皮肤一样
MeshBasicMaterial
MeshDepthMaterial 外观的深浅由物体到相机的距离决定的 MeshDepthMaterial可以结合MeshBasicmaterial进行联合材质
MeshNormalMaterial 计算法向颜色
MeshFaceMaterial 材质容器 可以对几何体每一个面指定不用的材质
MeshLamberMaterial 用于暗淡 不光亮表面
MeshPhongMaterial 用于光亮的材质
+ 射线
当我们选中某个元素的时候,使用Raycaster
+ 控制器
+ GUI
+ stat


3. 功能
（1） 散点数据：</br>
    方法1：打开QGIS里面设置随机点（推荐）</br>
    方法2：使用网址http://geojson.io/#map=2/32.2/18.3在这个里面手动点一些点</br>
（2）获取路网信息： </br>
    方法1：直接打开OpenStreetMap地图网址（），手动圈出范围，下载范围内的路网信息（小范围的可以，类似场馆周围地理信息） </br>
    方法2：打开OpenStreetMap的api(http://www.overpass-api.de/index.html),使用以下代码</br>
        在Query and Convert Forms中输入,点击Query获取到<relation id="2782246">这个id;
        ```
        <query type=""relation>
        <has-kv k="boundary" v="administrative">
        <has-kv k="name:zh" v="贵阳市"/>
        </query>
        <print mode="body"/>
        ```</br>
        同样的页面中输入,ref是3600000000+2782246得到的结果，将这个代码放到Overpass API Convert Form中直接，得到xml的城市路网信息文件</br>
        ```
        <osm-script timeout="1800" element-limit="100000000">
        <union>
            <area-query ref="3602782246"/>
            <recurse type="node-relation" into="rels"/>
            <recurse type="node-way"/>
            <recurse type="way-relation"/>
        </union>
        <union>
            <item/>
            <recurse type="way-node"/>
        </union>
        <print mode="body"/>
        </osm-script>
        ```</br>
（3）设置线段或者点等任何物体的颜色 </br>
    使用glsl（https://learnopengl-cn.github.io/01%20Getting%20started/05%20Shaders/#_2）</br>
（4）加载地图</br>
（5）说一下SketchUp</br>
    如果想做一个建筑，那么就需要纹理，纹理的话可以采用材质，材质里面可以贴图片也可以直接设置纯色</br>
（6）事件</br>
    对场景中绑定事件都是用到的射线</br>

4. 使用的软件
代码：vscode</br>
散点：QGIS</br>
模型：SketchUp</br>

5. 资料
glsl文档：https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLProgram
glsl例子：http://www.geeks3d.com/
glsl文档：https://thebookofshaders.com/06/?lan=ch
着色器：https://thebookofshaders.com/?lan=ch
three.js文档：http://www.webgl3d.cn/threejs/docs/ </br>
three.js案例：http://www.webgl3d.cn/threejs/examples/ 建议down下来 </br>
获取国内地图数据：http://datav.aliyun.com/tools/atlas/#&lat=30.332329214580188&lng=106.72278672066881&zoom=3.5 </br>
获取全球路网信息方法1：https://www.openstreetmap.org/#map=15/39.9227/116.3533&layers=O </br>
获取全球路网信息方法2：http://www.overpass-api.de/index.html </br>
将OSM转成json：https://www.bejson.com/xml2json/</br>
将XML转成shp:https://geoconverter.hsr.ch/vector</br>
dat.GUI简单的界面组件，控制属性</br>
计算动画函数 http://www.createjs.cc/tweenjs/ </br>
mapbox 插件</br>
maptalk </br>

6. 问题
https://stackoverrun.com/cn/q/11494942</br>
区别：
    QuadraticBezierCurve3 </br>  
    CubicBezierCurve3</br>
地球</br>
建筑</br>
热力图</br>
glsl</br>
https://thebookofshaders.com/?lan=ch</br>

## D3.js
1. 弯曲的地图
three map d3    </br>
2. 资料：
https://blog.csdn.net/qq_31052401/article/details/88937832</br>
https://bl.ocks.org/mbostock</br>

## 处理osm
### npm install -g osmtogeojson
### osmtogeojson file.osm > file.geojson
    








