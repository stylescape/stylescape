/**
 * Handles vertical scrolling behavior using arrow buttons.
 * Scrolls to specific sections of the page and toggles button visibility.
 */
export class VerticalScrollManager {
    private readonly buttonUp: HTMLElement | null;
    private readonly buttonDown: HTMLElement | null;
    private readonly scrollThreshold = 100;
    private readonly scrollOffset = -100; // Used for down scroll to offset from top

    constructor() {
        this.buttonUp = document.getElementById("cover_arrow--up");
        this.buttonDown = document.getElementById("content_cover_arrow");

        if (this.buttonUp) {
            this.buttonUp.addEventListener(
                "click",
                this.scrollToContentTop.bind(this),
            );
            window.addEventListener(
                "scroll",
                this.updateUpButtonVisibility.bind(this),
            );
            this.updateUpButtonVisibility(); // Initial state
        }

        if (this.buttonDown) {
            this.buttonDown.addEventListener(
                "click",
                this.scrollToMainSection.bind(this),
            );
        }
    }

    /**
     * Scroll to the element with ID 'content_cover'
     */
    private scrollToContentTop(): void {
        const element = document.getElementById("content_cover");
        if (element) {
            const top =
                element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top, behavior: "smooth" });
        }
    }

    /**
     * Scroll to the element with ID 'main' with an offset
     */
    private scrollToMainSection(): void {
        const element = document.getElementById("main");
        if (element) {
            const top =
                element.getBoundingClientRect().top +
                window.pageYOffset +
                this.scrollOffset;
            window.scrollTo({ top, behavior: "smooth" });
        }
    }

    /**
     * Show or hide the up button based on scroll position
     */
    private updateUpButtonVisibility(): void {
        if (!this.buttonUp) return;
        this.buttonUp.style.display =
            window.scrollY > this.scrollThreshold ? "block" : "none";
    }
}

// Usage
new VerticalScrollManager();
