// ============================================================================
// Stylescape | Drop Zone Manager Tests
// ============================================================================

import { describe, expect, it, vi } from "vitest";
import {
    DropZoneManager,
    type DropZoneRejection,
} from "../../src/ts/forms/DropZoneManager";

function setup(inputAttrs = 'accept="image/*,.pdf" multiple'): {
    zone: HTMLElement;
    input: HTMLInputElement;
    surface: HTMLElement;
} {
    document.body.innerHTML = `
        <div class="ss-c-dropzone">
            <input id="f" type="file" class="ss-c-dropzone__input" ${inputAttrs}>
            <label for="f" class="ss-c-dropzone__surface">
                <span class="ss-c-dropzone__title">Drop files</span>
            </label>
            <p class="ss-c-dropzone__status" role="status"></p>
            <ul class="ss-c-dropzone__files"></ul>
        </div>`;
    return {
        zone: document.querySelector(".ss-c-dropzone") as HTMLElement,
        input: document.getElementById("f") as HTMLInputElement,
        surface: document.querySelector("label") as HTMLElement,
    };
}

function file(name: string, type: string, size = 10): File {
    return new File([new Uint8Array(size)], name, { type });
}

// jsdom has no DragEvent/DataTransfer: fake the parts the manager reads.
function drag(
    target: HTMLElement,
    type: string,
    files: File[] = [],
    types: string[] = ["Files"],
): Event {
    const event = new Event(type, { bubbles: true, cancelable: true });
    Object.defineProperty(event, "dataTransfer", {
        value: {
            types,
            files,
            items: files.map((f) => ({ kind: "file", type: f.type })),
            dropEffect: "none",
        },
    });
    target.dispatchEvent(event);
    return event;
}

