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
    gravity_force(x, y, x1, y1, earthmass, moonmass, G) {
        let r = this.distance(x, y, x1, y1)
        let Fg = (-1 * G * earthmass.mass * moonmass.mass) / Math.pow(r, 2)
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
                theta = (theta) + (2 * Math.PI)
            }
            else
                theta = theta
        }
        Fx = Fg * Math.cos(theta)
        Fy = Fg * Math.sin(theta)
        return [Fg, Fx, Fy, theta]
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
        let xnew = x + (vx * dt)
        let ynew = y + (vy * dt)
        return [xnew, ynew]
    }
}