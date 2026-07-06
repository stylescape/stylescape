// ============================================================================
// Stylescape | Filter Manager Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FilterManager } from "../../src/ts/data/FilterManager";
import { inputValue } from "../utils";

const HTML = `
    <input id="search" type="text" />
    <ul>
        <li class="filter-item">Apple</li>
        <li class="filter-item">Banana</li>
        <li class="filter-item">Cherry</li>
        <li class="filter-item" data-tag="red">Strawberry</li>
    </ul>
`;

function items(): HTMLElement[] {
    return Array.from(document.querySelectorAll<HTMLElement>(".filter-item"));
}

describe("FilterManager", () => {
    beforeEach(() => {
        document.body.innerHTML = HTML;
    });
    afterEach(() => vi.useRealTimers());

    it("warns when the input is missing", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        new FilterManager("#missing");
        expect(warn).toHaveBeenCalled();
    });

    it("filters items by text content and toggles classes", () => {
        const fm = new FilterManager("#search");
        const matches = fm.filter("an"); // Banana

        expect(matches).toHaveLength(1);
        expect(matches[0].textContent).toBe("Banana");
        expect(matches[0].classList.contains("filter--match")).toBe(true);
        // Non-matching items get the hidden class.
        const apple = items().find((i) => i.textContent === "Apple")!;
        expect(apple.classList.contains("filter--hidden")).toBe(true);
    });

    it("is case-insensitive by default", () => {
        const fm = new FilterManager("#search");
        expect(fm.filter("APPLE")).toHaveLength(1);
    });

    it("respects caseSensitive option", () => {
        const fm = new FilterManager("#search", { caseSensitive: true });
        expect(fm.filter("apple")).toHaveLength(0);
        expect(fm.filter("Apple")).toHaveLength(1);
    });

    it("shows all items when query is under minChars", () => {
        const fm = new FilterManager("#search", { minChars: 3 });
        fm.filter("a");
        expect(items().every((i) => !i.classList.contains("filter--hidden"))).toBe(
            true,
        );
    });

    it("invokes onFilter with matches and onEmpty when nothing matches", () => {
        const onFilter = vi.fn();
        const onEmpty = vi.fn();
        const fm = new FilterManager("#search", { onFilter, onEmpty });

        fm.filter("a");
        expect(onFilter).toHaveBeenCalled();

        fm.filter("zzz");
        expect(onEmpty).toHaveBeenCalledWith("zzz");
    });

    it("can search within an attribute via searchIn", () => {
        const fm = new FilterManager("#search", { searchIn: "data-tag" });
        const matches = fm.filter("red");
        expect(matches).toHaveLength(1);
        expect(matches[0].textContent).toBe("Strawberry");
    });

    it("supports multiple searchIn sources", () => {
        const fm = new FilterManager("#search", {
            searchIn: ["textContent", "data-tag"],
        });
        expect(fm.filter("Apple")).toHaveLength(1);
        expect(fm.filter("red")).toHaveLength(1);
    });

    it("clear() empties the input and shows all items", () => {
        const fm = new FilterManager("#search");
        fm.filter("apple");
        fm.clear();

        expect((document.getElementById("search") as HTMLInputElement).value).toBe(
            "",
        );
        expect(items().every((i) => !i.classList.contains("filter--hidden"))).toBe(
            true,
        );
    });

    it("getMatches returns currently visible items", () => {
        const fm = new FilterManager("#search");
        fm.filter("Cherry");
        const matches = fm.getMatches();
        expect(matches).toHaveLength(1);
        expect(matches[0].textContent).toBe("Cherry");
    });

    it("refresh picks up newly added items", () => {
        const fm = new FilterManager("#search");
        document
            .querySelector("ul")!
            .insertAdjacentHTML(
                "beforeend",
                '<li class="filter-item">Apricot</li>',
            );
        fm.refresh();
        expect(fm.filter("Ap")).toHaveLength(2); // Apple + Apricot
    });

    it("debounces filtering on input events", () => {
        vi.useFakeTimers();
        const onFilter = vi.fn();
        new FilterManager("#search", { debounce: 200, onFilter });
        const input = document.getElementById("search") as HTMLInputElement;

        inputValue(input, "an");
        expect(onFilter).not.toHaveBeenCalled(); // debounced

        vi.advanceTimersByTime(200);
        expect(onFilter).toHaveBeenCalled();
    });

    it("applies an initial filter when the input already has a value", () => {
        (document.getElementById("search") as HTMLInputElement).value = "Cherry";
        const onFilter = vi.fn();
        new FilterManager("#search", { onFilter });
        expect(onFilter).toHaveBeenCalled();
    });

    it("destroy detaches the input listener", () => {
        vi.useFakeTimers();
        const onFilter = vi.fn();
        const fm = new FilterManager("#search", { debounce: 50, onFilter });
        fm.destroy();

        // Recreate an input reference; the old listener is gone.
        const input = document.getElementById("search") as HTMLInputElement;
        inputValue(input, "apple");
        vi.advanceTimersByTime(50);
        expect(onFilter).not.toHaveBeenCalled();
    });
});
