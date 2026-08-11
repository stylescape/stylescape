// ============================================================================
// Stylescape | Accordion State Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AccordionState } from "../../src/ts/storage/AccordionState";

const SELECTOR = "details.test-accordion";
const KEY = "test-accordion-state";

/**
 * Build one or more <details class="test-accordion"> elements in the body.
 * `defs` describes each accordion: optional id, optional heading text, open.
 */
function buildAccordions(
    defs: Array<{ id?: string; heading?: string; open?: boolean }>,
): HTMLDetailsElement[] {
    document.body.innerHTML = "";
    return defs.map((def) => {
        const details = document.createElement("details");
        details.className = "test-accordion";
        if (def.id) details.id = def.id;
        if (def.open) details.open = true;

        const summary = document.createElement("summary");
        if (def.heading) {
            const h2 = document.createElement("h2");
            h2.textContent = def.heading;
            summary.appendChild(h2);
        } else {
            summary.textContent = "Summary";
        }
        details.appendChild(summary);

        const body = document.createElement("div");
        body.textContent = "Content";
        details.appendChild(body);

        document.body.appendChild(details);
        return details;
    });
}

/** Toggle a <details> to the given open state and fire the toggle event. */
function toggle(details: HTMLDetailsElement, open: boolean): void {
    details.open = open;
    details.dispatchEvent(new Event("toggle"));
}

describe("AccordionState", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    describe("Construction", () => {
        it("constructs without throwing when no accordions match", () => {
            document.body.innerHTML = "";
            expect(() => new AccordionState(SELECTOR, KEY)).not.toThrow();
        });

        it("uses the default selector and storage key", () => {
            document.body.innerHTML =
                '<details class="ss-c-sidebar__accordion"><summary>S</summary></details>';
            const details = document.querySelector(
                "details.ss-c-sidebar__accordion",
            ) as HTMLDetailsElement;
            new AccordionState();
            toggle(details, true);
            expect(localStorage.getItem("accordion-state")).not.toBeNull();
        });
    });

    describe("Persisting state on toggle", () => {
        it("saves open state to localStorage when an accordion is toggled open", () => {
            const [details] = buildAccordions([{ id: "one" }]);
            new AccordionState(SELECTOR, KEY);

            toggle(details, true);

            const saved = JSON.parse(localStorage.getItem(KEY)!);
            expect(saved).toEqual({ one: true });
        });

        it("records closed state when an accordion is toggled shut", () => {
            const [details] = buildAccordions([{ id: "one", open: true }]);
            new AccordionState(SELECTOR, KEY);

            toggle(details, false);

            const saved = JSON.parse(localStorage.getItem(KEY)!);
            expect(saved).toEqual({ one: false });
        });

        it("tracks the state of multiple accordions independently", () => {
            const [a, b] = buildAccordions([{ id: "a" }, { id: "b" }]);
            new AccordionState(SELECTOR, KEY);

            toggle(a, true);
            toggle(b, false);

            const saved = JSON.parse(localStorage.getItem(KEY)!);
            expect(saved).toEqual({ a: true, b: false });
        });
    });

    describe("Restoring state", () => {
        it("restores a saved open accordion on construction", () => {
            localStorage.setItem(KEY, JSON.stringify({ one: true }));
            const [details] = buildAccordions([{ id: "one" }]);
            expect(details.open).toBe(false);

            new AccordionState(SELECTOR, KEY);

            expect(details.open).toBe(true);
        });

        it("restores a saved closed accordion (overriding markup default)", () => {
            localStorage.setItem(KEY, JSON.stringify({ one: false }));
            const [details] = buildAccordions([{ id: "one", open: true }]);

            new AccordionState(SELECTOR, KEY);

            expect(details.open).toBe(false);
        });

        it("leaves accordions untouched when nothing is stored", () => {
            const [details] = buildAccordions([{ id: "one", open: true }]);
            new AccordionState(SELECTOR, KEY);
            expect(details.open).toBe(true);
        });

        it("ignores saved entries that do not match any accordion id", () => {
            localStorage.setItem(KEY, JSON.stringify({ other: true }));
            const [details] = buildAccordions([{ id: "one" }]);

            new AccordionState(SELECTOR, KEY);

            expect(details.open).toBe(false);
        });

        it("does not throw and warns on corrupt JSON in storage", () => {
            const warnSpy = vi
                .spyOn(console, "warn")
                .mockImplementation(() => {});
            localStorage.setItem(KEY, "{not-valid-json");
            const [details] = buildAccordions([{ id: "one" }]);

            expect(() => new AccordionState(SELECTOR, KEY)).not.toThrow();
            expect(warnSpy).toHaveBeenCalled();
            expect(details.open).toBe(false);
        });
    });

    describe("Accordion id generation", () => {
        it("prefers the element id when present", () => {
            const [details] = buildAccordions([
                { id: "explicit", heading: "Ignored Heading" },
            ]);
            new AccordionState(SELECTOR, KEY);
            toggle(details, true);
            expect(Object.keys(JSON.parse(localStorage.getItem(KEY)!))).toEqual([
                "explicit",
            ]);
        });

        it("slugifies the summary heading text when no id is set", () => {
            const [details] = buildAccordions([{ heading: "Section One!" }]);
            new AccordionState(SELECTOR, KEY);
            toggle(details, true);
            expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({
                "section-one": true,
            });
        });

        it("falls back to index-based ids when no id or heading exists", () => {
            const [a, b] = buildAccordions([{}, {}]);
            new AccordionState(SELECTOR, KEY);
            toggle(a, true);
            toggle(b, true);
            expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({
                "accordion-0": true,
                "accordion-1": true,
            });
        });
    });

    describe("clearState", () => {
        it("removes the stored state from localStorage", () => {
            const [details] = buildAccordions([{ id: "one" }]);
            const state = new AccordionState(SELECTOR, KEY);
            toggle(details, true);
            expect(localStorage.getItem(KEY)).not.toBeNull();

            state.clearState();

            expect(localStorage.getItem(KEY)).toBeNull();
        });
    });

    describe("expandAll / collapseAll", () => {
        it("expandAll opens every accordion and persists the state", () => {
            const [a, b] = buildAccordions([{ id: "a" }, { id: "b" }]);
            const state = new AccordionState(SELECTOR, KEY);

            state.expandAll();

            expect(a.open).toBe(true);
            expect(b.open).toBe(true);
            expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({
                a: true,
                b: true,
            });
        });

        it("collapseAll closes every accordion and persists the state", () => {
            const [a, b] = buildAccordions([
                { id: "a", open: true },
                { id: "b", open: true },
            ]);
            const state = new AccordionState(SELECTOR, KEY);

            state.collapseAll();

            expect(a.open).toBe(false);
            expect(b.open).toBe(false);
            expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual({
                a: false,
                b: false,
            });
        });
    });

    describe("Storage failures are handled gracefully", () => {
        it("warns instead of throwing when setItem fails (e.g. quota)", () => {
            const [details] = buildAccordions([{ id: "one" }]);
            const state = new AccordionState(SELECTOR, KEY);

            const warnSpy = vi
                .spyOn(console, "warn")
                .mockImplementation(() => {});
            const setSpy = vi
                .spyOn(Storage.prototype, "setItem")
                .mockImplementation(() => {
                    throw new Error("QuotaExceededError");
                });

            expect(() => toggle(details, true)).not.toThrow();
            expect(() => state.expandAll()).not.toThrow();
            expect(warnSpy).toHaveBeenCalled();

            setSpy.mockRestore();
            warnSpy.mockRestore();
        });
    });
});
