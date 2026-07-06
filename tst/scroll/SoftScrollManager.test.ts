// ============================================================================
// Stylescape | SoftScrollManager Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SoftScrollManager } from "../../src/ts/scroll/SoftScrollManager";

function clickCancelable(el: Element): MouseEvent {
    const ev = new MouseEvent("click", { bubbles: true, cancelable: true });
    el.dispatchEvent(ev);
    return ev;
}

describe("SoftScrollManager", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        // Give the root a concrete font-size so rem->px conversion is stable.
        document.documentElement.style.fontSize = "16px";
    });

    afterEach(() => {
        document.documentElement.style.fontSize = "";
    });

    it("smooth-scrolls to the target anchor and prevents default", () => {
        document.body.innerHTML = `
            <a href="#about" class="scroll-link">About</a>
            <section id="about">About</section>
        `;
        SoftScrollManager.enableForSelector(".scroll-link");

        const link = document.querySelector<HTMLElement>(".scroll-link")!;
        const ev = clickCancelable(link);

        expect(ev.defaultPrevented).toBe(true);
        // rects are all zero in jsdom, pageYOffset 0, no offset -> top 0
        expect(window.scrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: "smooth",
        });
    });

    it("subtracts the rem offset (converted to px) from the target position", () => {
        document.body.innerHTML = `
            <a href="#svc" class="scroll-link">Services</a>
            <section id="svc">Services</section>
        `;
        SoftScrollManager.enableForSelector(".scroll-link", 2);

        clickCancelable(document.querySelector<HTMLElement>(".scroll-link")!);

        // 2rem * 16px = 32px offset -> top = 0 - 32
        expect(window.scrollTo).toHaveBeenCalledWith({
            top: -32,
            behavior: "smooth",
        });
    });

    it("ignores elements that are not anchors", () => {
        document.body.innerHTML = `<div class="scroll-link">Not a link</div>`;
        SoftScrollManager.enableForSelector(".scroll-link");

        clickCancelable(document.querySelector<HTMLElement>(".scroll-link")!);
        expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it("ignores an empty '#' href", () => {
        document.body.innerHTML = `<a href="#" class="scroll-link">Top</a>`;
        SoftScrollManager.enableForSelector(".scroll-link");

        const ev = clickCancelable(
            document.querySelector<HTMLElement>(".scroll-link")!,
        );
        expect(ev.defaultPrevented).toBe(false);
        expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it("ignores non-hash hrefs", () => {
        document.body.innerHTML = `<a href="/other-page" class="scroll-link">Page</a>`;
        SoftScrollManager.enableForSelector(".scroll-link");

        const ev = clickCancelable(
            document.querySelector<HTMLElement>(".scroll-link")!,
        );
        expect(ev.defaultPrevented).toBe(false);
        expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it("warns and does not scroll when the target element is missing", () => {
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
        document.body.innerHTML = `<a href="#ghost" class="scroll-link">Ghost</a>`;
        SoftScrollManager.enableForSelector(".scroll-link");

        const ev = clickCancelable(
            document.querySelector<HTMLElement>(".scroll-link")!,
        );

        expect(ev.defaultPrevented).toBe(true);
        expect(window.scrollTo).not.toHaveBeenCalled();
        expect(warnSpy).toHaveBeenCalledWith(
            'SoftScroll: Element not found for ID "ghost"',
        );
        warnSpy.mockRestore();
    });

    it("enables multiple matching links independently", () => {
        document.body.innerHTML = `
            <a href="#one" class="scroll-link">One</a>
            <a href="#two" class="scroll-link">Two</a>
            <section id="one"></section>
            <section id="two"></section>
        `;
        SoftScrollManager.enableForSelector(".scroll-link");

        const links = document.querySelectorAll<HTMLElement>(".scroll-link");
        clickCancelable(links[0]);
        clickCancelable(links[1]);

        expect(window.scrollTo).toHaveBeenCalledTimes(2);
    });
});
