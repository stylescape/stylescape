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

// export class ScrollElementManager {
//     private contentElement: HTMLElement

//     constructor(contentSelector: string) {
//         this.contentElement = document.querySelector(contentSelector) as HTMLElement
//         if (!this.contentElement) {
//             // pass
//             // console.error("ScrollElementManager: Specified element not found.");
//             return
//         }
//         // console.log("ScrollElementManager")

//         this.initialize()
//     }

//     private initialize(): void {
//         window.addEventListener('load', this.loadScrollPosition.bind(this))
//         this.contentElement.addEventListener('scroll', this.updateScrollPosition.bind(this))
//         // console.log("ScrollElementManager Init")
//     }

//     // private loadScrollPosition(): void {
//     loadScrollPosition(): void {
//         const scrollpos = localStorage.getItem('scrollpos')
//         // console.log('Restoring scroll position:', scrollpos);
//         if (scrollpos && scrollpos != null) {
//             this.contentElement.scrollTop = parseInt(scrollpos)
//             // console.log('Scroll position set to:', this.contentElement.scrollTop);
//         }
//     }

//     // private loadScrollPosition(): void {
//     //     const scrollpos = localStorage.getItem('scrollpos');
//     //     if (scrollpos) {
//     //         this.contentElement.scrollTop = parseInt(scrollpos);
//     //     }
//     //     console.log("ScrollElementManager Load")

//     // }

//     private updateScrollPosition(): void {
//         localStorage.setItem('scrollpos', this.contentElement.scrollTop.toString())
//         // console.log("ScrollElementManager Update")
//     }
// }

// // Initialize the ScrollManager with the selector of your main content element
// // const scrollManager = new ScrollElementManager('#main-content');
