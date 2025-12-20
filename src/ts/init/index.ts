import { ActiveLinkHighlighter } from "../content/ActiveLinkHighlighter.js"
import { TableOfContentsBuilder } from "../content/TableOfContentsBuilder.js"
import { AsideHandler } from "../elements/AsideHandler.js"
import { CollapsibleTableHandler } from "../elements/CollapsibleTableHandler.js"
import { DetailManager } from "../elements/DetailManager.js"
import { DropdownHandler } from "../elements/DropdownHandler.js"
import { ExclusiveDetails } from "../elements/ExclusiveDetails.js"
import { PasswordToggleManager } from "../elements/PasswordToggleManager.js"
import { ImageCompareSlider } from "../media/ImageCompareSlider.js"
import { ScrollElementManager } from "../scroll/ScrollElementManager.js"
import { ScrollPageManager } from "../scroll/ScrollPageManager.js"
import { ClipboardHelper } from "../utilities/ClipboardHelper.js"
import { GridManager } from "../utilities/GridManager.js"
import { ThemeToggler } from "../utilities/ThemeToggler.js"

export function initializeStylescape(): void {
    // Expose helper(s) globally if needed
    ;(window as any).ClipboardHelper = ClipboardHelper

    document.addEventListener("DOMContentLoaded", () => {
        new ScrollPageManager()
        new ScrollElementManager("#main_content", "main_content_scroll", false)
        new ScrollElementManager(
            "#sidebar_left_content",
            "sidebar_left_content_scroll",
            false,
        )

        new ActiveLinkHighlighter()
        new PasswordToggleManager()
        ThemeToggler.registerOnLoad("themeToggle")

        const tocBuilder = new TableOfContentsBuilder("main_content", "toc")
        tocBuilder.buildAndAppendTOC()

        new ExclusiveDetails(".ribbon_menu_button")

        new DetailManager()

        const current = location.pathname.split("/").pop()
        const activeLink = document.querySelector(`a[href$="${current}"]`)
        if (activeLink) {
            activeLink.classList.add("active")
        }

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

        ImageCompareSlider.initAll()
        new DropdownHandler()
        new CollapsibleTableHandler()
    })

    window.addEventListener("load", () => {
        requestAnimationFrame(() => {
            new GridManager()
        })
    })
}
