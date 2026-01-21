// ============================================================================
// Stylescape | Base Element Manager
// ============================================================================
// Abstract base class for managing HTML elements via data-ss-* attributes.
// Provides template for auto-discovering and initializing custom components.
// ============================================================================

/**
 * Configuration options for BaseElementManager
 */
export interface BaseElementManagerOptions {
    /** Custom attribute name to look for (default: data-ss-{componentName}) */
    attribute?: string;
    /** Whether to auto-initialize on DOMContentLoaded */
    autoInit?: boolean;
    /** Root element to search within */
    root?: Element | Document;
}

/**
 * Abstract base class for managing collections of elements.
 * Subclasses should implement the abstract methods to define
 * component-specific behavior.
 *
 * @example
 * ```typescript
 * class MyWidgetManager extends BaseElementManager<MyWidget> {
 *     protected getAttributeName(): string {
 *         return "data-ss-widget"
 *     }
 *
 *     protected async createElement(element: HTMLElement, config: any): Promise<MyWidget> {
 *         return new MyWidget(element, config)
 *     }
 * }
 * ```
 */
export abstract class BaseElementManager<T> {
    /** Map of element IDs to component instances */
    protected elements: Map<string, T> = new Map();

    /** Configuration options */
    protected options: Required<BaseElementManagerOptions>;

    /** Unique ID counter for elements without IDs */
    private static idCounter = 0;

    constructor(options: BaseElementManagerOptions = {}) {
        this.options = {
            attribute:
                options.attribute || `data-ss-${this.getComponentName()}`,
            autoInit: options.autoInit !== false,
            root: options.root || document,
        };

        if (this.options.autoInit) {
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", () =>
                    this.init(),
                );
            } else {
                this.init();
            }
        }
    }

    // ========================================================================
    // Abstract Methods - Must be implemented by subclasses
    // ========================================================================

    /**
     * Returns the component name used in data attributes.
     * E.g., "preloader" for data-ss-preloader
     */
    protected abstract getComponentName(): string;

    /**
     * Creates a component instance for the given element.
     *
     * @param element - The DOM element to create the component for
     * @param config - Configuration parsed from data attributes
     * @returns The created component instance
     */
    protected abstract createElement(
        element: HTMLElement,
        config: Record<string, unknown>,
    ): Promise<T> | T;

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Initialize all elements matching the attribute selector
     */
    public async init(): Promise<void> {
        const selector = `[${this.options.attribute}]`;
        const elements =
            this.options.root.querySelectorAll<HTMLElement>(selector);

        for (const element of Array.from(elements)) {
            await this.processElement(element);
        }
    }

    /**
     * Initialize a single element
     */
    public async initElement(element: HTMLElement): Promise<T | null> {
        return this.processElement(element);
    }

    /**
     * Get a component instance by element ID
     */
    public get(elementId: string): T | undefined {
        return this.elements.get(elementId);
    }

    /**
     * Get all component instances
     */
    public getAll(): Map<string, T> {
        return new Map(this.elements);
    }

    /**
     * Check if an element has been initialized
     */
    public has(elementId: string): boolean {
        return this.elements.has(elementId);
    }

    /**
     * Destroy a component instance
     */
    public destroy(elementId: string): boolean {
        const instance = this.elements.get(elementId);
        if (
            instance &&
            typeof (instance as unknown as { destroy?: () => void })
                .destroy === "function"
        ) {
            (instance as unknown as { destroy: () => void }).destroy();
        }
        return this.elements.delete(elementId);
    }

    /**
     * Destroy all component instances
     */
    public destroyAll(): void {
        this.elements.forEach((instance, id) => {
            this.destroy(id);
        });
    }

    // ========================================================================
    // Protected Methods
    // ========================================================================

    /**
     * Process a single element - parse config and create component
     */
    protected async processElement(element: HTMLElement): Promise<T | null> {
        // Ensure element has an ID
        if (!element.id) {
            element.id = `${this.getComponentName()}-${++BaseElementManager.idCounter}`;
        }

        // Skip if already initialized
        if (this.elements.has(element.id)) {
            return this.elements.get(element.id) || null;
        }

        // Parse configuration from data attributes
        const config = this.parseConfig(element);

        try {
            // Create component instance
            const instance = await this.createElement(element, config);
            this.elements.set(element.id, instance);

            // Mark as initialized
            element.setAttribute(
                `${this.options.attribute}-initialized`,
                "true",
            );

            return instance;
        } catch (error) {
            console.error(
                `[Stylescape] Error initializing ${this.getComponentName()}:`,
                error,
            );
            return null;
        }
    }

    /**
     * Parse configuration from element's data attributes
     */
    protected parseConfig(element: HTMLElement): Record<string, unknown> {
        const config: Record<string, unknown> = {};
        const prefix = `${this.options.attribute}-`;
        const jsonAttr = `${this.options.attribute}-config`;

        // Check for JSON config first
        const jsonConfig = element.getAttribute(jsonAttr);
        if (jsonConfig) {
            try {
                Object.assign(config, JSON.parse(jsonConfig));
            } catch (_e) {
                console.warn(
                    `[Stylescape] Invalid JSON config for ${this.getComponentName()}`,
                );
            }
        }

        // Parse individual data attributes
        Array.from(element.attributes).forEach((attr) => {
            if (attr.name.startsWith(prefix) && attr.name !== jsonAttr) {
                const key = attr.name
                    .slice(prefix.length)
                    .replace(/-([a-z])/g, (_, c) => c.toUpperCase());

                let value: unknown = attr.value;
                if (value === "true") value = true;
                else if (value === "false") value = false;
                else if (!isNaN(Number(value)) && value !== "")
                    value = Number(value);

                config[key] = value;
            }
        });

        return config;
    }
}

export default BaseElementManager;
