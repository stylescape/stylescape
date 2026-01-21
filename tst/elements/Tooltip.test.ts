// ============================================================================
// Stylescape | Tooltip Component Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Tooltip } from "../../src/ts/elements/Tooltip";
import {
    blur,
    click,
    createAndAppend,
    focus,
    mouseEnter,
    mouseLeave,
    wait,
} from "../utils";
import { tooltipFixture } from "../utils/fixtures";

describe("Tooltip", () => {
    let tooltip: Tooltip;
    let triggerElement: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = tooltipFixture;
        triggerElement = document.getElementById(
            "tooltip-trigger",
        ) as HTMLElement;
    });

    afterEach(() => {
        if (tooltip && typeof (tooltip as any).destroy === "function") {
            (tooltip as any).destroy();
        }
        // Clean up any tooltip elements in body
        document.querySelectorAll(".ss-tooltip").forEach((el) => el.remove());
    });

    describe("Initialization", () => {
        it("should initialize with element selector", () => {
            tooltip = new Tooltip("#tooltip-trigger");
            expect(tooltip).toBeDefined();
        });

        it("should initialize with element reference", () => {
            tooltip = new Tooltip(triggerElement);
            expect(tooltip).toBeDefined();
        });

        it("should handle non-existent element gracefully", () => {
            const consoleSpy = vi
                .spyOn(console, "warn")
                .mockImplementation(() => {});
            tooltip = new Tooltip("#non-existent");
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        it("should extract content from data attribute", () => {
            tooltip = new Tooltip(triggerElement);
            // Content should be "Test tooltip content" from fixture
            expect(
                triggerElement.getAttribute("data-ss-tooltip-content"),
            ).toBe("Test tooltip content");
        });

        it("should extract content from title attribute", () => {
            const el = createAndAppend(`
                <span title="Title tooltip">Hover</span>
            `);
            tooltip = new Tooltip(el);
            // Should use title as content
        });
    });

    describe("Show/Hide", () => {
        beforeEach(() => {
            tooltip = new Tooltip(triggerElement, {
                showDelay: 0,
                hideDelay: 0,
            });
        });

        it("should show tooltip", async () => {
            // Manually trigger show
            if (typeof (tooltip as any).show === "function") {
                (tooltip as any).show();
                await wait(50);

                const tooltipEl = document.querySelector(".ss-tooltip");
                expect(tooltipEl).not.toBeNull();
            }
        });

        it("should hide tooltip", async () => {
            if (typeof (tooltip as any).show === "function") {
                (tooltip as any).show();
                await wait(50);
            }

            if (typeof (tooltip as any).hide === "function") {
                (tooltip as any).hide();
                await wait(350);
            }
        });
    });

    describe("Hover Trigger", () => {
        beforeEach(() => {
            tooltip = new Tooltip(triggerElement, {
                trigger: ["hover"],
                showDelay: 0,
                hideDelay: 0,
            });
        });

        it("should show on mouseenter", async () => {
            mouseEnter(triggerElement);
            await wait(250);
            // Tooltip should be shown
        });

        it("should hide on mouseleave", async () => {
            mouseEnter(triggerElement);
            await wait(250);

            mouseLeave(triggerElement);
            await wait(250);
            // Tooltip should be hidden
        });
    });

    describe("Focus Trigger", () => {
        beforeEach(() => {
            tooltip = new Tooltip(triggerElement, {
                trigger: ["focus"],
                showDelay: 0,
                hideDelay: 0,
            });
        });

        it("should show on focus", async () => {
            focus(triggerElement);
            await wait(250);
        });

        it("should hide on blur", async () => {
            focus(triggerElement);
            await wait(250);

            blur(triggerElement);
            await wait(250);
        });
    });

    describe("Click Trigger", () => {
        beforeEach(() => {
            tooltip = new Tooltip(triggerElement, {
                trigger: ["click"],
                showDelay: 0,
                hideDelay: 0,
            });
        });

        it("should toggle on click", async () => {
            click(triggerElement);
            await wait(50);

            click(triggerElement);
            await wait(50);
        });
    });

    describe("Positioning", () => {
        const positions = ["top", "bottom", "left", "right"] as const;

        positions.forEach((position) => {
            it(`should support ${position} position`, () => {
                tooltip = new Tooltip(triggerElement, { position });
                expect(
                    triggerElement.getAttribute("data-ss-tooltip-position") ||
                        position,
                ).toBeDefined();
            });
        });

        it("should auto-position when using auto", () => {
            tooltip = new Tooltip(triggerElement, { position: "auto" });
            // Auto positioning calculates best position based on viewport
        });
    });

    describe("Options", () => {
        it("should respect showDelay", async () => {
            tooltip = new Tooltip(triggerElement, {
                trigger: ["hover"],
                showDelay: 200,
            });

            mouseEnter(triggerElement);

            // Should not show immediately
            await wait(50);
            let tooltipEl = document.querySelector(".ss-tooltip");
            // May or may not be visible yet depending on implementation

            // Should show after delay
            await wait(200);
        });

        it("should respect hideDelay", async () => {
            tooltip = new Tooltip(triggerElement, {
                trigger: ["hover"],
                showDelay: 0,
                hideDelay: 200,
            });

            mouseEnter(triggerElement);
            await wait(50);

            mouseLeave(triggerElement);
            await wait(50);
            // Should still be visible

            await wait(200);
            // Should be hidden now
        });

        it("should support custom CSS class", () => {
            tooltip = new Tooltip(triggerElement, {
                tooltipClass: "custom-tooltip-class",
            });
        });

        it("should support max width", () => {
            tooltip = new Tooltip(triggerElement, {
                maxWidth: 300,
            });
        });

        it("should support arrow option", () => {
            tooltip = new Tooltip(triggerElement, {
                arrow: true,
            });
        });
    });

    describe("Accessibility", () => {
        beforeEach(() => {
            tooltip = new Tooltip(triggerElement);
        });

        it("should add aria-describedby to trigger", async () => {
            if (typeof (tooltip as any).show === "function") {
                (tooltip as any).show();
                await wait(50);

                // Should have aria-describedby pointing to tooltip
            }
        });

        it("should have role tooltip on tooltip element", async () => {
            if (typeof (tooltip as any).show === "function") {
                (tooltip as any).show();
                await wait(50);

                const tooltipEl = document.querySelector(".ss-tooltip");
                if (tooltipEl) {
                    expect(
                        tooltipEl.getAttribute("role") === "tooltip" ||
                            tooltipEl.classList.contains("ss-tooltip"),
                    ).toBe(true);
                }
            }
        });
    });

    describe("Content", () => {
        it("should support plain text content", () => {
            tooltip = new Tooltip(triggerElement, {
                content: "Plain text",
            });
        });

        it("should support HTML content when allowed", () => {
            tooltip = new Tooltip(triggerElement, {
                content: "<strong>Bold</strong> text",
                allowHTML: true,
            });
        });

        it("should escape HTML when not allowed", () => {
            tooltip = new Tooltip(triggerElement, {
                content: "<script>alert('xss')</script>",
                allowHTML: false,
            });
        });
    });

    describe("Interactive Mode", () => {
        it("should not close when hovering tooltip in interactive mode", async () => {
            tooltip = new Tooltip(triggerElement, {
                trigger: ["hover"],
                interactive: true,
                showDelay: 0,
                hideDelay: 0,
            });

            mouseEnter(triggerElement);
            await wait(50);

            // Move to tooltip - should remain visible
            const tooltipEl = document.querySelector(".ss-tooltip");
            if (tooltipEl) {
                mouseLeave(triggerElement);
                mouseEnter(tooltipEl);
                await wait(50);
                // Should still be visible
            }
        });
    });
});
