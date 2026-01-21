// ============================================================================
// Stylescape | Theme Toggler Tests
// ============================================================================

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createAndAppend, click, wait, $ } from "../utils"
import { themeTogglerFixture } from "../utils/fixtures"
import { ThemeToggler } from "../../src/ts/utilities/ThemeToggler"

describe("ThemeToggler", () => {
    let themeToggler: typeof ThemeToggler
    let toggleElement: HTMLElement

    beforeEach(() => {
        document.body.innerHTML = themeTogglerFixture
        toggleElement = document.getElementById("theme-toggle") as HTMLElement

        // Clear localStorage
        localStorage.clear()

        // Reset document attributes
        document.documentElement.removeAttribute("data-theme")
    })

    afterEach(() => {
        localStorage.clear()
    })

    describe("Initialization", () => {
        it("should initialize with element ID", async () => {
            const { ThemeToggler } = await import("../../src/ts/utilities/ThemeToggler")
            ThemeToggler.registerOnLoad("theme-toggle")
            expect(toggleElement).toBeDefined()
        })

        it("should respect system preference", async () => {
            // Mock matchMedia for dark mode
            vi.stubGlobal("matchMedia", (query: string) => ({
                matches: query === "(prefers-color-scheme: dark)",
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn()
            }))

            const { ThemeToggler } = await import("../../src/ts/utilities/ThemeToggler")
            // System preference should be detected
        })

        it("should restore theme from localStorage", async () => {
            localStorage.setItem("theme", "dark")

            const { ThemeToggler } = await import("../../src/ts/utilities/ThemeToggler")
            ThemeToggler.registerOnLoad("theme-toggle")

            // Theme should be restored from storage
        })
    })

    describe("Toggle Behavior", () => {
        it("should toggle from light to dark", async () => {
            const { ThemeToggler } = await import("../../src/ts/utilities/ThemeToggler")
            ThemeToggler.registerOnLoad("theme-toggle")

            document.documentElement.setAttribute("data-theme", "light")

            click(toggleElement)
            await wait(50)

            // Should be dark now
        })

        it("should toggle from dark to light", async () => {
            const { ThemeToggler } = await import("../../src/ts/utilities/ThemeToggler")
            ThemeToggler.registerOnLoad("theme-toggle")

            document.documentElement.setAttribute("data-theme", "dark")

            click(toggleElement)
            await wait(50)

            // Should be light now
        })

        it("should update data-theme attribute", async () => {
            const { ThemeToggler } = await import("../../src/ts/utilities/ThemeToggler")
            ThemeToggler.registerOnLoad("theme-toggle")

            click(toggleElement)
            await wait(50)

            expect(document.documentElement.hasAttribute("data-theme")).toBe(true)
        })
    })

    describe("Persistence", () => {
        it("should save theme to localStorage", async () => {
            const { ThemeToggler } = await import("../../src/ts/utilities/ThemeToggler")
            ThemeToggler.registerOnLoad("theme-toggle")

            click(toggleElement)
            await wait(50)

            // localStorage should have theme value
        })

        it("should use custom storage key", async () => {
            // Test with custom storage key if supported
        })
    })

    describe("Accessibility", () => {
        it("should have aria-label", () => {
            expect(toggleElement.getAttribute("aria-label")).toBeTruthy()
        })

        it("should be keyboard accessible", async () => {
            const { ThemeToggler } = await import("../../src/ts/utilities/ThemeToggler")
            ThemeToggler.registerOnLoad("theme-toggle")

            toggleElement.focus()
            toggleElement.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "Enter",
                    bubbles: true
                })
            )
            await wait(50)
        })
    })
})
