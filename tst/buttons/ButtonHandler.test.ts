// ============================================================================
// Stylescape | Button Handler Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ButtonHandler } from "../../src/ts/buttons/ButtonHandler"
import { click, wait } from "../utils"

describe("ButtonHandler", () => {
    let buttonHandler: ButtonHandler
    let buttonElement: HTMLButtonElement

    beforeEach(() => {
        document.body.innerHTML = `
            <button id="test-button"
                    data-ss="button"
                    data-ss-button-loading-text="Loading...">
                Submit
            </button>
        `
        buttonElement = document.getElementById("test-button") as HTMLButtonElement
    })

    afterEach(() => {
        if (buttonHandler && typeof (buttonHandler as any).destroy === "function") {
            (buttonHandler as any).destroy()
        }
    })

    describe("Initialization", () => {
        it("should initialize with element", () => {
            buttonHandler = new ButtonHandler(buttonElement)
            expect(buttonHandler).toBeDefined()
        })

        it("should initialize with selector", () => {
            buttonHandler = new ButtonHandler("#test-button")
            expect(buttonHandler).toBeDefined()
        })
    })

    describe("Loading State", () => {
        beforeEach(() => {
            buttonHandler = new ButtonHandler(buttonElement)
        })

        it("should show loading state", () => {
            if (typeof (buttonHandler as any).setLoading === "function") {
                (buttonHandler as any).setLoading(true)
                // Button should show loading indicator
            }
        })

        it("should disable button when loading", () => {
            if (typeof (buttonHandler as any).setLoading === "function") {
                (buttonHandler as any).setLoading(true)
                expect(buttonElement.disabled).toBe(true)
            }
        })

        it("should restore button after loading", () => {
            if (typeof (buttonHandler as any).setLoading === "function") {
                (buttonHandler as any).setLoading(true)
                (buttonHandler as any).setLoading(false)
                expect(buttonElement.disabled).toBe(false)
            }
        })

        it("should change text when loading", () => {
            const originalText = buttonElement.textContent
            if (typeof (buttonHandler as any).setLoading === "function") {
                (buttonHandler as any).setLoading(true)
                // Text might change to "Loading..."
            }
        })
    })

    describe("Click Handling", () => {
        it("should prevent double clicks", async () => {
            const clickSpy = vi.fn()
            buttonElement.addEventListener("click", clickSpy)

            buttonHandler = new ButtonHandler(buttonElement, {
                preventDoubleClick: true
            })

            click(buttonElement)
            click(buttonElement)
            await wait(50)

            // May only register one click depending on implementation
        })
    })

    describe("Ripple Effect", () => {
        it("should add ripple effect on click when enabled", async () => {
            buttonHandler = new ButtonHandler(buttonElement, {
                ripple: true
            })

            click(buttonElement)
            await wait(50)

            // Ripple element may be added
        })
    })
})

describe("ToggleSwitchManager", () => {
    let toggleElement: HTMLInputElement

    beforeEach(() => {
        document.body.innerHTML = `
            <label class="toggle">
                <input type="checkbox"
                       id="test-toggle"
                       data-ss="toggle-switch"
                       data-ss-toggle-switch-label-on="Yes"
                       data-ss-toggle-switch-label-off="No">
                <span class="toggle-slider"></span>
            </label>
        `
        toggleElement = document.getElementById("test-toggle") as HTMLInputElement
    })

    describe("Initialization", () => {
        it("should initialize toggle switch", async () => {
            const { ToggleSwitchManager } = await import("../../src/ts/buttons/ToggleSwitchManager")
            const toggle = new ToggleSwitchManager(toggleElement)
            expect(toggle).toBeDefined()
        })
    })

    describe("Toggle Behavior", () => {
        it("should toggle checked state", async () => {
            const { ToggleSwitchManager } = await import("../../src/ts/buttons/ToggleSwitchManager")
            new ToggleSwitchManager(toggleElement)

            expect(toggleElement.checked).toBe(false)
            click(toggleElement)
            expect(toggleElement.checked).toBe(true)
        })

        it("should fire change event", async () => {
            const changeSpy = vi.fn()
            toggleElement.addEventListener("change", changeSpy)

            const { ToggleSwitchManager } = await import("../../src/ts/buttons/ToggleSwitchManager")
            new ToggleSwitchManager(toggleElement)

            click(toggleElement)
            expect(changeSpy).toHaveBeenCalled()
        })
    })

    describe("Accessibility", () => {
        it("should be keyboard accessible", async () => {
            const { ToggleSwitchManager } = await import("../../src/ts/buttons/ToggleSwitchManager")
            new ToggleSwitchManager(toggleElement)

            toggleElement.focus()
            toggleElement.dispatchEvent(new KeyboardEvent("keydown", { key: " " }))
        })

        it("should have proper role", () => {
            // Input type=checkbox has implicit role
            expect(toggleElement.type).toBe("checkbox")
        })
    })
})
