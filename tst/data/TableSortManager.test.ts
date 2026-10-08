// ============================================================================
// Stylescape | TableSortManager Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TableSortManager } from "../../src/ts/data/TableSortManager";

const markup = `
<table class="ss-c-table" id="t">
    <thead>
        <tr>
            <th id="h-name"><button class="ss-c-table__sort" type="button">Name</button></th>
            <th id="h-size"><button class="ss-c-table__sort" type="button">Size</button></th>
            <th id="h-date" data-ss-sortable>Modified</th>
            <th id="h-notes">Notes</th>
        </tr>
    </thead>
    <tbody>
        <tr><td>beta</td><td data-sort-value="2048">2 KB</td><td data-sort-value="2026-03-01">1 Mar</td><td>b</td></tr>
        <tr><td>Alpha</td><td data-sort-value="512">512 B</td><td data-sort-value="2026-10-08">8 Oct</td><td>a</td></tr>
        <tr><td>item 10</td><td data-sort-value="1,000,000">1 MB</td><td data-sort-value="2025-12-24">24 Dec</td><td>c</td></tr>
        <tr><td>item 2</td><td></td><td data-sort-value="2026-01-15">15 Jan</td><td>d</td></tr>
    </tbody>
</table>`;

const $ = (id: string) => document.getElementById(id) as HTMLElement;
const column = (index: number) =>
    Array.from(($("t") as HTMLTableElement).tBodies[0].rows, (row) =>
        row.cells[index].textContent?.trim(),
    );
const clickHeader = (id: string) =>
    ($(id).querySelector(".ss-c-table__sort") as HTMLButtonElement).click();

describe("TableSortManager", () => {
    let manager: TableSortManager;

    beforeEach(() => {
        document.body.innerHTML = markup;
        manager = new TableSortManager("#t");
    });

    afterEach(() => {
        manager.destroy();
        vi.restoreAllMocks();
    });

    it("sorts text with a natural, case-insensitive order", () => {
        clickHeader("h-name");
        expect(column(0)).toEqual(["Alpha", "beta", "item 2", "item 10"]);
        expect($("h-name").getAttribute("aria-sort")).toBe("ascending");
    });

    it("toggles to descending on the second click", () => {
        clickHeader("h-name");
        clickHeader("h-name");
        expect(column(0)).toEqual(["item 10", "item 2", "beta", "Alpha"]);
        expect($("h-name").getAttribute("aria-sort")).toBe("descending");
    });

    it("sorts numbers by data-sort-value and keeps blanks last", () => {
        clickHeader("h-size");
        expect(column(1)).toEqual(["512 B", "2 KB", "1 MB", ""]);
        clickHeader("h-size");
        expect(column(1)).toEqual(["1 MB", "2 KB", "512 B", ""]);
    });

    it("moves aria-sort to the active column only", () => {
        clickHeader("h-name");
        clickHeader("h-size");
        expect($("h-name").hasAttribute("aria-sort")).toBe(false);
        expect($("h-size").getAttribute("aria-sort")).toBe("ascending");
    });

    it("wraps data-ss-sortable headers in a sort button", () => {
        const button = $("h-date").querySelector("button.ss-c-table__sort");
        expect(button?.textContent).toBe("Modified");
        expect((button as HTMLButtonElement).type).toBe("button");
        clickHeader("h-date");
        expect(column(2)).toEqual(["24 Dec", "15 Jan", "1 Mar", "8 Oct"]);
    });

    it("leaves columns without a sort button alone", () => {
        expect($("h-notes").querySelector("button")).toBeNull();
        $("h-notes").click();
        expect(column(3)).toEqual(["b", "a", "c", "d"]);
    });

    it("honours data-ss-sort-type=text on numeric-looking columns", () => {
        manager.destroy();
        document.body.innerHTML = markup;
        $("h-size").dataset.ssSortType = "text";
        manager = new TableSortManager($("t") as HTMLTableElement);
        clickHeader("h-size");
        // As text the blank sorts first, and the separators split
        // "1,000,000" into the run "1", which precedes 512 and 2048.
        expect(column(1)).toEqual(["", "1 MB", "512 B", "2 KB"]);
    });

    it("is stable for equal keys", () => {
        manager.destroy();
        document.body.innerHTML = markup;
        const rows = ($("t") as HTMLTableElement).tBodies[0].rows;
        Array.from(rows).forEach((r) => (r.cells[3].textContent = "same"));
        manager = new TableSortManager("#t");
        const before = column(0);
        manager.sort(3, "ascending");
        expect(column(0)).toEqual(before);
        manager.sort(3, "descending");
        expect(column(0)).toEqual(before);
    });

    it("reports sorts through onSort and an ss:table-sort event", () => {
        manager.destroy();
        document.body.innerHTML = markup;
        const onSort = vi.fn();
        const listener = vi.fn();
        $("t").addEventListener("ss:table-sort", listener);
        manager = new TableSortManager("#t", { onSort });
        clickHeader("h-size");
        expect(onSort).toHaveBeenCalledWith(1, "ascending");
        expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({
            columnIndex: 1,
            direction: "ascending",
        });
    });

    it("starts from an authored aria-sort state", () => {
        manager.destroy();
        document.body.innerHTML = markup;
        $("h-name").setAttribute("aria-sort", "ascending");
        manager = new TableSortManager("#t");
        clickHeader("h-name");
        expect($("h-name").getAttribute("aria-sort")).toBe("descending");
    });

    it("stops sorting after destroy()", () => {
        manager.destroy();
        clickHeader("h-name");
        expect(column(0)).toEqual(["beta", "Alpha", "item 10", "item 2"]);
    });

    it("warns when the table is missing", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        new TableSortManager("#missing");
        expect(warn).toHaveBeenCalled();
    });
});
