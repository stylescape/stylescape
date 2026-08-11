// ============================================================================
// Stylescape | Button Handler — Behavioural Tests
// ============================================================================
// Complements ButtonHandler.test.ts with loading-state, ripple, callback and
// static-init coverage.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ButtonHandler, initButtons } from "../../src/ts/buttons/ButtonHandler";
import { click } from "../utils";

function button(): HTMLButtonElement {
    return document.getElementById("btn") as HTMLButtonElement;
}

describe("ButtonHandler (behaviour)", () => {
    beforeEach(() => {
        document.body.innerHTML = `<button id="btn">Submit</button>`;
    });
    afterEach(() => vi.restoreAllMocks());

    it("warns when the button is not found", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        new ButtonHandler("#missing");
        expect(warn).toHaveBeenCalled();
    });

    it("startLoading applies loading UI and disables the button", () => {
        const handler = new ButtonHandler(button());
        handler.startLoading();

        const btn = button();
        expect(btn.disabled).toBe(true);
        expect(btn.classList.contains("button--loading")).toBe(true);
        expect(btn.getAttribute("aria-busy")).toBe("true");
        expect(btn.innerHTML).toContain("button__spinner");
    });

    it("stopLoading restores the original content and state", () => {
        const handler = new ButtonHandler(button());
        handler.startLoading();
        handler.stopLoading();

        const btn = button();
        expect(btn.disabled).toBe(false);
        expect(btn.classList.contains("button--loading")).toBe(false);
        expect(btn.getAttribute("aria-busy")).toBe("false");
        expect(btn.textContent).toBe("Submit");
    });

    it("does not disable the button when disableOnLoading is false", () => {
        const handler = new ButtonHandler(button(), {
            disableOnLoading: false,
        });
        handler.startLoading();
        expect(button().disabled).toBe(false);
    });

    it("invokes onClick with the button and event", () => {
        const onClick = vi.fn();
        new ButtonHandler(button(), { onClick });
        click(button());
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick.mock.calls[0][0]).toBe(button());
    });

    it("enters and leaves the loading state around an async onClick", async () => {
        let resolveClick!: () => void;
        const pending = new Promise<void>((r) => (resolveClick = r));
        const onClick = vi.fn(() => pending);

        new ButtonHandler(button(), { loading: true, onClick });
        click(button());

        // Synchronous part of the handler has run startLoading().
        expect(button().classList.contains("button--loading")).toBe(true);
        expect(button().disabled).toBe(true);

        resolveClick();
        await pending;
        await Promise.resolve();

        expect(button().classList.contains("button--loading")).toBe(false);
        expect(button().disabled).toBe(false);
    });

    it("ignores clicks while already loading", async () => {
        const onClick = vi.fn(() => new Promise<void>(() => {})); // never resolves
        new ButtonHandler(button(), { loading: true, onClick });
        click(button());
        click(button()); // second click blocked by isLoading guard
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("creates a ripple element on click when ripple is enabled", () => {
        new ButtonHandler(button(), { ripple: true });
        expect(button().style.position).toBe("relative");
        click(button());
        expect(button().querySelector(".button__ripple")).not.toBeNull();
    });

    it("enable() and disable() toggle the disabled state", () => {
        const handler = new ButtonHandler(button());
        handler.disable();
        expect(button().disabled).toBe(true);
        handler.enable();
        expect(button().disabled).toBe(false);
    });

    it("the programmatic click() method fires the handler", () => {
        const onClick = vi.fn();
        const handler = new ButtonHandler(button(), { onClick });
        handler.click();
        expect(onClick).toHaveBeenCalled();
    });

    it("destroy detaches the click handler", () => {
        const onClick = vi.fn();
        const handler = new ButtonHandler(button(), { onClick });
        handler.destroy();
        click(button());
        expect(onClick).not.toHaveBeenCalled();
    });

    it("initButtons wires all tagged buttons", () => {
        document.body.innerHTML = `
            <button data-ss="button" data-ss-button-ripple="true" id="a">A</button>
            <button data-ss="button" id="b">B</button>
        `;
        expect(() => initButtons()).not.toThrow();
        // Ripple button gets relative positioning from its handler init.
        expect((document.getElementById("a") as HTMLElement).style.position).toBe(
            "relative",
        );
    });
});
