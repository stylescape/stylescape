// ============================================================================
// Stylescape | Sheet Manager
// ============================================================================
// Opens and closes a bottom sheet, side dock or app-shell sidebar by
// toggling `data-state="open" | "closed"` on it, keeping `aria-expanded`
// on every button that controls it in sync. Escape closes an overlaying
// panel and returns focus to the button that opened it.
// ============================================================================

export type SheetState = "open" | "closed";

export interface SheetOptions {
    /** Callback after the state changes */
    onChange?: (open: boolean, panel: HTMLElement) => void;
}

const SHEET_CLASS = "ss-c-sheet";
const HANDLE_SELECTOR = ".ss-c-sheet__handle";

/**
 * Toggle behaviour for `ss-c-sheet` panels and `ss-l-app__sidebar`s.
 *
 * Controls are the sheet's own `.ss-c-sheet__handle` plus any button with
 * `data-ss-sheet-toggle` and `aria-controls` naming the panel. Arrow keys
 * on a sheet handle open and close it in the direction of its edge.
 *
 * @example HTML
 * ```html
 * <button type="button" data-ss-sheet-toggle aria-controls="layers">Layers</button>
 * <section class="ss-c-sheet" id="layers" data-state="closed" aria-label="Layers">
 *     <button type="button" class="ss-c-sheet__handle" aria-controls="layers">Layers</button>
 *     <div class="ss-c-sheet__body">…</div>
 * </section>
 * ```
 *
 * @example JavaScript
 * ```typescript
 * SheetManager.initAll()
 * ```
 */
export class SheetManager {
    readonly panel: HTMLElement;
    private readonly toggles: HTMLElement[];
    private readonly options: SheetOptions;
    private returnFocus: HTMLElement | null = null;

    constructor(
        panelOrSelector: string | HTMLElement,
        options: SheetOptions = {},
    ) {
        const panel =
            typeof panelOrSelector === "string"
                ? document.querySelector<HTMLElement>(panelOrSelector)
                : panelOrSelector;
        if (!panel) throw new Error("SheetManager: panel element not found");
        this.panel = panel;
        this.options = options;

        const own = Array.from(
            panel.querySelectorAll<HTMLElement>(`:scope > ${HANDLE_SELECTOR}`),
        );
        const external = panel.id
            ? Array.from(
                  document.querySelectorAll<HTMLElement>(
                      "[data-ss-sheet-toggle][aria-controls]",
                  ),
              ).filter((t) => t.getAttribute("aria-controls") === panel.id)
            : [];
        this.toggles = [...new Set([...own, ...external])];

        if (panel.id) {
            this.toggles.forEach((t) => {
                if (!t.hasAttribute("aria-controls")) {
                    t.setAttribute("aria-controls", panel.id);
                }
            });
        }
        this.sync();

        this.toggles.forEach((t) => {
            t.addEventListener("click", this.onToggleClick);
            t.addEventListener("keydown", this.onToggleKeyDown);
        });
        panel.addEventListener("keydown", this.onPanelKeyDown);
    }

    // ========================================================================
    // Public API
    // ========================================================================

    isOpen(): boolean {
        const state = this.panel.dataset.state;
        if (state === "open") return true;
        if (state === "closed") return false;
        // No state yet: a sheet starts closed; any other panel (a sidebar)
        // is open when the stylesheet currently shows it.
        if (this.panel.classList.contains(SHEET_CLASS)) return false;
        return getComputedStyle(this.panel).display !== "none";
    }

    open(): void {
        this.setState("open");
    }

    close(): void {
        this.setState("closed");
    }

    toggle(): void {
        this.setState(this.isOpen() ? "closed" : "open");
    }

    destroy(): void {
        this.toggles.forEach((t) => {
            t.removeEventListener("click", this.onToggleClick);
            t.removeEventListener("keydown", this.onToggleKeyDown);
        });
        this.panel.removeEventListener("keydown", this.onPanelKeyDown);
    }

    /**
     * Initialise every `ss-c-sheet` and every panel named by a
     * `[data-ss-sheet-toggle]` button under `root`.
     */
    static initAll(root: ParentNode = document): SheetManager[] {
        const panels = new Set<HTMLElement>(
            Array.from(
                root.querySelectorAll<HTMLElement>(
                    `.${SHEET_CLASS}, [data-ss="sheet"]`,
                ),
            ),
        );
        root.querySelectorAll<HTMLElement>(
            "[data-ss-sheet-toggle][aria-controls]",
        ).forEach((t) => {
            const target = document.getElementById(
                t.getAttribute("aria-controls") as string,
            );
            if (target) panels.add(target);
        });
        return Array.from(panels).map((panel) => new SheetManager(panel));
    }

    // ========================================================================
    // Internals
    // ========================================================================

    private setState(state: SheetState): void {
        const wasOpen = this.isOpen();
        this.panel.dataset.state = state;
        this.sync();
        const open = state === "open";
        if (open !== wasOpen) {
            this.options.onChange?.(open, this.panel);
            this.panel.dispatchEvent(
                new CustomEvent("ss:sheet-toggle", {
                    detail: { open },
                    bubbles: true,
                }),
            );
        }
    }

    private sync(): void {
        const open = this.isOpen();
        this.toggles.forEach((t) =>
            t.setAttribute("aria-expanded", String(open)),
        );
    }

    /** True when the panel floats over other content (Escape may close it). */
    private overlays(): boolean {
        if (this.panel.classList.contains(SHEET_CLASS)) return true;
        const position = getComputedStyle(this.panel).position;
        return position === "absolute" || position === "fixed";
    }

    private onToggleClick = (event: Event): void => {
        event.preventDefault();
        if (!this.isOpen())
            this.returnFocus = event.currentTarget as HTMLElement;
        this.toggle();
    };

    private onToggleKeyDown = (event: KeyboardEvent): void => {
        const handle = event.currentTarget as HTMLElement;
        if (!handle.matches(HANDLE_SELECTOR)) return;
        const list = this.panel.classList;
        const [openKey, closeKey] = list.contains(`${SHEET_CLASS}--left`)
            ? ["ArrowRight", "ArrowLeft"]
            : list.contains(`${SHEET_CLASS}--right`)
              ? ["ArrowLeft", "ArrowRight"]
              : ["ArrowUp", "ArrowDown"];
        if (event.key === openKey) this.open();
        else if (event.key === closeKey) this.close();
        else return;
        event.preventDefault();
    };

    private onPanelKeyDown = (event: KeyboardEvent): void => {
        if (event.key !== "Escape" || !this.isOpen() || !this.overlays())
            return;
        event.preventDefault();
        event.stopPropagation();
        this.close();
        const target = this.returnFocus ?? this.toggles[0] ?? null;
        this.returnFocus = null;
        target?.focus();
    };
}
