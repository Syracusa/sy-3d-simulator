import { GUI } from 'dat.gui'

export class Controller {
    constructor(){
        this.keystate = {};
        
        window.onkeydown = (e) => {
            this.keystate[e.key] = 1;
        }
        window.onkeyup = (e) => {
            this.keystate[e.key] = 0;
        }

        this.gui = new GUI();
        
    }

    isKeyPressed(key){
        if (key in this.keystate){
            if (this.keystate[key] == 1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}