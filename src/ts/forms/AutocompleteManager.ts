// ============================================================================
// Stylescape | Autocomplete Manager
// ============================================================================
// Provides autocomplete/search suggestions for input fields.
// Supports data-ss-autocomplete attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for AutocompleteManager
 */
export interface AutocompleteOptions {
    /** Static list of suggestions */
    suggestions?: string[]
    /** Async function to fetch suggestions */
    fetchSuggestions?: (query: string) => Promise<string[]>
    /** Minimum characters before showing suggestions */
    minChars?: number
    /** Maximum suggestions to show */
    maxResults?: number
    /** Debounce delay in ms */
    debounce?: number
    /** Whether to highlight matching text */
    highlight?: boolean
    /** CSS class for the suggestions container */
    containerClass?: string
    /** CSS class for suggestion items */
    itemClass?: string
    /** CSS class for highlighted text */
    highlightClass?: string
    /** CSS class for active/selected item */
    activeClass?: string
    /** Callback when suggestion is selected */
    onSelect?: (value: string, item: HTMLElement) => void
}

/**
 * Autocomplete manager for input fields with keyboard navigation.
 *
 * @example JavaScript
 * ```typescript
 * const autocomplete = new AutocompleteManager("#search", {
 *     suggestions: ["Apple", "Banana", "Cherry"],
 *     onSelect: (value) => console.log(`Selected: ${value}`)
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <input type="text"
 *        data-ss="autocomplete"
 *        data-ss-autocomplete-min-chars="2"
 *        data-ss-autocomplete-url="/api/search"
 *        placeholder="Search...">
 * ```
 */
export class AutocompleteManager {
    private input: HTMLInputElement | null
    private container: HTMLElement | null = null
    private options: Required<AutocompleteOptions>
    private activeIndex: number = -1
    private isOpen: boolean = false
    private debounceTimer: number | null = null
    private currentSuggestions: string[] = []

    constructor(
        inputSelectorOrElement: string | HTMLInputElement,
        options: AutocompleteOptions = {}
    ) {
        this.input = typeof inputSelectorOrElement === "string"
            ? document.querySelector<HTMLInputElement>(inputSelectorOrElement)
            : inputSelectorOrElement

        this.options = {
            suggestions: options.suggestions ?? [],
            fetchSuggestions: options.fetchSuggestions ?? (async () => []),
            minChars: options.minChars ?? 1,
            maxResults: options.maxResults ?? 10,
            debounce: options.debounce ?? 200,
            highlight: options.highlight !== false,
            containerClass: options.containerClass ?? "autocomplete",
            itemClass: options.itemClass ?? "autocomplete__item",
            highlightClass: options.highlightClass ?? "autocomplete__highlight",
            activeClass: options.activeClass ?? "autocomplete__item--active",
            onSelect: options.onSelect ?? (() => {})
        }

        if (!this.input) {
            console.warn("[Stylescape] AutocompleteManager input not found")
            return
        }

        this.init()
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Update suggestions list
     */
    public setSuggestions(suggestions: string[]): void {
        this.options.suggestions = suggestions
    }

    /**
     * Open suggestions dropdown
     */
    public open(): void {
        if (!this.container || this.currentSuggestions.length === 0) return
        this.container.style.display = "block"
        this.isOpen = true
        this.input?.setAttribute("aria-expanded", "true")
    }

    /**
     * Close suggestions dropdown
     */
    public close(): void {
        if (!this.container) return
        this.container.style.display = "none"
        this.isOpen = false
        this.activeIndex = -1
        this.input?.setAttribute("aria-expanded", "false")
        this.clearActive()
    }

    /**
     * Destroy the autocomplete
     */
    public destroy(): void {
        this.close()
        this.container?.remove()
        this.input?.removeEventListener("input", this.handleInput)
        this.input?.removeEventListener("keydown", this.handleKeyDown)
        this.input?.removeEventListener("blur", this.handleBlur)
        this.input = null
        this.container = null
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private init(): void {
        if (!this.input) return

        // Create suggestions container
        this.createContainer()

        // Set ARIA attributes
        this.input.setAttribute("role", "combobox")
        this.input.setAttribute("aria-autocomplete", "list")
        this.input.setAttribute("aria-expanded", "false")
        this.input.setAttribute("aria-haspopup", "listbox")

        // Add event listeners
        this.input.addEventListener("input", this.handleInput)
        this.input.addEventListener("keydown", this.handleKeyDown)
        this.input.addEventListener("blur", this.handleBlur)
        this.input.addEventListener("focus", () => {
            if (this.currentSuggestions.length > 0) this.open()
        })
    }

    private createContainer(): void {
        this.container = document.createElement("div")
        this.container.className = this.options.containerClass
        this.container.setAttribute("role", "listbox")
        this.container.style.display = "none"
        this.container.style.position = "absolute"

        // Position relative to input
        const wrapper = document.createElement("div")
        wrapper.style.position = "relative"
        this.input?.parentNode?.insertBefore(wrapper, this.input)
        wrapper.appendChild(this.input!)
        wrapper.appendChild(this.container)
    }

    private handleInput = async (): Promise<void> => {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer)
        }

        this.debounceTimer = window.setTimeout(async () => {
            const query = this.input?.value.trim() || ""

            if (query.length < this.options.minChars) {
                this.close()
                return
            }

            await this.updateSuggestions(query)
        }, this.options.debounce)
    }

