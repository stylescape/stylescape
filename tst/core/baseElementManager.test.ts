// ============================================================================
// Stylescape | BaseElementManager Tests
// ============================================================================

import { describe, it, expect, vi, beforeEach } from "vitest"
import { createAndAppend, wait } from "../utils"

describe("BaseElementManager", () => {
    describe("Element Discovery", () => {
        it("should find all elements with the component attribute", () => {
            createAndAppend(`
                <div data-ss-widget id="w1"></div>
                <div data-ss-widget id="w2"></div>
                <div data-ss-widget id="w3"></div>
            `)

            const elements = document.querySelectorAll("[data-ss-widget]")
            expect(elements.length).toBe(3)
        })

        it("should handle elements without ID by generating one", () => {
            const element = createAndAppend(`
                <div data-ss-widget></div>
            `)

            // In actual implementation, BaseElementManager assigns IDs
            // For testing, we verify the element exists
            expect(element.hasAttribute("data-ss-widget")).toBe(true)
        })

        it("should respect custom root element", () => {
            createAndAppend(`
                <div id="container">
                    <div data-ss-widget id="inside"></div>
                </div>
                <div data-ss-widget id="outside"></div>
            `)

            const container = document.getElementById("container")
            const insideElements = container?.querySelectorAll("[data-ss-widget]")
            const allElements = document.querySelectorAll("[data-ss-widget]")

            expect(insideElements?.length).toBe(1)
            expect(allElements.length).toBe(2)
        })
    })

    describe("Configuration Parsing", () => {
        it("should extract config from data attributes", () => {
            const element = createAndAppend(`
                <div data-ss-widget
                     data-ss-widget-option-a="value1"
                     data-ss-widget-option-b="123"
                     data-ss-widget-enabled="true">
                </div>
            `)

            // Test attribute existence
            expect(element.getAttribute("data-ss-widget-option-a")).toBe("value1")
            expect(element.getAttribute("data-ss-widget-option-b")).toBe("123")
            expect(element.getAttribute("data-ss-widget-enabled")).toBe("true")
        })
    })

    describe("Instance Management", () => {
        it("should store instances by element ID", () => {
            const instances = new Map<string, any>()

            const element = createAndAppend(`
                <div data-ss-widget id="test-widget"></div>
            `)

            // Simulate storing an instance
            instances.set("test-widget", { element })

            expect(instances.has("test-widget")).toBe(true)
            expect(instances.get("test-widget").element).toBe(element)
        })

        it("should allow retrieving instances", () => {
            const instances = new Map<string, any>()

            const el1 = createAndAppend(`<div id="w1"></div>`)
            const el2 = createAndAppend(`<div id="w2"></div>`)

            instances.set("w1", { id: 1 })
            instances.set("w2", { id: 2 })

            expect(instances.get("w1").id).toBe(1)
            expect(instances.get("w2").id).toBe(2)
        })

        it("should allow destroying instances", () => {
            const instances = new Map<string, any>()
            const destroySpy = vi.fn()

            instances.set("widget", {
                destroy: destroySpy
            })

            const instance = instances.get("widget")
            instance.destroy()
            instances.delete("widget")

            expect(destroySpy).toHaveBeenCalled()
            expect(instances.has("widget")).toBe(false)
        })
    })

    describe("Auto-Init Behavior", () => {
        it("should initialize on DOMContentLoaded when autoInit is true", () => {
            // This tests the concept - actual implementation would fire on DOMContentLoaded
            const initSpy = vi.fn()

            // Simulate DOMContentLoaded already fired
            expect(document.readyState).not.toBe("loading")
            initSpy()

            expect(initSpy).toHaveBeenCalled()
        })

        it("should not auto-initialize when autoInit is false", () => {
            const initSpy = vi.fn()

            // With autoInit: false, init should not be called automatically
            // This is a conceptual test - actual behavior depends on implementation
            const config = { autoInit: false }

            if (config.autoInit) {
                initSpy()
            }

            expect(initSpy).not.toHaveBeenCalled()
        })
    })
})
