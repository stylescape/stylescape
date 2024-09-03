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
// State Manager
// ============================================================================


export class StateManager {
    /**
     * Toggles a specified class on an element.
     * @param element The DOM element to toggle the class on.
     * @param className The class to toggle. Defaults to "active".
     */

    public toggleClass(
        element: Element,
        className: string = 'active'
    ): void {
        if (!element) {
            console.warn(`Element: '${element}' not found`);
            return;
        }

        element.classList.toggle(className);
    }

}


// Usage example
// const stateManager = new StateManager();
// const element = document.getElementById('someElement'); // Replace with your actual element ID

// if (element) {
//     stateManager.toggleClass(element, 'active'); // You can now toggle any class, not just 'active'
// } else {
//     console.error('Element not found');
// }
