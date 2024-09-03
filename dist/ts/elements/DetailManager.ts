// Copyright 2024 Scape Agency BV

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// ============================================================================
// Details
// ============================================================================

/**
 * Class responsible for managing <details> elements in a document.
 * It ensures that only one <details> element can be open at a time.
 */
export class DetailManager {
    private details: NodeListOf<HTMLElement>

    /**
     * Initializes the DetailManager by selecting all <details> elements and
     * attaching event listeners.
     */
    constructor() {
        this.details = document.querySelectorAll('details')
        if (this.details.length > 0) {
            this.attachEventListeners()
        }
    }

    /**
     * Attaches a click event listener to the document to handle <details>
     * opening.
     */
    private attachEventListeners(): void {
        document.addEventListener('click', this.handleDocumentClick.bind(this))
    }

    /**
     * Handles click events on the document and closes any <details> elements
     * that are not the target of the click.
     * @param event - The MouseEvent object from the click event.
     */
    private handleDocumentClick(event: MouseEvent): void {
        const targetDetail = event.target as HTMLElement
        if (
            targetDetail.tagName === 'SUMMARY' &&
            targetDetail.parentElement?.tagName === 'DETAILS'
        ) {
            this.details.forEach((detail) => {
                if (detail !== targetDetail.parentElement) {
                    detail.removeAttribute('open')
                }
            })
        }
    }

    /**
     * Toggles the open state of a specified <details> element.
     * @param detail - The <details> element to toggle.
     * @param open - A boolean indicating whether to open or close the
     * <details> element.
     */
    toggleDetail(detail: HTMLElement, open: boolean): void {
        if (open) {
            detail.setAttribute('open', '')
        } else {
            detail.removeAttribute('open')
        }
    }

    /**
     * Detaches the event listener from the document. Useful for cleanup in
     * single-page applications.
     */
    detachEventListeners(): void {
        document.removeEventListener('click', this.handleDocumentClick.bind(this))
    }
}

// Usage
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
