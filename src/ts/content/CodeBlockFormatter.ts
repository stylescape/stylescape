// ============================================================================
// Stylescape | Code Block Formatter
// ============================================================================
// Normalizes the indentation of demo-page code snippets.
//
// The Jinja→HTML pipeline bakes template-source indentation into
// `.ss-c-preview__code` snippets (`{{ code_snippet | trim | escape }}` only
// trims the outer edges), so rendered code blocks show jagged, arbitrary
// leading whitespace. This utility re-formats them client-side:
//
//   - Markup snippets (first char `<`) are re-indented from scratch with a
//     tiny depth-based pretty printer (4-space indent, text collapsed).
//   - Other snippets are dedented by their longest common indent.
//
// ============================================================================

/** Elements that never take a closing tag — they don't change depth. */
const VOID_ELEMENTS = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
]);

const INDENT = "    ";

export class CodeBlockFormatter {
    /**
     * Format every code block matched by `selector`.
     * Defaults to the preview panel's `<pre><code>` blocks.
     */
    public static formatAll(
        selector: string = ".ss-c-preview__code pre code",
    ): void {
        document.querySelectorAll<HTMLElement>(selector).forEach((block) => {
            const raw = block.textContent ?? "";
            const formatted = CodeBlockFormatter.format(raw);
            if (formatted !== raw) {
                block.textContent = formatted;
            }
        });
    }

    /** Format a single snippet. */
    public static format(source: string): string {
        const trimmed = source.replace(/^\s*\n/, "").trimEnd();
        if (!trimmed) return trimmed;

        // Snippets containing <pre> or <textarea> carry whitespace-significant
        // text that must not be re-flowed — only dedent those.
        if (
            trimmed.trimStart().startsWith("<") &&
            !/<(pre|textarea)[\s>]/i.test(trimmed)
        ) {
            return CodeBlockFormatter.prettyPrintMarkup(trimmed);
        }
        return CodeBlockFormatter.dedent(trimmed);
    }

    /** Strip the longest common leading whitespace from all non-empty lines. */
    private static dedent(source: string): string {
        const lines = source.split("\n");
        let common: number | null = null;

        for (const line of lines) {
            if (!line.trim()) continue;
            const indent = line.length - line.trimStart().length;
            common = common === null ? indent : Math.min(common, indent);
            if (common === 0) break;
        }

        if (!common) return source;
        return lines
            .map((line) => (line.trim() ? line.slice(common as number) : ""))
            .join("\n");
    }

    /**
     * Minimal depth-based HTML pretty printer. Each tag goes on its own
     * line; text nodes are whitespace-collapsed onto their own line.
     */
    private static prettyPrintMarkup(source: string): string {
        // Tokenize into tags and text runs.
        const tokens = source.match(/<[^>]+>|[^<]+/g) ?? [];
        const out: string[] = [];
        let depth = 0;

        for (const token of tokens) {
            if (token.startsWith("<")) {
                const isClosing = /^<\//.test(token);
                const isSelfClosing = /\/>$/.test(token);
                const isDeclaration = /^<[!?]/.test(token);
                const name = (token.match(/^<\/?\s*([a-zA-Z0-9-]+)/) ??
                    [])[1]?.toLowerCase();
                const isVoid = name !== undefined && VOID_ELEMENTS.has(name);

                if (isClosing) depth = Math.max(0, depth - 1);
                out.push(INDENT.repeat(depth) + token.trim());
                if (!isClosing && !isSelfClosing && !isDeclaration && !isVoid) {
                    depth += 1;
                }
            } else {
                // Collapse the text run's internal whitespace.
                const text = token.replace(/\s+/g, " ").trim();
                if (text) {
                    out.push(INDENT.repeat(depth) + text);
                }
            }
        }

        return out.join("\n");
    }
}
