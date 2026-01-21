// ============================================================================
// Stylescape | Test DOM Utilities
// ============================================================================
// Helper functions for creating and manipulating DOM elements in tests.
// ============================================================================

/**
 * Create an HTML element from a template string
 */
export function createElement<T extends HTMLElement = HTMLElement>(
    html: string,
): T {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild as T;
}

/**
 * Create multiple elements from an HTML string
 */
export function createElements(html: string): HTMLElement[] {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return Array.from(template.content.children) as HTMLElement[];
}

/**
 * Append an element to the document body and return it
 */
export function appendToBody<T extends HTMLElement>(element: T): T {
    document.body.appendChild(element);
    return element;
}

/**
 * Create and append element(s) from HTML string.
 * If multiple sibling elements are in the HTML, all will be appended
 * but only the first is returned for backwards compatibility.
 */
export function createAndAppend<T extends HTMLElement = HTMLElement>(
    html: string,
): T {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    const elements = Array.from(template.content.children) as HTMLElement[];

    // Append all elements to body
    elements.forEach((el) => document.body.appendChild(el));

    // Return the first element for backwards compatibility
    return elements[0] as T;
}

/**
 * Wait for the next animation frame
 */
export function nextFrame(): Promise<void> {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

/**
 * Wait for a specified number of milliseconds
 */
export function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wait for DOM to be ready
 */
export function waitForDomReady(): Promise<void> {
    return new Promise((resolve) => {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => resolve());
        } else {
            resolve();
        }
    });
}

/**
 * Simulate a click event
 */
export function click(element: Element): void {
    element.dispatchEvent(
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        }),
    );
}

/**
 * Simulate a mouse enter event
 */
export function mouseEnter(element: Element): void {
    element.dispatchEvent(
        new MouseEvent("mouseenter", {
            bubbles: true,
            cancelable: true,
        }),
    );
}

/**
 * Simulate a mouse leave event
 */
export function mouseLeave(element: Element): void {
    element.dispatchEvent(
        new MouseEvent("mouseleave", {
            bubbles: true,
            cancelable: true,
        }),
    );
}

/**
 * Simulate a focus event
 */
export function focus(element: Element): void {
    element.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    if (element instanceof HTMLElement) {
        element.focus();
    }
}

/**
 * Simulate a blur event
 */
export function blur(element: Element): void {
    element.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
    if (element instanceof HTMLElement) {
        element.blur();
    }
}

/**
 * Simulate a keyboard event
 */
export function keyDown(
    element: Element,
    key: string,
    options: Partial<KeyboardEventInit> = {},
): void {
    element.dispatchEvent(
        new KeyboardEvent("keydown", {
            key,
            bubbles: true,
            cancelable: true,
            ...options,
        }),
    );
}

/**
 * Simulate pressing Escape key
 */
export function pressEscape(element: Element = document.body): void {
    keyDown(element, "Escape", { code: "Escape" });
}

/**
 * Simulate pressing Enter key
 */
export function pressEnter(element: Element = document.body): void {
    keyDown(element, "Enter", { code: "Enter" });
}

/**
 * Simulate pressing Tab key
 */
export function pressTab(
    element: Element = document.body,
    shift: boolean = false,
): void {
    keyDown(element, "Tab", { code: "Tab", shiftKey: shift });
}

/**
 * Simulate an input event
 */
export function inputValue(element: HTMLInputElement, value: string): void {
    element.value = value;
    element.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * Simulate a change event
 */
export function changeValue(element: HTMLInputElement, value: string): void {
    element.value = value;
    element.dispatchEvent(new Event("change", { bubbles: true }));
}

/**
 * Simulate a scroll event
 */
export function scrollTo(
    element: Element | Window,
    options: { x?: number; y?: number } = {},
): void {
    if (element === window) {
        Object.defineProperty(window, "scrollY", {
            value: options.y ?? 0,
            writable: true,
        });
        Object.defineProperty(window, "scrollX", {
            value: options.x ?? 0,
            writable: true,
        });
    } else if (element instanceof Element) {
        Object.defineProperty(element, "scrollTop", {
            value: options.y ?? 0,
            writable: true,
            configurable: true,
        });
        Object.defineProperty(element, "scrollLeft", {
            value: options.x ?? 0,
            writable: true,
            configurable: true,
        });
    }

    element.dispatchEvent(new Event("scroll"));
}

/**
 * Get computed style property
 */
export function getStyle(element: Element, property: string): string {
    return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * Check if element is visible
 */
export function isVisible(element: HTMLElement): boolean {
    return (
        element.offsetParent !== null &&
        getComputedStyle(element).display !== "none" &&
        getComputedStyle(element).visibility !== "hidden"
    );
}

/**
 * Query selector with type assertion
 */
export function $<T extends HTMLElement = HTMLElement>(
    selector: string,
    root: Element | Document = document,
): T | null {
    return root.querySelector<T>(selector);
}

/**
 * Query selector all with type assertion
 */
export function $$<T extends HTMLElement = HTMLElement>(
    selector: string,
    root: Element | Document = document,
): T[] {
    return Array.from(root.querySelectorAll<T>(selector));
}
