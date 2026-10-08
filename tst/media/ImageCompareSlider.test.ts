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
    stubWidth(container, width);
    return container;
}

/** Current `ss-c-image-compare` markup. */
function buildModuleContainer(width = 200): HTMLElement {
    const container = document.createElement("figure");
    container.className = "ss-c-image-compare";
    container.innerHTML = `
        <img class="ss-c-image-compare__image" src="after.jpg" alt="After">
        <img class="ss-c-image-compare__overlay" src="before.jpg" alt="Before">
        <div class="ss-c-image-compare__handle"></div>
    `;
    document.body.appendChild(container);
    stubWidth(container, width);
    return container;
}

function stubWidth(container: HTMLElement, width: number): void {
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
            expect(arrow.style.borderColor).toBe(
                "var(--ss-color-text-primary)",
            );
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

            expect(
                handleOf(container).querySelector(".dark--left"),
            ).toBeNull();
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
    describe("ss-c-image-compare markup", () => {
        const handle = (c: HTMLElement) =>
            c.querySelector(".ss-c-image-compare__handle") as HTMLElement;
        const key = (el: HTMLElement, k: string) =>
            el.dispatchEvent(
                new KeyboardEvent("keydown", { key: k, bubbles: true }),
            );

        it("drives the position through a custom property", () => {
            const c = buildModuleContainer(200);
            new ImageCompareSlider(c);

            expect(
                c.style.getPropertyValue("--ss-image-compare-position"),
            ).toBe("50%");
            // The module CSS clips the overlay, so no inline width is set.
            expect(
                (
                    c.querySelector(
                        ".ss-c-image-compare__overlay",
                    ) as HTMLElement
                ).style.width,
            ).toBe("");
        });

        it("exposes the handle as a keyboard slider", () => {
            const c = buildModuleContainer(200);
            new ImageCompareSlider(c);
            const h = handle(c);

            expect(h.getAttribute("role")).toBe("slider");
            expect(h.tabIndex).toBe(0);
            expect(h.getAttribute("aria-label")).toBe("Comparison position");
            expect(h.getAttribute("aria-valuemin")).toBe("0");
            expect(h.getAttribute("aria-valuemax")).toBe("100");
            expect(h.getAttribute("aria-valuenow")).toBe("50");
        });

        it("keeps an author-provided label", () => {
            const c = buildModuleContainer(200);
            handle(c).setAttribute("aria-label", "Before/after split");
            new ImageCompareSlider(c);
            expect(handle(c).getAttribute("aria-label")).toBe(
                "Before/after split",
            );
        });

        it("moves with arrow, page, Home and End keys", () => {
            const c = buildModuleContainer(200);
            const onChange = vi.fn();
            const slider = new ImageCompareSlider(c, { step: 10, onChange });
            const h = handle(c);

            key(h, "ArrowRight");
            expect(slider.value).toBe(60);
            key(h, "ArrowLeft");
            key(h, "ArrowDown");
            expect(slider.value).toBe(40);
            key(h, "PageUp");
            expect(slider.value).toBe(80);
            key(h, "End");
            expect(slider.value).toBe(100);
            key(h, "ArrowRight");
            expect(slider.value).toBe(100);
            key(h, "Home");
            expect(slider.value).toBe(0);
            expect(h.getAttribute("aria-valuetext")).toBe("0%");
            expect(onChange).toHaveBeenLastCalledWith(0);
        });

        it("reads the initial position from data-ss-image-compare-position", () => {
            const c = buildModuleContainer(200);
            c.dataset.ssImageComparePosition = "25";
            const slider = new ImageCompareSlider(c);
            expect(slider.value).toBe(25);
        });

        it("prefers the initialPosition option", () => {
            const c = buildModuleContainer(200);
            c.dataset.ssImageComparePosition = "25";
            const slider = new ImageCompareSlider(c, { initialPosition: 70 });
            expect(slider.value).toBe(70);
        });

        it("tracks dragging as a percentage", () => {
            const c = buildModuleContainer(200);
            const slider = new ImageCompareSlider(c);

            handle(c).dispatchEvent(new MouseEvent("mousedown"));
            mouseMove(50);
            expect(slider.value).toBe(25);
            expect(
                c.style.getPropertyValue("--ss-image-compare-position"),
            ).toBe("25%");
        });

        it("stops listening after destroy()", () => {
            const c = buildModuleContainer(200);
            const slider = new ImageCompareSlider(c);
            slider.destroy();

            handle(c).dispatchEvent(new MouseEvent("mousedown"));
            mouseMove(20);
            key(handle(c), "End");
            expect(slider.value).toBe(50);
        });

        it("initAll() picks up current and legacy containers by default", () => {
            document.body.innerHTML = "";
            buildModuleContainer(200);
            buildContainer(200);
            expect(ImageCompareSlider.initAll()).toHaveLength(2);
        });
    });
});
