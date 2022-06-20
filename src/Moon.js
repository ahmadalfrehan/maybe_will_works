export default class Moon {
    constructor(moonmass, position, radius, color, matalness, routness) {
        this.position = position = {
            x: 0,
            y: 15000,
            dx: 0,
            dy: 0
        }
        this.moonmass = moonmass = {
            mass: 1200
        }
        this.radius = radius
        this.color = color,
            this.matalness = matalness,
            this.routness = routness
    }
}