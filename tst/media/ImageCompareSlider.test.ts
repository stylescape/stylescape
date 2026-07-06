// ============================================================================
// Stylescape | ImageCompareSlider Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ImageCompareSlider } from "../../src/ts/media/ImageCompareSlider";
import { imageCompareFixture } from "../utils";

/**
 * Build a container whose class names match what ImageCompareSlider queries.
 * offsetWidth and getBoundingClientRect are stubbed to a known width so the
 * position math (which relies on layout jsdom cannot compute) is deterministic.
 */
function buildContainer(width = 200): HTMLElement {
    const container = document.createElement("div");
    container.className = "image__compare";
    container.innerHTML = `
        <img class="image__compare--image" src="after.jpg" alt="After">
        <img class="image__compare--overlay" src="before.jpg" alt="Before">
        <div class="image__compare--slider"></div>
    `;
    document.body.appendChild(container);

    Object.defineProperty(container, "offsetWidth", {
        configurable: true,
        value: width,
    });
    container.getBoundingClientRect = () =>
        ({
            left: 0,
            top: 0,
            right: width,
            bottom: 0,
            width,
            height: 0,
            x: 0,
            y: 0,
            toJSON: () => ({}),
        }) as DOMRect;

    return container;
}

const overlayOf = (c: HTMLElement) =>
    c.querySelector(".image__compare--overlay") as HTMLElement;
const handleOf = (c: HTMLElement) =>
    c.querySelector(".image__compare--slider") as HTMLElement;

function mouseMove(clientX: number) {
    window.dispatchEvent(new MouseEvent("mousemove", { clientX }));
}

describe("ImageCompareSlider", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("Construction", () => {
        it("centers the slider on init using half the container width", () => {
            const container = buildContainer(200);
            new ImageCompareSlider(container);

            // slideMove(offsetWidth / 2) => 100px
            expect(overlayOf(container).style.width).toBe("100px");
            expect(handleOf(container).style.left).toBe("100px");
        });

        it("warns and bails out when required elements are missing", () => {
            const warn = vi
                .spyOn(console, "warn")
                .mockImplementation(() => {});
            document.body.innerHTML = imageCompareFixture; // wrong class names
            const container = document.querySelector(
                ".image-compare",
            ) as HTMLElement;

            expect(() => new ImageCompareSlider(container)).not.toThrow();
            expect(warn).toHaveBeenCalled();
        });

        it("warns when the slider handle is absent", () => {
            const warn = vi
                .spyOn(console, "warn")
                .mockImplementation(() => {});
            const container = document.createElement("div");
            container.className = "image__compare";
            container.innerHTML = `
                <img class="image__compare--image" src="a.jpg">
                <img class="image__compare--overlay" src="b.jpg">`;
            document.body.appendChild(container);

            new ImageCompareSlider(container);
            expect(warn).toHaveBeenCalled();
        });
    });

    describe("Drag interaction", () => {
        it("does not move the overlay before a mousedown on the handle", () => {
            const container = buildContainer(200);
            new ImageCompareSlider(container);

            mouseMove(150); // no active drag yet
            expect(overlayOf(container).style.width).toBe("100px");
        });

        it("tracks the pointer while dragging", () => {
            const container = buildContainer(200);
            new ImageCompareSlider(container);

            handleOf(container).dispatchEvent(new MouseEvent("mousedown"));
            mouseMove(150);

            expect(overlayOf(container).style.width).toBe("150px");
            expect(handleOf(container).style.left).toBe("150px");
        });

        it("stops tracking after mouseup", () => {
            const container = buildContainer(200);
            new ImageCompareSlider(container);

            handleOf(container).dispatchEvent(new MouseEvent("mousedown"));
            mouseMove(150);
            window.dispatchEvent(new MouseEvent("mouseup"));
            mouseMove(20); // ignored — drag released

            expect(overlayOf(container).style.width).toBe("150px");
        });

        it("clamps the position within the container bounds", () => {
            const container = buildContainer(200);
            new ImageCompareSlider(container);

            handleOf(container).dispatchEvent(new MouseEvent("mousedown"));

            mouseMove(999); // beyond the right edge
            expect(overlayOf(container).style.width).toBe("200px");

            mouseMove(-50); // beyond the left edge
            expect(overlayOf(container).style.width).toBe("0px");
        });

        it("tracks touch movement", () => {
            const container = buildContainer(200);
            new ImageCompareSlider(container);

            handleOf(container).dispatchEvent(new Event("touchstart"));
            const move: Event & { touches?: unknown } = new Event("touchmove");
            (move as unknown as { touches: { clientX: number }[] }).touches = [
                { clientX: 80 },
            ];
            window.dispatchEvent(move);

            expect(overlayOf(container).style.width).toBe("80px");
        });
    });

    describe("Brightness dark-mode injection", () => {
        it("injects a dark indicator and recolors the arrow for bright images", async () => {
            const container = buildContainer(200);
            const base = container.querySelector(
                ".image__compare--image",
            ) as HTMLImageElement;
            const handle = handleOf(container);
            handle.innerHTML = `<i class="arrow--left"></i>`;

            base.dataset.darkSide = "left";
            Object.defineProperty(base, "complete", {
                configurable: true,
                value: true,
            });
            Object.defineProperty(base, "naturalWidth", {
                configurable: true,
                value: 100,
            });
            Object.defineProperty(base, "naturalHeight", {
                configurable: true,
                value: 100,
            });

            // Bright pixels -> average well above the 160 threshold.
            vi.spyOn(
                HTMLCanvasElement.prototype,
                "getContext",
            ).mockReturnValue({
                drawImage: vi.fn(),
                getImageData: () => ({
                    data: new Uint8ClampedArray(400).fill(255),
                }),
            } as unknown as CanvasRenderingContext2D);

            new ImageCompareSlider(container);
            await new Promise((r) => setTimeout(r, 0));

            expect(handle.querySelector(".dark--left")).not.toBeNull();
            const arrow = handle.querySelector(".arrow--left") as HTMLElement;
            expect(arrow.style.borderColor).toBe("var(--color_text_primary)");
        });

        it("does not inject when the canvas has no 2d context", async () => {
            const container = buildContainer(200);
            const base = container.querySelector(
                ".image__compare--image",
            ) as HTMLImageElement;
            base.dataset.darkSide = "left";
            Object.defineProperty(base, "complete", {
                configurable: true,
                value: true,
            });
            Object.defineProperty(base, "naturalWidth", {
                configurable: true,
                value: 100,
            });

            vi.spyOn(
                HTMLCanvasElement.prototype,
                "getContext",
            ).mockReturnValue(null);

            new ImageCompareSlider(container);
            await new Promise((r) => setTimeout(r, 0));

            expect(handleOf(container).querySelector(".dark--left")).toBeNull();
        });

        it("skips brightness handling when no data-dark-side is set", () => {
            const container = buildContainer(200);
            const getContext = vi.spyOn(
                HTMLCanvasElement.prototype,
                "getContext",
            );

            new ImageCompareSlider(container);

            expect(getContext).not.toHaveBeenCalled();
        });
    });

    describe("initAll", () => {
        it("initializes every matching container on the page", () => {
            const a = buildContainer(200);
            const b = buildContainer(200);

            ImageCompareSlider.initAll(".image__compare");

            expect(overlayOf(a).style.width).toBe("100px");
            expect(overlayOf(b).style.width).toBe("100px");
        });

        it("does nothing when no containers match", () => {
            expect(() =>
                ImageCompareSlider.initAll(".nothing-here"),
            ).not.toThrow();
        });
    });
});
