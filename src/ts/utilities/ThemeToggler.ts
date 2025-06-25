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
     * Toggle between dark and light themes
     */
    static toggle(): void {
        const newTheme =
            ThemeToggler.getCurrentTheme() === ThemeToggler.DARK_THEME
                ? ThemeToggler.LIGHT_THEME
                : ThemeToggler.DARK_THEME

        ThemeToggler.setTheme(newTheme)
    }

    /**
     * Set theme explicitly
     */
    static setTheme(theme: string): void {
        ThemeToggler.htmlElement.dataset[ThemeToggler.THEME_ATTRIBUTE] = theme
        localStorage.setItem(ThemeToggler.STORAGE_KEY, theme)
    }

    /**
     * Get the currently active theme
     */
    static getCurrentTheme(): string {
        return (
            ThemeToggler.htmlElement.dataset[ThemeToggler.THEME_ATTRIBUTE] ||
            localStorage.getItem(ThemeToggler.STORAGE_KEY) ||
            ThemeToggler.LIGHT_THEME
        )
    }

    /**
     * Sync the current theme with the toggle input state
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
            console.warn(
                `ThemeToggler: No toggle element found for ID '${toggleId}' or [data-theme-toggle].`,
            )
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
