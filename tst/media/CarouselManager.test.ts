// ============================================================================
// Stylescape | CarouselManager Tests
// ============================================================================

import { beforeEach, describe, expect, it } from "vitest";
import CarouselManager from "../../src/ts/media/CarouselManager";
import { click } from "../utils";

const carouselFixture = (activeFirst = true) => `
<button id="prevBtn">Previous</button>
<button id="nextBtn">Next</button>
<div id="carouselContainer">
    <div class="carousel-item${activeFirst ? " active" : ""}">Item 1</div>
    <div class="carousel-item">Item 2</div>
    <div class="carousel-item">Item 3</div>
</div>
`;

describe("CarouselManager", () => {
    let items: NodeListOf<HTMLElement>;

    beforeEach(() => {
        document.body.innerHTML = carouselFixture();
        items = document.querySelectorAll<HTMLElement>(".carousel-item");
    });

    describe("Construction & discovery", () => {
        it("discovers all carousel items in the container", () => {
            const carousel = new CarouselManager("carouselContainer");
            expect(carousel.getTotalSlides()).toBe(3);
        });

        it("starts at index 0", () => {
            const carousel = new CarouselManager("carouselContainer");
            expect(carousel.getCurrentIndex()).toBe(0);
        });

        it("reports zero slides when container has no items", () => {
            document.body.innerHTML = `<div id="carouselContainer"></div>`;
            const carousel = new CarouselManager("carouselContainer");
            expect(carousel.getTotalSlides()).toBe(0);
        });

        it("throws when the container id does not exist", () => {
            expect(() => new CarouselManager("missingContainer")).toThrow();
        });
    });

    describe("moveNext", () => {
        it("advances the active item forward", () => {
            const carousel = new CarouselManager("carouselContainer");
            carousel.moveNext();

            expect(carousel.getCurrentIndex()).toBe(1);
            expect(items[0].classList.contains("active")).toBe(false);
            expect(items[1].classList.contains("active")).toBe(true);
        });

        it("does not advance past the last slide", () => {
            const carousel = new CarouselManager("carouselContainer");
            carousel.moveNext(); // 1
            carousel.moveNext(); // 2
            carousel.moveNext(); // clamped at 2

            expect(carousel.getCurrentIndex()).toBe(2);
            expect(items[2].classList.contains("active")).toBe(true);
        });
    });

    describe("movePrev", () => {
        it("moves the active item backward", () => {
            const carousel = new CarouselManager("carouselContainer");
            carousel.moveNext(); // 1
            carousel.movePrev(); // 0

            expect(carousel.getCurrentIndex()).toBe(0);
            expect(items[0].classList.contains("active")).toBe(true);
            expect(items[1].classList.contains("active")).toBe(false);
        });

        it("does not move before the first slide", () => {
            const carousel = new CarouselManager("carouselContainer");
            carousel.movePrev();

            expect(carousel.getCurrentIndex()).toBe(0);
        });
    });

    describe("Navigation buttons", () => {
        it("advances when #nextBtn is clicked", () => {
            const carousel = new CarouselManager("carouselContainer");
            click(document.getElementById("nextBtn")!);

            expect(carousel.getCurrentIndex()).toBe(1);
            expect(items[1].classList.contains("active")).toBe(true);
        });

        it("goes back when #prevBtn is clicked", () => {
            const carousel = new CarouselManager("carouselContainer");
            click(document.getElementById("nextBtn")!);
            click(document.getElementById("prevBtn")!);

            expect(carousel.getCurrentIndex()).toBe(0);
            expect(items[0].classList.contains("active")).toBe(true);
        });

        it("does not throw when navigation buttons are absent", () => {
            document.body.innerHTML = `
                <div id="carouselContainer">
                    <div class="carousel-item active">Item 1</div>
                    <div class="carousel-item">Item 2</div>
                </div>`;
            expect(
                () => new CarouselManager("carouselContainer"),
            ).not.toThrow();
        });
    });
});
