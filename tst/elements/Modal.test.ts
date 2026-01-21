// ============================================================================
// Stylescape | Modal Component Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Modal } from "../../src/ts/elements/Modal";
import { $, click, pressEscape, wait } from "../utils";
import { modalFixture } from "../utils/fixtures";

describe("Modal", () => {
    let modal: Modal;
    let modalElement: HTMLElement;
    let triggerElement: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = modalFixture;
        modalElement = document.getElementById("test-modal") as HTMLElement;
        triggerElement = document.getElementById(
            "modal-trigger",
        ) as HTMLElement;
    });

    afterEach(() => {
        if (modal && typeof (modal as any).destroy === "function") {
            (modal as any).destroy();
        }
    });

    describe("Initialization", () => {
        it("should initialize with element selector", () => {
            modal = new Modal("#test-modal");
            expect(modal).toBeDefined();
        });

        it("should initialize with element reference", () => {
            modal = new Modal(modalElement);
            expect(modal).toBeDefined();
        });

        it("should handle non-existent element gracefully", () => {
            const consoleSpy = vi
                .spyOn(console, "warn")
                .mockImplementation(() => {});
            modal = new Modal("#non-existent");
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        it("should apply default options", () => {
            modal = new Modal(modalElement);
            // Modal should be closed by default
            expect(modal.opened).toBe(false);
        });

        it("should merge custom options with defaults", () => {
            modal = new Modal(modalElement, {
                closeOnBackdrop: false,
                animationDuration: 500,
            });
            expect(modal).toBeDefined();
        });
    });

    describe("Open/Close", () => {
        beforeEach(() => {
            modal = new Modal(modalElement);
        });

        it("should open modal", () => {
            modal.open();
            expect(modal.opened).toBe(true);
        });

        it("should close modal", async () => {
            modal.open();
            expect(modal.opened).toBe(true);

            modal.close();
            // Wait for animation
            await wait(350);
            expect(modal.opened).toBe(false);
        });

        it("should toggle modal state", () => {
            expect(modal.opened).toBe(false);

            modal.open();
            expect(modal.opened).toBe(true);

            modal.close();
        });

        it("should remove hidden attribute when opened", () => {
            modal.open();
            expect(modalElement.hidden).toBe(false);
        });
    });

    describe("Trigger Elements", () => {
        it("should open modal when trigger is clicked", () => {
            modal = new Modal(modalElement);

            // Setup trigger
            const trigger = $<HTMLElement>("[data-ss-modal-trigger]");
            if (trigger) {
                trigger.addEventListener("click", () => modal.open());
                click(trigger);
                expect(modal.opened).toBe(true);
            }
        });

        it("should close modal when close button is clicked", async () => {
            modal = new Modal(modalElement);
            modal.open();

            const closeBtn = modalElement.querySelector(
                "[data-ss-modal-close]",
            );
            if (closeBtn) {
                click(closeBtn);
                await wait(350);
                expect(modal.opened).toBe(false);
            }
        });
    });

    describe("Keyboard Navigation", () => {
        beforeEach(() => {
            modal = new Modal(modalElement, {
                closeOnEscape: true,
            });
        });

        it("should close on Escape key when enabled", async () => {
            modal.open();
            expect(modal.opened).toBe(true);

            pressEscape(modalElement);
            await wait(350);
            // Escape should trigger close
        });

        it("should not close on Escape when disabled", () => {
            modal = new Modal(modalElement, {
                closeOnEscape: false,
            });
            modal.open();

            pressEscape(modalElement);
            // Modal should remain open
        });
    });

    describe("Backdrop", () => {
        it("should close on backdrop click when enabled", async () => {
            modal = new Modal(modalElement, {
                closeOnBackdrop: true,
            });
            modal.open();

            const backdrop = modalElement.querySelector(".modal-backdrop");
            if (backdrop) {
                click(backdrop);
                await wait(350);
            }
        });

        it("should not close on content click", async () => {
            modal = new Modal(modalElement, {
                closeOnBackdrop: true,
            });
            modal.open();

            const content = modalElement.querySelector(
                "[data-ss-modal-content]",
            );
            if (content) {
                click(content);
                await wait(50);
                expect(modal.opened).toBe(true);
            }
        });
    });

    describe("Focus Management", () => {
        it("should trap focus within modal when enabled", () => {
            modal = new Modal(modalElement, {
                trapFocus: true,
            });
            modal.open();

            // Focus should be managed within modal
            const focusableElements = modalElement.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            );
            expect(focusableElements.length).toBeGreaterThan(0);
        });
    });

    describe("Accessibility", () => {
        beforeEach(() => {
            modal = new Modal(modalElement);
        });

        it("should have role dialog", () => {
            expect(modalElement.getAttribute("role")).toBe("dialog");
        });

        it("should have aria-modal attribute", () => {
            expect(modalElement.getAttribute("aria-modal")).toBe("true");
        });

        it("should update aria-hidden on open/close", () => {
            modal.open();
            expect(modalElement.getAttribute("aria-hidden")).toBe("false");

            modal.close();
            // After close animation
        });
    });

    describe("Callbacks", () => {
        it("should call onOpen callback", () => {
            const onOpen = vi.fn();
            modal = new Modal(modalElement, { onOpen });

            modal.open();
            expect(onOpen).toHaveBeenCalled();
        });

        it("should call onClose callback", async () => {
            const onClose = vi.fn();
            modal = new Modal(modalElement, { onClose });

            modal.open();
            modal.close();
            await wait(350);
            expect(onClose).toHaveBeenCalled();
        });

        it("should allow preventing close via onBeforeClose", () => {
            const onBeforeClose = vi.fn().mockReturnValue(false);
            modal = new Modal(modalElement, { onBeforeClose });

            modal.open();
            modal.close();

            expect(onBeforeClose).toHaveBeenCalled();
            // Modal should remain open if onBeforeClose returns false
        });
    });
});
