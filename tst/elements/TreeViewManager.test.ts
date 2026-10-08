// ============================================================================
// Stylescape | TreeViewManager Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TreeViewManager } from "../../src/ts/elements/TreeViewManager";

const markup = `
<ul class="ss-c-tree" id="tree" aria-label="Model">
    <li id="site" aria-expanded="true">
        <span class="ss-c-tree__label">Site</span>
        <ul>
            <li id="building">
                <span class="ss-c-tree__label">Building</span>
                <ul>
                    <li id="storey1"><span class="ss-c-tree__label">Storey 1</span></li>
                    <li id="storey2"><span class="ss-c-tree__label">Storey 2</span></li>
                </ul>
            </li>
            <li id="bridge"><span class="ss-c-tree__label">Bridge</span></li>
        </ul>
    </li>
    <li id="docs">Documents <a href="#docs-page">open</a></li>
    <li id="beams"><span class="ss-c-tree__label">Beams</span></li>
</ul>`;

const $ = (id: string) => document.getElementById(id) as HTMLElement;
const press = (el: HTMLElement, key: string) =>
    el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));

describe("TreeViewManager", () => {
    let tree: TreeViewManager;

    beforeEach(() => {
        document.body.innerHTML = markup;
        tree = new TreeViewManager("#tree");
    });

    afterEach(() => {
        tree.destroy();
        vi.restoreAllMocks();
    });

    describe("Setup", () => {
        it("applies the tree, treeitem and group roles", () => {
            expect($("tree").getAttribute("role")).toBe("tree");
            expect($("site").getAttribute("role")).toBe("treeitem");
            expect(
                $("site").querySelector(":scope > ul")?.getAttribute("role"),
            ).toBe("group");
            expect(tree.items).toHaveLength(7);
        });

        it("marks branches collapsed unless authored expanded; leaves get no aria-expanded", () => {
            expect($("site").getAttribute("aria-expanded")).toBe("true");
            expect($("building").getAttribute("aria-expanded")).toBe("false");
            expect($("bridge").hasAttribute("aria-expanded")).toBe(false);
        });

        it("uses a roving tabindex starting on the first item", () => {
            expect($("site").tabIndex).toBe(0);
            expect(tree.items.filter((i) => i.tabIndex === 0)).toHaveLength(1);
        });

        it("wraps loose row content in a label and removes nested tab stops", () => {
            const label = $("docs").querySelector(
                ":scope > .ss-c-tree__label",
            );
            expect(label?.textContent).toContain("Documents");
            expect(
                ($("docs").querySelector("a") as HTMLElement).tabIndex,
            ).toBe(-1);
        });

        it("starts on the selected item when one is authored", () => {
            document.body.innerHTML = markup;
            $("storey2").setAttribute("aria-selected", "true");
            const t = new TreeViewManager($("tree"));
            expect($("storey2").tabIndex).toBe(0);
            expect($("building").getAttribute("aria-expanded")).toBe("true");
            t.destroy();
        });

        it("warns when the element is missing", () => {
            const warn = vi
                .spyOn(console, "warn")
                .mockImplementation(() => {});
            new TreeViewManager("#nope");
            expect(warn).toHaveBeenCalled();
        });
    });

    describe("Keyboard", () => {
        it("ArrowDown/ArrowUp walk visible items only", () => {
            $("site").focus();
            press($("site"), "ArrowDown");
            expect(document.activeElement).toBe($("building"));
            press($("building"), "ArrowDown");
            // Building is collapsed, so its storeys are skipped.
            expect(document.activeElement).toBe($("bridge"));
            press($("bridge"), "ArrowUp");
            expect(document.activeElement).toBe($("building"));
            expect($("building").tabIndex).toBe(0);
            expect($("site").tabIndex).toBe(-1);
        });

        it("ArrowRight expands, then moves to the first child", () => {
            $("building").focus();
            press($("building"), "ArrowRight");
            expect($("building").getAttribute("aria-expanded")).toBe("true");
            expect(document.activeElement).toBe($("building"));
            press($("building"), "ArrowRight");
            expect(document.activeElement).toBe($("storey1"));
        });

        it("ArrowLeft collapses, then moves to the parent", () => {
            press($("site"), "ArrowRight"); // already open → first child
            expect(document.activeElement).toBe($("building"));
            press($("building"), "ArrowLeft");
            expect(document.activeElement).toBe($("site"));
            press($("site"), "ArrowLeft");
            expect($("site").getAttribute("aria-expanded")).toBe("false");
        });

        it("Home and End jump to the first and last visible item", () => {
            press($("site"), "End");
            expect(document.activeElement).toBe($("beams"));
            press($("beams"), "Home");
            expect(document.activeElement).toBe($("site"));
        });

        it("Enter toggles a branch and selects it", () => {
            press($("building"), "Enter");
            expect($("building").getAttribute("aria-expanded")).toBe("true");
            expect($("building").getAttribute("aria-selected")).toBe("true");
        });

        it("Enter on a leaf follows its link", () => {
            const link = $("docs").querySelector("a") as HTMLAnchorElement;
            const click = vi.fn((e: Event) => e.preventDefault());
            link.addEventListener("click", click);
            press($("docs"), "Enter");
            expect(click).toHaveBeenCalledTimes(1);
            expect($("docs").getAttribute("aria-selected")).toBe("true");
        });

        it("Space selects a single item", () => {
            press($("bridge"), " ");
            press($("beams"), " ");
            expect($("beams").getAttribute("aria-selected")).toBe("true");
            expect($("bridge").hasAttribute("aria-selected")).toBe(false);
            expect(tree.selected).toBe($("beams"));
        });

        it("* expands all sibling branches", () => {
            press($("bridge"), "*");
            expect($("building").getAttribute("aria-expanded")).toBe("true");
        });

        it("type-ahead focuses the next visible item starting with the typed text", () => {
            press($("site"), "b");
            expect(document.activeElement).toBe($("building"));
            press($("building"), "b");
            expect(document.activeElement).toBe($("bridge"));
        });

        it("type-ahead matches multi-character prefixes", () => {
            press($("site"), "b");
            press($("building"), "e");
            expect(document.activeElement).toBe($("beams"));
        });

        it("type-ahead can be disabled", () => {
            tree.destroy();
            document.body.innerHTML = markup;
            tree = new TreeViewManager("#tree", { typeahead: false });
            $("site").focus();
            press($("site"), "b");
            expect(document.activeElement).toBe($("site"));
        });

        it("selectOnFocus selects while moving", () => {
            tree.destroy();
            document.body.innerHTML = markup;
            tree = new TreeViewManager("#tree", { selectOnFocus: true });
            press($("site"), "ArrowDown");
            expect($("building").getAttribute("aria-selected")).toBe("true");
        });
    });

    describe("Mouse and API", () => {
        it("clicking a label selects and toggles the item", () => {
            const label = $("building").querySelector(
                ".ss-c-tree__label",
            ) as HTMLElement;
            label.click();
            expect($("building").getAttribute("aria-selected")).toBe("true");
            expect($("building").getAttribute("aria-expanded")).toBe("true");
            expect(document.activeElement).toBe($("building"));
        });

        it("fires callbacks and events", () => {
            tree.destroy();
            document.body.innerHTML = markup;
            const onSelect = vi.fn();
            const onToggle = vi.fn();
            const selectEvent = vi.fn();
            $("tree").addEventListener("ss:tree-select", selectEvent);
            tree = new TreeViewManager("#tree", { onSelect, onToggle });

            press($("building"), "Enter");
            expect(onSelect).toHaveBeenCalledWith($("building"));
            expect(onToggle).toHaveBeenCalledWith($("building"), true);
            expect(selectEvent).toHaveBeenCalledTimes(1);
        });

        it("expandAll / collapseAll", () => {
            tree.expandAll();
            expect(tree.visibleItems).toHaveLength(7);
            press($("site"), "End"); // focus Beams, then collapse all
            tree.collapseAll();
            expect(tree.visibleItems.map((i) => i.id)).toEqual([
                "site",
                "docs",
                "beams",
            ]);
        });

        it("collapseAll moves the tab stop out of a hidden branch", () => {
            tree.focusItem($("storey1"));
            tree.collapseAll();
            expect($("site").tabIndex).toBe(0);
        });

        it("destroy() removes keyboard handling", () => {
            tree.destroy();
            $("site").focus();
            press($("site"), "ArrowDown");
            expect(document.activeElement).toBe($("site"));
        });
    });
});
