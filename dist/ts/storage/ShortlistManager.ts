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



// import { Shortlist } from './Shortlist';
// // import { ShortlistItem } from './Shortlist';
// type ShortlistItem = { name: string; value: string };

import { Shortlist, ShortlistItem } from './Shortlist';




/**
 * Manages multiple Shortlist instances.
 * Each Shortlist corresponds to a group of checkboxes with a common ID prefix.
 * Handles the synchronization between the checkboxes, the shortlists, and 
 * their respective display containers.
 */
export class ShortlistManager {

    // private shortlists: { [key: string]: Shortlist } = {};
    private shortlists: { [key: string]: Shortlist<ShortlistItem> } = {};

    /**
     * Initializes the ShortlistManager by scanning the page for checkboxes
     * with IDs starting with 'shortlist_'.
     */
     constructor() {
        this.initShortlists();
    }

    /**
     * Scans the page for checkboxes and initializes a Shortlist for each
     * unique ID prefix. This method is called by the constructor.
     */
    private initShortlists(): void {
        const checkboxes = document.querySelectorAll(
            `input[type="checkbox"][id^='shortlist_']`
        );
        // console.log(checkboxes);
        checkboxes.forEach((checkbox: HTMLInputElement) => {
            const storagePrefix = checkbox.id;
            // console.log(storagePrefix);
            if (!this.shortlists[storagePrefix]) {
                this.shortlists[storagePrefix] = new Shortlist<ShortlistItem>(storagePrefix);
            }
        });
    }

    /**
     * Initializes the state of the checkboxes based on the stored shortlists.
     * Adds event listeners to checkboxes for handling changes.
     * Initializes the display containers with the contents of the shortlists.
     */
    initialize(): void {
        const checkboxes = document.querySelectorAll(
            `input[type="checkbox"][id^='shortlist_']`
        );
        checkboxes.forEach((checkbox: HTMLInputElement) => {
            // Initialize checkbox state
            const storagePrefix = checkbox.id;
            const shortlist = this.getShortlist(storagePrefix);
            checkbox.checked = shortlist?.some(
                item => item.name === checkbox.name
            ) || false;
            // Add event listener
            checkbox.addEventListener(
                'change', () => this.handleCheckboxEvent(checkbox)
            );
        });

        Object.keys(this.shortlists).forEach(prefix => {
            this.updateDivShortlist(prefix, prefix + '_container');
        });
    }



    /**
     * Retrieves the shortlist associated with the given storage prefix.
     * @param storagePrefix The unique identifier for the shortlist.
     * @returns The array of items in the shortlist, or undefined if not found.
     */
    getShortlist(storagePrefix: string): ShortlistItem[] | undefined {
        return this.shortlists[storagePrefix]?.get();
    }


    /**
     * Updates an item in the shortlist corresponding to the given storage prefix.
     * @param storagePrefix The unique identifier for the shortlist.
     * @param item The item to be added or removed.
     * @param add A boolean indicating whether to add (true) or remove (false) the item.
     */
    updateItem(storagePrefix: string, item: ShortlistItem, add: boolean): void {
        if (this.shortlists[storagePrefix]) {
            this.shortlists[storagePrefix].updateItem(item, add);
        }
    }
    // updateItem(storagePrefix: string, item: ShortlistItem, add: boolean): void {
    //     if (this.shortlists[storagePrefix]) {
    //         this.shortlists[storagePrefix].updateItem(item, add);
    //     }
    //     // Update synchronized checkboxes if needed
    //     this.syncCheckBoxStates(storagePrefix);
    // }
    // updateItem(storagePrefix: string, item: ShortlistItem, add: boolean): void {
    //     if (this.shortlists[storagePrefix]) {
    //         this.shortlists[storagePrefix].updateItem(item, add);
    //     }
    //     // Avoid calling syncCheckBoxStates here to prevent recursion
    // }
    // /**
    //  * Handles checkbox change events. Updates the shortlist and the
    //  * corresponding display container.
    //  * @param checkbox The checkbox element that triggered the event.
    //  */
    handleCheckboxEvent(checkbox: HTMLInputElement): void {
        const storagePrefix = checkbox.id;
        const item = { name: checkbox.name, value: checkbox.value };
        this.updateItem(storagePrefix, item, checkbox.checked);
        this.updateDivShortlist(storagePrefix, storagePrefix + '_container');
        this.syncCheckBoxStates(storagePrefix);
    }
    // handleCheckboxEvent(checkbox: HTMLInputElement): void {
    //     const storagePrefix = checkbox.id;
    //     const item: ShortlistItem = { name: checkbox.name, value: checkbox.value };
    //     this.updateItem(storagePrefix, item, checkbox.checked);
    //     this.updateDivShortlist(storagePrefix, storagePrefix + '_container');
    //     this.syncCheckBoxStates(storagePrefix);
    // }
    // handleCheckboxEvent(checkbox: HTMLInputElement): void {
    //     const storagePrefix = checkbox.id;
    //     const item: ShortlistItem = { name: checkbox.name, value: checkbox.value };
    //     this.updateItem(storagePrefix, item, checkbox.checked);
    //     // Do not call syncCheckBoxStates here to avoid recursion
    //     this.updateDivShortlist(storagePrefix, storagePrefix + '_container');
    // }


