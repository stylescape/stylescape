// ============================================================================
// Stylescape | Theme Toggler
// ============================================================================
// Manages light / dark / auto theme switching with localStorage persistence.
// Binds checkboxes, two-state buttons (aria-pressed) and three-state cycle
// buttons, including the `ss-c-theme-toggle` module.
// ============================================================================

/**
 * Theme values written to `<html data-theme>`. `"auto"` follows
 * `prefers-color-scheme`; no attribute means light.
 */
export type Theme = "dark" | "light" | "auto";

/**
 * Configuration options for theme toggling
 */
export interface ThemeTogglerOptions {
    /** Custom storage key for theme preference */
    storageKey?: string;
    /** Custom attribute name on <html> element */
    themeAttribute?: string;
    /** Default theme if none is stored */
    defaultTheme?: Theme;
    /** Callback when theme changes */
    onChange?: (theme: Theme) => void;
}

const TOGGLE_SELECTOR =
    '[data-theme-toggle], .ss-c-theme-toggle, [data-ss="theme-toggle"]';
const DARK_QUERY = "(prefers-color-scheme: dark)";
const CYCLE: Theme[] = ["light", "dark", "auto"];

/**
 * Static utility class for managing the page theme.
 * Persists the user's choice in localStorage (key `preferredTheme`).
 *
 * Controls:
 * - `<input type="checkbox">`: checked while the page is dark.
 * - `<button>`: toggles light/dark and keeps `aria-pressed` in sync
 *   (pressed while dark).
 * - `<button data-theme-cycle>`: cycles light → dark → auto and exposes the
 *   choice as `data-theme-state`; its accessible name is taken from
 *   `data-theme-label-light|dark|auto` when present.
 *
 * @example JavaScript
 * ```typescript
 * ThemeToggler.initAll()           // every [data-theme-toggle] / .ss-c-theme-toggle
 * ThemeToggler.toggle()
 * ThemeToggler.setTheme("auto")
 * ThemeToggler.getResolvedTheme()  // "dark" | "light"
 * ```
 *
 * @example HTML
 * ```html
 * <button type="button" class="ss-c-theme-toggle" aria-pressed="false"
 *         aria-label="Dark mode">…</button>
 * ```
 */
export class ThemeToggler {
    private static readonly THEME_ATTRIBUTE = "theme";
    private static readonly DARK_THEME = "dark";
    private static readonly LIGHT_THEME = "light";
    private static readonly STORAGE_KEY = "preferredTheme";
    private static readonly htmlElement = document.documentElement;
    private static readonly bound = new Set<HTMLElement>();
    private static mediaListening = false;

    private constructor() {
        // Prevent instantiation
    }

    /**
     * Toggle between dark and light, starting from the theme currently
     * shown (so "auto" on a dark OS goes to light).
     */
    static toggle(): void {
        ThemeToggler.setTheme(
            ThemeToggler.getResolvedTheme() === ThemeToggler.DARK_THEME
                ? ThemeToggler.LIGHT_THEME
                : ThemeToggler.DARK_THEME,
        );
    }

    /** Step through light → dark → auto → light. */
    static cycle(): void {
        const current = ThemeToggler.getCurrentTheme() as Theme;
        const index = CYCLE.indexOf(current);
        ThemeToggler.setTheme(CYCLE[(index + 1) % CYCLE.length]);
    }

    /**
     * Set theme explicitly.
     *
     * @param theme - "dark", "light" or "auto"
     */
    static setTheme(theme: string): void {
        ThemeToggler.htmlElement.dataset[ThemeToggler.THEME_ATTRIBUTE] = theme;
        try {
            localStorage.setItem(ThemeToggler.STORAGE_KEY, theme);
        } catch {
            // Storage unavailable: the theme still applies to this page.
        }
        ThemeToggler.syncAll();
    }

    /**
     * Get the chosen theme: the DOM attribute first, then localStorage,
     * defaulting to light. May be "auto".
     */
    static getCurrentTheme(): string {
        let stored: string | null;
        try {
            stored = localStorage.getItem(ThemeToggler.STORAGE_KEY);
        } catch {
            stored = null;
        }
        return (
            ThemeToggler.htmlElement.dataset[ThemeToggler.THEME_ATTRIBUTE] ||
            stored ||
            ThemeToggler.LIGHT_THEME
        );
    }

