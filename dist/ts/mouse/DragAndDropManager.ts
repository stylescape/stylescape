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


// Facilitates drag-and-drop functionalities for UI elements.

export default class DragAndDropManager {
    private draggableElements: NodeListOf<HTMLElement>;

    constructor(draggableSelector: string) {
        this.draggableElements = document.querySelectorAll(draggableSelector);
        this.initializeDraggables();
    }

    private initializeDraggables(): void {
        this.draggableElements.forEach(element => {
            element.setAttribute('draggable', 'true');
            element.addEventListener('dragstart', this.handleDragStart.bind(this));
            // Add other event listeners as required (e.g., dragend, dragover)
        });
    }

    private handleDragStart(event: DragEvent): void {
        // Handle the drag start logic here
    }
}

// Usage
const dragAndDropManager = new DragAndDropManager('.draggable');
