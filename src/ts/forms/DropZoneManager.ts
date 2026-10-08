// ============================================================================
// Stylescape | Drop Zone Manager
// ============================================================================
// Adds file drag-and-drop to a `.ss-c-dropzone`. The zone's surface is the
// label of a file input, so clicking or pressing Enter/Space on the
// (focusable) input opens the picker without this script. The manager adds:
// - drag-over and invalid states (`ss-c-dropzone--dragover` / `--invalid`)
// - `accept`, `multiple` and max-size checks on dropped files
// - dropped files copied into the input (so the form submits them), plus
//   `change` and an `ss:dropzone:files` CustomEvent
// - an optional file list and status message
//
// For moving elements between containers see DragAndDropManager.
// ============================================================================

/**
 * Configuration options for DropZoneManager
 */
export interface DropZoneOptions {
    /** Selector for the file input inside the zone */
    inputSelector?: string;
    /** Maximum size per file in bytes (also `data-ss-dropzone-max-size`) */
    maxSize?: number;
    /** Class while files are dragged over the zone */
    dragOverClass?: string;
    /** Class when the dragged or dropped files are rejected */
    invalidClass?: string;
    /** Render the chosen files into `.ss-c-dropzone__files` */
    listFiles?: boolean;
    /** Called with accepted files (dropped or picked) */
    onFiles?: (files: File[], zone: HTMLElement) => void;
    /** Called when files are rejected */
    onInvalid?: (reason: DropZoneRejection, zone: HTMLElement) => void;
}

/** Why files were rejected */
export interface DropZoneRejection {
    code: "type" | "count" | "size" | "disabled";
    message: string;
    files: File[];
}

/** Detail of the `ss:dropzone:files` event */
export interface DropZoneFilesDetail {
    files: File[];
}

const PREFIX = "ss-c-dropzone";

/**
 * File drop zone with validation and keyboard-accessible fallback.
 *
 * @example JavaScript
 * ```typescript
 * const zone = new DropZoneManager("#upload-zone", {
 *     maxSize: 10 * 1024 * 1024,
 *     onFiles: (files) => upload(files),
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <div class="ss-c-dropzone" data-ss="dropzone" data-ss-dropzone-max-size="10485760">
 *     <input id="scan" type="file" class="ss-c-dropzone__input"
 *            accept="image/*,.pdf" multiple aria-describedby="scan-hint">
 *     <label for="scan" class="ss-c-dropzone__surface">
 *         <span class="ss-c-dropzone__title">Drop scans here or
 *             <span class="ss-c-dropzone__browse">browse</span></span>
 *         <span class="ss-c-dropzone__hint" id="scan-hint">Images or PDF, up to 10 MB</span>
 *     </label>
 *     <p class="ss-c-dropzone__status" role="status"></p>
 *     <ul class="ss-c-dropzone__files"></ul>
 * </div>
 * ```
 */
export class DropZoneManager {
    private zone: HTMLElement | null;
    private input: HTMLInputElement | null = null;
    private options: Required<
        Omit<DropZoneOptions, "maxSize" | "onFiles" | "onInvalid">
    > &
        Pick<DropZoneOptions, "maxSize" | "onFiles" | "onInvalid">;
    private depth = 0;

    constructor(
        selectorOrElement: string | HTMLElement,
        options: DropZoneOptions = {},
    ) {
        this.zone =
            typeof selectorOrElement === "string"
                ? document.querySelector<HTMLElement>(selectorOrElement)
                : selectorOrElement;

        const attrMax = this.zone?.dataset.ssDropzoneMaxSize;
        this.options = {
            inputSelector:
                options.inputSelector ??
                `.${PREFIX}__input, input[type="file"]`,
            maxSize:
                options.maxSize ??
                (attrMax !== undefined ? Number(attrMax) : undefined),
            dragOverClass: options.dragOverClass ?? `${PREFIX}--dragover`,
            invalidClass: options.invalidClass ?? `${PREFIX}--invalid`,
            listFiles: options.listFiles ?? true,
            onFiles: options.onFiles,
            onInvalid: options.onInvalid,
        };

        if (!this.zone) {
            console.warn("[Stylescape] DropZoneManager element not found");
            return;
        }

        this.init();
    }

