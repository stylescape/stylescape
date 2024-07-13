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


// ============================================================================
// Scroll
// ============================================================================

export default class VerticalScrollManager {
    private buttonUp: HTMLElement | null;
    private buttonDown: HTMLElement | null;

    constructor() {
        this.buttonUp = document.getElementById("cover_arrow_up");
        this.buttonDown = document.getElementById("content_cover_arrow");

        if (this.buttonUp) {
            this.buttonUp.addEventListener("click", this.handleScrollUp.bind(this));
            window.addEventListener("scroll", this.toggleButtonVisibility.bind(this));
        }

        if (this.buttonDown) {
            this.buttonDown.addEventListener("click", this.handleScrollDown.bind(this));
        }
    }

    private scrollSmooth(distance: number, speed: number): void {
        const interval = setInterval(() => {
            window.scrollTo(0, speed);
            speed += 10;
            if (speed >= distance) clearInterval(interval);
        }, 20);
    }

    private handleScrollUp(): void {
        const element = document.getElementById("content_cover");
        if (element) {
            const yDistance = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: yDistance, behavior: "smooth" });
        }
    }

    private handleScrollDown(): void {
        const element = document.getElementById("main");
        if (element) {
            const yOffset = -100;
            const yDistance = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: yDistance, behavior: "smooth" });
            // Alternatively, use scrollSmooth for a different scrolling effect
            // var speed = 10;
            // this.scrollSmooth(yDistance, speed);
        }
    }

    private toggleButtonVisibility(): void {
        if (this.buttonUp) {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                this.buttonUp.style.display = "block";
            } else {
                this.buttonUp.style.display = "none";
            }
        }
    }
}

// Usage
new VerticalScrollManager();




 