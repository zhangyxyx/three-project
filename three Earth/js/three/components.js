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

function FlyLine(from, to, colorf, colort, size) {
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