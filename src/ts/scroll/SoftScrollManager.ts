// ============================================================================
// Stylescape | Soft Scroll Manager
// ============================================================================
// Enables smooth scrolling for anchor links with customizable offset.
// Supports data-ss-soft-scroll attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for soft scroll
 */
export interface SoftScrollOptions {
    /** Vertical offset in rem units */
    offsetRem?: number;
    /** Scroll behavior (smooth or auto) */
    behavior?: ScrollBehavior;
    /** Block alignment (start, center, end, nearest) */
    block?: ScrollLogicalPosition;
}

/**
 * Static utility class for smooth in-page anchor link scrolling.
 * Provides smooth scrolling with configurable vertical offset.
 *
 * @example JavaScript
 * ```typescript
 * // Enable smooth scroll with 2rem offset for fixed header
 * SoftScrollManager.enableForSelector(".scroll-link", 2)
 *
 * // Enable for all anchor links with no offset
 * SoftScrollManager.enableForSelector('a[href^="#"]')
 * ```
 *
 * @example HTML
 * ```html
 * <!-- Navigation with smooth scroll -->
 * <nav>
 *     <a href="#about" class="scroll-link">About</a>
 *     <a href="#services" class="scroll-link">Services</a>
 *     <a href="#contact" class="scroll-link">Contact</a>
 * </nav>
 *
 * <!-- Target sections -->
 * <section id="about">...</section>
 * <section id="services">...</section>
 * <section id="contact">...</section>
 * ```
 */
export class SoftScrollManager {
    /**
     * Enable soft scrolling on anchor elements matching the selector.
     * Intercepts click events and scrolls smoothly to target elements.
     *
     * @param selector - CSS selector for anchor links to enable
     * @param yOffsetInRem - Vertical offset in rem units (default: 0)
     */
    static enableForSelector(
        selector: string,
        yOffsetInRem: number = 0,
    ): void {
        const links = document.querySelectorAll<HTMLElement>(selector);
        const offsetPx =
            yOffsetInRem *
            parseFloat(getComputedStyle(document.documentElement).fontSize);

        links.forEach((link) => {
            if (!(link instanceof HTMLAnchorElement)) return;

            const href = link.getAttribute("href");
            if (!href || !href.startsWith("#") || href === "#") return;

            const targetId = href.slice(1);

            link.addEventListener("click", (event) => {
                event.preventDefault();

                const targetElement = document.getElementById(targetId);
                if (!targetElement) {
                    console.warn(
                        `SoftScroll: Element not found for ID "${targetId}"`,
                    );
                    return;
                }

                const scrollTargetY =
                    targetElement.getBoundingClientRect().top +
                    window.pageYOffset -
                    offsetPx;

                window.scrollTo({ top: scrollTargetY, behavior: "smooth" });
            });
        });
    }
}

// Enable smooth scroll for .scroll-link elements with 2rem offset
// SoftScroll.enableForSelector('.scroll-link', 2)
