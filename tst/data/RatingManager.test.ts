// ============================================================================
// Stylescape | Rating Manager Tests
// ============================================================================

import { beforeEach, describe, expect, it, vi } from "vitest";
import { RatingManager } from "../../src/ts/data/RatingManager";
import { click, keyDown, mouseEnter } from "../utils";

const HTML = `
    <div id="rating">
        <span class="star" data-value="1">★</span>
        <span class="star" data-value="2">★</span>
        <span class="star" data-value="3">★</span>
        <span class="star" data-value="4">★</span>
        <span class="star" data-value="5">★</span>
    </div>
`;

function stars(): HTMLElement[] {
    return Array.from(document.querySelectorAll<HTMLElement>("#rating .star"));
}

describe("RatingManager", () => {
    beforeEach(() => {
        document.body.innerHTML = HTML;
    });

    it("warns when the container is missing", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        new RatingManager("#missing");
        expect(warn).toHaveBeenCalled();
    });

    it("sets slider ARIA attributes on init", () => {
        new RatingManager("#rating", { max: 5, value: 2 });
        const container = document.getElementById("rating") as HTMLElement;
        expect(container.getAttribute("role")).toBe("slider");
        expect(container.getAttribute("aria-valuemin")).toBe("0");
        expect(container.getAttribute("aria-valuemax")).toBe("5");
        expect(container.getAttribute("aria-valuenow")).toBe("2");
        expect(container.getAttribute("tabindex")).toBe("0");
    });

    it("creates star elements when none are present", () => {
        document.body.innerHTML = `<div id="empty"></div>`;
        new RatingManager("#empty", { max: 4 });
        expect(document.querySelectorAll("#empty .rating__star")).toHaveLength(4);
    });

    it("reflects the initial value with active classes", () => {
        new RatingManager("#rating", { value: 3 });
        const s = stars();
        expect(s[0].classList.contains("rating__star--active")).toBe(true);
        expect(s[2].classList.contains("rating__star--active")).toBe(true);
        expect(s[3].classList.contains("rating__star--active")).toBe(false);
    });

    it("clicking a star sets the rating and fires onChange", () => {
        const onChange = vi.fn();
        const rating = new RatingManager("#rating", { onChange });

        click(stars()[3]); // data-value 4
        expect(rating.getValue()).toBe(4);
        expect(onChange).toHaveBeenCalledWith(4);
        expect(
            document.getElementById("rating")?.getAttribute("aria-valuenow"),
        ).toBe("4");
    });

    it("setValue clamps to the [0, max] range", () => {
        const rating = new RatingManager("#rating", { max: 5 });
        rating.setValue(99);
        expect(rating.getValue()).toBe(5);
        rating.setValue(-3);
        expect(rating.getValue()).toBe(0);
    });

    it("rounds fractional values when half is disabled", () => {
        const rating = new RatingManager("#rating", { half: false });
        rating.setValue(3.4);
        expect(rating.getValue()).toBe(3);
    });

    it("preserves half values when half is enabled", () => {
        const rating = new RatingManager("#rating", { half: true });
        rating.setValue(2.5);
        expect(rating.getValue()).toBe(2.5);
    });

    it("supports keyboard navigation", () => {
        const rating = new RatingManager("#rating", { value: 2 });
        const container = document.getElementById("rating") as HTMLElement;

        keyDown(container, "ArrowRight");
        expect(rating.getValue()).toBe(3);
        keyDown(container, "ArrowLeft");
        expect(rating.getValue()).toBe(2);
        keyDown(container, "End");
        expect(rating.getValue()).toBe(5);
        keyDown(container, "Home");
        expect(rating.getValue()).toBe(0);
    });

    it("uses half-steps for keyboard nav when half is enabled", () => {
        const rating = new RatingManager("#rating", { value: 2, half: true });
        keyDown(document.getElementById("rating") as HTMLElement, "ArrowRight");
        expect(rating.getValue()).toBe(2.5);
    });

    it("shows a hover preview on mouseenter", () => {
        new RatingManager("#rating");
        mouseEnter(stars()[2]); // hover value 3
        expect(stars()[0].classList.contains("rating__star--hover")).toBe(true);
        expect(stars()[2].classList.contains("rating__star--hover")).toBe(true);
        expect(stars()[3].classList.contains("rating__star--hover")).toBe(false);
    });

    it("does not attach interaction in read-only mode", () => {
        const onChange = vi.fn();
        const rating = new RatingManager("#rating", {
            readOnly: true,
            value: 2,
            onChange,
        });
        click(stars()[4]);
        expect(rating.getValue()).toBe(2);
        expect(onChange).not.toHaveBeenCalled();
    });

    it("setReadOnly toggles the readonly class and aria-readonly", () => {
        const rating = new RatingManager("#rating");
        rating.setReadOnly(true);
        const container = document.getElementById("rating") as HTMLElement;
        expect(container.classList.contains("rating--readonly")).toBe(true);
        expect(container.getAttribute("aria-readonly")).toBe("true");

        rating.setReadOnly(false);
        expect(container.hasAttribute("aria-readonly")).toBe(false);
    });

    it("reset sets the value back to 0", () => {
        const rating = new RatingManager("#rating", { value: 4 });
        rating.reset();
        expect(rating.getValue()).toBe(0);
    });

    it("assigns data-value to stars that lack one", () => {
        document.body.innerHTML = `
            <div id="r2"><span class="star">★</span><span class="star">★</span></div>
        `;
        new RatingManager("#r2");
        const s = document.querySelectorAll<HTMLElement>("#r2 .star");
        expect(s[0].getAttribute("data-value")).toBe("1");
        expect(s[1].getAttribute("data-value")).toBe("2");
    });

    it("destroy detaches listeners so clicks no longer change the value", () => {
        const rating = new RatingManager("#rating", { value: 1 });
        const star = stars()[4];
        rating.destroy();
        click(star);
        expect(rating.getValue()).toBe(1);
    });
});
