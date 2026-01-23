// ============================================================================
// Stylescape | Responsive Table Manager
// ============================================================================
// Manages responsive stacked table behavior for mobile devices.
// Transforms tables into card-style layouts and handles scroll detection.
// Supports data-ss-table-responsive attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for ResponsiveTableManager
 */
export interface ResponsiveTableOptions {
    /** Breakpoint in pixels for stacked mode */
    breakpoint?: number;
    /** CSS class for stacked mode */
    stackedClass?: string;
    /** Auto-generate data-label from table headers */
    autoLabels?: boolean;
    /** Show scroll indicator for scrollable tables */
    showScrollIndicator?: boolean;
    /** Scroll indicator text */
    scrollIndicatorText?: string;
    /** Callback when mode changes */
    onModeChange?: (mode: "stacked" | "normal") => void;
}

/**
 * Responsive table manager with stacked card layout support.
 *
 * @example JavaScript
 * ```typescript
 * const table = new ResponsiveTableManager("#myTable", {
 *     breakpoint: 768,
 *     autoLabels: true,
 *     showScrollIndicator: true
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <table data-ss="table-responsive" data-ss-table-breakpoint="768">
 *     <thead>
 *         <tr>
 *             <th>Name</th>
 *             <th>Email</th>
 *             <th>Status</th>
 *         </tr>
 *     </thead>
 *     <tbody>
 *         <tr>
 *             <td data-label="Name">John Doe</td>
 *             <td data-label="Email">john@example.com</td>
 *             <td data-label="Status">Active</td>
 *         </tr>
 *     </tbody>
 * </table>
 * ```
 */
export class ResponsiveTableManager {
    private table: HTMLTableElement | null;
    private container: HTMLElement | null;
    private currentMode: "stacked" | "normal" = "normal";
    private headers: string[] = [];
    private resizeObserver: ResizeObserver | null = null;
    private options: Required<ResponsiveTableOptions>;

    constructor(
        selectorOrElement: string | HTMLElement,
        options: ResponsiveTableOptions = {},
    ) {
        const element =
            typeof selectorOrElement === "string"
                ? document.querySelector<HTMLElement>(selectorOrElement)
                : selectorOrElement;

        this.table =
            element instanceof HTMLTableElement
                ? element
                : (element?.querySelector<HTMLTableElement>("table") ?? null);

        this.container =
            element instanceof HTMLTableElement
                ? element.parentElement
                : element;

        this.options = {
            breakpoint: options.breakpoint ?? 768,
            stackedClass: options.stackedClass ?? "table--stacked",
            autoLabels: options.autoLabels ?? true,
            showScrollIndicator: options.showScrollIndicator ?? false,
            scrollIndicatorText: options.scrollIndicatorText ?? "← Scroll →",
            onModeChange: options.onModeChange ?? (() => {}),
        };

        if (!this.table) {
            return;
        }

        this.init();
    }

    // ========================================================================
    // Initialization
    // ========================================================================

    private init(): void {
        if (!this.table) return;

        // Extract headers
        this.extractHeaders();

        // Add data-labels if auto-labels is enabled
        if (this.options.autoLabels) {
            this.addDataLabels();
        }

        // Setup resize observer
        this.setupResizeObserver();

        // Initial check
        this.checkMode();

        // Setup scroll tracking if enabled
        if (this.options.showScrollIndicator) {
            this.setupScrollIndicator();
        }
    }

    private extractHeaders(): void {
        if (!this.table) return;

        const headerRow = this.table.querySelector("thead tr");
        if (!headerRow) return;

        const headerCells = headerRow.querySelectorAll("th");
        this.headers = Array.from(headerCells).map(
            (th) => th.textContent?.trim() || "",
        );
    }

    private addDataLabels(): void {
        if (!this.table || this.headers.length === 0) return;

        const bodyRows = this.table.querySelectorAll("tbody tr");

        bodyRows.forEach((row) => {
            const cells = row.querySelectorAll("td");
            cells.forEach((cell, index) => {
                if (
                    index < this.headers.length &&
                    !cell.hasAttribute("data-label")
                ) {
                    cell.setAttribute("data-label", this.headers[index]);
                }
            });
        });
    }

