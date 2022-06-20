import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import CANNON from 'cannon';
import Moon from './Moon'
import Earth from './earth';
import Physics from './physics/physics';
import Gui from './gui';
import Draw from './Drawing';
const gui = new dat.GUI();
const world = new CANNON.World();
world.gravity.set(0, 0, 0);
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

//var moonn = new Moon(moonmass.mass, moonpos, 2, '#777777', 0.3, 0.4)
var gUi = new Gui()
//gUi.GuiForMoonMass()
//gui.add(moonmass, 'mass', 1, 2000).name('mass for moon');
//var draw = new Draw()
let moonpos = {
    x: 0,
    y: 15000,
    dx: 0,
    dy: 0
}
let moonmass = {
    mass: 1200
}
//const scene = new THREE.Scene();
var moonn = new Moon(moonmass.mass, moonpos, 2, '#777777', 0.3, 0.4)
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(2, 32, 32),
    new THREE.MeshStandardMaterial({
        metalness: moonn.roughness,
        roughness: moonn.roughness,
        color: moonn.color
    })
);
moon.castShadow = true;
moon.position.set(0, 0, 0)
scene.add(moon);
//var moon = draw.drawMoon()
//var moonmass = draw.moonMas()
//var moonpos = draw.moonPos()
let starting_heights = {
    h: 15000
}
let working = {
    work: false
}
let refreshing = {
    refresh: false
}

gui.add(starting_heights, 'h', -10000000, 10000000, 1000).listen().onChange(function (newValue) {
    starting_heights.h = newValue
});

moonpos.y = starting_heights.h
let xchange = gui.add(moonpos, 'x').min(-100000000).max(100000000).step(1000).listen()
xchange.onChange(function (newValue) {
    moonpos.x = newValue
})
let ychange = gui.add(moonpos, 'y').min(-100000000).max(100000000).step(1000).listen()
ychange.onChange(function (newValue) {
    moonpos.y = newValue
})
let start =
    gui.add(working, 'work')
        .name('start')
        .listen();
start.onChange(
    function (newValue) {
        working.work = newValue
    });

let refresh_page =
    gui.add(refreshing, 'refresh')
        .name('refresh page')
        .listen();
refresh_page.onChange(
    function (newValue) {
        refreshing.refresh = newValue
    });

const earthmass = {
    massnum: 5.976,
    digits: 24,
    mass: 0
}
var earthRadius = 6371000
gui.add(earthmass, 'digits', 1, 27).name('mass digits for earth').onChange(function (newValue) {
    earthmass.digits = newValue
});
gui.add(earthmass, 'massnum', 1, 10).name('mass for earth').onChange(function (newValue) {
    earthmass.massnum = newValue
})
earthmass.mass = earthmass.massnum * Math.pow(10, earthmass.digits)
var draw = new Draw()/*
let moonDraw = draw.drawMoon()
var moon = moonDraw[0]
moonpos.x = moonDraw[1]
moonpos.y = moonDraw[2]
scene.add(moon)*/

let some = draw.drawEarth()
var earth = some[0]
const x1 = some[1]
const y1 = some[2]
scene.add(earth)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
const aspect_ratio = sizes.width / sizes.height
const camera = new THREE.OrthographicCamera(-1 * aspect_ratio, 1 * aspect_ratio, 1, -1, -1000, 1000);
//const camera = new THREE.PerspectiveCamera(150, sizes.width / sizes.height, 0.1, 100);

camera.position.set(-3, 3, 15);
camera.zoom = 0.05
camera.updateProjectionMatrix()

scene.add(camera);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

