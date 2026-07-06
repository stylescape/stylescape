// ============================================================================
// Stylescape | Drilldown Menu Manager Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DrilldownMenuManager } from "../../src/ts/elements/DrilldownMenuManager";
import { click, keyDown } from "../utils";

const ACTIVE = "drilldown__level--active";

const HTML = `
    <nav class="drilldown" data-ss="drilldown">
        <ul data-ss-drilldown-menu>
            <li>
                <a href="#" id="lvl1">Products</a>
                <ul data-ss-drilldown-submenu>
                    <li><a href="#" id="lvl2">Widgets</a></li>
                </ul>
            </li>
        </ul>
    </nav>
    <div id="outside">outside</div>
`;

function mainMenu(): HTMLElement {
    return document.querySelector("[data-ss-drilldown-menu]") as HTMLElement;
}
function subMenu(): HTMLElement {
    return document.querySelector("[data-ss-drilldown-submenu]") as HTMLElement;
}

describe("DrilldownMenuManager", () => {
    beforeEach(() => {
        document.body.innerHTML = HTML;
    });
    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("does not throw when the container is missing", () => {
        expect(() => new DrilldownMenuManager("#nope")).not.toThrow();
    });

    it("shows the root level as active on init", () => {
        new DrilldownMenuManager(".drilldown");
        expect(mainMenu().classList.contains(ACTIVE)).toBe(true);
        expect(subMenu().classList.contains(ACTIVE)).toBe(false);
        expect(subMenu().getAttribute("aria-hidden")).toBe("true");
    });

    it("adds drilldown trigger attributes to parent items", () => {
        new DrilldownMenuManager(".drilldown");
        const trigger = document.getElementById("lvl1") as HTMLElement;
        expect(trigger.hasAttribute("data-ss-drilldown-trigger")).toBe(true);
        expect(trigger.getAttribute("data-ss-drilldown-target")).toBe("1");
    });

    it("injects a back button into submenus by default", () => {
        new DrilldownMenuManager(".drilldown");
        expect(
            subMenu().querySelector("[data-ss-drilldown-back]"),
        ).not.toBeNull();
    });

    it("drillDown activates the target submenu and updates depth", () => {
        const dd = new DrilldownMenuManager(".drilldown");
        dd.drillDown(1);

        expect(subMenu().classList.contains(ACTIVE)).toBe(true);
        expect(subMenu().getAttribute("aria-hidden")).toBe("false");
        expect(mainMenu().classList.contains(ACTIVE)).toBe(false);
        expect(dd.getCurrentDepth()).toBe(1);
    });

    it("clicking a trigger drills down", () => {
        const dd = new DrilldownMenuManager(".drilldown");
        click(document.getElementById("lvl1") as HTMLElement);
        expect(dd.getCurrentDepth()).toBe(1);
        expect(subMenu().classList.contains(ACTIVE)).toBe(true);
    });

    it("clicking the back button drills up to the root", () => {
        const dd = new DrilldownMenuManager(".drilldown");
        dd.drillDown(1);
        const back = subMenu().querySelector(
            "[data-ss-drilldown-back] button",
        ) as HTMLElement;
        click(back);
        expect(dd.getCurrentDepth()).toBe(0);
        expect(mainMenu().classList.contains(ACTIVE)).toBe(true);
    });

    it("fires onDrillDown and onDrillUp callbacks", () => {
        const onDrillDown = vi.fn();
        const onDrillUp = vi.fn();
        const dd = new DrilldownMenuManager(".drilldown", {
            onDrillDown,
            onDrillUp,
        });
        dd.drillDown(1);
        dd.drillUp();
        expect(onDrillDown).toHaveBeenCalledWith(1, subMenu());
        expect(onDrillUp).toHaveBeenCalled();
    });

    it("Escape key drills up when nested", () => {
        const dd = new DrilldownMenuManager(".drilldown");
        dd.drillDown(1);
        keyDown(mainMenu(), "Escape");
        expect(dd.getCurrentDepth()).toBe(0);
    });

    it("reset returns to the root level", () => {
        const dd = new DrilldownMenuManager(".drilldown");
        dd.drillDown(1);
        dd.reset();
        expect(dd.getCurrentDepth()).toBe(0);
        expect(mainMenu().classList.contains(ACTIVE)).toBe(true);
    });

    it("outside click resets to root when enabled", () => {
        const dd = new DrilldownMenuManager(".drilldown", {
            closeOnOutsideClick: true,
        });
        dd.drillDown(1);
        click(document.getElementById("outside") as HTMLElement);
        expect(dd.getCurrentDepth()).toBe(0);
    });

    it("skips back buttons when showBackButton is false", () => {
        new DrilldownMenuManager(".drilldown", { showBackButton: false });
        expect(subMenu().querySelector("[data-ss-drilldown-back]")).toBeNull();
    });

    it("destroy tears down listeners and state", () => {
        const dd = new DrilldownMenuManager(".drilldown");
        dd.destroy();
        // After destroy the outside-click handler is gone; drilling is reset.
        expect(dd.getCurrentDepth()).toBe(0);
    });

    it("initDrilldowns constructs managers for tagged navs", () => {
        const managers = DrilldownMenuManager.initDrilldowns();
        expect(managers).toHaveLength(1);
    });
});
