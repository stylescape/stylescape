// ============================================================================
// Stylescape | Tooltip
// ============================================================================
// Accessible tooltip with positioning and various trigger modes.
// Supports data-ss-tooltip attributes for declarative configuration.
// ============================================================================

/**
 * Tooltip positioning options
 */
export type TooltipPosition = "top" | "bottom" | "left" | "right" | "auto";

/**
 * Tooltip trigger modes
 */
export type TooltipTrigger = "hover" | "focus" | "click" | "manual";

/**
 * Configuration options for Tooltip
 */
export interface TooltipOptions {
    /** Tooltip content (HTML supported) */
    content?: string;
    /** Position relative to trigger */
    position?: TooltipPosition;
    /** Trigger mode */
    trigger?: TooltipTrigger | TooltipTrigger[];
    /** Show delay in milliseconds */
    showDelay?: number;
    /** Hide delay in milliseconds */
    hideDelay?: number;
    /** Animation duration */
    animationDuration?: number;
    /** Offset from trigger element */
    offset?: number;
    /** CSS class for tooltip */
    tooltipClass?: string;
    /** Max width for tooltip */
    maxWidth?: number;
    /** Allow HTML content */
    allowHTML?: boolean;
    /** Interactive tooltip (don't close on tooltip hover) */
    interactive?: boolean;
    /** Arrow/pointer */
    arrow?: boolean;
    /** Z-index for tooltip */
    zIndex?: number;
}

/**
 * Accessible tooltip with smart positioning.
 *
 * @example JavaScript
 * ```typescript
 * const tooltip = new Tooltip("#helpIcon", {
 *     content: "Click here for more info",
 *     position: "top",
 *     trigger: ["hover", "focus"]
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <button data-ss="tooltip"
 *         data-ss-tooltip-content="Helpful information"
 *         data-ss-tooltip-position="top">
 *     ?
 * </button>
 *
 * <!-- Or with title attribute -->
 * <abbr data-ss="tooltip" title="Hypertext Markup Language">HTML</abbr>
 * ```
 */
export class Tooltip {
    private triggerElement: HTMLElement | null;
    private tooltipElement: HTMLElement | null = null;
    private arrowElement: HTMLElement | null = null;
    private options: Required<TooltipOptions>;
    private showTimeout: ReturnType<typeof setTimeout> | null = null;
    private hideTimeout: ReturnType<typeof setTimeout> | null = null;
    private isVisible: boolean = false;

