// ==========================================================================
// Stylescape | Storybook — Timestamp
// ==========================================================================
// Auto-generated from src/jinja/31-modules/timestamp.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Timestamp",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <time class="ss-c-timestamp" datetime="2026-01-21T10:30:00">
            January 21, 2026 at 10:30 AM
        </time>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div class="ss-c-timestamp-elevate">
            <div class="ss-c-timestamp__container">
                <time
                    class="ss-c-timestamp__time-since"
                    datetime="2026-01-21T08:00:00"
                >
                    3 hours ago
                </time>
                <button
                    class="ss-c-timestamp__expand-button"
                    aria-label="Expand timestamp details"
                ></button>
            </div>
            <div class="ss-c-timestamp__details">
                <time datetime="2026-01-21T08:00:00">
                    January 21, 2026 at 8:00 AM
                </time>
            </div>
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div class="ss-c-timestamp-elevate">
            <div class="ss-c-timestamp__container">
                <time
                    class="ss-c-timestamp__time-since ss-c-timestamp__time-since--active"
                    datetime="2026-01-21T10:00:00"
                >
                    Just now
                </time>
            </div>
        </div>
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <div class="ss-c-timestamp-elevate ss-c-timestamp-elevate--expanded">
            <div class="ss-c-timestamp__container">
                <time
                    class="ss-c-timestamp__time-since"
                    datetime="2026-01-20T14:30:00"
                >
                    Yesterday
                </time>
                <button
                    class="ss-c-timestamp__expand-button"
                    aria-label="Collapse timestamp details"
                ></button>
            </div>
            <div class="ss-c-timestamp__details" style="display: block">
                <time datetime="2026-01-20T14:30:00">
                    January 20, 2026 at 2:30 PM
                </time>
            </div>
        </div>
    `,
};
