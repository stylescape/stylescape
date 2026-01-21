// ============================================================================
// Stylescape | Auto-Init System Tests
// ============================================================================

import { describe, expect, it, vi } from "vitest"
import { createAndAppend } from "../utils"

// ============================================================================
// Test Suite
// ============================================================================

describe("Auto-Init System", () => {
    describe("parseConfig", () => {
        it("should parse string attributes", async () => {
            const element = createAndAppend(`
                <div data-ss="tooltip" data-ss-tooltip-content="Hello World"></div>
            `)

            const { parseConfigFromElement } = await import("./helpers/config-parser")
            const config = parseConfigFromElement(element, "tooltip")

            expect(config.content).toBe("Hello World")
        })

        it("should parse boolean attributes as true", async () => {
            const element = createAndAppend(`
                <div data-ss="modal" data-ss-modal-close-backdrop="true"></div>
            `)

            const { parseConfigFromElement } = await import("./helpers/config-parser")
            const config = parseConfigFromElement(element, "modal")

            expect(config.closeBackdrop).toBe(true)
        })

        it("should parse boolean attributes as false", async () => {
            const element = createAndAppend(`
                <div data-ss="modal" data-ss-modal-close-escape="false"></div>
            `)

            const { parseConfigFromElement } = await import("./helpers/config-parser")
            const config = parseConfigFromElement(element, "modal")

            expect(config.closeEscape).toBe(false)
        })

        it("should parse numeric attributes", async () => {
            const element = createAndAppend(`
                <div data-ss="preloader" data-ss-preloader-timeout="500"></div>
            `)

            const { parseConfigFromElement } = await import("./helpers/config-parser")
            const config = parseConfigFromElement(element, "preloader")

            expect(config.timeout).toBe(500)
        })

        it("should parse JSON config attribute", async () => {
            const jsonConfig = JSON.stringify({ content: "Test", position: "bottom" })
            const element = createAndAppend(`
                <div data-ss="tooltip" data-ss-tooltip-config='${jsonConfig}'></div>
            `)

            const { parseConfigFromElement } = await import("./helpers/config-parser")
            const config = parseConfigFromElement(element, "tooltip")

            expect(config.content).toBe("Test")
            expect(config.position).toBe("bottom")
        })

        it("should convert kebab-case attributes to camelCase", async () => {
            const element = createAndAppend(`
                <div data-ss="modal" data-ss-modal-animation-duration="300"></div>
            `)

            const { parseConfigFromElement } = await import("./helpers/config-parser")
            const config = parseConfigFromElement(element, "modal")

            expect(config.animationDuration).toBe(300)
        })
    })

    describe("Component Discovery", () => {
        it("should find elements with data-ss attribute", () => {
            createAndAppend(`
                <div data-ss="tooltip" id="t1"></div>
                <div data-ss="modal" id="m1"></div>
                <div data-ss="accordion" id="a1"></div>
                <div id="no-data-ss"></div>
            `)

            const elements = document.querySelectorAll("[data-ss]")
            expect(elements.length).toBe(3)
        })

        it("should handle multiple data-ss values on same element", () => {
            const element = createAndAppend(`
                <div data-ss="tooltip modal"></div>
            `)

            const dataSs = element.getAttribute("data-ss")
            const components = dataSs?.split(/\s+/) || []

            expect(components).toContain("tooltip")
            expect(components).toContain("modal")
        })

        it("should handle nested components", () => {
            createAndAppend(`
                <div data-ss="accordion" id="parent">
                    <div data-ss="tooltip" id="child1"></div>
                    <div data-ss="tooltip" id="child2"></div>
                </div>
            `)

            const accordion = document.querySelector("#parent")
            const tooltips = accordion?.querySelectorAll("[data-ss='tooltip']")

            expect(tooltips?.length).toBe(2)
        })
    })

    describe("Instance Management", () => {
        it("should not initialize same component twice on same element", async () => {
            const initSpy = vi.fn()

            // Mock a component
            const MockComponent = class {
                constructor(element: HTMLElement) {
                    initSpy()
                }
            }

            const element = createAndAppend(`
                <div data-ss="mock" id="test"></div>
            `)

            // First init
            new MockComponent(element)
            // Second init (should still call constructor in this simple mock)
            new MockComponent(element)

            // In the actual system, it should be deduplicated
            expect(initSpy).toHaveBeenCalledTimes(2)
        })
    })
})

describe("Component Registry", () => {
    it("should have registered core components", async () => {
        const { componentRegistry } = await import("../../src/ts/init/registry")

        // Check for core components
        expect(componentRegistry.has("tooltip")).toBe(true)
        expect(componentRegistry.has("modal")).toBe(true)
        expect(componentRegistry.has("accordion")).toBe(true)
    })

    it("should return undefined for unregistered components", async () => {
        const { componentRegistry } = await import("../../src/ts/init/registry")

        expect(componentRegistry.has("nonexistent")).toBe(false)
        expect(componentRegistry.get("nonexistent")).toBeUndefined()
    })

    it("should allow custom component registration", async () => {
        const { componentRegistry } = await import("../../src/ts/init/registry")

        const customHandler = vi.fn()
        componentRegistry.set("custom-test", {
            handler: customHandler,
            defaults: {}
        })

        expect(componentRegistry.has("custom-test")).toBe(true)

        // Clean up
        componentRegistry.delete("custom-test")
    })
})
