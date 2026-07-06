// ============================================================================
// Stylescape | Shortlist Tests
// ============================================================================
// NOTE: The source module `src/ts/storage/Shortlist.ts` is currently fully
// commented out and therefore exposes NO runtime exports (no `Shortlist`
// class, no `ShortlistItem` type). These tests pin that documented current
// behavior so a regression (or a re-implementation) is caught. When the class
// is uncommented, replace these with real behavioral tests.
// ============================================================================

import { describe, expect, it } from "vitest";
import * as ShortlistModule from "../../src/ts/storage/Shortlist";

describe("Shortlist module (currently no implementation)", () => {
    it("imports without throwing", () => {
        expect(ShortlistModule).toBeDefined();
    });

    it("exposes no runtime members", () => {
        const runtimeKeys = Object.keys(ShortlistModule).filter(
            (key) =>
                (ShortlistModule as Record<string, unknown>)[key] !== undefined,
        );
        expect(runtimeKeys).toHaveLength(0);
    });

    it("does not export a Shortlist class", () => {
        expect(
            (ShortlistModule as Record<string, unknown>).Shortlist,
        ).toBeUndefined();
    });
});
