// ============================================================================
// Stylescape | DropdownHandler Tests
// ============================================================================
// DropdownHandler wires `.select_dropdown` widgets: header toggles the menu
// `active` class and flipper direction, checkbox changes update the
// `#selected-count` label, and an outside click collapses open menus.
// ============================================================================

import { beforeEach, describe, expect, it } from "vitest";
import { DropdownHandler } from "../../src/ts/elements/DropdownHandler";
import { click } from "../utils";

describe("DropdownHandler", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    function buildDropdown(checkedCount = 0): HTMLElement {
        const boxes = [0, 1, 2]
            .map(
                (i) =>
                    `<label><input type="checkbox" ${i < checkedCount ? "checked" : ""} /> Option ${i}</label>`,
            )
            .join("");
        document.body.innerHTML = `
            <div class="select_dropdown">
                <div class="select_dropdown--header">
                    <span id="selected-count"></span>
                    <span class="flipper flipper--down"></span>
                </div>
                <div class="select_dropdown--menu dropdown--collapse">
                    ${boxes}
                </div>
            </div>
        `;
        return document.querySelector(".select_dropdown") as HTMLElement;
    }

    const header = () =>
        document.querySelector(".select_dropdown--header") as HTMLElement;
    const menu = () =>
        document.querySelector(".dropdown--collapse") as HTMLElement;
    const flipper = () =>
        document.querySelector(".flipper--down, .flipper--up") as HTMLElement;
    const countSpan = () =>
        document.getElementById("selected-count") as HTMLElement;

    describe("Initial state", () => {
        it("writes the initial selection label on construction", () => {
            buildDropdown(2);
            new DropdownHandler();
            expect(countSpan().textContent).toBe("Selected: 2 options");
        });

        it("does not throw when there are no dropdowns", () => {
            expect(() => new DropdownHandler()).not.toThrow();
        });
    });

    describe("Header toggle", () => {
        it("toggles the menu 'active' class when the header is clicked", () => {
            buildDropdown();
            new DropdownHandler();

            expect(menu().classList.contains("active")).toBe(false);
            click(header());
            expect(menu().classList.contains("active")).toBe(true);
            click(header());
            expect(menu().classList.contains("active")).toBe(false);
        });

        it("flips the flipper direction on each header click", () => {
            buildDropdown();
            new DropdownHandler();

            expect(flipper().classList.contains("flipper--down")).toBe(true);
            click(header());
            expect(flipper().classList.contains("flipper--up")).toBe(true);
            expect(flipper().classList.contains("flipper--down")).toBe(false);
            click(header());
            expect(flipper().classList.contains("flipper--down")).toBe(true);
            expect(flipper().classList.contains("flipper--up")).toBe(false);
        });
    });

    describe("Selection label", () => {
        it("updates the count when a checkbox changes (plural)", () => {
            buildDropdown(0);
            new DropdownHandler();
            expect(countSpan().textContent).toBe("Selected: 0 options");

            const boxes = document.querySelectorAll<HTMLInputElement>(
                'input[type="checkbox"]',
            );
            boxes[0].checked = true;
            boxes[0].dispatchEvent(new Event("change", { bubbles: true }));
            expect(countSpan().textContent).toBe("Selected: 1 option");

            boxes[1].checked = true;
            boxes[1].dispatchEvent(new Event("change", { bubbles: true }));
            expect(countSpan().textContent).toBe("Selected: 2 options");
        });

        it("uses the singular form for exactly one selection", () => {
            buildDropdown(1);
            new DropdownHandler();
            expect(countSpan().textContent).toBe("Selected: 1 option");
        });
    });

    describe("Outside click", () => {
        it("collapses an open menu when clicking outside the dropdown", () => {
            buildDropdown();
            new DropdownHandler();

            click(header()); // open
            expect(menu().classList.contains("active")).toBe(true);

            click(document.body); // outside
            expect(menu().classList.contains("active")).toBe(false);
        });

        it("keeps the menu open when clicking inside the dropdown", () => {
            buildDropdown();
            new DropdownHandler();

            click(header()); // open
            expect(menu().classList.contains("active")).toBe(true);

            // Click a checkbox label inside the dropdown (bubbles to document).
            const inside = document.querySelector(
                ".select_dropdown--menu label",
            ) as HTMLElement;
            click(inside);
            expect(menu().classList.contains("active")).toBe(true);
        });
    });

    describe("Edge cases", () => {
        it("skips dropdowns without a header without throwing", () => {
            document.body.innerHTML = `
                <div class="select_dropdown">
                    <div class="select_dropdown--menu dropdown--collapse"></div>
                </div>
            `;
            expect(() => new DropdownHandler()).not.toThrow();
        });

        it("supports a custom container selector", () => {
            document.body.innerHTML = `
                <div class="my-dd">
                    <div class="select_dropdown--header">
                        <span class="flipper flipper--down"></span>
                    </div>
                    <div class="select_dropdown--menu dropdown--collapse"></div>
                </div>
            `;
            new DropdownHandler(".my-dd");
            click(header());
            expect(menu().classList.contains("active")).toBe(true);
        });
    });
});
