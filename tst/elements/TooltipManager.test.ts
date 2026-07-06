// ============================================================================
// Stylescape | TooltipManager Tests
// ============================================================================
// NOTE: As of the current source, `TooltipManager.ts` is entirely commented
// out — the implementation is disabled and the module exposes NO runtime
// exports. These tests document that actual state. See the TooltipManager bug
// note in the test report. (The live tooltip implementation lives in `Tooltip`
// / its own suite.)
// ============================================================================

import { describe, expect, it } from "vitest";
import * as TooltipManagerModule from "../../src/ts/elements/TooltipManager";

describe("TooltipManager", () => {
    it("is currently an empty module (implementation is commented out)", () => {
        expect(Object.keys(TooltipManagerModule)).toHaveLength(0);
    });

    it("does not expose a default export", () => {
        expect(
            (TooltipManagerModule as Record<string, unknown>).default,
        ).toBeUndefined();
    });

    it("does not expose a TooltipManager class", () => {
        expect(
            (TooltipManagerModule as Record<string, unknown>).TooltipManager,
        ).toBeUndefined();
    });
});