var ph = new Physics()

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//covert to meters
moonpos.x *= 1000
moonpos.y *= 1000
const dt = 20
//getting starting velocity
const G = 6.67 * Math.pow(10, -11)
const s = ph.starting_velocity(moonpos.x, moonpos.y, x1, y1, G, earthmass.mass)
const V = {
    v0: s[0]
}
let VX = s[1]
let VY = s[2]
gui.add(V, 'v0', -5000000, 5000000).name('v0').listen().setValue(function (newValue) {
    V.v0 = newValue
})
function Points(x, y) {
    const vertices = [];
    for (let i = 0; i < 1; i++) {
        const z = THREE.MathUtils.randFloatSpread(2);
        vertices.push(x, y, 0);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ size: 2, color: 0x888888 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
}
var e = 0
var q = 0
let gui_bool = true
const tick = () => {
    earthmass.mass = earthmass.massnum * Math.pow(10, earthmass.digits)
    if (working.work === true) {
        if (refreshing.refresh === true) {
            window.location.reload(true);
            console.log('this is refresh ' + refreshing.refresh)
        }
        else {
            console.log('this is refresh ' + refreshing.refresh)
        }
        //gravity force results
        e = moon.x
        q = moon.y

        let gravity_force_all = ph.gravity_force(moonpos.x, moonpos.y, x1, y1, earthmass.mass, moonmass.mass, G)
        let Fg = gravity_force_all[0]
        let Fx = gravity_force_all[1]
        let Fy = gravity_force_all[2]
        //acceleration results
        let acceleration_all = ph.acceleration(Fg, Fx, Fy, moonmass.mass)
        let a = acceleration_all[0]
        let ax = acceleration_all[1]
        let ay = acceleration_all[2]
        let velocity_all = ph.velocity(V.v0, VX, VY, a, ax, ay, dt)
        V.v0 = velocity_all[0]
        let v = {
            v_now: V.v0
        }
        if (gui_bool) {
            gui.add(v, 'v_now', -1500000, 1500000, 1000).name('the current velocity').onChange(function (newValue) {
                v.v_now = newValue
            })
            gui_bool = false
        }
        console.log('this is new v : ' + V.v0)
        VX = velocity_all[1]
        VY = velocity_all[2]
        //changing position
        let position_all = ph.position(moonpos.x, moonpos.y, VX, VY, dt)
        moonpos.x = position_all[0]
        moonpos.y = position_all[1]
        //printing
        /*
        console.log('Fg=  ' + Fg)
        console.log('a=  ' + a)
        console.log('V=  ' + V.v0)
        console.log('Fx=  ' + Fx)
        console.log('ax=  ' + ax)
        console.log('Vx=  ' + VX)
        console.log('Fy=  ' + Fy)
        console.log('ay=  ' + ay)
        console.log('Vy=  ' + VY)
        console.log('X=  ' + moonpos.x)
        console.log('Y=  ' + moonpos.y)*/
        moon.position.x = (moonpos.x / 1000000)
        moon.position.y = (moonpos.y / 1000000)
        console.log('this is moon position x ' + moon.position.x + '  this is moon position y ' + moon.position.y)
        let r = Points(moon.position.x, moon.position.y)
        controls.update();
        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    } else {
        if (refreshing.refresh === true) {
            window.location.reload(true);
            console.log('this is refresh ' + refreshing.refresh)
        }
        else {
            console.log('this is refresh ' + refreshing.refresh)
        }
        controls.update();
        renderer.render(scene, camera);
        console.log('it is false')
        window.requestAnimationFrame(tick);
    }
};
tick();

import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import CANNON from 'cannon';
import { AnimationAction, log, SphereGeometry } from 'three';
const gui = new dat.GUI();
const world = new CANNON.World();
world.gravity.set(0, 0, 0);
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
var moonmass = {
    mass: 1200
}
gui.add(moonmass, 'mass', 1, 2000).name('mass for moon');
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 32, 32),
    new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        color: '#777777'
    })

);
let moonpos = {
    x: 0,
    y: 15000,
    dx: 0,
    dy: 0
}
const drawMoon = new THREE.Mesh(
    new THREE.SphereGeometry(2, 32, 32),
    new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        color: '#777777'
    })
);
let working = {
    work: false
}

let starting_height={
    h:900000
}
let raduis={
    r:6371000
}
let refreshing = {
    refresh: false
}

let refresh_page =
    gui.add(refreshing, 'refresh')
        .name('refresh page')
        .listen();
refresh_page.onChange(
    function (newValue) {
        refreshing.refresh = newValue
    });

moon.castShadow = true;
scene.add(moon);
drawMoon.position.set(0, 0, 0)
moon.position.set(0, 0, 0)

let first_height=gui.add(starting_height,'h',-1000000000,1000000000, 10000).name('height').listen().onChange(function(newValue){
    first_height.h=newValue
    moonpos.y= raduis.r + newValue


})

let planet_raduis=gui.add(raduis,'r',-10000000,10000000, 100).listen().onChange(function(newValue){
    planet_raduis.r=newValue
    moonpos.y= newValue + starting_height.h

})


