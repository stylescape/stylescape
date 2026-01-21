// ============================================================================
// Stylescape | Content Revealer
// ============================================================================
// Reveals content with fade-in effects after page load.
// Supports data-ss-reveal attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for ContentRevealer
 */
export interface ContentRevealerOptions {
    /** Delay before revealing (ms) */
    delay?: number
    /** Duration of fade animation (ms) */
    duration?: number
    /** Easing function */
    easing?: string
    /** Initial opacity */
    initialOpacity?: number
    /** Whether to use IntersectionObserver for scroll-triggered reveal */
    onScroll?: boolean
    /** Threshold for IntersectionObserver (0-1) */
    threshold?: number
}

/**
 * Reveals content with a fade-in effect.
 *
 * @example JavaScript
 * ```typescript
 * const revealer = new ContentRevealer(".hidden-content", { delay: 500 })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <div data-ss="reveal"
 *      data-ss-reveal-delay="300"
 *      data-ss-reveal-duration="500"
 *      data-ss-reveal-on-scroll="true">
 *     Content to reveal
 * </div>
 * ```
 */
export class ContentRevealer {
    private elements: HTMLElement[]
    private options: Required<ContentRevealerOptions>
    private observer: IntersectionObserver | null = null

    constructor(
        selectorOrElements: string | HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>,
        options: ContentRevealerOptions = {}
    ) {
        // Normalize input to array
        if (typeof selectorOrElements === "string") {
            this.elements = Array.from(document.querySelectorAll<HTMLElement>(selectorOrElements))
        } else if (selectorOrElements instanceof HTMLElement) {
            this.elements = [selectorOrElements]
        } else {
            this.elements = Array.from(selectorOrElements)
        }

        this.options = {
            delay: options.delay ?? 0,
            duration: options.duration ?? 500,
            easing: options.easing ?? "ease",
            initialOpacity: options.initialOpacity ?? 0,
            onScroll: options.onScroll ?? false,
            threshold: options.threshold ?? 0.1
        }

        this.init()
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Manually reveal all elements
     */
    public revealAll(): void {
        this.elements.forEach(el => this.reveal(el))
    }

    /**
     * Reveal a specific element
     */
    public reveal(element: HTMLElement): void {
        element.style.transition = `opacity ${this.options.duration}ms ${this.options.easing}`
        element.style.opacity = "1"
        element.classList.add("reveal--visible")
        element.setAttribute("data-ss-reveal-revealed", "true")
    }

    /**
     * Reset element to hidden state
     */
    public hide(element: HTMLElement): void {
        element.style.opacity = String(this.options.initialOpacity)
        element.classList.remove("reveal--visible")
        element.removeAttribute("data-ss-reveal-revealed")
    }

    /**
     * Reset all elements to hidden state
     */
    public hideAll(): void {
        this.elements.forEach(el => this.hide(el))
    }

    /**
     * Destroy the revealer instance
     */
    public destroy(): void {
        if (this.observer) {
            this.observer.disconnect()
            this.observer = null
        }
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private init(): void {
        // Set initial hidden state
        this.elements.forEach(el => {
            el.style.opacity = String(this.options.initialOpacity)
            el.style.transition = `opacity ${this.options.duration}ms ${this.options.easing}`
        })

        if (this.options.onScroll) {
            this.initIntersectionObserver()
        } else {
            this.initLoadReveal()
        }
    }

    private initLoadReveal(): void {
        const reveal = () => {
            setTimeout(() => this.revealAll(), this.options.delay)
        }

        if (document.readyState === "complete") {
            reveal()
        } else {
            window.addEventListener("load", reveal)
        }
    }

    private initIntersectionObserver(): void {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target as HTMLElement
                        setTimeout(() => this.reveal(el), this.options.delay)
                        this.observer?.unobserve(el)
                    }
                })
            },
            { threshold: this.options.threshold }
        )

        this.elements.forEach(el => this.observer?.observe(el))
    }
}

export default ContentRevealer