    /** The theme actually shown: "auto" resolved through the OS setting. */
    static getResolvedTheme(): "dark" | "light" {
        const theme = ThemeToggler.getCurrentTheme();
        if (theme === "auto") {
            return typeof window.matchMedia === "function" &&
                window.matchMedia(DARK_QUERY).matches
                ? "dark"
                : "light";
        }
        return theme === ThemeToggler.DARK_THEME ? "dark" : "light";
    }

    /**
     * Bind one control (checkbox or button). Binding the same element twice
     * is a no-op.
     */
    static bind(toggle: HTMLElement): void {
        if (ThemeToggler.bound.has(toggle)) return;
        ThemeToggler.bound.add(toggle);
        ThemeToggler.listenToSystem();

        if (toggle instanceof HTMLInputElement) {
            toggle.addEventListener("change", ThemeToggler.onChange);
        } else {
            toggle.addEventListener("click", ThemeToggler.onClick);
        }
        ThemeToggler.sync(toggle);
    }

    /** Remove the listeners from one control. */
    static unbind(toggle: HTMLElement): void {
        toggle.removeEventListener("change", ThemeToggler.onChange);
        toggle.removeEventListener("click", ThemeToggler.onClick);
        ThemeToggler.bound.delete(toggle);
    }

    /** Bind every theme control under `root`. */
    static initAll(root: ParentNode = document): HTMLElement[] {
        const toggles = Array.from(
            root.querySelectorAll<HTMLElement>(TOGGLE_SELECTOR),
        );
        toggles.forEach((t) => ThemeToggler.bind(t));
        return toggles;
    }

    /**
     * Initialize a toggle by ID; falls back to every `[data-theme-toggle]` /
     * `.ss-c-theme-toggle` control on the page.
     *
     * @param toggleId The ID of the toggle (default: 'themeToggle')
     */
    static initializeToggleSwitch(toggleId = "themeToggle"): void {
        const toggle = document.getElementById(toggleId);
        if (toggle) {
            ThemeToggler.bind(toggle);
        } else {
            ThemeToggler.initAll();
        }
    }

    /**
     * Initialize after the page has loaded, or right away when it already
     * has (e.g. when called from a component registry after `load`).
     */
    static registerOnLoad(toggleId = "themeToggle"): void {
        if (document.readyState === "complete") {
            ThemeToggler.initializeToggleSwitch(toggleId);
            return;
        }
        window.addEventListener(
            "load",
            () => ThemeToggler.initializeToggleSwitch(toggleId),
            { once: true },
        );
    }

    // ========================================================================
    // Internals
    // ========================================================================

    private static onChange = (): void => {
        ThemeToggler.toggle();
    };

    private static onClick = (event: Event): void => {
        const toggle = event.currentTarget as HTMLElement;
        if (toggle.hasAttribute("data-theme-cycle")) ThemeToggler.cycle();
        else ThemeToggler.toggle();
    };

    private static syncAll(): void {
        ThemeToggler.bound.forEach((toggle) => {
            if (toggle.isConnected) ThemeToggler.sync(toggle);
            else ThemeToggler.bound.delete(toggle);
        });
    }

    private static sync(toggle: HTMLElement): void {
        const dark = ThemeToggler.getResolvedTheme() === "dark";
        if (toggle instanceof HTMLInputElement) {
            toggle.checked = dark;
            return;
        }
        if (toggle.hasAttribute("data-theme-cycle")) {
            const theme = ThemeToggler.getCurrentTheme();
            toggle.dataset.themeState = theme;
            const label = toggle.getAttribute(`data-theme-label-${theme}`);
            if (label) toggle.setAttribute("aria-label", label);
            return;
        }
        toggle.setAttribute("aria-pressed", String(dark));
    }

    /** Keep controls right when "auto" follows an OS theme change. */
    private static listenToSystem(): void {
        if (
            ThemeToggler.mediaListening ||
            typeof window.matchMedia !== "function"
        ) {
            return;
        }
        const query = window.matchMedia(DARK_QUERY);
        if (typeof query?.addEventListener !== "function") return;
        ThemeToggler.mediaListening = true;
        query.addEventListener("change", () => ThemeToggler.syncAll());
    }
}