let xchange = gui.add(moonpos, 'x').min(-100000000).max(100000000).step(10).listen()
xchange.onChange(function (newValue) {
    moonpos.x = newValue
})

let start =
    gui.add(working, 'work')
        .name('start')
        .listen();
start.onChange(
    function (newValue) {
        working.work = newValue
    });
let ychange = gui.add(moonpos, 'y').min(-100000000).max(100000000).step(10).listen()
ychange.onChange(function (newValue) {
    moonpos.y = newValue
})



let earthmass = {
    massnum: 5.976,
    digits:24,
    mass:0
}

gui.add(earthmass, 'digits', 1, 27 ).name('mass digits for earth').onChange(function (newValue) {
    earthmass.digits = newValue
});
gui.add(earthmass, 'massnum', 1, 10 ).name('mass for earth').onChange(function (newValue) {
    earthmass.massnum = newValue
})
earthmass.mass= earthmass.massnum * Math.pow(10, earthmass.digits)


const G = 6.67 * Math.pow(10, -11)
var earthRadius = 6371
const earth = new THREE.Mesh(
    new THREE.SphereGeometry(raduis.r/1000000, 32, 32),
    new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        color: '#770077'
    })
);
earth.castShadow = true;
earth.position.set(0, 0, 0)
const x1 = earth.position.x
const y1 = earth.position.y
scene.add(earth);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
const aspect_ratio = sizes.width / sizes.height
const camera = new THREE.OrthographicCamera(-1 * aspect_ratio, 1 * aspect_ratio, 1, -1, -1000, 1000);
//const camera = new THREE.PerspectiveCamera(150, sizes.width / sizes.height, 0.1, 100);

camera.position.set(-3, 3, 15);
camera.zoom = 0.05
camera.updateProjectionMatrix()

scene.add(camera);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
////////////////////////////////////////////////////////////////////////////////////////////

//DISTANCE
function distance(x, y) {
    const distance = Math.sqrt(Math.pow((x1 - x), 2) + Math.pow((y1 - y), 2))
    return distance
}


//launching velocity (V0)
function starting_velocity(x, y) {
    let d = distance(x, y)
    let v0 = Math.sqrt((G * earthmass.mass) / (d)) 
    let V0x = v0 * Math.cos((Math.PI))
    let V0y = v0 * Math.sin(Math.PI)
    return [v0, V0x, V0y];
}
function V_Zero(x, y) {
    let d = distance(x, y)
    let v0 = Math.sqrt((G * earthmass.mass) / (d))
    return v0
}


//finding Gravity Force Ahmad
function gravity_force(x, y) {
    let r = distance(x, y)
    let Fg = ( -1*G * earthmass.mass * moonmass.mass) / Math.pow(r, 2)
    var theta, Fx, Fy
    if (x == 0) { theta = Math.atan((y) / (1)) }
    else {
        theta = Math.atan((y) / (x))
        if (x < 0 && y > 0) {//theta= Math.atan((y)/(x))
            theta = (theta) + (Math.PI)
        }
        else if (x < 0 && y < 0) {
            theta = (theta) + (Math.PI)
        }
        else if (x > 0 && y < 0) {
            theta = (theta) + (2*Math.PI)
        }
        else
            theta = theta
    }
    
    //Fx
    Fx = Fg * Math.cos(theta)
    //Fy
    Fy = Fg * Math.sin(theta)
    return [Fg, Fx, Fy,theta]
}

//finding acceleration Ahmad
function acceleration(Fg, Fx, Fy) {

    let a = Fg / moonmass.mass
    let ax = Fx / moonmass.mass
    let ay = Fy / moonmass.mass

    return [a, ax, ay]
}

const dt = 20

//finding velocity Ahmad
function velocity(vx, vy, a, ax, ay) {
    console.log('this is the old v')
    let Vxnew = vx + (ax * dt)
    let Vynew = vy + (ay * dt)
    let vnew =Math.sqrt((Math.pow(Vxnew,2))+((Math.pow(Vynew,2))))

    return [vnew, Vxnew, Vynew]
}

//finding new position ahmad
function position(x, y, vx, vy) {
    let xnew = x + (vx * dt)
    let ynew = y + (vy * dt)

    return [xnew, ynew]

}

/***********************************************************************************************/

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$//
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();
let oldelaspsedtime = 0;
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$//

//covert to meters
moonpos.x *= 1000
moonpos.y *= 1000

