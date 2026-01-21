// ============================================================================
// Stylescape | Drag and Drop Manager
// ============================================================================
// Facilitates drag-and-drop functionalities for UI elements.
// Supports data-ss-draggable and data-ss-dropzone attributes.
// ============================================================================

/**
 * Configuration options for DragAndDropManager
 */
export interface DragAndDropOptions {
    /** CSS class applied while dragging */
    draggingClass?: string
    /** CSS class applied to valid drop target */
    dragOverClass?: string
    /** Selector for drop zones */
    dropZoneSelector?: string
    /** Allow dragging between containers */
    allowCrossContainer?: boolean
    /** Data transfer effect */
    effectAllowed?: DataTransfer["effectAllowed"]
    /** Data transfer format */
    dataFormat?: string
    /** Callback when drag starts */
    onDragStart?: (element: HTMLElement, event: DragEvent) => void
    /** Callback when drag ends */
    onDragEnd?: (element: HTMLElement, event: DragEvent) => void
    /** Callback when dropped */
    onDrop?: (dragged: HTMLElement, dropZone: HTMLElement, event: DragEvent) => void
    /** Callback for drag over */
    onDragOver?: (element: HTMLElement, event: DragEvent) => boolean | void
    /** Handle for dragging (child selector) */
    handleSelector?: string
}

/**
 * Comprehensive drag-and-drop manager with zones and callbacks.
 *
 * @example JavaScript
 * ```typescript
 * const dnd = new DragAndDropManager(".task-card", {
 *     dropZoneSelector: ".task-column",
 *     onDrop: (card, column) => {
 *         column.appendChild(card)
 *         updateTaskOrder()
 *     }
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <div data-ss="draggable"
 *      data-ss-draggable-handle=".drag-handle">
 *     <span class="drag-handle">≡</span>
 *     <span>Draggable item</span>
 * </div>
 *
 * <div data-ss="dropzone"
 *      data-ss-dropzone-accept=".task-card">
 *     Drop items here
 * </div>
 * ```
 */
export class DragAndDropManager {
    private draggables: Set<HTMLElement> = new Set()
    private dropZones: Set<HTMLElement> = new Set()
    private options: Required<DragAndDropOptions>
    private currentDragged: HTMLElement | null = null

