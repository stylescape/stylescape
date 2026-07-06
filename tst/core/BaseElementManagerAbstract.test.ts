// ============================================================================
// Stylescape | BaseElementManager (abstract class) Tests
// ============================================================================
// Exercises the real abstract `BaseElementManager` via small concrete
// subclasses. (The sibling `baseElementManager.test.ts` only asserts against
// hand-rolled Maps and never imports the class, so it provides no real
// coverage of this file. This suite uses a distinct filename because the
// repo lives on a case-insensitive filesystem where `BaseElementManager.test.ts`
// would collide with the existing `baseElementManager.test.ts`.)
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BaseElementManager } from "../../src/ts/core/BaseElementManager";
import { appendToBody, createElement } from "../utils";

// ----------------------------------------------------------------------------
// Test doubles: concrete subclasses of the abstract base.
// ----------------------------------------------------------------------------

interface Widget {
    el: HTMLElement;
    config: Record<string, unknown>;
    destroyed: boolean;
    destroy(): void;
}

class WidgetManager extends BaseElementManager<Widget> {
    /** Records every (element, config) pair passed to createElement. */
    public created: Array<{ el: HTMLElement; config: Record<string, unknown> }> =
        [];

    protected getComponentName(): string {
        return "widget";
    }

    protected createElement(
        element: HTMLElement,
        config: Record<string, unknown>,
    ): Widget {
        this.created.push({ el: element, config });
        const widget: Widget = {
            el: element,
            config,
            destroyed: false,
            destroy() {
                this.destroyed = true;
            },
        };
        return widget;
    }

    /** Convenience accessor for the most recent parsed config. */
    public lastConfig(): Record<string, unknown> {
        return this.created[this.created.length - 1]?.config ?? {};
    }
}

/**
 * Manager with NO subclass field initializers whose createElement does not
 * read any subclass instance state. Safe to auto-init from the base
 * constructor (subclass field initializers run *after* super()).
 */
class AutoWidgetManager extends BaseElementManager<{ el: HTMLElement }> {
    protected getComponentName(): string {
        return "autowidget";
    }
    protected createElement(element: HTMLElement): { el: HTMLElement } {
        return { el: element };
    }
}

/** Manager whose component instances have NO destroy() method. */
class PlainManager extends BaseElementManager<{ el: HTMLElement }> {
    protected getComponentName(): string {
        return "plain";
    }
    protected createElement(element: HTMLElement): { el: HTMLElement } {
        return { el: element };
    }
}

/** Manager whose createElement always throws. */
class ThrowingManager extends BaseElementManager<Widget> {
    protected getComponentName(): string {
        return "throwing";
    }
    protected createElement(): Widget {
        throw new Error("boom");
    }
}

/** Manager using a custom attribute name. */
class CustomAttrManager extends BaseElementManager<{
    config: Record<string, unknown>;
}> {
    public lastConfig: Record<string, unknown> = {};
    protected getComponentName(): string {
        return "custom";
    }
    protected createElement(
        _element: HTMLElement,
        config: Record<string, unknown>,
    ): { config: Record<string, unknown> } {
        this.lastConfig = config;
        return { config };
    }
}

// ----------------------------------------------------------------------------

