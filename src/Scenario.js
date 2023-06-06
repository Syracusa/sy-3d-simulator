
export class KeyFrame {
    constructor() {
        this.nodePositions = [];
        this.senarioTime = 0;
        
    }
}

export class Scenario {
    constructor() {
        this.scenarioPlay = false;

        this.scenarioInfoPanel = document.getElementById("scenario-info");
        this.slider = document.getElementById("myRange");
        console.log(this.slider);
        this.slider.value = 0;
        this.simTime = 0;
        
        let that = this;

        this.slider.oninput = function () {
            that.scenarioInfoPanel.innerText = "Simulation time : " + that.slider.value + "s";
        }

        this.intervalID = setInterval(this.updateSimulationTime, 1000, that);
    }

    updateSimulationTime(scenario) {
        if (!scenario.scenarioPlay)
            return;
        scenario.simTime = scenario.slider.value++;
        scenario.scenarioInfoPanel.innerText = "Simulation time : " + scenario.slider.value + "s";
        console.log('Simtime update!' + scenario.simTime);

    }
}