// ============================================================================
// Stylescape | Auto-Initialization System
// ============================================================================
// Automatically initializes components based on data-ss-* attributes.
// Supports multiple components per element and dynamic content via
// MutationObserver.
// ============================================================================

import type { ComponentConfig } from "./registry.js";
import { getComponent } from "./registry.js";

// ============================================================================
// Types
// ============================================================================

/**
 * Options for the auto-initialization system
 */
export interface AutoInitOptions {
    /** Root element to scan for components (default: document.body) */
    root?: Element;
    /** Whether to observe for dynamically added elements (default: true) */
    observe?: boolean;
    /** Attribute prefix for component detection (default: "data-ss") */
    attributePrefix?: string;
}

/**
 * Instance storage using WeakMap to avoid memory leaks
 */
type InstanceMap = Map<string, unknown>;
const instanceStore = new WeakMap<HTMLElement, InstanceMap>();

// ============================================================================
// Configuration
// ============================================================================

/** Global configuration */
const config = {
    attributePrefix: "data-ss",
    autoInitEnabled: true,
    observerEnabled: true,
    debug: true, // Enable debug logging to diagnose auto-init issues
};

/** MutationObserver instance */
let observer: MutationObserver | null = null;

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Parse configuration from element's data attributes
 *
 * @param element - Element to parse config from
 * @param componentName - Name of the component
 * @param defaults - Default configuration values
 */
function parseConfig(
    element: HTMLElement,
    componentName: string,
    defaults: ComponentConfig = {},
): ComponentConfig {
    const result: ComponentConfig = { ...defaults };
    const prefix = `${config.attributePrefix}-${componentName}-`;
    const jsonAttr = `${config.attributePrefix}-${componentName}-config`;

    // Check for JSON config attribute first
    const jsonConfig = element.getAttribute(jsonAttr);
    if (jsonConfig) {
        try {
            Object.assign(result, JSON.parse(jsonConfig));
        } catch (e) {
            console.warn(
                `[Stylescape] Invalid JSON config for ${componentName}:`,
                e,
            );
        }
    }

    // Parse individual data attributes
    Array.from(element.attributes).forEach((attr) => {
        if (attr.name.startsWith(prefix) && attr.name !== jsonAttr) {
            const key = attr.name
                .slice(prefix.length)
                .replace(/-([a-z])/g, (_, c) => c.toUpperCase()); // kebab-case to camelCase

            // Try to parse as JSON for complex values
            let value: unknown = attr.value;
            if (value === "true") value = true;
            else if (value === "false") value = false;
            else if (!isNaN(Number(value)) && value !== "")
                value = Number(value);

            result[key] = value;
        }
    });

    return result;
}

/**
 * Initialize a single component on an element
 *
 * @param element - Element to initialize
 * @param componentName - Name of the component to initialize
 */
function initComponent(element: HTMLElement, componentName: string): unknown {
    const entry = getComponent(componentName);

    if (!entry) {
        if (config.debug) {
            console.warn(`[Stylescape] Unknown component: ${componentName}`);
        }
        return null;
    }

    // Check if already initialized
    let instances = instanceStore.get(element);
    if (instances?.has(componentName)) {
        if (config.debug) {
            console.log(
                `[Stylescape] Component "${componentName}" already initialized on element`,
            );
        }
        return instances.get(componentName);
    }

    // Parse configuration
    const componentConfig = parseConfig(
        element,
        componentName,
        entry.defaults,
    );

    try {
        // Initialize component
        const instance = entry.handler(element, componentConfig);

        // Store instance
        if (!instances) {
            instances = new Map();
            instanceStore.set(element, instances);
        }
        instances.set(componentName, instance);

        // Mark as initialized
        element.setAttribute(
            `${config.attributePrefix}-${componentName}-initialized`,
            "true",
        );

        if (config.debug) {
            console.log(
                `[Stylescape] Initialized "${componentName}" on`,
                element,
            );
        }

        return instance;
    } catch (e) {
        console.error(
            `[Stylescape] Error initializing "${componentName}":`,
            e,
        );
        return null;
    }
}

/**
 * Initialize all components on an element based on its data-ss attribute
 *
 * @param element - Element to initialize components on
 */
function initElement(element: HTMLElement): void {
    const ssAttr = element.getAttribute(config.attributePrefix);

    console.log(`[Stylescape] Processing element:`, {
        element: element.tagName,
        id: element.id,
        dataSs: ssAttr,
    });

    if (!ssAttr) return;

    // Skip if manual initialization is requested
    if (element.hasAttribute(`${config.attributePrefix}-manual`)) {
        console.log(`[Stylescape] Skipping manual element:`, element);
        return;
    }

    // Support space-separated component names for multiple components
    const componentNames = ssAttr.trim().split(/\s+/);

    console.log(`[Stylescape] Initializing components:`, componentNames);

    componentNames.forEach((name) => {
        if (name) {
            initComponent(element, name.toLowerCase());
        }
    });
}

/**
 * Scan and initialize all components within a root element
 *
 * @param root - Root element to scan (default: document.body)
 */
