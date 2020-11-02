$(function () {

    starfunc()
    earth3D()
    earthfunc()

})

//星光
function starfunc() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    //renderer.setSize($(".container").width(), $(".container").height());
    renderer.setSize($('html').width(), $('html').height());
    renderer.setClearColor(0x020512, 1);
    $("#star").append(renderer.domElement)
    //添加光源 
    var point = new THREE.PointLight(0xffffff);
    point.position.set(0, 0, 100);//点光源位置
    scene.add(point);

    camera.position.z = 5;

    //绘制若干个点 
    var starsGeometry = new THREE.Geometry();
    for (var i = 0; i < 10000; i++) {

        var star = new THREE.Vector3();//创建点并在下面设置点的位置
        star.x = THREE.Math.randFloatSpread(2500);
        star.y = THREE.Math.randFloatSpread(2000);
        star.z = THREE.Math.randFloatSpread(2500);

        starsGeometry.vertices.push(star)
    }

    var starsMaterial = new THREE.PointsMaterial({ color: 0x888888 })
    var starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    var T0 = new Date();//上次时间
    function render() {
        var T1 = new Date();//本次时间
        var t = T1 - T0;//时间差
        T0 = T1;//把本次时间赋值给上次时间
        requestAnimationFrame(render);
        renderer.render(scene, camera);//执行渲染操作
        camera.rotateY(-0.0001 * t);//让相机转动以此来实现整个场景的旋转
        camera.rotateX(0.00005 * t);
        camera.rotateZ(0.00005 * t);
    }
    render();

}
//地图
function earthfunc() {
    var provinceArr = []
    var lineArr = []
    const projection = d3.geoMercator().center([16.585075, 40.223783]).scale(80).translate([0, 0]);
    var timer, timer1;
    // 渲染器
    var renderer = null;
    // 相机
    var camera = null;
    // 场景
    var scene = null;
    // 包裹画布dom
    var dom = document.getElementById("map");
    // 地图正面颜色
    var faceColor = '#212179';
    // 标记点集合对象
    var marking = null;
    // 标记位置对象
    var markingPos = null;
    // 地图侧边颜色
    var sideColor = '#04c5c5';
    //城市变颜色
    var sideColor2 = '#01f5f6'
    // orbitcontrols对象参数
    var orbitcontrols = null;
    // three中shapeGeometry对象数组
    var shapeGeometryObj = {};
    // 世界经纬度对象
    var worldGeometry = {};
    // 迁徙路径分段数
    var metapNum = 150;
    // 迁徙路径标记分段数
    var markingNum = 50;
    // 轨迹线条颜色
    var metapLineColor = '#01f5f6';
    // 球上标记点大小
    var dotWidth = 1;
    // 球上标记点颜色
    var dotColor = '#1bb4b0';
    // 轨迹上运动的球大小
    var slideBallSize = 1;
    // 轨迹上运动的球颜色
    var slideBallColor = '#01f5f6';
    var earthBallSize = 1920
    // 计算球体两点向量固定长度的点
    var getLenVcetor = function (v1, v2, len) {
        var v1v2Len = v1.distanceTo(v2);
        return v1.lerp(v2, len / v1v2Len);
    }
    // 计算球体上两个点的中点
    var getVCenter = function (v1, v2) {
        var v = v1.add(v2);
        return v.divideScalar(2);
    }
    window.FlyLine = function (from, to, colorf, colort, size) {
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
                color = vec4(0.213,0.424,0.634,0.3);
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
            new THREE.Vector3((to.x + from.x) / 2, (to.y + from.y) / 2, Math.abs(Math.sqrt(Math.pow((to.x - from.x), 2) + Math.pow((to.y - from.y), 2))) * .8),
            new THREE.Vector3(to.x, to.y, to.z)
        );

        const lineLen = parseInt(curve.getLength());
        let points = curve.getPoints(lineLen * 50);
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
            opacity: 0.6,
            side: THREE.DoubleSide
        });

        let mesh = new THREE.Points(geometry, material);
        mesh.maxx = to.x;
        mesh.minx = from.x;

        return mesh;
    };
    window.BreathPulse = function (opacity, radius, color) {
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
            float s = sin(pow(r+1., 2.)-time*3.+sin(r*.8))*sin(r+.99);
            vec3 col = color;
            col *= (abs(1./(s*60.8))-.01);
            gl_FragColor = vec4(col, 1.);
            
            float ratio = 0.25;
            if (dir < ratio) {
                gl_FragColor.a = opacity;
            } else {
                gl_FragColor.a = mix(opacity, 0., (dir - ratio) / (0.5 - ratio));
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
            depthTest: true,
            side: THREE.DoubleSide
        });

        let mesh = new THREE.Mesh(geometry, material);

        return mesh;
    };
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
    // ExturdeGeometry配置参数
    var options = {
        depth: 1, // 定义图形拉伸的深度，默认100
        steps: 0, // 拉伸面方向分为多少级，默认为1
        bevelEnabled: true, // 表示是否有斜角，默认为true
        bevelThickness: 1, // 斜角的深度，默认为6
        bevelSize: 0, // 表示斜角的高度，高度会叠加到正常高度
        bebelSegments: 0, // 斜角的分段数，分段数越高越平滑，默认为1
        curveSegments: 0 // 拉伸体沿深度方向分为多少段，默认为1
    }

    function lglt2xyz(longitude, latitude, radius) {
        var lg = longitude, lt = latitude;
        var y = radius * Math.sin(lt);
        var temp = radius * Math.cos(lt);
        var x = temp * Math.sin(lg);
        var z = temp * Math.cos(lg);
        return { x: x, y: y, z: z }
    }
    var colorarr = ['#1c337D', '#122254', '#172C67', '#1c337D', '#EE0000']
    // 将shape转换为ExtrudeGeometry
    var transition3d = function (polygon, identify, mark, ItemIndexmark) {
        const shape = new THREE.Shape();
        const lineMaterial = new THREE.LineBasicMaterial({ color: '#1783EC' });
        const lineGeometry = new THREE.Geometry();
        for (let i = 0; i < polygon.length; i++) {
            const [x, y] = projection(polygon[i]);
            if (i === 0) {
                shape.moveTo(x, -y);
            }
            shape.lineTo(x, -y);
            lineGeometry.vertices.push(new THREE.Vector3(x, -y, 2));
        }
        if ((ItemIndexmark) % 4) {
            faceColor = colorarr[(ItemIndexmark) % 4]
        }
        const geometry = new THREE.ExtrudeGeometry(shape, options)
        const material = new THREE.MeshBasicMaterial({ color: faceColor })
        const material1 = new THREE.MeshBasicMaterial({ color: sideColor })
        geometry.name = mark['name']
        const mesh = new THREE.Mesh(geometry, [material, material1])
        const line = new THREE.Line(lineGeometry, lineMaterial)
        mesh.name = "mapbox"
        scene.add(mesh)
        scene.add(line)

    }
    // 计算绘制地图参数函数
    var drawShapeOptionFun = function () {
        // 绘制世界地图

        worldGeometry.features.forEach(function (worldItem, worldItemIndex) {
            var length = worldItem.geometry.coordinates.length;
            var multipleBool = length > 1 ? true : false;
            worldItem.geometry.coordinates.forEach(function (worldChildItem, worldChildItemIndex) {

                if (multipleBool) {
                    // 值界可以使用的经纬度信息
                    if (worldChildItem.length && worldChildItem[0].length == 2) {
                        transition3d(worldChildItem, '' + worldItemIndex + worldChildItemIndex, worldGeometry.features[worldItemIndex]['properties'], worldItemIndex);
                    }
                    // 需要转换才可以使用的经纬度信息
                    if (worldChildItem.length && worldChildItem[0].length > 2) {
                        worldChildItem.forEach(function (countryItem, countryItenIndex) {
                            transition3d(countryItem, '' + worldItemIndex + worldChildItemIndex + countryItenIndex, worldGeometry.features[worldItemIndex]['properties'], worldItemIndex);
                        })
                    }
                } else {
                    var countryPos = null;
                    if (worldChildItem.length > 1) {
                        countryPos = worldChildItem;
                    } else {
                        countryPos = worldChildItem[0];
                    }
                    if (countryPos) {
                        transition3d((countryPos), '' + worldItemIndex + worldChildItemIndex, worldGeometry.features[worldItemIndex]['properties'], worldItemIndex);
                    }
                }
            })
        })
    }
    // 执行函数
    var render = function () {
        scene.rotation.x = -0.8;
        provinceArr.forEach(item => {
            item.material.uniforms['time'].value += .025;
        });
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
        orbitcontrols.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    // 初始化函数
    var initThree = function () {
        // 初始化场景
        scene = new THREE.Scene();
        // 初始化相机
        camera = new THREE.PerspectiveCamera(30, dom.clientWidth / dom.clientHeight, 1, 100000);
        // 设置相机位置
        camera.position.set(0, 50, 500);
        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        // 设置窗口尺寸
        renderer.setSize(dom.clientWidth, dom.clientHeight);
        // 初始化控制器
        orbitcontrols = new THREE.OrbitControls(camera, renderer.domElement);
        dom.appendChild(renderer.domElement);
        // 绘制地图
        drawShapeOptionFun();
        // 渲染
        render();

        // var axesHelper = new THREE.AxesHelper(50);
        // scene.add(axesHelper);

    }
    // 添加轨迹函数
    var addLine = function (v0, v3) {
        var angle = (v0.angleTo(v3) * 180) / Math.PI;

        var aLen = angle * 0.5 * (1 - angle / (Math.PI * 330));
        var hLen = angle * angle * 1.2 * (1 - angle / (Math.PI * 330));

        var p0 = new THREE.Vector3(0, 0, 0);
        // 法线向量
        var rayLine = new THREE.Ray(p0, getVCenter(v0.clone(), v3.clone()));
        // 顶点坐标
        var vtop = rayLine.at(hLen / rayLine.at(1).distanceTo(p0));
        // 控制点坐标
        var v1 = getLenVcetor(v0.clone(), vtop, aLen);
        var v2 = getLenVcetor(v3.clone(), vtop, aLen);
        // 绘制贝塞尔曲线
        var curve = new THREE.CubicBezierCurve3(v0, v1, v2, v3);
        var geometry = new THREE.Geometry();
        geometry.vertices = curve.getPoints(100);
        var line = new MeshLine();
        line.setGeometry(geometry);
        var material = new MeshLineMaterial({
            color: '#01f5f6',//metapLineColor,
            lineWidth: 1,
            transparent: true,
            opacity: 1
        })
        return {
            curve: curve,
            lineMesh: new THREE.Mesh(line.geometry, material)
        }
    }
    // 获取标记地点信息
    var getMarkingPos = function () {
        markingPos = earth3d;
    }
    function linepoints() {
        // 标记点组合
        marking = new THREE.Group();
        // 将标记点添加到地球上
        markingPos.marking.forEach(function (markingItem) {
            // 创建标记点球体
            // var geometry = new THREE.SphereGeometry(dotWidth, 30, 30)
            // var ball = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
            //     color: '#FFFF00',
            //     transparent: true,
            // }));
            var color = '#FFFF00'
            // 获取标记点坐标
            var ballPos = projection(markingItem.pos) //getPosition(markingItem.pos[0], markingItem.pos[1], earthBallSize);
            //ball.position.set(ballPos[0] - 2, -ballPos[1], 3);


            let breathBreathPulse = BreathPulse(1, 10, color);
            breathBreathPulse.position.set(ballPos[0], ballPos[1] - 20, 2.02);
            breathBreathPulse.name = markingItem['textValue']
            provinceArr.push(breathBreathPulse)
            marking.add(breathBreathPulse);

        })
        marking.name = 'ballarr'
        scene.add(marking);

        var animateDots = [];
        // 线条对象集合
        var groupLines = new THREE.Group();
        // 线条
        var mapling = [{
            'end': "法国首都-巴黎",
            'endcode': "法国首都-巴黎",
            'linedesc': "",
            'start': "中国首都-北京",
            'startcode': "中国首都-北京",
        }]
        mapling.forEach(function (item1) {
            // var line = addLine(marking.children[0].position, item.position);
            // groupLines.add(line.lineMesh);
            // animateDots.push(line.curve.getPoints(metapNum));
            var startitem = item1['start']; var enditem = item1['end']
            var startpos = ''; var endpos = '';
            marking.children.forEach(function (item) {
                if (item['name'] === startitem) {
                    startpos = item
                }
                if (item['name'] === enditem) {
                    endpos = item
                }
            })

            // var line = addLine(startpos.position, endpos.position, index);
            // line.lineMesh.name = 'line'
            // line.lineMesh.linedesc = item1['linedesc']
            // line.lineMesh.startendname = startitem + '_' + enditem
            // line.lineMesh.startendcode = item1['startcode'] + '_' + item1['endcode']
            // groupLines.add(line.lineMesh);
            // animateDots.push(line.curve.getPoints(metapNum));
            var alarmcolor = '0,1,0,1'
            // if (parseInt(item1['linestat']['main']) === '0') {
            //     alarmcolor = '0,1,0,1'
            // } else {
            //     alarmcolor = '1,0,0,1'
            // }
            let flyLine;
            flyLine = FlyLine(startpos.position, endpos.position, 0xffffff, 0xffffff, 10, alarmcolor);//0x33C631, 0x33C631
            console.log(flyLine)
            flyLine.name = 'line'
            flyLine.linedesc = item1['linedesc']
            lineArr.push(flyLine);
            groupLines.add(flyLine);
        })
        scene.add(groupLines);
        // 线上滑动的小球
        var aGroup = new THREE.Group();
        for (var i = 0; i < animateDots.length; i++) {
            for (var j = 0; j < markingNum; j++) {
                var aGeo = new THREE.SphereGeometry(slideBallSize, 10, 10);
                var aMaterial = new THREE.MeshBasicMaterial({
                    color: slideBallColor,
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


    }
    // 获取世界经纬度信息函数
    var getWorldGeometry = function () {
        $.ajax({
            type: "GET", //提交方式 
            url: "./js/data/world1.json",
            async: false,
            success: function (response) {//返回数据根据结果进行相应的处理 
                worldGeometry = response;
            }
        })
    }
    // 操作事件
    $('.code-operate').click(function () {
        $('.code-frame').toggleClass('on')
        if ($('.code-frame').hasClass('on')) {
            $('.code-operate').text('>')
        } else {
            $('.code-operate').text('<')
        }
    })
    // 页面资源加载完全执行函数
    getWorldGeometry();
    initThree();
    getMarkingPos()
    linepoints()


    // 窗口resize事件
    window.onresize = function () {
        // 重新初始化尺寸
        camera.aspect = dom.clientWidth / dom.clientHeight
        camera.updateProjectionMatrix();
        renderer.setSize(dom.clientWidth, dom.clientHeight)
    }

}
//3D地球
function earth3D() {
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
    // 地球大小
    var earthBallSize = 30;
    // 地球贴图
    var earthImg = '././css/img/earth3d4.png';
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
    // 获取标记地点信息
    var getMarkingPos = function () {
        markingPos = earth3d;
    }

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
    var addLine = function (v0, v3) {
        var angle = (v0.angleTo(v3) * 180) / Math.PI;
        var aLen = angle * 0.5 * (1 - angle / (Math.PI * 60));
        var hLen = angle * angle * 1.2 * (1 - angle / (Math.PI * 50));
        var p0 = new THREE.Vector3(0, 0, 0);
        // 法线向量
        var rayLine = new THREE.Ray(p0, getVCenter(v0.clone(), v3.clone()));
        // 顶点坐标
        var vtop = rayLine.at(hLen / rayLine.at(1).distanceTo(p0));
        // 控制点坐标
        var v1 = getLenVcetor(v0.clone(), vtop, aLen);
        var v2 = getLenVcetor(v3.clone(), vtop, aLen);
        // 绘制贝塞尔曲线
        var curve = new THREE.CubicBezierCurve3(v0, v1, v2, v3);
        var geometry = new THREE.Geometry();
        geometry.vertices = curve.getPoints(100);
        var line = new MeshLine();
        line.setGeometry(geometry);
        var material = new MeshLineMaterial({
            color: metapLineColor,
            lineWidth: 1,
            transparent: true,
            opacity: 1
        })
        return {
            curve: curve,
            lineMesh: new THREE.Mesh(line.geometry, material)
        }
    }
    // 执行函数
    var render = function () {
        scene.rotation.y -= 0.01;
        renderer.render(scene, camera);
        orbitcontrols.update();
        requestAnimationFrame(render);
    }
    // 初始化函数
    var initThree = function () {
        // 初始化场景
        scene = new THREE.Scene();
        // 初始化相机
        camera = new THREE.PerspectiveCamera(20, dom.clientWidth / dom.clientHeight, 1, 100000);
        // 设置相机位置
        camera.position.set(0, 0, 200);
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
        scene.add(new THREE.HemisphereLight('#ffffff', '#ffffff', 1));
        // 定义地球材质
        var earthTexture = THREE.ImageUtils.loadTexture(earthImg, {}, function () {
            renderer.render(scene, camera);
        });
        // 创建地球
        earthBall = new THREE.Mesh(new THREE.SphereGeometry(earthBallSize, 50, 50), new THREE.MeshBasicMaterial({
            map: earthTexture
        }));
        scene.add(earthBall);
        // 标记点组合
        marking = new THREE.Group();
        // 将标记点添加到地球上
        markingPos.marking.forEach(function (markingItem) {
            // 创建标记点球体
            var ball = new THREE.Mesh(new THREE.SphereGeometry(dotWidth, 30, 30), new THREE.MeshBasicMaterial({
                color: dotColor
            }));
            // 获取标记点坐标
            var ballPos = getPosition(markingItem.pos[0] + 90, markingItem.pos[1], earthBallSize);
            ball.position.set(ballPos.x, ballPos.y, ballPos.z);
            marking.add(ball);
        })
        scene.add(marking);
        var animateDots = [];
        // 线条对象集合
        var groupLines = new THREE.Group();
        // 线条
        marking.children.forEach(function (item) {
            var flyLine = FlyLine(marking.children[0].position, item.position, 0x009900, 0x009900, 10);
            groupLines.add(flyLine);
            //var line = addLine(marking.children[0].position, item.position);
            //groupLines.add(line.lineMesh);
            //animateDots.push(line.curve.getPoints(metapNum));
        })
        scene.add(groupLines);
        // 线上滑动的小球
        var aGroup = new THREE.Group();
        for (var i = 0; i < animateDots.length; i++) {
            for (var j = 0; j < markingNum; j++) {
                var aGeo = new THREE.SphereGeometry(slideBallSize, 10, 10);
                var aMaterial = new THREE.MeshBasicMaterial({
                    color: slideBallColor,
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
    }
    // 页面资源加载完全执行函数
    window.onload = function () {
        getMarkingPos();
        initThree();
    }
}


