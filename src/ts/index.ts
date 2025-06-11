import { AsideHandler } from "./elements/AsideHandler.js"
import { CollapsibleTableHandler } from "./elements/CollapsibleTableHandler.js"
import { DropdownHandler } from "./elements/DropdownHandler.js"
import { ExclusiveDetails } from "./elements/ExclusiveDetails.js"
import { ImageCompareSlider } from "./media/ImageCompareSlider.js"

import { ActiveLinkHighlighter } from "./content/ActiveLinkHighlighter.js"
import { ClipboardHelper } from "./utilities/ClipboardHelper.js"
import { GridManager } from "./utilities/GridManager.js"
import { ThemeToggler } from "./utilities/ThemeToggler.js"

import { TableOfContentsBuilder } from "./content/TableOfContentsBuilder.js"
import { PasswordToggleManager } from "./elements/PasswordToggleManager.js"
import { ScrollElementManager } from "./scroll/ScrollElementManager.js"
import { ScrollPageManager } from "./scroll/ScrollPageManager.js"
;(window as any).ClipboardHelper = ClipboardHelper

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    console.log("Document ready, initializing components...")
    new GridManager() // Auto-initializes on construction

    // Scroll Restoration
    new ScrollPageManager()
    new ScrollElementManager("#main_content", "main_content_scroll", false)
    new ScrollElementManager(
        "#sidebar_left_content",
        "sidebar_left_content_scroll",
        false,
    )

    // new ActiveLinkHighlighter("nav a") // or any specific selector
    new ActiveLinkHighlighter() // default uses 'active' class

    new PasswordToggleManager()

    // Theme Toggle
    ThemeToggler.initializeToggleSwitch("themeToggle")

    // TableOfContentsBuilder
    const tocBuilder = new TableOfContentsBuilder("main_content", "toc")
    tocBuilder.buildAndAppendTOC()

    // Exclusive Details Handling
    new ExclusiveDetails(".ribbon_menu_button")

    // Grid Manager
    // new GridManager() // Auto-initializes on construction

    // Highlight Active Navigation Link
    const current = location.pathname.split("/").pop()
    const activeLink = document.querySelector(`a[href$="${current}"]`)
    if (activeLink) {
        activeLink.classList.add("active")
    }

    // Aside Menu Toggle Handlers
    const handlers: AsideHandler[] = []
    document.querySelectorAll("[id$='_switch']").forEach((switchEl) => {
        const switchId = switchEl.id
        const menuId = switchId.replace("_switch", "_menu")
        const menuEl = document.getElementById(menuId)
        if (menuEl) {
            handlers.push(new AsideHandler(menuId, switchId))
        }
    })
    ;(window as any).asideHandlers = handlers

    // Image Compare Sliders
    ImageCompareSlider.initAll()

    //  Custom Select Dropdown Handler
    new DropdownHandler()

    //  Collapsing Table
    new CollapsibleTableHandler()
})

// import { ExclusiveDetails } from "./elements/ExclusiveDetails.js"

// import { AsideHandler } from "./elements/AsideHandler.js"
// import { ClipboardHelper } from "./utilities/ClipboardHelper.js"
// import { GridManager } from "./utilities/GridManager.js"
// import { ThemeToggler } from "./utilities/ThemeToggler.js"
// ;(window as any).ClipboardHelper = ClipboardHelper

// import { ImageCompareSlider } from "./elements/ImageCompareSlider.js"
// import { ScrollPageManager } from "./mouse/ScrollPageManager.js"

// document.addEventListener("DOMContentLoaded", () => {
//     new ScrollPageManager()
// })

// document.addEventListener("DOMContentLoaded", () => {
//     // ThemeToggles
//     // ----
//     ThemeToggler.initializeToggleSwitch("themeToggle")

//     const exclusiveDetails = new ExclusiveDetails(".ribbon_menu_button")
// })

// new GridManager() // auto-initializes

// document.addEventListener("DOMContentLoaded", () => {
//     // Example: highlight current test page in nav
//     const current = location.pathname.split("/").pop()
//     const activeLink = document.querySelector(`a[href$="${current}"]`)
//     if (activeLink) {
//         activeLink.classList.add("active")
//     }

//     // Additional test tools or instrumentation could be bootstrapped here
// })

// // Initialize after DOM is ready
// document.addEventListener("DOMContentLoaded", () => {
//     // new FontPreview("#preview__font--input", ".preview__font--output")
// })

// // document.addEventListener("DOMContentLoaded", () => {
// //     const toc = new TableOfContentsBuilder("main_content", "toc-container")
// //     toc.buildAndAppendTOC()
// // })

// // AsideHandler
// // ============================================================================

// document.addEventListener("DOMContentLoaded", () => {
//     const handlers: AsideHandler[] = []

//     // Auto-detect switch elements by class name or data attribute
//     document.querySelectorAll("[id$='_switch']").forEach((switchEl) => {
//         const switchId = switchEl.id
//         const menuId = switchId.replace("_switch", "_menu")
//         const menuEl = document.getElementById(menuId)

//         if (menuEl) {
//             handlers.push(new AsideHandler(menuId, switchId))
//         }
//     })

//     // Optional: expose for debugging
//     ;(window as any).asideHandlers = handlers
// })

// // Image Compare Slider Handler
// // ============================================================================

// window.addEventListener("DOMContentLoaded", () => {
//     ImageCompareSlider.initAll() // Auto-detects all `.image__compare` elements
// })
