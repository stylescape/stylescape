// ==========================================================================
// Stylescape | Storybook — Offcanvas
// ==========================================================================
// Auto-generated from src/jinja/31-modules/offcanvas.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Offcanvas",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <aside class="ss-c-offcanvas ss-c-offcanvas--start ss-c-offcanvas--static" style="position:relative; height:240px">
            <header class="ss-c-offcanvas__header">
                <h4 class="ss-c-offcanvas__title">Menu</h4>
                <button class="ss-c-offcanvas__close" aria-label="Close"></button>
            </header>
            <div class="ss-c-offcanvas__body">
                <p>Drawer content.</p>
            </div>
        </aside>
    `,
};
