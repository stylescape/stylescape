// ============================================================================
// Stylescape | Storybook — Story Helpers
// ============================================================================
// Stylescape components are markup + classes, so stories return HTML strings.
// `html` is an identity tagged-template that keeps editor syntax highlighting
// and Prettier formatting working inside `.stories.ts` files.
// ============================================================================

export function html(
    strings: TemplateStringsArray,
    ...values: unknown[]
): string {
    return strings.reduce(
        (acc, str, i) => acc + str + (i < values.length ? String(values[i]) : ""),
        "",
    );
}
