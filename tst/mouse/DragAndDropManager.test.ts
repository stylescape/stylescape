// ============================================================================
// Stylescape | DragAndDropManager Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DragAndDropManager } from "../../src/ts/mouse/DragAndDropManager";

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

interface FakeDataTransfer {
    effectAllowed: string;
    dropEffect: string;
    data: Record<string, string>;
    setData: ReturnType<typeof vi.fn>;
    getData: ReturnType<typeof vi.fn>;
}

function makeDataTransfer(): FakeDataTransfer {
    const dt: FakeDataTransfer = {
        effectAllowed: "",
        dropEffect: "",
        data: {},
        setData: vi.fn((format: string, value: string) => {
            dt.data[format] = value;
        }),
        getData: vi.fn((format: string) => dt.data[format]),
    };
    return dt;
}

function makeDragEvent(
    type: string,
    opts: {
        dataTransfer?: FakeDataTransfer;
        relatedTarget?: EventTarget | null;
    } = {},
): Event {
    const ev = new Event(type, { bubbles: true, cancelable: true });
    if ("dataTransfer" in opts) {
        Object.defineProperty(ev, "dataTransfer", {
            value: opts.dataTransfer,
            configurable: true,
        });
    }
    if ("relatedTarget" in opts) {
        Object.defineProperty(ev, "relatedTarget", {
            value: opts.relatedTarget,
            configurable: true,
        });
    }
    return ev;
}

// ----------------------------------------------------------------------------
// Tests
// ----------------------------------------------------------------------------

