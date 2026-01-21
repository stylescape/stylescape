// ============================================================================
// Stylescape | Responsive Menu Manager
// ============================================================================
// Responsive navigation menu with mobile toggle and accessibility support.
// Supports data-ss-menu attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for ResponsiveMenuManager
 */
export interface ResponsiveMenuOptions {
    /** Breakpoint for mobile view in pixels */
    breakpoint?: number;
    /** CSS class for expanded state */
    expandedClass?: string;
    /** CSS class for mobile view */
    mobileClass?: string;
    /** Close menu on link click */
    closeOnLinkClick?: boolean;
    /** Close menu on outside click */
    closeOnOutsideClick?: boolean;
    /** Close menu on Escape key */
    closeOnEscape?: boolean;
    /** Animation duration in milliseconds */
    animationDuration?: number;
    /** Trap focus when menu is open */
    trapFocus?: boolean;
    /** Callback when menu opens */
    onOpen?: () => void;
    /** Callback when menu closes */
    onClose?: () => void;
    /** Selector for nav links */
    linkSelector?: string;
}

/**
 * Accessible responsive navigation menu.
 *
 * @example JavaScript
 * ```typescript
 * const menu = new ResponsiveMenuManager("#navMenu", "#menuToggle", {
 *     breakpoint: 768,
 *     closeOnLinkClick: true,
 *     closeOnOutsideClick: true
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <nav data-ss="responsive-menu" data-ss-menu-breakpoint="768">
 *     <button data-ss-menu-toggle aria-expanded="false" aria-controls="main-nav">
 *         <span class="hamburger"></span>
 *         Menu
 *     </button>
 *     <ul id="main-nav" data-ss-menu-content hidden>
 *         <li><a href="/">Home</a></li>
 *         <li><a href="/about">About</a></li>
 *         <li><a href="/contact">Contact</a></li>
 *     </ul>
 * </nav>
 * ```
 */
export class ResponsiveMenuManager {
    private menu: HTMLElement | null;
    private toggle: HTMLElement | null;
    private options: Required<ResponsiveMenuOptions>;
    private isExpanded: boolean = false;
    private isMobile: boolean = false;
    private focusableElements: HTMLElement[] = [];

    constructor(
        menuSelector: string | HTMLElement,
        toggleSelector: string | HTMLElement,
        options: ResponsiveMenuOptions = {},
    ) {
        this.menu =
            typeof menuSelector === "string"
                ? document.querySelector<HTMLElement>(menuSelector)
                : menuSelector;

        this.toggle =
            typeof toggleSelector === "string"
                ? document.querySelector<HTMLElement>(toggleSelector)
                : toggleSelector;

        this.options = {
            breakpoint: options.breakpoint ?? 768,
            expandedClass: options.expandedClass ?? "nav--expanded",
            mobileClass: options.mobileClass ?? "nav--mobile",
            closeOnLinkClick: options.closeOnLinkClick ?? true,
            closeOnOutsideClick: options.closeOnOutsideClick ?? true,
            closeOnEscape: options.closeOnEscape ?? true,
            animationDuration: options.animationDuration ?? 300,
            trapFocus: options.trapFocus ?? true,
            onOpen: options.onOpen ?? (() => {}),
            onClose: options.onClose ?? (() => {}),
            linkSelector: options.linkSelector ?? "a",
        };

        if (!this.menu) {
            console.warn(
                "[Stylescape] ResponsiveMenuManager menu element not found",
            );
            return;
        }

        if (!this.toggle) {
            console.warn(
                "[Stylescape] ResponsiveMenuManager toggle element not found",
            );
            return;
        }

        this.init();
    }

    // ========================================================================
    // Public Properties
    // ========================================================================

    /**
     * Check if menu is expanded
     */
    public get expanded(): boolean {
        return this.isExpanded;
    }

