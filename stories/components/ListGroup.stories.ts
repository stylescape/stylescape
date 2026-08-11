// ==========================================================================
// Stylescape | Storybook — List Group
// ==========================================================================
// Auto-generated from src/jinja/31-modules/list-group.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/List Group",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <ul class="ss-c-list-group">
            <li class="ss-c-list-group__item">An item</li>
            <li class="ss-c-list-group__item ss-c-list-group__item--active">An active item</li>
            <li class="ss-c-list-group__item">A third item</li>
            <li class="ss-c-list-group__item ss-c-list-group__item--disabled">A disabled item</li>
        </ul>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <ul class="ss-c-list-group">
            <li class="ss-c-list-group__item ss-c-list-group__item--primary">Primary</li>
            <li class="ss-c-list-group__item ss-c-list-group__item--success">Success</li>
            <li class="ss-c-list-group__item ss-c-list-group__item--warning">Warning</li>
            <li class="ss-c-list-group__item ss-c-list-group__item--danger">Danger</li>
            <li class="ss-c-list-group__item ss-c-list-group__item--info">Info</li>
        </ul>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <ul class="ss-c-list-group ss-c-list-group--flush">
            <li class="ss-c-list-group__item">No outer borders</li>
            <li class="ss-c-list-group__item">Just inner separators</li>
        </ul>
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <ol class="ss-c-list-group ss-c-list-group--numbered">
            <li class="ss-c-list-group__item">First</li>
            <li class="ss-c-list-group__item">Second</li>
            <li class="ss-c-list-group__item">Third</li>
        </ol>
    `,
};
