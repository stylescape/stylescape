// ============================================================================
// Stylescape | TableOfContentsBuilder Tests
// ============================================================================

import { beforeEach, describe, expect, it } from "vitest";
import { TableOfContentsBuilder } from "../../src/ts/content/TableOfContentsBuilder";
import { createAndAppend } from "../utils";

/** Build a fresh #content + #toc scaffold and return the builder. */
function build(contentHtml: string): TableOfContentsBuilder {
    createAndAppend(`<div id="content">${contentHtml}</div>`);
    createAndAppend(`<nav id="toc"></nav>`);
    const builder = new TableOfContentsBuilder("content", "toc");
    builder.buildAndAppendTOC();
    return builder;
}

const toc = () => document.getElementById("toc") as HTMLElement;

describe("TableOfContentsBuilder", () => {
    beforeEach(() => {
        // setup.ts already clears the DOM; nothing extra needed.
    });

    describe("construction & guards", () => {
        it("does nothing (no throw) when the root element is missing", () => {
            createAndAppend(`<nav id="toc"></nav>`);
            const builder = new TableOfContentsBuilder("missing", "toc");

            expect(() => builder.buildAndAppendTOC()).not.toThrow();
            expect(toc().children.length).toBe(0);
            expect(builder.getLinkSectionMap().size).toBe(0);
        });

        it("does nothing (no throw) when the TOC container is missing", () => {
            createAndAppend(
                `<div id="content"><section data-label="A"></section></div>`,
            );
            const builder = new TableOfContentsBuilder("content", "missing");

            expect(() => builder.buildAndAppendTOC()).not.toThrow();
            expect(builder.getLinkSectionMap().size).toBe(0);
        });
    });

    describe("flat TOC generation", () => {
        it("creates a <ul> with one <li>/<a> per labelled section", () => {
            build(`
                <section data-label="Introduction"></section>
                <section data-label="Getting Started"></section>
            `);

            const ul = toc().querySelector("ul");
            expect(ul).not.toBeNull();

            const anchors = toc().querySelectorAll("a");
            expect(anchors.length).toBe(2);
            expect(anchors[0].textContent).toBe("Introduction");
            expect(anchors[1].textContent).toBe("Getting Started");
        });

        it("slugifies labels into section ids and links anchors to them", () => {
            build(`<section data-label="Getting Started"></section>`);

            const section = document.querySelector(
                "#content section",
            ) as HTMLElement;
            expect(section.id).toBe("getting-started");

            const anchor = toc().querySelector("a") as HTMLAnchorElement;
            expect(anchor.getAttribute("href")).toBe("#getting-started");
        });

        it("strips non-word characters when generating ids", () => {
            build(`<section data-label="C++ & Rust!"></section>`);

            const section = document.querySelector(
                "#content section",
            ) as HTMLElement;
            // spaces -> '-', then all non [\w-] removed
            expect(section.id).toBe("c--rust");
        });

        it("uses 'Untitled' when the data-label is empty", () => {
            build(`<section data-label=""></section>`);

            const anchor = toc().querySelector("a") as HTMLAnchorElement;
            expect(anchor.textContent).toBe("Untitled");
            expect(anchor.getAttribute("href")).toBe("#untitled");
        });
    });

    describe("nested TOC generation", () => {
        it("nests child sections inside a nested <ul>", () => {
            build(`
                <section data-label="Introduction"></section>
                <section data-label="Getting Started">
                    <section data-label="Installation"></section>
                    <section data-label="Configuration"></section>
                </section>
            `);

            const topUl = toc().querySelector("ul") as HTMLUListElement;
            const topItems = topUl.querySelectorAll(":scope > li");
            expect(topItems.length).toBe(2);

            // The second top-level item ("Getting Started") holds a nested list.
            const nestedUl = topItems[1].querySelector("ul") as HTMLUListElement;
            expect(nestedUl).not.toBeNull();
            const nestedItems = nestedUl.querySelectorAll(":scope > li");
            expect(nestedItems.length).toBe(2);
            expect(nestedItems[0].querySelector("a")?.textContent).toBe(
                "Installation",
            );
        });

        it("flattens labelled sections found under an unlabelled wrapper", () => {
            build(`
                <div class="wrapper">
                    <section data-label="Alpha"></section>
                    <section data-label="Beta"></section>
                </div>
            `);

            const topUl = toc().querySelector("ul") as HTMLUListElement;
            const items = topUl.querySelectorAll(":scope > li");
            // Both labelled sections are hoisted to the top level.
            expect(items.length).toBe(2);
            expect(items[0].querySelector("a")?.textContent).toBe("Alpha");
            expect(items[1].querySelector("a")?.textContent).toBe("Beta");
        });
    });

    describe("id uniqueness", () => {
        it("suffixes duplicate labels to keep ids unique", () => {
            build(`
                <section data-label="chapter"></section>
                <section data-label="chapter"></section>
            `);

            const sections = document.querySelectorAll(
                "#content > section",
            ) as NodeListOf<HTMLElement>;
            expect(sections[0].id).toBe("chapter");
            // NOTE: the collision suffix is built from the ORIGINAL (un-slugified)
            // label, so a capitalised label yields a capitalised suffix id.
            expect(sections[1].id).toBe("chapter-1");
        });
    });

    describe("getLinkSectionMap", () => {
        it("maps each generated anchor to its source section", () => {
            const builder = build(`
                <section data-label="One"></section>
                <section data-label="Two"></section>
            `);

            const map = builder.getLinkSectionMap();
            expect(map.size).toBe(2);

            for (const [link, section] of map.entries()) {
                expect(link.tagName).toBe("A");
                expect(section.tagName).toBe("SECTION");
                // Anchor href points at the section's id.
                expect(link.getAttribute("href")).toBe(`#${section.id}`);
            }
        });
    });
});
