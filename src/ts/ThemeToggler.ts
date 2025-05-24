// class ThemeToggler {
//     private static themeAttribute: string = 'theme'
//     private static darkTheme: string = 'dark'
//     private static lightTheme: string = 'light'

//     static toggle(): void {
//         const html = document.documentElement
//         const currentTheme = html.dataset[ThemeToggler.themeAttribute]

//         html.dataset[ThemeToggler.themeAttribute] =
//             currentTheme === ThemeToggler.darkTheme
//                 ? ThemeToggler.lightTheme
//                 : ThemeToggler.darkTheme
//     }
// }

// Usage
// ThemeToggler.toggle();

export class ThemeToggler {
    private static themeAttribute: string = 'theme'
    private static darkTheme: string = 'dark'
    private static lightTheme: string = 'light'

    static toggle(): void {
        const html = document.documentElement
        const currentTheme = html.dataset[ThemeToggler.themeAttribute]

        html.dataset[ThemeToggler.themeAttribute] =
            currentTheme === ThemeToggler.darkTheme
                ? ThemeToggler.lightTheme
                : ThemeToggler.darkTheme
    }

    static initializeToggleSwitch(toggleId: string): void {
        const toggle = document.getElementById(toggleId) as HTMLInputElement
        if (!toggle) return

        toggle.addEventListener('change', () => {
            ThemeToggler.toggle()
        })
    }
}
