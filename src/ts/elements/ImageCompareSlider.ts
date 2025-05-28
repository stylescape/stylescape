export class ImageCompareSlider {
    private container: HTMLElement
    private overlay: HTMLElement
    private slider: HTMLElement
    private isActive: boolean = false

    constructor(container: HTMLElement) {
        this.container = container
        this.slider = container.querySelector(
            ".image__compare--slider",
        ) as HTMLElement
        this.overlay = container.querySelector(
            ".image__compare--overlay",
        ) as HTMLElement

        if (!this.container || !this.slider || !this.overlay) {
            console.warn(
                `ImageCompareSlider skipped: required elements not found in`,
                container,
            )
            return
        }

        this.initEvents()
        this.slideMove(this.container.offsetWidth / 2)
    }

    private initEvents(): void {
        this.slider.addEventListener("mousedown", () => (this.isActive = true))
        window.addEventListener("mouseup", () => (this.isActive = false))
        window.addEventListener("mousemove", (e) => {
            if (this.isActive) this.slideMove(e.clientX)
        })

        this.slider.addEventListener(
            "touchstart",
            () => (this.isActive = true),
        )
        window.addEventListener("touchend", () => (this.isActive = false))
        window.addEventListener("touchmove", (e) => {
            if (this.isActive) this.slideMove(e.touches[0].clientX)
        })
    }

    private slideMove(x: number): void {
        const bounds = this.container.getBoundingClientRect()
        let pos = x - bounds.left
        pos = Math.max(0, Math.min(pos, bounds.width))
        this.overlay.style.width = `${pos}px`
        this.slider.style.left = `${pos}px`
    }

    static initAll(selector: string = ".image__compare") {
        const containers = document.querySelectorAll<HTMLElement>(selector)
        containers.forEach((container) => {
            new ImageCompareSlider(container)
        })
    }
}
