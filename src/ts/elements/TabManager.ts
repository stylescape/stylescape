// ============================================================================
// Stylescape | TabManager
// ============================================================================
// WAI-ARIA tabs for the `ss-c-tab` module.
//
// Markup (either way of pairing tabs and panels works):
//
//   <div class="ss-c-tab" data-ss="tabs">
//     <div class="ss-c-tab__list" role="tablist" aria-label="…">
//       <button class="ss-c-tab__item" role="tab" aria-controls="p1">One</button>
//       <button class="ss-c-tab__item" data-ss-tab="p2">Two</button>
//     </div>
//     <div class="ss-c-tab__panel" id="p1" role="tabpanel">…</div>
//     <div class="ss-c-tab__panel" data-ss-tab-panel="p2">…</div>
//   </div>
//
// The manager fills in the missing roles, ids and ARIA links, shows one panel
// at a time (`hidden` on the others), keeps `aria-selected`, roving
// `tabindex` and `ss-c-tab__item--active` in sync, and supports Arrow keys,
// Home and End. It dispatches `ss:tab-change` on the root.
// ============================================================================

export interface TabManagerOptions {
    /** Tab to show first: its panel id or `data-ss-tab` value. */
    initial?: string;
    /** Arrow keys for a vertical tab list. */
    orientation?: "horizontal" | "vertical";
}

const ACTIVE_CLASS = "ss-c-tab__item--active";
let uid = 0;

export class TabManager {
    readonly root: HTMLElement;
    private readonly tabs: HTMLElement[];
    private readonly panels: HTMLElement[];
    private readonly orientation: "horizontal" | "vertical";
    private readonly onClick = (event: Event): void => {
        const tab = (event.target as Element | null)?.closest<HTMLElement>(
            "[data-ss-tab], [role='tab']",
        );
        if (tab && this.tabs.includes(tab)) this.select(tab);
    };
    private readonly onKeydown = (event: KeyboardEvent): void => {
        const current = this.tabs.indexOf(event.target as HTMLElement);
        if (current < 0) return;
        const next =
            this.orientation === "vertical" ? "ArrowDown" : "ArrowRight";
        const prev = this.orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
        let index: number | null = null;
        if (event.key === next) index = (current + 1) % this.tabs.length;
        else if (event.key === prev)
            index = (current - 1 + this.tabs.length) % this.tabs.length;
        else if (event.key === "Home") index = 0;
        else if (event.key === "End") index = this.tabs.length - 1;
        if (index === null) return;
        event.preventDefault();
        this.select(this.tabs[index]);
        this.tabs[index].focus();
    };

    constructor(root: HTMLElement | string, options: TabManagerOptions = {}) {
        const el =
            typeof root === "string"
                ? document.querySelector<HTMLElement>(root)
                : root;
        if (!el) throw new Error("TabManager: root element not found");
        this.root = el;
        this.orientation = options.orientation ?? "horizontal";

        this.tabs = Array.from(
            el.querySelectorAll<HTMLElement>("[data-ss-tab], [role='tab']"),
        );
        this.panels = this.tabs.map((tab) => this.panelFor(tab));

        const list = this.tabs[0]?.parentElement;
        if (list && !list.hasAttribute("role"))
            list.setAttribute("role", "tablist");
        if (list && this.orientation === "vertical")
            list.setAttribute("aria-orientation", "vertical");

        this.tabs.forEach((tab, i) => {
            const panel = this.panels[i];
            tab.setAttribute("role", "tab");
            if (!tab.id) tab.id = `ss-tab-${++uid}`;
            if (panel) {
                if (!panel.id) panel.id = `ss-tab-panel-${++uid}`;
                tab.setAttribute("aria-controls", panel.id);
                panel.setAttribute("role", "tabpanel");
                panel.setAttribute("aria-labelledby", tab.id);
                if (!panel.hasAttribute("tabindex")) panel.tabIndex = 0;
            }
        });

        el.addEventListener("click", this.onClick);
        el.addEventListener("keydown", this.onKeydown);

        const initial =
            (options.initial && this.find(options.initial)) ||
            this.tabs.find(
                (t) => t.getAttribute("aria-selected") === "true",
            ) ||
            this.tabs.find((t) => t.classList.contains(ACTIVE_CLASS)) ||
            this.tabs[0];
        if (initial) this.select(initial, false);
    }

    /** The selected tab, if any. */
    get selected(): HTMLElement | undefined {
        return this.tabs.find(
            (t) => t.getAttribute("aria-selected") === "true",
        );
    }

    /** Select a tab by element, panel id or `data-ss-tab` value. */
    select(target: HTMLElement | string, notify = true): void {
        const tab = typeof target === "string" ? this.find(target) : target;
        if (!tab) return;
        this.tabs.forEach((t, i) => {
            const on = t === tab;
            t.setAttribute("aria-selected", String(on));
            t.tabIndex = on ? 0 : -1;
            t.classList.toggle(ACTIVE_CLASS, on);
            const panel = this.panels[i];
            if (panel) panel.hidden = !on;
        });
        if (notify) {
            this.root.dispatchEvent(
                new CustomEvent("ss:tab-change", {
                    bubbles: true,
                    detail: {
                        tab,
                        panel: this.panels[this.tabs.indexOf(tab)],
                    },
                }),
            );
        }
    }

    /** Alias of `select()` (the API of the earlier inline registry handler). */
    activate(target: HTMLElement | string): void {
        this.select(target);
    }

    destroy(): void {
        this.root.removeEventListener("click", this.onClick);
        this.root.removeEventListener("keydown", this.onKeydown);
    }

    /** Bind every `[data-ss="tabs"]` (or given selector) under `root`. */
    static initAll(
        root: ParentNode = document,
        selector = "[data-ss='tabs']",
    ): TabManager[] {
        return Array.from(root.querySelectorAll<HTMLElement>(selector)).map(
            (el) => new TabManager(el),
        );
    }

    private find(key: string): HTMLElement | undefined {
        return this.tabs.find(
            (t) =>
                t.getAttribute("data-ss-tab") === key ||
                t.getAttribute("aria-controls") === key,
        );
    }

    private panelFor(tab: HTMLElement): HTMLElement {
        const key = tab.getAttribute("data-ss-tab");
        const controls = tab.getAttribute("aria-controls");
        const byKey = key
            ? Array.from(
                  this.root.querySelectorAll<HTMLElement>(
                      "[data-ss-tab-panel]",
                  ),
              ).find((p) => p.getAttribute("data-ss-tab-panel") === key)
            : undefined;
        const panel =
            byKey ||
            (key && document.getElementById(key)) ||
            (controls && document.getElementById(controls));
        return panel as HTMLElement;
    }
}

export default TabManager;
