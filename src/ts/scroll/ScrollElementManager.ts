export class ScrollElementManager {
    private contentElement: HTMLElement | null
    private storageKey: string
    private debug: boolean

    constructor(
        contentSelector: string,
        storageKey: string = "scrollpos",
        debug = false,
    ) {
        this.contentElement = document.querySelector(contentSelector)
        this.storageKey = storageKey
        this.debug = debug

        if (!this.contentElement) {
            if (this.debug)
                console.warn(
                    "ScrollElementManager: Element not found:",
                    contentSelector,
                )
            return
        }

        this.initialize()
    }

    private initialize(): void {
        window.addEventListener("load", this.loadScrollPosition.bind(this))
        this.contentElement?.addEventListener(
            "scroll",
            this.updateScrollPosition.bind(this),
        )

        if (this.debug) console.log("ScrollElementManager initialized.")
    }

    private loadScrollPosition(): void {
        try {
            const scrollpos = sessionStorage.getItem(this.storageKey)
            if (scrollpos !== null && this.contentElement) {
                this.contentElement.scrollTop = parseInt(scrollpos, 10)
                sessionStorage.removeItem(this.storageKey)

                if (this.debug)
                    console.log("Scroll position restored:", scrollpos)
            }
        } catch (err) {
            if (this.debug)
                console.error(
                    "ScrollElementManager error loading scroll position:",
                    err,
                )
        }
    }

    private updateScrollPosition(): void {
        try {
            if (this.contentElement) {
                sessionStorage.setItem(
                    this.storageKey,
                    this.contentElement.scrollTop.toString(),
                )
                if (this.debug)
                    console.log(
                        "Scroll position saved:",
                        this.contentElement.scrollTop,
                    )
            }
        } catch (err) {
            if (this.debug)
                console.error(
                    "ScrollElementManager error saving scroll position:",
                    err,
                )
        }
    }
}
