// ============================================================================
// Stylescape | ExclusiveDetails Tests
// ============================================================================
// ExclusiveDetails enforces accordion behavior across a set of <details>:
// clicking one closes the others (via stopPropagation on the details), and
// clicking outside all of them closes every one.
// ============================================================================

import { beforeEach, describe, expect, it } from "vitest";
import { ExclusiveDetails } from "../../src/ts/elements/ExclusiveDetails";
import { click } from "../utils";

describe("ExclusiveDetails", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    function buildDetails(): void {
        document.body.innerHTML = `
            <details id="a" open><summary>A</summary><p>a</p></details>
            <details id="b" open><summary>B</summary><p>b</p></details>
            <details id="c" open><summary>C</summary><p>c</p></details>
        `;
    }

    const detail = (id: string) =>
        document.getElementById(id) as HTMLDetailsElement;

    describe("Construction", () => {
        it("constructs and returns an instance", () => {
            buildDetails();
            const instance = new ExclusiveDetails("details");
            expect(instance).toBeInstanceOf(ExclusiveDetails);
        });

        it("does not throw when the selector matches nothing", () => {
            expect(() => new ExclusiveDetails(".none")).not.toThrow();
        });
    });

    describe("Exclusive open", () => {
        it("closes the other details when one is clicked", () => {
            buildDetails();
            new ExclusiveDetails("details");

            // Click the <details id="a"> element directly.
            click(detail("a"));

            // The clicked one is left alone; the others are closed.
            expect(detail("a").hasAttribute("open")).toBe(true);
            expect(detail("b").hasAttribute("open")).toBe(false);
            expect(detail("c").hasAttribute("open")).toBe(false);
        });

        it("stops propagation so an inside click does not trigger close-all", () => {
            buildDetails();
            new ExclusiveDetails("details");

            click(detail("b"));

            // b stays open (its own listener stopped propagation before the
            // document-level close-all handler could run).
            expect(detail("b").hasAttribute("open")).toBe(true);
            expect(detail("a").hasAttribute("open")).toBe(false);
            expect(detail("c").hasAttribute("open")).toBe(false);
        });
    });

    describe("Click outside", () => {
        it("closes all details when clicking outside every details element", () => {
            buildDetails();
            new ExclusiveDetails("details");

            click(document.body);

            expect(detail("a").hasAttribute("open")).toBe(false);
            expect(detail("b").hasAttribute("open")).toBe(false);
            expect(detail("c").hasAttribute("open")).toBe(false);
        });

        it("does not close details when the outside click is on a contained child", () => {
            buildDetails();
            new ExclusiveDetails("details");

            // A click on content inside "a" is considered "inside" (contains),
            // so close-all does not run; the details listener closes the rest.
            const inside = detail("a").querySelector("p") as HTMLElement;
            click(inside);

            expect(detail("a").hasAttribute("open")).toBe(true);
            expect(detail("b").hasAttribute("open")).toBe(false);
        });
    });
});
