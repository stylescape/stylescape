// ============================================================================
// Stylescape | ImageZoomManager Tests
// ============================================================================

import { beforeEach, describe, expect, it } from "vitest";
import ImageZoomManager from "../../src/ts/media/ImageZoomManager";

/** Extract the numeric scale factor from an element's transform. */
function scaleOf(el: HTMLElement): number {
    const match = el.style.transform.match(/scale\(([^)]+)\)/);
    return match ? parseFloat(match[1]) : NaN;
}

describe("ImageZoomManager", () => {
    let image: HTMLImageElement;

    beforeEach(() => {
        document.body.innerHTML = `<img id="zoomImage" src="pic.jpg" alt="Zoom">`;
        image = document.getElementById("zoomImage") as HTMLImageElement;
    });

    describe("Construction", () => {
        it("throws lazily when the image id is missing", () => {
            const zoom = new ImageZoomManager("missing");
            // The element is resolved to null in the constructor, so the
            // failure surfaces on first use.
            expect(() => zoom.zoomIn()).toThrow();
        });

        it("does not apply any transform before interaction", () => {
            new ImageZoomManager("zoomImage");
            expect(image.style.transform).toBe("");
        });
    });

    describe("zoomIn", () => {
        it("applies the initial 1.2x scale on the first call", () => {
            const zoom = new ImageZoomManager("zoomImage");
            zoom.zoomIn();
            expect(scaleOf(image)).toBeCloseTo(1.2, 5);
        });

        it("compounds the scale on each subsequent call", () => {
            const zoom = new ImageZoomManager("zoomImage");
            zoom.zoomIn();
            zoom.zoomIn();
            // Second call writes the factor accumulated after the first call.
            expect(scaleOf(image)).toBeCloseTo(1.44, 5);
            zoom.zoomIn();
            expect(scaleOf(image)).toBeCloseTo(1.728, 5);
        });
    });

    describe("zoomOut", () => {
        it("shrinks below the base factor from the initial state", () => {
            const zoom = new ImageZoomManager("zoomImage");
            zoom.zoomOut();
            // zoomOut divides *before* writing the transform.
            expect(scaleOf(image)).toBeCloseTo(1, 5);
        });

        it("returns to base scale when a zoomIn is undone by a zoomOut", () => {
            const zoom = new ImageZoomManager("zoomImage");
            zoom.zoomIn(); // factor -> 1.44, transform scale(1.2)
            zoom.zoomOut(); // factor -> 1.2, transform scale(1.2)
            expect(scaleOf(image)).toBeCloseTo(1.2, 5);
        });
    });
});
