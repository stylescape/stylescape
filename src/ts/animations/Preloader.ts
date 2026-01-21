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
  /** CSS class to add when hidden */
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
 * const preloader = new Preloader(".preloader", { timeout: 500 })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <div class="preloader"
 *      data-ss="preloader"
 *      data-ss-preloader-timeout="500"
 *      data-ss-preloader-min-display="200">
 *     <div class="preloader__spinner"></div>
 * </div>
 * ```
 */
export class Preloader {
  private element: HTMLElement | null;
  private options: Required<PreloaderOptions>;
  private startTime: number;
  private isHidden: boolean = false;

  constructor(selectorOrElement: string | HTMLElement, options: PreloaderOptions = {}) {
    this.element =
      typeof selectorOrElement === "string"
        ? document.querySelector<HTMLElement>(selectorOrElement)
        : selectorOrElement;

    this.options = {
      timeout: options.timeout ?? 500,
      hiddenClass: options.hiddenClass ?? "preloader--hidden",
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

//     constructor(preloaderName: string, preloaderTimeout: number) {
//         this.preloaderName = preloaderName
//         this.preloaderElement = document.querySelector(preloaderName)
//         this.preloaderTimeout = preloaderTimeout
//         if (!this.preloaderElement) {
//             // pass
//             // console.warn(`Preloader element not found: ${preloaderName}`)
//         } else {
//             this.setPreloader()
//         }
//     }

//     setPreloader(): void {
//         window.addEventListener('load', this.handleLoadEvent.bind(this))
//     }

//     private handleLoadEvent(): void {
//         if (this.preloaderElement) {
//             setTimeout(() => this.hidePreloader(), this.preloaderTimeout)
//         }
//     }

//     private hidePreloader(): void {
//         if (this.preloaderElement) {
//             this.preloaderElement.classList.add('preloader_hidden')
//         }
//     }

//     // Optional: Method to update the preloader element dynamically
//     updatePreloaderElement(selector: string): void {
//         this.preloaderName = selector
//         this.preloaderElement = document.querySelector(selector)

//         if (!this.preloaderElement) {
//             console.warn(`Updated preloader element not found: ${selector}`)
//         }
//     }
// }
