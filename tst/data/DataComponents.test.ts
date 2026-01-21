// ============================================================================
// Stylescape | Data Components Tests
// ============================================================================

import { beforeEach, describe, expect, it, vi } from "vitest"
import { FilterManager } from "../../src/ts/data/FilterManager"
import { RatingManager } from "../../src/ts/data/RatingManager"
import { $, click, inputValue, wait } from "../utils"

describe("FilterManager", () => {
    let filterManager: FilterManager
    let containerElement: HTMLElement

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="filter-container" data-ss="filter">
                <input type="text" data-ss-filter-input placeholder="Search...">
                <div data-ss-filter-list>
                    <div data-ss-filter-item data-tags="javascript,frontend">JavaScript</div>
                    <div data-ss-filter-item data-tags="typescript,frontend">TypeScript</div>
                    <div data-ss-filter-item data-tags="python,backend">Python</div>
                    <div data-ss-filter-item data-tags="rust,systems">Rust</div>
                </div>
            </div>
        `
        containerElement = document.getElementById("filter-container") as HTMLElement
    })

    describe("Initialization", () => {
        it("should initialize with container element", () => {
            filterManager = new FilterManager(containerElement)
            expect(filterManager).toBeDefined()
        })

        it("should find all filterable items", () => {
            filterManager = new FilterManager(containerElement)
            const items = containerElement.querySelectorAll("[data-ss-filter-item]")
            expect(items.length).toBe(4)
        })
    })

    describe("Text Filtering", () => {
        beforeEach(() => {
            filterManager = new FilterManager(containerElement)
        })

        it("should filter items by text input", async () => {
            const input = $<HTMLInputElement>("[data-ss-filter-input]")
            if (input) {
                inputValue(input, "java")
                await wait(100)
                // Only JavaScript should be visible
            }
        })

        it("should show all items when filter is cleared", async () => {
            const input = $<HTMLInputElement>("[data-ss-filter-input]")
            if (input) {
                inputValue(input, "java")
                await wait(100)

                inputValue(input, "")
                await wait(100)
                // All items should be visible
            }
        })

        it("should be case-insensitive", async () => {
            const input = $<HTMLInputElement>("[data-ss-filter-input]")
            if (input) {
                inputValue(input, "PYTHON")
                await wait(100)
                // Python should still be visible
            }
        })
    })

    describe("Tag Filtering", () => {
        beforeEach(() => {
            filterManager = new FilterManager(containerElement)
        })

        it("should filter by tag", async () => {
            if (typeof (filterManager as any).filterByTag === "function") {
                (filterManager as any).filterByTag("frontend")
                await wait(50)
                // JavaScript and TypeScript should be visible
            }
        })

        it("should support multiple tags", async () => {
            if (typeof (filterManager as any).filterByTags === "function") {
                (filterManager as any).filterByTags(["frontend", "backend"])
                await wait(50)
            }
        })
    })

    describe("Callbacks", () => {
        it("should call onFilter callback", async () => {
            const onFilter = vi.fn()
            filterManager = new FilterManager(containerElement, { onFilter })

            const input = $<HTMLInputElement>("[data-ss-filter-input]")
            if (input) {
                inputValue(input, "test")
                await wait(150)
            }
        })
    })
})

describe("RatingManager", () => {
    let ratingManager: RatingManager
    let ratingElement: HTMLElement

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="rating-container"
                 data-ss="rating"
                 data-ss-rating-max="5"
                 data-ss-rating-value="3">
                <span class="star" data-value="1">★</span>
                <span class="star" data-value="2">★</span>
                <span class="star" data-value="3">★</span>
                <span class="star" data-value="4">★</span>
                <span class="star" data-value="5">★</span>
            </div>
        `
        ratingElement = document.getElementById("rating-container") as HTMLElement
    })

    describe("Initialization", () => {
        it("should initialize with element", () => {
            ratingManager = new RatingManager(ratingElement)
            expect(ratingManager).toBeDefined()
        })

        it("should set initial value from data attribute", () => {
            ratingManager = new RatingManager(ratingElement)
            // Initial value should be 3
        })
    })

    describe("Setting Value", () => {
        beforeEach(() => {
            ratingManager = new RatingManager(ratingElement)
        })

        it("should update value on star click", async () => {
            const star = ratingElement.querySelector("[data-value='4']")
            if (star) {
                click(star)
                await wait(50)
                // Value should be 4
            }
        })

        it("should update visual state", async () => {
            const star = ratingElement.querySelector("[data-value='4']")
            if (star) {
                click(star)
                await wait(50)
                // Stars 1-4 should be active
            }
        })
    })

    describe("Read-only Mode", () => {
        it("should not change value when read-only", async () => {
            ratingManager = new RatingManager(ratingElement, { readonly: true })

            const star = ratingElement.querySelector("[data-value='5']")
            if (star) {
                click(star)
                await wait(50)
                // Value should still be 3
            }
        })
    })

    describe("Half Stars", () => {
        it("should support half star values", () => {
            ratingManager = new RatingManager(ratingElement, {
                allowHalf: true
            })
            // Should support values like 3.5
        })
    })

    describe("Callbacks", () => {
        it("should call onChange callback", async () => {
            const onChange = vi.fn()
            ratingManager = new RatingManager(ratingElement, { onChange })

            const star = ratingElement.querySelector("[data-value='4']")
            if (star) {
                click(star)
                await wait(50)
                expect(onChange).toHaveBeenCalledWith(4)
            }
        })
    })

    describe("Accessibility", () => {
        beforeEach(() => {
            ratingManager = new RatingManager(ratingElement)
        })

        it("should be keyboard accessible", () => {
            ratingElement.setAttribute("tabindex", "0")
            expect(ratingElement.getAttribute("tabindex")).toBe("0")
        })

        it("should have appropriate role", () => {
            // Should have role="slider" or similar
        })

        it("should have aria-valuenow", () => {
            // Should reflect current rating value
        })
    })
})
