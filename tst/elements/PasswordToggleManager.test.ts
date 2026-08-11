// ============================================================================
// Stylescape | PasswordToggleManager Tests
// ============================================================================
// PasswordToggleManager wires `[data-password-toggle]` buttons to toggle the
// type of their target <input> between "password" and "text", updating the
// `is-visible` class and `aria-pressed` attribute.
// ============================================================================

import { beforeEach, describe, expect, it } from "vitest";
import { PasswordToggleManager } from "../../src/ts/elements/PasswordToggleManager";
import { click } from "../utils";

describe("PasswordToggleManager", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    function buildField(opts: { inputType?: string; target?: string } = {}): {
        input: HTMLInputElement;
        button: HTMLButtonElement;
    } {
        const type = opts.inputType ?? "password";
        const target = opts.target ?? "pw";
        document.body.innerHTML = `
            <div class="input-group">
                <input type="${type}" id="pw" />
                <button type="button"
                        data-password-toggle="${target}"
                        aria-pressed="false">Show</button>
            </div>
        `;
        return {
            input: document.getElementById("pw") as HTMLInputElement,
            button: document.querySelector("button") as HTMLButtonElement,
        };
    }

    describe("Construction", () => {
        it("constructs and returns an instance", () => {
            buildField();
            const manager = new PasswordToggleManager();
            expect(manager).toBeInstanceOf(PasswordToggleManager);
        });

        it("does not throw when no toggle buttons are present", () => {
            expect(() => new PasswordToggleManager()).not.toThrow();
        });
    });

    describe("Toggling visibility", () => {
        it("reveals the password on first click", () => {
            const { input, button } = buildField();
            new PasswordToggleManager();

            click(button);

            expect(input.type).toBe("text");
            expect(button.classList.contains("is-visible")).toBe(true);
            expect(button.getAttribute("aria-pressed")).toBe("true");
        });

        it("hides the password again on the second click", () => {
            const { input, button } = buildField();
            new PasswordToggleManager();

            click(button); // show
            click(button); // hide

            expect(input.type).toBe("password");
            expect(button.classList.contains("is-visible")).toBe(false);
            expect(button.getAttribute("aria-pressed")).toBe("false");
        });
    });

    describe("Guards", () => {
        it("ignores buttons whose data-password-toggle is empty", () => {
            document.body.innerHTML = `
                <input type="password" id="pw" />
                <button data-password-toggle="">Show</button>
            `;
            const input = document.getElementById("pw") as HTMLInputElement;
            const button = document.querySelector("button") as HTMLButtonElement;
            new PasswordToggleManager();

            click(button);
            // Not wired -> input type unchanged.
            expect(input.type).toBe("password");
        });

        it("ignores buttons that target a non-existent input", () => {
            const { input, button } = buildField({ target: "missing" });
            new PasswordToggleManager();

            click(button);
            expect(input.type).toBe("password");
        });

        it("ignores buttons targeting a non-password input", () => {
            const { input, button } = buildField({ inputType: "text" });
            new PasswordToggleManager();

            click(button);
            // Input was already type=text and not a password field -> untouched.
            expect(input.type).toBe("text");
            expect(button.classList.contains("is-visible")).toBe(false);
        });
    });

    describe("Custom selector", () => {
        it("only wires buttons matching the custom selector", () => {
            document.body.innerHTML = `
                <input type="password" id="pw" />
                <button class="pw-btn" data-password-toggle="pw">Show</button>
            `;
            const input = document.getElementById("pw") as HTMLInputElement;
            const button = document.querySelector(
                ".pw-btn",
            ) as HTMLButtonElement;
            new PasswordToggleManager(".pw-btn");

            click(button);
            expect(input.type).toBe("text");
        });
    });

    describe("Multiple fields", () => {
        it("toggles each field independently", () => {
            document.body.innerHTML = `
                <input type="password" id="pw1" />
                <button id="b1" data-password-toggle="pw1">Show</button>
                <input type="password" id="pw2" />
                <button id="b2" data-password-toggle="pw2">Show</button>
            `;
            new PasswordToggleManager();

            const pw1 = document.getElementById("pw1") as HTMLInputElement;
            const pw2 = document.getElementById("pw2") as HTMLInputElement;

            click(document.getElementById("b1")!);
            expect(pw1.type).toBe("text");
            expect(pw2.type).toBe("password");
        });
    });
});
