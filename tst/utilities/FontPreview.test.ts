// ============================================================================
// Stylescape | Font Preview Tests
// ============================================================================

import { beforeEach, describe, expect, it } from "vitest";
import { FontPreview } from "../../src/ts/utilities/FontPreview";
import { inputValue } from "../utils";

const DEFAULT_TEXT = "The quick brown fox jumps over the lazy dog.";

describe("FontPreview", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <input id="font-input" type="text" />
            <p class="preview">seed</p>
            <p class="preview">seed</p>
        `;
    });

    it("throws when the input selector matches nothing", () => {
        expect(() => new FontPreview("#missing", ".preview")).toThrow(
            /not found/,
        );
    });

    it("seeds preview elements with the placeholder when input is empty", () => {
        new FontPreview("#font-input", ".preview");

        const previews = document.querySelectorAll(".preview");
        previews.forEach((el) => {
            expect(el.textContent).toBe(DEFAULT_TEXT);
        });
    });

    it("initializes previews from an existing input value", () => {
        (document.getElementById("font-input") as HTMLInputElement).value =
            "Hamburgefonstiv";

        new FontPreview("#font-input", ".preview");

        document.querySelectorAll(".preview").forEach((el) => {
            expect(el.textContent).toBe("Hamburgefonstiv");
        });
    });

    it("updates all previews live as the input changes", () => {
        new FontPreview("#font-input", ".preview");
        const input = document.getElementById(
            "font-input",
        ) as HTMLInputElement;

        inputValue(input, "Typography");

        document.querySelectorAll(".preview").forEach((el) => {
            expect(el.textContent).toBe("Typography");
        });
    });

    it("falls back to the placeholder when the input is cleared", () => {
        new FontPreview("#font-input", ".preview");
        const input = document.getElementById(
            "font-input",
        ) as HTMLInputElement;

        inputValue(input, "abc");
        inputValue(input, "");

        document.querySelectorAll(".preview").forEach((el) => {
            expect(el.textContent).toBe(DEFAULT_TEXT);
        });
    });

    it("tolerates an empty preview set", () => {
        document.body.innerHTML = `<input id="font-input" type="text" />`;
        expect(() => new FontPreview("#font-input", ".preview")).not.toThrow();
    });
});
