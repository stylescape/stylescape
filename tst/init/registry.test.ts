// ============================================================================
// Stylescape | Component Registry Tests
// ============================================================================

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";
import {
    componentRegistry,
    getComponent,
    getComponentNames,
    hasComponent,
    registerComponent,
    type RegistryEntry,
} from "../../src/ts/init/registry";
import { click } from "../utils";

// Component names that ship with Stylescape and should always be present
const BUILT_INS = [
    "tooltip",
    "modal",
    "accordion",
    "carousel",
    "tabs",
    "autocomplete",
    "validate",
    "scroll-to-top",
    "scroll-to",
    "scrollspy",
];

describe("Component Registry", () => {
    // Track keys added during a test so we can restore the shared registry
    let originalKeys: Set<string>;

    beforeEach(() => {
        originalKeys = new Set(componentRegistry.keys());
    });

    afterEach(() => {
        // Remove anything a test added to the shared singleton registry
        for (const key of Array.from(componentRegistry.keys())) {
            if (!originalKeys.has(key)) {
                componentRegistry.delete(key);
            }
        }
    });

    // ------------------------------------------------------------------
    // hasComponent
    // ------------------------------------------------------------------
    describe("hasComponent", () => {
        it("returns true for every built-in component", () => {
            for (const name of BUILT_INS) {
                expect(hasComponent(name)).toBe(true);
            }
        });

        it("returns false for an unknown component", () => {
            expect(hasComponent("does-not-exist")).toBe(false);
        });

        it("is case-insensitive", () => {
            expect(hasComponent("TOOLTIP")).toBe(true);
            expect(hasComponent("Modal")).toBe(true);
        });
    });

    // ------------------------------------------------------------------
    // getComponent
    // ------------------------------------------------------------------
    describe("getComponent", () => {
        it("returns an entry with a handler function for a known name", () => {
            const entry = getComponent("tooltip");
            expect(entry).toBeDefined();
            expect(typeof entry!.handler).toBe("function");
        });

        it("returns the defaults declared for a component", () => {
            expect(getComponent("tooltip")!.defaults).toEqual({
                position: "top",
            });
            expect(getComponent("carousel")!.defaults).toEqual({
                autoplay: true,
                interval: 5000,
            });
        });

        it("returns undefined for an unknown name", () => {
            expect(getComponent("nope")).toBeUndefined();
        });

        it("is case-insensitive", () => {
            expect(getComponent("Accordion")).toBe(getComponent("accordion"));
        });
    });

    // ------------------------------------------------------------------
    // getComponentNames
    // ------------------------------------------------------------------
    describe("getComponentNames", () => {
        it("lists all registered names", () => {
            const names = getComponentNames();
            expect(Array.isArray(names)).toBe(true);
            expect(names.length).toBe(componentRegistry.size);
            for (const name of BUILT_INS) {
                expect(names).toContain(name);
            }
        });

        it("returns only lowercase names", () => {
            for (const name of getComponentNames()) {
                expect(name).toBe(name.toLowerCase());
            }
        });
    });

    // ------------------------------------------------------------------
    // registerComponent
    // ------------------------------------------------------------------
    describe("registerComponent", () => {
        it("adds a new component that becomes discoverable", () => {
            const handler = vi.fn();
            const entry: RegistryEntry = { handler, defaults: { foo: 1 } };

            registerComponent("my-widget", entry);

            expect(hasComponent("my-widget")).toBe(true);
            expect(getComponent("my-widget")).toBe(entry);
            expect(getComponentNames()).toContain("my-widget");
        });

        it("lowercases the name on registration", () => {
            registerComponent("MixedCase", { handler: vi.fn() });

            expect(hasComponent("mixedcase")).toBe(true);
            expect(getComponentNames()).toContain("mixedcase");
            expect(getComponentNames()).not.toContain("MixedCase");
        });

        it("overwrites an existing entry with the same name", () => {
            const replacement: RegistryEntry = {
                handler: vi.fn(),
                defaults: { replaced: true },
            };
            registerComponent("tooltip", replacement);

            expect(getComponent("tooltip")).toBe(replacement);
        });

        it("invokes the registered handler when called", () => {
            const handler = vi.fn(() => "instance");
            registerComponent("custom", { handler });

            const el = document.createElement("div");
            const result = getComponent("custom")!.handler(el, { a: 1 });

            expect(handler).toHaveBeenCalledWith(el, { a: 1 });
            expect(result).toBe("instance");
        });
    });

    // ------------------------------------------------------------------
    // Handler behaviour (self-contained handlers)
    // ------------------------------------------------------------------
    describe("built-in handler behaviour", () => {
        it("the 'tabs' handler activates the first tab and switches on click", () => {
            document.body.innerHTML = `
                <div id="tabs">
                    <button data-ss-tab="a">A</button>
                    <button data-ss-tab="b">B</button>
                    <div data-ss-tab-panel="a">Panel A</div>
                    <div data-ss-tab-panel="b">Panel B</div>
                </div>
            `;
            const el = document.getElementById("tabs")!;
            const api = getComponent("tabs")!.handler(el, {});

            const tabA = el.querySelector('[data-ss-tab="a"]')!;
            const tabB = el.querySelector('[data-ss-tab="b"]')!;
            const panelA = el.querySelector('[data-ss-tab-panel="a"]')!;
            const panelB = el.querySelector('[data-ss-tab-panel="b"]')!;

            // First tab active by default
            expect(tabA.classList.contains("tab--active")).toBe(true);
            expect(tabA.getAttribute("aria-selected")).toBe("true");
            expect(panelA.getAttribute("aria-hidden")).toBe("false");
            expect(panelB.getAttribute("aria-hidden")).toBe("true");

            // Clicking tab B activates it
            click(tabB);
            expect(tabB.classList.contains("tab--active")).toBe(true);
            expect(tabA.classList.contains("tab--active")).toBe(false);
            expect(panelB.classList.contains("tab-panel--active")).toBe(true);

            // The handler also exposes a programmatic activate()
            expect(typeof api.activate).toBe("function");
            api.activate("a");
            expect(tabA.classList.contains("tab--active")).toBe(true);
        });

        it("the 'carousel' handler cycles slides via its returned API", () => {
            document.body.innerHTML = `
                <div id="car">
                    <div data-ss-carousel-slide>1</div>
                    <div data-ss-carousel-slide>2</div>
                    <div data-ss-carousel-slide>3</div>
                    <button data-ss-carousel-next></button>
                    <button data-ss-carousel-prev></button>
                </div>
            `;
            const el = document.getElementById("car")!;
            // autoplay:false to avoid leaving a running interval
            const api = getComponent("carousel")!.handler(el, {
                autoplay: false,
            });

            const slides = el.querySelectorAll("[data-ss-carousel-slide]");
            expect(slides[0].classList.contains("carousel-slide--active")).toBe(
                true,
            );

            api.next();
            expect(slides[1].classList.contains("carousel-slide--active")).toBe(
                true,
            );
            expect(slides[0].classList.contains("carousel-slide--active")).toBe(
                false,
            );

            // prev wraps back to the first slide
            api.prev();
            expect(slides[0].classList.contains("carousel-slide--active")).toBe(
                true,
            );

            // Next button click also advances
            click(el.querySelector("[data-ss-carousel-next]")!);
            expect(slides[1].classList.contains("carousel-slide--active")).toBe(
                true,
            );

            api.destroy();
        });

        it("the 'scroll-to' handler reads target/offset and scrolls on click", () => {
            document.body.innerHTML = `
                <a id="lnk" data-ss="scroll-to" data-ss-scroll-target="#dest" data-ss-scroll-offset="-20">go</a>
                <div id="dest"></div>
            `;
            const el = document.getElementById("lnk")!;
            const scrollToSpy = window.scrollTo as unknown as ReturnType<
                typeof vi.fn
            >;

            const api = getComponent("scroll-to")!.handler(el, {});
            expect(api.target).toBe("#dest");
            expect(api.offset).toBe(-20);

            click(el);
            expect(scrollToSpy).toHaveBeenCalled();
            const arg = scrollToSpy.mock.calls.at(-1)![0];
            expect(arg.behavior).toBe("smooth");
        });
    });

    // ------------------------------------------------------------------
    // Registry object
    // ------------------------------------------------------------------
    describe("componentRegistry map", () => {
        it("is a Map keyed by component name", () => {
            expect(componentRegistry).toBeInstanceOf(Map);
            expect(componentRegistry.get("modal")).toBe(getComponent("modal"));
        });
    });
});
