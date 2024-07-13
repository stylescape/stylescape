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



// Manages filtering of items or data in the UI, for example, in a list or table.

export default class FilterManager {
    
    private filterInput: HTMLInputElement;
    private items: NodeListOf<HTMLElement>;

    constructor(filterInputId: string, itemsSelector: string) {
        this.filterInput = document.getElementById(filterInputId) as HTMLInputElement;
        this.items = document.querySelectorAll(itemsSelector);
        this.filterInput.addEventListener('input', this.applyFilter.bind(this));
    }

    private applyFilter(): void {
        const filterValue = this.filterInput.value.toLowerCase();
        this.items.forEach(item => {
            const text = item.textContent?.toLowerCase() || '';
            item.style.display = text.includes(filterValue) ? '' : 'none';
        });
    }
}

// Usage
const filterManager = new FilterManager('searchInput', '.list-item');
