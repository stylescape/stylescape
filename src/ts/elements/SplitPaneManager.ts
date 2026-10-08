// ============================================================================
// Stylescape | Split Pane Manager
// ============================================================================
// Resizable split panes and sidebars: a focusable separator that can be
// dragged with a pointer or moved with the keyboard (WAI-ARIA window
// splitter pattern), with min/max limits, an optional collapse toggle and
// optional persistence in localStorage.
// ============================================================================

/**
 * Configuration options for SplitPaneManager. Every option can also be set
 * on the handle element (attributes listed per option).
 */
export interface SplitPaneOptions {
    /** Smallest primary pane size in percent (`aria-valuemin`, default 10) */
    min?: number;
    /** Largest primary pane size in percent (`aria-valuemax`, default 90) */
    max?: number;
    /** Keyboard step in percent (`data-ss-split-step`, default 5) */
    step?: number;
    /** localStorage key to remember size and collapsed state (`data-ss-split-key`) */
    storageKey?: string;
    /** Custom property written on the root (`data-ss-split-property`, default `--ss-split-size`) */
    property?: string;
    /** Unit written to the property: `%` of the root, or `px` (`data-ss-split-unit`) */
    unit?: "%" | "px";
    /** Callback after every size change, with the size in percent */
    onResize?: (size: number) => void;
    /** Callback when the primary pane collapses or expands */
    onToggle?: (collapsed: boolean) => void;
}

interface StoredState {
    size: number;
    collapsed: boolean;
}

const HANDLE_SELECTOR = ".ss-c-split__handle, [data-ss-split-handle]";
const TOGGLE_SELECTOR = ".ss-c-split__toggle, [data-ss-split-toggle]";
const GUTTER_SELECTOR = ".ss-c-split__gutter";

/**
 * Accessible split pane / resizable sidebar.
 *
 * The handle is a `role="separator"` with `aria-controls` naming the
 * primary pane (the one being sized). Its `aria-valuenow` is that pane's
 * size in percent of the split root. Arrow keys move the separator, Home
 * and End jump to the minimum and maximum, Enter collapses or restores the
 * primary pane.
 *
 * @example HTML
 * ```html
 * <div class="ss-c-split">
 *     <div class="ss-c-split__pane ss-c-split__pane--primary" id="tree">…</div>
 *     <div class="ss-c-split__gutter">
 *         <div class="ss-c-split__handle" role="separator" tabindex="0"
 *              aria-orientation="vertical" aria-controls="tree"
 *              aria-valuenow="30" aria-valuemin="15" aria-valuemax="60"
 *              aria-label="Resize tree" data-ss-split-key="ifc-tree"></div>
 *         <button type="button" class="ss-c-split__toggle" aria-label="Tree"></button>
 *     </div>
 *     <div class="ss-c-split__pane">…</div>
 * </div>
 * ```
 *
 * @example JavaScript
 * ```typescript
 * SplitPaneManager.initAll()
 * ```
 */
export class SplitPaneManager {
    readonly handle: HTMLElement;
    readonly pane: HTMLElement;
    readonly root: HTMLElement;

    private readonly options: Required<
        Omit<SplitPaneOptions, "storageKey" | "onResize" | "onToggle">
    > &
        Pick<SplitPaneOptions, "storageKey" | "onResize" | "onToggle">;
    private readonly horizontal: boolean;
    private readonly paneAtStart: boolean;
    private readonly toggles: HTMLElement[];
    private size: number;
    private collapsed = false;
    private dragging = false;

