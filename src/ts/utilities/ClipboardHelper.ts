// ============================================================================
// Stylescape | Clipboard Helper
// ============================================================================
// Provides utility methods for copying content to the clipboard.
// Supports data-ss-copy attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for clipboard copy operations
 */
export interface ClipboardCopyOptions {
    /** Text to display on the button after successful copy */
    successText?: string
    /** Duration to show success text (in milliseconds) */
    successDuration?: number
    /** Text to display on error */
    errorText?: string
    /** Callback on successful copy */
    onSuccess?: (text: string) => void
    /** Callback on copy error */
    onError?: (error: Error) => void
}

/**
 * Static utility class for clipboard operations.
 * Provides methods for copying text and code snippets.
 *
 * @example JavaScript
 * ```typescript
 * // Copy from adjacent code element
 * ClipboardHelper.copyCodeFromButton(button)
 *
 * // Copy by element ID
 * ClipboardHelper.copyById("code-snippet-1")
 *
 * // Auto-attach to all copy buttons
 * ClipboardHelper.attachToButtons(".copy-btn")
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <!-- Button that copies sibling content -->
 * <button class="copy-button" data-ss="copy">Copy</button>
 * <code>const x = 42;</code>
 *
 * <!-- Button that copies by ID -->
 * <button onclick="ClipboardHelper.copyById('snippet')">Copy</button>
 * <pre id="snippet">npm install stylescape</pre>
 * ```
 */
export class ClipboardHelper {
    /**
     * Copy code content from a sibling <code> element (original version).
     *
     * @param button - The button element that triggered the copy
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
     * Attach event listeners to all copy buttons matching the selector.
     * Each button will copy content from its next sibling element.
     *
     * @param selector - CSS selector for copy buttons (default: '.copy-button')
     */
    static attachToButtons(selector: string = '.copy-button'): void {
        const buttons = document.querySelectorAll<HTMLButtonElement>(selector)
        buttons.forEach((button) => {
            button.addEventListener('click', () => ClipboardHelper.copyCodeFromButton(button))
        })
    }

    /**
     * Copy content from an element by its ID and update the triggering button.
     * Finds the associated button using onclick attribute matching.
     *
     * @param codeId - The ID of the element containing text to copy
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
