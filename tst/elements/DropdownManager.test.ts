// ============================================================================
// Stylescape | DropdownManager Tests
// ============================================================================
// NOTE: As of the current source, `DropdownManager.ts` is entirely commented
// out — the implementation is disabled and the module exposes NO runtime
// exports. These tests document that actual state. See the DropdownManager
// bug note in the test report. (The live dropdown implementation lives in
// `DropdownHandler.ts`, which has its own test suite.)
// ============================================================================

import { describe, expect, it } from "vitest";
import * as DropdownManagerModule from "../../src/ts/elements/DropdownManager";

describe("DropdownManager", () => {
    it("is currently an empty module (implementation is commented out)", () => {
        expect(Object.keys(DropdownManagerModule)).toHaveLength(0);
    });

    it("does not expose a default export", () => {
        expect(
            (DropdownManagerModule as Record<string, unknown>).default,
        ).toBeUndefined();
    });

    it("does not expose a DropdownManager class", () => {
        expect(
            (DropdownManagerModule as Record<string, unknown>).DropdownManager,
        ).toBeUndefined();
    });
});
