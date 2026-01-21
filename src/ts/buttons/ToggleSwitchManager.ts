// ============================================================================
// Stylescape | Toggle Switch Manager
// ============================================================================
// Manages toggle switch UI elements with state persistence.
// Supports data-ss-toggle attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for ToggleSwitchManager
 */
export interface ToggleSwitchOptions {
    /** Initial state */
    checked?: boolean
    /** Storage key for persistence */
    storageKey?: string
    /** Use localStorage for persistence */
    persist?: boolean
    /** Callback when state changes */
    onChange?: (isOn: boolean, element: HTMLInputElement) => void
    /** CSS class for on state */
    onClass?: string
    /** CSS class for off state */
    offClass?: string
    /** Label for on state */
    onLabel?: string
    /** Label for off state */
    offLabel?: string
}

/**
 * Toggle switch manager with state persistence and callbacks.
 *
 * @example JavaScript
 * ```typescript
 * const toggle = new ToggleSwitchManager("#darkMode", {
 *     persist: true,
 *     storageKey: "dark-mode",
 *     onChange: (isOn) => document.body.classList.toggle("dark", isOn)
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <input type="checkbox"
 *        data-ss="toggle"
 *        data-ss-toggle-persist="true"
 *        data-ss-toggle-storage-key="notifications"
 *        id="notifications">
 * <label for="notifications">Enable notifications</label>
 * ```
 */
export class ToggleSwitchManager {
    private element: HTMLInputElement | null
    private options: Required<ToggleSwitchOptions>
    private labelElement: HTMLElement | null = null

    constructor(
        selectorOrElement: string | HTMLInputElement,
        options: ToggleSwitchOptions = {}
    ) {
        this.element = typeof selectorOrElement === "string"
            ? document.querySelector<HTMLInputElement>(selectorOrElement)
            : selectorOrElement

        this.options = {
            checked: options.checked ?? false,
            storageKey: options.storageKey ?? this.element?.id ?? "toggle-state",
            persist: options.persist ?? false,
            onChange: options.onChange ?? (() => {}),
            onClass: options.onClass ?? "toggle--on",
            offClass: options.offClass ?? "toggle--off",
            onLabel: options.onLabel ?? "",
            offLabel: options.offLabel ?? ""
        }

        if (!this.element) {
            console.warn("[Stylescape] ToggleSwitchManager element not found")
            return
        }

        this.init()
    }

    // ========================================================================
    // Public Properties
    // ========================================================================

    /**
     * Get current state
     */
    get isOn(): boolean {
        return this.element?.checked ?? false
    }

    /**
     * Set current state
     */
    set isOn(value: boolean) {
        if (!this.element) return
        this.element.checked = value
        this.handleChange()
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Toggle the switch
     */
    public toggle(): void {
        this.isOn = !this.isOn
    }

    /**
     * Turn on
     */
    public on(): void {
        this.isOn = true
    }

    /**
     * Turn off
     */
    public off(): void {
        this.isOn = false
    }

    /**
     * Destroy the manager
     */
    public destroy(): void {
        this.element?.removeEventListener("change", this.handleChange)
        this.element = null
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private init(): void {
        if (!this.element) return

        // Load persisted state
        if (this.options.persist) {
            const stored = localStorage.getItem(this.options.storageKey)
            if (stored !== null) {
                this.element.checked = stored === "true"
            } else {
                this.element.checked = this.options.checked
            }
        } else {
            this.element.checked = this.options.checked
        }

        // Find associated label
        if (this.element.id) {
            this.labelElement = document.querySelector(`label[for="${this.element.id}"]`)
        }

        // Set ARIA attributes
        this.element.setAttribute("role", "switch")
        this.updateAriaState()

        // Add event listener
        this.element.addEventListener("change", this.handleChange)

        // Initial state update
        this.updateUI()
    }

    private handleChange = (): void => {
        if (!this.element) return

        // Persist state
        if (this.options.persist) {
            localStorage.setItem(this.options.storageKey, String(this.element.checked))
        }

        this.updateUI()
        this.updateAriaState()
        this.options.onChange(this.element.checked, this.element)
    }

    private updateUI(): void {
        if (!this.element) return

        const parent = this.element.parentElement

        // Update classes on parent wrapper
        parent?.classList.toggle(this.options.onClass, this.element.checked)
        parent?.classList.toggle(this.options.offClass, !this.element.checked)

        // Update label text
        if (this.labelElement && (this.options.onLabel || this.options.offLabel)) {
            const label = this.element.checked ? this.options.onLabel : this.options.offLabel
            if (label) {
                this.labelElement.textContent = label
            }
        }
    }

    private updateAriaState(): void {
        this.element?.setAttribute("aria-checked", String(this.element?.checked ?? false))
    }
}

export default ToggleSwitchManager

