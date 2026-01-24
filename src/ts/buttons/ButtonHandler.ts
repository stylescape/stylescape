// ============================================================================
// Stylescape | Button Handler
// ============================================================================
// Manages button click events with loading states and ripple effects.
// Supports data-ss-button attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for ButtonHandler
 */
export interface ButtonHandlerOptions {
    /** Show loading state on click */
    loading?: boolean;
    /** Disable button during loading */
    disableOnLoading?: boolean;
    /** Loading spinner HTML */
    loadingHtml?: string;
    /** Enable ripple effect */
    ripple?: boolean;
    /** Ripple color */
    rippleColor?: string;
    /** Callback on click */
    onClick?: (
        button: HTMLButtonElement,
        event: Event,
    ) => void | Promise<void>;
}

/**
 * Button handler with loading states and ripple effects.
 *
 * @example JavaScript
 * ```typescript
 * const button = new ButtonHandler("#submit", {
 *     loading: true,
 *     onClick: async (button) => {
 *         await submitForm()
 *     }
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <button data-ss="button"
 *         data-ss-button-loading="true"
 *         data-ss-button-ripple="true">
 *     Submit
 * </button>
 * ```
 */
export class ButtonHandler {
    private button: HTMLButtonElement | null;
    private options: Required<ButtonHandlerOptions>;
    private originalContent: string = "";
    private isLoading: boolean = false;

    constructor(
        selectorOrElement: string | HTMLButtonElement,
        options: ButtonHandlerOptions = {},
    ) {
        this.button =
            typeof selectorOrElement === "string"
                ? document.querySelector<HTMLButtonElement>(selectorOrElement)
                : selectorOrElement;

        this.options = {
            loading: options.loading ?? false,
            disableOnLoading: options.disableOnLoading !== false,
            loadingHtml:
                options.loadingHtml ?? '<span class="button__spinner"></span>',
            ripple: options.ripple ?? false,
            rippleColor: options.rippleColor ?? "rgba(255, 255, 255, 0.3)",
            onClick: options.onClick ?? (() => {}),
        };

        if (!this.button) {
            console.warn("[Stylescape] ButtonHandler button not found");
            return;
        }

        this.originalContent = this.button.innerHTML;
        this.init();
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Start loading state
     */
    public startLoading(): void {
        if (!this.button || this.isLoading) return;

        this.isLoading = true;
        this.originalContent = this.button.innerHTML;

        if (this.options.disableOnLoading) {
            this.button.disabled = true;
        }

        this.button.classList.add("button--loading");
        this.button.innerHTML = this.options.loadingHtml;
        this.button.setAttribute("aria-busy", "true");
    }

    /**
     * Stop loading state
     */
    public stopLoading(): void {
        if (!this.button || !this.isLoading) return;

        this.isLoading = false;
        this.button.disabled = false;
        this.button.classList.remove("button--loading");
        this.button.innerHTML = this.originalContent;
        this.button.setAttribute("aria-busy", "false");
    }

    /**
     * Manually trigger click
     */
    public click(): void {
        this.button?.click();
    }

    /**
     * Enable the button
     */
    public enable(): void {
        if (this.button) {
            this.button.disabled = false;
        }
    }

    /**
     * Disable the button
     */
    public disable(): void {
        if (this.button) {
            this.button.disabled = true;
        }
    }

    /**
     * Destroy the handler
     */
    public destroy(): void {
        this.button?.removeEventListener("click", this.handleClick);
        this.button = null;
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private init(): void {
        if (!this.button) return;

        this.button.addEventListener("click", this.handleClick);

        if (this.options.ripple) {
            this.button.style.position = "relative";
            this.button.style.overflow = "hidden";
        }
    }

    private handleClick = async (event: Event): Promise<void> => {
        if (!this.button || this.isLoading) return;

        // Ripple effect
        if (this.options.ripple) {
            this.createRipple(event as MouseEvent);
        }

        // Loading state
        if (this.options.loading) {
            this.startLoading();
        }

        try {
            await this.options.onClick(this.button, event);
        } finally {
            if (this.options.loading) {
                this.stopLoading();
            }
        }
    };

    private createRipple(event: MouseEvent): void {
        if (!this.button) return;

        const ripple = document.createElement("span");
        ripple.className = "button__ripple";

        const rect = this.button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: ${this.options.rippleColor};
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        this.button.appendChild(ripple);

        ripple.addEventListener("animationend", () => {
            ripple.remove();
        });
    }
}

// ============================================================================
// Static Initialization
// ============================================================================

/**
 * Initialize all buttons with data-ss="button" attribute
 */
export function initButtons(): void {
    document
        .querySelectorAll<HTMLButtonElement>('[data-ss="button"]')
        .forEach((button) => {
            new ButtonHandler(button, {
                loading: button.dataset.ssButtonLoading === "true",
                ripple: button.dataset.ssButtonRipple === "true",
                rippleColor: button.dataset.ssButtonRippleColor,
            });
        });
}

export default ButtonHandler;
