// ==========================================================================
// Stylescape | Storybook — Stat
// ==========================================================================
// Auto-generated from src/jinja/31-modules/stat.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Stat",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div class="ss-c-stats">
            <div class="ss-c-stat">
                <div class="ss-c-stat__title">Total downloads</div>
                <div class="ss-c-stat__value">31K</div>
                <div class="ss-c-stat__desc">Jan 1st &mdash; Feb 1st</div>
            </div>
            <div class="ss-c-stat">
                <div class="ss-c-stat__title">New users</div>
                <div class="ss-c-stat__value">4,200</div>
                <div class="ss-c-stat__desc">+22% from last month</div>
            </div>
            <div class="ss-c-stat">
                <div class="ss-c-stat__title">Page views</div>
                <div class="ss-c-stat__value">1.2M</div>
                <div class="ss-c-stat__desc">90% from organic</div>
            </div>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div class="ss-c-stats ss-c-stats--vertical">
            <div class="ss-c-stat"><div class="ss-c-stat__title">Stars</div><div class="ss-c-stat__value">2.4K</div></div>
            <div class="ss-c-stat"><div class="ss-c-stat__title">Forks</div><div class="ss-c-stat__value">312</div></div>
        </div>
    `,
};
