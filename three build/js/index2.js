var scene
var camera
var renderer
var orbitcontrols
var light
var dom = document.getElementById("building");
var loadedMesh, loadedMesh_object3D
var loadedMesh2, loadedMesh2_object3D
var timer1, timer2;//顶部运动定时器
var lineArr = [];
var scenedata = {
    'trafficdata': []
}
var AIO = {
    'ROAD_LINE_POINTS': [],
    'TRAFFIC_POINTS': [],
    'LINE_POINTS_NUM': 200
}
var traffic
var marking
var provinceArr = []
$(function () {
    $("#building").css({ "width": $(window).width(), "height": $(window).height() })
    renderBuild()
})

//渲染建筑
function renderBuild() {
    var width = document.getElementById('building').clientWidth;
    var height = document.getElementById('building').clientHeight;
    //初始化场景
    scene = new THREE.Scene();
    // 初始化相机
    camera = new THREE.PerspectiveCamera(10, dom.clientWidth / dom.clientHeight, 1, 100000);
    // 设置相机位置
    camera.position.set(500, 200, 800);
    //渲染器
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    // 设置窗口尺寸
    renderer.setSize(dom.clientWidth, dom.clientHeight);
    // 初始化控制器
    orbitcontrols = new THREE.OrbitControls(camera, renderer.domElement);
    dom.appendChild(renderer.domElement);
    // 设置光线
    // var spotLight = new THREE.SpotLight(0xffffff);
    // spotLight.position.set(500,500,800);
    // spotLight.castShadow = true;
    // scene.add(spotLight);
    let light = new THREE.DirectionalLight( 0xffffff, 0.8);
    light.position.set( 500,500,800 ); //default; light shining from top
    light.castShadow = true; // default false
    scene.add( light );
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default

    let planeGeometry = new THREE.PlaneBufferGeometry( 100, 100, 32, 32 );
    let planeMaterial = new THREE.MeshStandardMaterial( { color: 0x000000 } )
    let plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.receiveShadow = true;
    //plane.position.z=-10;
    plane.rotateX(4.6)
    scene.add( plane );
    
    var axesHelper = new THREE.AxesHelper(250);
    scene.add(axesHelper);
    model()
    render()
}
function render() {
    orbitcontrols.update();
    requestAnimationFrame(render);
    renderer.shadowMap.enabled = true;
    renderer.render(scene, camera);
}

//建筑
function model() {
    var axisHelper = new THREE.AxisHelper(4);
    var loader = new THREE.OBJLoader();
    var OBJLoader = new THREE.OBJLoader(); 
    console.log(THREE)
    var MTLLoader = new THREE.MTLLoader(); 
    MTLLoader.load('./data/model2/model.mtl', function(materials) {
            console.log(materials);
            OBJLoader.setMaterials(materials);
            materials.castShadow = true; 
            OBJLoader.load('./data/model2/model.obj', function(obj) {
            console.log(obj);
            obj.castShadow = true; //default is false
            obj.receiveShadow = false; //default
            scene.add(obj); 
            //obj.children[0].scale.set(2, 2, 2); 
            //obj.children[0].geometry.center(); 
        })
    })
		
   
}



