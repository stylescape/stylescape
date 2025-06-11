export class PasswordToggleManager {
    private readonly selector: string

    constructor(selector: string = "[data-password-toggle]") {
        this.selector = selector
        this.init()
    }

    private init(): void {
        document
            .querySelectorAll<HTMLButtonElement>(this.selector)
            .forEach((button) => {
                const inputId = button.dataset.passwordToggle
                if (!inputId) return

                const input = document.getElementById(
                    inputId,
                ) as HTMLInputElement | null
                if (!input || input.type !== "password") return

                button.addEventListener("click", () =>
                    this.togglePasswordVisibility(input, button),
                )
            })
    }

    private togglePasswordVisibility(
        input: HTMLInputElement,
        button: HTMLButtonElement,
    ): void {
        const isText = input.type === "text"
        input.type = isText ? "password" : "text"

        button.classList.toggle("is-visible", !isText)
        button.setAttribute("aria-pressed", String(!isText))
    }
}
