var camera, scene, renderer, orbitControls, clock, delta;
var objectBuild
var rotateObj1=2.1* Math.PI
var rotateObj2=1.6* Math.PI
main();
setTimeout(function () {
  render()
}, 2000)

function main() {
    //创建元素画布
    container = document.createElement('div')
    document.body.appendChild(container)
    //创建场景
    scene = new THREE.Scene();
    scene.rotation.x=2.1* Math.PI
    //创建相机
    camera = new THREE.PerspectiveCamera(35, $(window).width() / $(window).height(), 1, 100000);
    camera.position.set(0, 800, 600);
    camera.lookAt(scene.position);
    scene.add(camera)

    //渲染整个场景
    renderer = new THREE.WebGLRenderer({ antiakuas: true })
    renderer.setClearColor(new THREE.Color('rgb(255,255,255)'), 1)//整个画布的背景颜色
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMapEnabled = true;
    container.appendChild(renderer.domElement)


    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.target = new THREE.Vector3(0, 0, 0);//控制焦点
    orbitControls.autoRotate = false;//将自动旋转关闭
    clock = new THREE.Clock();//用于更新轨道控制器

    //光源
    let ambientLight = new THREE.AmbientLight(0xc8e2ec);
    scene.add(ambientLight);
    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(0, 1, 500);
    scene.add(directionalLight);

    var axes = new THREE.AxisHelper(250);
    scene.add(axes);


    //plane()
    //treeFunc()
    //grasslandFunc()
    //renderludengFunc()

    //buildFunc()
    planeFunc()
    renderroadFunc0()

}
function render() {
    delta = clock.getDelta();
    //objectBuild.rotation.y -= 0.02;
    orbitControls.update(delta);
    requestAnimationFrame(render);
    renderer.render(scene, camera)
}
/*渲染平面*/
function planeFunc(){
  renderer.setClearColor(0x001111, 1);
  var rangeSize = 3000; //地面网格尺寸
  var divisions = 50; //地面网格细分数
  var color = 0x004444;//网格线颜色
  var gridHelper = new THREE.GridHelper(rangeSize, divisions, color, color);
  scene.add(gridHelper);
}
function renderroadFunc0(){
        var geometry = new THREE.BufferGeometry(); //创建一个缓冲类型几何体
        // 绘制一个U型轮廓曲线curve
        var R = 60; //圆弧半径
        var arc = new THREE.ArcCurve(0, 0, R, 0, Math.PI, true);
        // 半圆弧的一个端点作为直线的一个端点
        var line1 = new THREE.LineCurve(new THREE.Vector2(R, 200), new THREE.Vector2(R, 0));
        var line2 = new THREE.LineCurve(new THREE.Vector2(-R, 0), new THREE.Vector2(-R, 200));
        var curve = new THREE.CurvePath(); // 创建组合曲线对象CurvePath
        curve.curves.push(line1, arc, line2); // 把多个线条插入到CurvePath中
        //曲线上等间距返回多个顶点坐标
        // var pointsArr = curve.getSpacedPoints(100); //分段数100，返回101个顶点
        //直线不细分，圆弧细分20
        var pointsArr = curve.getPoints(20);

        geometry.setFromPoints(pointsArr);
        var material = new THREE.LineBasicMaterial({
            color: 0x00ffff,
        });
        var line = new THREE.Line(geometry, material);
        line.rotateX(-Math.PI / 2);//从XOY平面旋转到XOZ平面
        scene.add(line);

        // 对曲线上的顶点坐标进行等间距计算
        var pointsArr1 = [];
        var pointsArr2 = [];
        // 对曲线进行等距计算
        pointsArr.forEach((顶点坐标, i) => {
            // 不使用getTangentAt计算切线
            var Z轴单位向量 = new THREE.Vector3(0, 0, 1); //沿着z轴方向单位向量
            // 相邻两点相减计算切线
            var 相邻点 = null;
            var 切线Vector2 = null;
            if (pointsArr[i + 1]) {
                相邻点 = pointsArr[i + 1]; // 下一个相邻点坐标
                切线Vector2 = 相邻点.clone().sub(顶点坐标).normalize();
            } else { //最后一个点没有下一个点，选择上一个点作为相邻点
                相邻点 = pointsArr[i - 1]; // 上一个相邻点坐标
                切线Vector2 = 顶点坐标.clone().sub(相邻点).normalize();
            }
            // 切线二维向量转三维向量
            var 切线 = new THREE.Vector3(切线Vector2.x, 切线Vector2.y, 0);
            // 切线绕z轴旋转90度计算垂线
            var 切线垂线 = 切线.clone().applyAxisAngle(Z轴单位向量, Math.PI / 2);
            var 间距 = 8; //带状轨迹宽度  等间距距离
            var 等距顶点坐标1 = 顶点坐标.clone().add(切线垂线.clone().multiplyScalar(间距/2));
            var 等距顶点坐标2 = 顶点坐标.clone().add(切线垂线.clone().multiplyScalar(-间距/2));
            pointsArr1.push(等距顶点坐标1);
            pointsArr2.push(等距顶点坐标2);
        });

        pointsArr2.reverse();//注意等间距顶点数组倒序
        // 两组顶点构成一个封闭带状轮廓
        var shape = new THREE.Shape(pointsArr1.concat(pointsArr2));
        //填充轮廓生成一个带状平面几何体ShapeBufferGeometry
        var geometry = new THREE.ShapeBufferGeometry(shape);
        var material = new THREE.MeshLambertMaterial({
            color: 0x00ffff,
            side: THREE.DoubleSide, //两面可见
        });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.rotateX(-Math.PI / 2);//从XOY平面旋转到XOZ平面
        scene.add(mesh);

        // 渲染等间距后曲线
        // var geometry1 = new THREE.BufferGeometry(); //创建一个缓冲类型几何体
        // geometry1.setFromPoints(pointsArr1);
        // scene.add(new THREE.Line(geometry1, material));
        // var geometry2 = new THREE.BufferGeometry(); //创建一个缓冲类型几何体
        // geometry2.setFromPoints(pointsArr2);
        // scene.add(new THREE.Line(geometry2, material));


        // 渲染平移前后的顶点
        // var PointsMaterial = new THREE.PointsMaterial({
        //     color: 0xffff00,
        //     size: 3.0, //点大小
        // });
        // scene.add(new THREE.Points(geometry1, PointsMaterial));
        // scene.add(new THREE.Points(geometry2, PointsMaterial));
}


