    private setupResizeObserver(): void {
        if (!this.table) return;

        // Use window resize for breakpoint checking
        window.addEventListener("resize", this.handleResize);
    }

    private handleResize = (): void => {
        this.checkMode();
    };

    private checkMode(): void {
        if (!this.table) return;

        const isStacked = window.innerWidth <= this.options.breakpoint;
        const newMode = isStacked ? "stacked" : "normal";

        if (newMode !== this.currentMode) {
            this.currentMode = newMode;
            this.applyMode();
            this.options.onModeChange(newMode);
        }
    }

    private applyMode(): void {
        if (!this.table) return;

        if (this.currentMode === "stacked") {
            this.table.classList.add(this.options.stackedClass);
        } else {
            this.table.classList.remove(this.options.stackedClass);
        }
    }

    private setupScrollIndicator(): void {
        if (!this.container || !this.table) return;

        // Wrap table in scroll container if not already
        const scrollContainer = this.table.parentElement;
        if (!scrollContainer?.classList.contains("table-scroll-container")) {
            const wrapper = document.createElement("div");
            wrapper.classList.add("table-scroll-container");
            wrapper.classList.add("table--with-scroll-indicator");
            this.table.parentNode?.insertBefore(wrapper, this.table);
            wrapper.appendChild(this.table);
            this.container = wrapper;
        }

        // Track scroll
        this.container?.addEventListener("scroll", this.handleScroll);
    }

    private handleScroll = (e: Event): void => {
        const target = e.target as HTMLElement;
        if (target.scrollLeft > 0) {
            target.classList.add("has-scrolled");
        }
    };

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Force stacked mode regardless of viewport
     */
    public forceStacked(): void {
        if (!this.table) return;
        this.table.classList.add(this.options.stackedClass);
        this.currentMode = "stacked";
    }

    /**
     * Force normal mode regardless of viewport
     */
    public forceNormal(): void {
        if (!this.table) return;
        this.table.classList.remove(this.options.stackedClass);
        this.currentMode = "normal";
    }

    /**
     * Return to responsive behavior
     */
    public setResponsive(): void {
        this.checkMode();
    }

    /**
     * Update headers and re-apply data-labels
     */
    public refresh(): void {
        this.extractHeaders();
        if (this.options.autoLabels) {
            this.addDataLabels();
        }
    }

    /**
     * Get current mode
     */
    public getMode(): "stacked" | "normal" {
        return this.currentMode;
    }

    /**
     * Check if table is in stacked mode
     */
    public isStacked(): boolean {
        return this.currentMode === "stacked";
    }

    /**
     * Update breakpoint
     */
    public setBreakpoint(breakpoint: number): void {
        this.options.breakpoint = breakpoint;
        this.checkMode();
    }

    /**
     * Destroy the manager
     */
    public destroy(): void {
        window.removeEventListener("resize", this.handleResize);
        this.container?.removeEventListener("scroll", this.handleScroll);

        if (this.table) {
            this.table.classList.remove(this.options.stackedClass);
        }
    }

    // ========================================================================
    // Static Factory
    // ========================================================================

    /**
     * Initialize all responsive tables with data-ss="table-responsive"
     */
    public static initTables(): ResponsiveTableManager[] {
        const managers: ResponsiveTableManager[] = [];
        const tables = document.querySelectorAll<HTMLElement>(
            '[data-ss="table-responsive"]',
        );

        tables.forEach((el) => {
            const breakpoint = parseInt(
                el.dataset.ssTableBreakpoint || "768",
                10,
            );
            const autoLabels = el.dataset.ssTableAutoLabels !== "false";
            const showIndicator = el.dataset.ssTableScrollIndicator === "true";

            managers.push(
                new ResponsiveTableManager(el, {
                    breakpoint,
                    autoLabels,
                    showScrollIndicator: showIndicator,
                }),
            );
        });

        return managers;
    }
}

export default ResponsiveTableManager;
