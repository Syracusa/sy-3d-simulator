
export class Scenario {
    constructor() {
        this.scenarioPlay = false;

        this.scenarioInfoPanel = document.getElementById("scenario-info");
        this.slider = document.getElementById("myRange");
        console.log(this.slider);
        this.slider.value = 0;
        
        let that = this;

        this.slider.oninput = function () {
            that.scenarioInfoPanel.innerText = "Simulation time : " + that.slider.value + "s";
        }
    }
}