    private async updateSuggestions(query: string): Promise<void> {
        let suggestions: string[]

        // Use fetch function if provided and no static suggestions match
        if (this.options.fetchSuggestions && this.options.suggestions.length === 0) {
            suggestions = await this.options.fetchSuggestions(query)
        } else {
            // Filter static suggestions
            const lowerQuery = query.toLowerCase()
            suggestions = this.options.suggestions.filter(s =>
                s.toLowerCase().includes(lowerQuery)
            )
        }

        // Limit results
        this.currentSuggestions = suggestions.slice(0, this.options.maxResults)

        this.renderSuggestions(query)

        if (this.currentSuggestions.length > 0) {
            this.open()
        } else {
            this.close()
        }
    }

    private renderSuggestions(query: string): void {
        if (!this.container) return

        this.container.innerHTML = ""
        this.activeIndex = -1

        this.currentSuggestions.forEach((suggestion, index) => {
            const item = document.createElement("div")
            item.className = this.options.itemClass
            item.setAttribute("role", "option")
            item.setAttribute("data-index", String(index))

            if (this.options.highlight) {
                item.innerHTML = this.highlightMatch(suggestion, query)
            } else {
                item.textContent = suggestion
            }

            item.addEventListener("mousedown", (e) => {
                e.preventDefault()
                this.selectSuggestion(index)
            })

            item.addEventListener("mouseenter", () => {
                this.setActive(index)
            })

            this.container!.appendChild(item)
        })
    }

    private highlightMatch(text: string, query: string): string {
        const regex = new RegExp(`(${this.escapeRegex(query)})`, "gi")
        return text.replace(regex, `<span class="${this.options.highlightClass}">$1</span>`)
    }

    private escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    }

    private handleKeyDown = (e: KeyboardEvent): void => {
        if (!this.isOpen) {
            if (e.key === "ArrowDown" && this.currentSuggestions.length > 0) {
                e.preventDefault()
                this.open()
            }
            return
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault()
                this.moveActive(1)
                break
            case "ArrowUp":
                e.preventDefault()
                this.moveActive(-1)
                break
            case "Enter":
                e.preventDefault()
                if (this.activeIndex >= 0) {
                    this.selectSuggestion(this.activeIndex)
                }
                break
            case "Escape":
                this.close()
                break
            case "Tab":
                this.close()
                break
        }
    }

    private handleBlur = (): void => {
        // Delay to allow click on suggestion
        setTimeout(() => this.close(), 150)
    }

    private moveActive(delta: number): void {
        const newIndex = this.activeIndex + delta
        const maxIndex = this.currentSuggestions.length - 1

        if (newIndex < 0) {
            this.setActive(maxIndex)
        } else if (newIndex > maxIndex) {
            this.setActive(0)
        } else {
            this.setActive(newIndex)
        }
    }

    private setActive(index: number): void {
        this.clearActive()
        this.activeIndex = index

        const item = this.container?.querySelector(`[data-index="${index}"]`)
        if (item) {
            item.classList.add(this.options.activeClass)
            item.setAttribute("aria-selected", "true")
            item.scrollIntoView({ block: "nearest" })
        }
    }

    private clearActive(): void {
        this.container?.querySelectorAll(`.${this.options.activeClass}`).forEach(el => {
            el.classList.remove(this.options.activeClass)
            el.setAttribute("aria-selected", "false")
        })
    }

    private selectSuggestion(index: number): void {
        const value = this.currentSuggestions[index]
        if (!value || !this.input) return

        this.input.value = value
        this.close()

        const item = this.container?.querySelector(`[data-index="${index}"]`) as HTMLElement
        this.options.onSelect(value, item)

        // Dispatch change event
        this.input.dispatchEvent(new Event("change", { bubbles: true }))
    }
}

export default AutocompleteManager

