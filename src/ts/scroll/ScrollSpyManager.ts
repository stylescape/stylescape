// ============================================================================
// Stylescape | Scroll Spy Manager
// ============================================================================
// Updates navigation based on scroll position for single-page navigation.
// Supports data-ss-scrollspy attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for ScrollSpyManager
 */
export interface ScrollSpyOptions {
    /** Selector for navigation links */
    navSelector?: string;
    /** Custom scroll container (defaults to window) */
    containerId?: string;
    /** Threshold offset (0-1) for when section is considered active */
    threshold?: number;
    /** Offset from top in pixels */
    offset?: number;
    /** CSS class for active link */
    activeClass?: string;
    /** CSS class for active parent (e.g., li) */
    activeParentClass?: string;
    /** Smooth scroll to sections on link click */
    smoothScroll?: boolean;
    /** Callback when active section changes */
    onChange?: (activeId: string | null, link: HTMLElement | null) => void;
    /** History API integration */
    updateHistory?: boolean;
}

/**
 * Scroll spy for single-page navigation with accessibility support.
 *
 * @example JavaScript
 * ```typescript
 * const scrollSpy = new ScrollSpyManager({
 *     navSelector: ".toc a",
 *     threshold: 0.3,
 *     smoothScroll: true,
 *     onChange: (id) => console.log("Active section:", id)
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <nav data-ss="scrollspy"
 *      data-ss-scrollspy-nav=".toc-link"
 *      data-ss-scrollspy-threshold="0.3"
 *      data-ss-scrollspy-smooth="true">
 *     <a class="toc-link" href="#section1">Section 1</a>
 *     <a class="toc-link" href="#section2">Section 2</a>
 * </nav>
 *
 * <section id="section1">...</section>
 * <section id="section2">...</section>
 * ```
 */
export class ScrollSpyManager {
    private sections: HTMLElement[] = [];
    private navLinks: HTMLElement[] = [];
    private scrollContainer: HTMLElement | Window;
    private options: Required<ScrollSpyOptions>;
    private ticking: boolean = false;
    private currentActiveId: string | null = null;

    constructor(options: ScrollSpyOptions = {}) {
        this.options = {
            navSelector:
                options.navSelector ??
                "[data-ss-scrollspy-link], .scrollspy-link",
            containerId: options.containerId ?? "",
            threshold: options.threshold ?? 0.5,
            offset: options.offset ?? 0,
            activeClass: options.activeClass ?? "active",
            activeParentClass: options.activeParentClass ?? "active",
            smoothScroll: options.smoothScroll ?? true,
            onChange: options.onChange ?? (() => {}),
            updateHistory: options.updateHistory ?? false,
        };

        // Setup scroll container
        this.scrollContainer = this.options.containerId
            ? (document.getElementById(this.options.containerId) ?? window)
            : window;

        this.init();
    }