export function init(root: Element = document.body): void {
    // Always log initialization start for debugging
    console.log("[Stylescape] Auto-init starting...", {
        root: root.tagName,
        autoInitEnabled: config.autoInitEnabled,
    });

    if (!config.autoInitEnabled) {
        if (config.debug) {
            console.log("[Stylescape] Auto-init disabled, skipping");
        }
        return;
    }

    // Find all elements with data-ss attribute
    const selector = `[${config.attributePrefix}]`;
    const elements = root.querySelectorAll<HTMLElement>(selector);

    console.log(
        `[Stylescape] Found ${elements.length} elements with ${selector}`,
    );

    // Also check the root element itself
    if (
        root instanceof HTMLElement &&
        root.hasAttribute(config.attributePrefix)
    ) {
        initElement(root);
    }

    elements.forEach((element) => initElement(element));

    console.log(
        `[Stylescape] Auto-init complete. Initialized ${elements.length} elements`,
    );
}

/**
 * Get a component instance from an element
 *
 * @param element - Element to get instance from
 * @param componentName - Optional component name (required if multiple components)
 */
export function getInstance(
    element: HTMLElement,
    componentName?: string,
): unknown | null {
    const instances = instanceStore.get(element);

    if (!instances) return null;

    if (componentName) {
        return instances.get(componentName.toLowerCase()) || null;
    }

    // Return first instance if no name specified
    const values = instances.values();
    const first = values.next();
    return first.done ? null : first.value;
}

/**
 * Get all component instances from an element
 *
 * @param element - Element to get instances from
 */
export function getAllInstances(
    element: HTMLElement,
): Map<string, unknown> | null {
    return instanceStore.get(element) || null;
}

/**
 * Reinitialize a component or all components on an element
 *
 * @param element - Element to reinitialize
 * @param componentName - Optional specific component to reinitialize
 */
export function reinit(element: HTMLElement, componentName?: string): void {
    destroy(element, componentName);

    if (componentName) {
        initComponent(element, componentName);
    } else {
        initElement(element);
    }
}

/**
 * Destroy a component instance or all instances on an element
 *
 * @param element - Element to destroy instances on
 * @param componentName - Optional specific component to destroy
 */
export function destroy(element: HTMLElement, componentName?: string): void {
    const instances = instanceStore.get(element);

    if (!instances) return;

    const destroyInstance = (name: string, instance: unknown) => {
        // Call destroy method if available
        if (
            instance &&
            typeof (instance as { destroy?: () => void }).destroy ===
                "function"
        ) {
            try {
                (instance as { destroy: () => void }).destroy();
            } catch (e) {
                console.warn(`[Stylescape] Error destroying "${name}":`, e);
            }
        }

        instances.delete(name);
        element.removeAttribute(
            `${config.attributePrefix}-${name}-initialized`,
        );

        if (config.debug) {
            console.log(`[Stylescape] Destroyed "${name}" on`, element);
        }
    };

    if (componentName) {
        const instance = instances.get(componentName.toLowerCase());
        if (instance) {
            destroyInstance(componentName.toLowerCase(), instance);
        }
    } else {
        instances.forEach((instance, name) => destroyInstance(name, instance));
        instanceStore.delete(element);
    }
}

/**
 * Start observing for dynamically added elements
 *
 * @param root - Root element to observe (default: document.body)
 */
export function observe(root: Element = document.body): void {
    if (!config.observerEnabled) return;

    // Disconnect existing observer
    if (observer) {
        observer.disconnect();
    }

    observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Handle added nodes
            mutation.addedNodes.forEach((node) => {
                if (node instanceof HTMLElement) {
                    // Check if the added node itself has data-ss
                    if (node.hasAttribute(config.attributePrefix)) {
                        initElement(node);
                    }

                    // Check descendants
                    const descendants = node.querySelectorAll<HTMLElement>(
                        `[${config.attributePrefix}]`,
                    );
                    descendants.forEach((el) => initElement(el));
                }
            });

            // Handle removed nodes (cleanup)
            mutation.removedNodes.forEach((node) => {
                if (node instanceof HTMLElement) {
                    if (instanceStore.has(node)) {
                        destroy(node);
                    }

                    const descendants = node.querySelectorAll<HTMLElement>(
                        `[${config.attributePrefix}]`,
                    );
                    descendants.forEach((el) => {
                        if (instanceStore.has(el)) {
                            destroy(el);
                        }
                    });
                }
            });
        });
    });

    observer.observe(root, {
        childList: true,
        subtree: true,
    });

    if (config.debug) {
        console.log("[Stylescape] Observer started");
    }
}

/**
 * Stop observing for dynamic elements
 */
export function stopObserving(): void {
    if (observer) {
        observer.disconnect();
        observer = null;

        if (config.debug) {
            console.log("[Stylescape] Observer stopped");
        }
    }
}

// ============================================================================
// Configuration Functions
// ============================================================================

/**
 * Enable or disable auto-initialization
 */
export function setAutoInit(enabled: boolean): void {
    config.autoInitEnabled = enabled;
}

/**
 * Enable or disable the mutation observer
 */
export function setObserver(enabled: boolean): void {
    config.observerEnabled = enabled;

    if (!enabled && observer) {
        stopObserving();
    }
}

/**
 * Enable or disable debug logging
 */
export function setDebug(enabled: boolean): void {
    config.debug = enabled;
}

/**
 * Set the attribute prefix (default: "data-ss")
 */
export function setAttributePrefix(prefix: string): void {
    config.attributePrefix = prefix;
}

// ============================================================================
// Auto-start
// ============================================================================

/**
 * Initialize Stylescape auto-init system
 * Called automatically when the script loads
 */
export function autoStart(): void {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            init();
            observe();
        });
    } else {
        // DOM already loaded
        init();
        observe();
    }
}
