// ============================================================================
// Stylescape | Range Output Manager
// ============================================================================
// Keeps `<output for="…">` readouts in sync with the input they name
// (range, number, colour, …), and sets `--ss-range-progress` on range
// inputs so `.ss-c-range` can fill the track up to the thumb.
// ============================================================================

/**
 * Configuration options for RangeOutputManager
 */
export interface RangeOutputOptions {
    /** Formats the readout text; defaults to the data-ss-output-* attributes */
    format?: (value: string, input: HTMLInputElement) => string;
    /** Callback after an output is updated */
    onUpdate?: (output: HTMLOutputElement, input: HTMLInputElement) => void;
}

interface Binding {
    input: HTMLInputElement;
    outputs: HTMLOutputElement[];
}

/**
 * Binds every `<output for>` inside a root element to its input.
 *
 * The readout text comes from the input's value, shaped by optional data
 * attributes on the output:
 * - `data-ss-output-decimals="1"`: fixed number of decimals
 * - `data-ss-output-prefix` / `data-ss-output-suffix`: text around it
 * - `data-ss-output-locale="nl"`: format the number for a locale
 *
 * When `for` lists several ids, the output follows the first input.
 * Form resets update the readouts too.
 *
 * @example JavaScript
 * ```typescript
 * const readouts = new RangeOutputManager(document.querySelector("form")!, {
 *     format: (value) => `${value} px`,
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <div class="ss-c-range-field" data-ss="range-output">
 *     <label for="size" class="ss-c-range-field__label">Size</label>
 *     <output for="size" class="ss-c-range-field__output"
 *             data-ss-output-suffix=" px">24</output>
 *     <input id="size" type="range" class="ss-c-range" min="8" max="64" value="24">
 * </div>
 * ```
 */
export class RangeOutputManager {
    private root: HTMLElement | Document | null;
    private options: RangeOutputOptions;
    private bindings: Binding[] = [];
    private forms = new Set<HTMLFormElement>();

    constructor(
        root: string | HTMLElement | Document = document,
        options: RangeOutputOptions = {},
    ) {
        this.root =
            typeof root === "string"
                ? document.querySelector<HTMLElement>(root)
                : root;
        this.options = options;

        if (!this.root) {
            console.warn("[Stylescape] RangeOutputManager root not found");
            return;
        }

        this.init();
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Re-read every bound input and refresh its outputs.
     */
    public update(): void {
        this.bindings.forEach((binding) => this.render(binding));
    }

    /**
     * Remove all listeners.
     */
    public destroy(): void {
        this.bindings.forEach(({ input }) => {
            input.removeEventListener("input", this.handleInput);
            input.removeEventListener("change", this.handleInput);
        });
        this.forms.forEach((form) =>
            form.removeEventListener("reset", this.handleReset),
        );
        this.bindings = [];
        this.forms.clear();
        this.root = null;
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private init(): void {
        if (!this.root) return;

        const outputs = Array.from(
            this.root.querySelectorAll<HTMLOutputElement>("output[for]"),
        );
        // The root itself may be the output (data-ss="range-output" on it).
        if (
            this.root instanceof HTMLOutputElement &&
            this.root.htmlFor.length
        ) {
            outputs.unshift(this.root);
        }

        outputs.forEach((output) => {
            const input = this.findInput(output);
            if (!input) return;

            let binding = this.bindings.find((b) => b.input === input);
            if (!binding) {
                binding = { input, outputs: [] };
                this.bindings.push(binding);
                input.addEventListener("input", this.handleInput);
                input.addEventListener("change", this.handleInput);
                if (input.form && !this.forms.has(input.form)) {
                    this.forms.add(input.form);
                    input.form.addEventListener("reset", this.handleReset);
                }
            }
            binding.outputs.push(output);
        });

        this.update();
    }

    private findInput(output: HTMLOutputElement): HTMLInputElement | null {
        const doc = output.ownerDocument;
        for (const id of Array.from(output.htmlFor)) {
            const el = doc.getElementById(id);
            if (el instanceof HTMLInputElement) return el;
        }
        return null;
    }

    private handleInput = (event: Event): void => {
        const binding = this.bindings.find((b) => b.input === event.target);
        if (binding) this.render(binding);
    };

    // `reset` fires before the fields are restored, so read them afterwards.
    private handleReset = (): void => {
        setTimeout(() => this.update(), 0);
    };

    private render(binding: Binding): void {
        const { input, outputs } = binding;

        if (input.type === "range") {
            input.style.setProperty(
                "--ss-range-progress",
                `${this.progress(input)}%`,
            );
        }

        outputs.forEach((output) => {
            output.value = this.options.format
                ? this.options.format(input.value, input)
                : this.formatFromAttributes(input.value, output);
            this.options.onUpdate?.(output, input);
        });
    }

    private progress(input: HTMLInputElement): number {
        const min = input.min === "" ? 0 : Number(input.min);
        const max = input.max === "" ? 100 : Number(input.max);
        const value = Number(input.value);
        if (!(max > min) || Number.isNaN(value)) return 0;
        return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    }

    private formatFromAttributes(
        value: string,
        output: HTMLOutputElement,
    ): string {
        const {
            ssOutputDecimals,
            ssOutputLocale,
            ssOutputPrefix,
            ssOutputSuffix,
        } = output.dataset;
        let text = value;
        const number = Number(value);

        if (value !== "" && !Number.isNaN(number)) {
            if (
                ssOutputLocale !== undefined ||
                ssOutputDecimals !== undefined
            ) {
                const digits =
                    ssOutputDecimals !== undefined
                        ? Number(ssOutputDecimals)
                        : undefined;
                text = new Intl.NumberFormat(ssOutputLocale || undefined, {
                    minimumFractionDigits: digits,
                    maximumFractionDigits: digits,
                }).format(number);
            }
        }

        return `${ssOutputPrefix ?? ""}${text}${ssOutputSuffix ?? ""}`;
    }
}

export default RangeOutputManager;
