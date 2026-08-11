// ==========================================================================
// Stylescape | Storybook — Tags List
// ==========================================================================
// Auto-generated from src/jinja/31-modules/tags-list.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Tags List",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div>
            <span class="ss-c-tags__title">Tags:</span>
            <ul class="ss-c-tags__list">
                <li class="ss-c-tags__list-item">
                    <a href="#" class="ss-c-tags__link">Design</a>
                </li>
                <li class="ss-c-tags__list-item">
                    <a href="#" class="ss-c-tags__link">Development</a>
                </li>
                <li class="ss-c-tags__list-item">
                    <a href="#" class="ss-c-tags__link">CSS</a>
                </li>
            </ul>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div>
            <span class="ss-c-tags__title">Categories:</span>
            <ul class="ss-c-tags__list">
                <li class="ss-c-tags__list-item">
                    <a href="#" class="ss-c-tags__link">JavaScript</a>
                </li>
                <li class="ss-c-tags__list-item">
                    <a href="#" class="ss-c-tags__link">TypeScript</a>
                </li>
                <li class="ss-c-tags__list-item ss-c-tags__list-item--hidden">
                    <a href="#" class="ss-c-tags__link">Hidden Tag</a>
                </li>
                <li class="ss-c-tags__list-item">
                    <a href="#" class="ss-c-tags__link">React</a>
                </li>
            </ul>
            <span class="ss-c-tags__more-link">Show more...</span>
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <p>Filed under:</p>

        <ul class="ss-c-tags__list">
            <li class="ss-c-tags__list-item">
                <a href="#" class="ss-c-tags__link">News</a>
            </li>
            <li class="ss-c-tags__list-item">
                <a href="#" class="ss-c-tags__link">Technology</a>
            </li>
            <li class="ss-c-tags__list-item">
                <a href="#" class="ss-c-tags__link">Updates</a>
            </li>
        </ul>
    `,
};
