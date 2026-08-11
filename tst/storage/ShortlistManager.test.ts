// ============================================================================
// Stylescape | Shortlist Manager Tests
// ============================================================================
// NOTE: The source module `src/ts/storage/ShortlistManager.ts` is currently
// fully commented out and therefore exposes NO runtime exports (no
// `ShortlistManager` class). These tests pin that documented current behavior
// so a regression (or a re-implementation) is caught. When the class is
// uncommented, replace these with real behavioral tests.
// ============================================================================

import { describe, expect, it } from "vitest";
import * as ShortlistManagerModule from "../../src/ts/storage/ShortlistManager";

describe("ShortlistManager module (currently no implementation)", () => {
    it("imports without throwing", () => {
        expect(ShortlistManagerModule).toBeDefined();
    });

    it("exposes no runtime members", () => {
        const runtimeKeys = Object.keys(ShortlistManagerModule).filter(
            (key) =>
                (ShortlistManagerModule as Record<string, unknown>)[key] !==
                undefined,
        );
        expect(runtimeKeys).toHaveLength(0);
    });

    it("does not export a ShortlistManager class", () => {
        expect(
            (ShortlistManagerModule as Record<string, unknown>)
                .ShortlistManager,
        ).toBeUndefined();
    });
});
