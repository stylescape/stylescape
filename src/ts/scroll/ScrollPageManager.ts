/**
 * Manages scroll position using sessionStorage.
 * Restores scroll position on page load and cleans it up after.
 */
export class ScrollPageManager {
    private key = "scrollpos"
    private debounceTimeout: number | null = null

    constructor() {
        this.initialize()
    }

    /**
     * Sets up scroll position tracking and restoration.
     */
    private initialize(): void {
        window.addEventListener("load", () => this.loadScrollPosition())
        window.addEventListener("scroll", () => this.debounceSaveScroll())
        window.addEventListener("beforeunload", () =>
            this.saveScrollPosition(),
        )
    }

    /**
     * Restores scroll position from sessionStorage and clears it.
     */
    private loadScrollPosition(): void {
        const scrollpos = sessionStorage.getItem(this.key)
        if (scrollpos) {
            window.scrollTo(0, parseInt(scrollpos, 10))
            sessionStorage.removeItem(this.key)
            // console.log(
            //     "ScrollPageManager: scroll position restored and cleared",
            // )
        }
    }

    /**
     * Saves scroll position to sessionStorage.
     */
    private saveScrollPosition(): void {
        sessionStorage.setItem(this.key, window.scrollY.toString())
    }

    /**
     * Debounced scroll saving to reduce writes.
     */
    private debounceSaveScroll(): void {
        if (this.debounceTimeout !== null) {
            clearTimeout(this.debounceTimeout)
        }
        this.debounceTimeout = window.setTimeout(() => {
            this.saveScrollPosition()
        }, 200)
    }
}
