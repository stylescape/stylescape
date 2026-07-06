// ==========================================================================
// Stylescape | Storybook — Tab
// ==========================================================================
// Auto-generated from src/jinja/31-modules/tab.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Tab",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <!-- Tab links -->
        <div class="ss-c-tab">
            <button
                class="ss-c-tablinks"
                onclick="openCity(event, 'London')"
                id="defaultOpen"
            >
                London
            </button>
            <button class="ss-c-tablinks" onclick="openCity(event, 'Paris')">
                Paris
            </button>
            <button class="ss-c-tablinks" onclick="openCity(event, 'Tokyo')">
                Tokyo
            </button>
        </div>

        <!-- Tab content -->
        <div id="London" class="ss-c-tabcontent">
            <h3>London</h3>
            <p>London is the capital city of England.</p>
        </div>

        <div id="Paris" class="ss-c-tabcontent">
            <h3>Paris</h3>
            <p>Paris is the capital of France.</p>
        </div>

        <div id="Tokyo" class="ss-c-tabcontent">
            <h3>Tokyo</h3>
            <p>Tokyo is the capital of Japan.</p>
        </div>
    `,
};
