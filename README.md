# three-project
three  project 

## three map
three.js画地图，可以显示出各个国家在地图的轮廓 

1. 使用到的插件 
three.js 

OrbitControls.js 

threeBSP.js 


2. 基础知识  
需要知道基本的概念：场景 照相机 灯光 渲染器 

获取到/data/world1.json世界地图的基本数据，使用ExtrudeGeometry几个体绘制出地图的基本轮廓，至于地图的颜色是否倾斜，就可以根据自己实际需求进行设置 

我们想在地图上画出国家的名称：用到的是TextGeometry,需要注意的是如果是中文显示需要另外load一下js/three/MicrosoftYaHei_Regular.json这个文件 

在地图上面显示点和线的时候：几何体都可以，目前这里面用倒的是SphereGeometry  

如果想要检测鼠标移动到哪儿了：利用射线Raycaster进行碰撞检测  

3. 注意  
如果想获取一定范围的散点数据，可以用http://geojson.io/#map=2/32.2/18.3点击一些点，然后用获取两点之间QuadraticBezierCurve3之后使用getPoints获取两点之间任务数量的点

获取任意地点的铁路网，可以在OpenStreetMap 

http://www.overpass-api.de/index.html




