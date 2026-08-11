// ============================================================================
// Stylescape | Main Entry Point
// ============================================================================
// Central export file for all Stylescape TypeScript modules.
// ============================================================================

// 1. ELEMENT HANDLERS
export { AsideHandler } from "./elements/AsideHandler.js";
export { CollapsibleTableHandler } from "./elements/CollapsibleTableHandler.js";
export { DetailManager } from "./elements/DetailManager.js";
export { DropdownHandler } from "./elements/DropdownHandler.js";
export { ExclusiveDetails } from "./elements/ExclusiveDetails.js";
export { PasswordToggleManager } from "./elements/PasswordToggleManager.js";

// 2. MEDIA
export { ImageCompareSlider } from "./media/ImageCompareSlider.js";

// 3. CONTENT & UTILITIES
export { ActiveLinkHighlighter } from "./content/ActiveLinkHighlighter.js";
export { CodeBlockFormatter } from "./content/CodeBlockFormatter.js";
export { Countdown } from "./content/Countdown.js";
export { TableOfContentsBuilder } from "./content/TableOfContentsBuilder.js";
export { ClipboardHelper } from "./utilities/ClipboardHelper.js";
export { GridManager } from "./utilities/GridManager.js";
export { ThemeToggler } from "./utilities/ThemeToggler.js";

// 4. SCROLL
export { ScrollElementManager } from "./scroll/ScrollElementManager.js";
export { ScrollPageManager } from "./scroll/ScrollPageManager.js";

// 5. STORAGE
export { AccordionState } from "./storage/AccordionState.js";

// 6. AUTO-INIT SYSTEM
export {
    autoStart,
    // Registry
    componentRegistry,
    destroy,
    getAllInstances,
    getComponent,
    getComponentNames,
    getInstance,
    hasComponent,
    // Core functions
    init,
    // Legacy
    initializeStylescape,
    observe,
    registerComponent,
    reinit,
    setAttributePrefix,
    // Configuration
    setAutoInit,
    setDebug,
    setObserver,
    stopObserving,
    // Types
    type ComponentConfig,
    type ComponentHandler,
    type RegistryEntry,
    type StylescapeGlobal,
} from "./init/index.js";
