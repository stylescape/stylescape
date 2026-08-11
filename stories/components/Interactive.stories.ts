// ==========================================================================
// Stylescape | Storybook — Interactive
// ==========================================================================
// Auto-generated from src/jinja/31-modules/interactive.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Interactive",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Example: Story = {
    render: () => html`
        <section id="interactive">
            <details>
                <summary>Toggle</summary>
                <p>Content</p>
            </details>
            <button onclick="document.getElementById('dlg').showModal()">
                Open Dialog
            </button>
            <dialog id="dlg">
                <p>Hello from Dialog</p>
                <button onclick="this.closest('dialog').close()">Close</button>
            </dialog>
    `,
};
