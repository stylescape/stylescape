// ============================================================================
// Details
// ============================================================================

/**
 * Class for managing <details> elements.
 *
 * Supports two modes:
 * - Accordion mode (default): only one <details> can stay open at a time.
 * - Free mode: multiple <details> can stay open.
 *
 * Usage:
 * ```ts
 * // Accordion mode
 * new DetailManager()
 *
 * // Free mode
 * new DetailManager({ singleOpen: false })
 * ```
 */
export class DetailManager {
    private details: NodeListOf<HTMLDetailsElement>
    private singleOpen: boolean
    private boundHandler: (event: Event) => void

    /**
     * Create a new DetailManager.
     *
     * @param options - Configuration object.
     * @param options.selector - CSS selector for <details> elements (default: "details").
     * @param options.singleOpen - Whether only one <details> can stay open (default: true).
     */
    constructor(options: { selector?: string; singleOpen?: boolean } = {}) {
        this.details = document.querySelectorAll<HTMLDetailsElement>(
            options.selector ?? "details",
        )
        this.singleOpen = options.singleOpen ?? true
        this.boundHandler = this.handleClick.bind(this)

        document.addEventListener("click", this.boundHandler)
    }

    /**
     * Handles clicks and closes other <details> when in accordion mode.
     */
    private handleClick(event: Event): void {
        const target = event.target as HTMLElement
        const summary = target.closest("summary")
        const parent = summary?.parentElement as HTMLDetailsElement | null

        if (!parent || parent.tagName !== "DETAILS") return

        if (this.singleOpen) {
            this.details.forEach((detail) => {
                if (detail !== parent) {
                    detail.removeAttribute("open")
                }
            })
        }
    }

    /**
     * Toggle a specific <details> element open or closed.
     */
    toggle(detail: HTMLDetailsElement, open: boolean): void {
        if (open) detail.setAttribute("open", "")
        else detail.removeAttribute("open")
    }

    /**
     * Remove the global event listener.
     */
    destroy(): void {
        document.removeEventListener("click", this.boundHandler)
    }
}

// /**
//  * Class responsible for managing <details> elements in a document.
//  * It ensures that only one <details> element can be open at a time.
//  */
// export class DetailManager {
//     private details: NodeListOf<HTMLElement>

//     /**
//      * Initializes the DetailManager by selecting all <details> elements and
//      * attaching event listeners.
//      */
//     constructor() {
//         this.details = document.querySelectorAll('details')
//         if (this.details.length > 0) {
//             this.attachEventListeners()
//         }
//     }

//     /**
//      * Attaches a click event listener to the document to handle <details>
//      * opening.
//      */
//     private attachEventListeners(): void {
//         document.addEventListener('click', this.handleDocumentClick.bind(this))
//     }

//     /**
//      * Handles click events on the document and closes any <details> elements
//      * that are not the target of the click.
//      * @param event - The MouseEvent object from the click event.
//      */
//     private handleDocumentClick(event: MouseEvent): void {
//         const targetDetail = event.target as HTMLElement
//         if (
//             targetDetail.tagName === 'SUMMARY' &&
//             targetDetail.parentElement?.tagName === 'DETAILS'
//         ) {
//             this.details.forEach((detail) => {
//                 if (detail !== targetDetail.parentElement) {
//                     detail.removeAttribute('open')
//                 }
//             })
//         }
//     }

//     /**
//      * Toggles the open state of a specified <details> element.
//      * @param detail - The <details> element to toggle.
//      * @param open - A boolean indicating whether to open or close the
//      * <details> element.
//      */
//     toggleDetail(detail: HTMLElement, open: boolean): void {
//         if (open) {
//             detail.setAttribute('open', '')
//         } else {
//             detail.removeAttribute('open')
//         }
//     }

//     /**
//      * Detaches the event listener from the document. Useful for cleanup in
//      * single-page applications.
//      */
//     detachEventListeners(): void {
//         document.removeEventListener('click', this.handleDocumentClick.bind(this))
//     }
// }

// // Usage
// const detailsManager = new DetailManager();
// Toggle a specific detail element
// const specificDetail = document.querySelector("details#specific") as HTMLElement;
// detailsManager.toggleDetail(specificDetail, true); // Open
// detailsManager.toggleDetail(specificDetail, false); // Close

// export default class DetailManager {

//     private details: NodeListOf<HTMLElement>;

//     constructor() {
//         this.details = document.querySelectorAll("details");
//         this.addClickListeners();
//     }

//     private addClickListeners(): void {
//         this.details.forEach(targetDetail => {
//             targetDetail.addEventListener("click", () => this.handleDetailClick(targetDetail));
//         });
//     }

//     private handleDetailClick(targetDetail: HTMLElement): void {
//         this.details.forEach(detail => {
//             if (detail !== targetDetail) {
//                 detail.removeAttribute("open");
//             }
//         });
//     }
// }

// // Usage
// const detailsManager = new DetailManager();

// // Fetch all the details element.
// const details = document.querySelectorAll("details")!

// // Add the onclick listeners.
// details.forEach((targetDetail) => {
//     targetDetail.addEventListener("click", () => {
//         // Close all the details that are not targetDetail.
//         details.forEach((detail) => {
//             if (detail !== targetDetail) {
//                 detail.removeAttribute("open");
//             }
//         });
//     });
// });
