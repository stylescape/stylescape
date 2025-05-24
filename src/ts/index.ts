import { ExclusiveDetails } from './elements/ExclusiveDetails.js'

import { AsideHandler } from './elements/AsideHandler.js'
import { ClipboardHelper } from './utilities/ClipboardHelper.js'
import { FontPreview } from './utilities/FontPreview.js'
import { GridManager } from './utilities/GridManager.js'
import { ThemeToggler } from './utilities/ThemeToggler.js'
;(window as any).ClipboardHelper = ClipboardHelper

document.addEventListener('DOMContentLoaded', () => {
    const exclusiveDetails = new ExclusiveDetails('.ribbon_menu_button')
    const ccc = new AsideHandler()
    ThemeToggler.initializeToggleSwitch('themeToggle')
})

new GridManager() // auto-initializes

document.addEventListener('DOMContentLoaded', () => {
    console.log('[unit.gl] Test site initialized')

    // Example: highlight current test page in nav
    const current = location.pathname.split('/').pop()
    const activeLink = document.querySelector(`a[href$="${current}"]`)
    if (activeLink) {
        activeLink.classList.add('active')
    }

    // Additional test tools or instrumentation could be bootstrapped here
})

// Initialize after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FontPreview('#font-preview-input', '.preview_box__live, .preview-live p')
})
