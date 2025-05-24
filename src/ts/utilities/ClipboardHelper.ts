export class ClipboardHelper {
    /**
     * Copy code content from a sibling <code> element (original version).
     */
    static copyCodeFromButton(button: HTMLButtonElement): void {
        const nextElement = button.nextElementSibling
        if (!(nextElement instanceof HTMLElement)) return

        const code = nextElement.innerText
        navigator.clipboard.writeText(code).then(() => {
            button.textContent = 'Copied!'
            setTimeout(() => {
                button.textContent = 'Copy'
            }, 1500)
        })
    }

    /**
     * Attach event listeners to all copy buttons.
     */
    static attachToButtons(selector: string = '.copy-button'): void {
        const buttons = document.querySelectorAll<HTMLButtonElement>(selector)
        buttons.forEach((button) => {
            button.addEventListener('click', () => ClipboardHelper.copyCodeFromButton(button))
        })
    }

    /**
     * Generic method to copy content by ID and update the matching button label.
     */
    static copyById(codeId: string): void {
        const codeElement = document.getElementById(codeId)
        if (!(codeElement instanceof HTMLElement)) {
            console.warn(`Code element with ID "${codeId}" not found.`)
            return
        }

        const text = codeElement.innerText.trim()

        navigator.clipboard
            .writeText(text)
            .then(() => {
                const button = document.querySelector(`button[onclick*="${codeId}"]`)
                if (button) {
                    const original = button.textContent
                    button.textContent = 'Copied!'
                    setTimeout(() => {
                        button.textContent = original
                    }, 1500)
                }
            })
            .catch((err) => {
                console.error('Failed to copy text:', err)
            })
    }
}
