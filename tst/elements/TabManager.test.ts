// ============================================================================
// Stylescape | TabManager Tests
// ============================================================================

import { afterEach, describe, expect, it, vi } from "vitest";
import { TabManager } from "../../src/ts/elements/TabManager";

function mount(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.querySelector<HTMLElement>(".ss-c-tab")!;
}

const ARIA = `
<div class="ss-c-tab">
  <div class="ss-c-tab__list" aria-label="Cities">
    <button class="ss-c-tab__item" role="tab" aria-controls="p1">One</button>
    <button class="ss-c-tab__item" role="tab" aria-controls="p2">Two</button>
    <button class="ss-c-tab__item" role="tab" aria-controls="p3">Three</button>
  </div>
  <div class="ss-c-tab__panel" id="p1">A</div>
  <div class="ss-c-tab__panel" id="p2">B</div>
  <div class="ss-c-tab__panel" id="p3">C</div>
</div>`;

const DATA = `
<div class="ss-c-tab">
  <div class="ss-c-tab__list">
    <button class="ss-c-tab__item" data-ss-tab="a">A</button>
    <button class="ss-c-tab__item ss-c-tab__item--active" data-ss-tab="b">B</button>
  </div>
  <div class="ss-c-tab__panel" data-ss-tab-panel="a">A</div>
  <div class="ss-c-tab__panel" data-ss-tab-panel="b">B</div>
</div>`;

const panels = () =>
    Array.from(document.querySelectorAll<HTMLElement>(".ss-c-tab__panel"));
const tabs = () =>
    Array.from(document.querySelectorAll<HTMLElement>(".ss-c-tab__item"));

describe("TabManager", () => {
    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("selects the first tab and hides the other panels", () => {
        new TabManager(mount(ARIA));
        expect(tabs().map((t) => t.getAttribute("aria-selected"))).toEqual([
            "true",
            "false",
            "false",
        ]);
        expect(panels().map((p) => p.hidden)).toEqual([false, true, true]);
        expect(tabs()[0].classList.contains("ss-c-tab__item--active")).toBe(
            true,
        );
    });

    it("fills in roles, ids and the ARIA links", () => {
        new TabManager(mount(DATA));
        const [tab] = tabs();
        const [panel] = panels();
        expect(tab.parentElement!.getAttribute("role")).toBe("tablist");
        expect(tab.getAttribute("role")).toBe("tab");
        expect(panel.getAttribute("role")).toBe("tabpanel");
        expect(tab.getAttribute("aria-controls")).toBe(panel.id);
        expect(panel.getAttribute("aria-labelledby")).toBe(tab.id);
    });

    it("starts on the tab marked active", () => {
        new TabManager(mount(DATA));
        expect(panels().map((p) => p.hidden)).toEqual([true, false]);
    });

    it("honours the initial option", () => {
        new TabManager(mount(ARIA), { initial: "p3" });
        expect(panels()[2].hidden).toBe(false);
    });

    it("switches on click and dispatches ss:tab-change", () => {
        const root = mount(ARIA);
        const spy = vi.fn();
        root.addEventListener("ss:tab-change", spy);
        new TabManager(root);
        tabs()[1].click();
        expect(panels().map((p) => p.hidden)).toEqual([true, false, true]);
        expect(spy).toHaveBeenCalledOnce();
        expect(spy.mock.calls[0][0].detail.panel.id).toBe("p2");
    });

    it("uses roving tabindex", () => {
        new TabManager(mount(ARIA));
        expect(tabs().map((t) => t.tabIndex)).toEqual([0, -1, -1]);
    });

    it("moves with arrow keys, wrapping, and Home/End", () => {
        new TabManager(mount(ARIA));
        const key = (k: string) =>
            document.activeElement!.dispatchEvent(
                new KeyboardEvent("keydown", { key: k, bubbles: true }),
            );
        tabs()[0].focus();
        key("ArrowLeft");
        expect(document.activeElement).toBe(tabs()[2]);
        key("ArrowRight");
        expect(document.activeElement).toBe(tabs()[0]);
        key("End");
        expect(panels()[2].hidden).toBe(false);
        key("Home");
        expect(panels()[0].hidden).toBe(false);
    });

    it("uses up/down keys when vertical", () => {
        new TabManager(mount(ARIA), { orientation: "vertical" });
        tabs()[0].focus();
        tabs()[0].dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
        );
        expect(document.activeElement).toBe(tabs()[1]);
        expect(tabs()[0].parentElement!.getAttribute("aria-orientation")).toBe(
            "vertical",
        );
    });

    it("ignores clicks outside its tabs and stops after destroy", () => {
        const root = mount(ARIA);
        const manager = new TabManager(root);
        panels()[0].click();
        expect(manager.selected).toBe(tabs()[0]);
        manager.destroy();
        tabs()[2].click();
        expect(manager.selected).toBe(tabs()[0]);
    });

    it("selects by key and ignores unknown keys", () => {
        const manager = new TabManager(mount(DATA));
        manager.select("a");
        expect(panels()[0].hidden).toBe(false);
        manager.select("nope");
        expect(panels()[0].hidden).toBe(false);
    });

    it("throws without a root and binds all with initAll", () => {
        expect(() => new TabManager("#missing")).toThrow();
        document.body.innerHTML = ARIA.replace(
            'class="ss-c-tab"',
            'class="ss-c-tab" data-ss="tabs"',
        );
        expect(TabManager.initAll()).toHaveLength(1);
    });
});
