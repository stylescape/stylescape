// ============================================================================
// Stylescape | Loader Tests
// ============================================================================
// NOTE: As of the current source, `Loader.ts` is entirely commented out — the
// implementation is disabled and the module exposes NO runtime exports. These
// tests document that actual state. See the Loader bug note in the test report.
// ============================================================================

import { describe, expect, it } from "vitest";
import * as LoaderModule from "../../src/ts/elements/Loader";

describe("Loader", () => {
    it("is currently an empty module (implementation is commented out)", () => {
        expect(Object.keys(LoaderModule)).toHaveLength(0);
    });

    it("does not expose a default export", () => {
        expect(
            (LoaderModule as Record<string, unknown>).default,
        ).toBeUndefined();
    });

    it("does not expose a Loader class", () => {
        expect(
            (LoaderModule as Record<string, unknown>).Loader,
        ).toBeUndefined();
    });
});
