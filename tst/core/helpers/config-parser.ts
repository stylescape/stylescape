// ============================================================================
// Stylescape | Config Parser Test Helper
// ============================================================================
// Helper module to test configuration parsing logic.
// ============================================================================

/**
 * Parse configuration from element data attributes
 */
export function parseConfigFromElement(
    element: HTMLElement,
    componentName: string,
    defaults: Record<string, any> = {},
): Record<string, any> {
    const result: Record<string, any> = { ...defaults };
    const prefix = `data-ss-${componentName}-`;
    const jsonAttr = `data-ss-${componentName}-config`;

    // Check for JSON config attribute first
    const jsonConfig = element.getAttribute(jsonAttr);
    if (jsonConfig) {
        try {
            Object.assign(result, JSON.parse(jsonConfig));
        } catch (e) {
            console.warn(`Invalid JSON config:`, e);
        }
    }

    // Parse individual data attributes
    Array.from(element.attributes).forEach((attr) => {
        if (attr.name.startsWith(prefix) && attr.name !== jsonAttr) {
            const key = attr.name
                .slice(prefix.length)
                .replace(/-([a-z])/g, (_, c) => c.toUpperCase());

            // Parse value
            let value: any = attr.value;
            if (value === "true") value = true;
            else if (value === "false") value = false;
            else if (!isNaN(Number(value)) && value !== "")
                value = Number(value);

            result[key] = value;
        }
    });

    return result;
}
