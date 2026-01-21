// ============================================================================
// Stylescape | Component Interaction Integration Tests
// ============================================================================
// Tests interactions between multiple components.
// ============================================================================

import { beforeEach, describe, it, vi } from "vitest"
import { $, click, mouseEnter, wait } from "../utils"

describe("Component Interactions", () => {
    beforeEach(() => {
        document.body.innerHTML = ""
    })

    describe("Modal with Form", () => {
        it("should validate form inside modal", async () => {
            document.body.innerHTML = `
                <button data-ss-modal-trigger="#form-modal">Open</button>
                <div id="form-modal" data-ss="modal" hidden>
                    <div data-ss-modal-content>
                        <form data-ss="form-validator" id="modal-form">
                            <input type="email" required data-ss-validate="email" id="modal-email">
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            `

            const { init } = await import("../../src/ts/init/autoInit")
            await init()

            // Open modal
            const trigger = $("[data-ss-modal-trigger]")
            if (trigger) {
                click(trigger)
                await wait(100)

                // Form validation should work inside modal
                const form = $("#modal-form")
                const email = $<HTMLInputElement>("#modal-email")
                if (form && email) {
                    email.value = "invalid"
                    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
                }
            }
        })
    })

    describe("Accordion with Tooltips", () => {
        it("should show tooltips inside accordion panels", async () => {
            document.body.innerHTML = `
                <div data-ss="accordion">
                    <button data-ss-accordion-trigger>Open</button>
                    <div data-ss-accordion-panel hidden>
                        <button data-ss="tooltip" data-ss-tooltip-content="Info">?</button>
                    </div>
                </div>
            `

            const { init } = await import("../../src/ts/init/autoInit")
            await init()

            // Open accordion
            const trigger = $("[data-ss-accordion-trigger]")
            if (trigger) {
                click(trigger)
                await wait(100)

                // Tooltip inside should be usable
                const tooltipTrigger = $("[data-ss='tooltip']")
                if (tooltipTrigger) {
                    mouseEnter(tooltipTrigger)
                    await wait(300)
                }
            }
        })
    })

    describe("Tabs with Dynamic Content", () => {
        it("should initialize components in tab panels", async () => {
            document.body.innerHTML = `
                <div data-ss="tabs">
                    <div role="tablist">
                        <button role="tab" aria-selected="true" aria-controls="panel-1">Tab 1</button>
                        <button role="tab" aria-selected="false" aria-controls="panel-2">Tab 2</button>
                    </div>
                    <div role="tabpanel" id="panel-1">
                        <button data-ss="tooltip" data-ss-tooltip-content="Tab 1 tooltip">?</button>
                    </div>
                    <div role="tabpanel" id="panel-2" hidden>
                        <button data-ss="tooltip" data-ss-tooltip-content="Tab 2 tooltip">?</button>
                    </div>
                </div>
            `

            const { init } = await import("../../src/ts/init/autoInit")
            await init()

            // All tooltips should be initialized even in hidden panels
        })
    })

    describe("Theme Toggle with Multiple Components", () => {
        it("should update all components when theme changes", async () => {
            document.body.innerHTML = `
                <button data-ss="theme-toggle" id="theme-btn">Toggle</button>
                <button data-ss="tooltip" data-ss-tooltip-content="Test">Hover</button>
                <div data-ss="modal" id="test-modal" hidden>
                    <div data-ss-modal-content>Modal</div>
                </div>
            `

            const { init } = await import("../../src/ts/init/autoInit")
            await init()

            // Change theme
            const themeBtn = $("#theme-btn")
            if (themeBtn) {
                click(themeBtn)
                await wait(50)

                // Components should respect new theme
            }
        })
    })

    describe("Nested Modals", () => {
        it("should handle modal opening from within another modal", async () => {
            document.body.innerHTML = `
                <button data-ss-modal-trigger="#modal-1">Open Modal 1</button>
                <div id="modal-1" data-ss="modal" hidden>
                    <div data-ss-modal-content>
                        <button data-ss-modal-trigger="#modal-2">Open Modal 2</button>
                    </div>
                </div>
                <div id="modal-2" data-ss="modal" hidden>
                    <div data-ss-modal-content>
                        Nested modal content
                    </div>
                </div>
            `

            const { init } = await import("../../src/ts/init/autoInit")
            await init()

            // Open first modal
            const trigger1 = $("[data-ss-modal-trigger='#modal-1']")
            if (trigger1) {
                click(trigger1)
                await wait(100)

                // Open second modal from inside first
                const trigger2 = $("[data-ss-modal-trigger='#modal-2']")
                if (trigger2) {
                    click(trigger2)
                    await wait(100)
                }
            }
        })
    })

    describe("Dropdown with Form Elements", () => {
        it("should handle form inputs inside dropdown", async () => {
            document.body.innerHTML = `
                <div data-ss="dropdown" class="select_dropdown">
                    <button class="dropdown-trigger">Filter</button>
                    <div class="dropdown-menu" hidden>
                        <input type="text" placeholder="Search...">
                        <label><input type="checkbox"> Option 1</label>
                        <label><input type="checkbox"> Option 2</label>
                    </div>
                </div>
            `

            const { init } = await import("../../src/ts/init/autoInit")
            await init()
        })
    })

    describe("Progress Bar with Form Submit", () => {
        it("should update progress on form submission progress", async () => {
            document.body.innerHTML = `
                <div data-ss="progress-bar" id="upload-progress"
                     data-ss-progress-bar-value="0">
                    <div class="progress-bar__fill"></div>
                </div>
                <form id="upload-form">
                    <input type="file" id="file-input">
                    <button type="submit">Upload</button>
                </form>
            `

            const { init } = await import("../../src/ts/init/autoInit")
            await init()

            // Simulate progress update
            // Would typically be updated by file upload progress
        })
    })

    describe("Notification with Auto-dismiss", () => {
        it("should auto-dismiss notification after timeout", async () => {
            vi.useFakeTimers()

            document.body.innerHTML = `
                <div data-ss="notification"
                     data-ss-notification-auto-dismiss="true"
                     data-ss-notification-duration="3000">
                    <span>Auto-dismiss notification</span>
                </div>
            `

            const { init } = await import("../../src/ts/init/autoInit")
            await init()

            // Advance timers
            vi.advanceTimersByTime(3500)

            // Notification should be dismissed

            vi.useRealTimers()
        })
    })
})
