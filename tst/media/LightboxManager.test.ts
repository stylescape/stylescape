// ============================================================================
// Stylescape | LightboxManager Tests
// ============================================================================

import { beforeEach, describe, expect, it } from "vitest";
import LightboxManager from "../../src/ts/media/LightboxManager";
import { click } from "../utils";

const lightboxFixture = `
<div id="myLightbox" class="lightbox">
    <button class="close">&times;</button>
    <div class="content"></div>
</div>
`;

describe("LightboxManager", () => {
    let lightbox: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = lightboxFixture;
        lightbox = document.getElementById("myLightbox") as HTMLElement;
    });

    describe("Construction", () => {
        it("initializes without an active state", () => {
            new LightboxManager("myLightbox");
            expect(lightbox.classList.contains("active")).toBe(false);
        });

        it("throws when the lightbox id is missing", () => {
            expect(() => new LightboxManager("missing")).toThrow();
        });

        it("throws when there is no .close button", () => {
            document.body.innerHTML = `
                <div id="myLightbox"><div class="content"></div></div>`;
            expect(() => new LightboxManager("myLightbox")).toThrow();
        });
    });

    describe("showLightbox", () => {
        it("injects content and activates the lightbox", () => {
            const manager = new LightboxManager("myLightbox");
            manager.showLightbox('<img src="full.jpg" alt="Full">');

            const content = lightbox.querySelector(".content") as HTMLElement;
            expect(content.innerHTML).toBe('<img src="full.jpg" alt="Full">');
            expect(content.querySelector("img")).not.toBeNull();
            expect(lightbox.classList.contains("active")).toBe(true);
        });

        it("replaces previous content on subsequent shows", () => {
            const manager = new LightboxManager("myLightbox");
            manager.showLightbox("<p>first</p>");
            manager.showLightbox("<p>second</p>");

            const content = lightbox.querySelector(".content") as HTMLElement;
            expect(content.innerHTML).toBe("<p>second</p>");
        });
    });

    describe("hideLightbox", () => {
        it("removes the active class", () => {
            const manager = new LightboxManager("myLightbox");
            manager.showLightbox("<p>hi</p>");
            expect(lightbox.classList.contains("active")).toBe(true);

            manager.hideLightbox();
            expect(lightbox.classList.contains("active")).toBe(false);
        });

        it("closes when the .close button is clicked", () => {
            const manager = new LightboxManager("myLightbox");
            manager.showLightbox("<p>hi</p>");

            click(lightbox.querySelector(".close")!);
            expect(lightbox.classList.contains("active")).toBe(false);
        });
    });

    describe("Edge cases", () => {
        it("throws on showLightbox when there is no .content container", () => {
            document.body.innerHTML = `
                <div id="myLightbox"><button class="close">x</button></div>`;
            const manager = new LightboxManager("myLightbox");
            expect(() => manager.showLightbox("<p>x</p>")).toThrow();
        });
    });
});
