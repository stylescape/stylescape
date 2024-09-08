
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




 