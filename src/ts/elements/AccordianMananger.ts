// ============================================================================
// Stylescape | Accordion Manager
// ============================================================================
// Manages accordion-style collapsible elements with accessibility support.
// Supports data-ss-accordion attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for AccordionManager
 */
export interface AccordionOptions {
    /** Allow multiple panels to be open simultaneously */
    allowMultiple?: boolean
    /** Initially expanded panel index(es) */
    defaultOpen?: number | number[]
    /** Animation duration in milliseconds */
    animationDuration?: number
    /** CSS class for active header */
    activeHeaderClass?: string
    /** CSS class for active content */
    activeContentClass?: string
    /** Callback when panel opens */
    onOpen?: (header: HTMLElement, content: HTMLElement, index: number) => void
    /** Callback when panel closes */
    onClose?: (header: HTMLElement, content: HTMLElement, index: number) => void
    /** Selector for content panel relative to header */
    contentSelector?: string
}

interface AccordionItem {
    header: HTMLElement
    content: HTMLElement
    isOpen: boolean
}

/**
 * Accessible accordion component with animation support.
 *
 * @example JavaScript
 * ```typescript
 * const accordion = new AccordionManager(".accordion", {
 *     allowMultiple: false,
 *     defaultOpen: 0,
 *     animationDuration: 300
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <div data-ss="accordion" data-ss-accordion-multiple="false">
 *     <div class="accordion-item">
 *         <button data-ss-accordion-header aria-expanded="false">
 *             Section 1
 *         </button>
 *         <div data-ss-accordion-content hidden>
 *             Content for section 1
 *         </div>
 *     </div>
 * </div>
 * ```
 */
export class AccordionManager {
    private container: HTMLElement | null
    private items: AccordionItem[] = []
    private options: Required<AccordionOptions>

