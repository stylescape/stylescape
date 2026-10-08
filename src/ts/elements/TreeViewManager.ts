// ============================================================================
// Stylescape | Tree View Manager
// ============================================================================
// Turns nested lists into a WAI-ARIA tree (role=tree/treeitem/group) with
// a roving tabindex, arrow-key navigation, Home/End, "*" and type-ahead.
// Supports data-ss="tree" for declarative initialisation.
// ============================================================================

/**
 * Configuration options for TreeViewManager
 */
export interface TreeViewOptions {
    /** Select an item as soon as it receives focus */
    selectOnFocus?: boolean;
    /** Jump to items by typing the start of their label */
    typeahead?: boolean;
    /** Milliseconds before the type-ahead buffer resets */
    typeaheadTimeout?: number;
    /** Called when an item is selected */
    onSelect?: (item: HTMLElement) => void;
    /** Called when a branch expands or collapses */
    onToggle?: (item: HTMLElement, expanded: boolean) => void;
}

const ITEM_CLASS = "ss-c-tree__item";
const LABEL_CLASS = "ss-c-tree__label";
const GROUP_CLASS = "ss-c-tree__group";

/**
 * Accessible tree view built from nested `<ul>`/`<ol>` lists.
 *
 * @example JavaScript
 * ```typescript
 * const tree = new TreeViewManager("#model-tree", {
 *     onSelect: (item) => console.log(item.dataset.id),
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <ul class="ss-c-tree" data-ss="tree" aria-label="Model">
 *     <li aria-expanded="true">
 *         <span class="ss-c-tree__label">Building</span>
 *         <ul>
 *             <li><span class="ss-c-tree__label">Storey 1</span></li>
 *         </ul>
 *     </li>
 * </ul>
 * ```
 */
