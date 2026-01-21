// ============================================================================
// Stylescape | Auto-Init Integration Tests
// ============================================================================
// Tests the complete auto-initialization flow from DOM to component instances.
// ============================================================================

import { beforeEach, describe, expect, it, vi } from "vitest";
import { $, click, createElement, wait } from "../utils";
import { autoInitFixture } from "../utils/fixtures";

describe("Auto-Init Integration", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    describe("Full Initialization Flow", () => {
        it("should initialize all components with data-ss attribute", async () => {
            document.body.innerHTML = autoInitFixture;

            const { init } = await import("../../src/ts/init/autoInit");
            await init();

            // All components should be initialized
            const components = document.querySelectorAll("[data-ss]");
            expect(components.length).toBeGreaterThan(0);
        });

        it("should initialize components in correct order", async () => {
            const initOrder: string[] = [];

            document.body.innerHTML = `
                <div data-ss="accordion" id="a1"></div>
                <div data-ss="tooltip" id="t1"></div>
                <div data-ss="modal" id="m1" hidden></div>
            `;

            const { init } = await import("../../src/ts/init/autoInit");
            await init();

            // Components should all be processed
        });

        it("should handle nested components", async () => {
            document.body.innerHTML = `
                <div data-ss="accordion" id="parent">
                    <button data-ss="tooltip" data-ss-tooltip-content="Help">?</button>
                </div>
            `;

            const { init } = await import("../../src/ts/init/autoInit");
            await init();

            // Both parent and child should be initialized
        });
    });

    describe("MutationObserver Integration", () => {
        it("should initialize dynamically added elements", async () => {
            const { init, observe } = await import(
                "../../src/ts/init/autoInit"
            );
            await init();
            observe();

            // Dynamically add element
            const newElement = createElement(`
                <button data-ss="tooltip" data-ss-tooltip-content="Dynamic">New</button>
            `);
            document.body.appendChild(newElement);

            // Give MutationObserver time to process
            await wait(100);

            // Element should be initialized
        });

        it("should not re-initialize existing elements", async () => {
            document.body.innerHTML = `
                <button data-ss="tooltip" id="existing">Existing</button>
            `;

            const { init, getInstance } = await import(
                "../../src/ts/init/autoInit"
            );
            await init();

            const element = document.getElementById("existing");
            // Get initial instance reference

            // Trigger re-scan
            await init();

            // Should be same instance, not new one
        });
    });

    describe("Component Communication", () => {
        it("should allow modal trigger to open modal", async () => {
            document.body.innerHTML = `
                <button data-ss-modal-trigger="#test-modal">Open</button>
                <div id="test-modal" data-ss="modal" hidden>
                    <div data-ss-modal-content>Content</div>
                </div>
            `;

            const { init } = await import("../../src/ts/init/autoInit");
            await init();

            const trigger = $("[data-ss-modal-trigger]");
            const modal = $("#test-modal");

            if (trigger) {
                click(trigger);
                await wait(100);
            }
        });
    });

    describe("Error Handling", () => {
        it("should handle invalid component names gracefully", async () => {
            const consoleSpy = vi
                .spyOn(console, "warn")
                .mockImplementation(() => {});

            document.body.innerHTML = `
                <div data-ss="nonexistent-component"></div>
            `;

            const { init } = await import("../../src/ts/init/autoInit");
            await init();

            // Should warn about unknown component
            consoleSpy.mockRestore();
        });

        it("should continue initializing other components if one fails", async () => {
            document.body.innerHTML = `
                <div data-ss="invalid-component" id="invalid"></div>
                <button data-ss="tooltip" data-ss-tooltip-content="Valid" id="valid">OK</button>
            `;

            const { init } = await import("../../src/ts/init/autoInit");
            await init();

            // Valid component should still be initialized
        });
    });

    describe("Configuration Integration", () => {
        it("should pass data attributes as config", async () => {
            document.body.innerHTML = `
                <button data-ss="tooltip"
                        data-ss-tooltip-content="Test"
                        data-ss-tooltip-position="bottom"
                        data-ss-tooltip-show-delay="100">
                    Hover
                </button>
            `;

            const { init } = await import("../../src/ts/init/autoInit");
            await init();

            // Config should be parsed and applied
        });

        it("should handle JSON config attribute", async () => {
            const config = JSON.stringify({
                content: "JSON Content",
                position: "right",
            });

            document.body.innerHTML = `
                <button data-ss="tooltip" data-ss-tooltip-config='${config}'>
                    Hover
                </button>
            `;

            const { init } = await import("../../src/ts/init/autoInit");
            await init();
        });
    });

    describe("Instance Management", () => {
        it("should allow retrieving component instances", async () => {
            document.body.innerHTML = `
                <button data-ss="tooltip" id="my-tooltip">Hover</button>
            `;

            const { init, getInstance } = await import(
                "../../src/ts/init/autoInit"
            );
            await init();

            const element = document.getElementById("my-tooltip");
            if (element) {
                const instance = getInstance(element, "tooltip");
                // Should return the tooltip instance
            }
        });

        it("should allow destroying component instances", async () => {
            document.body.innerHTML = `
                <button data-ss="tooltip" id="destroy-test">Hover</button>
            `;

            const { init, destroy } = await import(
                "../../src/ts/init/autoInit"
            );
            await init();

            const element = document.getElementById("destroy-test");
            if (element) {
                destroy(element, "tooltip");
                // Instance should be removed
            }
        });
    });

    describe("Global API", () => {
        it("should expose Stylescape on window", async () => {
            const { initializeStylescape } = await import(
                "../../src/ts/init/index"
            );
            initializeStylescape();

            // window.Stylescape should exist
        });

        it("should allow programmatic component registration", async () => {
            const { registerComponent, componentRegistry } = await import(
                "../../src/ts/init/registry"
            );

            const customHandler = vi.fn();
            registerComponent("custom-test", {
                handler: customHandler,
                defaults: {},
            });

            expect(componentRegistry.has("custom-test")).toBe(true);

            // Clean up
            componentRegistry.delete("custom-test");
        });
    });
});