describe("DragAndDropManager", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    describe("Construction & initialization", () => {
        it("sets up draggable attributes on an element passed directly", () => {
            const el = document.createElement("div");
            document.body.appendChild(el);

            new DragAndDropManager(el);

            expect(el.getAttribute("draggable")).toBe("true");
            expect(el.getAttribute("role")).toBe("listitem");
            expect(el.getAttribute("aria-grabbed")).toBe("false");
        });

        it("resolves a CSS selector string to matching elements", () => {
            document.body.innerHTML = `
                <div class="card">A</div>
                <div class="card">B</div>
            `;

            new DragAndDropManager(".card");

            const cards = document.querySelectorAll<HTMLElement>(".card");
            cards.forEach((c) => {
                expect(c.getAttribute("draggable")).toBe("true");
            });
        });

        it("accepts an array of elements", () => {
            const a = document.createElement("div");
            const b = document.createElement("div");
            document.body.append(a, b);

            new DragAndDropManager([a, b]);

            expect(a.getAttribute("draggable")).toBe("true");
            expect(b.getAttribute("draggable")).toBe("true");
        });

        it("wires up drop zones from the default selector", () => {
            document.body.innerHTML = `
                <div class="item"></div>
                <div data-ss="dropzone" id="zone"></div>
            `;

            new DragAndDropManager(".item");

            const zone = document.getElementById("zone")!;
            expect(zone.getAttribute("role")).toBe("list");
            expect(zone.getAttribute("aria-dropeffect")).toBe("move");
        });

        it("honours a custom dropZoneSelector option", () => {
            document.body.innerHTML = `
                <div class="item"></div>
                <div class="my-zone" id="z"></div>
            `;

            new DragAndDropManager(".item", { dropZoneSelector: ".my-zone" });

            expect(document.getElementById("z")!.getAttribute("role")).toBe(
                "list",
            );
        });
    });

    describe("Drag lifecycle", () => {
        it("marks element as grabbed and applies dragging class on dragstart", () => {
            const el = document.createElement("div");
            el.id = "drag-1";
            document.body.appendChild(el);
            const onDragStart = vi.fn();

            const manager = new DragAndDropManager(el, { onDragStart });

            const dt = makeDataTransfer();
            el.dispatchEvent(makeDragEvent("dragstart", { dataTransfer: dt }));

            expect(el.classList.contains("ss-dragging")).toBe(true);
            expect(el.getAttribute("aria-grabbed")).toBe("true");
            expect(manager.getDragged()).toBe(el);
            expect(dt.effectAllowed).toBe("move");
            expect(dt.setData).toHaveBeenCalledWith("text/plain", "drag-1");
            expect(onDragStart).toHaveBeenCalledTimes(1);
        });

        it("falls back to 'dragged' as transfer data when element has no id", () => {
            const el = document.createElement("div");
            document.body.appendChild(el);
            new DragAndDropManager(el);

            const dt = makeDataTransfer();
            el.dispatchEvent(makeDragEvent("dragstart", { dataTransfer: dt }));

            expect(dt.setData).toHaveBeenCalledWith("text/plain", "dragged");
        });

        it("respects a custom draggingClass and effectAllowed", () => {
            const el = document.createElement("div");
            document.body.appendChild(el);
            new DragAndDropManager(el, {
                draggingClass: "is-moving",
                effectAllowed: "copy",
            });

            const dt = makeDataTransfer();
            el.dispatchEvent(makeDragEvent("dragstart", { dataTransfer: dt }));

            expect(el.classList.contains("is-moving")).toBe(true);
            expect(dt.effectAllowed).toBe("copy");
        });

        it("clears grabbed state and dragged reference on dragend", () => {
            const el = document.createElement("div");
            document.body.appendChild(el);
            const onDragEnd = vi.fn();
            const manager = new DragAndDropManager(el, { onDragEnd });

            el.dispatchEvent(
                makeDragEvent("dragstart", { dataTransfer: makeDataTransfer() }),
            );
            el.dispatchEvent(makeDragEvent("dragend"));

            expect(el.classList.contains("ss-dragging")).toBe(false);
            expect(el.getAttribute("aria-grabbed")).toBe("false");
            expect(manager.getDragged()).toBeNull();
            expect(onDragEnd).toHaveBeenCalledTimes(1);
        });

        it("dragend removes drag-over class from all drop zones", () => {
            document.body.innerHTML = `
                <div class="item"></div>
                <div data-ss="dropzone" id="zone"></div>
            `;
            new DragAndDropManager(".item");

            const item = document.querySelector<HTMLElement>(".item")!;
            const zone = document.getElementById("zone")!;

            item.dispatchEvent(
                makeDragEvent("dragstart", { dataTransfer: makeDataTransfer() }),
            );
            zone.dispatchEvent(makeDragEvent("dragenter"));
            expect(zone.classList.contains("ss-drag-over")).toBe(true);

            item.dispatchEvent(makeDragEvent("dragend"));
            expect(zone.classList.contains("ss-drag-over")).toBe(false);
        });
    });

    describe("Drop zone interactions", () => {
        function setup(options = {}) {
            document.body.innerHTML = `
                <div class="item" id="item"></div>
                <div data-ss="dropzone" id="zone"></div>
            `;
            const manager = new DragAndDropManager(".item", options);
            return {
                manager,
                item: document.getElementById("item")!,
                zone: document.getElementById("zone")!,
            };
        }

        it("adds drag-over class on dragenter", () => {
            const { zone } = setup();
            zone.dispatchEvent(makeDragEvent("dragenter"));
            expect(zone.classList.contains("ss-drag-over")).toBe(true);
        });

        it("removes drag-over class on dragleave when leaving the zone", () => {
            const { zone } = setup();
            zone.dispatchEvent(makeDragEvent("dragenter"));

            const outside = document.createElement("div");
            document.body.appendChild(outside);
            zone.dispatchEvent(
                makeDragEvent("dragleave", { relatedTarget: outside }),
            );

            expect(zone.classList.contains("ss-drag-over")).toBe(false);
        });

        it("keeps drag-over class when dragleave moves to a child element", () => {
            const { zone } = setup();
            const child = document.createElement("span");
            zone.appendChild(child);
            zone.dispatchEvent(makeDragEvent("dragenter"));

            zone.dispatchEvent(
                makeDragEvent("dragleave", { relatedTarget: child }),
            );

            expect(zone.classList.contains("ss-drag-over")).toBe(true);
        });

        it("prevents default on dragover to allow dropping", () => {
            const { zone } = setup();
            const dt = makeDataTransfer();
            const ev = makeDragEvent("dragover", { dataTransfer: dt });
            zone.dispatchEvent(ev);

            expect(ev.defaultPrevented).toBe(true);
            expect(dt.dropEffect).toBe("move");
        });

        it("does not allow dropping when onDragOver returns false", () => {
            const { zone } = setup({ onDragOver: () => false });
            const ev = makeDragEvent("dragover", {
                dataTransfer: makeDataTransfer(),
            });
            zone.dispatchEvent(ev);

            expect(ev.defaultPrevented).toBe(false);
        });

        it("invokes onDrop with dragged element and drop zone", () => {
            const onDrop = vi.fn();
            const { item, zone } = setup({ onDrop });

            item.dispatchEvent(
                makeDragEvent("dragstart", { dataTransfer: makeDataTransfer() }),
            );
            const dropEv = makeDragEvent("drop");
            zone.dispatchEvent(dropEv);

            expect(dropEv.defaultPrevented).toBe(true);
            expect(zone.classList.contains("ss-drag-over")).toBe(false);
            expect(onDrop).toHaveBeenCalledTimes(1);
            expect(onDrop).toHaveBeenCalledWith(item, zone, dropEv);
        });

        it("does not fire onDrop when nothing is being dragged", () => {
            const onDrop = vi.fn();
            const { zone } = setup({ onDrop });
            zone.dispatchEvent(makeDragEvent("drop"));
            expect(onDrop).not.toHaveBeenCalled();
        });

        it("blocks cross-container drops when allowCrossContainer is false", () => {
            const onDrop = vi.fn();
            const { item, zone } = setup({
                allowCrossContainer: false,
                onDrop,
            });
            // item's parent is body, not the zone -> drop should be rejected
            item.dispatchEvent(
                makeDragEvent("dragstart", { dataTransfer: makeDataTransfer() }),
            );
            zone.dispatchEvent(makeDragEvent("drop"));

            expect(onDrop).not.toHaveBeenCalled();
        });

        it("allows same-container drop when allowCrossContainer is false", () => {
            document.body.innerHTML = `
                <div data-ss="dropzone" id="zone">
                    <div class="item" id="item"></div>
                </div>
            `;
            const onDrop = vi.fn();
            new DragAndDropManager(".item", {
                allowCrossContainer: false,
                onDrop,
            });
            const item = document.getElementById("item")!;
            const zone = document.getElementById("zone")!;

            item.dispatchEvent(
                makeDragEvent("dragstart", { dataTransfer: makeDataTransfer() }),
            );
            zone.dispatchEvent(makeDragEvent("drop"));

            expect(onDrop).toHaveBeenCalledTimes(1);
        });
    });

    describe("Handle selector", () => {
        it("makes only the handle enable dragging via mousedown/mouseup", () => {
            document.body.innerHTML = `
                <div class="row" id="row">
                    <span class="handle">grip</span>
                    <span>content</span>
                </div>
            `;
            new DragAndDropManager(".row", { handleSelector: ".handle" });

            const row = document.getElementById("row")!;
            const handle = row.querySelector<HTMLElement>(".handle")!;

            // With a handle present the row starts non-draggable
            expect(row.getAttribute("draggable")).toBe("false");
            expect(handle.style.cursor).toBe("grab");

            handle.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
            expect(row.getAttribute("draggable")).toBe("true");

            handle.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
            expect(row.getAttribute("draggable")).toBe("false");
        });
    });

    describe("Public API", () => {
        it("addDraggable registers a new element and enables dragstart handling", () => {
            const manager = new DragAndDropManager([]);
            const el = document.createElement("div");
            el.id = "late";
            document.body.appendChild(el);

            manager.addDraggable(el);
            expect(el.getAttribute("draggable")).toBe("true");

            el.dispatchEvent(
                makeDragEvent("dragstart", { dataTransfer: makeDataTransfer() }),
            );
            expect(manager.getDragged()).toBe(el);
        });

        it("removeDraggable strips attributes and detaches handlers", () => {
            const el = document.createElement("div");
            document.body.appendChild(el);
            const manager = new DragAndDropManager(el);

            manager.removeDraggable(el);
            expect(el.hasAttribute("draggable")).toBe(false);
            expect(el.hasAttribute("aria-grabbed")).toBe(false);

            el.dispatchEvent(
                makeDragEvent("dragstart", { dataTransfer: makeDataTransfer() }),
            );
            expect(manager.getDragged()).toBeNull();
        });

        it("addDropZone / removeDropZone wire and unwire zone handlers", () => {
            const manager = new DragAndDropManager([]);
            const zone = document.createElement("div");
            document.body.appendChild(zone);

            manager.addDropZone(zone);
            expect(zone.getAttribute("aria-dropeffect")).toBe("move");
            zone.dispatchEvent(makeDragEvent("dragenter"));
            expect(zone.classList.contains("ss-drag-over")).toBe(true);

            zone.classList.remove("ss-drag-over");
            manager.removeDropZone(zone);
            expect(zone.hasAttribute("aria-dropeffect")).toBe(false);
            zone.dispatchEvent(makeDragEvent("dragenter"));
            expect(zone.classList.contains("ss-drag-over")).toBe(false);
        });

        it("setDraggable toggles the draggable attribute and aria-grabbed", () => {
            const el = document.createElement("div");
            document.body.appendChild(el);
            const manager = new DragAndDropManager(el);

            manager.setDraggable(el, false);
            expect(el.getAttribute("draggable")).toBe("false");
            expect(el.getAttribute("aria-grabbed")).toBe("false");

            el.dispatchEvent(
                makeDragEvent("dragstart", { dataTransfer: makeDataTransfer() }),
            );
            manager.setDraggable(el, true);
            expect(el.getAttribute("draggable")).toBe("true");
            // currentDragged === el, so grabbed should be true
            expect(el.getAttribute("aria-grabbed")).toBe("true");
        });

        it("destroy tears down all draggables and drop zones", () => {
            document.body.innerHTML = `
                <div class="item" id="item"></div>
                <div data-ss="dropzone" id="zone"></div>
            `;
            const onDragStart = vi.fn();
            const manager = new DragAndDropManager(".item", { onDragStart });
            const item = document.getElementById("item")!;
            const zone = document.getElementById("zone")!;

            manager.destroy();

            expect(item.hasAttribute("draggable")).toBe(false);
            expect(zone.hasAttribute("aria-dropeffect")).toBe(false);
            expect(manager.getDragged()).toBeNull();

            item.dispatchEvent(
                makeDragEvent("dragstart", { dataTransfer: makeDataTransfer() }),
            );
            expect(onDragStart).not.toHaveBeenCalled();
        });
    });

    describe("Static initDraggables", () => {
        it("creates one manager per [data-ss='draggable'] element", () => {
            document.body.innerHTML = `
                <div data-ss="draggable" data-ss-draggable-handle=".h">
                    <span class="h">grip</span>
                </div>
                <div data-ss="draggable"></div>
            `;

            const managers = DragAndDropManager.initDraggables();
            expect(managers).toHaveLength(2);

            const els = document.querySelectorAll<HTMLElement>(
                '[data-ss="draggable"]',
            );
            // The one with a handle starts non-draggable, the other draggable
            expect(els[0].getAttribute("draggable")).toBe("false");
            expect(els[1].getAttribute("draggable")).toBe("true");
        });

        it("returns an empty array when no draggables exist", () => {
            expect(DragAndDropManager.initDraggables()).toEqual([]);
        });
    });
});
