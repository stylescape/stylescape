// ============================================================================
// Stylescape | Context Menu Manager
// ============================================================================
// Opens a `.ss-c-context-menu` from a right click on its target, or from
// Shift+F10 / the ContextMenu key while the target has focus. Positions the
// menu inside the viewport, moves focus through the items with the arrow
// keys and returns focus to where it came from on close.
// ============================================================================

/**
 * Configuration options for ContextMenuManager
 */
export interface ContextMenuOptions {
    /** Element (or selector) that opens the menu. Defaults to the element
     *  named by the menu's `data-ss-context-menu-target`. */
    target?: string | HTMLElement;
    /** Gap kept between the menu and the viewport edge, in px */
    viewportMargin?: number;
    /** Called when an enabled item is activated */
    onSelect?: (item: HTMLElement, menu: HTMLElement) => void;
    /** Called after the menu opens */
    onOpen?: (menu: HTMLElement) => void;
    /** Called after the menu closes */
    onClose?: (menu: HTMLElement) => void;
}

const ITEM_SELECTOR =
    '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';

/**
 * Context menu with keyboard support and viewport-aware placement.
 *
 * @example HTML with data-ss
 * ```html
 * <div class="ss-c-viewport" tabindex="0"
 *      data-ss="context-menu" data-ss-context-menu-menu="layer-menu">…</div>
 * <div class="ss-c-context-menu" id="layer-menu" role="menu"
 *      aria-label="Layer actions" hidden>
 *     <button class="ss-c-context-menu__item" role="menuitem" type="button">Copy</button>
 * </div>
 * ```
 *
 * @example JavaScript
 * ```typescript
 * const menu = new ContextMenuManager("#layer-menu", {
 *     target: "#canvas",
 *     onSelect: (item) => console.log(item.dataset.action),
 * })
 * ```
 */
export class ContextMenuManager {
    private menu: HTMLElement | null;
    private target: HTMLElement | null;
    private options: Required<Omit<ContextMenuOptions, "target">>;
    private returnFocus: HTMLElement | null = null;
    private typeahead = "";
    private typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

    constructor(
        menuOrSelector: string | HTMLElement,
        options: ContextMenuOptions = {},
    ) {
        this.menu =
            typeof menuOrSelector === "string"
                ? document.querySelector<HTMLElement>(menuOrSelector)
                : menuOrSelector;

        const target =
            options.target ?? this.menu?.dataset.ssContextMenuTarget ?? null;
        this.target =
            typeof target === "string"
                ? document.querySelector<HTMLElement>(target)
                : target;

        this.options = {
            viewportMargin: options.viewportMargin ?? 8,
            onSelect: options.onSelect ?? (() => {}),
            onOpen: options.onOpen ?? (() => {}),
            onClose: options.onClose ?? (() => {}),
        };

        if (!this.menu || !this.target) {
            console.warn(
                "[Stylescape] ContextMenuManager menu or target not found",
            );
            return;
        }

        this.init();
    }

    // ========================================================================
    // Public API
    // ========================================================================

    /** Whether the menu is currently shown */
    get isOpen(): boolean {
        return !!this.menu && !this.menu.hidden;
    }

    /**
     * Open the menu with its top-left corner at viewport coordinates
     * (`x`, `y`), shifted as needed to stay inside the viewport.
     */
    public openAt(x: number, y: number): void {
        if (!this.menu) return;
        if (!this.isOpen) {
            const active = document.activeElement;
            this.returnFocus =
                active instanceof HTMLElement && active !== document.body
                    ? active
                    : this.target;
        }
        this.menu.hidden = false;
        this.position(x, y);
        this.focusItem(this.items()[0]);
        document.addEventListener("pointerdown", this.handleOutside, true);
        window.addEventListener("resize", this.handleViewportChange);
        window.addEventListener("scroll", this.handleViewportChange, true);
        this.options.onOpen(this.menu);
    }

    /** Close the menu; focus returns to the element that had it. */
    public close(restoreFocus = true): void {
        if (!this.menu || !this.isOpen) return;
        this.menu.hidden = true;
        this.removeGlobalListeners();
        if (restoreFocus) this.returnFocus?.focus();
        this.returnFocus = null;
        this.options.onClose(this.menu);
    }

    /** Remove every listener and close the menu. */
    public destroy(): void {
        this.close(false);
        this.target?.removeEventListener(
            "contextmenu",
            this.handleContextMenu,
        );
        this.target?.removeEventListener("keydown", this.handleTargetKeydown);
        this.menu?.removeEventListener("keydown", this.handleMenuKeydown);
        this.menu?.removeEventListener("click", this.handleClick);
        clearTimeout(this.typeaheadTimer);
        this.menu = null;
        this.target = null;
    }

    // ========================================================================
    // Setup
    // ========================================================================

    private init(): void {
        if (!this.menu || !this.target) return;

        this.menu.setAttribute(
            "role",
            this.menu.getAttribute("role") ?? "menu",
        );
        this.menu.hidden = true;
        if (!this.menu.hasAttribute("tabindex")) this.menu.tabIndex = -1;
        this.items(true).forEach((item) => {
            if (!item.getAttribute("role"))
                item.setAttribute("role", "menuitem");
            item.tabIndex = -1;
        });

        this.target.addEventListener("contextmenu", this.handleContextMenu);
        this.target.addEventListener("keydown", this.handleTargetKeydown);
        this.menu.addEventListener("keydown", this.handleMenuKeydown);
        this.menu.addEventListener("click", this.handleClick);
    }

