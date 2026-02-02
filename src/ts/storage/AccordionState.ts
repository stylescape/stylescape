/**
 * AccordionState.ts
 *
 * Persists the open/closed state of accordion elements using localStorage.
 * Automatically saves state when accordions are toggled and restores on page load.
 *
 * @module AccordionState
 * @author Scape Agency
 * @since 0.3.10
 */

export class AccordionState {
    private storageKey: string;
    private selector: string;
    private accordions: NodeListOf<HTMLDetailsElement>;

    /**
     * Creates an AccordionState manager
     * @param selector - CSS selector for the accordion elements (must be <details>)
     * @param storageKey - Key to use for localStorage (default: 'accordion-state')
     */
    constructor(
        selector: string = "details.sidebar__accordion",
        storageKey: string = "accordion-state",
    ) {
        this.selector = selector;
        this.storageKey = storageKey;
        this.accordions = document.querySelectorAll<HTMLDetailsElement>(
            this.selector,
        );
        this.init();
    }

    /**
     * Initialize the accordion state manager
     */
    private init(): void {
        this.restoreState();
        this.attachListeners();
    }

    /**
     * Generate a unique ID for an accordion based on its position and content
     */
    private getAccordionId(
        accordion: HTMLDetailsElement,
        index: number,
    ): string {
        // Try to use existing id or aria-labelledby, otherwise use index
        const summary = accordion.querySelector("summary");
        const heading = summary?.querySelector("h2, h3");

        if (accordion.id) {
            return accordion.id;
        }

        if (heading?.textContent) {
            // Create a slug from the heading text
            return heading.textContent
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
        }

        return `accordion-${index}`;
    }

    /**
     * Get the current state of all accordions
     */
    private getState(): Record<string, boolean> {
        const state: Record<string, boolean> = {};

        this.accordions.forEach((accordion, index) => {
            const id = this.getAccordionId(accordion, index);
            state[id] = accordion.open;
        });

        return state;
    }

    /**
     * Save the current state to localStorage
     */
    private saveState(): void {
        try {
            const state = this.getState();
            localStorage.setItem(this.storageKey, JSON.stringify(state));
        } catch (e) {
            // localStorage might be unavailable or full
            console.warn("AccordionState: Could not save state", e);
        }
    }

    /**
     * Restore the state from localStorage
     */
    private restoreState(): void {
        try {
            const savedState = localStorage.getItem(this.storageKey);

            if (!savedState) {
                return;
            }

            const state: Record<string, boolean> = JSON.parse(savedState);

            this.accordions.forEach((accordion, index) => {
                const id = this.getAccordionId(accordion, index);

                if (id in state) {
                    accordion.open = state[id];
                }
            });
        } catch (e) {
            console.warn("AccordionState: Could not restore state", e);
        }
    }

    /**
     * Attach toggle listeners to all accordions
     */
    private attachListeners(): void {
        this.accordions.forEach((accordion) => {
            accordion.addEventListener("toggle", () => {
                this.saveState();
            });
        });
    }

    /**
     * Clear the saved state
     */
    public clearState(): void {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (e) {
            console.warn("AccordionState: Could not clear state", e);
        }
    }

    /**
     * Expand all accordions
     */
    public expandAll(): void {
        this.accordions.forEach((accordion) => {
            accordion.open = true;
        });
        this.saveState();
    }

    /**
     * Collapse all accordions
     */
    public collapseAll(): void {
        this.accordions.forEach((accordion) => {
            accordion.open = false;
        });
        this.saveState();
    }
}

export default AccordionState;
