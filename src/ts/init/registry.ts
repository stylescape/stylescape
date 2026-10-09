// ============================================================================
// Stylescape | Component Registry
// ============================================================================
// Central registry mapping data-ss component names to their handlers.
// This enables automatic component initialization via data attributes.
// ============================================================================

// Element Handlers
import { ContentRevealer } from "../animations/ContentRevealer.js";
import { CountdownTimer } from "../animations/CountdownTimer.js";
import { Preloader } from "../animations/Preloader.js";
import { ProgressBarManager } from "../animations/ProgressBarManager.js";
import { ButtonHandler } from "../buttons/ButtonHandler.js";
import { FabManager } from "../buttons/FabManager.js";
import { ToggleSwitchManager } from "../buttons/ToggleSwitchManager.js";
import { FilterManager } from "../data/FilterManager.js";
import { RatingManager } from "../data/RatingManager.js";
import { TableSortManager } from "../data/TableSortManager.js";
import { AccordionManager } from "../elements/AccordionManager.js";
import { AsideHandler } from "../elements/AsideHandler.js";
import { CollapsibleSectionManager } from "../elements/CollapsibleSectionManager.js";
import { CollapsibleTableHandler } from "../elements/CollapsibleTableHandler.js";
import { ContextMenuManager } from "../elements/ContextMenuManager.js";
import { DetailManager } from "../elements/DetailManager.js";
import { DropdownHandler } from "../elements/DropdownHandler.js";
import { DropdownManager } from "../elements/DropdownManager.js";
import { ExclusiveDetails } from "../elements/ExclusiveDetails.js";
import { Modal } from "../elements/Modal.js";
import { NotificationManager } from "../elements/NotificationManager.js";
import { PasswordToggleManager } from "../elements/PasswordToggleManager.js";
import { ResponsiveMenuManager } from "../elements/ResponsiveMenuManager.js";
import { SheetManager } from "../elements/SheetManager.js";
import { SplitPaneManager } from "../elements/SplitPaneManager.js";
import { TabManager } from "../elements/TabManager.js";
import { Tooltip } from "../elements/Tooltip.js";
// Form Components
import { TreeViewManager } from "../elements/TreeViewManager.js";
import { AutocompleteManager } from "../forms/AutocompleteManager.js";
import { DropZoneManager } from "../forms/DropZoneManager.js";
import { FormValidator } from "../forms/FormValidator.js";
// Scroll Components
import { NumberStepperManager } from "../forms/NumberStepperManager.js";
import { RangeOutputManager } from "../forms/RangeOutputManager.js";
import { ScrollToTopButton } from "../interface/scroll.js";
import { ImageCompareSlider } from "../media/ImageCompareSlider.js";
import LazyLoadManager from "../media/LazyLoadManager.js";
import { DragAndDropManager } from "../mouse/DragAndDropManager.js";
import { ScrollSpyManager } from "../scroll/ScrollSpyManager.js";
import { CookieConsentManager } from "../storage/CookieConsentManager.js";
import { ThemeToggler } from "../utilities/ThemeToggler.js";

// ============================================================================
// Types
// ============================================================================

/**
 * Configuration options that can be passed to a component
 */
