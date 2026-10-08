// ============================================================================
// Stylescape | FAB Manager — Tests
// ============================================================================

import { beforeEach, describe, expect, it, vi } from "vitest";
import { FabManager } from "../../src/ts/buttons/FabManager";
import { click, pressEscape } from "../utils";

const root = (): HTMLElement => document.getElementById("fab") as HTMLElement;
const toggle = (): HTMLButtonElement =>
    root().querySelector(".ss-c-fab__toggle") as HTMLButtonElement;
const action = (): HTMLButtonElement =>
    root().querySelector(".ss-c-fab__action") as HTMLButtonElement;

describe("FabManager", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <p id="outside">Outside</p>
            <div class="ss-c-fab" id="fab">
                <button class="ss-c-fab__toggle" type="button" aria-label="Open actions">+</button>
                <div class="ss-c-fab__actions" role="group" aria-label="Quick actions">
                    <button class="ss-c-fab__action" type="button" aria-label="Reply">R</button>
                    <button class="ss-c-fab__action" type="button" aria-label="Share">S</button>
                </div>
            </div>
        `;
    });

    it("warns when the element is missing", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        new FabManager("#missing");
        expect(warn).toHaveBeenCalled();
        warn.mockRestore();
    });

    it("starts closed with aria-expanded=false", () => {
        const fab = new FabManager("#fab");
        expect(fab.isOpen).toBe(false);
        expect(toggle().getAttribute("aria-expanded")).toBe("false");
        expect(root().classList.contains("is-open")).toBe(false);
    });

    it("opens and closes from the toggle", () => {
        const onToggle = vi.fn();
        new FabManager("#fab", { onToggle });
        click(toggle());
        expect(toggle().getAttribute("aria-expanded")).toBe("true");
        expect(root().classList.contains("is-open")).toBe(true);
        click(toggle());
        expect(root().classList.contains("is-open")).toBe(false);
        expect(onToggle).toHaveBeenNthCalledWith(1, true, root());
        expect(onToggle).toHaveBeenNthCalledWith(2, false, root());
    });

    it("closes on Escape and returns focus to the toggle", () => {
        const fab = new FabManager("#fab");
        fab.open();
        action().focus();
        pressEscape(action());
        expect(fab.isOpen).toBe(false);
        expect(document.activeElement).toBe(toggle());
    });

    it("closes after an action unless closeOnAction is false", () => {
        const fab = new FabManager("#fab");
        fab.open();
        click(action());
        expect(fab.isOpen).toBe(false);

        fab.destroy();
        const keep = new FabManager("#fab", { closeOnAction: false });
        keep.open();
        click(action());
        expect(keep.isOpen).toBe(true);
    });

    it("closes on a click outside", () => {
        const fab = new FabManager("#fab");
        fab.open();
        click(document.getElementById("outside") as HTMLElement);
        expect(fab.isOpen).toBe(false);
    });

    it("stops listening after destroy", () => {
        const fab = new FabManager("#fab");
        fab.destroy();
        click(toggle());
        expect(toggle().getAttribute("aria-expanded")).toBe("false");
    });
});