    // /**
    //  * Updates the content of the display container associated with a shortlist.
    //  * @param storagePrefix The unique identifier for the shortlist.
    //  * @param divId The ID of the div where the shortlist content should be displayed.
    //  */
    // updateDivShortlist(storagePrefix: string, divId: string): void {
    //     const shortlist = this.getShortlist(storagePrefix) || [];
    //     const div = document.getElementById(divId);
    //     if (div) {
    //         div.innerHTML = shortlist.map(
    //             item => `${item.name} (${item.value})`).join('<br> '
    //         );
    //     }
    // }
        
    /**
     * Updates the content of the display container associated with a shortlist.
     * Creates an HTML list showing only the names of the items.
     * @param storagePrefix The unique identifier for the shortlist.
     * @param divId The ID of the div where the shortlist content should be displayed.
     */
    updateDivShortlist(storagePrefix: string, divId: string): void {
        const shortlist = this.getShortlist(storagePrefix) || [];
        const div = document.getElementById(divId);

        if (div) {
            // Creating an HTML list with each item's name
            let listContent = '<ul>';
            for (const item of shortlist) {
                listContent += `<li>${item.name}</li>`;
            }
            listContent += '</ul>';

            div.innerHTML = listContent;
        }
    }


    /**
     * Synchronizes the state of checkboxes across different lists based on their value attribute.
     * @param storagePrefix The unique identifier for the shortlist.
     */
    public syncCheckBoxStates(storagePrefix: string): void {
        const shortlist = this.getShortlist(storagePrefix);
        if (!shortlist) return;
        // Query all checkboxes that should be synchronized.
        const checkboxesToSync = document.querySelectorAll(
            `input[type="checkbox"][id^='shortlistbox_']`
        );
        // console.log(checkboxesToSync);
        checkboxesToSync.forEach((checkbox: HTMLInputElement) => {
            checkbox.checked = shortlist.some(
                item => item.value === checkbox.value
            );

            // const isChecked = checkbox.checked;
            // const item: ShortlistItem = { name: checkbox.name, value: checkbox.value };
            // if (isChecked && !shortlist.some(i => i.value === item.value)) {
            //     // Add item to shortlist if checked and not already in shortlist
            //     this.updateItem(storagePrefix, item, true);
            // } else if (!isChecked && shortlist.some(i => i.value === item.value)) {
            //     // Remove item from shortlist if unchecked and currently in shortlist
            //     this.updateItem(storagePrefix, item, false);
            // }
        });
    }

    // public syncCheckBoxStates(storagePrefix: string): void {
    //     const shortlist = this.getShortlist(storagePrefix);
    //     if (!shortlist) return;

    //     const checkboxesToSync = document.querySelectorAll(`input[type="checkbox"][id^='shortlistbox_']`);
    //     checkboxesToSync.forEach((checkbox: HTMLInputElement) => {
    //         const isChecked = checkbox.checked;
    //         const item: ShortlistItem = { name: checkbox.name, value: checkbox.value };

    //         if (isChecked && !shortlist.some(i => i.value === item.value)) {
    //             // Add item to shortlist if checked and not already in shortlist
    //             this.updateItem(storagePrefix, item, true);
    //         } else if (!isChecked && shortlist.some(i => i.value === item.value)) {
    //             // Remove item from shortlist if unchecked and currently in shortlist
    //             this.updateItem(storagePrefix, item, false);
    //         }
    //     });
    // }
    // public syncCheckBoxStates(storagePrefix: string): void {
    //     const shortlist = this.getShortlist(storagePrefix);
    //     if (!shortlist) return;

    //     const checkboxesToSync = document.querySelectorAll(`input[type="checkbox"][id^='shortlistbox_']`);
    //     checkboxesToSync.forEach((checkbox: HTMLInputElement) => {
    //         checkbox.checked = shortlist.some(item => item.value === checkbox.value);
    //     });
    // }

    // /**
    //  * Initializes the state of a checkbox based on the stored shortlist and adds an event listener.
    //  * @param checkbox The checkbox element to initialize.
    //  * @param storagePrefix The storage prefix associated with the checkbox's shortlist.
    //  */
    //      private initializeCheckbox(checkbox: HTMLInputElement, storagePrefix: string): void {
    //         const shortlist = this.shortlists[storagePrefix].get();
    //         checkbox.checked = shortlist.includes(checkbox.value);
    //         checkbox.addEventListener('change', () => this.handleCheckboxEvent(checkbox, storagePrefix));
    //     }

}
