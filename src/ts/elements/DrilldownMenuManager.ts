// ============================================================================
// Stylescape | Drilldown Menu Manager
// ============================================================================
// Manages a Foundation-style drilldown navigation menu with multi-level
// support. Allows drilling down through nested menus with animated transitions.
// Supports data-ss-drilldown attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for DrilldownMenuManager
 */
export interface DrilldownMenuOptions {
    /** Animation duration in milliseconds */
    animationDuration?: number;
    /** Auto-close submenus when clicking outside */
    closeOnOutsideClick?: boolean;
    /** Show back button in submenus */
    showBackButton?: boolean;
    /** Back button text */
    backButtonText?: string;
    /** CSS class for the active level */
    activeLevelClass?: string;
    /** Callback when navigating to a submenu */
    onDrillDown?: (level: number, menu: HTMLElement) => void;
    /** Callback when navigating back */
    onDrillUp?: (level: number, menu: HTMLElement) => void;
    /** Auto-calculate height based on content */
    autoHeight?: boolean;
}

interface DrilldownLevel {
    element: HTMLElement;
    depth: number;
    parent: HTMLElement | null;
}

/**
 * Drilldown navigation menu with multi-level support.
 *
 * @example JavaScript
 * ```typescript
 * const drilldown = new DrilldownMenuManager(".drilldown", {
 *     animationDuration: 300,
 *     showBackButton: true,
 *     backButtonText: "← Back"
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <nav data-ss="drilldown" class="drilldown">
 *     <ul data-ss-drilldown-menu>
 *         <li>
 *             <a href="#">Level 1 Item</a>
 *             <ul data-ss-drilldown-submenu>
 *                 <li data-ss-drilldown-back>Back</li>
 *                 <li><a href="#">Level 2 Item</a></li>
 *             </ul>
 *         </li>
 *     </ul>
 * </nav>
 * ```
 */
export class DrilldownMenuManager {
    private container: HTMLElement | null;
    private levels: DrilldownLevel[] = [];
    private currentDepth: number = 0;
    private history: HTMLElement[] = [];
    private options: Required<DrilldownMenuOptions>;

    constructor(
        selectorOrElement: string | HTMLElement,
        options: DrilldownMenuOptions = {},
    ) {
        this.container =
            typeof selectorOrElement === "string"
                ? document.querySelector<HTMLElement>(selectorOrElement)
                : selectorOrElement;

        this.options = {
            animationDuration: options.animationDuration ?? 300,
            closeOnOutsideClick: options.closeOnOutsideClick ?? true,
            showBackButton: options.showBackButton ?? true,
            backButtonText: options.backButtonText ?? "← Back",
            activeLevelClass:
                options.activeLevelClass ?? "drilldown__level--active",
            onDrillDown: options.onDrillDown ?? (() => {}),
            onDrillUp: options.onDrillUp ?? (() => {}),
            autoHeight: options.autoHeight ?? true,
        };

        if (!this.container) {
            return;
        }

        this.init();
    }

    // ========================================================================
    // Initialization
    // ========================================================================

    private init(): void {
        if (!this.container) return;

        // Find all menus and submenus
        this.discoverLevels();

        // Add back buttons if enabled
        if (this.options.showBackButton) {
            this.addBackButtons();
        }

        // Setup event listeners
        this.setupEventListeners();

        // Set initial state
        this.showLevel(0);

        // Outside click handler
        if (this.options.closeOnOutsideClick) {
            document.addEventListener("click", this.handleOutsideClick);
        }
    }

    private discoverLevels(): void {
        if (!this.container) return;

        // Find main menu
        const mainMenu = this.container.querySelector<HTMLElement>(
            "[data-ss-drilldown-menu], .drilldown__menu",
        );

        if (mainMenu) {
            this.levels.push({
                element: mainMenu,
                depth: 0,
                parent: null,
            });
        }

        // Find all submenus
        const submenus = this.container.querySelectorAll<HTMLElement>(
            "[data-ss-drilldown-submenu], .drilldown__submenu",
        );

        submenus.forEach((submenu, _index) => {
            const parentItem = submenu.closest("li");
            const parentMenu = parentItem?.closest("ul");
            const parentLevel = this.levels.find(
                (l) => l.element === parentMenu,
            );

            this.levels.push({
                element: submenu,
                depth: (parentLevel?.depth ?? 0) + 1,
                parent: parentMenu || null,
            });

            // Add trigger to parent item
            if (parentItem) {
                const trigger =
                    parentItem.querySelector<HTMLElement>("a, button");
                if (trigger) {
                    trigger.setAttribute("data-ss-drilldown-trigger", "");
                    trigger.setAttribute(
                        "data-ss-drilldown-target",
                        String(this.levels.length - 1),
                    );
                }
            }
        });
    }

    private addBackButtons(): void {
        this.levels.forEach((level) => {
            if (
                level.depth > 0 &&
                !level.element.querySelector("[data-ss-drilldown-back]")
            ) {
                const backItem = document.createElement("li");
                backItem.setAttribute("data-ss-drilldown-back", "");
                backItem.classList.add("drilldown__back");

                const backButton = document.createElement("button");
                backButton.type = "button";
                backButton.textContent = this.options.backButtonText;
                backButton.classList.add("drilldown__back-button");

                backItem.appendChild(backButton);
                level.element.insertBefore(backItem, level.element.firstChild);
            }
        });
    }

