// ==========================================================================
// Stylescape | Storybook — Preloader
// ==========================================================================
// Auto-generated from src/jinja/31-modules/preloader.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Preloader",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div
            class="ss-c-preloader"
            style="position: relative; width: 100%; height: 200px"
        >
            <!-- Preloader content goes here -->
            <span>Loading...</span>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div
            style="
                position: relative;
                width: 100%;
                height: 200px;
                background: var(--color_surface_primary, #f5f5f5);
                display: flex;
                justify-content: center;
                align-items: center;
            "
        >
            <div class="ss-c-preloader_lines">
                <div class="ss-c-preloader_line ss-c-preloader_line_1"></div>
                <div class="ss-c-preloader_line ss-c-preloader_line_2"></div>
                <div class="ss-c-preloader_line ss-c-preloader_line_3"></div>
                <div class="ss-c-preloader_line ss-c-preloader_line_4"></div>
                <div class="ss-c-preloader_line ss-c-preloader_line_5"></div>
            </div>
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div
            style="
                position: relative;
                width: 100%;
                height: 200px;
                background: var(--color_surface_primary, #f5f5f5);
            "
        >
            <div
                class="ss-c-preloader_pulse"
                style="top: 50%; left: 50%; transform: translate(-50%, -50%)"
            ></div>
        </div>
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <div
            class="ss-c-preloader ss-c-preloader_hidden"
            style="position: relative; width: 100%; height: 100px"
        >
            <span>This preloader is hidden</span>
        </div>
    `,
};
