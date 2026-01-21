// ============================================================================
// Stylescape | Image Compare Slider
// ============================================================================
// Interactive before/after image comparison slider with drag support.
// Supports data-ss-image-compare attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for ImageCompareSlider
 */
export interface ImageCompareSliderOptions {
    /** Initial slider position (0-100 percentage) */
    initialPosition?: number
    /** CSS class for the slider handle */
    sliderClass?: string
    /** CSS class for the overlay image */
    overlayClass?: string
    /** Enable touch support */
    touch?: boolean
    /** Show labels for before/after */
    showLabels?: boolean
    /** Before image label text */
    beforeLabel?: string
    /** After image label text */
    afterLabel?: string
    /** Callback when slider position changes */
    onChange?: (position: number) => void
}

/**
 * Interactive image comparison slider for before/after images.
 * Supports mouse and touch interactions.
 *
 * @example JavaScript
 * ```typescript
 * const container = document.querySelector(".image__compare")
 * const slider = new ImageCompareSlider(container, {
 *     initialPosition: 50,
 *     showLabels: true,
 *     onChange: (pos) => console.log(`Position: ${pos}%`)
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <div class="image__compare"
 *      data-ss="image-compare"
 *      data-ss-image-compare-position="50">
 *     <img class="image__compare--image" src="after.jpg" alt="After">
 *     <img class="image__compare--overlay" src="before.jpg" alt="Before">
 *     <div class="image__compare--slider"></div>
 * </div>
 * ```
 *
 * @example Static initialization for all sliders
 * ```typescript
 * ImageCompareSlider.initAll(".image__compare")
 * ```
 */
export class ImageCompareSlider {
    /** The container element for the slider */
    private container: HTMLElement

    /** The overlay (before) image element */
    private overlay: HTMLImageElement

    /** The base (after) image element */
    private baseImage: HTMLImageElement

    /** The draggable slider handle element */
    private slider: HTMLElement

    /** Whether the slider is currently being dragged */
    private isActive: boolean = false

    /**
     * Creates a new ImageCompareSlider instance.
     *
     * @param container - The container element holding both images and slider
     */
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

        // Initialize brightness checks
        this.checkAndInject(this.baseImage)
        this.checkAndInject(this.overlay)

        this.initEvents()
        this.slideMove(this.container.offsetWidth / 2)
    }

    /**
     * Checks image brightness and injects dark mode indicators if needed.
     *
     * @param image - The image element to check
     */
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

    /**
     * Analyzes image brightness using canvas pixel sampling.
     *
     * @param image - The image element to analyze
     * @returns Promise resolving to true if image is bright (avg > 160)
     */
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

    /**
     * Initializes mouse and touch event listeners for drag interaction.
     */
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

    /**
     * Moves the slider and adjusts overlay width based on position.
     *
     * @param x - The x-coordinate (client position) to move to
     */
    private slideMove(x: number): void {
        const bounds = this.container.getBoundingClientRect()
        let pos = x - bounds.left
        pos = Math.max(0, Math.min(pos, bounds.width))
        this.overlay.style.width = `${pos}px`
        this.slider.style.left = `${pos}px`
    }

    /**
     * Static factory method to initialize all image compare sliders on the page.
     *
     * @param selector - CSS selector for container elements (default: ".image__compare")
     */
    public static initAll(selector: string = ".image__compare"): void {
        const containers = document.querySelectorAll<HTMLElement>(selector)
        containers.forEach((container) => {
            new ImageCompareSlider(container)
        })
    }
}
