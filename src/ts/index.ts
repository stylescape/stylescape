import { ExclusiveDetails } from "./elements/ExclusiveDetails.js"

import { AsideHandler } from "./elements/AsideHandler.js"
import { ClipboardHelper } from "./utilities/ClipboardHelper.js"
import { GridManager } from "./utilities/GridManager.js"
import { ThemeToggler } from "./utilities/ThemeToggler.js"
;(window as any).ClipboardHelper = ClipboardHelper

import { ImageCompareSlider } from "./elements/ImageCompareSlider.js"

document.addEventListener("DOMContentLoaded", () => {
    // ThemeToggles
    // ----
    ThemeToggler.initializeToggleSwitch("themeToggle")

    const exclusiveDetails = new ExclusiveDetails(".ribbon_menu_button")
})

new GridManager() // auto-initializes

document.addEventListener("DOMContentLoaded", () => {
    // Example: highlight current test page in nav
    const current = location.pathname.split("/").pop()
    const activeLink = document.querySelector(`a[href$="${current}"]`)
    if (activeLink) {
        activeLink.classList.add("active")
    }

    // Additional test tools or instrumentation could be bootstrapped here
})

// Initialize after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    // new FontPreview("#preview__font--input", ".preview__font--output")
})

// document.addEventListener("DOMContentLoaded", () => {
//     const toc = new TableOfContentsBuilder("main_content", "toc-container")
//     toc.buildAndAppendTOC()
// })

// AsideHandler
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
    const handlers: AsideHandler[] = []

    // Auto-detect switch elements by class name or data attribute
    document.querySelectorAll("[id$='_switch']").forEach((switchEl) => {
        const switchId = switchEl.id
        const menuId = switchId.replace("_switch", "_menu")
        const menuEl = document.getElementById(menuId)

        if (menuEl) {
            handlers.push(new AsideHandler(menuId, switchId))
        }
    })

    // Optional: expose for debugging
    ;(window as any).asideHandlers = handlers
})

// Image Compare Slider Handler
// ============================================================================

window.addEventListener("DOMContentLoaded", () => {
    ImageCompareSlider.initAll() // Auto-detects all `.image__compare` elements
})
