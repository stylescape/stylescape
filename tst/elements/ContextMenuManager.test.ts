// ============================================================================
// Stylescape | Context Menu Manager — Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContextMenuManager } from "../../src/ts/elements/ContextMenuManager";

function menu(): HTMLElement {
    return document.getElementById("menu") as HTMLElement;
}
function target(): HTMLElement {
    return document.getElementById("target") as HTMLElement;
}
function items(): HTMLElement[] {
    return Array.from(
        menu().querySelectorAll<HTMLElement>(".ss-c-context-menu__item"),
    );
}
function key(
    el: Element,
    k: string,
    init: KeyboardEventInit = {},
): KeyboardEvent {
    const event = new KeyboardEvent("keydown", {
        key: k,
        bubbles: true,
        cancelable: true,
        ...init,
    });
    el.dispatchEvent(event);
    return event;
}
function rightClick(x: number, y: number): MouseEvent {
    const event = new MouseEvent("contextmenu", {
        clientX: x,
        clientY: y,
        bubbles: true,
        cancelable: true,
    });
    target().dispatchEvent(event);
    return event;
}
function sizeMenu(width: number, height: number): void {
    vi.spyOn(menu(), "getBoundingClientRect").mockReturnValue({
        width,
        height,
        top: 0,
        left: 0,
        right: width,
        bottom: height,
        x: 0,
        y: 0,
        toJSON: () => ({}),
    } as DOMRect);
}

