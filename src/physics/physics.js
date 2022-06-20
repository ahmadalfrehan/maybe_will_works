export default class Physics {
    constructor(x, y) {
        this.x = x
        this.y = y
    }   
    distance(x, y, x1, y1) {
        const distance = Math.sqrt(Math.pow((x1 - x), 2) + Math.pow((y1 - y), 2))
        return distance
    }
    starting_velocity(x, y, x1, y1, G, earthmass) {
        let d = this.distance(x, y, x1, y1)
        let v0 = Math.sqrt((G * earthmass) / (d))
        let V0x = v0 * Math.cos((0))
        let V0y = v0 * Math.sin((0))
        return [v0, V0x, V0y];
    }
    V_Zero(x, y, x1, y1, G, earthmass) {
        let d = this.distance(x, y, x1, y1)
        let v0 = Math.sqrt((G * earthmass) / (d))
        return v0
    }
    gravity_force(x, y, x1, y1,earthmass,moonmass,G) {
        let r = this.distance(x, y, x1, y1)
        console.log("distance in force= " + r)
        let Fg = (1 * G * earthmass * moonmass) / (Math.pow(r, 2))
        let rx = x1 - x
        let Fx = -1 * Fg * (rx / r)
        let ry = y1 - y
        let Fy = -1 * Fg * (ry / r)
        return [Fg, Fx, Fy]
    }
    acceleration(Fg, Fx, Fy, moonmass) {
        let a = Fg / moonmass
        let ax = Fx / moonmass
        let ay = Fy / moonmass
        return [a, ax, ay]
    }
    velocity(v, vx, vy, a, ax, ay, dt) {
        console.log('this is the old v')
        let Vxnew = vx + (ax * dt)
        let Vynew = vy + (ay * dt)
        let vnew = Math.sqrt((Math.pow(Vxnew, 2)) + ((Math.pow(Vynew, 2))))
        return [vnew, Vxnew, Vynew]
    }
    //finding new position ahmad
    position(x, y, vx, vy, dt) {
        let xnew = x - (vx * dt)
        let ynew = y - (vy * dt)
        return [xnew, ynew]
    }
}