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


// Implements parallax scrolling effects for background images or elements.

export default class ParallaxScrollManager {
    private elements: NodeListOf<HTMLElement>;

    constructor(parallaxSelector: string) {
        this.elements = document.querySelectorAll(parallaxSelector);
        window.addEventListener('scroll', this.applyParallax.bind(this));
    }

    private applyParallax(): void {
        this.elements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-speed')!);
            const yPos = -(window.scrollY * speed);
            element.style.backgroundPosition = `center ${yPos}px`;
        });
    }
}

// Usage
const parallaxScrollManager = new ParallaxScrollManager('.parallax');
