export class InfiniteScrollManager {
    private threshold: number
    private loadMoreCallback: () => void
    private container: HTMLElement | Window
    private isActive: boolean
    private debug: boolean
    private lastCheck: number
    private throttleMs: number

    constructor({
        threshold = 300,
        loadMoreCallback,
        container = window,
        throttle = 200,
        debug = false,
    }: {
        threshold?: number
        loadMoreCallback: () => void
        container?: HTMLElement | Window
        throttle?: number
        debug?: boolean
    }) {
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

    private attach(): void {
        this.container.addEventListener("scroll", this.handleScroll)
    }

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

    public pause(): void {
        this.isActive = false
        if (this.debug) console.log("InfiniteScrollManager paused")
    }

    public resume(): void {
        this.isActive = true
        if (this.debug) console.log("InfiniteScrollManager resumed")
    }

    public destroy(): void {
        this.container.removeEventListener("scroll", this.handleScroll)
        if (this.debug) console.log("InfiniteScrollManager destroyed")
    }
}

// Usage Example

// import InfiniteScrollManager from "./InfiniteScrollManager"

// const infiniteScroll = new InfiniteScrollManager({
//     threshold: 200,
//     loadMoreCallback: () => {
//         console.log("Loading more content...")
//         // your load logic here
//     },
//     debug: true
// })
