// ==========================================================================
// Stylescape | Storybook — Steps
// ==========================================================================
// Auto-generated from src/jinja/31-modules/steps.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Steps",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <ul class="ss-c-steps">
            <li class="ss-c-step ss-c-step--primary">Choose</li>
            <li class="ss-c-step ss-c-step--primary">Configure</li>
            <li class="ss-c-step">Purchase</li>
            <li class="ss-c-step">Ship</li>
        </ul>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <ul class="ss-c-steps ss-c-steps--vertical">
            <li class="ss-c-step ss-c-step--success">Plan</li>
            <li class="ss-c-step ss-c-step--success">Build</li>
            <li class="ss-c-step ss-c-step--warning">Test</li>
            <li class="ss-c-step">Ship</li>
        </ul>
    `,
};
