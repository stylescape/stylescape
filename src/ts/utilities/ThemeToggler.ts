// ============================================================================
// Stylescape | Theme Toggler
// ============================================================================
// Manages dark/light theme switching with localStorage persistence.
// Supports data-theme-toggle attributes for declarative configuration.
// ============================================================================

/**
 * Available theme values
 */
export type Theme = "dark" | "light"

/**
 * Configuration options for theme toggling
 */
export interface ThemeTogglerOptions {
    /** Custom storage key for theme preference */
    storageKey?: string
    /** Custom attribute name on <html> element */
    themeAttribute?: string
    /** Default theme if none is stored */
    defaultTheme?: Theme
    /** Callback when theme changes */
    onChange?: (theme: Theme) => void
}

/**
 * Static utility class for managing dark/light theme switching.
 * Persists user preference in localStorage.
 *
 * @example JavaScript
 * ```typescript
 * // Initialize with a toggle switch
 * ThemeToggler.initializeToggleSwitch("darkModeToggle")
 *
 * // Or register to initialize on page load
 * ThemeToggler.registerOnLoad()
 *
 * // Programmatic control
 * ThemeToggler.toggle()
 * ThemeToggler.setTheme("dark")
 * const current = ThemeToggler.getCurrentTheme()
 * ```
 *
 * @example HTML with data-theme-toggle
 * ```html
 * <input type="checkbox"
 *        id="themeToggle"
 *        data-theme-toggle>
 * <label for="themeToggle">Dark Mode</label>
 * ```
 */
export class ThemeToggler {
    private static readonly THEME_ATTRIBUTE = "theme"
    private static readonly DARK_THEME = "dark"
    private static readonly LIGHT_THEME = "light"
    private static readonly STORAGE_KEY = "preferredTheme"
    private static readonly htmlElement = document.documentElement

    private constructor() {
        // Prevent instantiation
    }

    /**
     * Toggle between dark and light themes.
     * Updates both the DOM attribute and localStorage.
     */
    static toggle(): void {
        const newTheme =
            ThemeToggler.getCurrentTheme() === ThemeToggler.DARK_THEME
                ? ThemeToggler.LIGHT_THEME
                : ThemeToggler.DARK_THEME

        ThemeToggler.setTheme(newTheme)
    }

    /**
     * Set theme explicitly to a specific value.
     *
     * @param theme - The theme to set ("dark" or "light")
     */
    static setTheme(theme: string): void {
        ThemeToggler.htmlElement.dataset[ThemeToggler.THEME_ATTRIBUTE] = theme
        localStorage.setItem(ThemeToggler.STORAGE_KEY, theme)
    }

    /**
     * Get the currently active theme.
     * Checks DOM attribute first, then localStorage, defaults to light.
     *
     * @returns The current theme ("dark" or "light")
     */
    static getCurrentTheme(): string {
        return (
            ThemeToggler.htmlElement.dataset[ThemeToggler.THEME_ATTRIBUTE] ||
            localStorage.getItem(ThemeToggler.STORAGE_KEY) ||
            ThemeToggler.LIGHT_THEME
        )
    }

    /**
     * Sync the toggle input checkbox state with the current theme.
     *
     * @param toggle - The checkbox input element to sync
     */
    private static syncToggleState(toggle: HTMLInputElement): void {
        const currentTheme = ThemeToggler.getCurrentTheme()
        toggle.checked = currentTheme === ThemeToggler.DARK_THEME
    }

    /**
     * Initialize a toggle switch (input[type=checkbox]) by ID or data attribute
     * @param toggleId The ID of the toggle (default: 'themeToggle')
     */
    static initializeToggleSwitch(toggleId = "themeToggle"): void {
        let toggle = document.getElementById(
            toggleId,
        ) as HTMLInputElement | null

        if (!toggle) {
            toggle = document.querySelector(
                "[data-theme-toggle]",
            ) as HTMLInputElement | null
        }

        if (!toggle) {
            // console.warn(
            //     `ThemeToggler: No toggle element found for ID '${toggleId}' or [data-theme-toggle].`,
            // )
            return
        }

        ThemeToggler.syncToggleState(toggle)

        toggle.addEventListener("change", () => {
            ThemeToggler.toggle()
        })
    }

    /**
     * Register initialization to occur after full page load
     * Recommended if HTML elements may load later
     */
    static registerOnLoad(toggleId = "themeToggle"): void {
        window.addEventListener("load", () => {
            ThemeToggler.initializeToggleSwitch(toggleId)
        })
    }
}
