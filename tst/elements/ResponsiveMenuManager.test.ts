// ============================================================================
// Stylescape | Responsive Menu Manager Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ResponsiveMenuManager } from "../../src/ts/elements/ResponsiveMenuManager";
import { click, keyDown } from "../utils";

const HTML = `
    <nav>
        <button id="menuToggle" aria-expanded="false">Menu</button>
        <ul id="mainNav" data-ss-menu-content hidden>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
        </ul>
    </nav>
    <div id="outside">outside</div>
`;

function setWidth(px: number): void {
    Object.defineProperty(window, "innerWidth", {
        value: px,
        writable: true,
        configurable: true,
    });
}

describe("ResponsiveMenuManager", () => {
    beforeEach(() => {
        setWidth(1024);
        document.body.innerHTML = HTML;
    });
    afterEach(() => {
        setWidth(1024);
        document.body.style.overflow = "";
    });

    it("warns when the menu element is missing", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        new ResponsiveMenuManager("#nope", "#menuToggle");
        expect(warn).toHaveBeenCalled();
    });

    it("warns when the toggle element is missing", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        new ResponsiveMenuManager("#mainNav", "#nope");
        expect(warn).toHaveBeenCalled();
    });

    it("sets up ARIA wiring on init", () => {
        new ResponsiveMenuManager("#mainNav", "#menuToggle");
        const toggle = document.getElementById("menuToggle") as HTMLElement;
        expect(toggle.getAttribute("aria-controls")).toBe("mainNav");
        expect(toggle.getAttribute("aria-expanded")).toBe("false");
        expect(
            document.getElementById("mainNav")?.getAttribute("role"),
        ).toBe("navigation");
    });

    it("opens and closes when the toggle is clicked", () => {
        const menu = new ResponsiveMenuManager("#mainNav", "#menuToggle");
        const toggle = document.getElementById("menuToggle") as HTMLElement;

        click(toggle);
        expect(menu.expanded).toBe(true);
        expect(toggle.getAttribute("aria-expanded")).toBe("true");
        expect(
            document.getElementById("mainNav")?.classList.contains(
                "nav--expanded",
            ),
        ).toBe(true);

        click(toggle);
        expect(menu.expanded).toBe(false);
        expect(toggle.getAttribute("aria-expanded")).toBe("false");
    });

    it("open/close/toggleMenu public methods work", () => {
        const menu = new ResponsiveMenuManager("#mainNav", "#menuToggle");
        menu.open();
        expect(menu.expanded).toBe(true);
        menu.close();
        expect(menu.expanded).toBe(false);
        menu.toggleMenu();
        expect(menu.expanded).toBe(true);
    });

    it("fires onOpen and onClose callbacks", () => {
        const onOpen = vi.fn();
        const onClose = vi.fn();
        const menu = new ResponsiveMenuManager("#mainNav", "#menuToggle", {
            onOpen,
            onClose,
        });
        menu.open();
        menu.close();
        expect(onOpen).toHaveBeenCalledTimes(1);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("closes on Escape when expanded", () => {
        const menu = new ResponsiveMenuManager("#mainNav", "#menuToggle");
        menu.open();
        keyDown(document.body, "Escape");
        expect(menu.expanded).toBe(false);
    });

    it("detects mobile view below the breakpoint and hides the menu", () => {
        setWidth(500);
        const menu = new ResponsiveMenuManager("#mainNav", "#menuToggle", {
            breakpoint: 768,
        });
        expect(menu.mobile).toBe(true);
        const nav = document.querySelector("nav") as HTMLElement;
        expect(nav.classList.contains("nav--mobile")).toBe(true);
        expect(document.getElementById("mainNav")?.hidden).toBe(true);
    });

    it("closes on link click in mobile view", () => {
        setWidth(500);
        const menu = new ResponsiveMenuManager("#mainNav", "#menuToggle", {
            breakpoint: 768,
        });
        menu.open();
        expect(menu.expanded).toBe(true);
        click(document.querySelector("#mainNav a") as HTMLElement);
        expect(menu.expanded).toBe(false);
    });

    it("closes on outside click in mobile view", () => {
        setWidth(500);
        const menu = new ResponsiveMenuManager("#mainNav", "#menuToggle", {
            breakpoint: 768,
        });
        menu.open();
        click(document.getElementById("outside") as HTMLElement);
        expect(menu.expanded).toBe(false);
    });

    it("closes an expanded menu when resizing back to desktop", () => {
        setWidth(500);
        const menu = new ResponsiveMenuManager("#mainNav", "#menuToggle", {
            breakpoint: 768,
        });
        menu.open();
        expect(menu.expanded).toBe(true);

        setWidth(1024);
        window.dispatchEvent(new Event("resize"));
        expect(menu.expanded).toBe(false);
    });

    it("destroy detaches listeners so the toggle no longer opens", () => {
        const menu = new ResponsiveMenuManager("#mainNav", "#menuToggle");
        const toggle = document.getElementById("menuToggle") as HTMLElement;
        menu.destroy();
        click(toggle);
        expect(menu.expanded).toBe(false);
    });

    it("initMenus builds managers for tagged navs", () => {
        document.body.innerHTML = `
            <nav data-ss="responsive-menu" data-ss-menu-breakpoint="600">
                <button data-ss-menu-toggle>Menu</button>
                <ul data-ss-menu-content><li><a href="/">Home</a></li></ul>
            </nav>
        `;
        const managers = ResponsiveMenuManager.initMenus();
        expect(managers).toHaveLength(1);
    });
});
