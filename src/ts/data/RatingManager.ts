// ============================================================================
// Stylescape | Rating Manager
// ============================================================================
// Manages star rating UI components with accessibility support.
// Supports data-ss-rating attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for RatingManager
 */
export interface RatingManagerOptions {
    /** Maximum rating value */
    max?: number;
    /** Initial rating value */
    value?: number;
    /** Whether rating is read-only */
    readOnly?: boolean;
    /** Allow half ratings */
    half?: boolean;
    /** Selector for star elements within container */
    starSelector?: string;
    /** CSS class for active/filled stars */
    activeClass?: string;
    /** CSS class for half-filled stars */
    halfClass?: string;
    /** CSS class for hover state */
    hoverClass?: string;
    /** Callback when rating changes */
    onChange?: (value: number) => void;
}

/**
 * Star rating manager with keyboard accessibility.
 *
 * @example JavaScript
 * ```typescript
 * const rating = new RatingManager("#rating", {
 *     max: 5,
 *     value: 3,
 *     onChange: (value) => console.log(`Rated: ${value}`)
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <div data-ss="rating"
 *      data-ss-rating-max="5"
 *      data-ss-rating-value="0"
 *      data-ss-rating-half="true">
 *     <span class="star" data-value="1">★</span>
 *     <span class="star" data-value="2">★</span>
 *     <span class="star" data-value="3">★</span>
 *     <span class="star" data-value="4">★</span>
 *     <span class="star" data-value="5">★</span>
 * </div>
 * ```
 */
export class RatingManager {
    private container: HTMLElement | null;
    private stars: HTMLElement[];
    private options: Required<RatingManagerOptions>;
    private currentValue: number;
    private hoverValue: number | null = null;