    constructor(
        handleOrSelector: string | HTMLElement,
        options: SplitPaneOptions = {},
    ) {
        const handle =
            typeof handleOrSelector === "string"
                ? document.querySelector<HTMLElement>(handleOrSelector)
                : handleOrSelector;
        if (!handle) {
            throw new Error("SplitPaneManager: handle element not found");
        }
        this.handle = handle;

        const ds = handle.dataset;
        const num = (value: string | null | undefined, fallback: number) => {
            const n =
                value === null || value === undefined || value === ""
                    ? NaN
                    : Number(value);
            return Number.isFinite(n) ? n : fallback;
        };
        this.options = {
            min: options.min ?? num(handle.getAttribute("aria-valuemin"), 10),
            max: options.max ?? num(handle.getAttribute("aria-valuemax"), 90),
            step: options.step ?? num(ds.ssSplitStep, 5),
            storageKey: options.storageKey ?? ds.ssSplitKey,
            property:
                options.property ?? ds.ssSplitProperty ?? "--ss-split-size",
            unit: options.unit ?? (ds.ssSplitUnit === "px" ? "px" : "%"),
            onResize: options.onResize,
            onToggle: options.onToggle,
        };

        // A gutter wraps the handle when it also holds a collapse toggle (a
        // separator must not contain another focusable control).
        const strip = handle.closest<HTMLElement>(GUTTER_SELECTOR) ?? handle;
        const controls = handle.getAttribute("aria-controls");
        const pane =
            (controls && document.getElementById(controls)) ||
            strip.parentElement?.querySelector<HTMLElement>(
                ":scope > .ss-c-split__pane--primary",
            ) ||
            (strip.previousElementSibling as HTMLElement | null);
        if (!pane) {
            throw new Error("SplitPaneManager: primary pane not found");
        }
        this.pane = pane;

        this.root =
            handle.closest<HTMLElement>("[data-ss-split-root]") ||
            handle.closest<HTMLElement>(".ss-c-split") ||
            (pane.contains(handle) ? pane.parentElement : null) ||
            handle.parentElement ||
            document.documentElement;

        // aria-orientation is the separator's own orientation: a vertical
        // line splits panes side by side.
        this.horizontal =
            handle.getAttribute("aria-orientation") !== "horizontal";
        this.paneAtStart = pane.contains(handle)
            ? !handle.classList.contains("ss-c-split__handle--end") &&
              ds.ssSplitSide !== "end"
            : Boolean(
                  pane.compareDocumentPosition(strip) &
                  Node.DOCUMENT_POSITION_FOLLOWING,
              );

        this.toggles = [
            ...Array.from(
                strip === handle
                    ? []
                    : strip.querySelectorAll<HTMLElement>(TOGGLE_SELECTOR),
            ),
            ...Array.from(
                document.querySelectorAll<HTMLElement>(
                    "[data-ss-split-toggle][aria-controls]",
                ),
            ).filter(
                (el) =>
                    pane.id !== "" &&
                    el.getAttribute("aria-controls") === pane.id &&
                    !strip.contains(el),
            ),
        ];

        if (!handle.hasAttribute("role"))
            handle.setAttribute("role", "separator");
        if (!handle.hasAttribute("tabindex")) handle.tabIndex = 0;
        if (!handle.hasAttribute("aria-orientation")) {
            handle.setAttribute("aria-orientation", "vertical");
        }
        handle.setAttribute("aria-valuemin", String(this.options.min));
        handle.setAttribute("aria-valuemax", String(this.options.max));

        const stored = this.load();
        this.size = this.clamp(
            stored?.size ??
                num(handle.getAttribute("aria-valuenow"), NaN) ??
                NaN,
        );
        if (!Number.isFinite(this.size)) this.size = this.measure();
        this.apply();
        if (stored?.collapsed) this.collapse(false);
        else this.syncToggles();

        handle.addEventListener("pointerdown", this.onPointerDown);
        handle.addEventListener("keydown", this.onKeyDown);
        this.toggles.forEach((t) =>
            t.addEventListener("click", this.onToggleClick),
        );
    }

    // ========================================================================
    // Public API
    // ========================================================================

    /** Current primary pane size in percent of the root. */
    getSize(): number {
        return this.size;
    }

    isCollapsed(): boolean {
        return this.collapsed;
    }

    /** Set the primary pane size in percent (clamped to min/max). */
    setSize(size: number, persist = true): void {
        this.size = this.clamp(size);
        if (this.collapsed) this.expand(false);
        this.apply();
        if (persist) this.save();
        this.options.onResize?.(this.size);
    }

    collapse(persist = true): void {
        this.collapsed = true;
        this.pane.hidden = true;
        this.root.dataset.state = "collapsed";
        this.handle.setAttribute("aria-valuenow", "0");
        this.syncToggles();
        if (persist) this.save();
        this.options.onToggle?.(true);
    }

    expand(persist = true): void {
        this.collapsed = false;
        this.pane.hidden = false;
        if (this.root.dataset.state === "collapsed") {
            delete this.root.dataset.state;
        }
        this.apply();
        this.syncToggles();
        if (persist) this.save();
        this.options.onToggle?.(false);
    }

    toggle(): void {
        if (this.collapsed) this.expand();
        else this.collapse();
    }

    destroy(): void {
        this.handle.removeEventListener("pointerdown", this.onPointerDown);
        this.handle.removeEventListener("keydown", this.onKeyDown);
        this.handle.removeEventListener("pointermove", this.onPointerMove);
        this.handle.removeEventListener("pointerup", this.onPointerUp);
        this.handle.removeEventListener("pointercancel", this.onPointerUp);
        this.toggles.forEach((t) =>
            t.removeEventListener("click", this.onToggleClick),
        );
    }

    /** Initialise every split handle under `root`. */
    static initAll(root: ParentNode = document): SplitPaneManager[] {
        return Array.from(
            root.querySelectorAll<HTMLElement>(HANDLE_SELECTOR),
        ).map((handle) => new SplitPaneManager(handle));
    }

    // ========================================================================
    // Events
    // ========================================================================