describe("DropZoneManager", () => {
    it("adds the drag-over class while files are over the zone", () => {
        const { zone, surface } = setup();
        new DropZoneManager(zone);
        const enter = drag(zone, "dragenter", [file("a.png", "image/png")]);
        expect(enter.defaultPrevented).toBe(true);
        expect(zone.classList.contains("ss-c-dropzone--dragover")).toBe(true);

        // Entering a child, then leaving the zone, keeps the count right.
        drag(surface, "dragenter", [file("a.png", "image/png")]);
        drag(zone, "dragleave");
        expect(zone.classList.contains("ss-c-dropzone--dragover")).toBe(true);
        drag(surface, "dragleave");
        expect(zone.classList.contains("ss-c-dropzone--dragover")).toBe(false);
    });

    it("prevents the default on dragover so drop can fire", () => {
        const { zone } = setup();
        new DropZoneManager(zone);
        drag(zone, "dragenter", [file("a.png", "image/png")]);
        const over = drag(zone, "dragover", [file("a.png", "image/png")]);
        expect(over.defaultPrevented).toBe(true);
        expect((over as DragEvent).dataTransfer!.dropEffect).toBe("copy");
    });

    it("ignores drags that carry no files", () => {
        const { zone } = setup();
        new DropZoneManager(zone);
        const enter = drag(zone, "dragenter", [], ["text/plain"]);
        expect(enter.defaultPrevented).toBe(false);
        expect(zone.className).toBe("ss-c-dropzone");
    });

    it("shows the invalid state for a rejected MIME type during the drag", () => {
        // Only MIME tokens can be checked before the drop (no file names).
        const { zone } = setup('accept="image/*" multiple');
        new DropZoneManager(zone);
        drag(zone, "dragenter", [file("a.mp4", "video/mp4")]);
        expect(zone.classList.contains("ss-c-dropzone--invalid")).toBe(true);
        const over = drag(zone, "dragover", [file("a.mp4", "video/mp4")]);
        expect((over as DragEvent).dataTransfer!.dropEffect).toBe("none");
    });

    it("accepts dropped files: event, callback, status and list", () => {
        const { zone } = setup();
        const onFiles = vi.fn();
        const listener = vi.fn();
        zone.addEventListener("ss:dropzone:files", listener);
        new DropZoneManager(zone, { onFiles });

        const files = [
            file("a.png", "image/png", 2048),
            file("b.pdf", "application/pdf"),
        ];
        const drop = drag(zone, "drop", files);

        expect(drop.defaultPrevented).toBe(true);
        expect(onFiles).toHaveBeenCalledWith(files, zone);
        expect(
            (listener.mock.calls[0][0] as CustomEvent).detail.files,
        ).toEqual(files);
        expect(zone.querySelector(".ss-c-dropzone__status")!.textContent).toBe(
            "2 files selected",
        );
        const items = zone.querySelectorAll(".ss-c-dropzone__file");
        expect(items).toHaveLength(2);
        expect(items[0].textContent).toContain("a.png");
        expect(
            items[0].querySelector(".ss-c-dropzone__file-size")!.textContent,
        ).toBe("2.0 KB");
    });

    it("rejects files by extension on drop", () => {
        const { zone, input } = setup();
        const onInvalid = vi.fn();
        new DropZoneManager(zone, { onInvalid });
        drag(zone, "drop", [file("notes.txt", "text/plain")]);

        const reason = onInvalid.mock.calls[0][0] as DropZoneRejection;
        expect(reason.code).toBe("type");
        expect(zone.classList.contains("ss-c-dropzone--invalid")).toBe(true);
        expect(input.getAttribute("aria-invalid")).toBe("true");
        expect(
            zone.querySelector(".ss-c-dropzone__status")!.textContent,
        ).toContain("notes.txt");
    });

    it("rejects several files on a single-file input", () => {
        const { zone } = setup('accept=".pdf"');
        const listener = vi.fn();
        zone.addEventListener("ss:dropzone:invalid", listener);
        new DropZoneManager(zone);
        drag(zone, "drop", [file("a.pdf", ""), file("b.pdf", "")]);
        expect((listener.mock.calls[0][0] as CustomEvent).detail.code).toBe(
            "count",
        );
    });

    it("rejects files over the max size from the data attribute", () => {
        const { zone } = setup("");
        zone.dataset.ssDropzoneMaxSize = "100";
        const onInvalid = vi.fn();
        new DropZoneManager(zone, { onInvalid });
        drag(zone, "drop", [file("big.bin", "", 101)]);
        expect(onInvalid.mock.calls[0][0].code).toBe("size");
    });

    it("rejects drops on a disabled input", () => {
        const { zone, input } = setup("");
        input.disabled = true;
        const onInvalid = vi.fn();
        new DropZoneManager(zone, { onInvalid });
        drag(zone, "dragenter", [file("a.png", "image/png")]);
        expect(zone.classList.contains("ss-c-dropzone--invalid")).toBe(true);
        drag(zone, "drop", [file("a.png", "image/png")]);
        expect(onInvalid.mock.calls[0][0].code).toBe("disabled");
    });

    it("clears the invalid state after a valid drop", () => {
        const { zone, input } = setup();
        new DropZoneManager(zone);
        drag(zone, "drop", [file("x.txt", "text/plain")]);
        drag(zone, "drop", [file("ok.png", "image/png")]);
        expect(zone.classList.contains("ss-c-dropzone--invalid")).toBe(false);
        expect(input.hasAttribute("aria-invalid")).toBe(false);
    });

    it("validates files picked through the dialog", () => {
        const { zone, input } = setup();
        const onFiles = vi.fn();
        new DropZoneManager(zone, { onFiles });
        const picked = [file("photo.jpg", "image/jpeg")];
        Object.defineProperty(input, "files", {
            value: picked,
            configurable: true,
        });
        input.dispatchEvent(new Event("change"));
        expect(onFiles).toHaveBeenCalledWith(picked, zone);
        expect(zone.querySelector(".ss-c-dropzone__status")!.textContent).toBe(
            "1 file selected: photo.jpg",
        );
    });

    it("removes listeners and state classes on destroy", () => {
        const { zone } = setup();
        const manager = new DropZoneManager(zone);
        drag(zone, "dragenter", [file("a.png", "image/png")]);
        manager.destroy();
        expect(zone.className).toBe("ss-c-dropzone");
        const enter = drag(zone, "dragenter", [file("a.png", "image/png")]);
        expect(enter.defaultPrevented).toBe(false);
    });

    it("warns when the zone or input is missing", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        new DropZoneManager("#missing");
        document.body.innerHTML = '<div id="z"></div>';
        new DropZoneManager("#z");
        expect(warn).toHaveBeenCalledTimes(2);
        warn.mockRestore();
    });
});
