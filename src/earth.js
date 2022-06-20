export default class Earth {
    constructor(earthMass, position, radius, color, matalness, routness) {
        this.position = position = {
            x: 0,
            y: 15000,
            dx: 0,
            dy: 0
        }
        this.earthMass = earthMass = {
            mass: 1200
        }
        this.radius = radius
        this.color = color,
            this.matalness = matalness,
            this.routness = routness
    }
}