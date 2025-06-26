import {
    ActiveLinkHighlighter,
    AsideHandler,
    ClipboardHelper,
    CollapsibleTableHandler,
    DropdownHandler,
    ExclusiveDetails,
    GridManager,
    ImageCompareSlider,
    PasswordToggleManager,
    ScrollElementManager,
    ScrollPageManager,
    TableOfContentsBuilder,
    ThemeToggler,
} from "../index.js"

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
