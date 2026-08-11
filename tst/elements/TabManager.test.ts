// ============================================================================
// Stylescape | TabManager Tests
// ============================================================================
// NOTE: As of the current source, `TabManager.ts` is entirely commented out —
// the implementation is disabled and the module exposes NO runtime exports.
// These tests document that actual state. See the TabManager bug note in the
// test report.
// ============================================================================

import { describe, expect, it } from "vitest";
import * as TabManagerModule from "../../src/ts/elements/TabManager";

describe("TabManager", () => {
    it("is currently an empty module (implementation is commented out)", () => {
        expect(Object.keys(TabManagerModule)).toHaveLength(0);
    });

    it("does not expose a default export", () => {
        expect(
            (TabManagerModule as Record<string, unknown>).default,
        ).toBeUndefined();
    });

    it("does not expose a TabManager class", () => {
        expect(
            (TabManagerModule as Record<string, unknown>).TabManager,
        ).toBeUndefined();
    });
});
