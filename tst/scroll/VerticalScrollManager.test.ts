// ============================================================================
// Stylescape | VerticalScrollManager Tests
// ============================================================================

import { beforeEach, describe, expect, it } from "vitest";
import { VerticalScrollManager } from "../../src/ts/scroll/VerticalScrollManager";
import { click } from "../utils";

function setScrollY(y: number): void {
    Object.defineProperty(window, "scrollY", { value: y, writable: true });
}

const FULL_DOM = `
    <div id="cover_arrow--up">up</div>
    <div id="content_cover_arrow">down</div>
    <div id="content_cover">cover</div>
    <div id="main">main</div>
`;

describe("VerticalScrollManager", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        setScrollY(0);
    });

    describe("Up button visibility", () => {
        it("hides the up button initially when scrolled to the top", () => {
            document.body.innerHTML = FULL_DOM;
            new VerticalScrollManager();

            const up = document.getElementById("cover_arrow--up")!;
            expect(up.style.display).toBe("none");
        });

        it("shows the up button once scrolled past the threshold", () => {
            document.body.innerHTML = FULL_DOM;
            new VerticalScrollManager();
            const up = document.getElementById("cover_arrow--up")!;

            setScrollY(200);
            window.dispatchEvent(new Event("scroll"));
            expect(up.style.display).toBe("block");

            setScrollY(50);
            window.dispatchEvent(new Event("scroll"));
            expect(up.style.display).toBe("none");
        });
    });

    describe("Up button click", () => {
        it("smooth-scrolls to the content cover element", () => {
            document.body.innerHTML = FULL_DOM;
            new VerticalScrollManager();

            click(document.getElementById("cover_arrow--up")!);

            expect(window.scrollTo).toHaveBeenCalledWith({
                top: 0,
                behavior: "smooth",
            });
        });

        it("does not scroll when the content cover element is absent", () => {
            document.body.innerHTML = `
                <div id="cover_arrow--up">up</div>
                <div id="content_cover_arrow">down</div>
            `;
            new VerticalScrollManager();

            click(document.getElementById("cover_arrow--up")!);
            expect(window.scrollTo).not.toHaveBeenCalled();
        });
    });

    describe("Down button click", () => {
        it("smooth-scrolls to the main section with the configured offset", () => {
            document.body.innerHTML = FULL_DOM;
            new VerticalScrollManager();

            click(document.getElementById("content_cover_arrow")!);

            // rect.top (0) + pageYOffset (0) + scrollOffset (-100)
            expect(window.scrollTo).toHaveBeenCalledWith({
                top: -100,
                behavior: "smooth",
            });
        });

        it("does not scroll when the main element is absent", () => {
            document.body.innerHTML = `
                <div id="cover_arrow--up">up</div>
                <div id="content_cover_arrow">down</div>
            `;
            new VerticalScrollManager();

            click(document.getElementById("content_cover_arrow")!);
            expect(window.scrollTo).not.toHaveBeenCalled();
        });
    });

    describe("Missing controls", () => {
        it("constructs without throwing when no buttons exist", () => {
            expect(() => new VerticalScrollManager()).not.toThrow();
        });
    });
});
