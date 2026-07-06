// ==========================================================================
// Stylescape | Storybook — Breadcrumb
// ==========================================================================
// Auto-generated from src/jinja/31-modules/breadcrumb.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Breadcrumb",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SimpleBreadcrumb: Story = {
    render: () => html`
        <nav aria-label="Breadcrumb">
            <ol class="ss-c-breadcrumb">
                <li class="ss-c-breadcrumb__item"><a href="#">Home</a></li>
                <li class="ss-c-breadcrumb__item"><a href="#">Products</a></li>
                <li
                    class="ss-c-breadcrumb__item ss-c-breadcrumb__item--active"
                    aria-current="page"
                >
                    Category
                </li>
            </ol>
        </nav>
    `,
};

export const DeepNavigation: Story = {
    render: () => html`
        <nav aria-label="Breadcrumb">
            <ol class="ss-c-breadcrumb">
                <li class="ss-c-breadcrumb__item"><a href="#">Home</a></li>
                <li class="ss-c-breadcrumb__item"><a href="#">Documentation</a></li>
                <li class="ss-c-breadcrumb__item"><a href="#">Components</a></li>
                <li class="ss-c-breadcrumb__item"><a href="#">Navigation</a></li>
                <li
                    class="ss-c-breadcrumb__item ss-c-breadcrumb__item--active"
                    aria-current="page"
                >
                    Breadcrumb
                </li>
            </ol>
        </nav>
    `,
};

export const SlashSeparatorDefault: Story = {
    render: () => html`
        <nav aria-label="Breadcrumb">
            <ol class="ss-c-breadcrumb ss-c-breadcrumb--slash">
                <li class="ss-c-breadcrumb__item"><a href="#">Home</a></li>
                <li class="ss-c-breadcrumb__item"><a href="#">Section</a></li>
                <li
                    class="ss-c-breadcrumb__item ss-c-breadcrumb__item--active"
                    aria-current="page"
                >
                    Page
                </li>
            </ol>
        </nav>
    `,
};

export const ArrowSeparator: Story = {
    render: () => html`
        <nav aria-label="Breadcrumb">
            <ol class="ss-c-breadcrumb ss-c-breadcrumb--arrow">
                <li class="ss-c-breadcrumb__item"><a href="#">Home</a></li>
                <li class="ss-c-breadcrumb__item"><a href="#">Section</a></li>
                <li
                    class="ss-c-breadcrumb__item ss-c-breadcrumb__item--active"
                    aria-current="page"
                >
                    Page
                </li>
            </ol>
        </nav>
    `,
};

export const ChevronSeparator: Story = {
    render: () => html`
        <nav aria-label="Breadcrumb">
            <ol class="ss-c-breadcrumb ss-c-breadcrumb--chevron">
                <li class="ss-c-breadcrumb__item"><a href="#">Home</a></li>
                <li class="ss-c-breadcrumb__item"><a href="#">Section</a></li>
                <li
                    class="ss-c-breadcrumb__item ss-c-breadcrumb__item--active"
                    aria-current="page"
                >
                    Page
                </li>
            </ol>
        </nav>
    `,
};

export const DotSeparator: Story = {
    render: () => html`
        <nav aria-label="Breadcrumb">
            <ol class="ss-c-breadcrumb ss-c-breadcrumb--dot">
                <li class="ss-c-breadcrumb__item"><a href="#">Home</a></li>
                <li class="ss-c-breadcrumb__item"><a href="#">Section</a></li>
                <li
                    class="ss-c-breadcrumb__item ss-c-breadcrumb__item--active"
                    aria-current="page"
                >
                    Page
                </li>
            </ol>
        </nav>
    `,
};

export const HomeIcon: Story = {
    render: () => html`
        <nav aria-label="Breadcrumb">
            <ol class="ss-c-breadcrumb">
                <li class="ss-c-breadcrumb__item">
                    <a href="#" aria-label="Home">
                        <span class="ss-c-breadcrumb__icon">⌂</span>
                    </a>
                </li>
                <li class="ss-c-breadcrumb__item"><a href="#">Products</a></li>
                <li
                    class="ss-c-breadcrumb__item ss-c-breadcrumb__item--active"
                    aria-current="page"
                >
                    Details
                </li>
            </ol>
        </nav>
    `,
};

export const IconsOnAllItems: Story = {
    render: () => html`
        <nav aria-label="Breadcrumb">
            <ol class="ss-c-breadcrumb">
                <li class="ss-c-breadcrumb__item">
                    <a href="#">
                        <span class="ss-c-breadcrumb__icon">⌂</span>
                        <span>Home</span>
                    </a>
                </li>
                <li class="ss-c-breadcrumb__item">
                    <a href="#">
                        <span class="ss-c-breadcrumb__icon">▤</span>
                        <span>Folder</span>
                    </a>
                </li>
                <li
                    class="ss-c-breadcrumb__item ss-c-breadcrumb__item--active"
                    aria-current="page"
                >
                    <span class="ss-c-breadcrumb__icon">▭</span>
                    <span>File</span>
                </li>
            </ol>
        </nav>
    `,
};

export const EllipsisCollapse: Story = {
    render: () => html`
        <nav aria-label="Breadcrumb">
            <ol class="ss-c-breadcrumb">
                <li class="ss-c-breadcrumb__item"><a href="#">Home</a></li>
                <li class="ss-c-breadcrumb__item ss-c-breadcrumb__item--collapsed">
                    <button
                        class="ss-c-breadcrumb__expand"
                        aria-label="Show hidden items"
                    >
                        ...
                    </button>
                </li>
                <li class="ss-c-breadcrumb__item"><a href="#">Parent</a></li>
                <li
                    class="ss-c-breadcrumb__item ss-c-breadcrumb__item--active"
                    aria-current="page"
                >
                    Current
                </li>
            </ol>
        </nav>
    `,
};

export const SizeVariations: Story = {
    render: () => html`
        <nav aria-label="Breadcrumb">
            <ol class="ss-c-breadcrumb ss-c-breadcrumb--sm">
                <li class="ss-c-breadcrumb__item"><a href="#">Home</a></li>
                <li
                    class="ss-c-breadcrumb__item ss-c-breadcrumb__item--active"
                    aria-current="page"
                >
                    Small
                </li>
            </ol>
        </nav>

        <nav aria-label="Breadcrumb">
            <ol class="ss-c-breadcrumb">
                <li class="ss-c-breadcrumb__item"><a href="#">Home</a></li>
                <li
                    class="ss-c-breadcrumb__item ss-c-breadcrumb__item--active"
                    aria-current="page"
                >
                    Default
                </li>
            </ol>
        </nav>

        <nav aria-label="Breadcrumb">
            <ol class="ss-c-breadcrumb ss-c-breadcrumb--lg">
                <li class="ss-c-breadcrumb__item"><a href="#">Home</a></li>
                <li
                    class="ss-c-breadcrumb__item ss-c-breadcrumb__item--active"
                    aria-current="page"
                >
                    Large
                </li>
            </ol>
        </nav>
    `,
};