export class TreeViewManager {
    private tree: HTMLElement | null;
    private options: Required<Omit<TreeViewOptions, "onSelect" | "onToggle">> &
        Pick<TreeViewOptions, "onSelect" | "onToggle">;
    private typeaheadBuffer = "";
    private typeaheadTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(
        selectorOrElement: string | HTMLElement,
        options: TreeViewOptions = {},
    ) {
        this.tree =
            typeof selectorOrElement === "string"
                ? document.querySelector<HTMLElement>(selectorOrElement)
                : selectorOrElement;

        this.options = {
            selectOnFocus: options.selectOnFocus ?? false,
            typeahead: options.typeahead ?? true,
            typeaheadTimeout: options.typeaheadTimeout ?? 500,
            onSelect: options.onSelect,
            onToggle: options.onToggle,
        };

        if (!this.tree) {
            console.warn("[Stylescape] TreeViewManager element not found");
            return;
        }

        this.init();
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /** All tree items in document order. */
    public get items(): HTMLElement[] {
        if (!this.tree) return [];
        return Array.from(
            this.tree.querySelectorAll<HTMLElement>('[role="treeitem"]'),
        );
    }

    /** Items not hidden inside a collapsed branch, in document order. */
    public get visibleItems(): HTMLElement[] {
        return this.items.filter((item) => this.isVisible(item));
    }

    /** The selected item, if any. */
    public get selected(): HTMLElement | null {
        return (
            this.tree?.querySelector<HTMLElement>(
                '[role="treeitem"][aria-selected="true"]',
            ) ?? null
        );
    }

    public expand(item: HTMLElement): void {
        this.setExpanded(item, true);
    }

    public collapse(item: HTMLElement): void {
        this.setExpanded(item, false);
    }

    public toggle(item: HTMLElement): void {
        if (!this.isBranch(item)) return;
        this.setExpanded(item, item.getAttribute("aria-expanded") !== "true");
    }

    public expandAll(): void {
        this.items
            .filter((i) => this.isBranch(i))
            .forEach((i) => this.expand(i));
    }

    public collapseAll(): void {
        this.items
            .filter((i) => this.isBranch(i))
            .forEach((i) => this.collapse(i));
        const current = this.items.find((i) => i.tabIndex === 0);
        if (current && !this.isVisible(current)) {
            this.focusItem(this.visibleItems[0], false);
        }
    }

    /** Select an item (single selection) and make it the tab stop. */
    public select(item: HTMLElement): void {
        this.items.forEach((i) => {
            if (i !== item) i.removeAttribute("aria-selected");
        });
        item.setAttribute("aria-selected", "true");
        this.setTabStop(item);
        this.options.onSelect?.(item);
        this.tree?.dispatchEvent(
            new CustomEvent("ss:tree-select", {
                bubbles: true,
                detail: { item },
            }),
        );
    }

    /** Move focus to an item, expanding its ancestors first. */
    public focusItem(item: HTMLElement | undefined, focus = true): void {
        if (!item) return;
        let parent = this.parentItem(item);
        while (parent) {
            this.setExpanded(parent, true);
            parent = this.parentItem(parent);
        }
        this.setTabStop(item);
        if (focus) item.focus();
    }

    public destroy(): void {
        if (!this.tree) return;
        this.tree.removeEventListener("keydown", this.handleKeydown);
        this.tree.removeEventListener("click", this.handleClick);
        this.tree.removeEventListener("focusin", this.handleFocusin);
        if (this.typeaheadTimer) clearTimeout(this.typeaheadTimer);
        this.tree = null;
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private init(): void {
        const tree = this.tree!;
        tree.setAttribute("role", "tree");

        tree.querySelectorAll<HTMLElement>("li").forEach((li) => {
            li.setAttribute("role", "treeitem");
            li.classList.add(ITEM_CLASS);
            li.tabIndex = -1;

            const group = Array.from(li.children).find(
                (child) => child.tagName === "UL" || child.tagName === "OL",
            ) as HTMLElement | undefined;

            this.ensureLabel(li, group);

            if (group) {
                group.setAttribute("role", "group");
                group.classList.add(GROUP_CLASS);
                if (li.getAttribute("aria-expanded") !== "true") {
                    li.setAttribute("aria-expanded", "false");
                }
            } else {
                li.removeAttribute("aria-expanded");
            }

            // Links and buttons inside a row would add extra tab stops.
            li.querySelectorAll<HTMLElement>(
                `:scope > .${LABEL_CLASS} a[href], :scope > .${LABEL_CLASS} button`,
            ).forEach((el) => (el.tabIndex = -1));
        });

        const first = this.selected ?? this.visibleItems[0];
        if (first) this.focusItem(first, false);

        tree.addEventListener("keydown", this.handleKeydown);
        tree.addEventListener("click", this.handleClick);
        tree.addEventListener("focusin", this.handleFocusin);
    }

    /** Wrap loose row content in a label element so it can be styled. */
    private ensureLabel(li: HTMLElement, group?: HTMLElement): void {
        const existing = Array.from(li.children).find((c) =>
            c.classList.contains(LABEL_CLASS),
        );
        if (existing) return;
        const label = document.createElement("span");
        label.className = LABEL_CLASS;
        Array.from(li.childNodes)
            .filter((node) => node !== group)
            .forEach((node) => label.appendChild(node));
        li.insertBefore(label, group ?? null);
    }

    private isBranch(item: HTMLElement): boolean {
        return item.hasAttribute("aria-expanded");
    }

    private parentItem(item: HTMLElement): HTMLElement | null {
        const parent =
            item.parentElement?.closest<HTMLElement>('[role="treeitem"]');
        return parent && this.tree?.contains(parent) ? parent : null;
    }

    private isVisible(item: HTMLElement): boolean {
        let parent = this.parentItem(item);
        while (parent) {
            if (parent.getAttribute("aria-expanded") !== "true") return false;
            parent = this.parentItem(parent);
        }
        return true;
    }

    private childItems(item: HTMLElement): HTMLElement[] {
        const group = item.querySelector<HTMLElement>(
            ':scope > [role="group"]',
        );
        if (!group) return [];
        return Array.from(group.children).filter(
            (c) => c.getAttribute("role") === "treeitem",
        ) as HTMLElement[];
    }

    private labelText(item: HTMLElement): string {
        const label = item.querySelector(`:scope > .${LABEL_CLASS}`);
        return (label?.textContent ?? "").trim().toLowerCase();
    }

    private setExpanded(item: HTMLElement, expanded: boolean): void {
        if (!this.isBranch(item)) return;
        const current = item.getAttribute("aria-expanded") === "true";
        if (current === expanded) return;
        item.setAttribute("aria-expanded", String(expanded));
        this.options.onToggle?.(item, expanded);
        this.tree?.dispatchEvent(
            new CustomEvent("ss:tree-toggle", {
                bubbles: true,
                detail: { item, expanded },
            }),
        );
    }

    private setTabStop(item: HTMLElement): void {
        this.items.forEach((i) => (i.tabIndex = i === item ? 0 : -1));
    }

    private move(from: HTMLElement, to: HTMLElement | undefined): void {
        if (!to || to === from) return;
        this.focusItem(to);
        if (this.options.selectOnFocus) this.select(to);
    }

    /** Enter: branches toggle, leaves follow their link (whose click also
     * selects the row through the click handler). */
    private activate(item: HTMLElement): void {
        const link = this.isBranch(item)
            ? null
            : item.querySelector<HTMLElement>(
                  `:scope > .${LABEL_CLASS} a[href]`,
              );
        if (link) {
            link.click();
            return;
        }
        this.select(item);
        this.toggle(item);
    }

    private typeahead(item: HTMLElement, char: string): void {
        if (this.typeaheadTimer) clearTimeout(this.typeaheadTimer);
        this.typeaheadBuffer += char.toLowerCase();
        this.typeaheadTimer = setTimeout(() => {
            this.typeaheadBuffer = "";
        }, this.options.typeaheadTimeout);

        const visible = this.visibleItems;
        const start = visible.indexOf(item);
        // One letter, or the same letter repeated, cycles through the items
        // starting with it; a longer prefix stays put while it still matches.
        const buffer = this.typeaheadBuffer;
        const cycling = buffer.split("").every((c) => c === buffer[0]);
        const prefix = cycling ? buffer[0] : buffer;
        const offset = cycling ? 1 : 0;
        const ordered = [
            ...visible.slice(start + offset),
            ...visible.slice(0, start + offset),
        ];
        const match = ordered.find((i) =>
            this.labelText(i).startsWith(prefix),
        );
        this.move(item, match);
    }

    private handleKeydown = (event: KeyboardEvent): void => {
        const item = event.target as HTMLElement;
        if (item.getAttribute?.("role") !== "treeitem") return;

        const visible = this.visibleItems;
        const index = visible.indexOf(item);
        let handled = true;

        switch (event.key) {
            case "ArrowDown":
                this.move(item, visible[index + 1]);
                break;
            case "ArrowUp":
                this.move(item, visible[index - 1]);
                break;
            case "ArrowRight":
                if (!this.isBranch(item)) break;
                if (item.getAttribute("aria-expanded") === "true") {
                    this.move(item, this.childItems(item)[0]);
                } else {
                    this.expand(item);
                }
                break;
            case "ArrowLeft":
                if (item.getAttribute("aria-expanded") === "true") {
                    this.collapse(item);
                } else {
                    this.move(item, this.parentItem(item) ?? undefined);
                }
                break;
            case "Home":
                this.move(item, visible[0]);
                break;
            case "End":
                this.move(item, visible[visible.length - 1]);
                break;
            case "Enter":
                this.activate(item);
                break;
            case " ":
                this.select(item);
                break;
            case "*": {
                const siblings = item.parentElement
                    ? (Array.from(
                          item.parentElement.children,
                      ) as HTMLElement[])
                    : [];
                siblings.forEach((s) => this.expand(s));
                break;
            }
            default:
                handled = false;
                if (
                    this.options.typeahead &&
                    event.key.length === 1 &&
                    !event.ctrlKey &&
                    !event.metaKey &&
                    !event.altKey &&
                    event.key.trim() !== ""
                ) {
                    this.typeahead(item, event.key);
                    handled = true;
                }
        }

        if (handled) {
            event.preventDefault();
            event.stopPropagation();
        }
    };

    private handleClick = (event: MouseEvent): void => {
        const target = event.target as HTMLElement;
        const label = target.closest(`.${LABEL_CLASS}`);
        if (!label) return;
        const item = label.closest<HTMLElement>('[role="treeitem"]');
        if (!item || !this.tree?.contains(item)) return;

        item.focus();
        this.select(item);
        if (this.isBranch(item)) this.toggle(item);
    };

    private handleFocusin = (event: FocusEvent): void => {
        const item = event.target as HTMLElement;
        if (item.getAttribute?.("role") === "treeitem") this.setTabStop(item);
    };
}
