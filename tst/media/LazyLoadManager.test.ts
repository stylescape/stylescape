// ============================================================================
// Stylescape | LazyLoadManager Tests
// ============================================================================
//
// The global IntersectionObserver installed by tst/setup.ts is a no-op whose
// callback never fires. To exercise the intersection handler we install a
// local capturing mock that records observed elements and lets us invoke the
// callback manually with synthetic entries.
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import LazyLoadManager from "../../src/ts/media/LazyLoadManager";

interface CapturingObserver {
    callback: IntersectionObserverCallback;
    observed: Element[];
    observe: ReturnType<typeof vi.fn>;
    unobserve: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
    trigger: (entries: Partial<IntersectionObserverEntry>[]) => void;
}

let observers: CapturingObserver[];

function entry(
    target: Element,
    isIntersecting: boolean,
): Partial<IntersectionObserverEntry> {
    return { target, isIntersecting };
}

const lazyFixture = `
<img class="lazy-image" data-src="real-1.jpg" src="placeholder.jpg" alt="1">
<img class="lazy-image" data-src="real-2.jpg" src="placeholder.jpg" alt="2">
<img class="lazy-image" src="placeholder.jpg" alt="no-data-src">
`;

describe("LazyLoadManager", () => {
    beforeEach(() => {
        observers = [];

        class CapturingIO implements CapturingObserver {
            callback: IntersectionObserverCallback;
            observed: Element[] = [];
            observe = vi.fn((el: Element) => this.observed.push(el));
            unobserve = vi.fn();
            disconnect = vi.fn();

            constructor(cb: IntersectionObserverCallback) {
                this.callback = cb;
                observers.push(this);
            }

            trigger(entries: Partial<IntersectionObserverEntry>[]) {
                this.callback(
                    entries as IntersectionObserverEntry[],
                    this as unknown as IntersectionObserver,
                );
            }
        }

        vi.stubGlobal("IntersectionObserver", CapturingIO);
        document.body.innerHTML = lazyFixture;
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe("Observer wiring", () => {
        it("creates a single observer and observes every matched item", () => {
            new LazyLoadManager(".lazy-image");

            expect(observers).toHaveLength(1);
            expect(observers[0].observe).toHaveBeenCalledTimes(3);
            expect(observers[0].observed).toHaveLength(3);
        });

        it("observes nothing when the selector matches no elements", () => {
            new LazyLoadManager(".does-not-exist");
            expect(observers).toHaveLength(1);
            expect(observers[0].observe).not.toHaveBeenCalled();
        });
    });

    describe("Intersection handling", () => {
        it("swaps data-src into src and unobserves on intersection", () => {
            new LazyLoadManager(".lazy-image");
            const img =
                document.querySelectorAll<HTMLImageElement>(".lazy-image")[0];

            observers[0].trigger([entry(img, true)]);

            expect(img.getAttribute("src")).toBe("real-1.jpg");
            expect(observers[0].unobserve).toHaveBeenCalledWith(img);
        });

        it("does nothing while an element is not intersecting", () => {
            new LazyLoadManager(".lazy-image");
            const img =
                document.querySelectorAll<HTMLImageElement>(".lazy-image")[0];

            observers[0].trigger([entry(img, false)]);

            expect(img.getAttribute("src")).toBe("placeholder.jpg");
            expect(observers[0].unobserve).not.toHaveBeenCalled();
        });

        it("still unobserves an intersecting element that has no data-src", () => {
            new LazyLoadManager(".lazy-image");
            const img =
                document.querySelectorAll<HTMLImageElement>(".lazy-image")[2];

            observers[0].trigger([entry(img, true)]);

            // src is unchanged because there is no data-src to promote.
            expect(img.getAttribute("src")).toBe("placeholder.jpg");
            expect(observers[0].unobserve).toHaveBeenCalledWith(img);
        });

        it("processes a batch of entries in one callback", () => {
            new LazyLoadManager(".lazy-image");
            const imgs =
                document.querySelectorAll<HTMLImageElement>(".lazy-image");

            observers[0].trigger([entry(imgs[0], true), entry(imgs[1], true)]);

            expect(imgs[0].getAttribute("src")).toBe("real-1.jpg");
            expect(imgs[1].getAttribute("src")).toBe("real-2.jpg");
            expect(observers[0].unobserve).toHaveBeenCalledTimes(2);
        });
    });

    describe("Targets", () => {
        it("accepts a single element", () => {
            const img =
                document.querySelector<HTMLImageElement>(".lazy-image")!;
            new LazyLoadManager(img);

            expect(observers[0].observed).toEqual([img]);
            observers[0].trigger([entry(img, true)]);
            expect(img.getAttribute("src")).toBe("real-1.jpg");
        });

        it("accepts a NodeList", () => {
            new LazyLoadManager(
                document.querySelectorAll<HTMLElement>(".lazy-image"),
            );
            expect(observers[0].observed).toHaveLength(3);
        });

        it("accepts an array of elements", () => {
            const imgs = Array.from(
                document.querySelectorAll<HTMLElement>(".lazy-image"),
            ).slice(0, 2);
            new LazyLoadManager(imgs);
            expect(observers[0].observed).toEqual(imgs);
        });
    });

    describe("Loading", () => {
        it("sets background-image on non-media elements", () => {
            document.body.innerHTML = `<div id="bg" data-src="bg.svg"></div>`;
            const bg = document.getElementById("bg") as HTMLElement;
            new LazyLoadManager(bg);

            observers[0].trigger([entry(bg, true)]);

            expect(bg.style.backgroundImage).toContain("bg.svg");
        });

        it("adds the loaded class, drops data-src and calls onLoad", () => {
            const onLoad = vi.fn();
            const img =
                document.querySelector<HTMLImageElement>(".lazy-image")!;
            new LazyLoadManager(img, { loadedClass: "done", onLoad });

            observers[0].trigger([entry(img, true)]);

            expect(img.classList.contains("done")).toBe(true);
            expect(img.hasAttribute("data-src")).toBe(false);
            expect(onLoad).toHaveBeenCalledWith(img);
        });

        it("promotes data-srcset alongside data-src", () => {
            document.body.innerHTML = `<img id="i" alt="" data-src="a.jpg" data-srcset="a.jpg 1x, b.jpg 2x">`;
            const img = document.getElementById("i") as HTMLImageElement;
            new LazyLoadManager(img);

            observers[0].trigger([entry(img, true)]);

            expect(img.getAttribute("srcset")).toBe("a.jpg 1x, b.jpg 2x");
        });

        it("reads a custom source attribute", () => {
            document.body.innerHTML = `<img id="i" alt="" data-lazy="x.jpg">`;
            const img = document.getElementById("i") as HTMLImageElement;
            new LazyLoadManager(img, { srcAttribute: "data-lazy" });

            observers[0].trigger([entry(img, true)]);

            expect(img.getAttribute("src")).toBe("x.jpg");
        });

        it("loads everything at once without IntersectionObserver", () => {
            vi.stubGlobal("IntersectionObserver", undefined);
            new LazyLoadManager(".lazy-image");

            const imgs =
                document.querySelectorAll<HTMLImageElement>(".lazy-image");
            expect(imgs[0].getAttribute("src")).toBe("real-1.jpg");
            expect(imgs[1].getAttribute("src")).toBe("real-2.jpg");
        });

        it("destroy() disconnects the observer", () => {
            const manager = new LazyLoadManager(".lazy-image");
            manager.destroy();
            expect(observers[0].disconnect).toHaveBeenCalled();
        });
    });
});