    constructor(
        draggableSelector: string | HTMLElement | HTMLElement[],
        options: DragAndDropOptions = {}
    ) {
        this.options = {
            draggingClass: options.draggingClass ?? "ss-dragging",
            dragOverClass: options.dragOverClass ?? "ss-drag-over",
            dropZoneSelector: options.dropZoneSelector ?? "[data-ss='dropzone']",
            allowCrossContainer: options.allowCrossContainer ?? true,
            effectAllowed: options.effectAllowed ?? "move",
            dataFormat: options.dataFormat ?? "text/plain",
            onDragStart: options.onDragStart ?? (() => {}),
            onDragEnd: options.onDragEnd ?? (() => {}),
            onDrop: options.onDrop ?? (() => {}),
            onDragOver: options.onDragOver ?? (() => true),
            handleSelector: options.handleSelector ?? ""
        }

        this.initDraggables(draggableSelector)
        this.initDropZones()
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Add a draggable element
     */
    public addDraggable(element: HTMLElement): void {
        this.setupDraggable(element)
        this.draggables.add(element)
    }

    /**
     * Remove a draggable element
     */
    public removeDraggable(element: HTMLElement): void {
        this.teardownDraggable(element)
        this.draggables.delete(element)
    }

    /**
     * Add a drop zone
     */
    public addDropZone(element: HTMLElement): void {
        this.setupDropZone(element)
        this.dropZones.add(element)
    }

    /**
     * Remove a drop zone
     */
    public removeDropZone(element: HTMLElement): void {
        this.teardownDropZone(element)
        this.dropZones.delete(element)
    }

    /**
     * Get the currently dragged element
     */
    public getDragged(): HTMLElement | null {
        return this.currentDragged
    }

    /**
     * Enable/disable drag on an element
     */
    public setDraggable(element: HTMLElement, enabled: boolean): void {
        element.setAttribute("draggable", String(enabled))
        element.setAttribute("aria-grabbed", String(enabled && this.currentDragged === element))
    }

    /**
     * Destroy the manager and clean up
     */
    public destroy(): void {
        this.draggables.forEach((el) => this.teardownDraggable(el))
        this.dropZones.forEach((el) => this.teardownDropZone(el))
        this.draggables.clear()
        this.dropZones.clear()
        this.currentDragged = null
    }

    // ========================================================================
    // Static Factory
    // ========================================================================

    /**
     * Initialize all draggable elements with data-ss="draggable"
     */
    public static initDraggables(): DragAndDropManager[] {
        const managers: DragAndDropManager[] = []
        const draggables = document.querySelectorAll<HTMLElement>('[data-ss="draggable"]')

        // Group by parent container or handle individually
        draggables.forEach((el) => {
            const handle = el.dataset.ssDraggableHandle
            const manager = new DragAndDropManager(el, {
                handleSelector: handle
            })
            managers.push(manager)
        })

        return managers
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private initDraggables(selector: string | HTMLElement | HTMLElement[]): void {
        let elements: HTMLElement[]

        if (typeof selector === "string") {
            elements = Array.from(document.querySelectorAll<HTMLElement>(selector))
        } else if (Array.isArray(selector)) {
            elements = selector
        } else {
            elements = [selector]
        }

        elements.forEach((el) => {
            this.setupDraggable(el)
            this.draggables.add(el)
        })
    }

    private initDropZones(): void {
        const zones = document.querySelectorAll<HTMLElement>(this.options.dropZoneSelector)
        zones.forEach((zone) => {
            this.setupDropZone(zone)
            this.dropZones.add(zone)
        })
    }

    private setupDraggable(element: HTMLElement): void {
        element.setAttribute("draggable", "true")
        element.setAttribute("role", "listitem")
        element.setAttribute("aria-grabbed", "false")

        // Handle selector support
        if (this.options.handleSelector) {
            const handle = element.querySelector<HTMLElement>(this.options.handleSelector)
            if (handle) {
                handle.style.cursor = "grab"
                element.setAttribute("draggable", "false")
                handle.addEventListener("mousedown", () => {
                    element.setAttribute("draggable", "true")
                })
                handle.addEventListener("mouseup", () => {
                    element.setAttribute("draggable", "false")
                })
            }
        }

        element.addEventListener("dragstart", this.handleDragStart)
        element.addEventListener("dragend", this.handleDragEnd)
    }

    private teardownDraggable(element: HTMLElement): void {
        element.removeAttribute("draggable")
        element.removeAttribute("aria-grabbed")
        element.removeEventListener("dragstart", this.handleDragStart)
        element.removeEventListener("dragend", this.handleDragEnd)
    }

    private setupDropZone(element: HTMLElement): void {
        element.setAttribute("role", "list")
        element.setAttribute("aria-dropeffect", "move")

        element.addEventListener("dragover", this.handleDragOver)
        element.addEventListener("dragenter", this.handleDragEnter)
        element.addEventListener("dragleave", this.handleDragLeave)
        element.addEventListener("drop", this.handleDrop)
    }

    private teardownDropZone(element: HTMLElement): void {
        element.removeAttribute("aria-dropeffect")
        element.removeEventListener("dragover", this.handleDragOver)
        element.removeEventListener("dragenter", this.handleDragEnter)
        element.removeEventListener("dragleave", this.handleDragLeave)
        element.removeEventListener("drop", this.handleDrop)
    }

    // ========================================================================
    // Event Handlers
    // ========================================================================

    private handleDragStart = (event: DragEvent): void => {
        const target = event.currentTarget as HTMLElement

        this.currentDragged = target
        target.classList.add(this.options.draggingClass)
        target.setAttribute("aria-grabbed", "true")

        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = this.options.effectAllowed
            event.dataTransfer.setData(this.options.dataFormat, target.id || "dragged")
        }

        this.options.onDragStart(target, event)
    }

    private handleDragEnd = (event: DragEvent): void => {
        const target = event.currentTarget as HTMLElement

        target.classList.remove(this.options.draggingClass)
        target.setAttribute("aria-grabbed", "false")

        // Remove drag-over class from all zones
        this.dropZones.forEach((zone) => {
            zone.classList.remove(this.options.dragOverClass)
        })

        this.options.onDragEnd(target, event)
        this.currentDragged = null
    }

    private handleDragOver = (event: DragEvent): void => {
        const target = event.currentTarget as HTMLElement
        const result = this.options.onDragOver(target, event)

        // Allow drop if callback returns true or undefined
        if (result !== false) {
            event.preventDefault()
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = "move"
            }
        }
    }

    private handleDragEnter = (event: DragEvent): void => {
        const target = event.currentTarget as HTMLElement
        target.classList.add(this.options.dragOverClass)
    }

    private handleDragLeave = (event: DragEvent): void => {
        const target = event.currentTarget as HTMLElement
        // Only remove class if leaving the dropzone entirely
        const relatedTarget = event.relatedTarget as Node
        if (!target.contains(relatedTarget)) {
            target.classList.remove(this.options.dragOverClass)
        }
    }

    private handleDrop = (event: DragEvent): void => {
        event.preventDefault()

        const dropZone = event.currentTarget as HTMLElement
        dropZone.classList.remove(this.options.dragOverClass)

        if (this.currentDragged) {
            // Check cross-container constraint
            if (!this.options.allowCrossContainer) {
                const originalParent = this.currentDragged.parentElement
                if (originalParent !== dropZone) {
                    return
                }
            }

            this.options.onDrop(this.currentDragged, dropZone, event)
        }
    }
}

export default DragAndDropManager
