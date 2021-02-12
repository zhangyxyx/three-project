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
    camera.position.set(0, 20, 40);
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
    light = new THREE.PointLight(0xffffff);
    light.position.set(0, 0, 3000);
    light.castShadow = true;
    scene.add(light);
    var axesHelper = new THREE.AxesHelper(250);
    scene.add(axesHelper);


    loadDataFunc()
    model()
    renderPoint()
    buildpoints()
    setTimeout(function () {
        render()
    }, 2000)
    addTouchListener()
    //hotMap()

    window.addEventListener("click", onDocumentclick, false)

    //射线
    var raycaster = new THREE.Raycaster();
    var mouseVector = new THREE.Vector2();
    function onDocumentclick(event) {
        event.preventDefault();
        var intersects = getIntersects(event.layerX, event.layerY);
        $("#provinceInfo").css({ "left": event.clientX + 2 + 'px' })
        $("#provinceInfo").css({ "top": event.clientY + 2 + 'px' })
        createProvinceInfo(intersects)
    }
    function getIntersects(x, y) {
        //将鼠标位置转换成设备坐标。x和y方向的取值范围是(-1 to 1)
        x = (x / width) * 2 - 1;
        y = -(y / height) * 2 + 1;
        mouseVector.set(x, y);
        //通过摄像机和鼠标位置更新射线
        raycaster.setFromCamera(mouseVector, camera);
        // 返回物体和射线的焦点

        return raycaster.intersectObjects(scene.children, true)
    }
    var createProvinceInfo = function (activeInstersect) { // 显示省份的信息  
        if (activeInstersect.length !== 0) {
            var properties = activeInstersect[0].object;
            if (properties.name === 'Mesh1 ___2_1 Model') {//顶部
                clearInterval(timer1)
                clearInterval(timer2)
                buildtopclick()
            } else if (properties.name === 'Mesh2 ___1_1 Model') {//建筑体
            }
        }
    }
}
function render() {
    provinceArr.forEach(item => {
        item.material.uniforms['time'].value += .025;
    });
    if (traffic) {
        let positions = traffic.geometry.attributes.position.array;

        let len = positions.length,
            segments = AIO.LINE_POINTS_NUM * 3,
            num = len / AIO.LINE_POINTS_NUM / 3;

        for (let i = 0; i < num; i++) {
            let p1 = positions[i * segments],
                p2 = positions[i * segments + 1],
                p3 = positions[i * segments + 2];
            for (let j = 0; j < segments - 5; j = j + 3) {
                positions[i * segments + j] = positions[i * segments + j + 3];
                positions[i * segments + j + 1] = positions[i * segments + j + 4];
                positions[i * segments + j + 2] = positions[i * segments + j + 5];
            }
            positions[(i + 1) * segments - 3] = p1;
            positions[(i + 1) * segments - 2] = p2;
            positions[(i + 1) * segments - 1] = p3;
        }

        traffic.geometry.attributes.position.needsUpdate = true;
    }
    loadedMesh.rotation.y -= 0.02;
    loadedMesh2.rotation.y -= 0.02;
    cube.rotation.y -= 0.02;
    orbitcontrols.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

//建筑
function model() {
    var axisHelper = new THREE.AxisHelper(4);
    var loader = new THREE.OBJLoader();
    loader.load("./data/model/model1.obj", function (result) {//建筑体
        var material = new THREE.MeshLambertMaterial({ color: '#122254', side: THREE.DoubleSide });//122254
        loadedMesh = result
        // 加载完obj文件是一个场景组，遍历它的子元素，赋值纹理并且更新面和点的发现了
        loadedMesh.children.forEach(function (child) {
            child.material = material;
            //child.material.map = texture
            child.geometry.computeFaceNormals();
            child.geometry.computeVertexNormals();
        });

        loadedMesh.position.x = 0;
        loadedMesh.position.y = 0.3;
        loadedMesh.position.z = 0
        loadedMesh.name = "建筑体"
        loadedMesh.scale.set(0.2, 0.2, 0.2);
        loadedMesh.children[1].geometry.center()
        loadedMesh.children[0].geometry.center()
        scene.add(loadedMesh);
    });
    var loader2 = new THREE.OBJLoader();
    loader2.load("./data/model/model2.obj", function (result2) {//建筑顶部
        var material = new THREE.MeshLambertMaterial({ color: '#122254', side: THREE.DoubleSide });//122254
        loadedMesh2 = result2
        // 加载完obj文件是一个场景组，遍历它的子元素，赋值纹理并且更新面和点的发现了
        loadedMesh2.children.forEach(function (child) {
            child.material = material;
            //child.material.map = texture
            child.geometry.computeFaceNormals();
            child.geometry.computeVertexNormals();
        });

        loadedMesh2.position.x = 0;
        loadedMesh2.position.y = 0.6;
        loadedMesh2.position.z = 0
        loadedMesh2.name = "建筑顶"
        loadedMesh2.scale.set(0.2, 0.2, 0.2);
        loadedMesh2.children[0].geometry.center()
        scene.add(loadedMesh2);
    });
}

//点击将建筑顶部抬起
function buildtopclick() {
    if (loadedMesh2.position.y >= 2) {//向下走
        timer1 = setInterval(function () {
            loadedMesh2.position.y -= 0.04;
            if (loadedMesh2.position.y <= 0.6) {
                clearInterval(timer1)
            }
        }, 80)
    } else {
        timer2 = setInterval(function () {//向上走
            loadedMesh2.position.y += 0.04;
            if (loadedMesh2.position.y > 2) {
                clearInterval(timer2)
            }
        }, 80)
    }

}

//渲染道路
function loadDataFunc() {
    var nodesData = {}
    var linesData = []
    lineArr = [];
    $.ajax({
        url: './data/load.json',
        dataType: 'json',
        success: function (data) {
            var nodes = data.osm.node
            nodes.forEach(function (item) {
                nodesData[item['-id']] = item
            })
            var way = data.osm.way
            way.forEach(function (item) {
                var nd = item.nd
                var jsonitem = {
                    'name': item['-id'], 'val': []
                }
                nd.forEach(function (item1) {
                    var lon = parseFloat(nodesData[item1['-ref']]['-lon'])
                    var lat = parseFloat(nodesData[item1['-ref']]['-lat'])
                    var json = { 'lon': lon, 'lat': lat, }
                    jsonitem['val'].push(json)
                })
                linesData.push(jsonitem)
                if (item['-id'] === '723293438') {
                    trafficDataFunc(nd, nodesData)
                }
                if (item['-id'] === '30802563') {
                    trafficDataFunc(nd, nodesData)
                }
            })

            for (var i = 0; i < linesData.length; i++) {
                var val = linesData[i]['val']
                loadFunc(val)
            }

        }
    })
}
function loadFunc(val) {
    var line = val
    var groupLines = new THREE.Group();
    for (var j = 0; j < line.length; j++) {
        if (j + 1 >= line.length) {
            break;
        }
        var n1 = getPosition1(parseFloat(line[j]['lon']), parseFloat(line[j]['lat']))
        var n2 = getPosition1(parseFloat(line[j + 1]['lon']), parseFloat(line[j + 1]['lat']))
        var geometry = new THREE.Geometry();//声明一个空几何体对象
        var p1 = new THREE.Vector3(n1.x, n1.y, n1.z);//顶点1坐标
        var p2 = new THREE.Vector3(n2.x, n2.y, n2.z);//顶点2坐标
        geometry.vertices.push(p1, p2); //顶点坐标添加到geometry对象

        var material = new THREE.LineBasicMaterial({
            color: '#00fcff',
            linewidth: 30,
            linecap: 'round', //ignored by WebGLRenderer
            linejoin: 'round' //ignored by WebGLRenderer 
        });
        var lineitem = new THREE.Line(geometry, material);//线条模型对象
        lineitem.name = 'load'
        // lineitem.rotateX(0.3);
        // lineitem.rotateY(0.1);
        scene.add(lineitem);//线条对象添加到场景中
    }
    scene.add(groupLines);

}


//交通数据
function trafficDataFunc(data, nodesData) {
    var traffticdata = []
    data.forEach(function (item) {
        var lon = parseFloat(nodesData[item['-ref']]['-lon'])
        var lat = parseFloat(nodesData[item['-ref']]['-lat'])
        var json = { 'lon': lon, 'lat': lat, }
        traffticdata.push(json)
    })
    var arr1 = []
    for (var i = 0; i < 7; i++) {
        if (traffticdata[i] === undefined) {
            break;
        }
        var p = getPosition1(traffticdata[i].lon, traffticdata[i].lat)
        var log1 = p.x
        var lat1 = p.z

        arr1.push(log1)
        arr1.push(lat1)
        arr1.push(0)
    }
    AIO['ROAD_LINE_POINTS'].push(arr1)
    var trafficPromise = trafficFunc(0xffffff)
    trafficPromise.then(res => {
        traffic = res;
        scene.add(traffic);
    });
}
//渲染交投
function trafficFunc(color) {
    return new Promise(resolve => {
        let linePoints = AIO['ROAD_LINE_POINTS'];
        for (let i = 0; i < linePoints.length; i++) {
            let singleLinePoints = [];
            for (let j = 0; j < linePoints[i].length - 2; j++) {
                singleLinePoints.push(new THREE.Vector3(linePoints[i][j], linePoints[i][j + 1], linePoints[i][j + 2]));
                j = j + 2;
            }
            let pipeSpline = new THREE.CatmullRomCurve3(singleLinePoints);
            // if (pipeSpline.getLength() > 10 && pipeSpline.getLength() < 50) {

            // }
            AIO.TRAFFIC_POINTS.push(pipeSpline.getPoints(AIO.LINE_POINTS_NUM - 1));
        }
        const fragmentShader = `
        uniform sampler2D pointTexture;
        varying vec3 vColor;

        void main() {
            gl_FragColor = vec4( vColor, 1.0 );
            gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
        }
        `;
        const vertexShader = `
        attribute float size;
        varying vec3 vColor;

        void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
            gl_PointSize = size * ( 200.0 / -mvPosition.z );
            gl_Position = projectionMatrix * mvPosition;
        }
        `;
        let uniforms;

        const loader = new THREE.TextureLoader();
        const texture = loader.load('./css/img/spark1.png');
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        uniforms = {
            pointTexture: { value: texture }
        };
        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: uniforms,
            blending: THREE.AdditiveBlending,
            depthTest: true,
            depthWrite: false,
            transparent: true,
            vertexColors: true
        });

        let geometry = new THREE.BufferGeometry();
        let positions = [],
            colors = [],
            sizes = [];

        const c = new THREE.Color(color);
        const points = AIO.TRAFFIC_POINTS;

        for (let i = 0; i < points.length; i++) {
            for (let j = 0; j < points[i].length; j++) {
                positions.push(points[i][j].x, points[i][j].y, points[i][j].z);
                colors.push(c.r, c.g, c.b);
                if (j > AIO.LINE_POINTS_NUM / 10) {
                    sizes.push(0);
                } else {
                    sizes.push(Math.sqrt(j + 1) * 0.8);
                }

            }
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1).setUsage(THREE.DynamicDrawUsage));
        const particleSystem = new THREE.Points(geometry, material);
        particleSystem.rotation.set(-Math.PI / 2, 0, 0);

        //particleSystem.rotateX(0.3);
        //particleSystem.rotateY(0.1);
        resolve(particleSystem);
    });
}

