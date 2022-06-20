import * as dat from 'dat.gui';
export default class Gui {

    constructor(x, y) {
        this.x = x
        this.y = y
    }
    GuiForMoonMass() {
        var moonmass = {
            mass: 1200
        }
        const gui = new dat.GUI();
        gui.add(moonmass, 'mass', 1, 2000).name('mass for moon');
    }
}