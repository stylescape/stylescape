// ============================================================================
// Stylescape | FAB Manager
// ============================================================================
// Opens and closes a `.ss-c-fab` speed dial: toggles `aria-expanded` on the
// main button and `.is-open` on the root, closes on Escape (returning focus
// to the toggle), on a click outside, and after an action is chosen.
// ============================================================================

/**
 * Configuration options for FabManager
 */
export interface FabOptions {
    /** Close the dial after one of its actions is clicked (default true). */
    closeOnAction?: boolean;
    /** Callback when the dial opens or closes. */
    onToggle?: (open: boolean, root: HTMLElement) => void;
}

/**
 * Speed-dial behaviour for the `fab` module.
 *
 * @example HTML with data-ss
 * ```html
 * <div class="ss-c-fab" data-ss="fab">
 *   <button class="ss-c-fab__toggle" type="button" aria-expanded="false"
 *           aria-controls="fab-actions" aria-label="Open actions">…</button>
 *   <div class="ss-c-fab__actions" id="fab-actions" role="group" aria-label="Quick actions">
 *     <button class="ss-c-fab__action" type="button" aria-label="Reply">…</button>
 *   </div>
 * </div>
 * ```
 */
export class FabManager {
    private root: HTMLElement | null;
    private toggleButton: HTMLButtonElement | null = null;
    private options: Required<FabOptions>;

    constructor(
        selectorOrElement: string | HTMLElement,
        options: FabOptions = {},
    ) {
        this.root =
            typeof selectorOrElement === "string"
                ? document.querySelector<HTMLElement>(selectorOrElement)
                : selectorOrElement;

        this.options = {
            closeOnAction: options.closeOnAction ?? true,
            onToggle: options.onToggle ?? (() => {}),
        };

        if (!this.root) {
            console.warn("[Stylescape] FabManager element not found");
            return;
        }

        this.toggleButton =
            this.root.querySelector<HTMLButtonElement>(".ss-c-fab__toggle");
        if (!this.toggleButton) {
            console.warn("[Stylescape] FabManager: no .ss-c-fab__toggle");
            return;
        }

        this.init();
    }

    // ========================================================================
    // Public API
    // ========================================================================

    get isOpen(): boolean {
        return this.toggleButton?.getAttribute("aria-expanded") === "true";
    }

    public open(): void {
        this.setOpen(true);
    }

    public close(): void {
        this.setOpen(false);
    }

    public toggle(): void {
        this.setOpen(!this.isOpen);
    }

    public destroy(): void {
        this.toggleButton?.removeEventListener("click", this.handleToggle);
        this.root?.removeEventListener("keydown", this.handleKeydown);
        this.root?.removeEventListener("click", this.handleRootClick);
        document.removeEventListener("click", this.handleDocumentClick);
        this.root = null;
        this.toggleButton = null;
    }

    // ========================================================================
    // Private
    // ========================================================================

    private init(): void {
        if (!this.toggleButton) return;
        if (!this.toggleButton.hasAttribute("aria-expanded")) {
            this.toggleButton.setAttribute("aria-expanded", "false");
        }
        this.root?.classList.toggle("is-open", this.isOpen);

        this.toggleButton.addEventListener("click", this.handleToggle);
        this.root?.addEventListener("keydown", this.handleKeydown);
        this.root?.addEventListener("click", this.handleRootClick);
        document.addEventListener("click", this.handleDocumentClick);
    }

    private setOpen(open: boolean): void {
        if (!this.root || !this.toggleButton) return;
        if (open === this.isOpen) return;
        this.toggleButton.setAttribute("aria-expanded", String(open));
        this.root.classList.toggle("is-open", open);
        this.options.onToggle(open, this.root);
    }

    private handleToggle = (): void => {
        this.toggle();
    };

    private handleKeydown = (event: KeyboardEvent): void => {
        if (event.key !== "Escape" || !this.isOpen) return;
        event.stopPropagation();
        this.close();
        this.toggleButton?.focus();
    };

    private handleRootClick = (event: MouseEvent): void => {
        if (!this.options.closeOnAction) return;
        const target = event.target as Element | null;
        if (target?.closest(".ss-c-fab__action")) {
            this.close();
            this.toggleButton?.focus();
        }
    };

    private handleDocumentClick = (event: MouseEvent): void => {
        if (!this.root || !this.isOpen) return;
        if (!this.root.contains(event.target as Node)) this.close();
    };
}

export default FabManager;
