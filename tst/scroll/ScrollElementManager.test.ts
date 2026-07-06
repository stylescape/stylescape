// ============================================================================
// Stylescape | ScrollElementManager Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScrollElementManager } from "../../src/ts/scroll/ScrollElementManager";

function defineScrollTop(el: HTMLElement, value: number): void {
    Object.defineProperty(el, "scrollTop", {
        value,
        writable: true,
        configurable: true,
    });
}

describe("ScrollElementManager", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        sessionStorage.clear();
    });

    afterEach(() => {
        sessionStorage.clear();
    });

    describe("Construction", () => {
        it("does nothing (and does not throw) when the element is missing", () => {
            expect(() => new ScrollElementManager("#nope")).not.toThrow();
        });

        it("warns about a missing element when debug is enabled", () => {
            const warnSpy = vi
                .spyOn(console, "warn")
                .mockImplementation(() => {});
            new ScrollElementManager("#nope", "scrollpos", true);
            expect(warnSpy).toHaveBeenCalledWith(
                "ScrollElementManager: Element not found:",
                "#nope",
            );
            warnSpy.mockRestore();
        });
    });

    describe("Restoring scroll position on load", () => {
        it("restores scrollTop from sessionStorage and clears the entry", () => {
            document.body.innerHTML = `<div id="content"></div>`;
            const content = document.getElementById("content")!;
            defineScrollTop(content, 0);
            sessionStorage.setItem("scrollpos", "150");

            new ScrollElementManager("#content");
            window.dispatchEvent(new Event("load"));

            expect(content.scrollTop).toBe(150);
            expect(sessionStorage.getItem("scrollpos")).toBeNull();
        });

        it("does not alter scrollTop when there is no stored value", () => {
            document.body.innerHTML = `<div id="content"></div>`;
            const content = document.getElementById("content")!;
            defineScrollTop(content, 42);

            new ScrollElementManager("#content");
            window.dispatchEvent(new Event("load"));

            expect(content.scrollTop).toBe(42);
        });
    });

    describe("Saving scroll position", () => {
        it("saves the current scrollTop to sessionStorage on scroll", () => {
            document.body.innerHTML = `<div id="content"></div>`;
            const content = document.getElementById("content")!;
            defineScrollTop(content, 250);

            new ScrollElementManager("#content");
            content.dispatchEvent(new Event("scroll"));

            expect(sessionStorage.getItem("scrollpos")).toBe("250");
        });

        it("uses a custom storage key when provided", () => {
            document.body.innerHTML = `<div id="content"></div>`;
            const content = document.getElementById("content")!;
            defineScrollTop(content, 77);

            new ScrollElementManager("#content", "my-key");
            content.dispatchEvent(new Event("scroll"));

            expect(sessionStorage.getItem("my-key")).toBe("77");
            expect(sessionStorage.getItem("scrollpos")).toBeNull();
        });

        it("round-trips a saved position back on load", () => {
            document.body.innerHTML = `<div id="content"></div>`;
            const content = document.getElementById("content")!;
            defineScrollTop(content, 320);

            const manager = new ScrollElementManager("#content", "rt");
            content.dispatchEvent(new Event("scroll"));
            expect(sessionStorage.getItem("rt")).toBe("320");

            // Simulate a fresh page: reset scrollTop, then load restores it.
            defineScrollTop(content, 0);
            window.dispatchEvent(new Event("load"));
            expect(content.scrollTop).toBe(320);
            // manager is referenced to avoid unused-var lint noise
            expect(manager).toBeInstanceOf(ScrollElementManager);
        });
    });
});
