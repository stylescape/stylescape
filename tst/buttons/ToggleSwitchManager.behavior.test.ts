// ============================================================================
// Stylescape | Toggle Switch Manager — Behavioural Tests
// ============================================================================
// Complements ButtonHandler.test.ts's toggle cases with persistence, ARIA,
// label and callback coverage.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ToggleSwitchManager } from "../../src/ts/buttons/ToggleSwitchManager";
import { changeValue, click } from "../utils";

function input(): HTMLInputElement {
    return document.getElementById("toggle") as HTMLInputElement;
}

describe("ToggleSwitchManager (behaviour)", () => {
    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = `
            <div class="wrapper">
                <input type="checkbox" id="toggle" />
                <label for="toggle">Off</label>
            </div>
        `;
    });
    afterEach(() => localStorage.clear());

    it("warns when the element is missing", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        new ToggleSwitchManager("#missing");
        expect(warn).toHaveBeenCalled();
    });

    it("sets the switch role and initial ARIA state", () => {
        new ToggleSwitchManager("#toggle", { checked: true });
        expect(input().getAttribute("role")).toBe("switch");
        expect(input().getAttribute("aria-checked")).toBe("true");
        expect(input().checked).toBe(true);
    });

    it("reflects the initial checked option", () => {
        const t = new ToggleSwitchManager("#toggle", { checked: true });
        expect(t.isOn).toBe(true);
    });

    it("updates wrapper classes and aria on change", () => {
        new ToggleSwitchManager("#toggle");
        const el = input();

        el.checked = true;
        changeValue(el, "on");

        const wrapper = el.parentElement as HTMLElement;
        expect(wrapper.classList.contains("toggle--on")).toBe(true);
        expect(wrapper.classList.contains("toggle--off")).toBe(false);
        expect(el.getAttribute("aria-checked")).toBe("true");
    });

    it("fires onChange with the new state", () => {
        const onChange = vi.fn();
        const t = new ToggleSwitchManager("#toggle", { onChange });
        t.on();
        expect(onChange).toHaveBeenLastCalledWith(true, input());
        t.off();
        expect(onChange).toHaveBeenLastCalledWith(false, input());
    });

    it("toggle() / on() / off() drive state via the isOn setter", () => {
        const t = new ToggleSwitchManager("#toggle");
        t.toggle();
        expect(t.isOn).toBe(true);
        t.toggle();
        expect(t.isOn).toBe(false);
        t.on();
        expect(t.isOn).toBe(true);
        t.off();
        expect(t.isOn).toBe(false);
    });

    it("persists state to localStorage when persist is enabled", () => {
        const t = new ToggleSwitchManager("#toggle", {
            persist: true,
            storageKey: "dark-mode",
        });
        t.on();
        expect(localStorage.getItem("dark-mode")).toBe("true");
        t.off();
        expect(localStorage.getItem("dark-mode")).toBe("false");
    });

    it("restores persisted state on construction", () => {
        localStorage.setItem("toggle", "true"); // storageKey defaults to id
        const t = new ToggleSwitchManager("#toggle", { persist: true });
        expect(t.isOn).toBe(true);
    });

    it("swaps the associated label text for on/off labels", () => {
        const t = new ToggleSwitchManager("#toggle", {
            onLabel: "Enabled",
            offLabel: "Disabled",
        });
        t.on();
        expect(document.querySelector("label")?.textContent).toBe("Enabled");
        t.off();
        expect(document.querySelector("label")?.textContent).toBe("Disabled");
    });

    it("responds to native change events from user clicks", () => {
        const onChange = vi.fn();
        new ToggleSwitchManager("#toggle", { onChange });
        click(input()); // toggles a checkbox and fires change
        expect(onChange).toHaveBeenCalled();
        expect(input().checked).toBe(true);
    });

    it("destroy detaches the change listener", () => {
        const onChange = vi.fn();
        const t = new ToggleSwitchManager("#toggle", { onChange });
        t.destroy();
        const el = input();
        el.checked = true;
        changeValue(el, "on");
        expect(onChange).not.toHaveBeenCalled();
    });
});
