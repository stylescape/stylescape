// ============================================================================
// Stylescape | Image Compare Slider
// ============================================================================
// Interactive before/after image comparison slider with drag and keyboard
// support. Styled by the `ss-c-image-compare` module; the older unprefixed
// `.image__compare` / `.ss-c-image__compare` markup is still accepted.
// ============================================================================

/**
 * Configuration options for ImageCompareSlider
 */
export interface ImageCompareSliderOptions {
    /** Initial slider position (0-100 percentage) */
    initialPosition?: number;
    /** Percentage moved per arrow key press */
    step?: number;
    /** Callback when slider position changes */
    onChange?: (position: number) => void;
}

/** Selectors for the current class names, then the legacy ones. */
const SELECTORS = {
    container: ".ss-c-image-compare, .image__compare, .ss-c-image__compare",
    handle: ".ss-c-image-compare__handle, .image__compare--slider, .ss-c-image__compare--slider",
    overlay:
        ".ss-c-image-compare__overlay, .image__compare--overlay, .ss-c-image__compare--overlay",
    base: [
        "img.ss-c-image-compare__image:not(.ss-c-image-compare__overlay)",
        "img.image__compare--image:not(.image__compare--overlay)",
        "img.ss-c-image__compare--image:not(.ss-c-image__compare--overlay)",
    ].join(", "),
};

const POSITION_PROPERTY = "--ss-image-compare-position";

/**
 * Interactive image comparison slider for before/after images.
 * The handle is a keyboard-operable `role="slider"`; the position is kept in
 * `--ss-image-compare-position` on the container, which the module CSS uses
 * to clip the overlay and place the handle.
 *
 * @example JavaScript
 * ```typescript
 * const container = document.querySelector(".ss-c-image-compare")
 * const slider = new ImageCompareSlider(container, {
 *     initialPosition: 30,
 *     onChange: (pos) => console.log(`Position: ${pos}%`)
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <figure class="ss-c-image-compare" data-ss="image-compare"
 *         data-ss-image-compare-position="50">
 *     <img class="ss-c-image-compare__image" src="after.jpg" alt="After">
 *     <img class="ss-c-image-compare__overlay" src="before.jpg" alt="Before">
 *     <div class="ss-c-image-compare__handle" aria-label="Before/after split"></div>
 * </figure>
 * ```
 *
 * @example Static initialization for all sliders
 * ```typescript
 * ImageCompareSlider.initAll()
 * ```
 */
export class ImageCompareSlider {
    /** The container element for the slider */
    private container: HTMLElement;

    /** The overlay (before) image element */
    private overlay: HTMLImageElement;

    /** The base (after) image element */
    private baseImage: HTMLImageElement;

    /** The draggable slider handle element */
    private slider: HTMLElement;

    /** Whether the slider is currently being dragged */
    private isActive: boolean = false;

    /** Current position as a percentage of the container width */
    private position: number = 50;

    /** Legacy markup has no module CSS, so the overlay is sized in px */
    private legacy: boolean;

    private step: number;
    private onChange?: (position: number) => void;

    /**
     * Creates a new ImageCompareSlider instance.
     *
     * @param container - The container element holding both images and slider
     * @param options - Optional configuration
     */
    constructor(
        container: HTMLElement,
        options: ImageCompareSliderOptions = {},
    ) {
        this.container = container;
        this.slider = container?.querySelector(
            SELECTORS.handle,
        ) as HTMLElement;
        this.overlay = container?.querySelector(
            SELECTORS.overlay,
        ) as HTMLImageElement;
        this.baseImage = container?.querySelector(
            SELECTORS.base,
        ) as HTMLImageElement;
        this.legacy = !container?.classList.contains("ss-c-image-compare");
        this.step = options.step ?? 5;
        this.onChange = options.onChange;

        if (
            !this.container ||
            !this.slider ||
            !this.overlay ||
            !this.baseImage
        ) {
            console.warn(
                `ImageCompareSlider skipped: required elements not found in`,
                container,
            );
            return;
        }

        const fromData = Number(container.dataset.ssImageComparePosition);
        const initial =
            options.initialPosition ??
            (Number.isFinite(fromData) &&
            container.dataset.ssImageComparePosition
                ? fromData
                : 50);

        // Initialize brightness checks
        this.checkAndInject(this.baseImage);
        this.checkAndInject(this.overlay);

        this.initHandle();
        this.initEvents();
        this.setPosition(initial, false);
    }

    /** Current position (0-100). */
    public get value(): number {
        return this.position;
    }

    /**
     * Moves the divider to a percentage of the container width.
     *
     * @param percent - Position between 0 and 100
     * @param notify - Whether to call `onChange`
     */
    public setPosition(percent: number, notify = true): void {
        const pos = Math.max(0, Math.min(100, percent));
        this.position = pos;
        this.container.style.setProperty(POSITION_PROPERTY, `${pos}%`);
        this.slider.setAttribute("aria-valuenow", String(Math.round(pos)));
        this.slider.setAttribute("aria-valuetext", `${Math.round(pos)}%`);

        if (this.legacy) {
            const width = this.container.getBoundingClientRect().width;
            const px = (pos / 100) * width;
            this.overlay.style.width = `${px}px`;
            this.slider.style.left = `${px}px`;
        }

        if (notify) this.onChange?.(pos);
    }

