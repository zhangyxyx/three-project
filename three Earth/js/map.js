$(function () {
    getearthdata()
})

//3D地球
function getearthdata() {
    $(".map").html('<div id="webpowercontentearth"></div>')
    var nodeindex1 = [
        {
            fontColor: "#c6aa0e",
            fontSize: 14,
            nodecode: "N0012",
            nodestat: 5,
            pos: [7.913597, 45.597392, "泛欧区"],
            textValue: "法兰克福",
        },
        {
            fontColor: "#c6aa0e",
            fontSize: 14,
            nodecode: "N0001",
            nodestat: 5,
            pos: [114.173355, 20.320048, "亚太区"],
            textValue: "香港",
        }
    ]
    var linearray1 = [
        {
            end: "香港",
            endcode: "N0001",
            linedesc: "这是提示信息",
            linestat: 0,
            start: "法兰克福",
            startcode: "N0012",
        }
    ]
    earth3D(nodeindex1, linearray1)

}
function earth3D(nodeindex, linearray) {
    // 渲染器
    var renderer = null;
    // 相机
    var camera = null;
    // 场景
    var scene = null;
    // 包裹画布dom
    var dom = document.getElementById("webpowercontentearth");
    // 地球对象
    var earthBall = null;
    // 标记点集合对象
    var marking = null;
    // 标记位置对象
    var markingPos = null;
    var markingPos = {
        marking: nodeindex,
        linearray1: linearray
    };
    // 地球大小
    var earthBallSize = 30;
    // 地球贴图
    var earthImg = '././css/img/earth3d4.png';//three_map  three_map1  earthbg4
    // 迁徙路径分段数
    var metapNum = 150;
    // 迁徙路径标记分段数
    var markingNum = 50;
    // 轨迹线条颜色
    var metapLineColor = '#01f5f6';
    // 球上标记点大小
    var dotWidth = 0.5;
    // 球上标记点颜色
    var dotColor = '#1bb4b0';
    // 轨迹上运动的球大小
    var slideBallSize = 1;
    // 轨迹上运动的球颜色
    var slideBallColor = '#01f5f6';
    var width = document.getElementById('webpowercontentearth').clientWidth;
    var height = document.getElementById('webpowercontentearth').clientHeight;
    // 线条对象集合

    var lineArr = []
    // 经纬度转换函数
    var getPosition = function (longitude, latitude, radius) {
        var lg = THREE.Math.degToRad(longitude);
        var lt = THREE.Math.degToRad(latitude);
        var temp = radius * Math.cos(lt);
        var x = temp * Math.sin(lg);
        var y = radius * Math.sin(lt);
        var z = temp * Math.cos(lg);
        return {
            x: x,
            y: y,
            z: z
        }
    }
    // 计算球体上两个点的中点
    var getVCenter = function (v1, v2) {
        var v = v1.add(v2);
        return v.divideScalar(2);
    }
    // 计算球体两点向量固定长度的点
    var getLenVcetor = function (v1, v2, len) {
        var v1v2Len = v1.distanceTo(v2);
        return v1.lerp(v2, len / v1v2Len);
    }
    // 添加轨迹函数
    var addLine = function (v0, v3, color) {
        var angle = (v0.angleTo(v3) * 80) / Math.PI;
        var aLen = angle * 0.5 * (1 - angle / (Math.PI * 90));
        var hLen = angle * angle * 1.2 * (1 - angle / (Math.PI * 90));
        var p0 = new THREE.Vector3(0, 0, 0);
        // 法线向量
        var rayLine = new THREE.Ray(p0, getVCenter(v0.clone(), v3.clone()));
        // 顶点坐标
        var vtop = rayLine.at(hLen / rayLine.at(1).distanceTo(p0), p0);
        // 控制点坐标
        var v1 = getLenVcetor(v0.clone(), vtop, aLen);
        var v2 = getLenVcetor(v3.clone(), vtop, aLen);
        // 绘制贝塞尔曲线
        var curve = new THREE.CubicBezierCurve3(v0, v1, v2, v3);
        var geometry = new THREE.Geometry();
        geometry.vertices = curve.getPoints(100);
        var line = new MeshLine();
        line.setGeometry(geometry);
        var material = new MeshLineMaterial({//
            color: color,
            lineWidth: 1,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide,
        })
        return {
            curve: curve,
            lineMesh: new THREE.Mesh(line.geometry, material)
        }
    }
    // 执行函数
    var render = function () {
        //scene.rotation.y -= 0.01;

        lineArr.forEach(item => {
            let t = item.material.uniforms.time.value;
            let size = item.material.uniforms.size.value;

            if (item.maxx > item.minx) {
                if (t > item.maxx) {
                    item.material.uniforms.time.value = item.minx - size;
                }
                item.material.uniforms['time'].value += 0.2;
            } else {
                if (t < item.maxx - size) {
                    item.material.uniforms.time.value = item.minx;
                }
                item.material.uniforms['time'].value -= 0.2;
            }
        });
        renderer.render(scene, camera);
        orbitcontrols.update();
        requestAnimationFrame(render);
    }
    // 初始化函数
    var initThree = function () {
        // 初始化场景
        scene = new THREE.Scene();
        scene.rotation.y = 34.5;
        // 初始化相机
        camera = new THREE.PerspectiveCamera(20, dom.clientWidth / dom.clientHeight, 1, 100000);
        // 设置相机位置
        camera.position.set(0, 10, 220);
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
        //scene.add(new THREE.HemisphereLight('#ffffff', '#ffffff', 1));
        // 定义地球材质
        var earthTexture = THREE.ImageUtils.loadTexture(earthImg, {}, function () {
            renderer.render(scene, camera);
        });
        // 创建地球
        earthBall = new THREE.Mesh(new THREE.SphereGeometry(30, 50, 50), new THREE.MeshBasicMaterial({
            map: earthTexture
        }));
        earthBall.position.set(0, 0, 0);
        earthBall.name = 'eath'
        scene.add(earthBall);
        // 标记点组合
        marking = new THREE.Group();
        // 将标记点添加到地球上
        markingPos.marking.forEach(function (markingItem) {
            // 创建标记点球体
            var color = 'green'
            if (parseInt(markingItem['nodestat']) === 5) {
                color = '#cc522a'
            } else {
                color = 'green'
            }
            var ball = new THREE.Mesh(new THREE.SphereGeometry(dotWidth, 30, 30), new THREE.MeshBasicMaterial({
                color: color
            }));
            // 获取标记点坐标

            if (markingItem.pos) {
                var ballPos = getPosition(markingItem.pos[0] + 90, markingItem.pos[1], earthBallSize);// getPosition(markingItem.pos[0], markingItem.pos[1], earthBallSize);
                ball.name = 'point'
                ball.nametext = markingItem['textValue']
                ball.position.set(ballPos.x, ballPos.y, ballPos.z);
                marking.add(ball);
            }

        })
        scene.add(marking);
        var animateDots = [];
        var groupLines = new THREE.Group();
        // 线条
        markingPos.linearray1.forEach(function (item1) {
            var startitem = item1['start']; var enditem = item1['end']
            var startpos = ''; var endpos = '';
            marking.children.forEach(function (item) {
                if (item['nametext'] === startitem) {
                    startpos = item
                }
                if (item['nametext'] === enditem) {
                    endpos = item
                }
            })
            var color = 'green'
            if (parseInt(item1['linestat']) === 5) {
                color = '#cc522a'
            } else {
                color = 'green'
            }
            // var line = addLine(startpos.position, endpos.position, color);
            // line.lineMesh.name = 'line'
            // line.lineMesh.linedesc = item1['linedesc']
            // lineArr.push(line);
            // groupLines.add(line.lineMesh);
            // animateDots.push(line.curve.getPoints(metapNum));

            let line = FlyLine(startpos.position, endpos.position, 0xffffff, 0xffffff, 10, '0,1,0,1');//0x33C631, 0x33C631
            line.name = 'line'
            line.linedesc = item1['linedesc']
            lineArr.push(line);
            groupLines.add(line);




        })
        scene.add(groupLines);
        // 线上滑动的小球
        var aGroup = new THREE.Group();
        for (var i = 0; i < animateDots.length; i++) {
            for (var j = 0; j < markingNum; j++) {
                var aGeo = new THREE.SphereGeometry(0.2, 2, 2);
                var aMaterial = new THREE.MeshBasicMaterial({
                    color: '#fff',
                    transparent: true,
                    opacity: 1 - j * 0.02
                })
                var aMesh = new THREE.Mesh(aGeo, aMaterial);
                aGroup.add(aMesh);
            }
        }
        var vIndex = 0;
        var firstBool = true;
        function animationLine() {
            aGroup.children.forEach(function (elem, index) {
                var _index = parseInt(index / markingNum);
                var index2 = index - markingNum * _index;
                var _vIndex = 0;
                if (firstBool) {
                    _vIndex = vIndex - index2 % markingNum >= 0 ? vIndex - index2 % markingNum : 0;
                } else {
                    _vIndex = vIndex - index2 % markingNum >= 0 ? vIndex - index2 % markingNum : metapNum + vIndex - index2;
                }
                var v = animateDots[_index][_vIndex];
                elem.position.set(v.x, v.y, v.z);
            })
            vIndex++;
            if (vIndex > metapNum) {
                vIndex = 0;
            }
            if (vIndex == metapNum && firstBool) {
                firstBool = false;
            }
            requestAnimationFrame(animationLine);
        }
        scene.add(aGroup);
        animationLine();
        // 渲染

        render();
        setText()
        window.addEventListener("mousemove", onDocumentMouseOver, false)
        // var axisHelper = new THREE.AxisHelper(400)//每个轴的长度
        // scene.add(axisHelper);
    }
    //显示文字
    var setText = function () {
        var loader = new THREE.FontLoader();
        loader.load('./js/three/MicrosoftYaHei_Regular.json', function (font) {
            markingPos.marking.forEach(function (markingItem) {
                var materialtext = new THREE.MeshBasicMaterial({
                    color: '#fff'//'#2080EC',
                });
                var text = new THREE.Mesh(new THREE.TextGeometry(markingItem['textValue'], { font: font, size: 1, height: 0 }), materialtext);
                var pos = getPosition(markingItem['pos'][0] + 90, markingItem['pos'][1], earthBallSize)
                text.position.copy(new THREE.Vector3(0, 0, 0))
                text.lookAt(new THREE.Vector3(pos.x, pos.y, pos.z))
                text.position.copy(new THREE.Vector3(pos.x, pos.y, pos.z))
                scene.add(text);
            })

        });
    }
    //射线检测
    var raycaster = new THREE.Raycaster();
    var mouseVector = new THREE.Vector2();
    function onDocumentMouseOver(event) {
        event.preventDefault();
        var intersects = getIntersects(event.layerX, event.layerY);
        $("#provinceInfo").css({ "left": event.clientX + 2 + 'px' })
        $("#provinceInfo").css({ "top": event.clientY + 2 + 'px' })
        createProvinceInfo(intersects)
    }
    function getIntersects(x, y) {
        //将鼠标位置转换成设备坐标。x和y方向的取值范围是(-1 to 1)
        var x = (x / width) * 2 - 1;
        var y = -(y / height) * 2 + 1;
        mouseVector.set(x, y);

        //通过摄像机和鼠标位置更新射线
        raycaster.setFromCamera(mouseVector, camera);
        // 返回物体和射线的焦点

        return raycaster.intersectObjects(scene.children, true)
    }
    var createProvinceInfo = function (activeInstersect) { // 显示省份的信息  
        if (activeInstersect.length !== 0) {
            $("#provinceInfo").css({ "display": "none" })
            var properties = activeInstersect[0].object;
            if (properties.name === 'point') {
                $("#provinceInfo").html(properties.nametext)
                $("#provinceInfo").css({ "display": "block" })
            } else if (properties.name === 'line') {
                $("#provinceInfo").html(properties.linedesc)
                $("#provinceInfo").css({ "display": "block" })
            }
        } else {
            if (properties && properties.geometry && properties.geometry.name === 'point') {
            }
            $("#provinceInfo").css({ "display": "none" })
        }
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
        var v0 = from, v3 = to;
        var angle = (v0.angleTo(v3) * 80) / Math.PI;
        var aLen = angle * 0.5 * (1 - angle / (Math.PI * 90));
        var hLen = angle * angle * 1.2 * (1 - angle / (Math.PI * 90));
        var p0 = new THREE.Vector3(0, 0, 0);
        // 法线向量
        var rayLine = new THREE.Ray(p0, getVCenter(v0.clone(), v3.clone()));
        // 顶点坐标
        var vtop = rayLine.at(hLen / rayLine.at(1).distanceTo(p0), p0);
        // 控制点坐标
        var v1 = getLenVcetor(v0.clone(), vtop, aLen);
        var v2 = getLenVcetor(v3.clone(), vtop, aLen);

        let curve = new THREE.CubicBezierCurve3(
            v0, v1, v2, v3
        );

        const lineLen = parseInt(curve.getLength())


        let points = curve.getPoints(lineLen * 50);
        let geometry = new THREE.Geometry();
        geometry.vertices = points;
        let material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            blending: THREE.AdditiveBlending,
            transparent: true,
            //depthWrite: false,
            //depthTest: true,
            opacity: 1,
            side: THREE.DoubleSide,
            vertexColors: THREE.FaceColors
        });

        let mesh = new THREE.Points(geometry, material);
        mesh.maxx = to.x;
        mesh.minx = from.x;

        return mesh;
    };
    initThree();
}
window.chinaGeoCoordMapzyx1 = {
    'Hongkong': [114.173355, 20.320048, '亚太区'],
    'Singapore': [103.868811, 1.367601, '亚太区'],
    'San Jose': [-121.931988, 37.336814, '美洲区'],
    'Los Angeles': [-118.247045, 34.06019, '美洲区'],
    'London': [-0.126608, 51.208425, '泛欧区'],
    'Frankfurt': [2.343598, 48.864203, '泛欧区'],
    '香港': [114.173355, 20.320048, '亚太区'],
    '河内': [105.860369, 21.032968, '亚太区'],
    '新加坡': [103.868811, 1.367601, '亚太区'],
    '圣何塞': [-121.931988, 37.336814, '美洲区'],
    '洛杉矶': [-118.247045, 34.06019, '美洲区'],
    '伦敦': [-0.126608, 51.208425, '泛欧区'],
    '巴黎': [2.339574, 48.855667, '泛欧区'],
    '法兰克福': [7.913597, 45.597392, '泛欧区'],
    '悉尼': [151.211596, -33.852272, '美洲区'],
    '新德里': [77.116626, 28.705564, '亚太区'],
    '孟买': [72.828928, 18.973624, '亚太区'],
    '迪拜': [55.31113, 25.276578, '美洲区'],
    '迈阿密': [-80.19888, 25.768303, '美洲区'],
    '纽约': [-73.860228, 40.854168, '美洲区'],
    '西雅图': [-122.324276, 47.604156, '美洲区'],
    '仰光': [96.152769, 16.808451, '亚太区'],
    '东京': [139.728092, 35.747025, '亚太区'],
    '华盛顿': [-77.034571, 38.906968, '美洲区'],
    '曼德勒': [96.098302, 21.974113, '亚太区'],

    '伊斯坦布尔': [28.988707, 41.035888, '美洲区'],
    '斯德哥尔摩': [18.075772, 59.324364, '美洲区'],
    '帕洛阿尔托': [-94.635836, 43.12967, '美洲区'],
    '芝加哥': [-87.624401, 41.884894, '美洲区'],
    '达拉斯': [-96.797563, 32.775936, '美洲区'],
    '圣保罗': [-46.633884, -23.544424, '美洲区'],
    '约翰内斯堡': [27.930597, -26.204362, '美洲区'],
    '莫斯科': [37.623634, 55.755177, '泛欧区'],
    '首尔': [126.988892, 37.578204, '亚太区'],
    '内罗毕': [36.825141, -1.283767, '美洲区'],
    '米兰': [9.185958, 45.469664, '泛欧区'],
    '开罗': [31.2486, 30.056662, '泛欧区'],
    '富吉拉': [53.883463, 23.409485, '美洲区'],
    '曼谷': [100.539815, 13.743799, '亚太区'],
    '吉隆坡': [101.661559, 3.120219, '亚太区'],
    '暖武里': [100.5251, 13.872871, '亚太区'],
    '珀斯': [115.861767, -31.940456, '美洲区'],
    '唐格朗': [113.802319, -0.913421, '亚太区'],
    '雅加达': [106.844302, -6.176927, '亚太区'],
    '海参崴': [131.921184, 43.117923, '亚太区'],

    '阿姆斯特丹': [5.315987, 52.125024, '泛欧区'],
    '布拉格': [14.446424, 50.08941, '泛欧区'],
    '澳门': [113.546415, 22.191286, '亚太区'],
    '拉各斯': [3.371735, 6.520201, '美洲区'],
    '弗吉尼亚': [-78.277768, 35.321516, '美洲区'],
    '蒙巴萨': [37.650931, -0.747369, '美洲区'],
    '华盛顿': [-77.027097, 38.893489, '美洲区'],
    '东京': [139.785584, 35.711396, '亚太区'],
    '胡志明市': [139.785584, 35.711396, '亚太区'],
    '多伦多': [-79.371686, 43.668461, '美洲区'],


    '南宁': [108.479, 23.1152],
    '广州': [113.5107, 23.2196],
    '重庆': [107.7539, 30.1904],
    '芬兰': [24.909912, 60.169095],
    '美国': [-100.696295, 33.679979],
    '日本': [139.710164, 35.706962],
    '韩国': [126.979208, 37.53875],
    '瑞士': [7.445147, 46.956241],
    '东南亚': [117.53244, 5.300343],
    '澳大利亚': [135.193845, -25.304039],
    '德国': [13.402393, 52.518569],
    '英国': [-0.126608, 51.208425],
    '加拿大': [-102.646409, 59.994255],
    '上海': [121.4648, 31.2891],
    '东莞': [113.8953, 22.901],
    '东营': [118.7073, 37.5513],
    '中山': [113.4229, 22.478],
    '临汾': [111.4783, 36.1615],
    '临沂': [118.3118, 35.2936],
    '丹东': [124.541, 40.4242],
    '丽水': [119.5642, 28.1854],
    '乌鲁木齐': [87.9236, 43.5883],
    '佛山': [112.8955, 23.1097],
    '保定': [115.0488, 39.0948],
    '兰州': [103.5901, 36.3043],
    '包头': [110.3467, 41.4899],
    '北京': [116.4551, 40.2539],
    '北海': [109.314, 21.6211],
    '南京': [118.8062, 31.9208],
    '南宁': [108.479, 23.1152],
    '南昌': [116.0046, 28.6633],
    '南通': [121.1023, 32.1625],
    '厦门': [118.1689, 24.6478],
    '台州': [121.1353, 28.6688],
    '合肥': [117.29, 32.0581],
    '呼和浩特': [111.4124, 40.4901],
    '咸阳': [108.4131, 34.8706],
    '哈尔滨': [127.9688, 45.368],
    '唐山': [118.4766, 39.6826],
    '嘉兴': [120.9155, 30.6354],
    '大同': [113.7854, 39.8035],
    '大连': [122.2229, 39.4409],
    '天津': [117.4219, 39.4189],
    '太原': [112.3352, 37.9413],
    '威海': [121.9482, 37.1393],
    '宁波': [121.5967, 29.6466],
    '宝鸡': [107.1826, 34.3433],
    '宿迁': [118.5535, 33.7775],
    '常州': [119.4543, 31.5582],
    '广州': [113.5107, 23.2196],
    '廊坊': [116.521, 39.0509],
    '延安': [109.1052, 36.4252],
    '张家口': [115.1477, 40.8527],
    '徐州': [117.5208, 34.3268],
    '德州': [116.6858, 37.2107],
    '惠州': [114.6204, 23.1647],
    '成都': [103.9526, 30.7617],
    '扬州': [119.4653, 32.8162],
    '承德': [117.5757, 41.4075],
    '拉萨': [91.1865, 30.1465],
    '无锡': [120.3442, 31.5527],
    '日照': [119.2786, 35.5023],
    '昆明': [102.9199, 25.4663],
    '杭州': [119.5313, 29.8773],
    '枣庄': [117.323, 34.8926],
    '柳州': [109.3799, 24.9774],
    '株洲': [113.5327, 27.0319],
    '武汉': [114.3896, 30.6628],
    '汕头': [117.1692, 23.3405],
    '江门': [112.6318, 22.1484],
    '沈阳': [123.1238, 42.1216],
    '沧州': [116.8286, 38.2104],
    '河源': [114.917, 23.9722],
    '泉州': [118.3228, 25.1147],
    '泰安': [117.0264, 36.0516],
    '泰州': [120.0586, 32.5525],
    '济南': [117.1582, 36.8701],
    '济宁': [116.8286, 35.3375],
    '海口': [110.3893, 19.8516],
    '淄博': [118.0371, 36.6064],
    '淮安': [118.927, 33.4039],
    '深圳': [114.5435, 22.5439],
    '清远': [112.9175, 24.3292],
    '温州': [120.498, 27.8119],
    '渭南': [109.7864, 35.0299],
    '湖州': [119.8608, 30.7782],
    '湘潭': [112.5439, 27.7075],
    '滨州': [117.8174, 37.4963],
    '潍坊': [119.0918, 36.524],
    '烟台': [120.7397, 37.5128],
    '玉溪': [101.9312, 23.8898],
    '珠海': [113.7305, 22.1155],
    '盐城': [120.2234, 33.5577],
    '盘锦': [121.9482, 41.0449],
    '石家庄': [114.4995, 38.1006],
    '福州': [119.4543, 25.9222],
    '秦皇岛': [119.2126, 40.0232],
    '绍兴': [120.564, 29.7565],
    '聊城': [115.9167, 36.4032],
    '肇庆': [112.1265, 23.5822],
    '舟山': [122.2559, 30.2234],
    '苏州': [120.6519, 31.3989],
    '莱芜': [117.6526, 36.2714],
    '菏泽': [115.6201, 35.2057],
    '营口': [122.4316, 40.4297],
    '葫芦岛': [120.1575, 40.578],
    '衡水': [115.8838, 37.7161],
    '衢州': [118.6853, 28.8666],
    '西宁': [101.4038, 36.8207],
    '西安': [109.1162, 34.2004],
    '贵阳': [106.6992, 26.7682],
    '连云港': [119.1248, 34.552],
    '邢台': [114.8071, 37.2821],
    '邯郸': [114.4775, 36.535],
    '郑州': [113.4668, 34.6234],
    '鄂尔多斯': [108.9734, 39.2487],
    '重庆': [107.7539, 30.1904],
    '金华': [120.0037, 29.1028],
    '铜川': [109.0393, 35.1947],
    '银川': [106.3586, 38.1775],
    '镇江': [119.4763, 31.9702],
    '长春': [125.8154, 44.2584],
    '长沙': [113.0823, 28.2568],
    '长治': [112.8625, 36.4746],
    '阳泉': [113.4778, 38.0951],
    '青岛': [120.4651, 36.3373],
    '韶关': [113.7964, 24.7028]
};


