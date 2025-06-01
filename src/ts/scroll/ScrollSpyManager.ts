// Updates navigation based on scroll position, commonly used in single-page websites.

// ScrollSpyManager: Activates nav links based on scroll position.
export class ScrollSpyManager {
    private sections: HTMLElement[]
    private navLinks: NodeListOf<HTMLElement>
    private scrollContainer: HTMLElement | Window
    private thresholdOffset: number
    private ticking = false

    constructor(
        sections: HTMLElement[],
        navLinksSelector: string,
        containerId?: string,
        thresholdOffset: number = 0.5, // default halfway through section
    ) {
        this.sections = sections
        this.navLinks = document.querySelectorAll(navLinksSelector)
        this.scrollContainer = containerId
            ? (document.getElementById(containerId) ?? window)
            : window
        this.thresholdOffset = thresholdOffset

        this.bindScrollListener()
        this.updateActiveLink()
    }

    private bindScrollListener(): void {
        const container =
            this.scrollContainer === window ? window : this.scrollContainer

        container.addEventListener("scroll", () => this.onScroll(), {
            passive: true,
        })
    }

    private onScroll(): void {
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this.updateActiveLink()
                this.ticking = false
            })
            this.ticking = true
        }
    }

    private updateActiveLink(): void {
        const scrollY =
            this.scrollContainer instanceof Window
                ? window.scrollY
                : this.scrollContainer.scrollTop

        let activeId: string | null = null

        for (const section of this.sections) {
            const id = section.getAttribute("id")
            if (!id) continue

            const top = section.offsetTop
            const height = section.offsetHeight
            const threshold = top - height * this.thresholdOffset

            if (scrollY >= threshold) {
                activeId = id
            }
        }

        this.navLinks.forEach((link) => {
            const targetId = link.getAttribute("href")?.replace("#", "")
            link.classList.toggle("active", targetId === activeId)
        })
    }
}

// export class ScrollSpyManager {
//     private sections: HTMLElement[]
//     private navLinks: NodeListOf<HTMLElement>
//     private scrollContainer: HTMLElement | Window

//     constructor(
//         sections: HTMLElement[],
//         navLinksSelector: string,
//         containerId?: string,
//     ) {
//         this.sections = sections
//         this.navLinks = document.querySelectorAll(navLinksSelector)
//         this.scrollContainer = containerId
//             ? document.getElementById(containerId) || window
//             : window

//         this.attachScrollListener()
//     }

//     private attachScrollListener(): void {
//         // console.log('attachScrollListener');
//         const scrollHandler =
//             this.scrollContainer === window
//                 ? window.addEventListener(
//                       "scroll",
//                       this.updateActiveLink.bind(this),
//                   )
//                 : this.scrollContainer.addEventListener(
//                       "scroll",
//                       this.updateActiveLink.bind(this),
//                       true,
//                   )

//         this.updateActiveLink() // Initialize active state
//     }

//     private updateActiveLink(): void {
//         // console.log('updateActiveLink');
//         // console.log(this.sections);
//         // console.log(this.navLinks);

//         let currentSection = ""
//         const containerScrollY =
//             this.scrollContainer instanceof Window
//                 ? window.scrollY
//                 : this.scrollContainer.scrollTop

//         this.sections.forEach((section) => {
//             const sectionTop = section.offsetTop
//             const sectionHeight = section.clientHeight
//             if (containerScrollY >= sectionTop - sectionHeight / 2) {
//                 currentSection = section.getAttribute("id")!
//             }
//         })

//         this.navLinks.forEach((link) => {
//             link.classList.remove("active")
//             if (link.getAttribute("href") === `#${currentSection}`) {
//                 link.classList.add("active")
//             }
//         })
//     }
// }
