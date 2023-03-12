import { GUI } from 'dat.gui'
import * as THREE from 'three'

export class Controller {
    that = this;
    
    constructor(){
        this.keystate = {};
        
        window.onkeydown = (e) => {
            this.keystate[e.key] = 1;
        }
        window.onkeyup = (e) => {
            this.keystate[e.key] = 0;
        }

        this.pointer = new THREE.Vector2(0, 0);
        console.log(this.pointer);
        console.log(this.pointer.x);
        document.addEventListener( 'pointermove', this.onPointerMove.bind(this) );

        this.gui = new GUI();
    }

     onPointerMove( event ) {
        this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.pointer.y = -1 * ( event.clientY / window.innerHeight ) * 2 + 1;
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