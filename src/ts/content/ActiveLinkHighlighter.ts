// ============================================================================
// Stylescape | Active Link Highlighter
// ============================================================================
// Automatically highlights navigation links that match the current page URL.
// Supports data-ss-active-link attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for ActiveLinkHighlighter
 */
export interface ActiveLinkHighlighterOptions {
    /** CSS class to apply to active links */
    activeClass?: string
    /** Selector for links to check (default: all 'a' elements) */
    linkSelector?: string
    /** Whether to include query parameters in URL matching */
    includeQuery?: boolean
    /** Selectors for elements to skip (e.g., ribbon titles) */
    skipSelectors?: string[]
}

/**
 * Automatically highlights navigation links matching the current URL.
 *
 * @example JavaScript
 * ```typescript
 * // Basic usage
 * const highlighter = new ActiveLinkHighlighter("active")
 *
 * // With options
 * const highlighter = new ActiveLinkHighlighter("nav-active", {
 *     linkSelector: "nav a",
 *     includeQuery: false
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <nav data-ss="active-link"
 *      data-ss-active-link-class="current"
 *      data-ss-active-link-skip=".ribbon__title">
 *     <a href="/home">Home</a>
 *     <a href="/about">About</a>
 * </nav>
 * ```
 */
export class ActiveLinkHighlighter {
    /** CSS class applied to active links */
    private activeClass: string

    /**
     * Creates a new ActiveLinkHighlighter instance.
     *
     * @param activeClass - CSS class to apply to matching links (default: "active")
     */
    constructor(activeClass: string = "active") {
        this.activeClass = activeClass
        this.highlightAllLinks()
    }

    /**
     * Normalizes a URL by extracting and cleaning the pathname and search.
     *
     * @param url - The URL to normalize
     * @returns The normalized path including query parameters
     */
    private normalizeUrl(url: string): string {
    const a = document.createElement("a");
    a.href = url;
    const pathname = a.pathname.replace(/\/+$/, ""); // strip trailing slash
    return pathname + a.search; // include query parameters
  }

    /**
     * Highlights all links on the page that match the current URL.
     * Skips links inside ribbon titles and links without href attributes.
     */
    private highlightAllLinks(): void {
    const currentPath = this.normalizeUrl(window.location.href);
    const links = document.querySelectorAll<HTMLAnchorElement>("a");

    links.forEach((link) => {
      // Skip links in ribbon titles
      if (link.closest(".ribbon__title")) {
        return;
      }

      if (!link.hasAttribute("href") || !link.getAttribute("href")) {
        return;
      }

      const linkPath = this.normalizeUrl(link.href);
      if (linkPath === currentPath) {
        link.classList.add(this.activeClass);
      }
    });
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
