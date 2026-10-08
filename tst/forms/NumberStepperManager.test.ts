// ============================================================================
// Stylescape | Number Stepper Manager Tests
// ============================================================================

import { describe, expect, it, vi } from "vitest";
import { NumberStepperManager } from "../../src/ts/forms/NumberStepperManager";

function setup(attrs = 'min="0" max="3" step="1" value="1"'): {
    root: HTMLElement;
    input: HTMLInputElement;
    down: HTMLButtonElement;
    up: HTMLButtonElement;
} {
    document.body.innerHTML = `
        <div class="ss-c-stepper">
            <button class="ss-c-stepper__button" data-ss-stepper="down" aria-label="Decrease">-</button>
            <input id="n" type="number" class="ss-c-stepper__input" ${attrs}>
            <button class="ss-c-stepper__button" data-ss-stepper="up" aria-label="Increase">+</button>
        </div>`;
    const [down, up] = Array.from(document.querySelectorAll("button"));
    return {
        root: document.querySelector(".ss-c-stepper") as HTMLElement,
        input: document.getElementById("n") as HTMLInputElement,
        down,
        up,
    };
}

describe("NumberStepperManager", () => {
    it("steps up and down with the buttons", () => {
        const { root, input, down, up } = setup();
        new NumberStepperManager(root);
        up.click();
        expect(input.value).toBe("2");
        down.click();
        down.click();
        expect(input.value).toBe("0");
    });

    it("fires input and change events and onStep", () => {
        const { root, input, up } = setup();
        const onStep = vi.fn();
        const onInput = vi.fn();
        const onChange = vi.fn();
        input.addEventListener("input", onInput);
        input.addEventListener("change", onChange);
        new NumberStepperManager(root, { onStep });
        up.click();
        expect(onInput).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onStep).toHaveBeenCalledWith(2, input);
    });

    it("marks the button at a limit aria-disabled without disabling it", () => {
        const { root, down, up } = setup();
        new NumberStepperManager(root);
        up.click();
        up.click();
        expect(up.getAttribute("aria-disabled")).toBe("true");
        expect(up.disabled).toBe(false);
        expect(down.hasAttribute("aria-disabled")).toBe(false);
    });

    it("does nothing past the limit", () => {
        const { root, input, up } = setup('min="0" max="1" value="1"');
        const onChange = vi.fn();
        input.addEventListener("change", onChange);
        new NumberStepperManager(root);
        up.click();
        expect(input.value).toBe("1");
        expect(onChange).not.toHaveBeenCalled();
    });

    it("keeps the limits in sync when the user types", () => {
        const { root, input, down } = setup();
        new NumberStepperManager(root);
        input.value = "0";
        input.dispatchEvent(new Event("input"));
        expect(down.getAttribute("aria-disabled")).toBe("true");
    });

    it("sets type=button and aria-controls on the buttons", () => {
        const { root, down, up } = setup();
        down.removeAttribute("type");
        new NumberStepperManager(root);
        expect(down.type).toBe("button");
        expect(up.getAttribute("aria-controls")).toBe("n");
    });

    it("ignores clicks when the input is disabled", () => {
        const { root, input, up } = setup();
        input.disabled = true;
        new NumberStepperManager(root);
        up.click();
        expect(input.value).toBe("1");
        expect(up.getAttribute("aria-disabled")).toBe("true");
    });

    it("starts from min when the value is empty", () => {
        const { root, input, up } = setup('min="5" max="9" value=""');
        new NumberStepperManager(root);
        up.click();
        expect(Number(input.value)).toBeGreaterThanOrEqual(5);
    });

    it("removes listeners on destroy", () => {
        const { root, input, up } = setup();
        const manager = new NumberStepperManager(root);
        manager.destroy();
        up.click();
        expect(input.value).toBe("1");
    });

    it("warns when the element is missing", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        new NumberStepperManager("#missing");
        expect(warn).toHaveBeenCalled();
        warn.mockRestore();
    });
});
