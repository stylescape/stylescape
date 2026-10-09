// ============================================================================
// Stylescape | DropdownManager
// ============================================================================
// Menu-button behaviour for the `ss-c-dropdown` module.
//
//   <div class="ss-c-dropdown" data-ss="dropdown-menu">
//     <button class="ss-c-button" aria-haspopup="true">Sort</button>
//     <ul class="ss-c-dropdown__menu">
//       <li><a class="ss-c-dropdown__item" href="?sort=name">Name</a></li>
//     </ul>
//   </div>
//
// The trigger is `[data-ss-dropdown-toggle]`, else `[aria-haspopup]`, else
// the first button. The manager toggles `is-open` on the root (the module
// hides the menu without it), keeps `aria-expanded`/`aria-controls` on the
// trigger, closes on Escape (returning focus) and on a click outside, and
// moves focus through the items with the arrow keys, Home and End.
//
// A native `<details class="ss-c-dropdown">` opens by itself; the manager
// only adds closing on Escape and on a click outside.
// ============================================================================

const ITEMS =
    ".ss-c-dropdown__menu a[href], .ss-c-dropdown__menu button:not([disabled]), .ss-c-dropdown__menu [role='menuitem']";
let uid = 0;

export class DropdownManager {
    readonly root: HTMLElement;
    readonly trigger: HTMLElement | null;
    readonly menu: HTMLElement | null;
    private readonly isDetails: boolean;

    private readonly onTriggerClick = (event: Event): void => {
        event.preventDefault();
        this.toggle();
    };
    private readonly onDocumentClick = (event: Event): void => {
        if (this.isOpen && !this.root.contains(event.target as Node)) {
            this.close(false);
        }
    };
    private readonly onKeydown = (event: KeyboardEvent): void => {
        if (event.key === "Escape" && this.isOpen) {
            event.preventDefault();
            this.close(true);
            return;
        }
        if (this.isDetails) return;
        const items = this.items();
        if (!items.length) return;
        const current = items.indexOf(document.activeElement as HTMLElement);
        let next: number | null = null;
        if (event.key === "ArrowDown")
            next = current < 0 ? 0 : (current + 1) % items.length;
        else if (event.key === "ArrowUp")
            next =
                current < 0
                    ? items.length - 1
                    : (current - 1 + items.length) % items.length;
        else if (event.key === "Home" && current >= 0) next = 0;
        else if (event.key === "End" && current >= 0) next = items.length - 1;
        if (next === null) return;
        event.preventDefault();
        if (!this.isOpen) this.open();
        items[next].focus();
    };

    constructor(root: HTMLElement | string) {
        const el =
            typeof root === "string"
                ? document.querySelector<HTMLElement>(root)
                : root;
        if (!el) throw new Error("DropdownManager: root element not found");
        this.root = el;
        this.isDetails = el instanceof HTMLDetailsElement;
        this.menu = el.querySelector<HTMLElement>(".ss-c-dropdown__menu");
        this.trigger = this.isDetails
            ? el.querySelector<HTMLElement>("summary")
            : el.querySelector<HTMLElement>("[data-ss-dropdown-toggle]") ||
              el.querySelector<HTMLElement>("[aria-haspopup]") ||
              el.querySelector<HTMLElement>("button");

        if (!this.isDetails && this.trigger) {
            if (this.menu) {
                if (!this.menu.id) this.menu.id = `ss-dropdown-${++uid}`;
                this.trigger.setAttribute("aria-controls", this.menu.id);
            }
            this.trigger.setAttribute(
                "aria-expanded",
                String(el.classList.contains("is-open")),
            );
            this.trigger.addEventListener("click", this.onTriggerClick);
        }
        el.addEventListener("keydown", this.onKeydown);
        document.addEventListener("click", this.onDocumentClick);
    }

    get isOpen(): boolean {
        return this.isDetails
            ? (this.root as HTMLDetailsElement).open
            : this.root.classList.contains("is-open");
    }

    open(): void {
        this.set(true);
    }

    close(returnFocus = false): void {
        this.set(false);
        if (returnFocus) this.trigger?.focus();
    }

    toggle(): void {
        this.set(!this.isOpen);
    }

    destroy(): void {
        this.trigger?.removeEventListener("click", this.onTriggerClick);
        this.root.removeEventListener("keydown", this.onKeydown);
        document.removeEventListener("click", this.onDocumentClick);
    }

    /** Bind every `[data-ss="dropdown-menu"]` under `root`. */
    static initAll(root: ParentNode = document): DropdownManager[] {
        return Array.from(
            root.querySelectorAll<HTMLElement>("[data-ss='dropdown-menu']"),
        ).map((el) => new DropdownManager(el));
    }

    private set(open: boolean): void {
        if (this.isDetails) {
            (this.root as HTMLDetailsElement).open = open;
            return;
        }
        this.root.classList.toggle("is-open", open);
        this.trigger?.setAttribute("aria-expanded", String(open));
    }

    private items(): HTMLElement[] {
        return Array.from(this.root.querySelectorAll<HTMLElement>(ITEMS));
    }
}

export default DropdownManager;
