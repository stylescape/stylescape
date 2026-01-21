// ============================================================================
// Stylescape | Infinite Scroll Manager
// ============================================================================
// Automatically loads more content when user scrolls near the bottom.
// Supports data-ss-infinite-scroll attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for InfiniteScrollManager
 */
export interface InfiniteScrollOptions {
    /** Distance from bottom (in pixels) to trigger loading */
    threshold?: number
    /** Callback function to load more content */
    loadMoreCallback: () => void
    /** Scroll container (default: window) */
    container?: HTMLElement | Window
    /** Throttle delay in milliseconds */
    throttle?: number
    /** Enable debug logging */
    debug?: boolean
}

/**
 * Infinite scroll manager for lazy loading content.
 * Triggers a callback when user scrolls near the bottom of the container.
 *
 * @example JavaScript
 * ```typescript
 * const infiniteScroll = new InfiniteScrollManager({
 *     threshold: 300,
 *     loadMoreCallback: async () => {
 *         const items = await fetchMoreItems()
 *         appendItems(items)
 *     }
 * })
 *
 * // Pause/resume loading
 * infiniteScroll.pause()
 * infiniteScroll.resume()
 *
 * // Cleanup
 * infiniteScroll.destroy()
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <div data-ss="infinite-scroll"
 *      data-ss-infinite-scroll-threshold="300"
 *      data-ss-infinite-scroll-url="/api/items">
 *     <div class="items-container">...</div>
 *     <div class="loading-indicator" hidden>Loading...</div>
 * </div>
 * ```
 */
export class InfiniteScrollManager {
    /** Distance from bottom to trigger loading */
    private threshold: number

    /** Callback to load more content */
    private loadMoreCallback: () => void

    /** Scroll container element */
    private container: HTMLElement | Window

    /** Whether scrolling is actively monitored */
    private isActive: boolean

    /** Enable debug logging */
    private debug: boolean

    /** Timestamp of last scroll check */
    private lastCheck: number

    /** Throttle interval in milliseconds */
    private throttleMs: number

    /**
     * Creates a new InfiniteScrollManager instance.
     *
     * @param options - Configuration options
     */
    constructor({
        threshold = 300,
        loadMoreCallback,
        container = window,
        throttle = 200,
        debug = false,
    }: InfiniteScrollOptions) {
        this.threshold = threshold
        this.loadMoreCallback = loadMoreCallback
        this.container = container
        this.debug = debug
        this.isActive = true
        this.lastCheck = 0
        this.throttleMs = throttle

        this.attach()
        if (this.debug) console.log("InfiniteScrollManager initialized")
    }

    /**
     * Attaches the scroll event listener to the container.
     */
    private attach(): void {
        this.container.addEventListener("scroll", this.handleScroll)
    }

    /**
     * Handles scroll events with throttling.
     * Triggers the load callback when threshold is reached.
     */
    private handleScroll = (): void => {
        if (!this.isActive) return

        const now = Date.now()
        if (now - this.lastCheck < this.throttleMs) return
        this.lastCheck = now

        const scrollPos =
            this.container instanceof Window
                ? window.scrollY + window.innerHeight
                : (this.container as HTMLElement).scrollTop +
                  (this.container as HTMLElement).clientHeight

        const maxScroll =
            this.container instanceof Window
                ? document.body.offsetHeight
                : (this.container as HTMLElement).scrollHeight

        if (scrollPos >= maxScroll - this.threshold) {
            if (this.debug)
                console.log("Reached bottom, loading more content...")
            this.loadMoreCallback()
        }
    }

    /**
     * Pauses infinite scroll monitoring.
     * Call when loading to prevent duplicate requests.
     */
    public pause(): void {
        this.isActive = false
        if (this.debug) console.log("InfiniteScrollManager paused")
    }

    /**
     * Resumes infinite scroll monitoring.
     * Call after loading completes.
     */
    public resume(): void {
        this.isActive = true
        if (this.debug) console.log("InfiniteScrollManager resumed")
    }

    /**
     * Destroys the manager and removes event listeners.
     */
    public destroy(): void {
        this.container.removeEventListener("scroll", this.handleScroll)
        if (this.debug) console.log("InfiniteScrollManager destroyed")
    }
}

// const infiniteScroll = new InfiniteScrollManager({
//     threshold: 200,
//     loadMoreCallback: () => {
//         console.log("Loading more content...")
//         // your load logic here
//     },
//     debug: true
// })
