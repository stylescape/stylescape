// ============================================================================
// Stylescape | SliderManager Tests
// ============================================================================

import { beforeEach, describe, expect, it } from "vitest";
import SliderManager from "../../src/ts/media/SliderManager";

const sliderFixture = `
<div id="mySlider">
    <div class="slide">Slide 1</div>
    <div class="slide">Slide 2</div>
    <div class="slide">Slide 3</div>
</div>
`;

describe("SliderManager", () => {
    let slides: NodeListOf<HTMLElement>;

    beforeEach(() => {
        document.body.innerHTML = sliderFixture;
        slides = document.querySelectorAll<HTMLElement>("#mySlider .slide");
    });

    const visible = () =>
        Array.from(slides).findIndex((s) => s.style.display === "block");

    describe("Construction", () => {
        it("shows only the first slide initially", () => {
            new SliderManager("#mySlider");
            expect(slides[0].style.display).toBe("block");
            expect(slides[1].style.display).toBe("none");
            expect(slides[2].style.display).toBe("none");
        });

        it("does not throw when there are no slides", () => {
            document.body.innerHTML = `<div id="mySlider"></div>`;
            expect(() => new SliderManager("#mySlider")).not.toThrow();
        });
    });

    describe("nextSlide", () => {
        it("advances to the next slide", () => {
            const slider = new SliderManager("#mySlider");
            slider.nextSlide();
            expect(visible()).toBe(1);
            expect(slides[0].style.display).toBe("none");
            expect(slides[1].style.display).toBe("block");
        });

        it("wraps around to the first slide after the last", () => {
            const slider = new SliderManager("#mySlider");
            slider.nextSlide(); // 1
            slider.nextSlide(); // 2
            slider.nextSlide(); // wrap -> 0
            expect(visible()).toBe(0);
        });
    });

    describe("prevSlide", () => {
        it("wraps to the last slide when going back from the first", () => {
            const slider = new SliderManager("#mySlider");
            slider.prevSlide();
            expect(visible()).toBe(2);
            expect(slides[2].style.display).toBe("block");
        });

        it("moves back one slide", () => {
            const slider = new SliderManager("#mySlider");
            slider.nextSlide(); // 1
            slider.prevSlide(); // 0
            expect(visible()).toBe(0);
        });
    });

    describe("Edge cases", () => {
        it("shows no slide when navigating an empty slider", () => {
            document.body.innerHTML = `<div id="mySlider"></div>`;
            const slider = new SliderManager("#mySlider");
            expect(() => slider.nextSlide()).not.toThrow();
            expect(
                document.querySelectorAll("#mySlider .slide").length,
            ).toBe(0);
        });
    });
});