describe("ContextMenuManager", () => {
    let manager: ContextMenuManager | null = null;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="target" tabindex="0">Canvas</div>
            <div id="menu" class="ss-c-context-menu" aria-label="Actions">
                <button class="ss-c-context-menu__item" type="button" data-action="copy">Copy</button>
                <button class="ss-c-context-menu__item" type="button" aria-disabled="true">Cut</button>
                <div class="ss-c-context-menu__separator" role="separator"></div>
                <button class="ss-c-context-menu__item" type="button" data-action="paste">Paste</button>
                <button class="ss-c-context-menu__item" type="button" role="menuitemcheckbox" aria-checked="false">Snap</button>
            </div>`;
        Object.defineProperty(window, "innerWidth", {
            value: 800,
            configurable: true,
        });
        Object.defineProperty(window, "innerHeight", {
            value: 600,
            configurable: true,
        });
    });

    afterEach(() => {
        manager?.destroy();
        manager = null;
    });

    it("warns when the menu or target is missing", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        new ContextMenuManager("#missing", { target: "#target" });
        expect(warn).toHaveBeenCalled();
    });

    it("sets menu roles and starts hidden", () => {
        manager = new ContextMenuManager("#menu", { target: "#target" });
        expect(menu().getAttribute("role")).toBe("menu");
        expect(menu().hidden).toBe(true);
        expect(items()[0].getAttribute("role")).toBe("menuitem");
        expect(items()[3].getAttribute("role")).toBe("menuitemcheckbox");
        expect(items().every((item) => item.tabIndex === -1)).toBe(true);
    });

    it("reads the target from data-ss-context-menu-target", () => {
        menu().dataset.ssContextMenuTarget = "#target";
        manager = new ContextMenuManager(menu());
        rightClick(10, 10);
        expect(manager.isOpen).toBe(true);
    });

    it("opens at the pointer on contextmenu and prevents the native menu", () => {
        manager = new ContextMenuManager("#menu", { target: "#target" });
        sizeMenu(200, 150);
        const event = rightClick(120, 80);
        expect(event.defaultPrevented).toBe(true);
        expect(menu().hidden).toBe(false);
        expect(menu().style.left).toBe("120px");
        expect(menu().style.top).toBe("80px");
        expect(document.activeElement).toBe(items()[0]);
    });

    it("keeps the menu inside the viewport", () => {
        manager = new ContextMenuManager("#menu", { target: "#target" });
        sizeMenu(200, 150);
        rightClick(790, 590);
        // Flipped above the pointer, and clamped from the right edge.
        expect(menu().style.left).toBe(`${800 - 200 - 8}px`);
        expect(menu().style.top).toBe(`${590 - 150}px`);
    });

    it.each([
        ["Shift+F10", { key: "F10", shiftKey: true }],
        ["ContextMenu key", { key: "ContextMenu" }],
    ])("opens from the keyboard with %s", (_label, init) => {
        manager = new ContextMenuManager("#menu", { target: "#target" });
        target().focus();
        const event = key(target(), init.key, init);
        expect(event.defaultPrevented).toBe(true);
        expect(manager.isOpen).toBe(true);
        expect(document.activeElement).toBe(items()[0]);
    });

    it("moves through enabled items with the arrow keys, Home and End", () => {
        manager = new ContextMenuManager("#menu", { target: "#target" });
        rightClick(10, 10);
        const [copy, , paste, snap] = items();
        key(menu(), "ArrowDown");
        expect(document.activeElement).toBe(paste); // skips disabled "Cut"
        key(menu(), "ArrowDown");
        expect(document.activeElement).toBe(snap);
        key(menu(), "ArrowDown");
        expect(document.activeElement).toBe(copy); // wraps
        key(menu(), "ArrowUp");
        expect(document.activeElement).toBe(snap);
        key(menu(), "Home");
        expect(document.activeElement).toBe(copy);
        key(menu(), "End");
        expect(document.activeElement).toBe(snap);
    });

    it("focuses an item by typing its first letter", () => {
        manager = new ContextMenuManager("#menu", { target: "#target" });
        rightClick(10, 10);
        key(menu(), "p");
        expect(document.activeElement).toBe(items()[2]);
    });

    it("closes on Escape and returns focus to the trigger", () => {
        const onClose = vi.fn();
        manager = new ContextMenuManager("#menu", {
            target: "#target",
            onClose,
        });
        target().focus();
        key(target(), "F10", { shiftKey: true });
        key(menu(), "Escape");
        expect(manager.isOpen).toBe(false);
        expect(document.activeElement).toBe(target());
        expect(onClose).toHaveBeenCalledOnce();
    });

    it("selects an item, fires the callback and the event, then closes", () => {
        const onSelect = vi.fn();
        const listener = vi.fn();
        manager = new ContextMenuManager("#menu", {
            target: "#target",
            onSelect,
        });
        menu().addEventListener("ss:context-menu:select", listener);
        rightClick(10, 10);
        items()[2].click();
        expect(onSelect).toHaveBeenCalledWith(items()[2], menu());
        expect(listener.mock.calls[0][0].detail.item).toBe(items()[2]);
        expect(manager.isOpen).toBe(false);
    });

    it("ignores disabled items and toggles checkbox items", () => {
        const onSelect = vi.fn();
        manager = new ContextMenuManager("#menu", {
            target: "#target",
            onSelect,
        });
        rightClick(10, 10);
        items()[1].click();
        expect(onSelect).not.toHaveBeenCalled();
        expect(manager.isOpen).toBe(true);
        items()[3].click();
        expect(items()[3].getAttribute("aria-checked")).toBe("true");
    });

    it("closes on a pointer down outside the menu", () => {
        manager = new ContextMenuManager("#menu", { target: "#target" });
        rightClick(10, 10);
        document.body.dispatchEvent(
            new Event("pointerdown", { bubbles: true }),
        );
        expect(manager.isOpen).toBe(false);
    });

    it("closes on resize", () => {
        manager = new ContextMenuManager("#menu", { target: "#target" });
        rightClick(10, 10);
        window.dispatchEvent(new Event("resize"));
        expect(manager.isOpen).toBe(false);
    });

    it("removes its listeners on destroy", () => {
        manager = new ContextMenuManager("#menu", { target: "#target" });
        manager.destroy();
        const event = rightClick(10, 10);
        expect(event.defaultPrevented).toBe(false);
        expect(menu().hidden).toBe(true);
    });
});
