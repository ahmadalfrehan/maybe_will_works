import * as THREE from 'three';
import Moon from './Moon'
import Earth from './earth';
export default class Draw {
    constructor() { }
    moonPos(x, y) {
        let moonpos = {
            x: 0,
            y: 15000,
            dx: 0,
            dy: 0
        }
        return moonpos
    }
    moonMas() {
        return {
            mass: 1200
        }
    }
    drawMoon() {
        const scene = new THREE.Scene();
        var moonn = new Moon(this.moonMas.mass, this.moonPos, 2, '#777777', 0.3, 0.4)
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
        return [moon,moon.position.x,moon.position.x]
    }
    drawEarth(earthmass, earthRadius) {

        const scene = new THREE.Scene();
        var earthObj = new Earth(earthmass, 0, earthRadius, '#770077', 0.3, 0.4)
        const earth = new THREE.Mesh(
            new THREE.SphereGeometry(6371000/1000000, 32, 32),
            new THREE.MeshStandardMaterial({
                metalness: earthObj.metalness,
                roughness: earthObj.roughness,
                color: earthObj.color
            })
        );
        earth.castShadow = true;
        earth.position.set(0, 0, 0)
        const x1 = earth.position.x
        const y1 = earth.position.y
        scene.add(earth);
        return [earth, x1, y1]
    }
}
