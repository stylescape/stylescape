// ============================================================================
// Stylescape | Split Pane Manager Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SplitPaneManager } from "../../src/ts/elements/SplitPaneManager";

const fixture = (handleAttrs = "", extra = "") => `
<div class="ss-c-split" id="root">
    <div class="ss-c-split__pane ss-c-split__pane--primary" id="primary">A</div>
    <div class="ss-c-split__gutter">
        <div class="ss-c-split__handle" role="separator" tabindex="0"
             aria-orientation="vertical" aria-controls="primary"
             aria-valuemin="20" aria-valuemax="70" aria-label="Resize"
             ${handleAttrs}></div>
        <button type="button" class="ss-c-split__toggle" aria-label="Collapse"></button>
    </div>
    <div class="ss-c-split__pane" id="secondary">B</div>
</div>
${extra}`;

function rect(left: number, width: number, top = 0, height = 500): DOMRect {
    return {
        left,
        width,
        right: left + width,
        top,
        height,
        bottom: top + height,
        x: left,
        y: top,
        toJSON: () => ({}),
    } as DOMRect;
}

function key(el: HTMLElement, k: string): KeyboardEvent {
    const e = new KeyboardEvent("keydown", {
        key: k,
        bubbles: true,
        cancelable: true,
    });
    el.dispatchEvent(e);
    return e;
}

function pointer(el: HTMLElement, type: string, clientX: number, clientY = 0) {
    const e = new MouseEvent(type, {
        clientX,
        clientY,
        button: 0,
        bubbles: true,
        cancelable: true,
    });
    Object.defineProperty(e, "pointerId", { value: 1 });
    el.dispatchEvent(e);
}

