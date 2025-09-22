// ============================================================================
// Details
// ============================================================================

// ============================================================================
// DetailManager
// ============================================================================

/**
 * Class for managing <details> elements.
 *
 * Behavior:
 * - Accordion mode: only one <details> can stay open at a time.
 * - Clicking outside any <details> closes all of them.
 */
export class DetailManager {
    private details: NodeListOf<HTMLDetailsElement>
    private boundHandler: (event: Event) => void

    /**
     * Initializes the DetailManager.
     * Selects all <details> elements and attaches a single document-level listener.
     *
     * @param selector - CSS selector for <details> elements (default: "details").
     */
    constructor(selector: string = "details") {
        this.details = document.querySelectorAll<HTMLDetailsElement>(selector)
        this.boundHandler = this.handleClick.bind(this)

        document.addEventListener("click", this.boundHandler)
    }

    /**
     * Handles clicks:
     * - If clicking a <summary>: closes all others, keeps only that one open.
     * - If clicking outside any <details>: closes all.
     */
    private handleClick(event: Event): void {
        const target = event.target as HTMLElement
        const summary = target.closest("summary")
        const parent = summary?.parentElement as HTMLDetailsElement | null

        if (parent && parent.tagName === "DETAILS") {
            // Clicked a summary → close others
            this.details.forEach((detail) => {
                if (detail !== parent) detail.removeAttribute("open")
            })
        } else {
            // Clicked outside → close all
            this.details.forEach((detail) => detail.removeAttribute("open"))
        }
    }

    /**
     * Toggles a specific <details> element open or closed.
     */
    toggle(detail: HTMLDetailsElement, open: boolean): void {
        if (open) detail.setAttribute("open", "")
        else detail.removeAttribute("open")
    }

    /**
     * Cleans up the event listener (useful for SPA cleanup).
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
