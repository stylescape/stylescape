// ============================================================================
// Stylescape | Parallax Scroll Manager
// ============================================================================
// Creates parallax scrolling effects for background images and elements.
// Supports data-ss-parallax and data-speed attributes for configuration.
// ============================================================================

/**
 * Configuration options for ParallaxScrollManager
 */
export interface ParallaxScrollOptions {
    /** CSS selector for parallax elements */
    selector?: string
    /** Default parallax speed (0-1, lower = slower) */
    defaultSpeed?: number
    /** Use transform instead of background-position */
    useTransform?: boolean
    /** Enable smooth scrolling behavior */
    smooth?: boolean
}

/**
 * Parallax scrolling effect manager for background images.
 * Uses requestAnimationFrame for smooth, performant animations.
 *
 * @example JavaScript
 * ```typescript
 * const parallax = new ParallaxScrollManager(".parallax")
 *
 * // Cleanup when done
 * parallax.destroy()
 * ```
 *
 * @example HTML with data-speed
 * ```html
 * <div class="parallax"
 *      data-speed="0.3"
 *      style="background-image: url('hero-bg.jpg');">
 *     <h1>Welcome</h1>
 * </div>
 *
 * <!-- Slower parallax -->
 * <div class="parallax"
 *      data-speed="0.1"
 *      style="background-image: url('section-bg.jpg');">
 *     <section>...</section>
 * </div>
 * ```
 */
export class ParallaxScrollManager {
    /** Array of parallax elements */
    private elements: HTMLElement[]

    /** RAF tick flag to prevent duplicate frames */
    private ticking = false

    /**
     * Creates a new ParallaxScrollManager instance.
     *
     * @param parallaxSelector - CSS selector for parallax elements
     */
    constructor(parallaxSelector: string) {
        this.elements = Array.from(
            document.querySelectorAll<HTMLElement>(parallaxSelector),
        )
        this.onScroll = this.onScroll.bind(this)
        window.addEventListener("scroll", this.onScroll)
    }

    /**
     * Scroll event handler with RAF throttling.
     */
    private onScroll(): void {
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this.applyParallax()
                this.ticking = false
            })
            this.ticking = true
        }
    }

    /**
     * Applies parallax effect to all registered elements.
     * Reads speed from data-speed attribute (default: 0.5).
     */
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

    /**
     * Destroys the manager and removes event listeners.
     */
    public destroy(): void {
        window.removeEventListener("scroll", this.onScroll)
    }
}
