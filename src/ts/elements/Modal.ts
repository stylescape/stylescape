// ============================================================================
// Stylescape | Modal
// ============================================================================
// Accessible modal dialog with focus trapping and animations.
// Supports data-ss-modal attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for Modal
 */
export interface ModalOptions {
    /** Close on backdrop click */
    closeOnBackdrop?: boolean
    /** Close on Escape key */
    closeOnEscape?: boolean
    /** Animation duration in milliseconds */
    animationDuration?: number
    /** CSS class for open state */
    openClass?: string
    /** CSS class for backdrop */
    backdropClass?: string
    /** Trap focus within modal */
    trapFocus?: boolean
    /** Element to focus when opened */
    focusElement?: string
    /** Return focus to trigger element on close */
    returnFocus?: boolean
    /** Callback when modal opens */
    onOpen?: (modal: HTMLElement) => void
    /** Callback when modal closes */
    onClose?: (modal: HTMLElement) => void
    /** Callback before close (return false to prevent) */
    onBeforeClose?: (modal: HTMLElement) => boolean | void
}

/**
 * Accessible modal dialog component.
 *
 * @example JavaScript
 * ```typescript
 * const modal = new Modal("#myModal", {
 *     closeOnBackdrop: true,
 *     closeOnEscape: true,
 *     trapFocus: true,
 *     onOpen: () => console.log("Modal opened")
 * })
 *
 * // Open programmatically
 * modal.open()
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <button data-ss-modal-trigger="#myModal">Open Modal</button>
 *
 * <div id="myModal"
 *      data-ss="modal"
 *      data-ss-modal-close-backdrop="true"
 *      role="dialog"
 *      aria-modal="true"
 *      hidden>
 *     <div data-ss-modal-content>
 *         <button data-ss-modal-close>&times;</button>
 *         <h2>Modal Title</h2>
 *         <p>Modal content here</p>
 *     </div>
 * </div>
 * ```
 */
export class Modal {
    private element: HTMLElement | null
    private options: Required<ModalOptions>
    private triggerElement: HTMLElement | null = null
    private focusableElements: HTMLElement[] = []
    private isOpen: boolean = false
    private backdropElement: HTMLElement | null = null

    constructor(
        selectorOrElement: string | HTMLElement,
        options: ModalOptions = {}
    ) {
        this.element = typeof selectorOrElement === "string"
            ? document.querySelector<HTMLElement>(selectorOrElement)
            : selectorOrElement

        this.options = {
            closeOnBackdrop: options.closeOnBackdrop ?? true,
            closeOnEscape: options.closeOnEscape ?? true,
            animationDuration: options.animationDuration ?? 300,
            openClass: options.openClass ?? "modal--open",
            backdropClass: options.backdropClass ?? "modal-backdrop",
            trapFocus: options.trapFocus ?? true,
            focusElement: options.focusElement ?? "",
            returnFocus: options.returnFocus ?? true,
            onOpen: options.onOpen ?? (() => {}),
            onClose: options.onClose ?? (() => {}),
            onBeforeClose: options.onBeforeClose ?? (() => true)
        }

        if (!this.element) {
            console.warn("[Stylescape] Modal element not found")
            return
        }

        this.init()
    }

    // ========================================================================
    // Public Properties
    // ========================================================================

