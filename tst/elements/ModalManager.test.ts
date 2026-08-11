// ============================================================================
// Stylescape | ModalManager Tests
// ============================================================================
// NOTE: As of the current source, `ModalManager.ts` is entirely commented out
// — the implementation is disabled and the module exposes NO runtime exports.
// These tests document that actual state. See the ModalManager bug note in the
// test report. (The live modal implementation lives in `Modal` / its own suite.)
// ============================================================================

import { describe, expect, it } from "vitest";
import * as ModalManagerModule from "../../src/ts/elements/ModalManager";

describe("ModalManager", () => {
    it("is currently an empty module (implementation is commented out)", () => {
        expect(Object.keys(ModalManagerModule)).toHaveLength(0);
    });

    it("does not expose a default export", () => {
        expect(
            (ModalManagerModule as Record<string, unknown>).default,
        ).toBeUndefined();
    });

    it("does not expose a ModalManager class", () => {
        expect(
            (ModalManagerModule as Record<string, unknown>).ModalManager,
        ).toBeUndefined();
    });
});
