// ============================================================================
// Stylescape | Range Output Manager Tests
// ============================================================================

import { describe, expect, it, vi } from "vitest";
import { RangeOutputManager } from "../../src/ts/forms/RangeOutputManager";

function setup(outputAttrs = ""): {
    input: HTMLInputElement;
    output: HTMLOutputElement;
    form: HTMLFormElement;
} {
    document.body.innerHTML = `
        <form id="f">
            <div class="ss-c-range-field">
                <label for="vol">Volume</label>
                <output for="vol" ${outputAttrs}></output>
                <input id="vol" type="range" min="0" max="200" value="50">
            </div>
        </form>`;
    return {
        input: document.getElementById("vol") as HTMLInputElement,
        output: document.querySelector("output") as HTMLOutputElement,
        form: document.getElementById("f") as HTMLFormElement,
    };
}

function slide(input: HTMLInputElement, value: string): void {
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
}

describe("RangeOutputManager", () => {
    it("writes the initial value into the output", () => {
        const { output } = setup();
        new RangeOutputManager();
        expect(output.value).toBe("50");
    });

    it("updates the output on input", () => {
        const { input, output } = setup();
        new RangeOutputManager();
        slide(input, "120");
        expect(output.value).toBe("120");
    });

    it("sets --ss-range-progress on range inputs", () => {
        const { input } = setup();
        new RangeOutputManager();
        expect(input.style.getPropertyValue("--ss-range-progress")).toBe(
            "25%",
        );
        slide(input, "200");
        expect(input.style.getPropertyValue("--ss-range-progress")).toBe(
            "100%",
        );
    });

    it("applies prefix, suffix and decimals from data attributes", () => {
        const { input, output } = setup(
            'data-ss-output-prefix="~" data-ss-output-suffix=" px" data-ss-output-decimals="1" data-ss-output-locale="en"',
        );
        new RangeOutputManager();
        slide(input, "12");
        expect(output.value).toBe("~12.0 px");
    });

    it("uses a custom formatter and calls onUpdate", () => {
        const { input, output } = setup();
        const onUpdate = vi.fn();
        new RangeOutputManager(document, {
            format: (value) => `${Number(value) / 2}%`,
            onUpdate,
        });
        slide(input, "100");
        expect(output.value).toBe("50%");
        expect(onUpdate).toHaveBeenLastCalledWith(output, input);
    });

    it("follows the first input when `for` lists several ids", () => {
        document.body.innerHTML = `
            <input id="a" type="number" value="3">
            <input id="b" type="number" value="4">
            <output for="missing a b"></output>`;
        new RangeOutputManager();
        expect(document.querySelector("output")!.value).toBe("3");
    });

    it("binds a colour input too", () => {
        document.body.innerHTML = `
            <input id="c" type="color" value="#336699">
            <output for="c"></output>`;
        new RangeOutputManager();
        expect(document.querySelector("output")!.value).toBe("#336699");
    });

    it("refreshes after a form reset", async () => {
        const { input, output, form } = setup();
        new RangeOutputManager();
        slide(input, "150");
        form.reset();
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(output.value).toBe("50");
    });

    it("scopes to a root element given as selector", () => {
        const { input, output } = setup();
        document.body.insertAdjacentHTML(
            "beforeend",
            '<input id="x" type="range" value="10"><output id="out-x" for="x"></output>',
        );
        new RangeOutputManager(".ss-c-range-field");
        slide(input, "60");
        expect(output.value).toBe("60");
        expect(
            (document.getElementById("out-x") as HTMLOutputElement).value,
        ).toBe("");
    });

    it("stops updating after destroy", () => {
        const { input, output } = setup();
        const manager = new RangeOutputManager();
        manager.destroy();
        slide(input, "190");
        expect(output.value).toBe("50");
    });

    it("warns when the root is missing", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        new RangeOutputManager("#nope");
        expect(warn).toHaveBeenCalled();
        warn.mockRestore();
    });
});
