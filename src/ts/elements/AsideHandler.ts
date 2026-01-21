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
    /** CSS class for visible state */
    visibleClass?: string;
    /** Initial visibility state */
    initialState?: "show" | "hide";
    /** Enable localStorage persistence */
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
 * const aside = new AsideHandler("sideMenu", "menuToggle")
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
 * <aside id="sideMenu" data-ss="aside" data-ss-aside-persist="true">
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

    /** Reference to the aside menu element */
    asideMenu: HTMLElement | null = null;

    /** Reference to the toggle switch element */
    asideSwitch: HTMLElement | null = null;

    /** Current visibility state */
    asideMenuActive: string = AsideHandler.HIDDEN_STATE;

    /**
     * Creates a new AsideHandler instance.
     *
     * @param menuId - ID of the aside menu element
     * @param switchId - ID of the toggle button element
     */
    constructor(menuId: string, switchId: string) {
        this.localStorageManager = LocalStorageManager.getInstance();
        this.stateManager = new StateManager();
        this.menuId = menuId;
        this.switchId = switchId;

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
        if (this.asideMenu?.classList.contains(AsideHandler.VISIBLE_CLASS)) {
            this.hideMenu();
        } else {
            this.showMenu();
        }
    }

    /**
     * Shows the menu and persists the state to localStorage.
     */
    public showMenu(): void {
        this.assertMenu();
        this.localStorageManager.setValue(
            this.menuId + AsideHandler.VISIBLE_SUFFIX,
            AsideHandler.VISIBLE_STATE,
        );
        this.updateStateMenu();
    }

    /**
     * Hides the menu and persists the state to localStorage.
     */
    public hideMenu(): void {
        this.assertMenu();
        this.localStorageManager.setValue(
            this.menuId + AsideHandler.VISIBLE_SUFFIX,
            AsideHandler.HIDDEN_STATE,
        );
        this.updateStateMenu();
    }

    /**
     * Updates the visual state of the menu based on stored preference.
     * Applies or removes the visible class on both menu and switch.
     */
    public updateStateMenu(): void {
        this.assertMenu();
        if (!this.asideMenu) return;

        this.asideMenuActive =
            this.localStorageManager.getValue(
                this.menuId + AsideHandler.VISIBLE_SUFFIX,
            ) || this.asideMenuActive;

        const isVisible = this.asideMenuActive === AsideHandler.VISIBLE_STATE;
        this.asideMenu.classList.toggle(AsideHandler.VISIBLE_CLASS, isVisible);
        this.asideSwitch?.classList.toggle(
            AsideHandler.VISIBLE_CLASS,
            isVisible,
        );
    }
}