export interface ComponentConfig {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

/**
 * A component handler function that initializes a component on an element
 */
export type ComponentHandler = (
    element: HTMLElement,
    config: ComponentConfig,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any;

/**
 * Registry entry containing the handler and optional default config
 */
export interface RegistryEntry {
    handler: ComponentHandler;
    defaults?: ComponentConfig;
}

// ============================================================================
// Component Registry
// ============================================================================

/**
 * Central registry of all available Stylescape components.
 *
 * To register a new component:
 * 1. Import the component class
 * 2. Add an entry with a lowercase name as key
 * 3. Provide a handler function that instantiates the component
 *
 * @example
 * ```typescript
 * componentRegistry.set("mycomponent", {
 *     handler: (el, config) => new MyComponent(el, config),
 *     defaults: { option: "value" }
 * })
 * ```
 */
export const componentRegistry = new Map<string, RegistryEntry>([
    // ========================================================================
    // Element Handlers
    // ========================================================================

    [
        "aside",
        {
            handler: (el, config) => {
                const menuId =
                    config.menuId || el.dataset.ssAsideMenu || el.id;
                const switchId =
                    config.switchId ||
                    el.dataset.ssAsideSwitch ||
                    `${menuId}_switch`;
                return new AsideHandler(menuId, switchId);
            },
            defaults: {},
        },
    ],

    [
        "dropdown",
        {
            handler: (el, config) => {
                const selector =
                    config.selector ||
                    el.dataset.ssDropdownSelector ||
                    ".select_dropdown";
                return new DropdownHandler(selector);
            },
            defaults: {},
        },
    ],

    [
        "collapsible-table",
        {
            handler: (_el, _config) => new CollapsibleTableHandler(),
            defaults: {},
        },
    ],

    [
        "details",
        {
            handler: (_el, _config) => new DetailManager(),
            defaults: {},
        },
    ],

    [
        "exclusive-details",
        {
            handler: (el, config) => {
                const selector =
                    config.selector ||
                    el.dataset.ssExclusiveDetailsSelector ||
                    el.className;
                return new ExclusiveDetails(`.${selector}`);
            },
            defaults: {},
        },
    ],

    [
        "password-toggle",
        {
            handler: (_el, _config) => new PasswordToggleManager(),
            defaults: {},
        },
    ],

    // ========================================================================
    // Media Components
    // ========================================================================

    [
        "image-compare",
        {
            handler: (_el, _config) => {
                // ImageCompareSlider has static initAll, so we use it for the element
                return ImageCompareSlider.initAll();
            },
            defaults: {},
        },
    ],

    // ========================================================================
    // Utility Components
    // ========================================================================

    [
        "theme-toggle",
        {
            // The element itself is the toggle (button or checkbox); a
            // `toggleId` still points at another element, as before.
            handler: (el, config) => {
                const toggleId = config.toggleId || el.dataset.ssThemeToggleId;
                if (toggleId) return ThemeToggler.registerOnLoad(toggleId);
                return ThemeToggler.bind(el);
            },
            defaults: {},
        },
    ],

    // ========================================================================
    // Interactive Components (Placeholders for future implementation)
    // ========================================================================

    [
        "tooltip",
        {
            handler: (el, config) => {
                return new Tooltip(el, {
                    content:
                        config.content ||
                        el.dataset.ssTooltipContent ||
                        el.title,
                    position: config.position || el.dataset.ssTooltipPosition,
                    trigger:
                        config.trigger?.split(",") ||
                        el.dataset.ssTooltipTrigger?.split(","),
                    ...config,
                });
            },
            defaults: { position: "top" },
        },
    ],

    [
        "modal",
        {
            handler: (el, config) => {
                return new Modal(el, {
                    closeOnBackdrop:
                        config.closeOnBackdrop ??
                        el.dataset.ssModalCloseBackdrop !== "false",
                    closeOnEscape:
                        config.closeOnEscape ??
                        el.dataset.ssModalCloseEscape !== "false",
                    ...config,
                });
            },
            defaults: {},
        },
    ],

    [
        "modal-trigger",
        {
            handler: (el, config) => {
                const targetSelector =
                    config.target || el.dataset.ssModalTrigger;
                if (!targetSelector) return null;

                const modalEl =
                    document.querySelector<HTMLElement>(targetSelector);
                if (!modalEl) return null;

                const modal = new Modal(modalEl);
                el.addEventListener("click", () => modal.open(el));
                return modal;
            },
            defaults: {},
        },
    ],

    [
        "accordion",
        {
            handler: (el, config) => {
                return new AccordionManager(el, {
                    allowMultiple:
                        config.multiple ??
                        el.dataset.ssAccordionMultiple === "true",
                    defaultOpen:
                        config.defaultOpen ??
                        (el.dataset.ssAccordionDefaultOpen
                            ? parseInt(el.dataset.ssAccordionDefaultOpen, 10)
                            : -1),
                    ...config,
                });
            },
            defaults: { multiple: false },
        },
    ],

    [
        "tabs",
        {
            handler: (el, config) => new TabManager(el, config),
            defaults: {},
        },
    ],

    [
        "carousel",
        {
            handler: (el, config) => {
                const slides = el.querySelectorAll("[data-ss-carousel-slide]");
                const autoplay =
                    config.autoplay !== false &&
                    el.dataset.ssCarouselAutoplay !== "false";
                const interval = parseInt(
                    config.interval || el.dataset.ssCarouselInterval || "5000",
                    10,
                );

                let currentIndex = 0;
                let timer: number | null = null;

                const goTo = (index: number) => {
                    currentIndex = (index + slides.length) % slides.length;
                    slides.forEach((slide, i) => {
                        slide.classList.toggle(
                            "carousel-slide--active",
                            i === currentIndex,
                        );
                    });
                };

                const next = () => goTo(currentIndex + 1);
                const prev = () => goTo(currentIndex - 1);

                // Navigation buttons
                el.querySelector("[data-ss-carousel-prev]")?.addEventListener(
                    "click",
                    prev,
                );
                el.querySelector("[data-ss-carousel-next]")?.addEventListener(
                    "click",
                    next,
                );

                // Dots/indicators
                el.querySelectorAll("[data-ss-carousel-dot]").forEach(
                    (dot, i) => {
                        dot.addEventListener("click", () => goTo(i));
                    },
                );

                // Autoplay
                if (autoplay) {
                    timer = window.setInterval(next, interval);

                    el.addEventListener("mouseenter", () => {
                        if (timer) clearInterval(timer);
                    });
                    el.addEventListener("mouseleave", () => {
                        timer = window.setInterval(next, interval);
                    });
                }

                goTo(0);

                return {
                    goTo,
                    next,
                    prev,
                    destroy: () => {
                        if (timer) clearInterval(timer);
                    },
                };
            },
            defaults: { autoplay: true, interval: 5000 },
        },
    ],

    // ========================================================================
    // Animation Components
    // ========================================================================

    [
        "preloader",
        {
            handler: (el, config) => {
                return new Preloader(el, {
                    timeout:
                        config.timeout ??
                        (el.dataset.ssPreloaderTimeout
                            ? parseInt(el.dataset.ssPreloaderTimeout, 10)
                            : undefined),
                    minDisplayTime:
                        config.minDisplayTime ??
                        (el.dataset.ssPreloaderMinDisplay
                            ? parseInt(el.dataset.ssPreloaderMinDisplay, 10)
                            : undefined),
                    ...config,
                });
            },
            defaults: {},
        },
    ],

    [
        "reveal",
        {
            handler: (el, config) => {
                return new ContentRevealer(el, {
                    delay:
                        config.delay ??
                        (el.dataset.ssRevealDelay
                            ? parseInt(el.dataset.ssRevealDelay, 10)
                            : undefined),
                    onScroll:
                        config.onScroll ??
                        el.dataset.ssRevealOnScroll === "true",
                    threshold:
                        config.threshold ??
                        (el.dataset.ssRevealThreshold
                            ? parseFloat(el.dataset.ssRevealThreshold)
                            : undefined),
                    ...config,
                });
            },
            defaults: {},
        },
    ],

    [
        "countdown",
        {
            handler: (el, config) => {
                return new CountdownTimer(el, {
                    endTime: config.endTime ?? el.dataset.ssCountdownEndTime,
                    format: config.format ?? el.dataset.ssCountdownFormat,
                    endText: config.endText ?? el.dataset.ssCountdownEndText,
                    ...config,
                });
            },
            defaults: {},
        },
    ],

    [
        "progress",
        {
            handler: (el, config) => {
                return new ProgressBarManager(el, {
                    value:
                        config.value ??
                        (el.dataset.ssProgressValue
                            ? parseInt(el.dataset.ssProgressValue, 10)
                            : undefined),
                    animate:
                        config.animate ??
                        el.dataset.ssProgressAnimate !== "false",
                    animationDuration:
                        config.animationDuration ??
                        (el.dataset.ssProgressDuration
                            ? parseInt(el.dataset.ssProgressDuration, 10)
                            : undefined),
                    ...config,
                });
            },
            defaults: {},
        },
    ],

    // ========================================================================
    // Form Components
    // ========================================================================

    [
        "validate",
        {
            handler: (el, config) => {
                if (el.tagName === "FORM") {
                    return new FormValidator(el as HTMLFormElement, config);
                }
                return null;
            },
            defaults: {},
        },
    ],

    [
        "autocomplete",
        {
            handler: (el, config) => {
                if (el.tagName === "INPUT") {
                    return new AutocompleteManager(el as HTMLInputElement, {
                        minChars:
                            config.minChars ??
                            (el.dataset.ssAutocompleteMinChars
                                ? parseInt(
                                      el.dataset.ssAutocompleteMinChars,
                                      10,
                                  )
                                : undefined),
                        suggestions: config.suggestions,
                        ...config,
                    });
                }
                return null;
            },
            defaults: {},
        },
    ],

    // ========================================================================
    // Button/Input Components
    // ========================================================================

    [
        "button",
        {
            handler: (el, config) => {
                if (el.tagName === "BUTTON") {
                    return new ButtonHandler(el as HTMLButtonElement, {
                        disableOnLoading:
                            config.disableOnLoading ??
                            el.dataset.ssButtonLoading === "true",
                        ripple:
                            config.ripple ??
                            el.dataset.ssButtonRipple !== "false",
                        ...config,
                    });
                }
                return null;
            },
            defaults: {},
        },
    ],

    [
        "toggle",
        {
            handler: (el, config) => {
                if (
                    el.tagName === "INPUT" &&
                    (el as HTMLInputElement).type === "checkbox"
                ) {
                    return new ToggleSwitchManager(el as HTMLInputElement, {
                        persist:
                            config.persist ??
                            el.dataset.ssTogglePersist === "true",
                        storageKey:
                            config.storageKey ?? el.dataset.ssToggleStorageKey,
                        ...config,
                    });
                }
                return null;
            },
            defaults: {},
        },
    ],

    // ========================================================================
    // Mouse/Interaction Components
    // ========================================================================

    [
        "draggable",
        {
            handler: (el, config) => {
                return new DragAndDropManager(el, {
                    handleSelector:
                        config.handleSelector ?? el.dataset.ssDraggableHandle,
                    dropZoneSelector:
                        config.dropZoneSelector ??
                        el.dataset.ssDraggableDropzone,
                    ...config,
                });
            },
            defaults: {},
        },
    ],

    // ========================================================================
    // Data Components
    // ========================================================================

    [
        "filter",
        {
            handler: (el, config) => {
                if (el.tagName === "INPUT") {
                    return new FilterManager(el as HTMLInputElement, {
                        itemSelector:
                            config.itemSelector ?? el.dataset.ssFilterItems,
                        debounce:
                            config.debounce ??
                            (el.dataset.ssFilterDebounce
                                ? parseInt(el.dataset.ssFilterDebounce, 10)
                                : undefined),
                        minChars:
                            config.minChars ??
                            (el.dataset.ssFilterMinChars
                                ? parseInt(el.dataset.ssFilterMinChars, 10)
                                : undefined),
                        ...config,
                    });
                }
                return null;
            },
            defaults: {},
        },
    ],

    [
        "rating",
        {
            handler: (el, config) => {
                return new RatingManager(el, {
                    max:
                        config.max ??
                        (el.dataset.ssRatingMax
                            ? parseInt(el.dataset.ssRatingMax, 10)
                            : undefined),
                    value:
                        config.value ??
                        (el.dataset.ssRatingValue
                            ? parseFloat(el.dataset.ssRatingValue)
                            : undefined),
                    half: config.half ?? el.dataset.ssRatingHalf === "true",
                    readOnly:
                        config.readOnly ??
                        el.dataset.ssRatingReadonly === "true",
                    ...config,
                });
            },
            defaults: {},
        },
    ],

    // ========================================================================
    // Storage Components
    // ========================================================================

    [
        "cookie-consent",
        {
            handler: (el, config) => {
                return new CookieConsentManager({
                    message: config.message ?? el.dataset.ssCookieMessage,
                    position: config.position ?? el.dataset.ssCookiePosition,
                    privacyPolicyUrl:
                        config.privacyPolicyUrl ??
                        el.dataset.ssCookiePrivacyUrl,
                    ...config,
                });
            },
            defaults: {},
        },
    ],

    // ========================================================================
    // Scroll Components
    // ========================================================================

    [
        "scrollspy",
        {
            handler: (el, config) => {
                return new ScrollSpyManager({
                    navSelector:
                        config.navSelector ??
                        el.dataset.ssScrollspyNav ??
                        `#${el.id} a`,
                    threshold:
                        config.threshold ??
                        (el.dataset.ssScrollspyThreshold
                            ? parseFloat(el.dataset.ssScrollspyThreshold)
                            : undefined),
                    smoothScroll:
                        config.smoothScroll ??
                        el.dataset.ssScrollspySmooth !== "false",
                    offset:
                        config.offset ??
                        (el.dataset.ssScrollspyOffset
                            ? parseInt(el.dataset.ssScrollspyOffset, 10)
                            : undefined),
                    ...config,
                });
            },
            defaults: {},
        },
    ],

    [
        "scroll-to-top",
        {
            handler: (el, config) => {
                return new ScrollToTopButton({
                    button: el,
                    threshold:
                        config.threshold ??
                        (el.dataset.ssScrollThreshold
                            ? parseInt(el.dataset.ssScrollThreshold, 10)
                            : undefined),
                    ...config,
                });
            },
            defaults: {},
        },
    ],

    [
        "scroll-to",
        {
            handler: (el, config) => {
                const target =
                    config.target ??
                    el.dataset.ssScrollTarget ??
                    el.getAttribute("href");
                const offset =
                    config.offset ??
                    (el.dataset.ssScrollOffset
                        ? parseInt(el.dataset.ssScrollOffset, 10)
                        : 0);

                el.addEventListener("click", (e) => {
                    e.preventDefault();
                    if (target) {
                        const targetEl =
                            document.querySelector<HTMLElement>(target);
                        if (targetEl) {
                            const top =
                                targetEl.getBoundingClientRect().top +
                                window.pageYOffset +
                                offset;
                            window.scrollTo({ top, behavior: "smooth" });
                        }
                    }
                });

                return { target, offset };
            },
            defaults: {},
        },
    ],

    // ========================================================================
    // Notification Component
    // ========================================================================

    [
        "notification-container",
        {
            handler: (el, config) => {
                return new NotificationManager({
                    position:
                        config.position ?? el.dataset.ssNotificationPosition,
                    maxNotifications:
                        config.maxNotifications ??
                        (el.dataset.ssNotificationMax
                            ? parseInt(el.dataset.ssNotificationMax, 10)
                            : undefined),
                    ...config,
                });
            },
            defaults: {},
        },
    ],

    // ========================================================================
    // Collapsible/Menu Components
    // ========================================================================

    [
        "collapsible",
        {
            handler: (el, config) => {
                return new CollapsibleSectionManager(el, {
                    expanded:
                        config.expanded ??
                        el.dataset.ssCollapsibleExpanded === "true",
                    persist:
                        config.persist ??
                        el.dataset.ssCollapsiblePersist === "true",
                    ...config,
                });
            },
            defaults: {},
        },
    ],

    [
        "responsive-menu",
        {
            handler: (el, config) => {
                const toggle = el.querySelector<HTMLElement>(
                    "[data-ss-menu-toggle]",
                );
                const menu = el.querySelector<HTMLElement>(
                    "[data-ss-menu-content]",
                );

                if (!toggle || !menu) return null;

                return new ResponsiveMenuManager(menu, toggle, {
                    breakpoint:
                        config.breakpoint ??
                        (el.dataset.ssMenuBreakpoint
                            ? parseInt(el.dataset.ssMenuBreakpoint, 10)
                            : undefined),
                    ...config,
                });
            },
            defaults: {},
        },
    ],

    // ========================================================================
    // Layout, data display and form controls
    // ========================================================================

    [
        "split-pane",
        {
            handler: (el) =>
                el.matches(".ss-c-split__handle, [data-ss-split-handle]")
                    ? new SplitPaneManager(el)
                    : SplitPaneManager.initAll(el),
            defaults: {},
        },
    ],

    [
        "sheet",
        {
            handler: (el) => new SheetManager(el),
            defaults: {},
        },
    ],

    [
        "tree",
        {
            handler: (el, config) => new TreeViewManager(el, config),
            defaults: {},
        },
    ],

    [
        "table-sort",
        {
            handler: (el, config) =>
                new TableSortManager(el as HTMLTableElement, config),
            defaults: {},
        },
    ],

    [
        "range-output",
        {
            handler: (el) => new RangeOutputManager(el),
            defaults: {},
        },
    ],

    [
        "stepper",
        {
            handler: (el) => new NumberStepperManager(el),
            defaults: {},
        },
    ],

    [
        "dropzone",
        {
            handler: (el, config) =>
                new DropZoneManager(el, { maxSize: config.maxSize }),
            defaults: {},
        },
    ],

    [
        "fab",
        {
            handler: (el) => new FabManager(el),
            defaults: {},
        },
    ],

    [
        "lazy",
        {
            handler: (el, config) => new LazyLoadManager(el, config),
            defaults: {},
        },
    ],

    [
        "context-menu",
        {
            // On the target; `data-ss-context-menu-menu` names the menu's id.
            handler: (el, config) => {
                const id = config.menu || el.dataset.ssContextMenuMenu;
                const menu = id ? document.getElementById(id) : null;
                return menu
                    ? new ContextMenuManager(menu, { target: el })
                    : null;
            },
            defaults: {},
        },
    ],

    [
        "dropdown-menu",
        {
            handler: (el) => new DropdownManager(el),
            defaults: {},
        },
    ],
]);

// ============================================================================
// Registry Utilities
// ============================================================================

/**
 * Register a new component in the registry
 *
 * @param name - Component name (used in data-ss attribute)
 * @param entry - Handler function and optional defaults
 */
export function registerComponent(name: string, entry: RegistryEntry): void {
    componentRegistry.set(name.toLowerCase(), entry);
}

/**
 * Check if a component is registered
 *
 * @param name - Component name to check
 */
export function hasComponent(name: string): boolean {
    return componentRegistry.has(name.toLowerCase());
}

/**
 * Get a registered component entry
 *
 * @param name - Component name
 */
export function getComponent(name: string): RegistryEntry | undefined {
    return componentRegistry.get(name.toLowerCase());
}

/**
 * Get all registered component names
 */
export function getComponentNames(): string[] {
    return Array.from(componentRegistry.keys());
}
