// ============================================================================
// Stylescape | Slider Tests
// ============================================================================
// Slider.ts does NOT export anything. It defines an internal `CustomSlider`
// class and, at module-evaluation time, instantiates it against the hard-coded
// element ids `#mySlider` and `#sliderValueDisplay`, mirroring the input value
// into the display element and keeping it in sync via the "input" event.
//
// Because the behavior only runs as an import side effect, we drive it with
// dynamic `import()` after resetting the module registry, so the DOM can be
// prepared first. There is no exported API to test directly.
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = "../../src/ts/elements/Slider";

describe("Slider (CustomSlider side-effect module)", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        vi.resetModules();
    });

    afterEach(() => {
        vi.resetModules();
    });

    function buildSlider(value: string): void {
        document.body.innerHTML = `
            <input id="mySlider" type="range" min="0" max="100" value="${value}" />
            <span id="sliderValueDisplay"></span>
        `;
    }

    it("mirrors the slider's initial value into the display on import", async () => {
        buildSlider("42");
        await import(MODULE_PATH);

        const display = document.getElementById("sliderValueDisplay")!;
        expect(display.textContent).toBe("42");
    });

    it("updates the display when the slider fires an input event", async () => {
        buildSlider("10");
        await import(MODULE_PATH);

        const slider = document.getElementById("mySlider") as HTMLInputElement;
        const display = document.getElementById("sliderValueDisplay")!;
        expect(display.textContent).toBe("10");

        slider.value = "77";
        slider.dispatchEvent(new Event("input", { bubbles: true }));
        expect(display.textContent).toBe("77");
    });

    it("throws on import when the required elements are absent (no null-guarding)", async () => {
        // No #mySlider / #sliderValueDisplay in the DOM.
        await expect(import(MODULE_PATH)).rejects.toThrowError();
    });
});