    constructor(
        selectorOrElement: string | HTMLElement,
        options: TooltipOptions = {},
    ) {
        this.triggerElement =
            typeof selectorOrElement === "string"
                ? document.querySelector<HTMLElement>(selectorOrElement)
                : selectorOrElement;

        const triggers = options.trigger
            ? Array.isArray(options.trigger)
                ? options.trigger
                : [options.trigger]
            : ["hover", "focus"];

        this.options = {
            content:
                options.content ??
                this.triggerElement?.getAttribute("title") ??
                "",
            position: options.position ?? "top",
            trigger: triggers as TooltipTrigger[],
            showDelay: options.showDelay ?? 200,
            hideDelay: options.hideDelay ?? 100,
            animationDuration: options.animationDuration ?? 150,
            offset: options.offset ?? 8,
            tooltipClass: options.tooltipClass ?? "ss-tooltip",
            maxWidth: options.maxWidth ?? 250,
            allowHTML: options.allowHTML ?? false,
            interactive: options.interactive ?? false,
            arrow: options.arrow ?? true,
            zIndex: options.zIndex ?? 9999,
        };

        if (!this.triggerElement) {
            console.warn("[Stylescape] Tooltip trigger element not found");
            return;
        }

        // Remove native title to prevent browser tooltip
        if (this.triggerElement.hasAttribute("title")) {
            this.triggerElement.removeAttribute("title");
        }

        this.init();
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Show the tooltip
     */
    public show(): void {
        if (!this.triggerElement) return;

        this.clearTimeouts();

        this.showTimeout = setTimeout(() => {
            this.createTooltip();
            this.position();
            this.tooltipElement?.classList.add(
                `${this.options.tooltipClass}--visible`,
            );
            this.isVisible = true;
        }, this.options.showDelay);
    }

    /**
     * Hide the tooltip
     */
    public hide(): void {
        this.clearTimeouts();

        this.hideTimeout = setTimeout(() => {
            this.tooltipElement?.classList.remove(
                `${this.options.tooltipClass}--visible`,
            );

            setTimeout(() => {
                this.destroyTooltip();
                this.isVisible = false;
            }, this.options.animationDuration);
        }, this.options.hideDelay);
    }

    /**
     * Toggle tooltip visibility
     */
    public toggle(): void {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Update tooltip content
     */
    public setContent(content: string): void {
        this.options.content = content;
        if (this.tooltipElement) {
            const contentEl = this.tooltipElement.querySelector(
                `.${this.options.tooltipClass}__content`,
            );
            if (contentEl) {
                if (this.options.allowHTML) {
                    contentEl.innerHTML = content;
                } else {
                    contentEl.textContent = content;
                }
            }
        }
    }

    /**
     * Update tooltip position
     */
    public setPosition(position: TooltipPosition): void {
        this.options.position = position;
        if (this.tooltipElement) {
            this.position();
        }
    }

    /**
     * Check if tooltip is visible
     */
    public get visible(): boolean {
        return this.isVisible;
    }

    /**
     * Destroy the tooltip
     */
    public destroy(): void {
        this.clearTimeouts();
        this.destroyTooltip();
        this.removeEventListeners();
        this.triggerElement = null;
    }

    // ========================================================================
    // Static Factory
    // ========================================================================

    /**
     * Initialize all tooltips with data-ss="tooltip"
     */
    public static initTooltips(): Tooltip[] {
        const tooltips: Tooltip[] = [];

        document
            .querySelectorAll<HTMLElement>('[data-ss="tooltip"]')
            .forEach((el) => {
                const content =
                    el.dataset.ssTooltipContent ||
                    el.getAttribute("title") ||
                    "";
                const position =
                    (el.dataset.ssTooltipPosition as TooltipPosition) || "top";
                const trigger = (el.dataset.ssTooltipTrigger?.split(
                    ",",
                ) as TooltipTrigger[]) || ["hover", "focus"];

                tooltips.push(
                    new Tooltip(el, {
                        content,
                        position,
                        trigger,
                    }),
                );
            });

        return tooltips;
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private init(): void {
        if (!this.triggerElement) return;

        // Set up ARIA
        const id = `tooltip-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        this.triggerElement.setAttribute("aria-describedby", id);

        // Add event listeners based on trigger
        const triggers = this.options.trigger as TooltipTrigger[];

        if (triggers.includes("hover")) {
            this.triggerElement.addEventListener(
                "mouseenter",
                this.handleMouseEnter,
            );
            this.triggerElement.addEventListener(
                "mouseleave",
                this.handleMouseLeave,
            );
        }

        if (triggers.includes("focus")) {
            this.triggerElement.addEventListener("focus", this.handleFocus);
            this.triggerElement.addEventListener("blur", this.handleBlur);
        }

        if (triggers.includes("click")) {
            this.triggerElement.addEventListener("click", this.handleClick);
        }
    }

    private removeEventListeners(): void {
        if (!this.triggerElement) return;

        this.triggerElement.removeEventListener(
            "mouseenter",
            this.handleMouseEnter,
        );
        this.triggerElement.removeEventListener(
            "mouseleave",
            this.handleMouseLeave,
        );
        this.triggerElement.removeEventListener("focus", this.handleFocus);
        this.triggerElement.removeEventListener("blur", this.handleBlur);
        this.triggerElement.removeEventListener("click", this.handleClick);
    }

    private createTooltip(): void {
        if (this.tooltipElement) return;

        const tooltip = document.createElement("div");
        tooltip.className = this.options.tooltipClass;
        tooltip.setAttribute("role", "tooltip");
        tooltip.setAttribute(
            "id",
            this.triggerElement?.getAttribute("aria-describedby") || "",
        );
        tooltip.style.zIndex = String(this.options.zIndex);
        tooltip.style.maxWidth = `${this.options.maxWidth}px`;

        // Content
        const content = document.createElement("div");
        content.className = `${this.options.tooltipClass}__content`;

        if (this.options.allowHTML) {
            content.innerHTML = this.options.content;
        } else {
            content.textContent = this.options.content;
        }

        tooltip.appendChild(content);

        // Arrow
        if (this.options.arrow) {
            this.arrowElement = document.createElement("div");
            this.arrowElement.className = `${this.options.tooltipClass}__arrow`;
            tooltip.appendChild(this.arrowElement);
        }

        // Interactive mode
        if (this.options.interactive) {
            tooltip.addEventListener("mouseenter", this.clearTimeouts);
            tooltip.addEventListener("mouseleave", () => this.hide());
        }

        document.body.appendChild(tooltip);
        this.tooltipElement = tooltip;
    }

    private destroyTooltip(): void {
        this.tooltipElement?.remove();
        this.tooltipElement = null;
        this.arrowElement = null;
    }

    private position(): void {
        if (!this.triggerElement || !this.tooltipElement) return;

        const triggerRect = this.triggerElement.getBoundingClientRect();
        const tooltipRect = this.tooltipElement.getBoundingClientRect();
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        let position = this.options.position;

        // Auto-position
        if (position === "auto") {
            position = this.calculateBestPosition(triggerRect, tooltipRect);
        }

        let top: number;
        let left: number;

        switch (position) {
            case "top":
                top =
                    triggerRect.top +
                    scrollY -
                    tooltipRect.height -
                    this.options.offset;
                left =
                    triggerRect.left +
                    scrollX +
                    (triggerRect.width - tooltipRect.width) / 2;
                break;
            case "bottom":
                top = triggerRect.bottom + scrollY + this.options.offset;
                left =
                    triggerRect.left +
                    scrollX +
                    (triggerRect.width - tooltipRect.width) / 2;
                break;
            case "left":
                top =
                    triggerRect.top +
                    scrollY +
                    (triggerRect.height - tooltipRect.height) / 2;
                left =
                    triggerRect.left +
                    scrollX -
                    tooltipRect.width -
                    this.options.offset;
                break;
            case "right":
                top =
                    triggerRect.top +
                    scrollY +
                    (triggerRect.height - tooltipRect.height) / 2;
                left = triggerRect.right + scrollX + this.options.offset;
                break;
            default:
                top =
                    triggerRect.top +
                    scrollY -
                    tooltipRect.height -
                    this.options.offset;
                left =
                    triggerRect.left +
                    scrollX +
                    (triggerRect.width - tooltipRect.width) / 2;
        }

        // Keep within viewport
        left = Math.max(
            8,
            Math.min(left, window.innerWidth - tooltipRect.width - 8),
        );

        this.tooltipElement.style.top = `${top}px`;
        this.tooltipElement.style.left = `${left}px`;
        this.tooltipElement.dataset.position = position;

        // Position arrow
        if (this.arrowElement) {
            this.arrowElement.dataset.position = position;
        }
    }

    private calculateBestPosition(
        triggerRect: DOMRect,
        tooltipRect: DOMRect,
    ): TooltipPosition {
        const space = {
            top: triggerRect.top,
            bottom: window.innerHeight - triggerRect.bottom,
            left: triggerRect.left,
            right: window.innerWidth - triggerRect.right,
        };

        const height = tooltipRect.height + this.options.offset;
        const width = tooltipRect.width + this.options.offset;

        if (space.top >= height) return "top";
        if (space.bottom >= height) return "bottom";
        if (space.right >= width) return "right";
        if (space.left >= width) return "left";

        return "top";
    }

    private clearTimeouts = (): void => {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    };

    // ========================================================================
    // Event Handlers
    // ========================================================================

    private handleMouseEnter = (): void => {
        this.show();
    };

    private handleMouseLeave = (): void => {
        this.hide();
    };

    private handleFocus = (): void => {
        this.show();
    };

    private handleBlur = (): void => {
        this.hide();
    };

    private handleClick = (event: Event): void => {
        event.preventDefault();
        this.toggle();
    };
}

export default Tooltip;