    // For backwards compatibility with old constructor
    static fromElements(
        sections: HTMLElement[],
        navLinksSelector: string,
        containerId?: string,
        thresholdOffset: number = 0.5,
    ): ScrollSpyManager {
        const instance = new ScrollSpyManager({
            navSelector: navLinksSelector,
            containerId,
            threshold: thresholdOffset,
        });
        instance.sections = sections;
        instance.updateActiveLink();
        return instance;
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Manually refresh sections and links
     */
    public refresh(): void {
        this.findSections();
        this.updateActiveLink();
    }

    /**
     * Scroll to a specific section
     */
    public scrollTo(sectionId: string): void {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const top = section.offsetTop - this.options.offset;

        if (this.scrollContainer instanceof Window) {
            window.scrollTo({
                top,
                behavior: this.options.smoothScroll ? "smooth" : "auto",
            });
        } else {
            this.scrollContainer.scrollTo({
                top,
                behavior: this.options.smoothScroll ? "smooth" : "auto",
            });
        }
    }

    /**
     * Get current active section ID
     */
    public getActive(): string | null {
        return this.currentActiveId;
    }

    /**
     * Destroy the scroll spy
     */
    public destroy(): void {
        const container =
            this.scrollContainer instanceof Window
                ? window
                : this.scrollContainer;

        container.removeEventListener("scroll", this.handleScroll);

        this.navLinks.forEach((link) => {
            link.removeEventListener("click", this.handleLinkClick);
        });

        this.sections = [];
        this.navLinks = [];
    }

    // ========================================================================
    // Static Factory
    // ========================================================================

    /**
     * Initialize scroll spy from data-ss="scrollspy"
     */
    public static init(): ScrollSpyManager[] {
        const managers: ScrollSpyManager[] = [];

        document
            .querySelectorAll<HTMLElement>('[data-ss="scrollspy"]')
            .forEach((el) => {
                const navSelector = el.dataset.ssScrollspyNav || `#${el.id} a`;
                const threshold = el.dataset.ssScrollspyThreshold;
                const smooth = el.dataset.ssScrollspySmooth !== "false";
                const offset = el.dataset.ssScrollspyOffset;

                managers.push(
                    new ScrollSpyManager({
                        navSelector,
                        threshold: threshold
                            ? parseFloat(threshold)
                            : undefined,
                        smoothScroll: smooth,
                        offset: offset ? parseInt(offset, 10) : undefined,
                    }),
                );
            });

        return managers;
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private init(): void {
        this.findSections();
        this.bindScrollListener();
        this.bindLinkListeners();
        this.updateActiveLink();
    }

    private findSections(): void {
        // Find nav links
        this.navLinks = Array.from(
            document.querySelectorAll<HTMLElement>(this.options.navSelector),
        );

        // Find sections based on nav link hrefs
        this.sections = [];
        this.navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (href?.startsWith("#")) {
                const sectionId = href.slice(1);
                const section = document.getElementById(sectionId);
                if (section && !this.sections.includes(section)) {
                    this.sections.push(section);
                }
            }
        });
    }

    private bindScrollListener(): void {
        const container =
            this.scrollContainer instanceof Window
                ? window
                : this.scrollContainer;

        container.addEventListener("scroll", this.handleScroll, {
            passive: true,
        });
    }

    private bindLinkListeners(): void {
        this.navLinks.forEach((link) => {
            link.addEventListener("click", this.handleLinkClick);
        });
    }

    private handleScroll = (): void => {
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                // The frame can fire after the document (and jsdom's Window) is
                // gone, e.g. during teardown; there is nothing to update then.
                if (typeof Window === "undefined") return;
                this.updateActiveLink();
                this.ticking = false;
            });
            this.ticking = true;
        }
    };

    private handleLinkClick = (event: Event): void => {
        const link = event.currentTarget as HTMLElement;
        const href = link.getAttribute("href");

        if (href?.startsWith("#")) {
            event.preventDefault();
            const sectionId = href.slice(1);
            this.scrollTo(sectionId);

            if (this.options.updateHistory) {
                history.pushState(null, "", href);
            }
        }
    };

    private updateActiveLink(): void {
        if (this.sections.length === 0 || this.navLinks.length === 0) return;

        const scrollY =
            this.scrollContainer instanceof Window
                ? window.scrollY
                : this.scrollContainer.scrollTop;

        let activeId: string | null = null;

        // Find the active section
        for (const section of this.sections) {
            const id = section.getAttribute("id");
            if (!id) continue;

            const top = section.offsetTop - this.options.offset;
            const height = section.offsetHeight;
            const threshold = top - height * this.options.threshold;

            if (scrollY >= threshold) {
                activeId = id;
            }
        }

        // Only update if changed
        if (activeId === this.currentActiveId) return;
        this.currentActiveId = activeId;

        // Update classes
        let activeLink: HTMLElement | null = null;

        this.navLinks.forEach((link) => {
            const targetId = link.getAttribute("href")?.replace("#", "");
            const isActive = targetId === activeId;

            // Update link
            link.classList.toggle(this.options.activeClass, isActive);
            link.setAttribute("aria-current", isActive ? "true" : "false");

            if (isActive) {
                activeLink = link;
            }

            // Update parent elements (like li in nav lists)
            this.updateParentClasses(link, isActive);
        });

        this.options.onChange(activeId, activeLink);
    }

    private updateParentClasses(link: HTMLElement, isActive: boolean): void {
        let parent = link.parentElement;

        while (parent && parent !== document.body) {
            if (parent.tagName === "LI") {
                parent.classList.toggle(
                    this.options.activeParentClass,
                    isActive,
                );
            }
            parent = parent.parentElement;
        }
    }
}

export default ScrollSpyManager;
