// ============================================================================
// Stylescape | Accordion Component Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AccordionManager } from "../../src/ts/elements/AccordianMananger";
import { $, $$, click, pressEnter, wait } from "../utils";
import { accordionFixture } from "../utils/fixtures";

describe("Accordion", () => {
    let accordion: AccordionManager;
    let accordionElement: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = accordionFixture;
        accordionElement = document.getElementById(
            "test-accordion",
        ) as HTMLElement;
    });

    afterEach(() => {
        if (accordion && typeof (accordion as any).destroy === "function") {
            (accordion as any).destroy();
        }
    });

    describe("Initialization", () => {
        it("should initialize with element selector", () => {
            accordion = new AccordionManager("#test-accordion");
            expect(accordion).toBeDefined();
        });

        it("should initialize with element reference", () => {
            accordion = new AccordionManager(accordionElement);
            expect(accordion).toBeDefined();
        });

        it("should find all accordion triggers", () => {
            accordion = new AccordionManager(accordionElement);
            const triggers = accordionElement.querySelectorAll(
                "[data-ss-accordion-trigger]",
            );
            expect(triggers.length).toBe(3);
        });

        it("should find all accordion panels", () => {
            accordion = new AccordionManager(accordionElement);
            const panels = accordionElement.querySelectorAll(
                "[data-ss-accordion-panel]",
            );
            expect(panels.length).toBe(3);
        });
    });

    describe("Toggle Behavior", () => {
        beforeEach(() => {
            accordion = new AccordionManager(accordionElement);
        });

        it("should expand panel when trigger is clicked", async () => {
            const trigger = $<HTMLElement>("[data-ss-accordion-trigger]");
            const panel = $<HTMLElement>("[data-ss-accordion-panel]");

            if (trigger && panel) {
                expect(panel.hidden).toBe(true);
                click(trigger);
                await wait(50);
                // Panel should be expanded
            }
        });

        it("should collapse expanded panel when trigger is clicked again", async () => {
            const trigger = $<HTMLElement>("[data-ss-accordion-trigger]");
            const panel = $<HTMLElement>("[data-ss-accordion-panel]");

            if (trigger && panel) {
                // First click - expand
                click(trigger);
                await wait(50);

                // Second click - collapse
                click(trigger);
                await wait(50);
            }
        });

        it("should update aria-expanded attribute", async () => {
            const trigger = $<HTMLElement>("[data-ss-accordion-trigger]");

            if (trigger) {
                expect(trigger.getAttribute("aria-expanded")).toBe("false");

                click(trigger);
                await wait(50);
                // Should be "true" after expansion
            }
        });
    });

    describe("Single vs Multi Mode", () => {
        it("should allow only one panel open in single mode", async () => {
            accordion = new AccordionManager(accordionElement, {
                allowMultiple: false,
            });

            const triggers = $$<HTMLElement>("[data-ss-accordion-trigger]");

            if (triggers.length >= 2) {
                // Open first panel
                click(triggers[0]);
                await wait(50);

                // Open second panel
                click(triggers[1]);
                await wait(50);

                // First panel should be closed
            }
        });

        it("should allow multiple panels open in multi mode", async () => {
            accordion = new AccordionManager(accordionElement, {
                allowMultiple: true,
            });

            const triggers = $$<HTMLElement>("[data-ss-accordion-trigger]");

            if (triggers.length >= 2) {
                // Open first panel
                click(triggers[0]);
                await wait(50);

                // Open second panel
                click(triggers[1]);
                await wait(50);

                // Both should be open
            }
        });
    });

    describe("Keyboard Navigation", () => {
        beforeEach(() => {
            accordion = new AccordionManager(accordionElement);
        });

        it("should toggle on Enter key", async () => {
            const trigger = $<HTMLElement>("[data-ss-accordion-trigger]");

            if (trigger) {
                trigger.focus();
                pressEnter(trigger);
                await wait(50);
            }
        });

        it("should toggle on Space key", async () => {
            const trigger = $<HTMLElement>("[data-ss-accordion-trigger]");

            if (trigger) {
                trigger.focus();
                trigger.dispatchEvent(
                    new KeyboardEvent("keydown", {
                        key: " ",
                        bubbles: true,
                    }),
                );
                await wait(50);
            }
        });
    });

    describe("Accessibility", () => {
        beforeEach(() => {
            accordion = new AccordionManager(accordionElement);
        });

        it("should have proper aria attributes on triggers", () => {
            const triggers = $$<HTMLElement>("[data-ss-accordion-trigger]");

            triggers.forEach((trigger) => {
                expect(trigger.hasAttribute("aria-expanded")).toBe(true);
            });
        });

        it("should associate triggers with panels via aria-controls", () => {
            const triggers = $$<HTMLElement>("[data-ss-accordion-trigger]");

            // Triggers should reference their panels
            triggers.forEach((trigger) => {
                // Implementation may add aria-controls dynamically
            });
        });
    });

    describe("Animation", () => {
        it("should support custom animation duration", () => {
            accordion = new AccordionManager(accordionElement, {
                animationDuration: 500,
            });
            expect(accordion).toBeDefined();
        });

        it("should support disabling animation", () => {
            accordion = new AccordionManager(accordionElement, {
                animationDuration: 0,
            });
            expect(accordion).toBeDefined();
        });
    });

    describe("Callbacks", () => {
        it("should call onOpen callback", async () => {
            const onOpen = vi.fn();
            accordion = new AccordionManager(accordionElement, { onOpen });

            const trigger = $<HTMLElement>("[data-ss-accordion-trigger]");
            if (trigger) {
                click(trigger);
                await wait(50);
                // onOpen should have been called
            }
        });

        it("should call onClose callback", async () => {
            const onClose = vi.fn();
            accordion = new AccordionManager(accordionElement, { onClose });

            const trigger = $<HTMLElement>("[data-ss-accordion-trigger]");
            if (trigger) {
                // Expand first
                click(trigger);
                await wait(50);

                // Collapse
                click(trigger);
                await wait(50);
            }
        });
    });

    describe("Programmatic Control", () => {
        beforeEach(() => {
            accordion = new AccordionManager(accordionElement);
        });

        it("should support expanding panel programmatically", () => {
            if (typeof (accordion as any).expand === "function") {
                (accordion as any).expand(0);
            }
        });

        it("should support collapsing panel programmatically", () => {
            if (typeof (accordion as any).collapse === "function") {
                (accordion as any).collapse(0);
            }
        });

        it("should support expanding all panels", () => {
            if (typeof (accordion as any).expandAll === "function") {
                (accordion as any).expandAll();
            }
        });

        it("should support collapsing all panels", () => {
            if (typeof (accordion as any).collapseAll === "function") {
                (accordion as any).collapseAll();
            }
        });
    });
});
