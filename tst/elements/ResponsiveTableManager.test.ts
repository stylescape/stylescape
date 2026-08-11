// ============================================================================
// Stylescape | Responsive Table Manager Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ResponsiveTableManager } from "../../src/ts/elements/ResponsiveTableManager";

const TABLE_HTML = `
    <div id="wrap">
        <table id="myTable">
            <thead>
                <tr><th>Name</th><th>Email</th><th>Status</th></tr>
            </thead>
            <tbody>
                <tr><td>John</td><td>j@x.com</td><td>Active</td></tr>
                <tr><td>Jane</td><td>jane@x.com</td><td>Away</td></tr>
            </tbody>
        </table>
    </div>
`;

function setWidth(px: number): void {
    Object.defineProperty(window, "innerWidth", {
        value: px,
        writable: true,
        configurable: true,
    });
}

describe("ResponsiveTableManager", () => {
    beforeEach(() => {
        setWidth(1024);
        document.body.innerHTML = TABLE_HTML;
    });

    afterEach(() => setWidth(1024));

    it("auto-generates data-label attributes from headers", () => {
        new ResponsiveTableManager("#myTable", { autoLabels: true });

        const firstRowCells = document.querySelectorAll("tbody tr:first-child td");
        expect(firstRowCells[0].getAttribute("data-label")).toBe("Name");
        expect(firstRowCells[1].getAttribute("data-label")).toBe("Email");
        expect(firstRowCells[2].getAttribute("data-label")).toBe("Status");
    });

    it("does not overwrite existing data-label attributes", () => {
        document.querySelector("tbody td")?.setAttribute("data-label", "Custom");
        new ResponsiveTableManager("#myTable");
        expect(document.querySelector("tbody td")?.getAttribute("data-label")).toBe(
            "Custom",
        );
    });

    it("skips data-label generation when autoLabels is false", () => {
        new ResponsiveTableManager("#myTable", { autoLabels: false });
        expect(document.querySelector("tbody td")?.hasAttribute("data-label")).toBe(
            false,
        );
    });

    it("starts in normal mode above the breakpoint", () => {
        const mgr = new ResponsiveTableManager("#myTable", { breakpoint: 768 });
        expect(mgr.getMode()).toBe("normal");
        expect(mgr.isStacked()).toBe(false);
    });

    it("switches to stacked mode and fires onModeChange when below breakpoint", () => {
        setWidth(500);
        const onModeChange = vi.fn();
        const mgr = new ResponsiveTableManager("#myTable", {
            breakpoint: 768,
            onModeChange,
        });

        expect(mgr.isStacked()).toBe(true);
        expect(
            document.getElementById("myTable")?.classList.contains(
                "table--stacked",
            ),
        ).toBe(true);
        expect(onModeChange).toHaveBeenCalledWith("stacked");
    });

    it("reacts to window resize events", () => {
        const mgr = new ResponsiveTableManager("#myTable", { breakpoint: 768 });
        expect(mgr.isStacked()).toBe(false);

        setWidth(400);
        window.dispatchEvent(new Event("resize"));
        expect(mgr.isStacked()).toBe(true);
    });

    it("forceStacked / forceNormal override viewport detection", () => {
        const mgr = new ResponsiveTableManager("#myTable");
        mgr.forceStacked();
        expect(mgr.getMode()).toBe("stacked");
        mgr.forceNormal();
        expect(mgr.getMode()).toBe("normal");
    });

    it("setBreakpoint re-evaluates the current mode", () => {
        setWidth(700);
        const mgr = new ResponsiveTableManager("#myTable", { breakpoint: 600 });
        expect(mgr.isStacked()).toBe(false);
        mgr.setBreakpoint(800);
        expect(mgr.isStacked()).toBe(true);
    });

    it("refresh re-reads headers and applies labels to new rows", () => {
        const mgr = new ResponsiveTableManager("#myTable");
        const tbody = document.querySelector("tbody") as HTMLElement;
        tbody.insertAdjacentHTML(
            "beforeend",
            "<tr><td>New</td><td>new@x.com</td><td>Busy</td></tr>",
        );
        mgr.refresh();
        const newRow = tbody.querySelector("tr:last-child");
        expect(newRow?.querySelector("td")?.getAttribute("data-label")).toBe(
            "Name",
        );
    });

    it("accepts a wrapper element and finds the inner table", () => {
        const mgr = new ResponsiveTableManager(
            document.getElementById("wrap") as HTMLElement,
        );
        expect(mgr.getMode()).toBe("normal");
        expect(document.querySelector("tbody td")?.hasAttribute("data-label")).toBe(
            true,
        );
    });

    it("is a no-op when no table is present", () => {
        document.body.innerHTML = `<div id="empty"></div>`;
        expect(
            () => new ResponsiveTableManager("#empty"),
        ).not.toThrow();
    });

    it("destroy removes the stacked class and listeners", () => {
        setWidth(400);
        const mgr = new ResponsiveTableManager("#myTable", { breakpoint: 768 });
        expect(mgr.isStacked()).toBe(true);
        mgr.destroy();
        expect(
            document.getElementById("myTable")?.classList.contains(
                "table--stacked",
            ),
        ).toBe(false);
    });

    it("initTables constructs managers for all tagged tables", () => {
        document.body.innerHTML = `
            <table data-ss="table-responsive" data-ss-table-breakpoint="600">
                <thead><tr><th>A</th></tr></thead>
                <tbody><tr><td>1</td></tr></tbody>
            </table>
        `;
        const managers = ResponsiveTableManager.initTables();
        expect(managers).toHaveLength(1);
    });
});
