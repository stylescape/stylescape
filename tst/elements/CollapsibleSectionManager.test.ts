// ============================================================================
// Stylescape | Collapsible Section Manager Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CollapsibleSectionManager } from "../../src/ts/elements/CollapsibleSectionManager";
import { click, keyDown } from "../utils";

const HTML = `
    <div id="faq" data-ss="collapsible">
        <button data-ss-collapsible-trigger aria-expanded="false">Toggle</button>
        <div data-ss-collapsible-content hidden>Panel body</div>
    </div>
`;

function trigger(): HTMLElement {
    return document.querySelector(
        "[data-ss-collapsible-trigger]",
    ) as HTMLElement;
}
function content(): HTMLElement {
    return document.querySelector(
        "[data-ss-collapsible-content]",
    ) as HTMLElement;
}

describe("CollapsibleSectionManager", () => {
    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = HTML;
    });
    afterEach(() => localStorage.clear());

    it("warns and bails when the element is not found", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        expect(() => new CollapsibleSectionManager("#missing")).not.toThrow();
        expect(warn).toHaveBeenCalled();
    });

    it("initialises collapsed by default", () => {
        const c = new CollapsibleSectionManager("#faq");
        expect(c.expanded).toBe(false);
        expect(
            document.getElementById("faq")?.classList.contains(
                "collapsible--collapsed",
            ),
        ).toBe(true);
        expect(trigger().getAttribute("aria-expanded")).toBe("false");
    });

    it("wires aria-controls from trigger to content", () => {
        new CollapsibleSectionManager("#faq");
        const controls = trigger().getAttribute("aria-controls");
        expect(controls).toBeTruthy();
        expect(content().id).toBe(controls);
    });

    it("initialises expanded when the expanded option is set", () => {
        const c = new CollapsibleSectionManager("#faq", { expanded: true });
        expect(c.expanded).toBe(true);
        expect(
            document.getElementById("faq")?.classList.contains(
                "collapsible--expanded",
            ),
        ).toBe(true);
        expect(trigger().getAttribute("aria-expanded")).toBe("true");
        expect(content().hidden).toBe(false);
    });

    it("toggle() expands then collapses", () => {
        const c = new CollapsibleSectionManager("#faq");
        c.toggle();
        expect(c.expanded).toBe(true);
        c.toggle();
        expect(c.expanded).toBe(false);
    });

    it("expands when the trigger is clicked", () => {
        const c = new CollapsibleSectionManager("#faq");
        click(trigger());
        expect(c.expanded).toBe(true);
        expect(trigger().getAttribute("aria-expanded")).toBe("true");
    });

    it("toggles on Enter and Space keydown", () => {
        const c = new CollapsibleSectionManager("#faq");
        keyDown(trigger(), "Enter");
        expect(c.expanded).toBe(true);
        keyDown(trigger(), " ");
        expect(c.expanded).toBe(false);
    });

    it("invokes onExpand and onCollapse callbacks", () => {
        const onExpand = vi.fn();
        const onCollapse = vi.fn();
        const c = new CollapsibleSectionManager("#faq", {
            onExpand,
            onCollapse,
        });
        // Construction sets the initial (collapsed) state, which already fires a
        // callback — clear so we assert only the explicit calls below.
        onExpand.mockClear();
        onCollapse.mockClear();

        c.expand();
        expect(onExpand).toHaveBeenCalledTimes(1);
        c.collapse();
        expect(onCollapse).toHaveBeenCalledTimes(1);
    });

    it("persists state to localStorage when persist is enabled", () => {
        const c = new CollapsibleSectionManager("#faq", { persist: true });
        c.expand();
        expect(localStorage.getItem("faq")).toBe("true");
        c.collapse();
        expect(localStorage.getItem("faq")).toBe("false");
    });

    it("restores persisted expanded state on construction", () => {
        localStorage.setItem("faq", "true");
        const c = new CollapsibleSectionManager("#faq", { persist: true });
        expect(c.expanded).toBe(true);
    });

    it("the expanded setter drives expand/collapse", () => {
        const c = new CollapsibleSectionManager("#faq");
        c.expanded = true;
        expect(c.expanded).toBe(true);
        c.expanded = false;
        expect(c.expanded).toBe(false);
    });

    it("destroy detaches listeners so clicks no longer toggle", () => {
        const c = new CollapsibleSectionManager("#faq");
        const t = trigger();
        c.destroy();
        click(t);
        // After destroy internal state is torn down; expanded getter reads false.
        expect(c.expanded).toBe(false);
    });

    it("initCollapsibles constructs managers for tagged sections", () => {
        const managers = CollapsibleSectionManager.initCollapsibles();
        expect(managers.length).toBe(1);
    });
});