    constructor(
        selectorOrElement: string | HTMLElement,
        options: RatingManagerOptions = {},
    ) {
        this.container =
            typeof selectorOrElement === "string"
                ? document.querySelector<HTMLElement>(selectorOrElement)
                : selectorOrElement;

        this.options = {
            max: options.max ?? 5,
            value: options.value ?? 0,
            readOnly: options.readOnly ?? false,
            half: options.half ?? false,
            starSelector: options.starSelector ?? ".star, [data-value]",
            activeClass: options.activeClass ?? "rating__star--active",
            halfClass: options.halfClass ?? "rating__star--half",
            hoverClass: options.hoverClass ?? "rating__star--hover",
            onChange: options.onChange ?? (() => {}),
        };

        this.currentValue = this.options.value;
        this.stars = [];

        if (!this.container) {
            console.warn("[Stylescape] RatingManager container not found");
            return;
        }

        this.init();
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Get current rating value
     */
    public getValue(): number {
        return this.currentValue;
    }

    /**
     * Set rating value
     */
    public setValue(value: number): void {
        const clamped = Math.min(Math.max(value, 0), this.options.max);
        this.currentValue = this.options.half ? clamped : Math.round(clamped);
        this.updateDisplay();
        this.options.onChange(this.currentValue);
    }

    /**
     * Reset rating to 0
     */
    public reset(): void {
        this.setValue(0);
    }

    /**
     * Set read-only state
     */
    public setReadOnly(readOnly: boolean): void {
        this.options.readOnly = readOnly;
        this.container?.classList.toggle("rating--readonly", readOnly);

        if (readOnly) {
            this.container?.setAttribute("aria-readonly", "true");
        } else {
            this.container?.removeAttribute("aria-readonly");
        }
    }

    /**
     * Destroy the rating manager
     */
    public destroy(): void {
        this.stars.forEach((star) => {
            star.removeEventListener("click", this.handleClick);
            star.removeEventListener("mouseenter", this.handleMouseEnter);
            star.removeEventListener("mouseleave", this.handleMouseLeave);
        });
        this.container?.removeEventListener("keydown", this.handleKeyDown);
        this.container = null;
        this.stars = [];
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private init(): void {
        if (!this.container) return;

        // Get or create stars
        this.stars = Array.from(
            this.container.querySelectorAll<HTMLElement>(
                this.options.starSelector,
            ),
        );

        // If no stars found, create them
        if (this.stars.length === 0) {
            this.createStars();
        }

        // Set ARIA attributes
        this.container.setAttribute("role", "slider");
        this.container.setAttribute("aria-valuemin", "0");
        this.container.setAttribute("aria-valuemax", String(this.options.max));
        this.container.setAttribute(
            "aria-valuenow",
            String(this.currentValue),
        );
        this.container.setAttribute("tabindex", "0");

        // Add event listeners
        if (!this.options.readOnly) {
            this.stars.forEach((star, index) => {
                star.addEventListener("click", this.handleClick);
                star.addEventListener("mouseenter", this.handleMouseEnter);
                star.addEventListener("mouseleave", this.handleMouseLeave);

                // Set data-value if not present
                if (!star.hasAttribute("data-value")) {
                    star.setAttribute("data-value", String(index + 1));
                }
            });

            this.container.addEventListener("keydown", this.handleKeyDown);
            this.container.addEventListener("mouseleave", () => {
                this.hoverValue = null;
                this.updateDisplay();
            });
        }

        this.updateDisplay();
    }

    private createStars(): void {
        if (!this.container) return;

        for (let i = 1; i <= this.options.max; i++) {
            const star = document.createElement("span");
            star.className = "rating__star";
            star.setAttribute("data-value", String(i));
            star.textContent = "★";
            this.container.appendChild(star);
            this.stars.push(star);
        }
    }

    private handleClick = (e: Event): void => {
        if (this.options.readOnly) return;

        const star = e.currentTarget as HTMLElement;
        const value = this.getStarValue(star, e as MouseEvent);
        this.setValue(value);
    };

    private handleMouseEnter = (e: Event): void => {
        if (this.options.readOnly) return;

        const star = e.currentTarget as HTMLElement;
        this.hoverValue = this.getStarValue(star, e as MouseEvent);
        this.updateDisplay();
    };

    private handleMouseLeave = (): void => {
        // Handled by container mouseleave
    };

    private handleKeyDown = (e: KeyboardEvent): void => {
        if (this.options.readOnly) return;

        const step = this.options.half ? 0.5 : 1;

        switch (e.key) {
            case "ArrowRight":
            case "ArrowUp":
                e.preventDefault();
                this.setValue(
                    Math.min(this.currentValue + step, this.options.max),
                );
                break;
            case "ArrowLeft":
            case "ArrowDown":
                e.preventDefault();
                this.setValue(Math.max(this.currentValue - step, 0));
                break;
            case "Home":
                e.preventDefault();
                this.setValue(0);
                break;
            case "End":
                e.preventDefault();
                this.setValue(this.options.max);
                break;
        }
    };

    private getStarValue(star: HTMLElement, event: MouseEvent): number {
        const baseValue = parseInt(star.getAttribute("data-value") || "0", 10);

        if (this.options.half) {
            const rect = star.getBoundingClientRect();
            const isHalf = event.clientX < rect.left + rect.width / 2;
            return isHalf ? baseValue - 0.5 : baseValue;
        }

        return baseValue;
    }

    private updateDisplay(): void {
        const displayValue = this.hoverValue ?? this.currentValue;

        this.stars.forEach((star) => {
            const value = parseInt(star.getAttribute("data-value") || "0", 10);
            const isActive = value <= displayValue;
            const isHalf = this.options.half && value - 0.5 === displayValue;
            const isHover = this.hoverValue !== null;

            star.classList.toggle(
                this.options.activeClass,
                isActive && !isHalf,
            );
            star.classList.toggle(this.options.halfClass, isHalf);
            star.classList.toggle(
                this.options.hoverClass,
                isHover && value <= displayValue,
            );
        });

        // Update ARIA
        this.container?.setAttribute(
            "aria-valuenow",
            String(this.currentValue),
        );
    }
}

export default RatingManager;
