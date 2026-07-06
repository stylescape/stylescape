// ============================================================================
// Stylescape | GalleryManager Tests
// ============================================================================

import { beforeEach, describe, expect, it } from "vitest";
import GalleryManager from "../../src/ts/media/GalleryManager";
import { click } from "../utils";

const galleryFixture = `
<div id="imageGallery">
    <img src="thumb1.jpg" alt="Image 1">
    <img src="thumb2.jpg" alt="Image 2">
    <img src="thumb3.jpg" alt="Image 3">
</div>
`;

describe("GalleryManager", () => {
    let images: NodeListOf<HTMLImageElement>;

    beforeEach(() => {
        document.body.innerHTML = galleryFixture;
        images = document.querySelectorAll<HTMLImageElement>(
            "#imageGallery img",
        );
    });

    describe("Construction", () => {
        it("starts at index 0", () => {
            const gallery = new GalleryManager("#imageGallery");
            expect(gallery.getCurrentIndex()).toBe(0);
        });

        it("does not throw for a selector matching no images", () => {
            expect(() => new GalleryManager("#nope")).not.toThrow();
        });
    });

    describe("Click selection", () => {
        it("selects the image that was clicked", () => {
            const gallery = new GalleryManager("#imageGallery");
            click(images[2]);
            expect(gallery.getCurrentIndex()).toBe(2);
        });

        it("updates the current index across multiple clicks", () => {
            const gallery = new GalleryManager("#imageGallery");
            click(images[1]);
            expect(gallery.getCurrentIndex()).toBe(1);
            click(images[0]);
            expect(gallery.getCurrentIndex()).toBe(0);
        });
    });

    describe("nextImage / prevImage", () => {
        it("advances to the next image", () => {
            const gallery = new GalleryManager("#imageGallery");
            gallery.nextImage();
            expect(gallery.getCurrentIndex()).toBe(1);
        });

        it("wraps to the first image after the last", () => {
            const gallery = new GalleryManager("#imageGallery");
            click(images[2]); // index 2 (last)
            gallery.nextImage();
            expect(gallery.getCurrentIndex()).toBe(0);
        });

        it("wraps to the last image when going back from the first", () => {
            const gallery = new GalleryManager("#imageGallery");
            gallery.prevImage();
            expect(gallery.getCurrentIndex()).toBe(2);
        });

        it("moves backward within the gallery", () => {
            const gallery = new GalleryManager("#imageGallery");
            click(images[2]);
            gallery.prevImage();
            expect(gallery.getCurrentIndex()).toBe(1);
        });
    });

    describe("Edge cases", () => {
        it("yields NaN when navigating an empty gallery (division by zero)", () => {
            document.body.innerHTML = `<div id="empty"></div>`;
            const gallery = new GalleryManager("#empty");
            expect(gallery.getCurrentIndex()).toBe(0);
            gallery.nextImage();
            expect(Number.isNaN(gallery.getCurrentIndex())).toBe(true);
        });
    });
});
