// ============================================================================
// Stylescape | Carousel Manager
// ============================================================================
// Manages carousel/slider UI components for cycling through items.
// Supports data-ss-carousel attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for CarouselManager
 */
export interface CarouselManagerOptions {
    /** Selector for carousel items */
    itemSelector?: string;
    /** CSS class for active/visible item */
    activeClass?: string;
    /** ID of the previous button (optional) */
    prevButtonId?: string;
    /** ID of the next button (optional) */
    nextButtonId?: string;
    /** Enable infinite looping */
    loop?: boolean;
    /** Auto-play interval in milliseconds (0 to disable) */
    autoPlay?: number;
    /** Pause auto-play on hover */
    pauseOnHover?: boolean;
    /** Callback when slide changes */
    onChange?: (index: number, total: number) => void;
}

/**
 * Carousel manager for cycling through items like images or cards.
 *
 * @example JavaScript
 * ```typescript
 * const carousel = new CarouselManager("carouselContainer", {
 *     loop: true,
 *     autoPlay: 5000,
 *     onChange: (index, total) => console.log(`Slide ${index + 1}/${total}`)
 * })
 *
 * // Programmatic control
 * carousel.next()
 * carousel.prev()
 * carousel.goTo(2)
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <div id="carouselContainer"
 *      data-ss="carousel"
 *      data-ss-carousel-loop="true"
 *      data-ss-carousel-autoplay="5000">
 *     <div class="carousel-item active">Item 1</div>
 *     <div class="carousel-item">Item 2</div>
 *     <div class="carousel-item">Item 3</div>
 * </div>
 * <button id="prevBtn">Previous</button>
 * <button id="nextBtn">Next</button>
 * ```
 */
export default class CarouselManager {
    /** The carousel container element */
    private container: HTMLElement;

    /** Collection of carousel items */
    private items: NodeListOf<HTMLElement>;

    /** Current active slide index */
    private currentIndex: number = 0;

    /**
     * Creates a new CarouselManager instance.
     *
     * @param containerId - ID of the carousel container element
     */
    constructor(containerId: string) {
        this.container = document.getElementById(containerId) as HTMLElement;
        this.items = this.container.querySelectorAll(".carousel-item");
        this.setupButtons();
    }

    /**
     * Sets up click event listeners for navigation buttons.
     */
    private setupButtons(): void {
        document
            .getElementById("prevBtn")
            ?.addEventListener("click", () => this.movePrev());
        document
            .getElementById("nextBtn")
            ?.addEventListener("click", () => this.moveNext());
    }

    /**
     * Navigate to the previous slide.
     */
    public movePrev(): void {
        if (this.currentIndex > 0) {
            this.items[this.currentIndex].classList.remove("active");
            this.currentIndex--;
            this.items[this.currentIndex].classList.add("active");
        }
    }

    /**
     * Navigate to the next slide.
     */
    public moveNext(): void {
        if (this.currentIndex < this.items.length - 1) {
            this.items[this.currentIndex].classList.remove("active");
            this.currentIndex++;
            this.items[this.currentIndex].classList.add("active");
        }
    }

    /**
     * Get the current slide index.
     *
     * @returns The current zero-based slide index
     */
    public getCurrentIndex(): number {
        return this.currentIndex;
    }

    /**
     * Get the total number of slides.
     *
     * @returns The total count of carousel items
     */
    public getTotalSlides(): number {
        return this.items.length;
    }
}
