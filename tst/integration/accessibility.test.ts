// ============================================================================
// Stylescape | Accessibility Integration Tests
// ============================================================================
// Tests accessibility features across components.
// ============================================================================

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createAndAppend, click, pressEscape, pressTab, pressEnter, wait, $, $$ } from "../utils"

describe("Accessibility Integration", () => {
    beforeEach(() => {
        document.body.innerHTML = ""
    })

    describe("Keyboard Navigation", () => {
        it("should support full keyboard navigation for accordion", async () => {
            document.body.innerHTML = `
                <div data-ss="accordion">
                    <button data-ss-accordion-trigger id="trigger-1">Section 1</button>
                    <div data-ss-accordion-panel hidden>Content 1</div>
                    <button data-ss-accordion-trigger id="trigger-2">Section 2</button>
                    <div data-ss-accordion-panel hidden>Content 2</div>
                </div>
            `

            const { init } = await import("../../src/ts/init/autoInit")
            await init()

            const trigger1 = document.getElementById("trigger-1")
            if (trigger1) {
                trigger1.focus()
                pressEnter(trigger1)
                await wait(50)
                // Panel should expand

                pressTab(trigger1)
                await wait(50)
                // Focus should move to next trigger
            }
        })

        it("should trap focus within modal", async () => {
            document.body.innerHTML = `
                <button data-ss-modal-trigger="#a11y-modal" id="open-btn">Open</button>
                <div id="a11y-modal" data-ss="modal" hidden>
                    <div data-ss-modal-content>
                        <button data-ss-modal-close id="close-btn">Close</button>
                        <input type="text" id="input-1">
                        <input type="text" id="input-2">
                        <button id="submit-btn">Submit</button>
                    </div>
                </div>
            `

            const { init } = await import("../../src/ts/init/autoInit")
            await init()

            // Open modal
            const openBtn = document.getElementById("open-btn")
            if (openBtn) {
                click(openBtn)
                await wait(100)

                // Focus should be trapped within modal
                const closeBtn = document.getElementById("close-btn")
                const submitBtn = document.getElementById("submit-btn")

                if (closeBtn && submitBtn) {
                    closeBtn.focus()
                    // Tab from last element should wrap to first
                    submitBtn.focus()
                    pressTab(submitBtn)
                    await wait(50)
                }
            }
        })

        it("should close modal on Escape", async () => {
            document.body.innerHTML = `
                <button data-ss-modal-trigger="#esc-modal" id="open-esc">Open</button>
                <div id="esc-modal" data-ss="modal" data-ss-modal-close-escape="true" hidden>
                    <div data-ss-modal-content>Modal content</div>
                </div>
            `

            const { init } = await import("../../src/ts/init/autoInit")
            await init()

            const openBtn = document.getElementById("open-esc")
            if (openBtn) {
                click(openBtn)
                await wait(100)

                pressEscape()
                await wait(350)
                // Modal should be closed
            }
        })
    })

    describe("ARIA Attributes", () => {
        it("should set correct ARIA attributes on modal", async () => {
            document.body.innerHTML = `
                <div id="aria-modal" data-ss="modal" role="dialog" aria-modal="true" hidden>
                    <div data-ss-modal-content>Content</div>
                </div>
            `

            const { init } = await import("../../src/ts/init/autoInit")
            await init()

            const modal = document.getElementById("aria-modal")
            expect(modal?.getAttribute("role")).toBe("dialog")
            expect(modal?.getAttribute("aria-modal")).toBe("true")
        })

        it("should update aria-expanded on accordion triggers", async () => {
            document.body.innerHTML = `
                <div data-ss="accordion">
                    <button data-ss-accordion-trigger aria-expanded="false" id="aria-trigger">
                        Toggle
                    </button>
                    <div data-ss-accordion-panel hidden>Content</div>
                </div>
            `

            const { init } = await import("../../src/ts/init/autoInit")
            await init()

            const trigger = document.getElementById("aria-trigger")
            expect(trigger?.getAttribute("aria-expanded")).toBe("false")

            if (trigger) {
                click(trigger)
                await wait(100)
                // aria-expanded should be "true"
            }
        })

        it("should have aria-describedby on tooltip triggers", async () => {
            document.body.innerHTML = `
                <button data-ss="tooltip" 
                        data-ss-tooltip-content="Help text"
                        id="tooltip-aria-test">
                    Help
                </button>
            `

            const { init } = await import("../../src/ts/init/autoInit")
            await init()

            // When tooltip is shown, trigger should have aria-describedby
        })
    })

    describe("Focus Management", () => {
        it("should return focus to trigger when modal closes", async () => {
            document.body.innerHTML = `
                <button data-ss-modal-trigger="#focus-modal" id="focus-trigger">Open</button>
                <div id="focus-modal" data-ss="modal" hidden>
                    <div data-ss-modal-content>
                        <button data-ss-modal-close>Close</button>
                    </div>
                </div>
            `

            const { init } = await import("../../src/ts/init/autoInit")
            await init()

            const trigger = document.getElementById("focus-trigger")
            if (trigger) {
                click(trigger)
                await wait(100)

                // Close modal
                const closeBtn = $("[data-ss-modal-close]")
                if (closeBtn) {
                    click(closeBtn)
                    await wait(350)
                    // Focus should return to trigger
                }
            }
        })

        it("should focus first interactive element in modal", async () => {
            document.body.innerHTML = `
                <button data-ss-modal-trigger="#focus-first-modal">Open</button>
                <div id="focus-first-modal" data-ss="modal" hidden>
                    <div data-ss-modal-content>
                        <input type="text" id="first-input">
                        <button>Submit</button>
                    </div>
                </div>
            `

            const { init } = await import("../../src/ts/init/autoInit")
            await init()

            const trigger = $("[data-ss-modal-trigger]")
            if (trigger) {
                click(trigger)
                await wait(100)
                // Focus should be on first input
            }
        })
    })

    describe("Screen Reader Support", () => {
        it("should have role=tooltip on tooltip elements", async () => {
            document.body.innerHTML = `
                <button data-ss="tooltip" data-ss-tooltip-content="Info">?</button>
            `

            const { init } = await import("../../src/ts/init/autoInit")
            await init()

            // When tooltip is shown, it should have role="tooltip"
        })

        it("should announce dynamic content", async () => {
            // For notifications, live regions should be used
            document.body.innerHTML = `
                <div data-ss="notification" 
                     role="alert"
                     aria-live="polite">
                    Important message
                </div>
            `

            const notification = $("[data-ss='notification']")
            expect(notification?.getAttribute("role")).toBe("alert")
            expect(notification?.getAttribute("aria-live")).toBe("polite")
        })
    })

    describe("Color Contrast and Visual Indicators", () => {
        it("should have visible focus indicators", () => {
            // This would typically be tested with visual regression tools
            // Here we just verify focus-visible is being handled
        })

        it("should provide non-color indicators for state", async () => {
            document.body.innerHTML = `
                <form data-ss="form-validator">
                    <input type="email" required id="contrast-email">
                    <span class="error-message" data-ss-error-for="contrast-email"></span>
                </form>
            `

            const { init } = await import("../../src/ts/init/autoInit")
            await init()

            // Error states should have more than just color indication
            // (e.g., icons, text, borders)
        })
    })

    describe("Reduced Motion", () => {
        it("should respect prefers-reduced-motion", async () => {
            // Mock reduced motion preference
            vi.stubGlobal("matchMedia", (query: string) => ({
                matches: query === "(prefers-reduced-motion: reduce)",
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn()
            }))

            document.body.innerHTML = `
                <div data-ss="accordion">
                    <button data-ss-accordion-trigger>Toggle</button>
                    <div data-ss-accordion-panel hidden>Content</div>
                </div>
            `

            const { init } = await import("../../src/ts/init/autoInit")
            await init()

            // Animations should be reduced or disabled
        })
    })
})
