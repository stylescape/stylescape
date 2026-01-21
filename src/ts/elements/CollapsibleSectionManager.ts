// ============================================================================
// Stylescape | Collapsible Section Manager
// ============================================================================
// Manages collapsible sections with smooth animations and accessibility.
// Supports data-ss-collapsible attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for CollapsibleSectionManager
 */
export interface CollapsibleSectionOptions {
    /** Initially expanded state */
    expanded?: boolean
    /** Animation duration in milliseconds */
    animationDuration?: number
    /** CSS class for collapsed state */
    collapsedClass?: string
    /** CSS class for expanded state */
    expandedClass?: string
    /** Persist state in localStorage */
    persist?: boolean
    /** Storage key for persistence */
    storageKey?: string
    /** Callback when section expands */
    onExpand?: (element: HTMLElement) => void
    /** Callback when section collapses */
    onCollapse?: (element: HTMLElement) => void
    /** Selector for the trigger element */
    triggerSelector?: string
    /** Selector for the content element */
    contentSelector?: string
}

/**
 * Collapsible section with animation and state persistence.
 *
 * @example JavaScript
 * ```typescript
 * const section = new CollapsibleSectionManager("#faq-item-1", {
 *     expanded: false,
 *     persist: true,
 *     onExpand: () => trackAnalytics("faq_expanded")
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <div data-ss="collapsible"
 *      data-ss-collapsible-expanded="false"
 *      data-ss-collapsible-persist="true">
 *     <button data-ss-collapsible-trigger aria-expanded="false">
 *         Click to expand
 *     </button>
 *     <div data-ss-collapsible-content hidden>
 *         Collapsible content here
 *     </div>
 * </div>
 * ```
 */
export class CollapsibleSectionManager {
    private element: HTMLElement | null
    private trigger: HTMLElement | null = null
    private content: HTMLElement | null = null
    private options: Required<CollapsibleSectionOptions>
    private isExpanded: boolean = false

    constructor(
        selectorOrElement: string | HTMLElement,
        options: CollapsibleSectionOptions = {}
    ) {
        this.element = typeof selectorOrElement === "string"
            ? document.querySelector<HTMLElement>(selectorOrElement)
            : selectorOrElement

        this.options = {
            expanded: options.expanded ?? false,
            animationDuration: options.animationDuration ?? 300,
            collapsedClass: options.collapsedClass ?? "collapsible--collapsed",
            expandedClass: options.expandedClass ?? "collapsible--expanded",
            persist: options.persist ?? false,
            storageKey: options.storageKey ?? this.element?.id ?? "collapsible-state",
            onExpand: options.onExpand ?? (() => {}),
            onCollapse: options.onCollapse ?? (() => {}),
            triggerSelector: options.triggerSelector ?? "[data-ss-collapsible-trigger]",
            contentSelector: options.contentSelector ?? "[data-ss-collapsible-content]"
        }

        if (!this.element) {
            console.warn("[Stylescape] CollapsibleSectionManager element not found")
            return
        }

        this.init()
    }

    // ========================================================================
    // Public Properties
    // ========================================================================

    /**
     * Get expanded state
     */
    public get expanded(): boolean {
        return this.isExpanded
    }

