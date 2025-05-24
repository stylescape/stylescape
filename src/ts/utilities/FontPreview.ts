export class FontPreview {
    private inputElement: HTMLInputElement
    private previewElements: HTMLElement[]

    constructor(inputSelector: string, previewSelector: string) {
        const input = document.querySelector<HTMLInputElement>(inputSelector)
        if (!input) throw new Error(`Input element "${inputSelector}" not found`)
        this.inputElement = input

        this.previewElements = Array.from(document.querySelectorAll<HTMLElement>(previewSelector))

        this.initialize()
    }

    private initialize(): void {
        this.inputElement.addEventListener('input', () => this.updatePreviewText())

        // Optional: initialize with existing input value
        this.updatePreviewText()
    }

    private updatePreviewText(): void {
        const value = this.inputElement.value || 'The quick brown fox jumps over the lazy dog.'
        this.previewElements.forEach((el) => {
            el.textContent = value
        })
    }
}