    private onPointerDown = (event: PointerEvent): void => {
        if (event.button !== 0) return;
        if ((event.target as Element).closest(TOGGLE_SELECTOR)) return;
        event.preventDefault();
        this.dragging = true;
        this.handle.classList.add("is-dragging");
        this.handle.setPointerCapture?.(event.pointerId);
        this.handle.addEventListener("pointermove", this.onPointerMove);
        this.handle.addEventListener("pointerup", this.onPointerUp);
        this.handle.addEventListener("pointercancel", this.onPointerUp);
        this.handle.focus();
    };

    private onPointerMove = (event: PointerEvent): void => {
        if (!this.dragging) return;
        const rootRect = this.root.getBoundingClientRect();
        const total = this.horizontal ? rootRect.width : rootRect.height;
        if (total <= 0) return;
        // Measure from the pane's outer edge; if the pane is hidden
        // (collapsed), from the root's matching edge.
        const rect = this.collapsed
            ? rootRect
            : this.pane.getBoundingClientRect();
        const pointer = this.horizontal ? event.clientX : event.clientY;
        const start = this.horizontal ? rect.left : rect.top;
        const end = this.horizontal ? rect.right : rect.bottom;
        const px = this.paneAtStart ? pointer - start : end - pointer;
        this.setSize((px / total) * 100, false);
    };

    private onPointerUp = (event: PointerEvent): void => {
        this.dragging = false;
        this.handle.classList.remove("is-dragging");
        this.handle.releasePointerCapture?.(event.pointerId);
        this.handle.removeEventListener("pointermove", this.onPointerMove);
        this.handle.removeEventListener("pointerup", this.onPointerUp);
        this.handle.removeEventListener("pointercancel", this.onPointerUp);
        this.save();
    };

    private onKeyDown = (event: KeyboardEvent): void => {
        const forward = this.horizontal ? "ArrowRight" : "ArrowDown";
        const backward = this.horizontal ? "ArrowLeft" : "ArrowUp";
        // Moving the separator toward the far side grows a start pane.
        const sign = this.paneAtStart ? 1 : -1;
        const base = this.collapsed ? this.options.min : this.size;

        switch (event.key) {
            case forward:
                this.setSize(base + sign * this.options.step);
                break;
            case backward:
                this.setSize(base - sign * this.options.step);
                break;
            case "Home":
                this.setSize(this.options.min);
                break;
            case "End":
                this.setSize(this.options.max);
                break;
            case "Enter":
                this.toggle();
                break;
            default:
                return;
        }
        event.preventDefault();
    };

    private onToggleClick = (event: Event): void => {
        event.preventDefault();
        this.toggle();
    };

    // ========================================================================
    // Internals
    // ========================================================================

    private clamp(value: number): number {
        if (!Number.isFinite(value)) return value;
        return Math.min(this.options.max, Math.max(this.options.min, value));
    }

    private measure(): number {
        const rootRect = this.root.getBoundingClientRect();
        const paneRect = this.pane.getBoundingClientRect();
        const total = this.horizontal ? rootRect.width : rootRect.height;
        const part = this.horizontal ? paneRect.width : paneRect.height;
        const pct = total > 0 ? (part / total) * 100 : NaN;
        return this.clamp(
            Number.isFinite(pct) && pct > 0
                ? pct
                : (this.options.min + this.options.max) / 2,
        );
    }

    private apply(): void {
        const rounded = Math.round(this.size * 100) / 100;
        let value = `${rounded}%`;
        if (this.options.unit === "px") {
            const rect = this.root.getBoundingClientRect();
            const total = this.horizontal ? rect.width : rect.height;
            if (total > 0)
                value = `${Math.round((this.size / 100) * total)}px`;
        }
        this.root.style.setProperty(this.options.property, value);
        if (!this.collapsed) {
            this.handle.setAttribute(
                "aria-valuenow",
                String(Math.round(this.size)),
            );
        }
    }

    private syncToggles(): void {
        this.toggles.forEach((t) =>
            t.setAttribute("aria-expanded", String(!this.collapsed)),
        );
    }

    private load(): StoredState | null {
        if (!this.options.storageKey) return null;
        try {
            const raw = localStorage.getItem(this.options.storageKey);
            if (!raw) return null;
            const data = JSON.parse(raw) as Partial<StoredState>;
            return typeof data.size === "number"
                ? { size: data.size, collapsed: Boolean(data.collapsed) }
                : null;
        } catch {
            return null;
        }
    }

    private save(): void {
        if (!this.options.storageKey) return;
        try {
            localStorage.setItem(
                this.options.storageKey,
                JSON.stringify({ size: this.size, collapsed: this.collapsed }),
            );
        } catch {
            // Storage unavailable (private mode, quota): the size still
            // applies for this page view.
        }
    }
}
