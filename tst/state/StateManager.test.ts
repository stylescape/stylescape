// ============================================================================
// Stylescape | State Manager Tests
// ============================================================================

import { beforeEach, describe, expect, it, vi } from "vitest";
import { StateManager } from "../../src/ts/state/StateManager";

describe("StateManager", () => {
    let manager: StateManager;
    let element: HTMLElement;

    beforeEach(() => {
        manager = new StateManager();
        element = document.createElement("div");
        document.body.appendChild(element);
    });

    describe("Construction", () => {
        it("constructs an instance exposing toggleClass", () => {
            expect(manager).toBeInstanceOf(StateManager);
            expect(typeof manager.toggleClass).toBe("function");
        });
    });

    describe("toggleClass", () => {
        it("adds the default 'active' class when absent", () => {
            expect(element.classList.contains("active")).toBe(false);
            manager.toggleClass(element);
            expect(element.classList.contains("active")).toBe(true);
        });

        it("removes the default 'active' class when already present", () => {
            element.classList.add("active");
            manager.toggleClass(element);
            expect(element.classList.contains("active")).toBe(false);
        });

        it("toggles the class on repeated calls (add -> remove -> add)", () => {
            manager.toggleClass(element);
            expect(element.classList.contains("active")).toBe(true);
            manager.toggleClass(element);
            expect(element.classList.contains("active")).toBe(false);
            manager.toggleClass(element);
            expect(element.classList.contains("active")).toBe(true);
        });

        it("toggles a custom class name when provided", () => {
            manager.toggleClass(element, "expanded");
            expect(element.classList.contains("expanded")).toBe(true);
            expect(element.classList.contains("active")).toBe(false);
            manager.toggleClass(element, "expanded");
            expect(element.classList.contains("expanded")).toBe(false);
        });

        it("does not affect unrelated classes on the element", () => {
            element.classList.add("keep-me");
            manager.toggleClass(element, "open");
            expect(element.classList.contains("keep-me")).toBe(true);
            expect(element.classList.contains("open")).toBe(true);
        });

        it("operates independently on separate elements", () => {
            const other = document.createElement("span");
            manager.toggleClass(element, "on");
            expect(element.classList.contains("on")).toBe(true);
            expect(other.classList.contains("on")).toBe(false);
            manager.toggleClass(other, "on");
            expect(other.classList.contains("on")).toBe(true);
        });

        it("warns and no-ops when the element is falsy", () => {
            const warnSpy = vi
                .spyOn(console, "warn")
                .mockImplementation(() => {});
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect(() =>
                manager.toggleClass(null as unknown as Element),
            ).not.toThrow();
            expect(warnSpy).toHaveBeenCalledTimes(1);
            expect(warnSpy.mock.calls[0][0]).toContain("not found");
            warnSpy.mockRestore();
        });

        it("works on elements that are not attached to the document", () => {
            const detached = document.createElement("p");
            manager.toggleClass(detached, "flag");
            expect(detached.classList.contains("flag")).toBe(true);
        });
    });
});