    /** Menu items; `all` includes disabled ones. */
    private items(all = false): HTMLElement[] {
        if (!this.menu) return [];
        const found = Array.from(
            this.menu.querySelectorAll<HTMLElement>(
                `${ITEM_SELECTOR}, .ss-c-context-menu__item`,
            ),
        );
        return all
            ? found
            : found.filter(
                  (item) =>
                      item.getAttribute("aria-disabled") !== "true" &&
                      !(item as HTMLButtonElement).disabled,
              );
    }

    private focusItem(item: HTMLElement | undefined): void {
        if (item) item.focus();
        else this.menu?.focus();
    }

    private position(x: number, y: number): void {
        if (!this.menu) return;
        const margin = this.options.viewportMargin;
        const rect = this.menu.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width - margin;
        const maxY = window.innerHeight - rect.height - margin;
        // Flip above the point when it doesn't fit below.
        const top =
            y > maxY && y - rect.height >= margin ? y - rect.height : y;
        this.menu.style.left = `${Math.max(margin, Math.min(x, maxX))}px`;
        this.menu.style.top = `${Math.max(margin, Math.min(top, maxY))}px`;
    }

    private removeGlobalListeners(): void {
        document.removeEventListener("pointerdown", this.handleOutside, true);
        window.removeEventListener("resize", this.handleViewportChange);
        window.removeEventListener("scroll", this.handleViewportChange, true);
    }

    // ========================================================================
    // Event handlers
    // ========================================================================

    private handleContextMenu = (event: MouseEvent): void => {
        event.preventDefault();
        // A keyboard-generated contextmenu reports (0, 0); place it by the
        // focused element instead.
        if (event.clientX === 0 && event.clientY === 0)
            this.openFromKeyboard();
        else this.openAt(event.clientX, event.clientY);
    };

    private handleTargetKeydown = (event: KeyboardEvent): void => {
        if (
            (event.shiftKey && event.key === "F10") ||
            event.key === "ContextMenu"
        ) {
            event.preventDefault();
            this.openFromKeyboard();
        }
    };

    private openFromKeyboard(): void {
        const origin =
            document.activeElement instanceof HTMLElement &&
            this.target?.contains(document.activeElement)
                ? document.activeElement
                : this.target;
        const rect = origin?.getBoundingClientRect();
        this.openAt(rect?.left ?? 0, rect?.bottom ?? 0);
    }

    private handleMenuKeydown = (event: KeyboardEvent): void => {
        const items = this.items();
        const index = items.indexOf(document.activeElement as HTMLElement);

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                this.focusItem(items[(index + 1) % items.length]);
                break;
            case "ArrowUp":
                event.preventDefault();
                this.focusItem(
                    items[(index - 1 + items.length) % items.length],
                );
                break;
            case "Home":
                event.preventDefault();
                this.focusItem(items[0]);
                break;
            case "End":
                event.preventDefault();
                this.focusItem(items[items.length - 1]);
                break;
            case "Escape":
                event.preventDefault();
                this.close();
                break;
            case "Tab":
                event.preventDefault();
                this.close();
                break;
            case "Enter":
            case " ":
                if (
                    index >= 0 &&
                    !(items[index] instanceof HTMLButtonElement)
                ) {
                    event.preventDefault();
                    items[index].click();
                }
                break;
            default:
                if (
                    event.key.length === 1 &&
                    !event.ctrlKey &&
                    !event.metaKey &&
                    !event.altKey
                ) {
                    this.matchTypeahead(event.key, items, index);
                }
        }
    };

    private matchTypeahead(
        char: string,
        items: HTMLElement[],
        index: number,
    ): void {
        clearTimeout(this.typeaheadTimer);
        this.typeahead += char.toLowerCase();
        this.typeaheadTimer = setTimeout(() => (this.typeahead = ""), 500);
        const ordered = [
            ...items.slice(index + 1),
            ...items.slice(0, index + 1),
        ];
        const match = ordered.find((item) =>
            (item.textContent ?? "")
                .trim()
                .toLowerCase()
                .startsWith(this.typeahead),
        );
        if (match) match.focus();
    }

    private handleClick = (event: MouseEvent): void => {
        if (!this.menu) return;
        const item = (event.target as HTMLElement).closest<HTMLElement>(
            `${ITEM_SELECTOR}, .ss-c-context-menu__item`,
        );
        if (!item || !this.menu.contains(item)) return;
        if (item.getAttribute("aria-disabled") === "true") {
            event.preventDefault();
            return;
        }
        if (item.getAttribute("role") === "menuitemcheckbox") {
            item.setAttribute(
                "aria-checked",
                String(item.getAttribute("aria-checked") !== "true"),
            );
        }
        const menu = this.menu;
        this.options.onSelect(item, menu);
        menu.dispatchEvent(
            new CustomEvent("ss:context-menu:select", {
                bubbles: true,
                detail: { item },
            }),
        );
        this.close();
    };

    private handleOutside = (event: Event): void => {
        if (this.menu && !this.menu.contains(event.target as Node)) {
            this.close(false);
        }
    };

    private handleViewportChange = (event: Event): void => {
        if (
            event.type === "scroll" &&
            this.menu?.contains(event.target as Node)
        )
            return;
        this.close(false);
    };
}
