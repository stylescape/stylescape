// ============================================================================
// Stylescape | Sheet Manager Tests
// ============================================================================

import { describe, expect, it, vi } from "vitest";
import { SheetManager } from "../../src/ts/elements/SheetManager";

const sheetFixture = (cls = "", state = 'data-state="closed"') => `
<button type="button" id="ext" data-ss-sheet-toggle aria-controls="layers">Layers</button>
<section class="ss-c-sheet ${cls}" id="layers" ${state} aria-label="Layers">
    <button type="button" class="ss-c-sheet__handle">Layers</button>
    <div class="ss-c-sheet__body"><a href="#" id="link">Item</a></div>
</section>`;

function key(el: HTMLElement, k: string): KeyboardEvent {
    const e = new KeyboardEvent("keydown", {
        key: k,
        bubbles: true,
        cancelable: true,
    });
    el.dispatchEvent(e);
    return e;
}

describe("SheetManager", () => {
    const setup = (cls = "", state?: string) => {
        document.body.innerHTML = sheetFixture(cls, state);
        const panel = document.getElementById("layers") as HTMLElement;
        const handle = panel.querySelector(
            ".ss-c-sheet__handle",
        ) as HTMLElement;
        const ext = document.getElementById("ext") as HTMLElement;
        return { panel, handle, ext };
    };

    it("syncs aria-expanded and aria-controls on all toggles", () => {
        const { panel, handle, ext } = setup();
        new SheetManager(panel);
        expect(handle.getAttribute("aria-controls")).toBe("layers");
        expect(handle.getAttribute("aria-expanded")).toBe("false");
        expect(ext.getAttribute("aria-expanded")).toBe("false");
    });

    it("treats a sheet without data-state as closed", () => {
        const { panel } = setup("", "");
        expect(new SheetManager(panel).isOpen()).toBe(false);
    });

    it("toggles on handle and external clicks", () => {
        const { panel, handle, ext } = setup();
        const onChange = vi.fn();
        new SheetManager(panel, { onChange });
        handle.click();
        expect(panel.dataset.state).toBe("open");
        expect(ext.getAttribute("aria-expanded")).toBe("true");
        expect(onChange).toHaveBeenCalledWith(true, panel);
        ext.click();
        expect(panel.dataset.state).toBe("closed");
        expect(handle.getAttribute("aria-expanded")).toBe("false");
    });

    it("dispatches ss:sheet-toggle", () => {
        const { panel } = setup();
        const listener = vi.fn();
        panel.addEventListener("ss:sheet-toggle", listener);
        new SheetManager(panel).open();
        expect(listener).toHaveBeenCalledTimes(1);
        expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({
            open: true,
        });
    });

    it("opens and closes a bottom sheet with ArrowUp / ArrowDown", () => {
        const { panel, handle } = setup();
        new SheetManager(panel);
        expect(key(handle, "ArrowUp").defaultPrevented).toBe(true);
        expect(panel.dataset.state).toBe("open");
        key(handle, "ArrowDown");
        expect(panel.dataset.state).toBe("closed");
        expect(key(handle, "ArrowLeft").defaultPrevented).toBe(false);
    });

    it("uses the edge direction for side sheets", () => {
        const { panel, handle } = setup("ss-c-sheet--left");
        new SheetManager(panel);
        key(handle, "ArrowRight");
        expect(panel.dataset.state).toBe("open");
        key(handle, "ArrowLeft");
        expect(panel.dataset.state).toBe("closed");

        const right = setup("ss-c-sheet--right");
        new SheetManager(right.panel);
        key(right.handle, "ArrowLeft");
        expect(right.panel.dataset.state).toBe("open");
    });

    it("closes on Escape and returns focus to the opener", () => {
        const { panel, ext } = setup();
        new SheetManager(panel);
        ext.click();
        const link = document.getElementById("link") as HTMLElement;
        link.focus();
        expect(key(link, "Escape").defaultPrevented).toBe(true);
        expect(panel.dataset.state).toBe("closed");
        expect(document.activeElement).toBe(ext);
    });

    it("drives an app-shell sidebar and leaves Escape alone when it is in flow", () => {
        document.body.innerHTML = `
            <button data-ss-sheet-toggle aria-controls="nav" id="btn">Menu</button>
            <aside class="ss-l-app__sidebar" id="nav"><a href="#" id="a">x</a></aside>`;
        const [manager] = SheetManager.initAll();
        const nav = document.getElementById("nav") as HTMLElement;
        const btn = document.getElementById("btn") as HTMLElement;
        expect(manager.panel).toBe(nav);
        // No stylesheet: the sidebar is displayed, so it starts open.
        expect(btn.getAttribute("aria-expanded")).toBe("true");
        btn.click();
        expect(nav.dataset.state).toBe("closed");
        btn.click();
        expect(nav.dataset.state).toBe("open");
        key(document.getElementById("a") as HTMLElement, "Escape");
        expect(nav.dataset.state).toBe("open");
    });

    it("initAll finds sheets once and destroy unbinds", () => {
        const { panel, handle } = setup();
        const managers = SheetManager.initAll();
        expect(managers).toHaveLength(1);
        managers[0].destroy();
        handle.click();
        expect(panel.dataset.state).toBe("closed");
    });

    it("throws without a panel", () => {
        expect(() => new SheetManager("#missing")).toThrow();
    });
});
