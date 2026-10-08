// ============================================================================
// Stylescape | Theme Toggler Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeToggler } from "../../src/ts/utilities/ThemeToggler";
import { themeTogglerFixture } from "../utils/fixtures";

const html = document.documentElement;

function stubDarkOS(dark: boolean) {
    vi.stubGlobal("matchMedia", (query: string) => ({
        matches: dark && query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    }));
}

describe("ThemeToggler", () => {
    beforeEach(() => {
        localStorage.clear();
        html.removeAttribute("data-theme");
    });

    afterEach(() => {
        localStorage.clear();
        html.removeAttribute("data-theme");
        vi.unstubAllGlobals();
    });

    describe("theme state", () => {
        it("defaults to light", () => {
            expect(ThemeToggler.getCurrentTheme()).toBe("light");
            expect(ThemeToggler.getResolvedTheme()).toBe("light");
        });

        it("reads the stored theme when no attribute is set", () => {
            localStorage.setItem("preferredTheme", "dark");
            expect(ThemeToggler.getCurrentTheme()).toBe("dark");
        });

        it("setTheme writes the attribute and storage", () => {
            ThemeToggler.setTheme("dark");
            expect(html.dataset.theme).toBe("dark");
            expect(localStorage.getItem("preferredTheme")).toBe("dark");
        });

        it("toggle flips light and dark", () => {
            ThemeToggler.toggle();
            expect(html.dataset.theme).toBe("dark");
            ThemeToggler.toggle();
            expect(html.dataset.theme).toBe("light");
        });

        it("resolves auto through prefers-color-scheme", () => {
            html.dataset.theme = "auto";
            stubDarkOS(true);
            expect(ThemeToggler.getResolvedTheme()).toBe("dark");
            stubDarkOS(false);
            expect(ThemeToggler.getResolvedTheme()).toBe("light");
        });

        it("toggle from auto goes to the opposite of what is shown", () => {
            html.dataset.theme = "auto";
            stubDarkOS(true);
            ThemeToggler.toggle();
            expect(html.dataset.theme).toBe("light");
        });

        it("cycle steps light → dark → auto → light", () => {
            ThemeToggler.cycle();
            expect(html.dataset.theme).toBe("dark");
            ThemeToggler.cycle();
            expect(html.dataset.theme).toBe("auto");
            ThemeToggler.cycle();
            expect(html.dataset.theme).toBe("light");
        });

        it("survives a throwing localStorage", () => {
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
            expect(() => ThemeToggler.setTheme("dark")).not.toThrow();
            expect(html.dataset.theme).toBe("dark");
            html.removeAttribute("data-theme");
            expect(ThemeToggler.getCurrentTheme()).toBe("light");
            get.mockRestore();
            set.mockRestore();
        });
    });

    describe("controls", () => {
        it("binds a button and keeps aria-pressed in sync", () => {
            document.body.innerHTML = themeTogglerFixture;
            const button = document.getElementById(
                "theme-toggle",
            ) as HTMLButtonElement;
            ThemeToggler.initializeToggleSwitch("theme-toggle");
            expect(button.getAttribute("aria-pressed")).toBe("false");
            button.click();
            expect(html.dataset.theme).toBe("dark");
            expect(button.getAttribute("aria-pressed")).toBe("true");
            button.click();
            expect(html.dataset.theme).toBe("light");
            expect(button.getAttribute("aria-pressed")).toBe("false");
        });

        it("binds a checkbox through change events", () => {
            document.body.innerHTML = `<input type="checkbox" id="themeToggle">`;
            const box = document.getElementById(
                "themeToggle",
            ) as HTMLInputElement;
            ThemeToggler.initializeToggleSwitch();
            expect(box.checked).toBe(false);
            box.checked = true;
            box.dispatchEvent(new Event("change"));
            expect(html.dataset.theme).toBe("dark");
        });

        it("syncs every bound control when the theme changes", () => {
            document.body.innerHTML = `
                <button class="ss-c-theme-toggle" id="a" aria-label="Dark mode"></button>
                <input type="checkbox" data-theme-toggle id="b">`;
            const toggles = ThemeToggler.initAll();
            expect(toggles).toHaveLength(2);
            (document.getElementById("a") as HTMLElement).click();
            expect(
                (document.getElementById("b") as HTMLInputElement).checked,
            ).toBe(true);
        });

        it("does not bind the same control twice", () => {
            document.body.innerHTML = `<button class="ss-c-theme-toggle" id="a"></button>`;
            ThemeToggler.initAll();
            ThemeToggler.initAll();
            (document.getElementById("a") as HTMLElement).click();
            expect(html.dataset.theme).toBe("dark");
        });

        it("cycle buttons expose data-theme-state and a matching label", () => {
            document.body.innerHTML = `
                <button class="ss-c-theme-toggle" id="c" data-theme-cycle
                        data-theme-label-light="Theme: light"
                        data-theme-label-dark="Theme: dark"
                        data-theme-label-auto="Theme: system"></button>`;
            const button = document.getElementById("c") as HTMLButtonElement;
            ThemeToggler.initAll();
            expect(button.dataset.themeState).toBe("light");
            expect(button.hasAttribute("aria-pressed")).toBe(false);
            button.click();
            button.click();
            expect(html.dataset.theme).toBe("auto");
            expect(button.dataset.themeState).toBe("auto");
            expect(button.getAttribute("aria-label")).toBe("Theme: system");
        });

        it("reflects an auto theme on a dark OS as pressed", () => {
            stubDarkOS(true);
            ThemeToggler.setTheme("auto");
            document.body.innerHTML = `<button class="ss-c-theme-toggle" id="a"></button>`;
            ThemeToggler.initAll();
            expect(
                document.getElementById("a")?.getAttribute("aria-pressed"),
            ).toBe("true");
        });

        it("unbind removes the listener", () => {
            document.body.innerHTML = `<button class="ss-c-theme-toggle" id="a"></button>`;
            const [button] = ThemeToggler.initAll();
            ThemeToggler.unbind(button);
            button.click();
            expect(html.dataset.theme).toBeUndefined();
        });

        it("registerOnLoad initialises at once when the page has loaded", () => {
            document.body.innerHTML = themeTogglerFixture;
            const button = document.getElementById(
                "theme-toggle",
            ) as HTMLElement;
            expect(document.readyState).toBe("complete");
            ThemeToggler.registerOnLoad("theme-toggle");
            button.click();
            expect(html.dataset.theme).toBe("dark");
        });

        it("keeps the fixture's accessible name", () => {
            document.body.innerHTML = themeTogglerFixture;
            const button = document.getElementById(
                "theme-toggle",
            ) as HTMLElement;
            expect(button.getAttribute("aria-label")).toBeTruthy();
        });
    });
});
