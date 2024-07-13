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


export type ShortlistItem = { name: string; value: string };


/**
 * Manages a shortlist of items stored in local storage.
 * This class provides methods to retrieve, update, and display the shortlist.
 */
export class Shortlist<T = ShortlistItem> {


    /**
     * Creates an instance of Shortlist.
     * @param storagePrefix A unique identifier for the shortlist's local
     * storage key.
     */
    constructor(private storagePrefix: string) {}


    /**
     * Retrieves the shortlist from local storage.
     * @returns An array of strings representing the items in the shortlist.
     */
    get(): ShortlistItem[] {
        // Parsing the stored JSON string into an array, or defaulting to an 
        // empty array if nothing is stored.
        return JSON.parse(localStorage.getItem(this.storagePrefix) || '[]');
    }


    /**
     * Stores the shortlist in local storage.
     * @param value An array of strings representing the items to be stored
     * in the shortlist.
     */
     set(value: ShortlistItem[]): void {
        // Serializing the array into a JSON string and storing it in local
        // storage under the specified key.
        localStorage.setItem(this.storagePrefix, JSON.stringify(value));
    }


    /**
     * Adds or removes an item from the shortlist.
     * Each item is an object with 'name' and 'value' properties.
     * @param item The item object to add or remove.
     * @param add A boolean indicating whether to add (true) or remove (false)
     * the item.
     */    
    updateItem(item: ShortlistItem, add: boolean): void {
        let shortlist = this.get();
        const index = shortlist.findIndex(i => i.name === item.name);

        // Adding or removing the item based on the `add` parameter.
        if (add) {
            if (index < 0) shortlist.push(item);
        } else {
            if (index >= 0) shortlist.splice(index, 1);
        }

        // Updating the stored shortlist after modification.
        this.set(shortlist);
    }



    /**
     * Updates a div with the items in the shortlist as an HTML list.
     * @param divId The ID of the div where the shortlist should be displayed.
     */
    updateDivShortlist(divId: string): void {
        const shortlist =this.get();
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

}