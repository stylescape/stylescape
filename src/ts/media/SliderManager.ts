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

// Manages an image slider or carousel functionality, handling next and previous actions.




export default class SliderManager {
    private slides: NodeListOf<HTMLElement>;
    private currentIndex: number = 0;

    constructor(sliderSelector: string) {
        this.slides = document.querySelectorAll(`${sliderSelector} .slide`);
        this.showSlide(this.currentIndex);
    }

    private showSlide(index: number): void {
        this.slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
    }

    nextSlide(): void {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(this.currentIndex);
    }

    prevSlide(): void {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.showSlide(this.currentIndex);
    }
}

// Usage
const slider = new SliderManager('#mySlider');
// slider.nextSlide() or slider.prevSlide() to control
