/**
 * A class to reveal content on a webpage with a fade-in effect after a specified delay.
 * 
 * The `ContentRevealer` class is designed to hide elements initially and gradually reveal them
 * with a fade-in effect after a specified delay when the window loads.
 * 
 * @example
 * // Usage:
 * const revealer = new ContentRevealer(500, '.hidden-content');
 * 
 * This will apply a 500ms delay and fade-in effect to all elements with the class `.hidden-content`.
 */
export class ContentRevealer {
    // Duration of the fade-in effect in milliseconds.
    private delay: number;
    // CSS selector used to target the elements to be revealed.
    private selector: string;

    /**
     * Creates an instance of ContentRevealer.
     * 
     * @param delay - The delay in milliseconds before the content begins to reveal.
     * @param selector - The CSS selector for the elements to be revealed.
     */
    constructor(delay: number, selector: string) {
        this.delay = delay;
        this.selector = selector;
        // Bind the revealContent method to the window load event.
        window.onload = this.revealContent.bind(this);
    }

    /**
     * Reveals the content by fading in elements that match the provided selector.
     * 
     * This method selects all elements matching the given selector, sets their initial
     * opacity to 0, and then gradually changes the opacity to 1 after the specified delay.
     * 
     * @private
     */
    private revealContent(): void {
        // Select all elements that match the selector.
        const elements = document.querySelectorAll(this.selector);
        
        // Apply the fade-in effect to each element.
        elements.forEach((element) => {
            const el = element as HTMLElement;

            // Set the initial opacity to 0 and define the transition effect.
            el.style.opacity = '0';
            el.style.transition = `opacity ${this.delay}ms ease`;

            // Use a timeout to change the opacity to 1 after the specified delay.
            setTimeout(() => {
                el.style.opacity = '1';
            }, this.delay);
        });
    }
}