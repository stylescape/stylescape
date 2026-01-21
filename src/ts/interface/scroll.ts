// ============================================================================
// Stylescape | Scroll Utilities
// ============================================================================
// Utility functions and classes for scroll-based interactions.
// Supports data-ss-scroll attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for smooth scrolling
 */
export interface SmoothScrollOptions {
    /** Target element or selector */
    target?: string | HTMLElement
    /** Offset from top in pixels */
    offset?: number
    /** Duration in milliseconds */
    duration?: number
    /** Easing function name */
    easing?: "linear" | "easeInOut" | "easeIn" | "easeOut"
    /** Callback on scroll complete */
    onComplete?: () => void
}

/**
 * Configuration options for scroll-to-top button
 */
export interface ScrollToTopOptions {
    /** Selector or element for the button */
    button?: string | HTMLElement
    /** Show button after scrolling this many pixels */
    threshold?: number
    /** Smooth scroll behavior */
    smooth?: boolean
    /** Duration for scroll animation */
    duration?: number
    /** CSS class when button is visible */
    visibleClass?: string
}

/**
 * Easing functions for scroll animations
 */
const easingFunctions = {
    linear: (t: number): number => t,
    easeIn: (t: number): number => t * t,
    easeOut: (t: number): number => t * (2 - t),
    easeInOut: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

/**
 * Smooth scroll to a target element or position.
 *
 * @example JavaScript
 * ```typescript
 * // Scroll to element
 * scrollTo("#section-2", { offset: -100, duration: 800 })
 *
 * // Scroll to position
 * scrollToPosition(500, { smooth: true })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <a data-ss="scroll-to"
 *    data-ss-scroll-target="#contact"
 *    data-ss-scroll-offset="-80">
 *    Contact Us
 * </a>
 * ```
 */
export function scrollTo(
    target: string | HTMLElement | number,
    options: SmoothScrollOptions = {}
): void {
    const { offset = 0, duration = 500, easing = "easeInOut", onComplete } = options

    let targetPosition: number

    if (typeof target === "number") {
        targetPosition = target
    } else {
        const element = typeof target === "string"
            ? document.querySelector<HTMLElement>(target)
            : target

        if (!element) {
            console.warn("[Stylescape] scrollTo target not found:", target)
            return
        }

        targetPosition = element.getBoundingClientRect().top + window.pageYOffset
    }

    const startPosition = window.pageYOffset
    const distance = targetPosition + offset - startPosition
    const easingFn = easingFunctions[easing]
    let startTime: number | null = null

    function animation(currentTime: number): void {
        if (startTime === null) startTime = currentTime
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        window.scrollTo(0, startPosition + distance * easingFn(progress))

        if (elapsed < duration) {
            requestAnimationFrame(animation)
        } else {
            onComplete?.()
        }
    }

    requestAnimationFrame(animation)
}

/**
 * Scroll to a specific Y position
 */
export function scrollToPosition(
    y: number,
    options: { smooth?: boolean; duration?: number } = {}
): void {
    if (options.smooth && options.duration) {
        scrollTo(y, { duration: options.duration })
    } else {
        window.scrollTo({
            top: y,
            behavior: options.smooth ? "smooth" : "auto"
        })
    }
}

/**
 * Scroll to top of page
 */
export function scrollToTop(options: { smooth?: boolean; duration?: number } = {}): void {
    scrollToPosition(0, options)
}

/**
 * Scroll to bottom of page
 */
export function scrollToBottom(options: { smooth?: boolean; duration?: number } = {}): void {
    const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
    )
    scrollToPosition(documentHeight, options)
}

/**
 * Scroll-to-top button manager.
 *
 * @example JavaScript
 * ```typescript
 * const scrollTop = new ScrollToTopButton({
 *     button: "#back-to-top",
 *     threshold: 300,
 *     smooth: true
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <button data-ss="scroll-to-top"
 *         data-ss-scroll-threshold="300"
 *         aria-label="Scroll to top">
 *     ↑
 * </button>
 * ```
 */
