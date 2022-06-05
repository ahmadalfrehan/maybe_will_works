import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON from 'cannon'

/**
 * Debug
*/
const gui = new dat.GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/*physic */
const world=new CANNON.World()
world.gravity.set(0,0,0)

/*sphere cannon*/

const sphereshape= new CANNON.Sphere(0.5)
const spherebody= new CANNON.Body({
    mass:100,
    position:new CANNON.Vec3(0,3,0),
    shape: sphereshape
})

const spheremass={
    mass:25,
    radius:0.5

}
gui.add(spherebody,'mass',1,500).name('mass')
world.addBody(spherebody)

/*plane*/
const floorshape= new CANNON.Plane()
const floorbody= new CANNON.Body()
floorbody.mass=0
floorbody.addShape(floorshape)
floorbody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1,0,0),
    Math.PI*1/2
)
world.addBody(floorbody)
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Test sphere
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        //envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 20, 20),
    new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        //envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
moon.position.y = 0.5
scene.add(moon)
sphere.castShadow = true
const sphereData = {
    radius: 1,
    widthSegments: 8,
    heightSegments: 6,
    phiStart: 0,
    phiLength: Math.PI * 2,
    thetaStart: 0,
    thetaLength: Math.PI,
}
const sphereFolder = gui.addFolder('Sphere')
const spherePropertiesFolder = sphereFolder.addFolder('Properties')
spherePropertiesFolder
    .add(sphereData, 'radius', 0.1, 30,0.1)
    .onChange(regenerateSphereGeometry)
spherePropertiesFolder
    .add(sphereData, 'widthSegments', 1, 32)
    .onChange(regenerateSphereGeometry)
spherePropertiesFolder
    .add(sphereData, 'heightSegments', 1, 16)
    .onChange(regenerateSphereGeometry)
spherePropertiesFolder
    .add(sphereData, 'phiStart', 0, Math.PI * 2)
    .onChange(regenerateSphereGeometry)
spherePropertiesFolder
    .add(sphereData, 'phiLength', 0, Math.PI * 2)
    .onChange(regenerateSphereGeometry)
spherePropertiesFolder
    .add(sphereData, 'thetaStart', 0, Math.PI)
    .onChange(regenerateSphereGeometry)
spherePropertiesFolder
    .add(sphereData, 'thetaLength', 0, Math.PI)
    .onChange(regenerateSphereGeometry)

function regenerateSphereGeometry() {
    const newGeometry = new THREE.SphereGeometry(
        sphereData.radius,
        sphereData.widthSegments,
        sphereData.heightSegments,
        sphereData.phiStart,
        sphereData.phiLength,
        sphereData.thetaStart,
        sphereData.thetaLength
    )
  //  sphere.geometry.dispose()
    sphere.geometry = newGeometry
    
}
scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
       // envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)


const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldelaspsedtime=0
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltatime= elapsedTime-oldelaspsedtime
    oldelaspsedtime= elapsedTime
    world.step(1/60,deltatime,3)
    console.log(spherebody.mass)

    // Update controls
    controls.update()
  //  sphere.position.copy(spherebody.position)
  sphere.position.y= spherebody.position.y
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


/*import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import CANNON from 'cannon';
//import { Color, TextureLoader, HemisphereLight } from 'three';
//import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
// Debug
const gui = new dat.GUI();


// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
const world = new CANNON.World();
world.gravity.set(0, - 9.82, 0)

const concreatMaterial = new CANNON.Material('concrete')
const plasticMaterial = new CANNON.Material('plastic')

const concreatePlasticContactMaterial = new CANNON.ContactMaterial(
    concreatMaterial,
    plasticMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
)
world.addContactMaterial(concreatePlasticContactMaterial)
const sphereShape = new CANNON.Sphere(0.5)
const sphareBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 0, 0),
    shape: sphereShape,
    material:plasticMaterial
})
world.addBody(sphareBody)

const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.material = concreatMaterial
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI * 0.5
)
sphareBody.applyLocalForce(new CANNON.Vec3(150,0,0),new CANNON.Vec3(0,0,0))
world.addBody(floorBody)

const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 32, 32),
    material
)

sphere.position.x = -1.5

const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10, 10),
    material
)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.20
sphere.position.y = -0.65
scene.add(sphere, plane)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

//gui.add(ambientLight,'intensity').min(0).max(1).step(0.01)
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
scene.add(hemisphereLight)
const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2)
pointLight.position.set(1, -0.5, 1)
scene.add(pointLight)


const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 2)
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)


const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
//scene.add(hemisphereLightHelper)
/**
* Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/*
 * Camera
 
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = -4;
camera.position.y = 2;
camera.position.z = -4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 

const clock = new THREE.Clock();
let oldElapsetTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsetTime
    oldElapsetTime = elapsedTime

    world.step(1 / 60, deltaTime, 3)

    sphere.position.y = sphareBody.position.y
    sphere.position.x = sphareBody.position.x
    sphere.position.z = sphareBody.position.z

    sphareBody.applyForce(new CANNON.Vec3(0.5,0,0),sphareBody.position)

    // Update objects
    //text.rotation.y = 0.5 * elapsedTime;

    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime
    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(