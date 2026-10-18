// ============================================================================
// Stylescape | Aside Handler
// ============================================================================
// Manages sidebar/aside menu visibility with localStorage persistence.
// Supports data-ss-aside attributes for declarative configuration.
// ============================================================================

import { StateManager } from "../state/StateManager.js";
import { LocalStorageManager } from "../storage/LocalStorageManager.js";

/**
 * Configuration options for AsideHandler
 */
export interface AsideHandlerOptions {
    /** CSS class for visible state (default `active`) */
    visibleClass?: string;
    /**
     * Visibility on a first visit, before anything is stored, and always
     * when `persist` is off (default `hide`).
     */
    initialState?: "show" | "hide";
    /**
     * Remember the state in localStorage and restore it on the next visit
     * (default `true`). Off, the menu starts in `initialState` every time
     * and nothing is read from or written to storage.
     */
    persist?: boolean;
    /** Callback when menu opens */
    onOpen?: (menu: HTMLElement) => void;
    /** Callback when menu closes */
    onClose?: (menu: HTMLElement) => void;
}

/**
 * Aside/sidebar menu handler with persistence support.
 * Manages the toggle state of sidebar menus with localStorage.
 *
 * @example JavaScript
 * ```typescript
 * const aside = new AsideHandler("sideMenu", "menuToggle", {
 *     initialState: "show",
 * })
 *
 * // Programmatic control
 * aside.showMenu()
 * aside.hideMenu()
 * aside.toggleMenu()
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <button id="menuToggle" data-ss="aside-toggle">Toggle Menu</button>
 * <aside
 *     id="sideMenu"
 *     data-ss="aside"
 *     data-ss-aside-switch="menuToggle"
 *     data-ss-aside-initial-state="show"
 *     data-ss-aside-persist="false"
 * >
 *     <nav>...</nav>
 * </aside>
 * ```
 */
export class AsideHandler {
    /** CSS class applied when menu is visible */
    private static readonly VISIBLE_CLASS = "active";

    /** LocalStorage key suffix for visibility state */
    private static readonly VISIBLE_SUFFIX = "_visibility";

    /** State value for visible menu */
    private static readonly VISIBLE_STATE = "show";

    /** State value for hidden menu */
    private static readonly HIDDEN_STATE = "hide";

    /** LocalStorage manager instance */
    localStorageManager: LocalStorageManager;

    /** State manager instance */
    stateManager: StateManager;

    /** ID of the aside menu element */
    menuId: string;

    /** ID of the toggle switch element */
    switchId: string;

    /** Resolved options */
    options: Required<Pick<AsideHandlerOptions, "visibleClass" | "persist">> &
        AsideHandlerOptions;

    /** Reference to the aside menu element */
    asideMenu: HTMLElement | null = null;

    /** Reference to the toggle switch element */
    asideSwitch: HTMLElement | null = null;

    /** Current visibility state */
    asideMenuActive: string;

    /**
     * Creates a new AsideHandler instance.
     *
     * @param menuId - ID of the aside menu element
     * @param switchId - ID of the toggle button element
     * @param options - Initial state, persistence and callbacks
     */
    constructor(
        menuId: string,
        switchId: string,
        options: AsideHandlerOptions = {},
    ) {
        this.localStorageManager = LocalStorageManager.getInstance();
        this.stateManager = new StateManager();
        this.menuId = menuId;
        this.switchId = switchId;
        this.options = {
            ...options,
            visibleClass: options.visibleClass || AsideHandler.VISIBLE_CLASS,
            persist: options.persist !== false,
        };
        this.asideMenuActive =
            options.initialState === AsideHandler.VISIBLE_STATE
                ? AsideHandler.VISIBLE_STATE
                : AsideHandler.HIDDEN_STATE;

        this.assertMenu();
        this.setupToggleListener();
        this.updateStateMenu();
    }

    /**
     * Queries and caches DOM references for menu and switch elements.
     */
    private assertMenu(): void {
        this.asideMenu = document.getElementById(this.menuId);
        this.asideSwitch = document.getElementById(this.switchId);
    }

    /**
     * Sets up click event listener on the toggle switch.
     */
    private setupToggleListener(): void {
        if (this.asideSwitch) {
            this.asideSwitch.addEventListener("click", () =>
                this.toggleMenu(),
            );
        }
    }

    /**
     * Toggles the menu between visible and hidden states.
     */
    public toggleMenu(): void {
        this.assertMenu();
        if (this.asideMenu?.classList.contains(this.options.visibleClass)) {
            this.hideMenu();
        } else {
            this.showMenu();
        }
    }

    /**
     * Shows the menu and, when persisting, stores the state.
     */
    public showMenu(): void {
        this.setState(AsideHandler.VISIBLE_STATE);
    }

    /**
     * Hides the menu and, when persisting, stores the state.
     */
    public hideMenu(): void {
        this.setState(AsideHandler.HIDDEN_STATE);
    }

    /**
     * Records a new state, stores it when persisting, and applies it.
     */
    private setState(state: string): void {
        this.assertMenu();
        this.asideMenuActive = state;
        if (this.options.persist) {
            this.localStorageManager.setValue(this.storageKey(), state);
        }
        this.updateStateMenu();
    }

    /** LocalStorage key of this menu's state. */
    private storageKey(): string {
        return this.menuId + AsideHandler.VISIBLE_SUFFIX;
    }

    /**
     * Updates the visual state of the menu. When persisting, a stored state
     * wins over the current one; otherwise the current state applies.
     * Applies or removes the visible class on both menu and switch and
     * fires `onOpen` / `onClose` on a change.
     */
    public updateStateMenu(): void {
        this.assertMenu();
        if (!this.asideMenu) return;

        if (this.options.persist) {
            this.asideMenuActive =
                this.localStorageManager.getValue(this.storageKey()) ||
                this.asideMenuActive;
        }

        const { visibleClass } = this.options;
        const wasVisible = this.asideMenu.classList.contains(visibleClass);
        const isVisible = this.asideMenuActive === AsideHandler.VISIBLE_STATE;
        this.asideMenu.classList.toggle(visibleClass, isVisible);
        this.asideSwitch?.classList.toggle(visibleClass, isVisible);
        this.asideSwitch?.setAttribute("aria-expanded", String(isVisible));

        if (isVisible !== wasVisible) {
            (isVisible ? this.options.onOpen : this.options.onClose)?.(
                this.asideMenu,
            );
        }
    }
}
