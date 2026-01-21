// ============================================================================
// Stylescape | Progress Bar Manager
// ============================================================================
// Controls progress bar UI elements with animation support.
// Supports data-ss-progress attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for ProgressBarManager
 */
export interface ProgressBarOptions {
    /** Initial value (0-100) */
    value?: number;
    /** Minimum value */
    min?: number;
    /** Maximum value */
    max?: number;
    /** Whether to animate changes */
    animate?: boolean;
    /** Animation duration in ms */
    animationDuration?: number;
    /** Callback when value changes */
    onChange?: (value: number, percentage: number) => void;
    /** Callback when reaching 100% */
    onComplete?: () => void;
    /** CSS property to animate (width, height, or custom) */
    property?: string;
}

/**
 * Progress bar manager with animation and accessibility support.
 *
 * @example JavaScript
 * ```typescript
 * const progress = new ProgressBarManager("#progress", { animate: true })
 * progress.setProgress(50)
 * progress.increment(10)
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <div data-ss="progress"
 *      data-ss-progress-value="0"
 *      data-ss-progress-animate="true"
 *      data-ss-progress-duration="300">
 *     <div class="progress__bar"></div>
 * </div>
 * ```
 */
export class ProgressBarManager {
    private element: HTMLElement | null;
    private bar: HTMLElement | null;
    private options: Required<ProgressBarOptions>;
    private currentValue: number;

    constructor(
        selectorOrElement: string | HTMLElement,
        options: ProgressBarOptions = {},
    ) {
        this.element =
            typeof selectorOrElement === "string"
                ? document.querySelector<HTMLElement>(selectorOrElement)
                : selectorOrElement;

        this.options = {
            value: options.value ?? 0,
            min: options.min ?? 0,
            max: options.max ?? 100,
            animate: options.animate !== false,
            animationDuration: options.animationDuration ?? 300,
            onChange: options.onChange ?? (() => {}),
            onComplete: options.onComplete ?? (() => {}),
            property: options.property ?? "width",
        };

        this.currentValue = this.options.value;

        // Find bar element (child with class containing 'bar' or the element itself)
        this.bar =
            this.element?.querySelector<HTMLElement>("[class*='bar']") ||
            this.element;

        if (!this.element) {
            console.warn("[Stylescape] ProgressBarManager element not found");
            return;
        }

        this.init();
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Set progress value (0-100 or within min-max range)
     */
    public setProgress(value: number): void {
        const clamped = Math.min(
            Math.max(value, this.options.min),
            this.options.max,
        );
        const percentage = this.calculatePercentage(clamped);

        this.currentValue = clamped;
        this.updateDisplay(percentage);
        this.options.onChange(clamped, percentage);

        if (percentage >= 100) {
            this.options.onComplete();
        }
    }

    /**
     * Get current progress value
     */
    public getProgress(): number {
        return this.currentValue;
    }

    /**
     * Get current percentage (0-100)
     */
    public getPercentage(): number {
        return this.calculatePercentage(this.currentValue);
    }

    /**
     * Increment progress by amount
     */
    public increment(amount: number = 1): void {
        this.setProgress(this.currentValue + amount);
    }

    /**
     * Decrement progress by amount
     */
    public decrement(amount: number = 1): void {
        this.setProgress(this.currentValue - amount);
    }

    /**
     * Reset progress to 0
     */
    public reset(): void {
        this.setProgress(this.options.min);
    }

    /**
     * Set progress to complete (100%)
     */
    public complete(): void {
        this.setProgress(this.options.max);
    }

    /**
     * Set indeterminate state (for unknown progress)
     */
    public setIndeterminate(indeterminate: boolean): void {
        if (!this.element) return;

        this.element.classList.toggle(
            "progress--indeterminate",
            indeterminate,
        );
        this.element.removeAttribute("aria-valuenow");
    }

    /**
     * Destroy the progress bar manager
     */
    public destroy(): void {
        this.element = null;
        this.bar = null;
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private init(): void {
        if (!this.element) return;

        // Set ARIA attributes
        this.element.setAttribute("role", "progressbar");
        this.element.setAttribute("aria-valuemin", String(this.options.min));
        this.element.setAttribute("aria-valuemax", String(this.options.max));

        // Set transition for animation
        if (this.bar && this.options.animate) {
            this.bar.style.transition = `${this.options.property} ${this.options.animationDuration}ms ease`;
        }

        // Set initial value
        this.setProgress(this.currentValue);
    }

    private calculatePercentage(value: number): number {
        const range = this.options.max - this.options.min;
        return ((value - this.options.min) / range) * 100;
    }

    private updateDisplay(percentage: number): void {
        if (!this.bar || !this.element) return;

        // Update visual
        (this.bar.style as unknown as Record<string, string>)[
            this.options.property
        ] = `${percentage}%`;

        // Update ARIA
        this.element.setAttribute("aria-valuenow", String(this.currentValue));

        // Update data attribute for CSS styling
        this.element.setAttribute(
            "data-progress",
            String(Math.round(percentage)),
        );
    }
}

export default ProgressBarManager;