    /** Removes all listeners added by this instance. */
    public destroy(): void {
        this.slider?.removeEventListener("mousedown", this.start);
        this.slider?.removeEventListener("touchstart", this.start);
        this.slider?.removeEventListener("keydown", this.handleKeydown);
        window.removeEventListener("mouseup", this.stop);
        window.removeEventListener("touchend", this.stop);
        window.removeEventListener("mousemove", this.handleMouseMove);
        window.removeEventListener("touchmove", this.handleTouchMove);
    }

    /**
     * Checks image brightness and injects dark mode indicators if needed.
     *
     * @param image - The image element to check
     */
    private checkAndInject(image: HTMLImageElement): void {
        const side = image.dataset.darkSide;
        if (!side) return;

        const inject = () => {
            this.isImageBright(image)
                .then((isBright) => {
                    if (!isBright) return;

                    const el = document.createElement("div");
                    el.className = `dark--${side}`;
                    this.slider.appendChild(el);

                    // Recolour the arrow on that side
                    const arrow = this.slider.querySelector(
                        `.arrow--${side}`,
                    ) as HTMLElement;
                    if (arrow) {
                        arrow.style.borderColor =
                            "var(--ss-color-text-primary)";
                    }
                })
                .catch((err) => {
                    console.warn("Brightness check failed:", err);
                });
        };

        if (image.complete && image.naturalWidth > 0) {
            inject();
        } else {
            image.onload = () => {
                if (image.naturalWidth > 0) inject();
            };
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
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(false);

            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            ctx.drawImage(image, 0, 0);

            const data = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height,
            ).data;
            let r = 0,
                g = 0,
                b = 0,
                count = 0;
            const step = 4 * 20;

            for (let i = 0; i < data.length; i += step) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
                count++;
            }

            const avg = (r + g + b) / (3 * count);
            resolve(avg > 160);
        });
    }

    /** Exposes the handle as a slider to assistive technology. */
    private initHandle(): void {
        const h = this.slider;
        if (!h.hasAttribute("role")) h.setAttribute("role", "slider");
        if (!h.hasAttribute("tabindex")) h.tabIndex = 0;
        if (
            !h.hasAttribute("aria-label") &&
            !h.hasAttribute("aria-labelledby")
        ) {
            h.setAttribute("aria-label", "Comparison position");
        }
        h.setAttribute("aria-valuemin", "0");
        h.setAttribute("aria-valuemax", "100");
        h.setAttribute("aria-orientation", "horizontal");
    }

    /**
     * Initializes mouse, touch and keyboard listeners.
     */
    private initEvents(): void {
        this.slider.addEventListener("mousedown", this.start);
        this.slider.addEventListener("touchstart", this.start, {
            passive: true,
        });
        this.slider.addEventListener("keydown", this.handleKeydown);
        window.addEventListener("mouseup", this.stop);
        window.addEventListener("touchend", this.stop);
        window.addEventListener("mousemove", this.handleMouseMove);
        window.addEventListener("touchmove", this.handleTouchMove);
    }

    private start = (): void => {
        this.isActive = true;
    };

    private stop = (): void => {
        this.isActive = false;
    };

    private handleMouseMove = (e: MouseEvent): void => {
        if (this.isActive) this.slideMove(e.clientX);
    };

    private handleTouchMove = (e: TouchEvent): void => {
        if (this.isActive) this.slideMove(e.touches[0].clientX);
    };

    private handleKeydown = (e: KeyboardEvent): void => {
        const big = this.step * 4;
        const moves: Record<string, number> = {
            ArrowLeft: this.position - this.step,
            ArrowDown: this.position - this.step,
            ArrowRight: this.position + this.step,
            ArrowUp: this.position + this.step,
            PageDown: this.position - big,
            PageUp: this.position + big,
            Home: 0,
            End: 100,
        };
        if (!(e.key in moves)) return;
        e.preventDefault();
        this.setPosition(moves[e.key]);
    };

    /**
     * Moves the slider to a client x-coordinate.
     *
     * @param x - The x-coordinate (client position) to move to
     */
    private slideMove(x: number): void {
        const bounds = this.container.getBoundingClientRect();
        if (bounds.width <= 0) return;
        this.setPosition(((x - bounds.left) / bounds.width) * 100);
    }

    /**
     * Static factory method to initialize all image compare sliders on the page.
     *
     * @param selector - CSS selector for container elements (defaults to the
     *   `ss-c-image-compare` class and the legacy `.image__compare` names)
     * @returns The created instances
     */
    public static initAll(
        selector: string = SELECTORS.container,
    ): ImageCompareSlider[] {
        const containers = document.querySelectorAll<HTMLElement>(selector);
        return Array.from(containers).map(
            (container) => new ImageCompareSlider(container),
        );
    }
}
