// ============================================================================
// Stylescape | Preloader
// ============================================================================
// Manages a preloader element that displays during page load.
// Supports data-ss-preloader attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for Preloader
 */
export interface PreloaderOptions {
    /** Timeout before hiding (ms) */
    timeout?: number;
    /**
     * CSS class to add when hidden. Defaults to `ss-c-preloader--hidden`,
     * which the preloader module fades out. Pass `"preloader--hidden"` (the old
     * default) or `"ss-c-preloader_hidden"` (instant
     * `display: none`) to keep older markup or stylesheets working. Can also
     * be set with `data-ss-preloader-hidden-class`.
     */
    hiddenClass?: string;
    /** Minimum display time (ms) */
    minDisplayTime?: number;
    /** Callback when preloader is hidden */
    onHide?: () => void;
}

/**
 * Preloader component that shows a loading indicator during page load.
 *
 * @example JavaScript
 * ```typescript
 * const preloader = new Preloader(".ss-c-preloader", { timeout: 500 })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <div class="ss-c-preloader"
 *      data-ss="preloader"
 *      data-ss-preloader-timeout="500"
 *      data-ss-preloader-min-display="200">
 *     <div class="ss-c-preloader__pulse"></div>
 * </div>
 * ```
 */
/** Default hidden class; styled by `31-modules/preloader`. */
export const PRELOADER_HIDDEN_CLASS = "ss-c-preloader--hidden";

export class Preloader {
    private element: HTMLElement | null;
    private options: Required<PreloaderOptions>;
    private startTime: number;
    private isHidden: boolean = false;

    constructor(
        selectorOrElement: string | HTMLElement,
        options: PreloaderOptions = {},
    ) {
        this.element =
            typeof selectorOrElement === "string"
                ? document.querySelector<HTMLElement>(selectorOrElement)
                : selectorOrElement;

        this.options = {
            timeout: options.timeout ?? 500,
            hiddenClass:
                options.hiddenClass ??
                this.element?.dataset.ssPreloaderHiddenClass ??
                PRELOADER_HIDDEN_CLASS,
            minDisplayTime: options.minDisplayTime ?? 0,
            onHide: options.onHide ?? (() => {}),
        };

        this.startTime = Date.now();

        if (!this.element) {
            console.warn("[Stylescape] Preloader element not found");
            return;
        }

        this.init();
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Manually show the preloader
     */
    public show(): void {
        if (!this.element) return;

        this.isHidden = false;
        this.startTime = Date.now();
        this.element.classList.remove(this.options.hiddenClass);
        this.element.setAttribute("aria-hidden", "false");
    }

    /**
     * Manually hide the preloader
     */
    public hide(): void {
        if (!this.element || this.isHidden) return;

        const elapsed = Date.now() - this.startTime;
        const remaining = Math.max(0, this.options.minDisplayTime - elapsed);

        setTimeout(() => {
            if (!this.element) return;

            this.element.classList.add(this.options.hiddenClass);
            this.element.setAttribute("aria-hidden", "true");
            this.isHidden = true;
            this.options.onHide();
        }, remaining);
    }

    /**
     * Destroy the preloader instance
     */
    public destroy(): void {
        this.hide();
        this.element = null;
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private init(): void {
        // Set ARIA attributes for accessibility
        this.element?.setAttribute("role", "progressbar");
        this.element?.setAttribute("aria-busy", "true");
        this.element?.setAttribute("aria-hidden", "false");

        // Hide on window load with timeout
        if (document.readyState === "complete") {
            this.scheduleHide();
        } else {
            window.addEventListener("load", () => this.scheduleHide());
        }
    }

    private scheduleHide(): void {
        setTimeout(() => this.hide(), this.options.timeout);
    }
}

export default Preloader;
