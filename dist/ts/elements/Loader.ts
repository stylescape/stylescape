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
// Class
// ============================================================================

/**
 * @title Loader
 * @description Manages the loading indicator for graph visualizations.
 * 
 * This class is responsible for showing and hiding a loading indicator
 * within a specified container element. It is used to provide visual
 * feedback to the user while graph data is being loaded and processed.
 */
export class Loader {


    // Properties
    // ========================================================================

    private container_id: string;
    private element: HTMLElement | null;


    // Constructor
    // ========================================================================

    /**
     * Constructs a Loader instance for a specific container.
     * @param container_id The ID of the HTML element where the loader will
     * be shown.
     */
    constructor(container_id: string) {
        this.container_id = container_id;
        this.element = null;
        this.init();
    }


    // Methods
    // ========================================================================

    /**
     * Initializes the loader element and appends it to the container.
     * The loader is initially hidden.
     */    
    private init(): void {
        const container = document.getElementById(this.container_id);
        if (!container) {
            console.error(`Container with ID "${this.container_id}" not found.`);
            return;
        }

        this.element = document.createElement("div");
        this.element.className = "graph_loader";
        this.element.setAttribute("role", "status");
        this.element.setAttribute("aria-live", "assertive");
        this.element.style.display = "none"; // Initially hidden
        container.appendChild(this.element);
    }

    /**
     * Shows the loading indicator in the container.
     * If a loading element already exists, it does nothing.
     * Otherwise, it creates a new loading element and appends it to the
     * container.
     */
    public show(): void {
        if (this.element) {
            this.element.style.display = "block"; // Make visible
        }
    }

    /**
     * Hides and removes the loading indicator from the container.
     * If a loading element exists, it is removed from the DOM.
     */
    public hide(): void {
        if (this.element) {
            this.element.style.display = "none"; // Hide
        }
    }

}
