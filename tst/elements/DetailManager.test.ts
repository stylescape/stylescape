// ============================================================================
// Stylescape | DetailManager Tests
// ============================================================================
// DetailManager wires a single document-level click listener that enforces
// exclusive <details> behavior (only one open, click-outside closes all).
// Note: jsdom natively toggles a <details> when its <summary> is clicked, so
// tests only assert on manager-driven effects (closing the *other* details).
// ============================================================================

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DetailManager } from "../../src/ts/elements/DetailManager";
import { click } from "../utils";

describe("DetailManager", () => {
    let manager: DetailManager | undefined;

    beforeEach(() => {
        document.body.innerHTML = "";
    });

    afterEach(() => {
        // Remove the document listener so instances do not leak between tests.
        manager?.destroy();
        manager = undefined;
    });

    function buildDetails(html: string): void {
        document.body.innerHTML = html;
    }

    describe("Construction", () => {
        it("attaches a document click listener that manages matching details", () => {
            buildDetails(`
                <details id="d1" open><summary id="s1">One</summary><p>1</p></details>
                <details id="d2" open><summary id="s2">Two</summary><p>2</p></details>
            `);
            manager = new DetailManager();
            expect(manager).toBeInstanceOf(DetailManager);

            // Clicking outside closes all managed details.
            click(document.body);
            expect(document.getElementById("d1")!.hasAttribute("open")).toBe(
                false,
            );
            expect(document.getElementById("d2")!.hasAttribute("open")).toBe(
                false,
            );
        });

        it("captures details present at construction time (static list)", () => {
            buildDetails(
                `<details id="d1" open><summary>One</summary></details>`,
            );
            manager = new DetailManager();

            // A details added AFTER construction is not managed.
            const late = document.createElement("details");
            late.id = "late";
            late.setAttribute("open", "");
            late.innerHTML = "<summary>Late</summary>";
            document.body.appendChild(late);

            click(document.body);
            expect(document.getElementById("d1")!.hasAttribute("open")).toBe(
                false,
            );
            // Late one was not in the captured NodeList, so it stays open.
            expect(document.getElementById("late")!.hasAttribute("open")).toBe(
                true,
            );
        });
    });

    describe("Exclusive summary behavior", () => {
        it("closes the other details when a summary is clicked", () => {
            buildDetails(`
                <details id="d1" open><summary id="s1">One</summary><p>1</p></details>
                <details id="d2" open><summary id="s2">Two</summary><p>2</p></details>
            `);
            manager = new DetailManager();

            // Click summary of d1 -> manager closes every *other* details (d2).
            click(document.getElementById("s1")!);
            expect(document.getElementById("d2")!.hasAttribute("open")).toBe(
                false,
            );
        });
    });

    describe("Click-outside behavior", () => {
        it("closes all details when clicking outside any details", () => {
            buildDetails(`
                <details id="d1" open><summary>One</summary></details>
                <details id="d2" open><summary>Two</summary></details>
            `);
            manager = new DetailManager();

            click(document.body);
            expect(document.getElementById("d1")!.hasAttribute("open")).toBe(
                false,
            );
            expect(document.getElementById("d2")!.hasAttribute("open")).toBe(
                false,
            );
        });

        it("closes all details when clicking non-summary content inside a details", () => {
            buildDetails(`
                <details id="d1" open>
                    <summary>One</summary>
                    <p id="c1">body content</p>
                </details>
            `);
            manager = new DetailManager();

            // Clicking non-summary content has no closest('summary'),
            // so the else-branch (close all) runs.
            click(document.getElementById("c1")!);
            expect(document.getElementById("d1")!.hasAttribute("open")).toBe(
                false,
            );
        });
    });

    describe("Default selector exclusion", () => {
        it("excludes .ss-c-sidebar__accordion details from management", () => {
            buildDetails(`
                <details id="normal" open><summary>Normal</summary></details>
                <details id="sidebar" class="ss-c-sidebar__accordion" open>
                    <summary>Sidebar</summary>
                </details>
            `);
            manager = new DetailManager();

            click(document.body);
            // Normal one is managed -> closed.
            expect(
                document.getElementById("normal")!.hasAttribute("open"),
            ).toBe(false);
            // Sidebar accordion is excluded -> stays open.
            expect(
                document.getElementById("sidebar")!.hasAttribute("open"),
            ).toBe(true);
        });
    });

    describe("Custom selector", () => {
        it("only manages details matching the provided selector", () => {
            buildDetails(`
                <details id="a" class="exclusive" open><summary>A</summary></details>
                <details id="b" open><summary>B</summary></details>
            `);
            manager = new DetailManager("details.exclusive");

            click(document.body);
            expect(document.getElementById("a")!.hasAttribute("open")).toBe(
                false,
            );
            // b does not match the selector -> untouched.
            expect(document.getElementById("b")!.hasAttribute("open")).toBe(
                true,
            );
        });
    });

    describe("toggle()", () => {
        it("opens and closes a specific details element", () => {
            buildDetails(
                `<details id="d1"><summary>One</summary></details>`,
            );
            manager = new DetailManager();
            const d1 = document.getElementById("d1") as HTMLDetailsElement;

            manager.toggle(d1, true);
            expect(d1.hasAttribute("open")).toBe(true);

            manager.toggle(d1, false);
            expect(d1.hasAttribute("open")).toBe(false);
        });
    });

    describe("destroy()", () => {
        it("removes the document listener so clicks no longer close details", () => {
            buildDetails(
                `<details id="d1" open><summary>One</summary></details>`,
            );
            manager = new DetailManager();
            manager.destroy();

            const d1 = document.getElementById("d1")!;
            d1.setAttribute("open", "");
            click(document.body);
            // Listener removed -> details stays open.
            expect(d1.hasAttribute("open")).toBe(true);

            manager = undefined; // already destroyed
        });
    });
});
