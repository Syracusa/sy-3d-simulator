
export class KeyFrame {
    constructor() {
        this.nodePositions = {};
        this.scenarioTime = 0;
    } 

    initKeyFrameFromScene(mainScene) {
        let scenario = mainScene.scenario;
        let droneList = mainScene.droneList;

        this.nodePositions = {};
        for (let i = 0; i < droneList.length; i++){
            let drone = droneList[i];
            this.nodePositions[drone.nodeName] = drone.position.clone();
        }

        this.scenarioTime = scenario.simTime;
    }
    
    static sortKeyFrame(a, b) {
        return a.scenarioTime - b.scenarioTime;
    }
}

export class Scenario {
    constructor(mainScene) {
        this.mainScene = mainScene;
        this.scenarioPlay = false;

        this.scenarioInfoPanel = document.getElementById("scenario-info");
        this.slider = document.getElementById("myRange");
        console.log(this.slider);
        this.slider.value = 0;
        this.simTime = 0;
        
        this.keyFrameList = [];
        this.addKeyFrame(this.mainScene);
        

        let that = this;
        /* Handle Slider Input */
        this.slider.oninput = function () {
            that.scenarioInfoPanel.innerText = "Simulation time : " + that.slider.value + "s";
        }

        /* Scenario Play */
        this.intervalID = setInterval(this.updateSimulationTime, 1000, that);
    }

    getKeyFrameIdx() {
        let i = 1;
        for (; i < this.keyFrameList.length; i++){
            let keyFrame = this.keyFrameList[i];
            if (keyFrame.scenarioTime > this.scenario.simTime){
                return i - 1;
            }
        }

        return -1;
    }

    calcNodePositions() {
        let kidx = this.getKeyFrameIdx();
        let keyFrame1 = this.keyFrameList[kidx];

        if (keyFrame1.simTime == this.scenario.simTime){

        } else {
            /* Calc Interpolated Positions */
            let keyFrame2 = this.keyFrameList[kidx + 1];

        }

    }

    updateNodePositions() {

    }

    updateSimulationTime(scenario) {
        if (!scenario.scenarioPlay)
            return;
        scenario.simTime = scenario.slider.value++;
        scenario.scenarioInfoPanel.innerText = "Simulation time : " + scenario.slider.value + "s";
        
        
        this.updateNodePositions();
        console.log('Simtime update!' + scenario.simTime);
    }
 
    addKeyFrame() {
        let keyFrame = new KeyFrame();
        this.keyFrameList.push(keyFrame.initKeyFrameFromScene(this.mainScene));
        this.keyFrameList.sort(KeyFrame.sortKeyFrame);
    }
}