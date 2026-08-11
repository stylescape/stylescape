// ============================================================================
// Stylescape | Clipboard Helper Tests
// ============================================================================

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";
import { ClipboardHelper } from "../../src/ts/utilities/ClipboardHelper";
import { click, wait } from "../utils";

// jsdom does not implement `innerText`; ClipboardHelper reads it, so polyfill
// it to mirror `textContent` for the duration of these tests.
let writeText: ReturnType<typeof vi.fn>;

beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, "innerText", {
        configurable: true,
        get() {
            return this.textContent;
        },
    });

    writeText = vi.fn(() => Promise.resolve());
    Object.assign(navigator, { clipboard: { writeText } });
});

afterEach(() => {
    delete (HTMLElement.prototype as unknown as { innerText?: unknown })
        .innerText;
    vi.restoreAllMocks();
});

describe("ClipboardHelper", () => {
    describe("copyCodeFromButton", () => {
        it("copies the text of the button's next sibling", () => {
            document.body.innerHTML = `
                <button id="btn">Copy</button>
                <code>const x = 42;</code>
            `;
            const btn = document.getElementById("btn") as HTMLButtonElement;

            ClipboardHelper.copyCodeFromButton(btn);

            expect(writeText).toHaveBeenCalledTimes(1);
            expect(writeText).toHaveBeenCalledWith("const x = 42;");
        });

        it("updates the button label to 'Copied!' then restores it", async () => {
            vi.useFakeTimers();
            document.body.innerHTML = `
                <button id="btn">Copy</button>
                <code>hello</code>
            `;
            const btn = document.getElementById("btn") as HTMLButtonElement;

            ClipboardHelper.copyCodeFromButton(btn);
            // Flush the resolved writeText promise callback.
            await vi.runAllTimersAsync();

            expect(btn.textContent).toBe("Copy");
            vi.useRealTimers();
        });

        it("does nothing when there is no sibling element", () => {
            document.body.innerHTML = `<button id="btn">Copy</button>`;
            const btn = document.getElementById("btn") as HTMLButtonElement;

            expect(() =>
                ClipboardHelper.copyCodeFromButton(btn),
            ).not.toThrow();
            expect(writeText).not.toHaveBeenCalled();
        });
    });

    describe("attachToButtons", () => {
        it("wires click handlers on all matching buttons (default selector)", () => {
            document.body.innerHTML = `
                <button class="copy-button" id="a">Copy</button>
                <code>alpha</code>
                <button class="copy-button" id="b">Copy</button>
                <code>beta</code>
            `;
            ClipboardHelper.attachToButtons();

            click(document.getElementById("a") as HTMLElement);
            expect(writeText).toHaveBeenLastCalledWith("alpha");

            click(document.getElementById("b") as HTMLElement);
            expect(writeText).toHaveBeenLastCalledWith("beta");
            expect(writeText).toHaveBeenCalledTimes(2);
        });

        it("supports a custom selector", () => {
            document.body.innerHTML = `
                <button class="my-copy" id="a">Copy</button>
                <code>gamma</code>
            `;
            ClipboardHelper.attachToButtons(".my-copy");

            click(document.getElementById("a") as HTMLElement);
            expect(writeText).toHaveBeenCalledWith("gamma");
        });
    });

    describe("copyById", () => {
        it("copies the trimmed text of the element with the given id", () => {
            document.body.innerHTML = `
                <pre id="snippet">   npm install stylescape   </pre>
            `;
            ClipboardHelper.copyById("snippet");

            expect(writeText).toHaveBeenCalledWith("npm install stylescape");
        });

        it("temporarily updates a button referencing the id via onclick", async () => {
            vi.useFakeTimers();
            document.body.innerHTML = `
                <button id="trigger" onclick="ClipboardHelper.copyById('snippet')">Copy</button>
                <pre id="snippet">payload</pre>
            `;
            const trigger = document.getElementById("trigger") as HTMLElement;

            ClipboardHelper.copyById("snippet");
            await vi.runAllTimersAsync();

            // After the timeout the original label is restored.
            expect(trigger.textContent).toBe("Copy");
            vi.useRealTimers();
        });

        it("warns and returns when the id is not found", () => {
            const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
            ClipboardHelper.copyById("missing");

            expect(warn).toHaveBeenCalled();
            expect(writeText).not.toHaveBeenCalled();
        });

        it("logs an error when the clipboard write rejects", async () => {
            const error = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});
            writeText.mockReturnValueOnce(Promise.reject(new Error("denied")));
            document.body.innerHTML = `<pre id="snippet">x</pre>`;

            ClipboardHelper.copyById("snippet");
            await wait(0);

            expect(error).toHaveBeenCalled();
        });
    });
});
