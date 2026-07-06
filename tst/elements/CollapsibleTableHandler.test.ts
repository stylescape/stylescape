// ============================================================================
// Stylescape | CollapsibleTableHandler Tests
// ============================================================================
// CollapsibleTableHandler wires `.collapsible_table` widgets: clicking the
// header toggles the content's `expanded` class and flips the flipper icon.
// ============================================================================

import { beforeEach, describe, expect, it } from "vitest";
import { CollapsibleTableHandler } from "../../src/ts/elements/CollapsibleTableHandler";
import { click } from "../utils";

describe("CollapsibleTableHandler", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    function buildTable(opts: { flipper?: boolean } = {}): void {
        document.body.innerHTML = `
            <div class="collapsible_table">
                <div class="collapsible_table--header">
                    Header
                    ${opts.flipper === false ? "" : '<span class="flipper flipper--down"></span>'}
                </div>
                <div class="collapsible_table--content">Content</div>
            </div>
        `;
    }

    const header = (root: ParentNode = document) =>
        root.querySelector(".collapsible_table--header") as HTMLElement;
    const content = (root: ParentNode = document) =>
        root.querySelector(".collapsible_table--content") as HTMLElement;
    const flipper = (root: ParentNode = document) =>
        root.querySelector(".flipper--down, .flipper--up") as HTMLElement;

    describe("Toggle", () => {
        it("toggles the 'expanded' class on the content when the header is clicked", () => {
            buildTable();
            new CollapsibleTableHandler();

            expect(content().classList.contains("expanded")).toBe(false);
            click(header());
            expect(content().classList.contains("expanded")).toBe(true);
            click(header());
            expect(content().classList.contains("expanded")).toBe(false);
        });

        it("flips the flipper direction on each header click", () => {
            buildTable();
            new CollapsibleTableHandler();

            expect(flipper().classList.contains("flipper--down")).toBe(true);
            click(header());
            expect(flipper().classList.contains("flipper--up")).toBe(true);
            expect(flipper().classList.contains("flipper--down")).toBe(false);
            click(header());
            expect(flipper().classList.contains("flipper--down")).toBe(true);
        });

        it("still toggles content when there is no flipper element", () => {
            buildTable({ flipper: false });
            new CollapsibleTableHandler();

            expect(() => click(header())).not.toThrow();
            expect(content().classList.contains("expanded")).toBe(true);
        });
    });

    describe("Multiple tables", () => {
        it("manages each table independently", () => {
            document.body.innerHTML = `
                <div class="collapsible_table" id="t1">
                    <div class="collapsible_table--header">H1</div>
                    <div class="collapsible_table--content">C1</div>
                </div>
                <div class="collapsible_table" id="t2">
                    <div class="collapsible_table--header">H2</div>
                    <div class="collapsible_table--content">C2</div>
                </div>
            `;
            new CollapsibleTableHandler();

            const t1 = document.getElementById("t1")!;
            const t2 = document.getElementById("t2")!;

            click(header(t1));
            expect(content(t1).classList.contains("expanded")).toBe(true);
            expect(content(t2).classList.contains("expanded")).toBe(false);
        });
    });

    describe("Edge cases", () => {
        it("does not throw when there are no tables", () => {
            expect(() => new CollapsibleTableHandler()).not.toThrow();
        });

        it("skips a table missing its header", () => {
            document.body.innerHTML = `
                <div class="collapsible_table">
                    <div class="collapsible_table--content">Only content</div>
                </div>
            `;
            expect(() => new CollapsibleTableHandler()).not.toThrow();
            // No header means no wiring; content never gains 'expanded'.
            expect(content().classList.contains("expanded")).toBe(false);
        });

        it("skips a table missing its content", () => {
            document.body.innerHTML = `
                <div class="collapsible_table">
                    <div class="collapsible_table--header">Only header</div>
                </div>
            `;
            new CollapsibleTableHandler();
            // Header click is not wired, so nothing happens (and no throw).
            expect(() => click(header())).not.toThrow();
        });

        it("supports a custom container selector", () => {
            document.body.innerHTML = `
                <div class="my-table">
                    <div class="collapsible_table--header">H</div>
                    <div class="collapsible_table--content">C</div>
                </div>
            `;
            new CollapsibleTableHandler(".my-table");
            click(header());
            expect(content().classList.contains("expanded")).toBe(true);
        });
    });
});
