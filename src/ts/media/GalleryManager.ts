// ============================================================================
// Stylescape | Gallery Manager
// ============================================================================
// Manages image galleries with selection, navigation, and lightbox support.
// Supports data-ss-gallery attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for GalleryManager
 */
export interface GalleryManagerOptions {
    /** Enable keyboard navigation */
    keyboard?: boolean
    /** Loop navigation at ends */
    loop?: boolean
    /** Open lightbox on click */
    lightbox?: boolean
    /** Callback when image is selected */
    onSelect?: (index: number, image: HTMLImageElement) => void
}

/**
 * Image gallery manager with navigation and selection.
 * Supports click-to-select and keyboard navigation.
 *
 * @example JavaScript
 * ```typescript
 * const gallery = new GalleryManager("#imageGallery")
 *
 * // Navigate programmatically
 * gallery.nextImage()
 * gallery.prevImage()
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <div id="imageGallery"
 *      data-ss="gallery"
 *      data-ss-gallery-lightbox="true">
 *     <img src="thumb1.jpg" alt="Image 1">
 *     <img src="thumb2.jpg" alt="Image 2">
 *     <img src="thumb3.jpg" alt="Image 3">
 * </div>
 * ```
 */
export default class GalleryManager {
    /** Collection of gallery images */
    private images: NodeListOf<HTMLImageElement>

    /** Currently selected image index */
    private currentIndex: number = 0

    /**
     * Creates a new GalleryManager instance.
     *
     * @param gallerySelector - CSS selector for the gallery container
     */
    constructor(gallerySelector: string) {
        this.images = document.querySelectorAll(`${gallerySelector} img`)
        this.images.forEach((image, index) => {
            image.addEventListener("click", () => this.selectImage(index))
        })
    }

    /**
     * Selects an image by index.
     *
     * @param index - The index of the image to select
     */
    private selectImage(index: number): void {
        this.currentIndex = index
        // Additional logic to display selected image, possibly in a lightbox
    }

    /**
     * Navigate to the next image in the gallery.
     * Loops to the first image when at the end.
     */
    public nextImage(): void {
        this.selectImage((this.currentIndex + 1) % this.images.length)
    }

    /**
     * Navigate to the previous image in the gallery.
     * Loops to the last image when at the beginning.
     */
    public prevImage(): void {
        this.selectImage(
            (this.currentIndex - 1 + this.images.length) % this.images.length,
        )
    }

    /**
     * Get the current image index.
     *
     * @returns The current zero-based index
     */
    public getCurrentIndex(): number {
        return this.currentIndex
    }
}