    private setupEventListeners(): void {
        if (!this.container) return;

        // Forward navigation triggers
        this.container.addEventListener("click", (e) => {
            const trigger = (e.target as HTMLElement).closest<HTMLElement>(
                "[data-ss-drilldown-trigger]",
            );

            if (trigger) {
                e.preventDefault();
                const targetIndex = parseInt(
                    trigger.dataset.ssDrilldownTarget || "0",
                    10,
                );
                this.drillDown(targetIndex);
            }

            // Back button
            const backBtn = (e.target as HTMLElement).closest<HTMLElement>(
                "[data-ss-drilldown-back], .drilldown__back",
            );

            if (backBtn) {
                e.preventDefault();
                this.drillUp();
            }
        });

        // Keyboard navigation
        this.container.addEventListener("keydown", this.handleKeydown);
    }

    private handleKeydown = (e: KeyboardEvent): void => {
        if (e.key === "Escape" && this.currentDepth > 0) {
            this.drillUp();
        }

        if (e.key === "ArrowLeft" && this.currentDepth > 0) {
            this.drillUp();
        }

        if (e.key === "ArrowRight") {
            const focused = document.activeElement as HTMLElement;
            const trigger = focused?.closest<HTMLElement>(
                "[data-ss-drilldown-trigger]",
            );
            if (trigger) {
                const targetIndex = parseInt(
                    trigger.dataset.ssDrilldownTarget || "0",
                    10,
                );
                this.drillDown(targetIndex);
            }
        }
    };

    private handleOutsideClick = (e: MouseEvent): void => {
        if (this.container && !this.container.contains(e.target as Node)) {
            this.reset();
        }
    };

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Navigate to a specific submenu level
     */
    public drillDown(levelIndex: number): void {
        const level = this.levels[levelIndex];
        if (!level) return;

        // Store current level in history
        const currentLevel = this.levels.find((l) =>
            l.element.classList.contains(this.options.activeLevelClass),
        );
        if (currentLevel) {
            this.history.push(currentLevel.element);
        }

        // Hide all levels
        this.levels.forEach((l) => {
            l.element.classList.remove(this.options.activeLevelClass);
            l.element.setAttribute("aria-hidden", "true");
        });

        // Show target level
        level.element.classList.add(this.options.activeLevelClass);
        level.element.setAttribute("aria-hidden", "false");
        this.currentDepth = level.depth;

        // Update container height
        if (this.options.autoHeight && this.container) {
            this.container.style.height = `${level.element.scrollHeight}px`;
        }

        // Callback
        this.options.onDrillDown(level.depth, level.element);

        // Focus first item
        const firstFocusable =
            level.element.querySelector<HTMLElement>("a, button");
        firstFocusable?.focus();
    }

    /**
     * Navigate back to the previous level
     */
    public drillUp(): void {
        if (this.history.length === 0) {
            this.showLevel(0);
            return;
        }

        const previousMenu = this.history.pop();
        if (!previousMenu) return;

        // Hide current level
        this.levels.forEach((l) => {
            l.element.classList.remove(this.options.activeLevelClass);
            l.element.setAttribute("aria-hidden", "true");
        });

        // Show previous level
        previousMenu.classList.add(this.options.activeLevelClass);
        previousMenu.setAttribute("aria-hidden", "false");

        const level = this.levels.find((l) => l.element === previousMenu);
        this.currentDepth = level?.depth ?? 0;

        // Update container height
        if (this.options.autoHeight && this.container) {
            this.container.style.height = `${previousMenu.scrollHeight}px`;
        }

        // Callback
        this.options.onDrillUp(this.currentDepth, previousMenu);
    }

    /**
     * Show a specific level by index
     */
    public showLevel(index: number): void {
        if (index < 0 || index >= this.levels.length) return;

        this.levels.forEach((level, i) => {
            if (i === index) {
                level.element.classList.add(this.options.activeLevelClass);
                level.element.setAttribute("aria-hidden", "false");
            } else {
                level.element.classList.remove(this.options.activeLevelClass);
                level.element.setAttribute("aria-hidden", "true");
            }
        });

        this.currentDepth = this.levels[index].depth;
        this.history = [];

        // Update container height
        if (this.options.autoHeight && this.container) {
            this.container.style.height = `${this.levels[index].element.scrollHeight}px`;
        }
    }

    /**
     * Reset to the root level
     */
    public reset(): void {
        this.showLevel(0);
    }

    /**
     * Get the current depth level
     */
    public getCurrentDepth(): number {
        return this.currentDepth;
    }

    /**
     * Destroy the drilldown menu
     */
    public destroy(): void {
        if (this.container) {
            this.container.removeEventListener("keydown", this.handleKeydown);
        }
        document.removeEventListener("click", this.handleOutsideClick);
        this.levels = [];
        this.history = [];
    }

    // ========================================================================
    // Static Factory
    // ========================================================================

    /**
     * Initialize all drilldown menus with data-ss="drilldown"
     */
    public static initDrilldowns(): DrilldownMenuManager[] {
        const managers: DrilldownMenuManager[] = [];
        const drilldowns = document.querySelectorAll<HTMLElement>(
            '[data-ss="drilldown"]',
        );

        drilldowns.forEach((el) => {
            const duration = parseInt(
                el.dataset.ssDrilldownDuration || "300",
                10,
            );
            const backText = el.dataset.ssDrilldownBackText;
            const autoHeight = el.dataset.ssDrilldownAutoHeight !== "false";

            managers.push(
                new DrilldownMenuManager(el, {
                    animationDuration: duration,
                    backButtonText: backText || "← Back",
                    autoHeight,
                }),
            );
        });

        return managers;
    }
}

export default DrilldownMenuManager;
