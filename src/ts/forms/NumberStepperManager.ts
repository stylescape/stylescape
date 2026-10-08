// ============================================================================
// Stylescape | Number Stepper Manager
// ============================================================================
// Wires the decrement/increment buttons of a `.ss-c-stepper` to its number
// input. The input itself keeps working without JavaScript (typing, arrow
// keys); the buttons step it and are disabled at min/max.
// ============================================================================

/**
 * Configuration options for NumberStepperManager
 */
export interface NumberStepperOptions {
    /** Selector for the decrement button */
    downSelector?: string;
    /** Selector for the increment button */
    upSelector?: string;
    /** Callback after a button changed the value */
    onStep?: (value: number, input: HTMLInputElement) => void;
}

/**
 * Stepper buttons for a number input.
 *
 * @example JavaScript
 * ```typescript
 * new NumberStepperManager(".ss-c-stepper", {
 *     onStep: (value) => console.log(value),
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <div class="ss-c-stepper" data-ss="stepper">
 *     <button type="button" class="ss-c-stepper__button"
 *             data-ss-stepper="down" aria-label="Decrease guests">−</button>
 *     <input id="guests" type="number" class="ss-c-stepper__input"
 *            min="1" max="12" value="2">
 *     <button type="button" class="ss-c-stepper__button"
 *             data-ss-stepper="up" aria-label="Increase guests">+</button>
 * </div>
 * ```
 */
export class NumberStepperManager {
    private element: HTMLElement | null;
    private input: HTMLInputElement | null = null;
    private down: HTMLButtonElement | null = null;
    private up: HTMLButtonElement | null = null;
    private options: Required<NumberStepperOptions>;

    constructor(
        selectorOrElement: string | HTMLElement,
        options: NumberStepperOptions = {},
    ) {
        this.element =
            typeof selectorOrElement === "string"
                ? document.querySelector<HTMLElement>(selectorOrElement)
                : selectorOrElement;

        this.options = {
            downSelector: options.downSelector ?? '[data-ss-stepper="down"]',
            upSelector: options.upSelector ?? '[data-ss-stepper="up"]',
            onStep: options.onStep ?? (() => {}),
        };

        if (!this.element) {
            console.warn(
                "[Stylescape] NumberStepperManager element not found",
            );
            return;
        }

        this.init();
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Step the value down (negative) or up (positive) by `count` steps.
     */
    public step(count: number): void {
        const input = this.input;
        if (!input || input.disabled || input.readOnly || count === 0) return;

        const before = input.value;
        try {
            if (count > 0) input.stepUp(count);
            else input.stepDown(-count);
        } catch {
            // stepUp/stepDown throw on a non-numeric value; start from min
            // (or 0) instead, as a spin button would.
            input.value = input.min !== "" ? input.min : "0";
        }
        if (input.value === before) return;

        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        this.options.onStep(input.valueAsNumber, input);
        this.sync();
    }

    /**
     * Destroy the manager
     */
    public destroy(): void {
        this.down?.removeEventListener("click", this.handleDown);
        this.up?.removeEventListener("click", this.handleUp);
        this.input?.removeEventListener("input", this.sync);
        this.input?.removeEventListener("change", this.sync);
        this.element = null;
        this.input = null;
        this.down = null;
        this.up = null;
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private init(): void {
        if (!this.element) return;

        this.input =
            this.element instanceof HTMLInputElement
                ? this.element
                : this.element.querySelector<HTMLInputElement>(
                      'input[type="number"]',
                  );
        if (!this.input) {
            console.warn("[Stylescape] NumberStepperManager: no number input");
            return;
        }

        this.down = this.element.querySelector<HTMLButtonElement>(
            this.options.downSelector,
        );
        this.up = this.element.querySelector<HTMLButtonElement>(
            this.options.upSelector,
        );

        [this.down, this.up].forEach((button) => {
            if (!button) return;
            if (!button.hasAttribute("type")) button.type = "button";
            if (this.input?.id) {
                button.setAttribute("aria-controls", this.input.id);
            }
        });

        this.down?.addEventListener("click", this.handleDown);
        this.up?.addEventListener("click", this.handleUp);
        this.input.addEventListener("input", this.sync);
        this.input.addEventListener("change", this.sync);
        this.sync();
    }

    private handleDown = (): void => this.step(-1);

    private handleUp = (): void => this.step(1);

    /** Mark a button unavailable when its direction is out of range. */
    private sync = (): void => {
        const input = this.input;
        if (!input) return;

        const value = input.valueAsNumber;
        const min = input.min === "" ? -Infinity : Number(input.min);
        const max = input.max === "" ? Infinity : Number(input.max);
        const off = input.disabled || input.readOnly;

        this.setLimit(
            this.down,
            off || (!Number.isNaN(value) && value <= min),
        );
        this.setLimit(this.up, off || (!Number.isNaN(value) && value >= max));
    };

    // aria-disabled rather than `disabled`: a disabled button would drop
    // keyboard focus the moment the limit is reached.
    private setLimit(
        button: HTMLButtonElement | null,
        atLimit: boolean,
    ): void {
        if (!button) return;
        if (atLimit) button.setAttribute("aria-disabled", "true");
        else button.removeAttribute("aria-disabled");
    }
}

export default NumberStepperManager;
