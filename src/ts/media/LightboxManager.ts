// ============================================================================
// Stylescape | Lightbox Manager
// ============================================================================
// Creates and manages lightbox overlays for viewing images and content.
// Supports data-ss-lightbox attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for LightboxManager
 */
export interface LightboxManagerOptions {
    /** CSS class for active state */
    activeClass?: string
    /** Close on backdrop click */
    closeOnBackdrop?: boolean
    /** Close on Escape key */
    closeOnEscape?: boolean
    /** Animation duration in ms */
    animationDuration?: number
    /** Callback when lightbox opens */
    onOpen?: () => void
    /** Callback when lightbox closes */
    onClose?: () => void
}

/**
 * Lightbox manager for viewing content in fullscreen overlay.
 * Supports images, HTML content, and custom close behavior.
 *
 * @example JavaScript
 * ```typescript
 * const lightbox = new LightboxManager("myLightbox")
 *
 * // Show with image
 * lightbox.showLightbox('<img src="fullsize.jpg" />')
 *
 * // Show with custom content
 * lightbox.showLightbox('<div class="video-container">...</div>')
 *
 * // Close programmatically
 * lightbox.hideLightbox()
 * ```
 *
 * @example HTML structure
 * ```html
 * <div id="myLightbox" class="lightbox" data-ss="lightbox">
 *     <button class="close">&times;</button>
 *     <div class="content"></div>
 * </div>
 *
 * <!-- Trigger -->
 * <img src="thumb.jpg"
 *      data-ss-lightbox-src="fullsize.jpg"
 *      onclick="lightbox.showLightbox('<img src=\\'fullsize.jpg\\' />')">
 * ```
 */
export default class LightboxManager {
    /** The lightbox container element */
    private lightbox: HTMLElement

    /**
     * Creates a new LightboxManager instance.
     *
     * @param lightboxId - ID of the lightbox container element
     */
    constructor(lightboxId: string) {
        this.lightbox = document.getElementById(lightboxId) as HTMLElement
        const closeButton = this.lightbox.querySelector(
            ".close",
        ) as HTMLElement
        closeButton.addEventListener("click", () => this.hideLightbox())
    }

    /**
     * Shows the lightbox with the specified content.
     *
     * @param content - HTML content to display in the lightbox
     */
    public showLightbox(content: string): void {
        const contentContainer = this.lightbox.querySelector(
            ".content",
        ) as HTMLElement
        contentContainer.innerHTML = content
        this.lightbox.classList.add("active")
    }

    /**
     * Hides the lightbox and clears content.
     */
    public hideLightbox(): void {
        this.lightbox.classList.remove("active")
    }
}
