$(function () {
    cutovereventgroupfunc()
})
function cutovereventgroupfunc() {
    var camera, scene, renderer, orbitControls, clock, delta;
    var data = { "result": { "data": [{ "vendorname": "JUNIPER", "num": 12 }, { "vendorname": "华为", "num": 19 }, { "vendorname": "思科", "num": 10 }] } }
    $(".cutovereventgroupparent").html('<div id="cutovereventgroup" style="width:100%;height:100%"></div>')
    var result = data.result.data
    function compare(property) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    }
    var result1 = result.sort(compare('num'))
    main(result1)
    control()
    render()
    //#  //8BD4FC
    $(".cutovereventgrouptitle").html(`
    设备厂商分布(个)
    <div>
        <p><span style="background:#3BDCF6" style="margin-left:20px;"></span>${result[0]['vendorname']}:${result[0]['num']}</p>
        <p><span style="background:#fd947e"></span>${result[1]['vendorname']}:${result[1]['num']}</p>
        <p><span style="background:#4A5BE7" style="margin-left:20px;"></span>${result[2]['vendorname']}:${result[2]['num']}</p>
    </div>`)
    function main(result) {
        scene = new THREE.Scene();
        var geometry = new THREE.CylinderGeometry(1, 100, 100, 3);
        var material = new THREE.MeshBasicMaterial({ color: '#3BDCF6' });//0x3BDCF6
        var cone = new THREE.Mesh(geometry, material);
        cone.position.set(0, 200, 0)
        scene.add(cone);
        //指标2
        var geometry1 = new THREE.CylinderGeometry(100, 200, 100, 3);
        var material1 = new THREE.MeshBasicMaterial({ color: '#fd947e', side: THREE.DoubleSide });
        var cylinder1 = new THREE.Mesh(geometry1, material1);
        cylinder1.position.set(0, 100, 0)
        scene.add(cylinder1);
        //指标3
        var geometry2 = new THREE.CylinderGeometry(200, 300, 100, 3);
        var material2 = new THREE.MeshBasicMaterial({ color: '#4A5BE7', side: THREE.DoubleSide });
        var cylinder2 = new THREE.Mesh(geometry2, material2);
        cylinder2.position.set(0, 0, 0)
        scene.add(cylinder2);


        var point = new THREE.PointLight(0xffffff);
        point.position.set(400, 200, 300); //点光源位置
        scene.add(point); //点光源添加到场景中
        //文字
        var textdata = [
            { "text": result[0]['vendorname'] + ':' + result[0]['num'], "num": result[0]['num'], 'pos': [25, 200, 25] },
            { "text": result[1]['vendorname'] + ':' + result[1]['num'], "num": result[1]['num'], 'pos': [75, 100, 75] },
            { "text": result[2]['vendorname'] + ':' + result[2]['num'], "num": result[2]['num'], 'pos': [125, 0, 125] }
        ]
        var loader = new THREE.FontLoader();
        loader.load('./js/three/MicrosoftYaHei_Regular.json', function (font) {
            for (var i = 0; i < textdata.length; i++) {
                var materialtext = new THREE.MeshBasicMaterial({
                    color: '#000',
                });
                var text = new THREE.Mesh(new THREE.TextGeometry(textdata[i]['text'], {
                    font: font, size: 10, height: 0.1,

                }), materialtext);
                text.position.set(textdata[i]['pos'][0], textdata[i]['pos'][1], textdata[i]['pos'][2])
                text.rotateY(1.07)
                text.rotateX(Math.PI / 360 * -45)
                scene.add(text);
            }
        });


        //环境光
        var ambient = new THREE.AmbientLight(0x444444);
        scene.add(ambient);
        var width = $("#cutovereventgroup").width()
        var height = $("#cutovereventgroup").height()
        var k = width / height; //窗口宽高比
        var s = 100; //三维场景显示范围控制系数，系数越大，显示的范围越大
        //创建相机对象
        camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 10000);
        camera.position.set(0, 40, 600);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(width, height);//设置渲染区域尺寸
        renderer.setClearColor(0x000000, 0); //设置背景颜色
        $("#cutovereventgroup").append(renderer.domElement)
        //执行渲染操作   指定场景、相机作为参数
        // renderer.render(scene, camera);
        // var axesHelper = new THREE.AxesHelper(500);
        // scene.add(axesHelper);

    }

    function control() {
        orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
        orbitControls.enableDamping = true;
        orbitControls.autoRotate = true;//将自动旋转关闭
        clock = new THREE.Clock();//用于更新轨道控制器
    }
    function render() {
        delta = clock.getDelta();
        orbitControls.update(delta);
        requestAnimationFrame(render);
        renderer.render(scene, camera)
    }
}