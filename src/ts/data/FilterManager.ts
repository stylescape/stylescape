// ============================================================================
// Stylescape | Filter Manager
// ============================================================================
// Manages filtering of items in lists, tables, or grids.
// Supports data-ss-filter attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for FilterManager
 */
export interface FilterManagerOptions {
    /** Selector for items to filter */
    itemSelector?: string;
    /** Attribute or property to search in (default: textContent) */
    searchIn?: string | string[];
    /** Debounce delay in ms */
    debounce?: number;
    /** Whether search is case-sensitive */
    caseSensitive?: boolean;
    /** Minimum characters before filtering */
    minChars?: number;
    /** CSS class for hidden items */
    hiddenClass?: string;
    /** CSS class for matching items */
    matchClass?: string;
    /** Callback when filter is applied */
    onFilter?: (matches: HTMLElement[], query: string) => void;
    /** Callback when no results found */
    onEmpty?: (query: string) => void;
}

/**
 * Filter manager for searching/filtering lists and collections.
 *
 * @example JavaScript
 * ```typescript
 * const filter = new FilterManager("#search", {
 *     itemSelector: ".list-item",
 *     debounce: 200
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <input type="text"
 *        data-ss="filter"
 *        data-ss-filter-items=".card"
 *        data-ss-filter-debounce="300"
 *        data-ss-filter-min-chars="2"
 *        placeholder="Search...">
 *
 * <div class="card">Item 1</div>
 * <div class="card">Item 2</div>
 * ```
 */
export class FilterManager {
    private input: HTMLInputElement | null;
    private items: HTMLElement[];
    private options: Required<FilterManagerOptions>;
    private debounceTimer: number | null = null;

    constructor(
        inputSelectorOrElement: string | HTMLInputElement,
        options: FilterManagerOptions = {},
    ) {
        this.input =
            typeof inputSelectorOrElement === "string"
                ? document.querySelector<HTMLInputElement>(
                      inputSelectorOrElement,
                  )
                : inputSelectorOrElement;

        this.options = {
            itemSelector: options.itemSelector ?? ".filter-item",
            searchIn: options.searchIn ?? "textContent",
            debounce: options.debounce ?? 150,
            caseSensitive: options.caseSensitive ?? false,
            minChars: options.minChars ?? 0,
            hiddenClass: options.hiddenClass ?? "filter--hidden",
            matchClass: options.matchClass ?? "filter--match",
            onFilter: options.onFilter ?? (() => {}),
            onEmpty: options.onEmpty ?? (() => {}),
        };

        this.items = [];

        if (!this.input) {
            console.warn("[Stylescape] FilterManager input not found");
            return;
        }

        this.init();
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Apply filter with current input value
     */
    public filter(query?: string): HTMLElement[] {
        const searchQuery = query ?? this.input?.value ?? "";
        return this.applyFilter(searchQuery);
    }

    /**
     * Clear the filter (show all items)
     */
    public clear(): void {
        if (this.input) {
            this.input.value = "";
        }
        this.showAll();
    }

    /**
     * Show all items
     */
    public showAll(): void {
        this.items.forEach((item) => {
            item.classList.remove(this.options.hiddenClass);
            item.classList.remove(this.options.matchClass);
        });
    }

    /**
     * Refresh items (call after DOM changes)
     */
    public refresh(): void {
        this.items = Array.from(
            document.querySelectorAll<HTMLElement>(this.options.itemSelector),
        );
    }

    /**
     * Get current matches
     */
    public getMatches(): HTMLElement[] {
        return this.items.filter(
            (item) => !item.classList.contains(this.options.hiddenClass),
        );
    }

    /**
     * Destroy the filter manager
     */
    public destroy(): void {
        this.input?.removeEventListener("input", this.handleInput);
        this.input = null;
        this.items = [];
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private init(): void {
        this.refresh();
        this.input?.addEventListener("input", this.handleInput);

        // Apply initial filter if input has value
        if (this.input?.value) {
            this.filter();
        }
    }

    private handleInput = (): void => {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = window.setTimeout(() => {
            this.filter();
        }, this.options.debounce);
    };

    private applyFilter(query: string): HTMLElement[] {
        // Check minimum characters
        if (query.length < this.options.minChars) {
            this.showAll();
            return this.items;
        }

        const normalizedQuery = this.options.caseSensitive
            ? query
            : query.toLowerCase();

        const matches: HTMLElement[] = [];

        this.items.forEach((item) => {
            const content = this.getSearchContent(item);
            const normalizedContent = this.options.caseSensitive
                ? content
                : content.toLowerCase();

            const isMatch = normalizedContent.includes(normalizedQuery);

            item.classList.toggle(this.options.hiddenClass, !isMatch);
            item.classList.toggle(this.options.matchClass, isMatch);

            if (isMatch) {
                matches.push(item);
            }
        });

        this.options.onFilter(matches, query);

        if (matches.length === 0 && query.length > 0) {
            this.options.onEmpty(query);
        }

        return matches;
    }

    private getSearchContent(item: HTMLElement): string {
        const searchIn = Array.isArray(this.options.searchIn)
            ? this.options.searchIn
            : [this.options.searchIn];

        return searchIn
            .map((attr) => {
                if (attr === "textContent") {
                    return item.textContent || "";
                }
                return item.getAttribute(attr) || item.dataset[attr] || "";
            })
            .join(" ");
    }
}

export default FilterManager;
