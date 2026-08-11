// ============================================================================
// Stylescape | Autocomplete Manager Tests
// ============================================================================

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";
import { AutocompleteManager } from "../../src/ts/forms/AutocompleteManager";
import { keyDown, mouseEnter } from "../utils";

const DEBOUNCE = 100;

// Helper: append an input to the body and return it
function makeInput(id = "search"): HTMLInputElement {
    const input = document.createElement("input");
    input.type = "text";
    input.id = id;
    document.body.appendChild(input);
    return input;
}

// Helper: set the input value and dispatch a native "input" event
function type(input: HTMLInputElement, value: string): void {
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
}

// Grab the suggestions container that the manager injects
function getContainer(cls = "autocomplete"): HTMLElement | null {
    return document.querySelector<HTMLElement>(`.${cls}`);
}

function getItems(cls = "autocomplete"): HTMLElement[] {
    const c = getContainer(cls);
    return c
        ? Array.from(c.querySelectorAll<HTMLElement>('[role="option"]'))
        : [];
}

describe("AutocompleteManager", () => {
    beforeEach(() => {
        // jsdom does not implement scrollIntoView (used by setActive)
        Element.prototype.scrollIntoView = vi.fn();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    // ------------------------------------------------------------------
    // Construction
    // ------------------------------------------------------------------
    describe("construction", () => {
        it("warns and does nothing when the input is not found", () => {
            const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

            const ac = new AutocompleteManager("#does-not-exist");

            expect(warn).toHaveBeenCalledWith(
                "[Stylescape] AutocompleteManager input not found",
            );
            // No container should have been created
            expect(getContainer()).toBeNull();
            expect(ac).toBeInstanceOf(AutocompleteManager);
            warn.mockRestore();
        });

        it("accepts a CSS selector string", () => {
            makeInput("by-selector");
            new AutocompleteManager("#by-selector", { suggestions: ["A"] });
            expect(getContainer()).not.toBeNull();
        });

        it("accepts an element reference", () => {
            const input = makeInput();
            new AutocompleteManager(input, { suggestions: ["A"] });
            expect(getContainer()).not.toBeNull();
        });

        it("sets combobox ARIA attributes on the input", () => {
            const input = makeInput();
            new AutocompleteManager(input, { suggestions: ["A"] });

            expect(input.getAttribute("role")).toBe("combobox");
            expect(input.getAttribute("aria-autocomplete")).toBe("list");
            expect(input.getAttribute("aria-expanded")).toBe("false");
            expect(input.getAttribute("aria-haspopup")).toBe("listbox");
        });

        it("creates a hidden listbox container inside a relative wrapper", () => {
            const input = makeInput();
            new AutocompleteManager(input, { suggestions: ["A"] });

            const container = getContainer()!;
            expect(container.getAttribute("role")).toBe("listbox");
            expect(container.style.display).toBe("none");
            expect(container.style.position).toBe("absolute");

            // Input is now wrapped in a position:relative wrapper
            const wrapper = input.parentElement!;
            expect(wrapper.style.position).toBe("relative");
            expect(wrapper.contains(container)).toBe(true);
        });

        it("honours custom class-name options", () => {
            const input = makeInput();
            new AutocompleteManager(input, {
                suggestions: ["A"],
                containerClass: "my-box",
            });
            expect(document.querySelector(".my-box")).not.toBeNull();
            expect(getContainer("autocomplete")).toBeNull();
        });
    });

    // ------------------------------------------------------------------
    // setSuggestions
    // ------------------------------------------------------------------
    describe("setSuggestions", () => {
        it("replaces the suggestion list used for filtering", async () => {
            vi.useFakeTimers();
            const input = makeInput();
            const ac = new AutocompleteManager(input, {
                suggestions: ["Alpha"],
                debounce: DEBOUNCE,
                highlight: false,
            });

            ac.setSuggestions(["Beta", "Berlin"]);
            type(input, "be");
            await vi.advanceTimersByTimeAsync(DEBOUNCE);

            const texts = getItems().map((i) => i.textContent);
            expect(texts).toEqual(["Beta", "Berlin"]);
        });
    });

    // ------------------------------------------------------------------
    // Filtering / rendering via input
    // ------------------------------------------------------------------
    describe("filtering", () => {
        it("renders case-insensitive matches after the debounce delay", async () => {
            vi.useFakeTimers();
            const input = makeInput();
            new AutocompleteManager(input, {
                suggestions: ["Apple", "Apricot", "Banana"],
                debounce: DEBOUNCE,
                highlight: false,
            });

            type(input, "AP");
            // Nothing yet — still within debounce window
            expect(getItems()).toHaveLength(0);

            await vi.advanceTimersByTimeAsync(DEBOUNCE);

            const texts = getItems().map((i) => i.textContent);
            expect(texts).toEqual(["Apple", "Apricot"]);
        });

        it("debounces rapid input so only the last query is used", async () => {
            vi.useFakeTimers();
            const input = makeInput();
            new AutocompleteManager(input, {
                suggestions: ["Apple", "Banana"],
                debounce: DEBOUNCE,
                highlight: false,
            });

            type(input, "a");
            await vi.advanceTimersByTimeAsync(DEBOUNCE / 2);
            type(input, "ban");
            await vi.advanceTimersByTimeAsync(DEBOUNCE);

            const texts = getItems().map((i) => i.textContent);
            expect(texts).toEqual(["Banana"]);
        });

        it("does not open when the query is shorter than minChars", async () => {
            vi.useFakeTimers();
            const input = makeInput();
            new AutocompleteManager(input, {
                suggestions: ["Apple"],
                minChars: 3,
                debounce: DEBOUNCE,
            });

            type(input, "ap");
            await vi.advanceTimersByTimeAsync(DEBOUNCE);

            expect(getContainer()!.style.display).toBe("none");
            expect(input.getAttribute("aria-expanded")).toBe("false");
        });

        it("limits results to maxResults", async () => {
            vi.useFakeTimers();
            const input = makeInput();
            new AutocompleteManager(input, {
                suggestions: ["a1", "a2", "a3", "a4"],
                maxResults: 2,
                debounce: DEBOUNCE,
                highlight: false,
            });

            type(input, "a");
            await vi.advanceTimersByTimeAsync(DEBOUNCE);

            expect(getItems()).toHaveLength(2);
        });

        it("closes when no suggestion matches", async () => {
            vi.useFakeTimers();
            const input = makeInput();
            new AutocompleteManager(input, {
                suggestions: ["Apple"],
                debounce: DEBOUNCE,
            });

            type(input, "zzz");
            await vi.advanceTimersByTimeAsync(DEBOUNCE);

            expect(getContainer()!.style.display).toBe("none");
            expect(getItems()).toHaveLength(0);
        });

        it("wraps the matched text in a highlight span when highlight is on", async () => {
            vi.useFakeTimers();
            const input = makeInput();
            new AutocompleteManager(input, {
                suggestions: ["Apple"],
                debounce: DEBOUNCE,
                highlight: true,
            });

            type(input, "ap");
            await vi.advanceTimersByTimeAsync(DEBOUNCE);

            const mark = getItems()[0].querySelector(".autocomplete__highlight");
            expect(mark).not.toBeNull();
            expect(mark!.textContent!.toLowerCase()).toBe("ap");
        });

        it("escapes regex special characters in the query", async () => {
            vi.useFakeTimers();
            const input = makeInput();
            new AutocompleteManager(input, {
                suggestions: ["a (b) c"],
                debounce: DEBOUNCE,
                highlight: true,
            });

            // A raw "(" in a RegExp would throw; escapeRegex must protect it
            expect(() => {
                type(input, "(b)");
            }).not.toThrow();
            await vi.advanceTimersByTimeAsync(DEBOUNCE);

            expect(getItems()).toHaveLength(1);
        });

        it("uses fetchSuggestions when no static suggestions are supplied", async () => {
            vi.useFakeTimers();
            const input = makeInput();
            const fetchSuggestions = vi.fn(async (q: string) => [
                `${q}-remote-1`,
                `${q}-remote-2`,
            ]);
            new AutocompleteManager(input, {
                fetchSuggestions,
                debounce: DEBOUNCE,
                highlight: false,
            });

            type(input, "xy");
            await vi.advanceTimersByTimeAsync(DEBOUNCE);

            expect(fetchSuggestions).toHaveBeenCalledWith("xy");
            const texts = getItems().map((i) => i.textContent);
            expect(texts).toEqual(["xy-remote-1", "xy-remote-2"]);
        });
    });

    // ------------------------------------------------------------------
    // open / close
    // ------------------------------------------------------------------
    describe("open / close", () => {
        it("open() reveals the container once suggestions exist", async () => {
            vi.useFakeTimers();
            const input = makeInput();
            const ac = new AutocompleteManager(input, {
                suggestions: ["Apple"],
                debounce: DEBOUNCE,
            });

            type(input, "ap");
            await vi.advanceTimersByTimeAsync(DEBOUNCE);
            ac.close();
            expect(getContainer()!.style.display).toBe("none");

            ac.open();
            expect(getContainer()!.style.display).toBe("block");
            expect(input.getAttribute("aria-expanded")).toBe("true");
        });

        it("open() is a no-op when there are no current suggestions", () => {
            const input = makeInput();
            const ac = new AutocompleteManager(input, { suggestions: ["A"] });

            ac.open();
            expect(getContainer()!.style.display).toBe("none");
            expect(input.getAttribute("aria-expanded")).toBe("false");
        });

        it("close() hides the container and resets ARIA state", async () => {
            vi.useFakeTimers();
            const input = makeInput();
            const ac = new AutocompleteManager(input, {
                suggestions: ["Apple"],
                debounce: DEBOUNCE,
            });

            type(input, "ap");
            await vi.advanceTimersByTimeAsync(DEBOUNCE);
            expect(getContainer()!.style.display).toBe("block");

            ac.close();
            expect(getContainer()!.style.display).toBe("none");
            expect(input.getAttribute("aria-expanded")).toBe("false");
        });
    });

    // ------------------------------------------------------------------
    // Keyboard navigation
    // ------------------------------------------------------------------
    describe("keyboard navigation", () => {
        async function open(input: HTMLInputElement): Promise<void> {
            type(input, "a");
            await vi.advanceTimersByTimeAsync(DEBOUNCE);
        }

        it("ArrowDown opens the dropdown when it is closed but has suggestions", async () => {
            vi.useFakeTimers();
            const input = makeInput();
            const ac = new AutocompleteManager(input, {
                suggestions: ["Apple", "Avocado"],
                debounce: DEBOUNCE,
            });
            await open(input);
            ac.close();
            expect(getContainer()!.style.display).toBe("none");

            keyDown(input, "ArrowDown");
            expect(getContainer()!.style.display).toBe("block");
        });

        it("ArrowDown highlights the first item, ArrowUp wraps to the last", async () => {
            vi.useFakeTimers();
            const input = makeInput();
            new AutocompleteManager(input, {
                suggestions: ["Apple", "Avocado", "Apricot"],
                debounce: DEBOUNCE,
            });
            await open(input);

            keyDown(input, "ArrowDown");
            const items = getItems();
            expect(
                items[0].classList.contains("autocomplete__item--active"),
            ).toBe(true);
            expect(items[0].getAttribute("aria-selected")).toBe("true");

            // From index 0, ArrowUp wraps around to the last item
            keyDown(input, "ArrowUp");
            expect(
                items[items.length - 1].classList.contains(
                    "autocomplete__item--active",
                ),
            ).toBe(true);
            expect(
                items[0].classList.contains("autocomplete__item--active"),
            ).toBe(false);
        });

        it("Enter selects the active suggestion", async () => {
            vi.useFakeTimers();
            const input = makeInput();
            const onSelect = vi.fn();
            new AutocompleteManager(input, {
                suggestions: ["Apple", "Avocado"],
                debounce: DEBOUNCE,
                onSelect,
            });
            await open(input);

            const change = vi.fn();
            input.addEventListener("change", change);

            keyDown(input, "ArrowDown"); // activate index 0
            keyDown(input, "Enter");

            expect(input.value).toBe("Apple");
            expect(onSelect).toHaveBeenCalledWith("Apple", expect.anything());
            expect(change).toHaveBeenCalledTimes(1);
            expect(getContainer()!.style.display).toBe("none");
        });

        it("Escape closes the dropdown", async () => {
            vi.useFakeTimers();
            const input = makeInput();
            new AutocompleteManager(input, {
                suggestions: ["Apple"],
                debounce: DEBOUNCE,
            });
            await open(input);
            expect(getContainer()!.style.display).toBe("block");

            keyDown(input, "Escape");
            expect(getContainer()!.style.display).toBe("none");
        });

        it("Tab closes the dropdown", async () => {
            vi.useFakeTimers();
            const input = makeInput();
            new AutocompleteManager(input, {
                suggestions: ["Apple"],
                debounce: DEBOUNCE,
            });
            await open(input);

            keyDown(input, "Tab");
            expect(getContainer()!.style.display).toBe("none");
        });
    });

    // ------------------------------------------------------------------
    // Mouse interaction
    // ------------------------------------------------------------------
    describe("mouse interaction", () => {
        it("mousedown on an item selects it", async () => {
            vi.useFakeTimers();
            const input = makeInput();
            const onSelect = vi.fn();
            new AutocompleteManager(input, {
                suggestions: ["Apple", "Avocado"],
                debounce: DEBOUNCE,
                onSelect,
            });
            type(input, "av");
            await vi.advanceTimersByTimeAsync(DEBOUNCE);

            const item = getItems()[0];
            item.dispatchEvent(
                new MouseEvent("mousedown", { bubbles: true, cancelable: true }),
            );

            expect(input.value).toBe("Avocado");
            expect(onSelect).toHaveBeenCalledWith("Avocado", item);
        });

        it("mouseenter on an item makes it active", async () => {
            vi.useFakeTimers();
            const input = makeInput();
            new AutocompleteManager(input, {
                suggestions: ["Apple", "Avocado"],
                debounce: DEBOUNCE,
            });
            type(input, "a");
            await vi.advanceTimersByTimeAsync(DEBOUNCE);

            const items = getItems();
            mouseEnter(items[1]);
            expect(
                items[1].classList.contains("autocomplete__item--active"),
            ).toBe(true);
        });
    });

    // ------------------------------------------------------------------
    // Blur
    // ------------------------------------------------------------------
    describe("blur", () => {
        it("closes the dropdown after the blur grace period", async () => {
            vi.useFakeTimers();
            const input = makeInput();
            new AutocompleteManager(input, {
                suggestions: ["Apple"],
                debounce: DEBOUNCE,
            });
            type(input, "ap");
            await vi.advanceTimersByTimeAsync(DEBOUNCE);
            expect(getContainer()!.style.display).toBe("block");

            input.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
            // 150ms delayed close
            await vi.advanceTimersByTimeAsync(150);
            expect(getContainer()!.style.display).toBe("none");
        });
    });

    // ------------------------------------------------------------------
    // destroy
    // ------------------------------------------------------------------
    describe("destroy", () => {
        it("removes the container and detaches listeners", async () => {
            vi.useFakeTimers();
            const input = makeInput();
            const ac = new AutocompleteManager(input, {
                suggestions: ["Apple"],
                debounce: DEBOUNCE,
            });
            type(input, "ap");
            await vi.advanceTimersByTimeAsync(DEBOUNCE);
            expect(getContainer()).not.toBeNull();

            ac.destroy();

            expect(getContainer()).toBeNull();
            // Subsequent input must not re-create the container or throw
            expect(() => type(input, "ap")).not.toThrow();
            await vi.advanceTimersByTimeAsync(DEBOUNCE);
            expect(getContainer()).toBeNull();
        });
    });
});
