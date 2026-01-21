// ============================================================================
// Stylescape | Password Toggle Manager
// ============================================================================
// Manages show/hide password functionality for input fields.
// Supports data-password-toggle attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for PasswordToggleManager
 */
export interface PasswordToggleOptions {
    /** CSS selector for toggle buttons */
    selector?: string
    /** CSS class added when password is visible */
    visibleClass?: string
    /** Aria label for showing password */
    showLabel?: string
    /** Aria label for hiding password */
    hideLabel?: string
}

/**
 * Password visibility toggle manager.
 * Provides show/hide functionality for password input fields.
 *
 * @example JavaScript
 * ```typescript
 * // Initialize with default selector
 * const passwordToggle = new PasswordToggleManager()
 *
 * // Or with custom selector
 * const passwordToggle = new PasswordToggleManager(".pw-toggle")
 * ```
 *
 * @example HTML with data-password-toggle
 * ```html
 * <div class="input-group">
 *     <input type="password" id="userPassword">
 *     <button type="button"
 *             data-password-toggle="userPassword"
 *             aria-pressed="false">
 *         Show
 *     </button>
 * </div>
 * ```
 */
export class PasswordToggleManager {
    /** CSS selector for toggle buttons */
    private readonly selector: string

    /**
     * Creates a new PasswordToggleManager instance.
     *
     * @param selector - CSS selector for toggle buttons (default: "[data-password-toggle]")
     */
    constructor(selector: string = "[data-password-toggle]") {
        this.selector = selector
        this.init()
    }

    /**
     * Initializes toggle functionality for all matching buttons.
     */
    private init(): void {
        document
            .querySelectorAll<HTMLButtonElement>(this.selector)
            .forEach((button) => {
                const inputId = button.dataset.passwordToggle
                if (!inputId) return

                const input = document.getElementById(
                    inputId,
                ) as HTMLInputElement | null
                if (!input || input.type !== "password") return

                button.addEventListener("click", () =>
                    this.togglePasswordVisibility(input, button),
                )
            })
    }

    /**
     * Toggles password visibility for an input field.
     *
     * @param input - The password input element
     * @param button - The toggle button element
     */
    private togglePasswordVisibility(
        input: HTMLInputElement,
        button: HTMLButtonElement,
    ): void {
        const isText = input.type === "text"
        input.type = isText ? "password" : "text"

        button.classList.toggle("is-visible", !isText)
        button.setAttribute("aria-pressed", String(!isText))
    }
}
