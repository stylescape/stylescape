// ============================================================================
// Stylescape | Lazy Load Manager
// ============================================================================
// Manages lazy loading of images and content using Intersection Observer.
// Supports data-ss="lazy" and data-src attributes for declarative configuration.
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

/** What the constructor accepts: a selector, one element or a collection. */
export type LazyLoadTarget =
    string | HTMLElement | NodeListOf<HTMLElement> | HTMLElement[];

/**
 * Lazy load manager using Intersection Observer API.
 * Defers loading of images until they enter the viewport.
 *
 * `<img>`, `<iframe>`, `<video>`, `<audio>` and `<source>` elements get their
 * `src` (and `srcset` from `data-srcset`) swapped in; any other element gets
 * the source as its `background-image`.
 *
 * @example JavaScript
 * ```typescript
 * new LazyLoadManager(".ss-c-lazy-image")
 * new LazyLoadManager(document.querySelector("img")!)
 * new LazyLoadManager(document.querySelectorAll("[data-src]"))
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <img data-ss="lazy" data-src="large-image.jpg" src="placeholder.jpg" alt="…">
 * <div data-ss="lazy" data-src="background.jpg"></div>
 * ```
 */
export default class LazyLoadManager {
    /** Collection of items to lazy load */
    private items: HTMLElement[];
    private options: Required<LazyLoadManagerOptions>;
    private observer: IntersectionObserver | null = null;

    /**
     * Creates a new LazyLoadManager instance.
     *
     * @param target - CSS selector, element, NodeList or array of elements
     * @param options - Observer and loading options
     */
    constructor(target: LazyLoadTarget, options: LazyLoadManagerOptions = {}) {
        this.items = LazyLoadManager.resolve(target);
        this.options = {
            rootMargin: options.rootMargin ?? "0px",
            threshold: options.threshold ?? 0,
            srcAttribute: options.srcAttribute ?? "data-src",
            loadedClass: options.loadedClass ?? "is-loaded",
            onLoad: options.onLoad ?? (() => {}),
        };
        this.observeItems();
    }

    /** Load every pending item now, without waiting for intersection. */
    public loadAll(): void {
        this.items.forEach((item) => this.load(item));
    }

    /** Stop observing; items that have not loaded keep their placeholder. */
    public destroy(): void {
        this.observer?.disconnect();
        this.observer = null;
    }

    private static resolve(target: LazyLoadTarget): HTMLElement[] {
        if (typeof target === "string") {
            return Array.from(document.querySelectorAll<HTMLElement>(target));
        }
        if (target instanceof HTMLElement) {
            return [target];
        }
        return Array.from(target);
    }

    /**
     * Sets up Intersection Observer to watch items.
     * Loads content when items become visible.
     */
    private observeItems(): void {
        if (typeof IntersectionObserver === "undefined") {
            // No observer support: load straight away rather than never.
            this.loadAll();
            return;
        }

        this.observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const item = entry.target as HTMLElement;
                    this.load(item);
                    observer.unobserve(item);
                });
            },
            {
                rootMargin: this.options.rootMargin,
                threshold: this.options.threshold,
            },
        );

        this.items.forEach((item) => this.observer?.observe(item));
    }

    /** Promote the stored source onto the element. */
    private load(item: HTMLElement): void {
        const src = item.getAttribute(this.options.srcAttribute);
        if (!src) return;

        if (item.matches("img, iframe, video, audio, source, embed")) {
            const srcset = item.getAttribute("data-srcset");
            if (srcset) item.setAttribute("srcset", srcset);
            item.setAttribute("src", src);
        } else {
            item.style.backgroundImage = `url("${src.replace(/"/g, '\\"')}")`;
        }

        item.removeAttribute(this.options.srcAttribute);
        item.classList.add(this.options.loadedClass);
        this.options.onLoad(item);
    }
}