export class ScrollToTopButton {
    private button: HTMLElement | null
    private options: Required<ScrollToTopOptions>
    private ticking: boolean = false

    constructor(options: ScrollToTopOptions = {}) {
        this.button = typeof options.button === "string"
            ? document.querySelector<HTMLElement>(options.button)
            : options.button ?? null

        this.options = {
            button: this.button ?? document.createElement("button"),
            threshold: options.threshold ?? 300,
            smooth: options.smooth ?? true,
            duration: options.duration ?? 500,
            visibleClass: options.visibleClass ?? "scroll-to-top--visible"
        }

        if (!this.button) {
            console.warn("[Stylescape] ScrollToTopButton: button not found")
            return
        }

        this.init()
    }

    /**
     * Manually show the button
     */
    public show(): void {
        this.button?.classList.add(this.options.visibleClass)
        this.button?.setAttribute("aria-hidden", "false")
    }

    /**
     * Manually hide the button
     */
    public hide(): void {
        this.button?.classList.remove(this.options.visibleClass)
        this.button?.setAttribute("aria-hidden", "true")
    }

    /**
     * Destroy the button manager
     */
    public destroy(): void {
        window.removeEventListener("scroll", this.handleScroll)
        this.button?.removeEventListener("click", this.handleClick)
        this.button = null
    }

    /**
     * Initialize scroll-to-top buttons with data-ss
     */
    public static init(): ScrollToTopButton[] {
        const buttons: ScrollToTopButton[] = []

        document.querySelectorAll<HTMLElement>('[data-ss="scroll-to-top"]').forEach((el) => {
            const threshold = el.dataset.ssScrollThreshold

            buttons.push(new ScrollToTopButton({
                button: el,
                threshold: threshold ? parseInt(threshold, 10) : undefined
            }))
        })

        return buttons
    }

    private init(): void {
        if (!this.button) return

        // Setup ARIA
        this.button.setAttribute("aria-label", this.button.getAttribute("aria-label") || "Scroll to top")
        this.button.setAttribute("aria-hidden", "true")

        // Initial state
        this.checkScroll()

        // Event listeners
        window.addEventListener("scroll", this.handleScroll, { passive: true })
        this.button.addEventListener("click", this.handleClick)
    }

    private handleScroll = (): void => {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.checkScroll()
                this.ticking = false
            })
            this.ticking = true
        }
    }

    private checkScroll(): void {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop

        if (scrollY > this.options.threshold) {
            this.show()
        } else {
            this.hide()
        }
    }

    private handleClick = (event: Event): void => {
        event.preventDefault()

        if (this.options.smooth) {
            scrollTo(0, { duration: this.options.duration })
        } else {
            window.scrollTo(0, 0)
        }
    }
}

/**
 * Initialize scroll-to links with data-ss="scroll-to"
 */
export function initScrollLinks(): void {
    document.querySelectorAll<HTMLElement>('[data-ss="scroll-to"]').forEach((el) => {
        const target = el.dataset.ssScrollTarget || el.getAttribute("href")
        const offset = el.dataset.ssScrollOffset
        const duration = el.dataset.ssScrollDuration

        el.addEventListener("click", (event) => {
            event.preventDefault()

            if (target) {
                scrollTo(target, {
                    offset: offset ? parseInt(offset, 10) : 0,
                    duration: duration ? parseInt(duration, 10) : 500
                })
            }
        })
    })
}

/**
 * Auto-initialize all scroll utilities
 */
export function initScrollUtilities(): void {
    initScrollLinks()
    ScrollToTopButton.init()
}

export default {
    scrollTo,
    scrollToPosition,
    scrollToTop,
    scrollToBottom,
    ScrollToTopButton,
    initScrollLinks,
    initScrollUtilities
}