describe("BaseElementManager (abstract)", () => {
    let errorSpy: ReturnType<typeof vi.spyOn>;
    let warnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
        errorSpy.mockRestore();
        warnSpy.mockRestore();
    });

    describe("init() / DOM discovery", () => {
        it("initialises every element matching data-ss-<name>", async () => {
            appendToBody(createElement(`<div data-ss-widget id="a"></div>`));
            appendToBody(createElement(`<div data-ss-widget id="b"></div>`));

            const mgr = new WidgetManager({ autoInit: false });
            await mgr.init();

            expect(mgr.has("a")).toBe(true);
            expect(mgr.has("b")).toBe(true);
            expect(mgr.getAll().size).toBe(2);
            expect(mgr.get("a")?.el.id).toBe("a");
        });

        it("marks initialised elements with the -initialized attribute", async () => {
            const el = appendToBody(
                createElement(`<div data-ss-widget id="marked"></div>`),
            );

            const mgr = new WidgetManager({ autoInit: false });
            await mgr.init();

            expect(el.getAttribute("data-ss-widget-initialized")).toBe("true");
        });

        it("assigns an auto id to elements without one", async () => {
            const el = appendToBody(createElement(`<div data-ss-widget></div>`));

            const mgr = new WidgetManager({ autoInit: false });
            await mgr.init();

            expect(el.id).toMatch(/^widget-\d+$/);
            expect(mgr.has(el.id)).toBe(true);
        });

        it("does not re-create an element on a second init() (dedupe)", async () => {
            appendToBody(createElement(`<div data-ss-widget id="dup"></div>`));

            const mgr = new WidgetManager({ autoInit: false });
            await mgr.init();
            await mgr.init();

            expect(mgr.created.length).toBe(1);
            expect(mgr.getAll().size).toBe(1);
        });

        it("scans only within a custom root element", async () => {
            const root = appendToBody(
                createElement(
                    `<div><div data-ss-widget id="inside"></div></div>`,
                ),
            );
            appendToBody(createElement(`<div data-ss-widget id="outside"></div>`));

            const mgr = new WidgetManager({ autoInit: false, root });
            await mgr.init();

            expect(mgr.has("inside")).toBe(true);
            expect(mgr.has("outside")).toBe(false);
        });
    });

    describe("initElement()", () => {
        it("initialises a single element and returns its instance", async () => {
            const el = appendToBody(
                createElement(`<div data-ss-widget id="single"></div>`),
            );

            const mgr = new WidgetManager({ autoInit: false });
            const instance = await mgr.initElement(el);

            expect(instance).not.toBeNull();
            expect(mgr.get("single")).toBe(instance);
        });

        it("returns the existing instance on a repeat call (no re-create)", async () => {
            const el = appendToBody(
                createElement(`<div data-ss-widget id="once"></div>`),
            );

            const mgr = new WidgetManager({ autoInit: false });
            const first = await mgr.initElement(el);
            const second = await mgr.initElement(el);

            expect(second).toBe(first);
            expect(mgr.created.length).toBe(1);
        });
    });

    describe("get / getAll / has", () => {
        it("has() reflects whether an id is initialised", async () => {
            appendToBody(createElement(`<div data-ss-widget id="known"></div>`));
            const mgr = new WidgetManager({ autoInit: false });
            await mgr.init();

            expect(mgr.has("known")).toBe(true);
            expect(mgr.has("unknown")).toBe(false);
            expect(mgr.get("unknown")).toBeUndefined();
        });

        it("getAll() returns a copy that does not mutate internal state", async () => {
            appendToBody(createElement(`<div data-ss-widget id="c"></div>`));
            const mgr = new WidgetManager({ autoInit: false });
            await mgr.init();

            const snapshot = mgr.getAll();
            snapshot.clear();

            expect(mgr.getAll().size).toBe(1);
            expect(mgr.has("c")).toBe(true);
        });
    });

    describe("parseConfig (via captured createElement config)", () => {
        async function configFor(html: string): Promise<Record<string, unknown>> {
            const el = appendToBody(createElement(html));
            const mgr = new WidgetManager({ autoInit: false });
            await mgr.initElement(el);
            return mgr.lastConfig();
        }

        it("converts kebab-case attribute names to camelCase", async () => {
            const cfg = await configFor(
                `<div data-ss-widget id="k" data-ss-widget-animation-duration="300"></div>`,
            );
            expect(cfg.animationDuration).toBe(300);
        });

        it("coerces 'true'/'false' to booleans", async () => {
            const cfg = await configFor(
                `<div data-ss-widget id="bool" data-ss-widget-open="true" data-ss-widget-closed="false"></div>`,
            );
            expect(cfg.open).toBe(true);
            expect(cfg.closed).toBe(false);
        });

        it("coerces numeric strings to numbers", async () => {
            const cfg = await configFor(
                `<div data-ss-widget id="num" data-ss-widget-count="42"></div>`,
            );
            expect(cfg.count).toBe(42);
            expect(typeof cfg.count).toBe("number");
        });

        it("keeps non-numeric strings as strings", async () => {
            const cfg = await configFor(
                `<div data-ss-widget id="str" data-ss-widget-title="Hello"></div>`,
            );
            expect(cfg.title).toBe("Hello");
        });

        it("keeps an empty-string attribute as an empty string (not 0)", async () => {
            const cfg = await configFor(
                `<div data-ss-widget id="empty" data-ss-widget-label=""></div>`,
            );
            expect(cfg.label).toBe("");
        });

        it("parses a JSON config attribute", async () => {
            const cfg = await configFor(
                `<div data-ss-widget id="json" data-ss-widget-config='{"foo":"bar","n":5}'></div>`,
            );
            expect(cfg.foo).toBe("bar");
            expect(cfg.n).toBe(5);
        });

        it("lets individual attributes override JSON config keys", async () => {
            const cfg = await configFor(
                `<div data-ss-widget id="ov" data-ss-widget-config='{"speed":1}' data-ss-widget-speed="2"></div>`,
            );
            expect(cfg.speed).toBe(2);
        });

        it("warns and ignores an invalid JSON config, still parsing attributes", async () => {
            const el = appendToBody(
                createElement(
                    `<div data-ss-widget id="badjson" data-ss-widget-config='{oops' data-ss-widget-mode="dark"></div>`,
                ),
            );
            const mgr = new WidgetManager({ autoInit: false });
            await mgr.initElement(el);

            expect(warnSpy).toHaveBeenCalled();
            expect(mgr.lastConfig().mode).toBe("dark");
        });

        it("does not surface the -config attribute itself as a config key", async () => {
            const cfg = await configFor(
                `<div data-ss-widget id="nocfgkey" data-ss-widget-config='{"a":1}'></div>`,
            );
            expect("config" in cfg).toBe(false);
            expect(cfg.a).toBe(1);
        });
    });

    describe("custom attribute name", () => {
        it("discovers elements and parses config under the custom prefix", async () => {
            appendToBody(
                createElement(
                    `<div data-thing id="t" data-thing-size="10"></div>`,
                ),
            );
            const mgr = new CustomAttrManager({
                attribute: "data-thing",
                autoInit: false,
            });
            await mgr.init();

            expect(mgr.has("t")).toBe(true);
            expect(mgr.lastConfig.size).toBe(10);
        });
    });

    describe("error handling", () => {
        it("logs and returns null when createElement throws, leaving the map empty", async () => {
            const el = appendToBody(
                createElement(`<div data-ss-throwing id="boom"></div>`),
            );
            const mgr = new ThrowingManager({ autoInit: false });

            const result = await mgr.initElement(el);

            expect(result).toBeNull();
            expect(mgr.has("boom")).toBe(false);
            expect(errorSpy).toHaveBeenCalled();
        });
    });

    describe("destroy / destroyAll", () => {
        it("calls instance.destroy() and removes it, returning true", async () => {
            appendToBody(createElement(`<div data-ss-widget id="d1"></div>`));
            const mgr = new WidgetManager({ autoInit: false });
            await mgr.init();
            const instance = mgr.get("d1")!;

            const result = mgr.destroy("d1");

            expect(result).toBe(true);
            expect(instance.destroyed).toBe(true);
            expect(mgr.has("d1")).toBe(false);
        });

        it("returns false when destroying an unknown id", () => {
            const mgr = new WidgetManager({ autoInit: false });
            expect(mgr.destroy("nope")).toBe(false);
        });

        it("removes instances that have no destroy() method without throwing", async () => {
            appendToBody(createElement(`<div data-ss-plain id="p1"></div>`));
            const mgr = new PlainManager({ autoInit: false });
            await mgr.init();

            expect(() => mgr.destroy("p1")).not.toThrow();
            expect(mgr.has("p1")).toBe(false);
        });

        it("destroyAll() clears the collection and destroys each instance", async () => {
            appendToBody(createElement(`<div data-ss-widget id="x"></div>`));
            appendToBody(createElement(`<div data-ss-widget id="y"></div>`));
            const mgr = new WidgetManager({ autoInit: false });
            await mgr.init();
            const x = mgr.get("x")!;
            const y = mgr.get("y")!;

            mgr.destroyAll();

            expect(mgr.getAll().size).toBe(0);
            expect(x.destroyed).toBe(true);
            expect(y.destroyed).toBe(true);
        });
    });

    describe("auto-init behaviour", () => {
        it("auto-initialises immediately when readyState is not 'loading'", async () => {
            appendToBody(createElement(`<div data-ss-autowidget id="auto"></div>`));

            const mgr = new AutoWidgetManager(); // autoInit defaults true
            // init() is async and not awaited by the constructor; flush microtasks.
            await new Promise((r) => setTimeout(r, 0));

            expect(mgr.has("auto")).toBe(true);
        });

        it("does NOT auto-initialise when autoInit is false", async () => {
            appendToBody(createElement(`<div data-ss-widget id="noauto"></div>`));

            const mgr = new WidgetManager({ autoInit: false });
            await new Promise((r) => setTimeout(r, 0));

            expect(mgr.has("noauto")).toBe(false);
        });

        it("defers init to DOMContentLoaded while readyState is 'loading'", async () => {
            appendToBody(createElement(`<div data-ss-widget id="deferred"></div>`));

            // Shadow the readyState getter to simulate a still-loading document.
            Object.defineProperty(document, "readyState", {
                configurable: true,
                get: () => "loading",
            });

            const mgr = new WidgetManager(); // autoInit true, but loading -> deferred
            expect(mgr.has("deferred")).toBe(false);

            // Restore real readyState, then fire the event the manager waits for.
            delete (document as unknown as { readyState?: unknown }).readyState;
            document.dispatchEvent(new Event("DOMContentLoaded"));
            await new Promise((r) => setTimeout(r, 0));

            expect(mgr.has("deferred")).toBe(true);
        });
    });
});