    constructor(
        selectorOrElement: string | HTMLElement,
        options: AccordionOptions = {}
    ) {
        this.container = typeof selectorOrElement === "string"
            ? document.querySelector<HTMLElement>(selectorOrElement)
            : selectorOrElement

        this.options = {
            allowMultiple: options.allowMultiple ?? false,
            defaultOpen: options.defaultOpen ?? -1,
            animationDuration: options.animationDuration ?? 300,
            activeHeaderClass: options.activeHeaderClass ?? "accordion-header--active",
            activeContentClass: options.activeContentClass ?? "accordion-content--active",
            onOpen: options.onOpen ?? (() => {}),
            onClose: options.onClose ?? (() => {}),
            contentSelector: options.contentSelector ?? "[data-ss-accordion-content]"
        }

        if (!this.container) {
            console.warn("[Stylescape] AccordionManager container not found")
            return
        }

        this.init()
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Open a panel by index
     */
    public open(index: number): void {
        if (index < 0 || index >= this.items.length) return

        // Close others if not allowing multiple
        if (!this.options.allowMultiple) {
            this.items.forEach((item, i) => {
                if (i !== index && item.isOpen) {
                    this.closeItem(i)
                }
            })
        }

        this.openItem(index)
    }

    /**
     * Close a panel by index
     */
    public close(index: number): void {
        if (index < 0 || index >= this.items.length) return
        this.closeItem(index)
    }

    /**
     * Toggle a panel by index
     */
    public toggle(index: number): void {
        if (index < 0 || index >= this.items.length) return

        if (this.items[index].isOpen) {
            this.close(index)
        } else {
            this.open(index)
        }
    }

    /**
     * Open all panels
     */
    public openAll(): void {
        this.items.forEach((_, i) => this.openItem(i))
    }

    /**
     * Close all panels
     */
    public closeAll(): void {
        this.items.forEach((_, i) => this.closeItem(i))
    }

    /**
     * Check if a panel is open
     */
    public isOpen(index: number): boolean {
        return this.items[index]?.isOpen ?? false
    }

    /**
     * Destroy the accordion
     */
    public destroy(): void {
        this.items.forEach((item) => {
            item.header.removeEventListener("click", this.handleClick)
            item.header.removeEventListener("keydown", this.handleKeydown)
        })
        this.items = []
    }

    // ========================================================================
    // Static Factory
    // ========================================================================

    /**
     * Initialize all accordions with data-ss="accordion"
     */
    public static initAccordions(): AccordionManager[] {
        const managers: AccordionManager[] = []
        const accordions = document.querySelectorAll<HTMLElement>('[data-ss="accordion"]')

        accordions.forEach((el) => {
            const multiple = el.dataset.ssAccordionMultiple === "true"
            const defaultOpen = el.dataset.ssAccordionDefaultOpen

            managers.push(new AccordionManager(el, {
                allowMultiple: multiple,
                defaultOpen: defaultOpen ? parseInt(defaultOpen, 10) : -1
            }))
        })

        return managers
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private init(): void {
        if (!this.container) return

        // Find headers and contents
        const headers = this.container.querySelectorAll<HTMLElement>(
            "[data-ss-accordion-header], .accordion-header"
        )

        headers.forEach((header, index) => {
            const content = this.findContent(header)
            if (!content) return

            // Setup ARIA attributes
            const id = `accordion-content-${index}-${Date.now()}`
            content.id = content.id || id
            header.setAttribute("aria-expanded", "false")
            header.setAttribute("aria-controls", content.id)
            content.setAttribute("role", "region")
            content.setAttribute("aria-labelledby", header.id || `accordion-header-${index}`)

            // Ensure header is focusable
            if (!header.hasAttribute("tabindex")) {
                header.setAttribute("tabindex", "0")
            }

            // Hide content initially
            content.hidden = true
            content.style.overflow = "hidden"

            this.items.push({
                header,
                content,
                isOpen: false
            })

            // Add event listeners
            header.addEventListener("click", this.handleClick)
            header.addEventListener("keydown", this.handleKeydown)
        })

        // Open default panels
        this.openDefaults()
    }

    private findContent(header: HTMLElement): HTMLElement | null {
        // Try next sibling first
        const nextSibling = header.nextElementSibling
        if (nextSibling?.matches(this.options.contentSelector)) {
            return nextSibling as HTMLElement
        }

        // Try within parent
        const parent = header.parentElement
        return parent?.querySelector<HTMLElement>(this.options.contentSelector) ?? null
    }

    private openDefaults(): void {
        const defaults = this.options.defaultOpen

        if (Array.isArray(defaults)) {
            defaults.forEach((i) => this.openItem(i))
        } else if (defaults >= 0) {
            this.openItem(defaults)
        }
    }

    private openItem(index: number): void {
        const item = this.items[index]
        if (!item || item.isOpen) return

        item.header.setAttribute("aria-expanded", "true")
        item.header.classList.add(this.options.activeHeaderClass)
        item.content.hidden = false
        item.content.classList.add(this.options.activeContentClass)

        // Animate open
        const height = item.content.scrollHeight
        item.content.style.height = "0px"

        requestAnimationFrame(() => {
            item.content.style.transition = `height ${this.options.animationDuration}ms ease`
            item.content.style.height = `${height}px`

            setTimeout(() => {
                item.content.style.height = ""
                item.content.style.transition = ""
            }, this.options.animationDuration)
        })

        item.isOpen = true
        this.options.onOpen(item.header, item.content, index)
    }

    private closeItem(index: number): void {
        const item = this.items[index]
        if (!item || !item.isOpen) return

        item.header.setAttribute("aria-expanded", "false")
        item.header.classList.remove(this.options.activeHeaderClass)
        item.content.classList.remove(this.options.activeContentClass)

        // Animate close
        const height = item.content.scrollHeight
        item.content.style.height = `${height}px`

        requestAnimationFrame(() => {
            item.content.style.transition = `height ${this.options.animationDuration}ms ease`
            item.content.style.height = "0px"

            setTimeout(() => {
                item.content.hidden = true
                item.content.style.height = ""
                item.content.style.transition = ""
            }, this.options.animationDuration)
        })

        item.isOpen = false
        this.options.onClose(item.header, item.content, index)
    }

    private handleClick = (event: Event): void => {
        const header = event.currentTarget as HTMLElement
        const index = this.items.findIndex((item) => item.header === header)
        if (index !== -1) {
            this.toggle(index)
        }
    }

    private handleKeydown = (event: KeyboardEvent): void => {
        const header = event.currentTarget as HTMLElement
        const index = this.items.findIndex((item) => item.header === header)

        switch (event.key) {
            case "Enter":
            case " ":
                event.preventDefault()
                this.toggle(index)
                break
            case "ArrowDown":
                event.preventDefault()
                this.focusHeader((index + 1) % this.items.length)
                break
            case "ArrowUp":
                event.preventDefault()
                this.focusHeader((index - 1 + this.items.length) % this.items.length)
                break
            case "Home":
                event.preventDefault()
                this.focusHeader(0)
                break
            case "End":
                event.preventDefault()
                this.focusHeader(this.items.length - 1)
                break
        }
    }

    private focusHeader(index: number): void {
        this.items[index]?.header.focus()
    }
}

export default AccordionManager