    /**
     * Check if modal is currently open
     */
    public get opened(): boolean {
        return this.isOpen
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Open the modal
     */
    public open(trigger?: HTMLElement): void {
        if (!this.element || this.isOpen) return

        this.triggerElement = trigger || document.activeElement as HTMLElement

        // Create backdrop
        this.createBackdrop()

        // Show modal
        this.element.hidden = false
        this.element.setAttribute("aria-hidden", "false")
        document.body.classList.add("modal-open")
        document.body.style.overflow = "hidden"

        // Add open class with delay for animation
        requestAnimationFrame(() => {
            this.element?.classList.add(this.options.openClass)
            this.backdropElement?.classList.add(`${this.options.backdropClass}--visible`)
        })

        // Focus management
        this.updateFocusableElements()
        this.setInitialFocus()

        // Add event listeners
        document.addEventListener("keydown", this.handleKeydown)

        this.isOpen = true
        this.options.onOpen(this.element)
    }

    /**
     * Close the modal
     */
    public close(): void {
        if (!this.element || !this.isOpen) return

        // Check beforeClose callback
        if (this.options.onBeforeClose(this.element) === false) {
            return
        }

        // Remove open class for animation
        this.element.classList.remove(this.options.openClass)
        this.backdropElement?.classList.remove(`${this.options.backdropClass}--visible`)

        // Hide after animation
        setTimeout(() => {
            if (!this.element) return

            this.element.hidden = true
            this.element.setAttribute("aria-hidden", "true")
            document.body.classList.remove("modal-open")
            document.body.style.overflow = ""

            this.removeBackdrop()

            // Return focus
            if (this.options.returnFocus && this.triggerElement) {
                this.triggerElement.focus()
            }

            this.isOpen = false
            this.options.onClose(this.element)
        }, this.options.animationDuration)

        // Remove event listeners
        document.removeEventListener("keydown", this.handleKeydown)
    }

    /**
     * Toggle the modal
     */
    public toggle(trigger?: HTMLElement): void {
        if (this.isOpen) {
            this.close()
        } else {
            this.open(trigger)
        }
    }

    /**
     * Update modal content
     */
    public setContent(html: string): void {
        const content = this.element?.querySelector("[data-ss-modal-content], .modal-content")
        if (content) {
            content.innerHTML = html
            this.updateFocusableElements()
        }
    }

    /**
     * Destroy the modal
     */
    public destroy(): void {
        this.close()
        document.removeEventListener("keydown", this.handleKeydown)
        this.element?.querySelectorAll("[data-ss-modal-close]").forEach((btn) => {
            btn.removeEventListener("click", this.handleCloseClick)
        })
        this.element = null
    }

    // ========================================================================
    // Static Factory
    // ========================================================================

    /**
     * Initialize all modals and triggers
     */
    public static initModals(): Modal[] {
        const modals: Modal[] = []
        const modalMap = new Map<string, Modal>()

        // Initialize modal elements
        document.querySelectorAll<HTMLElement>('[data-ss="modal"]').forEach((el) => {
            const closeOnBackdrop = el.dataset.ssModalCloseBackdrop !== "false"
            const closeOnEscape = el.dataset.ssModalCloseEscape !== "false"

            const modal = new Modal(el, {
                closeOnBackdrop,
                closeOnEscape
            })
            modals.push(modal)

            if (el.id) {
                modalMap.set(`#${el.id}`, modal)
            }
        })

        // Setup triggers
        document.querySelectorAll<HTMLElement>("[data-ss-modal-trigger]").forEach((trigger) => {
            const targetSelector = trigger.dataset.ssModalTrigger
            if (targetSelector) {
                const modal = modalMap.get(targetSelector)
                if (modal) {
                    trigger.addEventListener("click", () => modal.open(trigger))
                }
            }
        })

        return modals
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private init(): void {
        if (!this.element) return

        // Set up ARIA attributes
        this.element.setAttribute("role", "dialog")
        this.element.setAttribute("aria-modal", "true")
        this.element.setAttribute("aria-hidden", "true")
        this.element.hidden = true

        // Setup close buttons
        this.element.querySelectorAll("[data-ss-modal-close]").forEach((btn) => {
            btn.addEventListener("click", this.handleCloseClick)
        })
    }

    private createBackdrop(): void {
        this.backdropElement = document.createElement("div")
        this.backdropElement.className = this.options.backdropClass

        if (this.options.closeOnBackdrop) {
            this.backdropElement.addEventListener("click", () => this.close())
        }

        document.body.appendChild(this.backdropElement)
    }

    private removeBackdrop(): void {
        this.backdropElement?.remove()
        this.backdropElement = null
    }

    private updateFocusableElements(): void {
        if (!this.element) return

        const focusableSelectors = [
            "button:not([disabled])",
            "input:not([disabled])",
            "select:not([disabled])",
            "textarea:not([disabled])",
            "a[href]",
            '[tabindex]:not([tabindex="-1"])'
        ].join(",")

        this.focusableElements = Array.from(
            this.element.querySelectorAll<HTMLElement>(focusableSelectors)
        )
    }

    private setInitialFocus(): void {
        if (!this.element) return

        // Focus specified element
        if (this.options.focusElement) {
            const focusEl = this.element.querySelector<HTMLElement>(this.options.focusElement)
            if (focusEl) {
                focusEl.focus()
                return
            }
        }

        // Focus first focusable element or the modal itself
        if (this.focusableElements.length > 0) {
            this.focusableElements[0].focus()
        } else {
            this.element.setAttribute("tabindex", "-1")
            this.element.focus()
        }
    }

    private handleKeydown = (event: KeyboardEvent): void => {
        if (event.key === "Escape" && this.options.closeOnEscape) {
            event.preventDefault()
            this.close()
            return
        }

        // Focus trap
        if (event.key === "Tab" && this.options.trapFocus) {
            this.handleTabKey(event)
        }
    }

    private handleTabKey(event: KeyboardEvent): void {
        if (this.focusableElements.length === 0) return

        const firstElement = this.focusableElements[0]
        const lastElement = this.focusableElements[this.focusableElements.length - 1]

        if (event.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                event.preventDefault()
                lastElement.focus()
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                event.preventDefault()
                firstElement.focus()
            }
        }
    }

    private handleCloseClick = (): void => {
        this.close()
    }
}

export default Modal
