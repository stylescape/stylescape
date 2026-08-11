// ==========================================================================
// Stylescape | Storybook — Spacer
// ==========================================================================
// Auto-generated from src/jinja/31-modules/spacer.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Spacer",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SpacerSizes: Story = {
    render: () => html`
        <div class="ss-c-bg--fill_02 ss-c-p--02">Content above</div>
        <div class="ss-c-spacer_vertical ss-c-spacer--01"></div>
        <div class="ss-c-bg--fill_02 ss-c-p--02">Small spacer (4px)</div>
        <div class="ss-c-spacer_vertical ss-c-spacer--02"></div>
        <div class="ss-c-bg--fill_02 ss-c-p--02">Medium spacer (8px)</div>
        <div class="ss-c-spacer_vertical ss-c-spacer--04"></div>
        <div class="ss-c-bg--fill_02 ss-c-p--02">Large spacer (16px)</div>
        <div class="ss-c-spacer_vertical ss-c-spacer--08"></div>
        <div class="ss-c-bg--fill_02 ss-c-p--02">Extra large spacer (32px)</div>
    `,
};

export const VisibleSpacerForDemonstration: Story = {
    render: () => html`
        <div class="ss-c-bg--fill_02 ss-c-p--02">Content above</div>
        <div class="ss-c-spacer_vertical ss-c-spacer--04 ss-c-bg--accent_01"></div>
        <div class="ss-c-bg--fill_02 ss-c-p--02">
            Content below (spacer is visible with background)
        </div>
    `,
};

export const InlineSpacers: Story = {
    render: () => html`
        <div class="ss-c-d--flex ss-c-align-items--center">
            <span class="ss-c-bg--fill_02 ss-c-p--02">Left</span>
            <span class="ss-c-spacer_horizontal ss-c-spacer--02"></span>
            <span class="ss-c-bg--fill_02 ss-c-p--02">Small gap</span>
            <span class="ss-c-spacer_horizontal ss-c-spacer--04"></span>
            <span class="ss-c-bg--fill_02 ss-c-p--02">Medium gap</span>
            <span class="ss-c-spacer_horizontal ss-c-spacer--08"></span>
            <span class="ss-c-bg--fill_02 ss-c-p--02">Large gap</span>
        </div>
    `,
};

export const FlexSpacer: Story = {
    render: () => html`
        <div class="ss-c-d--flex">
            <span class="ss-c-bg--fill_02 ss-c-p--02">Left aligned</span>
            <span class="ss-c-spacer--flex"></span>
            <span class="ss-c-bg--fill_02 ss-c-p--02">Right aligned</span>
        </div>
    `,
};

export const MultipleFlexSpacers: Story = {
    render: () => html`
        <div class="ss-c-d--flex">
            <span class="ss-c-bg--fill_02 ss-c-p--02">Left</span>
            <span class="ss-c-spacer--flex"></span>
            <span class="ss-c-bg--fill_02 ss-c-p--02">Center</span>
            <span class="ss-c-spacer--flex"></span>
            <span class="ss-c-bg--fill_02 ss-c-p--02">Right</span>
        </div>
    `,
};

export const SpacerWithDivider: Story = {
    render: () => html`
        <div class="ss-c-bg--fill_02 ss-c-p--02">Section one content</div>
        <div class="ss-c-spacer_divider ss-c-spacer--04">
            <hr class="ss-c-divider" />
        </div>
        <div class="ss-c-bg--fill_02 ss-c-p--02">Section two content</div>
    `,
};

export const ResponsiveVerticalSpacer: Story = {
    render: () => html`
        <div class="ss-c-bg--fill_02 ss-c-p--02">Content above</div>
        <div
            class="ss-c-spacer_vertical ss-c-spacer--02 ss-c-spacer--md-04 ss-c-spacer--lg-08"
        ></div>
        <div class="ss-c-bg--fill_02 ss-c-p--02">
            Content below (spacer grows at larger breakpoints)
        </div>
    `,
};
