export class ImageCompareSlider {
    private container: HTMLElement
    private overlay: HTMLImageElement
    private baseImage: HTMLImageElement
    private slider: HTMLElement
    private isActive: boolean = false

    constructor(container: HTMLElement) {
        this.container = container
        this.slider = container.querySelector(
            ".image__compare--slider",
        ) as HTMLElement
        this.overlay = container.querySelector(
            ".image__compare--overlay",
        ) as HTMLImageElement
        this.baseImage = container.querySelector(
            "img.image__compare--image:not(.image__compare--overlay)",
        ) as HTMLImageElement

        if (
            !this.container ||
            !this.slider ||
            !this.overlay ||
            !this.baseImage
        ) {
            console.warn(
                `ImageCompareSlider skipped: required elements not found in`,
                container,
            )
            return
        }

        // Kontrolleri başlat
        this.checkAndInject(this.baseImage)
        this.checkAndInject(this.overlay)

        this.initEvents()
        this.slideMove(this.container.offsetWidth / 2)
    }

    private checkAndInject(image: HTMLImageElement): void {
        const side = image.dataset.darkSide
        if (!side) return

        const inject = () => {
            this.isImageBright(image)
                .then((isBright) => {
                    if (!isBright) return

                    const el = document.createElement("div")
                    el.className = `dark--${side}`
                    this.slider.appendChild(el)

                    // Ok rengini değiştir
                    const arrow = this.slider.querySelector(
                        `.arrow--${side}`,
                    ) as HTMLElement
                    if (arrow) {
                        arrow.style.borderColor = "var(--color_text_primary)"
                    }
                })
                .catch((err) => {
                    console.warn("Brightness check failed:", err)
                })
        }

        if (image.complete && image.naturalWidth > 0) {
            inject()
        } else {
            image.onload = () => {
                if (image.naturalWidth > 0) inject()
            }
        }
    }

    private isImageBright(image: HTMLImageElement): Promise<boolean> {
        return new Promise((resolve) => {
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            if (!ctx) return resolve(false)

            canvas.width = image.naturalWidth
            canvas.height = image.naturalHeight
            ctx.drawImage(image, 0, 0)

            const data = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height,
            ).data
            let r = 0,
                g = 0,
                b = 0,
                count = 0
            const step = 4 * 20

            for (let i = 0; i < data.length; i += step) {
                r += data[i]
                g += data[i + 1]
                b += data[i + 2]
                count++
            }

            const avg = (r + g + b) / (3 * count)
            resolve(avg > 160)
        })
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
