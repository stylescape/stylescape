// ============================================================================
// Stylescape | Aside Handler Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AsideHandler } from "../../src/ts/elements/AsideHandler";
import { componentRegistry } from "../../src/ts/init/registry";
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

    it("mirrors visibility in the switch's aria-expanded", () => {
        const aside = new AsideHandler("sideMenu", "menuToggle");
        const toggle = document.getElementById("menuToggle") as HTMLElement;
        expect(toggle.getAttribute("aria-expanded")).toBe("false");

        aside.showMenu();
        expect(toggle.getAttribute("aria-expanded")).toBe("true");

        aside.hideMenu();
        expect(toggle.getAttribute("aria-expanded")).toBe("false");
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

    describe("options", () => {
        it("initialState 'show' opens the menu on a first visit without storing it", () => {
            new AsideHandler("sideMenu", "menuToggle", {
                initialState: "show",
            });
            const menu = document.getElementById("sideMenu") as HTMLElement;
            const toggle = document.getElementById(
                "menuToggle",
            ) as HTMLElement;
            expect(menu.classList.contains("active")).toBe(true);
            expect(toggle.getAttribute("aria-expanded")).toBe("true");
            expect(localStorage.getItem("sideMenu_visibility")).toBeNull();
        });

        it("a stored state beats initialState when persisting", () => {
            localStorage.setItem("sideMenu_visibility", "hide");
            new AsideHandler("sideMenu", "menuToggle", {
                initialState: "show",
            });
            const menu = document.getElementById("sideMenu") as HTMLElement;
            expect(menu.classList.contains("active")).toBe(false);
        });

        it("persist false ignores stored state and writes none", () => {
            localStorage.setItem("sideMenu_visibility", "show");
            const aside = new AsideHandler("sideMenu", "menuToggle", {
                persist: false,
            });
            const menu = document.getElementById("sideMenu") as HTMLElement;
            expect(menu.classList.contains("active")).toBe(false);

            aside.showMenu();
            expect(menu.classList.contains("active")).toBe(true);
            aside.toggleMenu();
            expect(menu.classList.contains("active")).toBe(false);
            expect(localStorage.getItem("sideMenu_visibility")).toBe("show");
        });

        it("persist false with initialState 'show' starts open every time", () => {
            const aside = new AsideHandler("sideMenu", "menuToggle", {
                persist: false,
                initialState: "show",
            });
            const menu = document.getElementById("sideMenu") as HTMLElement;
            expect(menu.classList.contains("active")).toBe(true);
            aside.hideMenu();
            expect(menu.classList.contains("active")).toBe(false);

            new AsideHandler("sideMenu", "menuToggle", {
                persist: false,
                initialState: "show",
            });
            expect(menu.classList.contains("active")).toBe(true);
        });

        it("fires onOpen and onClose on changes only", () => {
            const opened: HTMLElement[] = [];
            const closed: HTMLElement[] = [];
            const aside = new AsideHandler("sideMenu", "menuToggle", {
                onOpen: (menu) => opened.push(menu),
                onClose: (menu) => closed.push(menu),
            });
            const menu = document.getElementById("sideMenu") as HTMLElement;
            expect(opened).toEqual([]);
            expect(closed).toEqual([]);

            aside.showMenu();
            aside.showMenu();
            expect(opened).toEqual([menu]);
            aside.hideMenu();
            expect(closed).toEqual([menu]);
        });

        it("visibleClass replaces the default active class", () => {
            const aside = new AsideHandler("sideMenu", "menuToggle", {
                visibleClass: "is-open",
            });
            const menu = document.getElementById("sideMenu") as HTMLElement;
            aside.showMenu();
            expect(menu.classList.contains("is-open")).toBe(true);
            expect(menu.classList.contains("active")).toBe(false);
            aside.toggleMenu();
            expect(menu.classList.contains("is-open")).toBe(false);
        });
    });

    describe("data-ss='aside' registry handler", () => {
        const handler = () => componentRegistry.get("aside")!.handler;

        it("reads initial state and persistence from data attributes", () => {
            localStorage.setItem("sideMenu_visibility", "hide");
            document.body.innerHTML = `
                <button id="menuToggle">Toggle</button>
                <aside id="sideMenu" data-ss="aside"
                    data-ss-aside-switch="menuToggle"
                    data-ss-aside-initial-state="show"
                    data-ss-aside-persist="false"><nav>links</nav></aside>
            `;
            const el = document.getElementById("sideMenu") as HTMLElement;
            const aside = handler()(el, {}) as AsideHandler;
            expect(aside.options.persist).toBe(false);
            expect(el.classList.contains("active")).toBe(true);

            aside.hideMenu();
            expect(localStorage.getItem("sideMenu_visibility")).toBe("hide");
        });

        it("takes parsed config over data attributes and defaults to hidden and persisting", () => {
            document.body.innerHTML = `
                <button id="menuToggle">Toggle</button>
                <aside id="sideMenu" data-ss="aside"
                    data-ss-aside-switch="menuToggle"><nav>links</nav></aside>
            `;
            const el = document.getElementById("sideMenu") as HTMLElement;
            const plain = handler()(el, {}) as AsideHandler;
            expect(plain.options.persist).toBe(true);
            expect(el.classList.contains("active")).toBe(false);

            const configured = handler()(el, {
                initialState: "show",
                persist: false,
            }) as AsideHandler;
            expect(configured.options.persist).toBe(false);
            expect(el.classList.contains("active")).toBe(true);
        });
    });
});
