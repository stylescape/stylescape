// ============================================================================
// Stylescape | Initialization Module
// ============================================================================
// Main entry point for the Stylescape initialization system.
// Provides both legacy initialization and new auto-init functionality.
// ============================================================================

import { ActiveLinkHighlighter } from "../content/ActiveLinkHighlighter.js";
import { TableOfContentsBuilder } from "../content/TableOfContentsBuilder.js";
import { AsideHandler } from "../elements/AsideHandler.js";
import { CollapsibleTableHandler } from "../elements/CollapsibleTableHandler.js";
import { DetailManager } from "../elements/DetailManager.js";
import { DropdownHandler } from "../elements/DropdownHandler.js";
import { ExclusiveDetails } from "../elements/ExclusiveDetails.js";
import { PasswordToggleManager } from "../elements/PasswordToggleManager.js";
import { ImageCompareSlider } from "../media/ImageCompareSlider.js";
import { ScrollElementManager } from "../scroll/ScrollElementManager.js";
import { ScrollPageManager } from "../scroll/ScrollPageManager.js";
import { AccordionState } from "../storage/AccordionState.js";
import { ClipboardHelper } from "../utilities/ClipboardHelper.js";
import { FontPreview } from "../utilities/FontPreview.js";
import { GridManager } from "../utilities/GridManager.js";
import { ThemeToggler } from "../utilities/ThemeToggler.js";

// Import auto-init system
import {
    autoStart,
    destroy,
    getAllInstances,
    getInstance,
    init,
    observe,
    reinit,
    setAttributePrefix,
    setAutoInit,
    setDebug,
    setObserver,
    stopObserving,
} from "./autoInit.js";
import type {
    ComponentConfig,
    ComponentHandler,
    RegistryEntry,
} from "./registry.js";
import {
    componentRegistry,
    getComponent,
    getComponentNames,
    hasComponent,
    registerComponent,
} from "./registry.js";

// ============================================================================
// Re-exports for auto-init system
// ============================================================================

export {
    autoStart,
    // Registry functions
    componentRegistry,
    destroy,
    getAllInstances,
    getComponent,
    getComponentNames,
    getInstance,
    hasComponent,
    // Auto-init functions
    init,
    observe,
    registerComponent,
    reinit,
    setAttributePrefix,
    setAutoInit,
    setDebug,
    setObserver,
    stopObserving,
};

export type { ComponentConfig, ComponentHandler, RegistryEntry };

// ============================================================================
// Global Stylescape Object
// ============================================================================

/**
 * Global Stylescape interface exposed on window object
 */
export interface StylescapeGlobal {
    // Auto-init system
    init: typeof init;
    getInstance: typeof getInstance;
    getAllInstances: typeof getAllInstances;
    reinit: typeof reinit;
    destroy: typeof destroy;
    observe: typeof observe;
    stopObserving: typeof stopObserving;

    // Configuration
    autoInit: boolean;
    debug: boolean;

    // Registry
    registerComponent: typeof registerComponent;
    hasComponent: typeof hasComponent;
    getComponentNames: typeof getComponentNames;

    // Version info
    version: string;
}

/**
 * Create and expose the global Stylescape object
 */
function createGlobal(): StylescapeGlobal {
    let autoInitEnabled = true;
    let debugEnabled = false;

    const stylescape: StylescapeGlobal = {
        // Auto-init functions
        init,
        getInstance,
        getAllInstances,
        reinit,
        destroy,
        observe,
        stopObserving,

        // Configuration with getters/setters
        get autoInit() {
            return autoInitEnabled;
        },
        set autoInit(value: boolean) {
            autoInitEnabled = value;
            setAutoInit(value);
        },

        get debug() {
            return debugEnabled;
        },
        set debug(value: boolean) {
            debugEnabled = value;
            setDebug(value);
        },

        // Registry access
        registerComponent,
        hasComponent,
        getComponentNames,

        // Version
        version: "1.0.0",
    };

    return stylescape;
}

// Expose globally
if (typeof window !== "undefined") {
    (
        window as unknown as { Stylescape: ReturnType<typeof createGlobal> }
    ).Stylescape = createGlobal();
    (
        window as unknown as { ClipboardHelper: typeof ClipboardHelper }
    ).ClipboardHelper = ClipboardHelper;
}

// ============================================================================
// Legacy Initialization Function
// ============================================================================

/**
 * Legacy initialization function for backward compatibility.
 * Initializes all Stylescape components the traditional way.
 *
 * @deprecated Use data-ss attributes and auto-init instead
 */
export function initializeStylescape(): void {
    document.addEventListener("DOMContentLoaded", () => {
        // Initialize auto-init system
        init();
        observe();

        // Legacy initializations for components not yet using data-ss
        new ScrollPageManager();
        new ScrollElementManager(
            "#main_content",
            "main_content_scroll",
            false,
        );
        new ScrollElementManager(
            "#sidebar_left_content",
            "sidebar_left_content_scroll",
            false,
        );

        new ActiveLinkHighlighter();
        new PasswordToggleManager();
        ThemeToggler.registerOnLoad("themeToggle");

        const tocBuilder = new TableOfContentsBuilder("main_content", "toc");
        tocBuilder.buildAndAppendTOC();

        new ExclusiveDetails(".ribbon_menu_button");

        new DetailManager();

        // Initialize accordion state persistence for sidebar
        new AccordionState(
            "details.sidebar__accordion",
            "sidebar-accordion-state",
        );

        const current = location.pathname.split("/").pop();
        const activeLink = document.querySelector(`a[href$="${current}"]`);
        if (activeLink) {
            activeLink.classList.add("active");
        }

        const handlers: AsideHandler[] = [];
        document.querySelectorAll("[id$='_switch']").forEach((switchEl) => {
            const switchId = switchEl.id;
            const menuId = switchId.replace("_switch", "_menu");
            const menuEl = document.getElementById(menuId);
            if (menuEl) {
                handlers.push(new AsideHandler(menuId, switchId));
            }
        });
        (
            window as unknown as { asideHandlers: AsideHandler[] }
        ).asideHandlers = handlers;

        ImageCompareSlider.initAll();
        new DropdownHandler();
        new CollapsibleTableHandler();

        // Initialize font preview if the input element exists
        const fontPreviewInput = document.querySelector("#font-preview-input");
        if (fontPreviewInput) {
            try {
                new FontPreview(
                    "#font-preview-input",
                    ".preview__font--output",
                );
            } catch (_e) {
                // Silently fail if no preview elements found
            }
        }
    });

    window.addEventListener("load", () => {
        requestAnimationFrame(() => {
            new GridManager();
        });
    });
}

// ============================================================================
// Auto-start (enabled by default)
// ============================================================================

// Auto-initialize by default when the module loads
// To disable, set window.STYLESCAPE_AUTO_INIT = false before loading the script
if (typeof document !== "undefined") {
    const scriptTag = document.currentScript;
    const shouldSkipAutoStart =
        scriptTag?.hasAttribute("data-ss-no-auto") ||
        (window as unknown as { STYLESCAPE_AUTO_INIT?: boolean })
            .STYLESCAPE_AUTO_INIT === false;

    if (!shouldSkipAutoStart) {
        autoStart();
    }
}
