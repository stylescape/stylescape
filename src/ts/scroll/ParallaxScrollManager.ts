export class ParallaxScrollManager {
    private elements: HTMLElement[]
    private ticking = false

    constructor(parallaxSelector: string) {
        this.elements = Array.from(
            document.querySelectorAll<HTMLElement>(parallaxSelector),
        )
        this.onScroll = this.onScroll.bind(this)
        window.addEventListener("scroll", this.onScroll)
    }

    private onScroll(): void {
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this.applyParallax()
                this.ticking = false
            })
            this.ticking = true
        }
    }

    private applyParallax(): void {
        const scrollY = window.scrollY

        this.elements.forEach((element) => {
            const speedAttr = element.getAttribute("data-speed")
            const speed = speedAttr ? parseFloat(speedAttr) : 0.5
            if (!isNaN(speed)) {
                const yPos = -(scrollY * speed)
                element.style.backgroundPosition = `center ${yPos}px`
            }
        })
    }

    public destroy(): void {
        window.removeEventListener("scroll", this.onScroll)
    }
}

// Usage
// new ParallaxScrollManager('.parallax')

// How to Use in HTML
// <div class="parallax" data-speed="0.3" style="background-image: url('your-bg.jpg');">
//   <!-- Content -->
// </div>