    /**
     * Set expanded state
     */
    public set expanded(value: boolean) {
        if (value) {
            this.expand()
        } else {
            this.collapse()
        }
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Toggle expanded state
     */
    public toggle(): void {
        if (this.isExpanded) {
            this.collapse()
        } else {
            this.expand()
        }
    }

    /**
     * Expand the section
     */
    public expand(): void {
        if (!this.element || !this.content || this.isExpanded) return

        this.isExpanded = true

        // Update classes
        this.element.classList.remove(this.options.collapsedClass)
        this.element.classList.add(this.options.expandedClass)

        // Update ARIA
        this.trigger?.setAttribute("aria-expanded", "true")
        this.content.hidden = false

        // Animate
        const height = this.content.scrollHeight
        this.content.style.height = "0px"
        this.content.style.overflow = "hidden"

        requestAnimationFrame(() => {
            if (!this.content) return
            this.content.style.transition = `height ${this.options.animationDuration}ms ease`
            this.content.style.height = `${height}px`

            setTimeout(() => {
                if (!this.content) return
                this.content.style.height = ""
                this.content.style.overflow = ""
                this.content.style.transition = ""
            }, this.options.animationDuration)
        })

        // Persist state
        if (this.options.persist) {
            localStorage.setItem(this.options.storageKey, "true")
        }

        this.options.onExpand(this.element)
    }

    /**
     * Collapse the section
     */
    public collapse(): void {
        if (!this.element || !this.content || !this.isExpanded) return

        this.isExpanded = false

        // Update classes
        this.element.classList.add(this.options.collapsedClass)
        this.element.classList.remove(this.options.expandedClass)

        // Update ARIA
        this.trigger?.setAttribute("aria-expanded", "false")

        // Animate
        const height = this.content.scrollHeight
        this.content.style.height = `${height}px`
        this.content.style.overflow = "hidden"

        requestAnimationFrame(() => {
            if (!this.content) return
            this.content.style.transition = `height ${this.options.animationDuration}ms ease`
            this.content.style.height = "0px"

            setTimeout(() => {
                if (!this.content) return
                this.content.hidden = true
                this.content.style.height = ""
                this.content.style.overflow = ""
                this.content.style.transition = ""
            }, this.options.animationDuration)
        })

        // Persist state
        if (this.options.persist) {
            localStorage.setItem(this.options.storageKey, "false")
        }

        this.options.onCollapse(this.element)
    }

    /**
     * Destroy the manager
     */
    public destroy(): void {
        this.trigger?.removeEventListener("click", this.handleClick)
        this.trigger?.removeEventListener("keydown", this.handleKeydown)
        this.element = null
        this.trigger = null
        this.content = null
    }

    // ========================================================================
    // Static Factory
    // ========================================================================

    /**
     * Initialize all collapsible sections with data-ss="collapsible"
     */
    public static initCollapsibles(): CollapsibleSectionManager[] {
        const managers: CollapsibleSectionManager[] = []

        document.querySelectorAll<HTMLElement>('[data-ss="collapsible"]').forEach((el) => {
            const expanded = el.dataset.ssCollapsibleExpanded === "true"
            const persist = el.dataset.ssCollapsiblePersist === "true"

            managers.push(new CollapsibleSectionManager(el, {
                expanded,
                persist
            }))
        })

        return managers
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private init(): void {
        if (!this.element) return

        // Find trigger and content
        this.trigger = this.element.querySelector<HTMLElement>(this.options.triggerSelector)
            || this.element.querySelector<HTMLElement>(".collapsible-trigger")
            || this.element

        this.content = this.element.querySelector<HTMLElement>(this.options.contentSelector)
            || this.element.querySelector<HTMLElement>(".collapsible-content")

        if (!this.content) {
            // If no specific content, use the element itself
            this.content = this.element
        }

        // Setup ARIA
        const contentId = this.content.id || `collapsible-content-${Date.now()}`
        this.content.id = contentId
        this.trigger.setAttribute("aria-controls", contentId)

        // Make trigger focusable
        if (!this.trigger.hasAttribute("tabindex") && this.trigger.tagName !== "BUTTON") {
            this.trigger.setAttribute("tabindex", "0")
        }

        // Load persisted state
        let initialExpanded = this.options.expanded
        if (this.options.persist) {
            const stored = localStorage.getItem(this.options.storageKey)
            if (stored !== null) {
                initialExpanded = stored === "true"
            }
        }

        // Set initial state
        this.isExpanded = !initialExpanded // Toggle will flip this
        this.toggle()

        // Add event listeners
        this.trigger.addEventListener("click", this.handleClick)
        this.trigger.addEventListener("keydown", this.handleKeydown)
    }

    private handleClick = (event: Event): void => {
        // Don't toggle if clicking inside content
        if (this.content?.contains(event.target as Node) && event.target !== this.trigger) {
            return
        }
        this.toggle()
    }

    private handleKeydown = (event: KeyboardEvent): void => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            this.toggle()
        }
    }
}

export default CollapsibleSectionManager
