// ============================================================================
// Stylescape | Grid Manager Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { GridManager } from "../../src/ts/utilities/GridManager";
import { click } from "../utils";

const STORAGE_KEY = "unitgl:grid:visibility";

// GridManager auto-initialises in its constructor (jsdom readyState is
// "complete"), scanning `.guide--layer` elements and `button[data-toggle]`.
function setupDom(): void {
    document.body.innerHTML = `
        <button data-toggle="grid-a">Toggle A</button>
        <button data-toggle="grid-b">Toggle B</button>
        <div class="guide--layer" data-grid="grid-a"></div>
        <div class="guide--layer" data-grid="grid-b"></div>
    `;
}

describe("GridManager", () => {
    beforeEach(() => {
        localStorage.clear();
        setupDom();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it("restores active state from localStorage on init", () => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ "grid-a": true, "grid-b": false }),
        );

        new GridManager();

        const layerA = document.querySelector(
            '[data-grid="grid-a"]',
        ) as HTMLElement;
        const layerB = document.querySelector(
            '[data-grid="grid-b"]',
        ) as HTMLElement;
        expect(layerA.classList.contains("active")).toBe(true);
        expect(layerB.classList.contains("active")).toBe(false);
    });

    it("marks toggle buttons active to mirror stored state", () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ "grid-a": true }));

        new GridManager();

        const btnA = document.querySelector(
            'button[data-toggle="grid-a"]',
        ) as HTMLElement;
        expect(btnA.classList.contains("active")).toBe(true);
    });

    it("toggles layer visibility and persists it on button click", () => {
        new GridManager();

        const btnA = document.querySelector(
            'button[data-toggle="grid-a"]',
        ) as HTMLElement;
        const layerA = document.querySelector(
            '[data-grid="grid-a"]',
        ) as HTMLElement;

        click(btnA);

        expect(layerA.classList.contains("active")).toBe(true);
        expect(btnA.classList.contains("active")).toBe(true);
        expect(JSON.parse(localStorage.getItem(STORAGE_KEY) as string)).toEqual(
            { "grid-a": true },
        );

        click(btnA);
        expect(layerA.classList.contains("active")).toBe(false);
        expect(JSON.parse(localStorage.getItem(STORAGE_KEY) as string)).toEqual(
            { "grid-a": false },
        );
    });

    it("recovers from corrupt localStorage without throwing", () => {
        localStorage.setItem(STORAGE_KEY, "{not valid json");

        expect(() => new GridManager()).not.toThrow();

        // With no valid state, nothing is marked active.
        expect(document.querySelectorAll(".guide--layer.active")).toHaveLength(
            0,
        );
    });

    it("ignores toggle buttons that have no matching layer", () => {
        document.body.innerHTML = `<button data-toggle="orphan">Toggle</button>`;
        const gm = () => {
            new GridManager();
            click(
                document.querySelector(
                    'button[data-toggle="orphan"]',
                ) as HTMLElement,
            );
        };
        expect(gm).not.toThrow();
    });
});
