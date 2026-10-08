// ============================================================================
// Stylescape | Table Sort Manager
// ============================================================================
// Client-side column sorting for `ss-c-table`. Header cells hold a
// `button.ss-c-table__sort`; the manager reorders the body rows and keeps
// `aria-sort` on the active `<th>` in sync.
// Supports data-ss="table-sort" for declarative initialisation.
// ============================================================================

export type TableSortDirection = "ascending" | "descending";
export type TableSortType = "text" | "number" | "auto";

/**
 * Configuration options for TableSortManager
 */
export interface TableSortOptions {
    /** Locale used to compare text values (defaults to the document's) */
    locale?: string;
    /** Called after the rows have been reordered */
    onSort?: (columnIndex: number, direction: TableSortDirection) => void;
}

const SORT_BUTTON_CLASS = "ss-c-table__sort";

/**
 * Sorts table rows by a column's text, number or `data-sort-value`.
 *
 * A column is sortable when its header cell contains a
 * `button.ss-c-table__sort`, or carries `data-ss-sortable` (the manager then
 * wraps its content in that button). `data-ss-sort-type="number|text"` on
 * the `<th>` forces the comparison; by default numbers are detected.
 *
 * @example HTML with data-ss
 * ```html
 * <table class="ss-c-table" data-ss="table-sort">
 *     <thead><tr>
 *         <th aria-sort="ascending"><button class="ss-c-table__sort" type="button">Name</button></th>
 *         <th data-ss-sort-type="number"><button class="ss-c-table__sort" type="button">Size</button></th>
 *     </tr></thead>
 *     <tbody>
 *         <tr><td>alpha</td><td data-sort-value="1024">1 KB</td></tr>
 *     </tbody>
 * </table>
 * ```
 */
export class TableSortManager {
    private table: HTMLTableElement | null;
    private options: TableSortOptions;
    private collator: Intl.Collator;
    private headers: HTMLTableCellElement[] = [];

    constructor(
        selectorOrElement: string | HTMLTableElement,
        options: TableSortOptions = {},
    ) {
        this.table =
            typeof selectorOrElement === "string"
                ? document.querySelector<HTMLTableElement>(selectorOrElement)
                : selectorOrElement;
        this.options = options;
        this.collator = new Intl.Collator(
            options.locale ?? (document.documentElement.lang || undefined),
            { numeric: true, sensitivity: "base" },
        );

        if (!this.table || !this.table.tHead) {
            console.warn("[Stylescape] TableSortManager table not found");
            return;
        }

        this.init();
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /** Sort the body rows by a column and mark its header. */
    public sort(columnIndex: number, direction: TableSortDirection): void {
        if (!this.table) return;
        const header = this.headers.find((th) => th.cellIndex === columnIndex);
        const type = (header?.dataset.ssSortType as TableSortType) ?? "auto";

        Array.from(this.table.tBodies).forEach((tbody) => {
            const rows = Array.from(tbody.rows);
            const keyed = rows.map((row, position) => ({
                row,
                position,
                value: this.cellValue(row.cells[columnIndex]),
            }));
            const numeric =
                type === "number" ||
                (type === "auto" &&
                    keyed.every(
                        (k) =>
                            k.value === "" ||
                            !Number.isNaN(this.toNumber(k.value)),
                    ));
            const factor = direction === "ascending" ? 1 : -1;

            keyed.sort((a, b) => {
                const result = numeric
                    ? this.compareNumbers(a.value, b.value, factor)
                    : this.collator.compare(a.value, b.value) * factor;
                // Stable: equal keys keep their current order.
                return result || a.position - b.position;
            });
            keyed.forEach(({ row }) => tbody.appendChild(row));
        });

        this.headers.forEach((th) => {
            if (th === header) th.setAttribute("aria-sort", direction);
            else th.removeAttribute("aria-sort");
        });

        this.options.onSort?.(columnIndex, direction);
        this.table.dispatchEvent(
            new CustomEvent("ss:table-sort", {
                bubbles: true,
                detail: { columnIndex, direction },
            }),
        );
    }

    public destroy(): void {
        this.table?.tHead?.removeEventListener("click", this.handleClick);
        this.table = null;
        this.headers = [];
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private init(): void {
        const head = this.table!.tHead!;
        head.querySelectorAll<HTMLTableCellElement>("th").forEach((th) => {
            if (
                !th.querySelector(`.${SORT_BUTTON_CLASS}`) &&
                th.hasAttribute("data-ss-sortable")
            ) {
                const button = document.createElement("button");
                button.type = "button";
                button.className = SORT_BUTTON_CLASS;
                while (th.firstChild) button.appendChild(th.firstChild);
                th.appendChild(button);
            }
            if (th.querySelector(`.${SORT_BUTTON_CLASS}`)) {
                this.headers.push(th);
            }
        });
        head.addEventListener("click", this.handleClick);
    }

    private cellValue(cell: HTMLTableCellElement | undefined): string {
        if (!cell) return "";
        return (cell.dataset.sortValue ?? cell.textContent ?? "").trim();
    }

    private toNumber(value: string): number {
        if (value === "") return Number.NaN;
        return Number(value.replace(/[\s,_]/g, ""));
    }

    /** Numbers in `factor` order; blanks and non-numbers always sort last. */
    private compareNumbers(a: string, b: string, factor: number): number {
        const x = this.toNumber(a);
        const y = this.toNumber(b);
        const xBad = Number.isNaN(x);
        const yBad = Number.isNaN(y);
        if (xBad || yBad) return Number(xBad) - Number(yBad);
        return (x - y) * factor;
    }

    private handleClick = (event: MouseEvent): void => {
        const button = (event.target as HTMLElement).closest(
            `.${SORT_BUTTON_CLASS}`,
        );
        const th = button?.closest("th") as HTMLTableCellElement | null;
        if (!th || !this.headers.includes(th)) return;

        const next: TableSortDirection =
            th.getAttribute("aria-sort") === "ascending"
                ? "descending"
                : "ascending";
        this.sort(th.cellIndex, next);
    };
}
