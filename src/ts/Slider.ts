// Copyright 2024 Scape Agency BV

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Custom Slider Class
// Sliders are commonly used for selecting values or adjusting settings. A custom slider class can provide specific functionalities and styles beyond the basic HTML slider.


class CustomSlider {
    private slider: HTMLInputElement;
    private valueDisplay: HTMLElement;

    constructor(sliderId: string, displayId: string) {
        this.slider = document.getElementById(sliderId) as HTMLInputElement;
        this.valueDisplay = document.getElementById(displayId) as HTMLElement;
        this.slider.addEventListener('input', this.updateDisplay);
        this.updateDisplay();
    }

    private updateDisplay = () => {
        this.valueDisplay.textContent = this.slider.value;
    };
}

new CustomSlider('mySlider', 'sliderValueDisplay');
