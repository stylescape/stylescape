// 1. ELEMENT HANDLERS
export { AsideHandler } from "./elements/AsideHandler.js"
export { CollapsibleTableHandler } from "./elements/CollapsibleTableHandler.js"
export { DetailManager } from "./elements/DetailManager.js"
export { DropdownHandler } from "./elements/DropdownHandler.js"
export { ExclusiveDetails } from "./elements/ExclusiveDetails.js"
export { PasswordToggleManager } from "./elements/PasswordToggleManager.js"

// 2. MEDIA
export { ImageCompareSlider } from "./media/ImageCompareSlider.js"

// 3. CONTENT & UTILITIES
export { ActiveLinkHighlighter } from "./content/ActiveLinkHighlighter.js"
export { TableOfContentsBuilder } from "./content/TableOfContentsBuilder.js"
export { ClipboardHelper } from "./utilities/ClipboardHelper.js"
export { GridManager } from "./utilities/GridManager.js"
export { ThemeToggler } from "./utilities/ThemeToggler.js"

// 4. SCROLL
export { ScrollElementManager } from "./scroll/ScrollElementManager.js"
export { ScrollPageManager } from "./scroll/ScrollPageManager.js"

// 5. Main initializer
export * from "./init/index.js"
export { initializeStylescape } from "./init/index.js"

// initializeStylescape()

// import { AsideHandler } from "./elements/AsideHandler.js";
// import { CollapsibleTableHandler } from "./elements/CollapsibleTableHandler.js"
// import { DropdownHandler } from "./elements/DropdownHandler.js"
// import { ExclusiveDetails } from "./elements/ExclusiveDetails.js"
// import { ImageCompareSlider } from "./media/ImageCompareSlider.js"

// import { ActiveLinkHighlighter } from "./content/ActiveLinkHighlighter.js"
// import { ClipboardHelper } from "./utilities/ClipboardHelper.js"
// import { GridManager } from "./utilities/GridManager.js"
// import { ThemeToggler } from "./utilities/ThemeToggler.js"

// import { TableOfContentsBuilder } from "./content/TableOfContentsBuilder.js"
// import { PasswordToggleManager } from "./elements/PasswordToggleManager.js"
// import { ScrollElementManager } from "./scroll/ScrollElementManager.js"
// import { ScrollPageManager } from "./scroll/ScrollPageManager.js"
// ;(window as any).ClipboardHelper = ClipboardHelper

// // Initialize on DOM ready
// document.addEventListener("DOMContentLoaded", () => {
//     // console.log("Document ready, initializing components...")

//     // Scroll Restoration
//     new ScrollPageManager()
//     new ScrollElementManager("#main_content", "main_content_scroll", false)
//     new ScrollElementManager(
//         "#sidebar_left_content",
//         "sidebar_left_content_scroll",
//         false,
//     )

//     // new ActiveLinkHighlighter("nav a") // or any specific selector
//     new ActiveLinkHighlighter() // default uses 'active' class

//     new PasswordToggleManager()

//     // Theme Toggle
//     // ThemeToggler.initializeToggleSwitch("themeToggle")
//     ThemeToggler.registerOnLoad("themeToggle")

//     // TableOfContentsBuilder
//     const tocBuilder = new TableOfContentsBuilder("main_content", "toc")
//     tocBuilder.buildAndAppendTOC()

//     // Exclusive Details Handling
//     new ExclusiveDetails(".ribbon_menu_button")

//     // Grid Manager
//     // new GridManager() // Auto-initializes on construction

//     // Highlight Active Navigation Link
//     const current = location.pathname.split("/").pop()
//     const activeLink = document.querySelector(`a[href$="${current}"]`)
//     if (activeLink) {
//         activeLink.classList.add("active")
//     }

//     // Aside Menu Toggle Handlers
//     const handlers: AsideHandler[] = []
//     document.querySelectorAll("[id$='_switch']").forEach((switchEl) => {
//         const switchId = switchEl.id
//         const menuId = switchId.replace("_switch", "_menu")
//         const menuEl = document.getElementById(menuId)
//         if (menuEl) {
//             handlers.push(new AsideHandler(menuId, switchId))
//         }
//     })
//     ;(window as any).asideHandlers = handlers

//     // Image Compare Sliders
//     ImageCompareSlider.initAll()

//     //  Custom Select Dropdown Handler
//     new DropdownHandler()

//     //  Collapsing Table
//     new CollapsibleTableHandler()
// })

// // window.addEventListener("load", () => {
// //     new GridManager() // Auto-initializes on construction
// // })

// window.addEventListener("load", () => {
//     requestAnimationFrame(() => {
//         new GridManager()
//     })
// })