//建筑点
function buildpoints() {
    var arr = [
        { x: 116.403694, y: 39.916927 }
    ]
    var marking = new THREE.Group();
    for (var i = 0; i < arr.length; i++) {
        var ballPos = getPosition1(arr[i].x, arr[i].y)
        var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        var material = new THREE.MeshBasicMaterial({ color: '#ffa500' });
        cube = new THREE.Mesh(geometry, material);
        //cube.position.set(ballPos.x, 0, ballPos.y);
        cube.position.set(0, 0.5, 0);
        cube.material.side = THREE.DoubleSide;
        marking.add(cube);
        scene.add(cube);
    }
    scene.add(marking);
}

//标记点
function renderPoint() {
    provinceArr = []
    var arr = [
        { x: 116.413058, y: 39.914227 }
    ]
    marking = new THREE.Group();
    for (var i = 0; i < arr.length; i++) {
        var ballPos = getPosition1(arr[i].x, arr[i].y)
        let breathBreathPulse = BreathPulse(1, 2, '#ffa500');
        breathBreathPulse.position.set(ballPos.x, 0, ballPos.y);
        provinceArr.push(breathBreathPulse)
        breathBreathPulse.rotation.x = -Math.PI / 2;
        marking.add(breathBreathPulse);
    }
    scene.add(marking);
}
//热力图
function hotMap() {
    var heatmap = h337.create({
        container: document.querySelector('#building'),
        width: 512,//这里一定要2的n次方倍数,否则控制台报警告（定死，与后面坐标系计算强关联）
        height: 256,//这里一定要2的n次方倍数,否则控制台报警告（定死，与后面坐标系计算强关联）
        blur: '.8',
        radius: 10,//辐射圈范围大小e
        alpha: true,
        gradient: { '.5': 'yellow', '.8': 'green', '.95': 'red' },
        backgroundColor: 'rgba(0,102,256,0)'
    });
    var max = 0;//最大值
    var data = [];//数据源
    var val = Math.floor(Math.random() * 100);
    var radius = Math.floor(Math.random() * 70);
    var _heatmapData = []
    var len = 300;
    for (var i = 0; i < len; i++) {
        var point = {
            x: Math.floor(Math.random() * 512),
            y: Math.floor(Math.random() * 256),
            value: val,
            // radius configuration on point basis
            radius: radius
        };
        _heatmapData.push(point);
    }
    for (var i = 0; i < _heatmapData.length; i++) {
        //计算坐标，这里与canvas分辨率有关（不知为啥512*256分辨率下只能传整数？？）
        var coord = { x: ((_heatmapData[i].x + 180) / 360 * 512).toFixed(0), y: ((90 - _heatmapData[i].y) / 180 * 256).toFixed(0) };
        data.push({ x: coord.x, y: coord.y, value: _heatmapData[i].value });
        //计算最大值
        max = max >= _heatmapData[i].value ? max : _heatmapData[i].value;
    }
    heatmap.setData({
        max: max,
        min: 0,
        data: data
    });
    var heatMapTexture = new THREE.Texture(heatmap._renderer.canvas);
    var material = new THREE.MeshLambertMaterial({
        map: heatMapTexture,
        transparent: true,
        opacity: 1
    });
    let heatMapGeo = new THREE.PlaneGeometry(120, 90);

    var heatMapPlane = new THREE.Mesh(heatMapGeo, material);
    heatMapPlane.position.set(0, 0.1, 0);
    heatMapPlane.rotation.x = -Math.PI / 2;
    scene.add(heatMapPlane);
}
function FlyLine(from, to, colorf, colort, size, alarmcolor) {
    const vertexShader = `
    uniform float time;
    uniform float size;
    varying vec3 iPosition;

    void main(){
        iPosition = vec3(position);
        float pointsize = 1.;
        if(position.x > time && position.x < (time + size)){
            pointsize = (position.x - time) / size;
        }
        gl_PointSize = pointsize * 2.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
    `;
    const fragmentShader = `
    uniform float time;
    uniform float size;
    uniform vec3 colorf;
    uniform vec3 colort;

    varying vec3 iPosition;

    void main( void ) {
        float end = time + size;
        vec4 color;
        if(iPosition.x > end || iPosition.x < time){
            // discard;
            //color = vec4(0.213,0.424,0.634,0.3);
            color = vec4(0,1,0,1); 
        }else if(iPosition.x > time && iPosition.x < end){
            float step = fract((iPosition.x - time)/size);

            float dr = abs(colort.x - colorf.x);
            float dg = abs(colort.y - colorf.y);
            float db = abs(colort.z - colorf.z);

            float r = colort.x > colorf.x?(dr*step+colorf.x):(colorf.x -dr*step);
            float g = colort.y > colorf.y?(dg*step+colorf.y):(colorf.y -dg*step);
            float b = colort.z > colorf.z?(db*step+colorf.z):(colorf.z -db*step);

            color = vec4(r,g,b,1.0);
        }
        float d = distance(gl_PointCoord, vec2(0.5, 0.5));
        if(abs(iPosition.x - end) < 0.2 || abs(iPosition.x - time) < 0.2){
            if(d > 0.5){
                discard;
            }
        }
        gl_FragColor = color;
    }
    `;

    let uniforms = {
        time: {
            type: "float",
            value: 0
        },
        colorf: {
            type: "vec3",
            value: new THREE.Color(colorf)
        },
        colort: {
            type: "vec3",
            value: new THREE.Color(colort)
        },
        size: {
            type: "float",
            value: size
        }
    };

    let curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(from.x, from.y, from.z),
        //new THREE.Vector3((to.x + from.x) / 2, (to.y + from.y) / 2, Math.abs(Math.sqrt(Math.pow((to.x - from.x), 2) + Math.pow((to.y - from.y), 2))) * .8),
        new THREE.Vector3(to.x, to.y, to.z)
    );

    const lineLen = parseInt(curve.getLength())


    let points = curve.getPoints(lineLen * 50);//
    let geometry = new THREE.Geometry();
    geometry.vertices = points;
    let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        depthTest: true,
        opacity: 1,
        side: THREE.DoubleSide,
        vertexColors: THREE.FaceColors
    });

    let mesh = new THREE.Points(geometry, material);
    mesh.maxx = to.x;
    mesh.minx = from.x;

    return mesh;
};
function BreathPulse(opacity, radius, color) {
    const vertexShader = `
    precision lowp float;
    precision lowp int;
    #include <fog_pars_vertex>
    varying vec2 vUv;
    void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        vUv = uv;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        #include <fog_vertex>
    }
    `;
    const fragmentShader = `
    precision lowp float;
    precision lowp int;
    varying vec2 vUv;
    uniform float time;
    uniform vec3 color;
    uniform float opacity;

    #include <common>
    #include <fog_pars_fragment>

    void main() {
        vec2 uv = vUv - 0.5;
        float dir = length(uv);
        
        float r = dir*.85;
        r = r*2.-1.;
        float s = sin(pow(r+1.0, 2.0)-time*3.0)*sin(r+0.99);
        vec3 col = color;
        col *= (abs(1./(s*60.8))-.01);
        gl_FragColor = vec4(col, 0.);
        
        float ratio = 0.25;
        if (dir < ratio) {
            gl_FragColor.a = mix(0.3, 0.0, (dir - ratio) / (0.5 - ratio));
            //gl_FragColor.a = opacity;
        } else {
            gl_FragColor.a = mix(0.3, 0.0, (dir - ratio) / (0.5 - ratio));
        }
        
        #include <fog_fragment>
    }
    `;

    let uniforms = THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
        time: {
            type: "float",
            value: 0
        },
        color: {
            type: "vec3",
            value: new THREE.Color(color)
        },
        opacity: {
            type: "float",
            value: opacity
        }
    }]);

    let geometry = new THREE.PlaneBufferGeometry(radius, radius, 2);
    let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide
    });

    let mesh = new THREE.Mesh(geometry, material);

    return mesh;
};

function addTouchListener() {
    var startX, endX, startY, endY;
    document.body.οnmοusedοwn = function (event) {
        startX = event.clientX;
        startY = event.clientY;

    };
    document.body.οnmοusemοve = function (event) {
        if (event.button == 1) {
            endX = event.clientX;
            endY = event.clientY;
            var x = endX - startX;
            var y = endY - startY;
            if (Math.abs(x) > Math.abs(y)) {
                camera.position.x = camera.position.x - x * 0.05;
            } else {
                camera.position.y = camera.position.y + y * 0.05;
            }
            startX = endX;
            startY = endY;
        }
    };
}

var getPosition1 = function (longitude, latitude) {
    //const projection = d3.geoMercator().scale(1).translate([0, 0]);
    var lg = (longitude - 116.403694) * 1500 - 20
    var lt = (latitude - 39.916927) * 2000 + 10
    return {
        x: lg,
        y: 0,
        z: lt
    }
}
