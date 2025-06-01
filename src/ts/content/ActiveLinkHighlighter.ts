export class ActiveLinkHighlighter {
    private activeClass: string

    constructor(activeClass: string = "active") {
        this.activeClass = activeClass
        this.highlightAllLinks()
    }

    private normalizeUrl(url: string): string {
        const a = document.createElement("a")
        a.href = url
        return a.pathname.replace(/\/+$/, "") // strip trailing slash
    }

    private highlightAllLinks(): void {
        const currentPath = this.normalizeUrl(window.location.href)
        const links = document.querySelectorAll<HTMLAnchorElement>("a")

        links.forEach((link) => {
            const linkPath = this.normalizeUrl(link.href)
            if (linkPath === currentPath) {
                link.classList.add(this.activeClass)
            }
        })
    }
}

// export class ActiveLinkHighlighter {
//     private links: NodeListOf<HTMLAnchorElement>
//     private activeClass: string

//     constructor(selector: string = "a", activeClass: string = "active") {
//         this.links = document.querySelectorAll(selector)
//         this.activeClass = activeClass
//         this.highlight()
//     }

//     private normalize(url: string): string {
//         const a = document.createElement("a")
//         a.href = url
//         return a.pathname.replace(/\/$/, "") // remove trailing slash
//     }

//     private highlight(): void {
//         const currentPath = this.normalize(window.location.href)

//         this.links.forEach((link) => {
//             const linkPath = this.normalize(link.href)
//             if (linkPath === currentPath) {
//                 link.classList.add(this.activeClass)
//             }
//         })
//     }
// }

// Usage:
// new ActiveLinkHighlighter("nav a") // or any specific selector
