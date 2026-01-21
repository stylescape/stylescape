// ============================================================================
// Stylescape | Lazy Load Manager
// ============================================================================
// Manages lazy loading of images and content using Intersection Observer.
// Supports data-ss-lazy and data-src attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for LazyLoadManager
 */
export interface LazyLoadManagerOptions {
    /** Root margin for intersection observer */
    rootMargin?: string;
    /** Threshold for visibility (0-1) */
    threshold?: number;
    /** Attribute containing the real source */
    srcAttribute?: string;
    /** CSS class added when loaded */
    loadedClass?: string;
    /** Callback when item loads */
    onLoad?: (element: HTMLElement) => void;
}

/**
 * Lazy load manager using Intersection Observer API.
 * Defers loading of images until they enter the viewport.
 *
 * @example JavaScript
 * ```typescript
 * const lazyLoader = new LazyLoadManager(".lazy-image")
 * ```
 *
 * @example HTML with data-src
 * ```html
 * <!-- Images with placeholder -->
 * <img class="lazy-image"
 *      data-src="large-image.jpg"
 *      src="placeholder.jpg"
 *      alt="Lazy loaded image">
 *
 * <!-- Background images -->
 * <div class="lazy-bg"
 *      data-ss="lazy"
 *      data-src="background.jpg">
 * </div>
 * ```
 */
export default class LazyLoadManager {
    /** Collection of items to lazy load */
    private items: NodeListOf<HTMLElement>;

    /**
     * Creates a new LazyLoadManager instance.
     *
     * @param itemsSelector - CSS selector for elements to lazy load
     */
    constructor(itemsSelector: string) {
        this.items = document.querySelectorAll(itemsSelector);
        this.observeItems();
    }

    /**
     * Sets up Intersection Observer to watch items.
     * Loads content when items become visible.
     */
    private observeItems(): void {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Replace placeholder with actual content
                    const item = entry.target as HTMLImageElement;
                    if (item.dataset.src) {
                        item.src = item.dataset.src;
                    }
                    observer.unobserve(item);
                }
            });
        });

        this.items.forEach((item) => observer.observe(item));
    }
}
