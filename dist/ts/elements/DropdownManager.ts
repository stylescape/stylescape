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



// Controls the behavior of dropdown menus, handling show and hide actions.

export default class DropdownManager {
    private dropdowns: NodeListOf<HTMLElement>;

    constructor() {
        this.dropdowns = document.querySelectorAll('.dropdown');
        document.addEventListener('click', this.handleClickOutside.bind(this));
    }

    toggleDropdown(dropdownId: string): void {
        const dropdown = document.getElementById(dropdownId);
        dropdown?.classList.toggle('active');
    }

    private handleClickOutside(event: MouseEvent): void {
        this.dropdowns.forEach(dropdown => {
            if (!dropdown.contains(event.target as Node)) {
                dropdown.classList.remove('active');
            }
        });
    }
}

// Usage
const dropdownManager = new DropdownManager();
// Call dropdownManager.toggleDropdown('dropdownId') to toggle