    // ========================================================================
    // Public Properties
    // ========================================================================

    /** Files currently held by the input */
    get files(): File[] {
        return Array.from(this.input?.files ?? []);
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Check files against the input's `accept`, `multiple` and the max size.
     * Returns the rejection, or null when they are acceptable.
     */
    public validate(files: File[]): DropZoneRejection | null {
        const input = this.input;
        if (!input) return null;

        if (input.disabled) {
            return {
                code: "disabled",
                message: "Uploads are disabled.",
                files,
            };
        }
        if (!input.multiple && files.length > 1) {
            return { code: "count", message: "Drop one file only.", files };
        }
        const wrongType = files.filter(
            (file) => !this.accepts(file.type, file.name),
        );
        if (wrongType.length) {
            return {
                code: "type",
                message: `File type not accepted: ${wrongType.map((f) => f.name).join(", ")}.`,
                files: wrongType,
            };
        }
        const max = this.options.maxSize;
        const tooBig =
            max !== undefined ? files.filter((file) => file.size > max) : [];
        if (tooBig.length && max !== undefined) {
            return {
                code: "size",
                message: `Larger than ${formatBytes(max)}: ${tooBig.map((f) => f.name).join(", ")}.`,
                files: tooBig,
            };
        }
        return null;
    }

    /**
     * Destroy the manager
     */
    public destroy(): void {
        const zone = this.zone;
        if (zone) {
            zone.removeEventListener("dragenter", this.handleDragEnter);
            zone.removeEventListener("dragover", this.handleDragOver);
            zone.removeEventListener("dragleave", this.handleDragLeave);
            zone.removeEventListener("drop", this.handleDrop);
            zone.classList.remove(
                this.options.dragOverClass,
                this.options.invalidClass,
            );
        }
        this.input?.removeEventListener("change", this.handleChange);
        this.zone = null;
        this.input = null;
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private init(): void {
        if (!this.zone) return;

        this.input = this.zone.querySelector<HTMLInputElement>(
            this.options.inputSelector,
        );
        if (!this.input) {
            console.warn(
                "[Stylescape] DropZoneManager: no file input in zone",
            );
            return;
        }

        this.zone.addEventListener("dragenter", this.handleDragEnter);
        this.zone.addEventListener("dragover", this.handleDragOver);
        this.zone.addEventListener("dragleave", this.handleDragLeave);
        this.zone.addEventListener("drop", this.handleDrop);
        this.input.addEventListener("change", this.handleChange);
    }

    private isFileDrag(event: DragEvent): boolean {
        const types = event.dataTransfer?.types;
        return !!types && Array.from(types).includes("Files");
    }

    // Only MIME types are known before the drop (no names), so this can
    // reject e.g. a video on an image zone, but extension-only `accept`
    // lists are checked on drop.
    private dragIsValid(event: DragEvent): boolean {
        const input = this.input;
        if (!input || input.disabled) return false;
        const items = Array.from(event.dataTransfer?.items ?? []).filter(
            (item) => item.kind === "file",
        );
        if (!input.multiple && items.length > 1) return false;
        return items.every((item) => this.accepts(item.type, null));
    }

    private handleDragEnter = (event: DragEvent): void => {
        if (!this.isFileDrag(event)) return;
        event.preventDefault();
        this.depth += 1;
        if (this.depth === 1) {
            const valid = this.dragIsValid(event);
            this.setState(valid ? "dragover" : "invalid");
        }
    };

    private handleDragOver = (event: DragEvent): void => {
        if (!this.isFileDrag(event)) return;
        // Required for the drop event to fire.
        event.preventDefault();
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = this.zone?.classList.contains(
                this.options.invalidClass,
            )
                ? "none"
                : "copy";
        }
    };

    // dragleave also fires when moving onto a child; count enter/leave pairs.
    private handleDragLeave = (event: DragEvent): void => {
        if (!this.isFileDrag(event)) return;
        this.depth = Math.max(0, this.depth - 1);
        if (this.depth === 0) this.setState(null);
    };

    private handleDrop = (event: DragEvent): void => {
        if (!this.isFileDrag(event)) return;
        event.preventDefault();
        this.depth = 0;
        this.setState(null);

        const files = Array.from(event.dataTransfer?.files ?? []);
        if (!files.length) return;

        const rejection = this.validate(files);
        if (rejection) {
            this.reject(rejection);
            return;
        }

        if (this.assignToInput(files)) {
            // Picking through the dialog fires `change` natively; do the
            // same so form code has a single hook (it calls accept()).
            this.input?.dispatchEvent(new Event("change", { bubbles: true }));
        } else {
            this.accept(files);
        }
    };

    private handleChange = (): void => {
        const files = this.files;
        const rejection = files.length ? this.validate(files) : null;
        if (rejection) {
            this.reject(rejection);
            return;
        }
        this.accept(files);
    };

    private accept(files: File[]): void {
        const zone = this.zone;
        if (!zone) return;

        this.setState(null);
        this.input?.removeAttribute("aria-invalid");
        this.setStatus(
            files.length === 0
                ? ""
                : files.length === 1
                  ? `1 file selected: ${files[0].name}`
                  : `${files.length} files selected`,
        );
        if (this.options.listFiles) this.renderList(files);

        zone.dispatchEvent(
            new CustomEvent<DropZoneFilesDetail>("ss:dropzone:files", {
                bubbles: true,
                detail: { files },
            }),
        );
        this.options.onFiles?.(files, zone);
    }

    private reject(rejection: DropZoneRejection): void {
        const zone = this.zone;
        if (!zone) return;

        this.setState("invalid");
        this.input?.setAttribute("aria-invalid", "true");
        this.setStatus(rejection.message);

        zone.dispatchEvent(
            new CustomEvent<DropZoneRejection>("ss:dropzone:invalid", {
                bubbles: true,
                detail: rejection,
            }),
        );
        this.options.onInvalid?.(rejection, zone);
    }

    // FileList is read-only; a DataTransfer is the only way to build one.
    // Where DataTransfer cannot be constructed (old browsers, jsdom) the
    // files still reach code through the events and callbacks.
    private assignToInput(files: File[]): boolean {
        const input = this.input;
        if (!input || typeof DataTransfer === "undefined") return false;
        const transfer = new DataTransfer();
        files.forEach((file) => transfer.items.add(file));
        input.files = transfer.files;
        return true;
    }

    private setState(state: "dragover" | "invalid" | null): void {
        this.zone?.classList.toggle(
            this.options.dragOverClass,
            state === "dragover",
        );
        this.zone?.classList.toggle(
            this.options.invalidClass,
            state === "invalid",
        );
    }

    private setStatus(message: string): void {
        const status = this.zone?.querySelector<HTMLElement>(
            `.${PREFIX}__status`,
        );
        if (status) status.textContent = message;
    }

    private renderList(files: File[]): void {
        const list = this.zone?.querySelector<HTMLElement>(
            `.${PREFIX}__files`,
        );
        if (!list) return;

        list.replaceChildren(
            ...files.map((file) => {
                const item = document.createElement("li");
                item.className = `${PREFIX}__file`;
                const name = document.createElement("span");
                name.className = `${PREFIX}__file-name`;
                name.textContent = file.name;
                const size = document.createElement("span");
                size.className = `${PREFIX}__file-size`;
                size.textContent = formatBytes(file.size);
                item.append(name, size);
                return item;
            }),
        );
    }

    /** Match a MIME type and/or file name against the input's `accept`. */
    private accepts(type: string, name: string | null): boolean {
        const accept = this.input?.accept.trim();
        if (!accept) return true;

        const mime = type.toLowerCase();
        return accept
            .split(",")
            .map((token) => token.trim().toLowerCase())
            .filter(Boolean)
            .some((token) => {
                if (token.startsWith(".")) {
                    // Unknown before the drop: let the drop decide.
                    return name === null
                        ? true
                        : name.toLowerCase().endsWith(token);
                }
                if (token.endsWith("/*")) {
                    return mime.startsWith(token.slice(0, -1));
                }
                // Some systems report no MIME type during the drag.
                return mime === token || (name === null && mime === "");
            });
    }
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    const units = ["KB", "MB", "GB"];
    let value = bytes / 1024;
    let unit = 0;
    while (value >= 1024 && unit < units.length - 1) {
        value /= 1024;
        unit += 1;
    }
    return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unit]}`;
}

export default DropZoneManager;
