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
