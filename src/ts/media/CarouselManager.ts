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


// Handles a carousel or slider, enabling cycling through items like images or cards.



export default class CarouselManager {
    private items: NodeListOf<HTMLElement>;
    private currentIndex: number = 0;

    constructor(carouselSelector: string) {
        this.items = document.querySelectorAll(`${carouselSelector} .carousel-item`);
    }

    next(): void {
        this.updateIndex(this.currentIndex + 1);
    }

    previous(): void {
        this.updateIndex(this.currentIndex - 1);
    }

    private updateIndex(newIndex: number): void {
        this.currentIndex = (newIndex + this.items.length) % this.items.length;
        this.items.forEach((item, index) => {
            item.style.display = index === this.currentIndex ? 'block' : 'none';
        });
    }
}

// Usage
const carouselManager = new CarouselManager('#myCarousel');
// carouselManager.next() or carouselManager.previous()