describe("SplitPaneManager", () => {
    let handle: HTMLElement;
    let root: HTMLElement;

    const setup = (handleAttrs = "", extra = "") => {
        document.body.innerHTML = fixture(handleAttrs, extra);
        handle = document.querySelector(".ss-c-split__handle") as HTMLElement;
        root = document.getElementById("root") as HTMLElement;
        root.getBoundingClientRect = () => rect(0, 1000);
        (
            document.getElementById("primary") as HTMLElement
        ).getBoundingClientRect = () => rect(0, 300);
    };

    beforeEach(() => localStorage.clear());
    afterEach(() => localStorage.clear());

    it("applies aria-valuenow as the initial size", () => {
        setup('aria-valuenow="40"');
        const split = new SplitPaneManager(handle);
        expect(split.getSize()).toBe(40);
        expect(root.style.getPropertyValue("--ss-split-size")).toBe("40%");
        expect(handle.getAttribute("aria-valuenow")).toBe("40");
    });

    it("measures the pane when no value is given", () => {
        setup();
        const split = new SplitPaneManager(handle);
        expect(split.getSize()).toBe(30);
    });

    it("clamps to aria-valuemin / aria-valuemax", () => {
        setup('aria-valuenow="40"');
        const split = new SplitPaneManager(handle);
        split.setSize(5);
        expect(split.getSize()).toBe(20);
        split.setSize(95);
        expect(split.getSize()).toBe(70);
    });

    it("moves with arrow keys, Home and End", () => {
        setup('aria-valuenow="40" data-ss-split-step="10"');
        const split = new SplitPaneManager(handle);
        expect(key(handle, "ArrowRight").defaultPrevented).toBe(true);
        expect(split.getSize()).toBe(50);
        key(handle, "ArrowLeft");
        key(handle, "ArrowLeft");
        expect(split.getSize()).toBe(30);
        key(handle, "End");
        expect(handle.getAttribute("aria-valuenow")).toBe("70");
        key(handle, "Home");
        expect(handle.getAttribute("aria-valuenow")).toBe("20");
        // Up/Down do nothing on a vertical separator.
        expect(key(handle, "ArrowUp").defaultPrevented).toBe(false);
    });

    it("reverses arrow direction when the primary pane follows the handle", () => {
        document.body.innerHTML = `
        <div class="ss-c-split" id="root">
            <div class="ss-c-split__pane">A</div>
            <div class="ss-c-split__handle" role="separator" tabindex="0"
                 aria-controls="side" aria-valuenow="30"></div>
            <div class="ss-c-split__pane ss-c-split__pane--primary" id="side">B</div>
        </div>`;
        const h = document.querySelector(".ss-c-split__handle") as HTMLElement;
        const split = new SplitPaneManager(h);
        key(h, "ArrowLeft");
        expect(split.getSize()).toBe(35);
    });

    it("uses Up/Down for a horizontal separator", () => {
        setup('aria-valuenow="40" aria-orientation="horizontal"');
        handle.setAttribute("aria-orientation", "horizontal");
        const split = new SplitPaneManager(handle);
        key(handle, "ArrowDown");
        expect(split.getSize()).toBe(45);
    });

    it("resizes by pointer drag", () => {
        setup('aria-valuenow="30"');
        const onResize = vi.fn();
        const split = new SplitPaneManager(handle, { onResize });
        pointer(handle, "pointerdown", 300);
        expect(handle.classList.contains("is-dragging")).toBe(true);
        pointer(handle, "pointermove", 450);
        expect(split.getSize()).toBe(45);
        expect(onResize).toHaveBeenCalledWith(45);
        pointer(handle, "pointerup", 450);
        expect(handle.classList.contains("is-dragging")).toBe(false);
        pointer(handle, "pointermove", 600);
        expect(split.getSize()).toBe(45);
    });

    it("does not drag from the collapse toggle", () => {
        setup('aria-valuenow="30"');
        new SplitPaneManager(handle);
        const toggle = document.querySelector(
            ".ss-c-split__toggle",
        ) as HTMLElement;
        pointer(toggle, "pointerdown", 300);
        expect(handle.classList.contains("is-dragging")).toBe(false);
    });

    it("collapses and restores with the toggle and Enter", () => {
        setup('aria-valuenow="40"');
        const split = new SplitPaneManager(handle);
        const toggle = document.querySelector(
            ".ss-c-split__toggle",
        ) as HTMLElement;
        const pane = document.getElementById("primary") as HTMLElement;
        expect(toggle.getAttribute("aria-expanded")).toBe("true");

        toggle.click();
        expect(split.isCollapsed()).toBe(true);
        expect(pane.hidden).toBe(true);
        expect(root.dataset.state).toBe("collapsed");
        expect(handle.getAttribute("aria-valuenow")).toBe("0");
        expect(toggle.getAttribute("aria-expanded")).toBe("false");

        key(handle, "Enter");
        expect(split.isCollapsed()).toBe(false);
        expect(pane.hidden).toBe(false);
        expect(root.dataset.state).toBeUndefined();
        expect(handle.getAttribute("aria-valuenow")).toBe("40");
    });

    it("binds external toggles via aria-controls", () => {
        setup(
            'aria-valuenow="40"',
            '<button id="ext" data-ss-split-toggle aria-controls="primary">Panel</button>',
        );
        const split = new SplitPaneManager(handle);
        const ext = document.getElementById("ext") as HTMLElement;
        expect(ext.getAttribute("aria-expanded")).toBe("true");
        ext.click();
        expect(split.isCollapsed()).toBe(true);
        expect(ext.getAttribute("aria-expanded")).toBe("false");
    });

    it("persists size and collapsed state", () => {
        setup('aria-valuenow="40" data-ss-split-key="test-split"');
        const split = new SplitPaneManager(handle);
        split.setSize(55);
        split.collapse();
        split.destroy();

        setup('aria-valuenow="40" data-ss-split-key="test-split"');
        const restored = new SplitPaneManager(handle);
        expect(restored.getSize()).toBe(55);
        expect(restored.isCollapsed()).toBe(true);
    });

    it("survives a throwing localStorage", () => {
        setup('aria-valuenow="40" data-ss-split-key="k"');
        const get = vi
            .spyOn(Storage.prototype, "getItem")
            .mockImplementation(() => {
                throw new Error("denied");
            });
        const set = vi
            .spyOn(Storage.prototype, "setItem")
            .mockImplementation(() => {
                throw new Error("denied");
            });
        const split = new SplitPaneManager(handle);
        expect(() => split.setSize(50)).not.toThrow();
        expect(split.getSize()).toBe(50);
        get.mockRestore();
        set.mockRestore();
    });

    it("writes pixels to a custom property on a custom root", () => {
        document.body.innerHTML = `
        <div class="ss-l-app" id="app" data-ss-split-root>
            <aside class="ss-l-app__sidebar" id="nav">
                <div class="ss-c-split__handle ss-c-split__handle--edge"
                     aria-controls="nav" aria-valuenow="25"
                     data-ss-split-property="--ss-app-sidebar-left-width"
                     data-ss-split-unit="px"></div>
            </aside>
            <main class="ss-l-app__main"></main>
        </div>`;
        const app = document.getElementById("app") as HTMLElement;
        app.getBoundingClientRect = () => rect(0, 1200);
        const h = document.querySelector(".ss-c-split__handle") as HTMLElement;
        const split = new SplitPaneManager(h);
        expect(split.root).toBe(app);
        expect(app.style.getPropertyValue("--ss-app-sidebar-left-width")).toBe(
            "300px",
        );
        expect(h.getAttribute("role")).toBe("separator");
        expect(h.getAttribute("tabindex")).toBe("0");
        key(h, "ArrowRight");
        expect(app.style.getPropertyValue("--ss-app-sidebar-left-width")).toBe(
            "360px",
        );
    });

    it("initAll finds every handle and destroy removes listeners", () => {
        setup('aria-valuenow="40"');
        const [split] = SplitPaneManager.initAll();
        expect(split).toBeInstanceOf(SplitPaneManager);
        split.destroy();
        key(handle, "ArrowRight");
        expect(split.getSize()).toBe(40);
    });

    it("throws without a handle", () => {
        expect(() => new SplitPaneManager("#missing")).toThrow();
    });
});