//getting starting velocity
let current_theta=Math.PI
const s = starting_velocity(moonpos.x, moonpos.y)
let V = {
    v0: s[0]
}
let VX = s[1]
let VY = s[2]

let var_V = {
    v:V.v0
}

let orientation={
    against_clock:true
}
let change_orientation= gui.add(orientation,'against_clock').listen().onChange(function(newValue){
    if (orientation.against_clock==true){
        VX= var_V.v*Math.cos(current_theta )
        VY= var_V.v*Math.sin(current_theta)
    }
    else{
        VX= var_V.v*Math.cos(current_theta- Math.PI )
        VY= var_V.v*Math.sin(current_theta - Math.PI)
    }
})
let vchange=gui.add(var_V, 'v').min(-50000).max(50000).step(10).name('v').listen()
vchange.onChange(function (newValue) {
   let temp=var_V.v
   var_V.v=newValue
   VX= var_V.v*Math.cos(current_theta )
   VY= var_V.v*Math.sin(current_theta)
   console.log('VYYYYYYYYYYYYYYYYY=  ' + (current_theta+(Math.PI/2))*180/Math.PI)
   console.log('Vxxxxxxxxxxxxxxxx=  ' + VX)
   console.log('VYYYYY=  ' + VY)
  /*
   moonpos.x = moonpos.x - (var_V.v-temp)*dt
   moonpos.y =  moonpos.y -(var_V.v-temp)*dt
   */
   console.log('Xxxxxxxxxxxxxxxxx=  ' + moonpos.x)
   console.log('YYYYYYY=  ' + moonpos.y) 
})


function Points(x, y) {
    const vertices = [];
    for (let i = 0; i < 1; i++) {
     
        const z = THREE.MathUtils.randFloatSpread(2);
        vertices.push(x, y, 0);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ size: 2, color: 0x888888 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
}

const tick = () => {
   
    if (working.work === true) {

        if (refreshing.refresh===true){
            window.location.reload(true);
            console.log('this is refresh ' + refreshing.refresh)
        }
        else{
            console.log('this is refresh ' + refreshing.refresh)
        }
        console.log("current X= " + moonpos.x)
        console.log("current Y= " + moonpos.y)
       
        //gravity force results
        let gravity_force_all = gravity_force(moonpos.x, moonpos.y)
        let Fg = gravity_force_all[0]
        let Fx = gravity_force_all[1]
        let Fy = gravity_force_all[2]
        current_theta=gravity_force_all[3]
        //acceleration results
        let acceleration_all = acceleration(Fg, Fx, Fy)
        let a = acceleration_all[0]
        let ax = acceleration_all[1]
        let ay = acceleration_all[2]

        //first velocity after starting velocity
        let velocity_all = velocity(VX, VY, a, ax, ay)
        var_V.v = velocity_all[0]
        console.log('this is new v : ' + var_V.v)
        VX = velocity_all[1]
        VY = velocity_all[2]

        //changing position

        let position_all = position(moonpos.x, moonpos.y, VX, VY)
        moonpos.x = position_all[0]
        moonpos.y = position_all[1]

        console.log('current_theta=  ' + current_theta*180/Math.PI)
        /*
        //printing
        console.log('Fg=  ' + Fg)
        console.log('a=  ' + a)
        console.log('V=  ' + V.v0)
       
        console.log('Fx=  ' + Fx)
        console.log('ax=  ' + ax)
        console.log('Vx=  ' + VX)

        console.log('Fy=  ' + Fy)
        console.log('ay=  ' + ay)
        console.log('Vy=  ' + VY)

        console.log('X=  ' + moonpos.x)
        console.log('Y=  ' + moonpos.y)
*/
        moon.position.x = (moonpos.x / 2000000)
        moon.position.y = (moonpos.y / 2000000)

        console.log('this is moon position x ' + moon.position.x + '  this is moon position y ' + moon.position.y)
      
        let r = Points(moon.position.x, moon.position.y)
        controls.update();
        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    } 
    else {

        if (refreshing.refresh===true){
            window.location.reload(true);
            console.log('this is refresh ' + refreshing.refresh)
        }
        else{
            console.log('this is refresh ' + refreshing.refresh)
        }

        controls.update();
        renderer.render(scene, camera);
        console.log('it is false')
   
        window.requestAnimationFrame(tick);

    }
};
tick();