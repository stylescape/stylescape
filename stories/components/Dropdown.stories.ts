// ==========================================================================
// Stylescape | Storybook — Dropdown
// ==========================================================================
// Auto-generated from src/jinja/31-modules/dropdown.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Dropdown",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div class="ss-c-dropdown--menu">
            <label>
                Option 1
                <input type="checkbox" />
            </label>
            <label>
                Option 2
                <input type="checkbox" />
            </label>
            <label>
                Option 3
                <input type="checkbox" />
            </label>
            <label>
                Option 4
                <input type="checkbox" />
            </label>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div class="ss-c-select_dropdown">
            <div class="ss-c-select_dropdown--header">
                <span id="selected-count">Selected: 0 options</span>
                <button class="active ss-c-flipper--down" type="button"></button>
            </div>
            <div class="ss-c-select_dropdown--menu ss-c-dropdown ss-c-dropdown--collapse">
                <label>
                    <span>Option 1</span>
                    <input type="checkbox" />
                </label>
                <label>
                    <span>Option 2</span>
                    <input type="checkbox" checked />
                </label>
                <label>
                    <span>Option 3</span>
                    <input type="checkbox" />
                </label>
                <label>
                    <span>Option 4</span>
                    <input type="checkbox" checked />
                </label>
            </div>
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div class="ss-c-dropdown">
            <button onclick="myFunction()" class="ss-c-dropbutton">Dropdown</button>
            <div id="myDropdown" class="ss-c-dropdown-content">
                <a href="#">Link 1</a>
                <a href="#">Link 2</a>
                <a href="#">Link 3</a>
            </div>
        </div>
    `,
};