    /**
     * Check if in mobile view
     */
    public get mobile(): boolean {
        return this.isMobile;
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Open the menu
     */
    public open(): void {
        if (!this.menu || this.isExpanded) return;

        this.isExpanded = true;
        this.menu.hidden = false;
        this.menu.classList.add(this.options.expandedClass);
        this.toggle?.setAttribute("aria-expanded", "true");

        // Prevent body scroll on mobile
        if (this.isMobile) {
            document.body.style.overflow = "hidden";
        }

        // Focus first link
        if (this.options.trapFocus) {
            this.updateFocusableElements();
            requestAnimationFrame(() => {
                this.focusableElements[0]?.focus();
            });
        }

        this.options.onOpen();
    }

    /**
     * Close the menu
     */
    public close(): void {
        if (!this.menu || !this.isExpanded) return;

        this.isExpanded = false;
        this.menu.classList.remove(this.options.expandedClass);
        this.toggle?.setAttribute("aria-expanded", "false");

        // Allow body scroll
        document.body.style.overflow = "";

        // Hide after animation (for mobile)
        if (this.isMobile) {
            setTimeout(() => {
                if (!this.isExpanded && this.menu) {
                    this.menu.hidden = true;
                }
            }, this.options.animationDuration);
        }

        // Return focus to toggle
        this.toggle?.focus();

        this.options.onClose();
    }

    /**
     * Toggle the menu
     */
    public toggleMenu(): void {
        if (this.isExpanded) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Force check of window size
     */
    public checkWindowSize(): void {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < this.options.breakpoint;

        const nav = this.menu?.closest("nav") || this.menu?.parentElement;

        if (this.isMobile) {
            nav?.classList.add(this.options.mobileClass);
            if (!this.isExpanded && this.menu) {
                this.menu.hidden = true;
            }
        } else {
            nav?.classList.remove(this.options.mobileClass);
            if (this.menu) {
                this.menu.hidden = false;
            }

            // Close expanded menu when resizing to desktop
            if (wasMobile && this.isExpanded) {
                this.close();
            }
        }
    }

    /**
     * Destroy the manager
     */
    public destroy(): void {
        this.toggle?.removeEventListener("click", this.handleToggleClick);
        document.removeEventListener("click", this.handleOutsideClick);
        document.removeEventListener("keydown", this.handleKeydown);
        window.removeEventListener("resize", this.handleResize);

        this.menu
            ?.querySelectorAll(this.options.linkSelector)
            .forEach((link) => {
                link.removeEventListener("click", this.handleLinkClick);
            });

        this.menu = null;
        this.toggle = null;
    }

    // ========================================================================
    // Static Factory
    // ========================================================================

    /**
     * Initialize responsive menus with data-ss="responsive-menu"
     */
    public static initMenus(): ResponsiveMenuManager[] {
        const managers: ResponsiveMenuManager[] = [];

        document
            .querySelectorAll<HTMLElement>('[data-ss="responsive-menu"]')
            .forEach((nav) => {
                const toggle = nav.querySelector<HTMLElement>(
                    "[data-ss-menu-toggle]",
                );
                const menu = nav.querySelector<HTMLElement>(
                    "[data-ss-menu-content]",
                );

                if (toggle && menu) {
                    const breakpoint = nav.dataset.ssMenuBreakpoint;

                    managers.push(
                        new ResponsiveMenuManager(menu, toggle, {
                            breakpoint: breakpoint
                                ? parseInt(breakpoint, 10)
                                : undefined,
                        }),
                    );
                }
            });

        return managers;
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private init(): void {
        if (!this.menu || !this.toggle) return;

        // Setup ARIA
        const menuId = this.menu.id || `nav-menu-${Date.now()}`;
        this.menu.id = menuId;
        this.toggle.setAttribute("aria-controls", menuId);
        this.toggle.setAttribute("aria-expanded", "false");
        this.menu.setAttribute("role", "navigation");

        // Initial check
        this.checkWindowSize();

        // Add event listeners
        this.toggle.addEventListener("click", this.handleToggleClick);
        window.addEventListener("resize", this.handleResize);

        if (this.options.closeOnOutsideClick) {
            document.addEventListener("click", this.handleOutsideClick);
        }

        if (this.options.closeOnEscape) {
            document.addEventListener("keydown", this.handleKeydown);
        }

        if (this.options.closeOnLinkClick) {
            this.menu
                .querySelectorAll(this.options.linkSelector)
                .forEach((link) => {
                    link.addEventListener("click", this.handleLinkClick);
                });
        }
    }

    private updateFocusableElements(): void {
        if (!this.menu) return;

        const focusableSelectors = [
            "button:not([disabled])",
            "a[href]",
            "input:not([disabled])",
            '[tabindex]:not([tabindex="-1"])',
        ].join(",");

        this.focusableElements = Array.from(
            this.menu.querySelectorAll<HTMLElement>(focusableSelectors),
        );
    }

    // ========================================================================
    // Event Handlers
    // ========================================================================

    private handleToggleClick = (event: Event): void => {
        event.preventDefault();
        this.toggleMenu();
    };

    private handleOutsideClick = (event: Event): void => {
        if (!this.isExpanded || !this.isMobile) return;

        const target = event.target as Node;
        const nav = this.menu?.closest("nav") || this.menu?.parentElement;

        if (nav && !nav.contains(target)) {
            this.close();
        }
    };

    private handleKeydown = (event: KeyboardEvent): void => {
        if (!this.isExpanded) return;

        if (event.key === "Escape") {
            event.preventDefault();
            this.close();
            return;
        }

        // Focus trap
        if (event.key === "Tab" && this.options.trapFocus && this.isMobile) {
            this.handleTabKey(event);
        }
    };

    private handleTabKey(event: KeyboardEvent): void {
        if (this.focusableElements.length === 0) return;

        const firstElement = this.focusableElements[0];
        const lastElement =
            this.focusableElements[this.focusableElements.length - 1];

        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }

    private handleLinkClick = (): void => {
        if (this.isMobile && this.isExpanded) {
            this.close();
        }
    };

    private handleResize = (): void => {
        this.checkWindowSize();
    };
}

export default ResponsiveMenuManager;
