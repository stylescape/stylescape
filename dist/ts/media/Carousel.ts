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


// Carousel Class
// A carousel allows users to cycle through elements like images or cards, often used in galleries or as a slideshow.

class Carousel {
    private container: HTMLElement;
    private items: NodeListOf<HTMLElement>;
    private currentIndex: number = 0;

    constructor(containerId: string) {
        this.container = document.getElementById(containerId) as HTMLElement;
        this.items = this.container.querySelectorAll('.carousel-item');
        this.setupButtons();
    }

    private setupButtons() {
        document.getElementById('prevBtn')!.addEventListener('click', () => this.movePrev());
        document.getElementById('nextBtn')!.addEventListener('click', () => this.moveNext());
    }

    private movePrev() {
        if (this.currentIndex > 0) {
            this.items[this.currentIndex].classList.remove('active');
            this.currentIndex--;
            this.items[this.currentIndex].classList.add('active');
        }
    }

    private moveNext() {
        if (this.currentIndex < this.items.length - 1) {
            this.items[this.currentIndex].classList.remove('active');
            this.currentIndex++;
            this.items[this.currentIndex].classList.add('active');
        }
    }
}

// Example HTML: <div id="carouselContainer"><div class="carousel-item active">Item 1</div><div class="carousel-item">Item 2</div></div>
