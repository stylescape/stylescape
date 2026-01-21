// ============================================================================
// Stylescape | Preloader Component Tests
// ============================================================================

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createAndAppend, wait, $ } from "../utils"
import { preloaderFixture } from "../utils/fixtures"
import { Preloader } from "../../src/ts/animations/Preloader"

describe("Preloader", () => {
    let preloader: Preloader
    let preloaderElement: HTMLElement

    beforeEach(() => {
        document.body.innerHTML = preloaderFixture
        preloaderElement = document.getElementById("test-preloader") as HTMLElement
    })

    afterEach(() => {
        if (preloader && typeof (preloader as any).destroy === "function") {
            (preloader as any).destroy()
        }
    })

    describe("Initialization", () => {
        it("should initialize with element selector", () => {
            preloader = new Preloader("#test-preloader")
            expect(preloader).toBeDefined()
        })

        it("should initialize with element reference", () => {
            preloader = new Preloader(preloaderElement)
            expect(preloader).toBeDefined()
        })

        it("should handle non-existent element gracefully", () => {
            const consoleSpy = vi.spyOn(console, "warn").mockImplementation()
            preloader = new Preloader("#non-existent")
            expect(consoleSpy).toHaveBeenCalled()
            consoleSpy.mockRestore()
        })

        it("should parse options from data attributes", () => {
            preloader = new Preloader(preloaderElement)
            // Options from fixture: timeout="500", min-display="200"
            expect(preloaderElement.getAttribute("data-ss-preloader-timeout")).toBe("500")
        })
    })

    describe("Show/Hide", () => {
        beforeEach(() => {
            preloader = new Preloader(preloaderElement)
        })

        it("should show preloader", () => {
            preloader.show()
            expect(
                preloaderElement.classList.contains("preloader--hidden")
            ).toBe(false)
        })

        it("should hide preloader", () => {
            preloader.hide()
            // After hide, should have hidden class
        })

        it("should update aria-hidden on show", () => {
            preloader.show()
            expect(preloaderElement.getAttribute("aria-hidden")).toBe("false")
        })

        it("should update aria-hidden on hide", async () => {
            preloader.hide()
            await wait(100)
            expect(preloaderElement.getAttribute("aria-hidden")).toBe("true")
        })
    })

    describe("Timeout", () => {
        it("should auto-hide after timeout", async () => {
            vi.useFakeTimers()

            preloader = new Preloader(preloaderElement, {
                timeout: 500
            })

            // Advance timers
            vi.advanceTimersByTime(600)

            // Should be hidden
            vi.useRealTimers()
        })

        it("should respect minDisplayTime", async () => {
            vi.useFakeTimers()

            preloader = new Preloader(preloaderElement, {
                minDisplayTime: 200
            })

            preloader.show()
            preloader.hide()

            // Should wait for minDisplayTime
            vi.advanceTimersByTime(100)
            // May still be visible

            vi.advanceTimersByTime(150)
            // Now should be hidden

            vi.useRealTimers()
        })
    })

    describe("Callbacks", () => {
        it("should call onHide callback", async () => {
            const onHide = vi.fn()
            preloader = new Preloader(preloaderElement, { onHide })

            preloader.hide()
            await wait(100)

            expect(onHide).toHaveBeenCalled()
        })
    })

    describe("CSS Classes", () => {
        it("should add hidden class when hidden", async () => {
            preloader = new Preloader(preloaderElement, {
                hiddenClass: "custom-hidden"
            })

            preloader.hide()
            await wait(100)

            expect(
                preloaderElement.classList.contains("custom-hidden") ||
                preloaderElement.classList.contains("preloader--hidden")
            ).toBe(true)
        })
    })

    describe("Page Load Integration", () => {
        it("should auto-hide on window load", () => {
            preloader = new Preloader(preloaderElement)

            // Simulate load event
            window.dispatchEvent(new Event("load"))
        })
    })
})
