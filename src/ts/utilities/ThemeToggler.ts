export class ThemeToggler {
    private static readonly THEME_ATTRIBUTE = "theme"
    private static readonly DARK_THEME = "dark"
    private static readonly LIGHT_THEME = "light"
    private static readonly htmlElement = document.documentElement

    private constructor() {
        // Prevent instantiation
    }

    /**
     * Toggle between dark and light theme
     */
    static toggle(): void {
        const currentTheme = ThemeToggler.getCurrentTheme()

        const newTheme =
            currentTheme === ThemeToggler.DARK_THEME
                ? ThemeToggler.LIGHT_THEME
                : ThemeToggler.DARK_THEME

        ThemeToggler.htmlElement.dataset[ThemeToggler.THEME_ATTRIBUTE] =
            newTheme

        // Optionally persist to localStorage
        // localStorage.setItem('preferredTheme', newTheme);
    }

    /**
     * Initialize a toggle switch (e.g. a checkbox)
     * @param toggleId The ID of the input element to listen to
     */
    static initializeToggleSwitch(toggleId: string): void {
        const toggle = document.getElementById(
            toggleId,
        ) as HTMLInputElement | null
        if (!toggle) {
            console.warn(
                `ThemeToggler: Toggle element with ID '${toggleId}' not found.`,
            )
            return
        }

        toggle.addEventListener("change", () => {
            ThemeToggler.toggle()
        })
    }

    /**
     * Get the currently set theme or fallback to default
     */
    private static getCurrentTheme(): string {
        return (
            ThemeToggler.htmlElement.dataset[ThemeToggler.THEME_ATTRIBUTE] ||
            ThemeToggler.LIGHT_THEME
        )
    }
}
