// ============================================================================
// Stylescape | DropdownManager Tests
// ============================================================================

import { afterEach, describe, expect, it } from "vitest";
import { DropdownManager } from "../../src/ts/elements/DropdownManager";

const MENU = `
<div class="ss-c-dropdown" id="dd">
  <button type="button" aria-haspopup="true">Sort</button>
  <ul class="ss-c-dropdown__menu">
    <li><a class="ss-c-dropdown__item" href="#a">A</a></li>
    <li><a class="ss-c-dropdown__item" href="#b">B</a></li>
    <li><button class="ss-c-dropdown__item" type="button" disabled>C</button></li>
  </ul>
</div>
<p id="outside">Outside</p>`;

const DETAILS = `
<details class="ss-c-dropdown" id="dd">
  <summary>Menu</summary>
  <ul class="ss-c-dropdown__menu"><li><a href="#a">A</a></li></ul>
</details>
<p id="outside">Outside</p>`;

const root = () => document.getElementById("dd")!;
const trigger = () => root().querySelector<HTMLElement>("button, summary")!;
const items = () => Array.from(root().querySelectorAll<HTMLElement>("a"));
const key = (el: Element, k: string) =>
    el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));

describe("DropdownManager", () => {
    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("links the trigger to the menu and starts closed", () => {
        document.body.innerHTML = MENU;
        new DropdownManager(root());
        const menu = root().querySelector(".ss-c-dropdown__menu")!;
        expect(trigger().getAttribute("aria-controls")).toBe(menu.id);
        expect(trigger().getAttribute("aria-expanded")).toBe("false");
    });

    it("toggles on trigger click", () => {
        document.body.innerHTML = MENU;
        const dd = new DropdownManager(root());
        trigger().click();
        expect(dd.isOpen).toBe(true);
        expect(root().classList.contains("is-open")).toBe(true);
        expect(trigger().getAttribute("aria-expanded")).toBe("true");
        trigger().click();
        expect(dd.isOpen).toBe(false);
    });

    it("closes on a click outside, not inside", () => {
        document.body.innerHTML = MENU;
        const dd = new DropdownManager(root());
        dd.open();
        items()[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(dd.isOpen).toBe(true);
        document.getElementById("outside")!.click();
        expect(dd.isOpen).toBe(false);
    });

    it("closes on Escape and returns focus to the trigger", () => {
        document.body.innerHTML = MENU;
        const dd = new DropdownManager(root());
        dd.open();
        items()[1].focus();
        key(items()[1], "Escape");
        expect(dd.isOpen).toBe(false);
        expect(document.activeElement).toBe(trigger());
    });

    it("moves through enabled items with arrows, Home and End", () => {
        document.body.innerHTML = MENU;
        const dd = new DropdownManager(root());
        trigger().focus();
        key(trigger(), "ArrowDown");
        expect(dd.isOpen).toBe(true);
        expect(document.activeElement).toBe(items()[0]);
        key(items()[0], "ArrowDown");
        expect(document.activeElement).toBe(items()[1]);
        key(items()[1], "ArrowDown");
        expect(document.activeElement).toBe(items()[0]);
        key(items()[0], "ArrowUp");
        expect(document.activeElement).toBe(items()[1]);
        key(items()[1], "Home");
        expect(document.activeElement).toBe(items()[0]);
        key(items()[0], "End");
        expect(document.activeElement).toBe(items()[1]);
    });

    it("ArrowUp from the trigger opens on the last item", () => {
        document.body.innerHTML = MENU;
        new DropdownManager(root());
        key(trigger(), "ArrowUp");
        expect(document.activeElement).toBe(items()[1]);
    });

    it("handles a native details dropdown", () => {
        document.body.innerHTML = DETAILS;
        const dd = new DropdownManager(root());
        (root() as HTMLDetailsElement).open = true;
        expect(dd.isOpen).toBe(true);
        key(root(), "ArrowDown");
        document.getElementById("outside")!.click();
        expect(dd.isOpen).toBe(false);
        dd.open();
        key(root(), "Escape");
        expect(dd.isOpen).toBe(false);
        expect(document.activeElement).toBe(trigger());
    });

    it("stops listening after destroy and binds all with initAll", () => {
        document.body.innerHTML = MENU;
        const dd = new DropdownManager(root());
        dd.destroy();
        trigger().click();
        expect(dd.isOpen).toBe(false);
        expect(() => new DropdownManager("#missing")).toThrow();
        root().setAttribute("data-ss", "dropdown-menu");
        expect(DropdownManager.initAll()).toHaveLength(1);
    });
});
