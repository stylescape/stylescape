// Custom Slider Class
// Sliders are commonly used for selecting values or adjusting settings. A custom slider class can provide specific functionalities and styles beyond the basic HTML slider.

class CustomSlider {
    private slider: HTMLInputElement
    private valueDisplay: HTMLElement

    constructor(sliderId: string, displayId: string) {
        this.slider = document.getElementById(sliderId) as HTMLInputElement
        this.valueDisplay = document.getElementById(displayId) as HTMLElement
        this.slider.addEventListener('input', this.updateDisplay)
        this.updateDisplay()
    }

    private updateDisplay = () => {
        this.valueDisplay.textContent = this.slider.value
    }
}

new CustomSlider('mySlider', 'sliderValueDisplay')