/*获取道路位置信息*/
function renderroadFunc(){
  var data={
    '1':{//垂直
      scalex:5,
      scaley:20,
      scalez:20,
      positionx:-300,
      positiony:0,
      positionz:200,
      rotatex:0,
      rotatey:0,
      rotatez:0,
    },
  }
  for(var key in data){
    renderObj('././data/road2/road.mtl','././data/road2/road.obj',data[key])
  }
  var result={
    '1':{//垂直
      scalex:2,
      scaley:0,
      scalez:2,
      positionx:-200,
      positiony:0,
      positionz:0,
      rotatex:0,
      rotatey:0,
      rotatez:0,
    },
  }
  for(var key in result){
    renderObj('././data/road2/roadshi.mtl','././data/road2/roadshi.obj',result[key])
  }

}
/*建筑*/
function buildFunc(){
  var json={
      scalex:1,
      scaley:1,
      scalez:1,
      positionx:0,
      positiony:10,
      positionz:20,
      rotatex:rotateObj1,
      rotatey:-0.5* Math.PI,
      rotatez:0,
  }
  renderObjBuild('./data/model2/model.mtl','./data/model2/model.obj',json)
}
function renderObj(modelobj,modelmtl,opt){
  const manager = new THREE.LoadingManager();
  manager.addHandler( /\.dds$/i, new THREE.DDSLoader() );
  const onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      const percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
    }
  };
  const onError = function () { };
  new THREE.MTLLoader( manager ).load( modelobj, function ( materials ) {
    materials.preload();
    new THREE.OBJLoader( manager )
      .setMaterials( materials ).load( modelmtl, function ( object ) {
        object.rotation.x =opt.rotatex
        object.rotation.y =opt.rotatey
        object.rotation.z =opt.rotatez
        object.scale.set(opt.scalex, opt.scaley, opt.scalez);
        object.position.x = opt.positionx;
        object.position.y = opt.positiony;
        object.position.z = opt.positionz;
        scene.add( object );
      }, onProgress, onError );
  } );
}
function renderObjBuild(modelobj,modelmtl,opt){
  const manager = new THREE.LoadingManager();
  manager.addHandler( /\.dds$/i, new THREE.DDSLoader() );
  const onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      const percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
    }
  };
  const onError = function () { };
  new THREE.MTLLoader( manager ).load( modelobj, function ( materials ) {
    materials.preload();
    new THREE.OBJLoader( manager )
      .setMaterials( materials ).load( modelmtl, function ( object ) {
        objectBuild=object
        objectBuild.rotation.x =opt.rotatex
        objectBuild.rotation.y =opt.rotatey
        objectBuild.rotation.z =opt.rotatez
        objectBuild.scale.set(opt.scalex, opt.scaley, opt.scalez);
        objectBuild.position.x = opt.positionx;
        objectBuild.position.y = opt.positiony;
        objectBuild.position.z = opt.positionz;
        scene.add( objectBuild );
      }, onProgress, onError );
  } );
}

