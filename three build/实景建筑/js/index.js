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
    camera.position.set(0, 400, 500);
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


    plane()
    treeFunc()
    grasslandFunc()
    renderludengFunc()
    renderroadFunc()
    buildFunc()

}
function render() {
    delta = clock.getDelta();
    //objectBuild.rotation.y -= 0.02;
    orbitControls.update(delta);
    requestAnimationFrame(render);
    renderer.render(scene, camera)  
}
/*渲染平面*/
function plane() {
    var planeGeo = new THREE.PlaneGeometry(1000, 500)
    var planeMat = new THREE.MeshLambertMaterial({ color: 0x666666, wireframe: false })
    var planeMesh = new THREE.Mesh(planeGeo, planeMat)
    planeMesh.position.set(0, 0, 0)
    planeMesh.receiveShadow = true
    planeMesh.rotation.x = rotateObj2
    scene.add(planeMesh)
}/*渲染草地*/
function grasslandFunc(){
  var json={
      scalex:3.3,
      scaley:1.6,
      scalez:1,
      positionx:0,
      positiony:0,
      positionz:0,
      rotatex:rotateObj2,
      rotatey:0,
      rotatez:0,
  }
  renderObj('./data/grassland/grassland.mtl','./data/grassland/grassland.obj',json)
}
/*渲染树木*/
function treeFunc() {
  var data={
    '1':{
      scalex:2,
      scaley:6,
      scalez:2,
      positionx:300,
      positiony:10,
      positionz:100,
      rotatex:rotateObj1,
      rotatey:0,
      rotatez:0,
    },
    '2':{
      scalex:2,
      scaley:6,
      scalez:2,
      positionx:-300,
      positiony:10,
      positionz:0,
      rotatex:rotateObj1,
      rotatey:0,
      rotatez:0,
    },
    '3':{
      scalex:2,
      scaley:6,
      scalez:2,
      positionx:300,
      positiony:10,
      positionz:0,
      rotatex:rotateObj1,
      rotatey:0,
      rotatez:0,
    },

  }
  for(var key in data){
    renderObj('./data/Tree02/Tree.mtl','./data/Tree02/Tree.obj',data[key])
  }


}

/*获取路灯信息*/
function renderludengFunc(){
  var data={
    '1':{//左边
      scalex:0.03,
      scaley:0.02,
      scalez:0.5,
      positionx:-320,
      positiony:20,
      positionz:0,
      rotatex:rotateObj1,
      rotatey:0,
      rotatez:0,
    },
    '2':{//左边
      scalex:0.03,
      scaley:0.02,
      scalez:0.5,
      positionx:-320,
      positiony:20,
      positionz:100,
      rotatex:rotateObj1,
      rotatey:0,
      rotatez:0,
    },
    '2':{//左边
      scalex:0.03,
      scaley:0.02,
      scalez:0.5,
      positionx:-320,
      positiony:20,
      positionz:-100,
      rotatex:rotateObj1,
      rotatey:0,
      rotatez:0,
    },

  }
  for(var key in data){
    renderObj('./data/ludeng/ludeng.mtl','./data/ludeng/ludeng.obj',data[key])
  }
}
/*获取道路位置信息*/
function renderroadFunc(){
  var data={
    '1':{//垂直
      scalex:5,
      scaley:5,
      scalez:40,
      positionx:300,
      positiony:20,
      positionz:0,
      rotatex:rotateObj1,
      rotatey:0,
      rotatez:0,
    },
    '2':{//垂直
      scalex:5,
      scaley:5,
      scalez:40,
      positionx:-300,
      positiony:20,
      positionz:0,
      rotatex:2.1* Math.PI,
      rotatey:0,
      rotatez:Math.PI,
    },
    '3':{//横向
      scalex:5,
      scaley:5,
      scalez:80,
      positionx:0,
      positiony:70,
      positionz:-150,
      rotatex:rotateObj1,
      rotatey:0.5* Math.PI,
      rotatez:Math.PI,
    },
    '4':{//横向
      scalex:5,
      scaley:5,
      scalez:80,
      positionx:0,
      positiony:-30,
      positionz:150,
      rotatex:rotateObj1,
      rotatey:0.5* Math.PI,
      rotatez:Math.PI,
    }
  }
  for(var key in data){
    renderObj('./data/road/road/road.mtl','./data/road/road/road.obj',data[key])
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

