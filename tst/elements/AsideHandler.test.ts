// ============================================================================
// Stylescape | Aside Handler Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AsideHandler } from "../../src/ts/elements/AsideHandler";
import { click } from "../utils";

describe("AsideHandler", () => {
    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = `
            <button id="menuToggle">Toggle</button>
            <aside id="sideMenu"><nav>links</nav></aside>
        `;
    });

    afterEach(() => localStorage.clear());

    it("starts hidden by default (no active class)", () => {
        new AsideHandler("sideMenu", "menuToggle");
        const menu = document.getElementById("sideMenu") as HTMLElement;
        expect(menu.classList.contains("active")).toBe(false);
    });

    it("showMenu adds the active class to menu and switch and persists state", () => {
        const aside = new AsideHandler("sideMenu", "menuToggle");
        aside.showMenu();

        const menu = document.getElementById("sideMenu") as HTMLElement;
        const toggle = document.getElementById("menuToggle") as HTMLElement;
        expect(menu.classList.contains("active")).toBe(true);
        expect(toggle.classList.contains("active")).toBe(true);
        expect(localStorage.getItem("sideMenu_visibility")).toBe("show");
    });

    it("hideMenu removes the active class and persists the hidden state", () => {
        const aside = new AsideHandler("sideMenu", "menuToggle");
        aside.showMenu();
        aside.hideMenu();

        const menu = document.getElementById("sideMenu") as HTMLElement;
        expect(menu.classList.contains("active")).toBe(false);
        expect(localStorage.getItem("sideMenu_visibility")).toBe("hide");
    });

    it("toggleMenu flips visibility", () => {
        const aside = new AsideHandler("sideMenu", "menuToggle");
        const menu = document.getElementById("sideMenu") as HTMLElement;

        aside.toggleMenu();
        expect(menu.classList.contains("active")).toBe(true);
        aside.toggleMenu();
        expect(menu.classList.contains("active")).toBe(false);
    });

    it("clicking the toggle switch toggles the menu", () => {
        new AsideHandler("sideMenu", "menuToggle");
        const menu = document.getElementById("sideMenu") as HTMLElement;
        const toggle = document.getElementById("menuToggle") as HTMLElement;

        click(toggle);
        expect(menu.classList.contains("active")).toBe(true);
        click(toggle);
        expect(menu.classList.contains("active")).toBe(false);
    });

    it("restores a previously persisted 'show' state on construction", () => {
        localStorage.setItem("sideMenu_visibility", "show");

        new AsideHandler("sideMenu", "menuToggle");
        const menu = document.getElementById("sideMenu") as HTMLElement;
        expect(menu.classList.contains("active")).toBe(true);
    });

    it("does not throw when the menu element is missing", () => {
        expect(() => new AsideHandler("nonexistent", "menuToggle")).not.toThrow();
    });
});
