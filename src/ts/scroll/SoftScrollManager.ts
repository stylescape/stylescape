/**
 * SoftScroll enables smooth in-page anchor link scrolling with optional offset.
 *
 * @example
 * SoftScroll.enableForSelector('.scroll-link', 2) // 2rem offset
 */
export class SoftScrollManager {
    /**
     * Enable soft scrolling on anchor elements.
     *
     * @param selector - CSS selector string for target anchor links
     * @param yOffsetInRem - Optional vertical scroll offset in rem (default = 0)
     */
    static enableForSelector(
        selector: string,
        yOffsetInRem: number = 0,
    ): void {
        const links = document.querySelectorAll<HTMLElement>(selector)
        const offsetPx =
            yOffsetInRem *
            parseFloat(getComputedStyle(document.documentElement).fontSize)

        links.forEach((link) => {
            if (!(link instanceof HTMLAnchorElement)) return

            const href = link.getAttribute("href")
            if (!href || !href.startsWith("#") || href === "#") return

            const targetId = href.slice(1)

            link.addEventListener("click", (event) => {
                event.preventDefault()

                const targetElement = document.getElementById(targetId)
                if (!targetElement) {
                    console.warn(
                        `SoftScroll: Element not found for ID "${targetId}"`,
                    )
                    return
                }

                const scrollTargetY =
                    targetElement.getBoundingClientRect().top +
                    window.pageYOffset -
                    offsetPx

                window.scrollTo({ top: scrollTargetY, behavior: "smooth" })
            })
        })
    }
}

// Enable smooth scroll for .scroll-link elements with 2rem offset
// SoftScroll.enableForSelector('.scroll-link', 2)
