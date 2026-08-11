// ==========================================================================
// Stylescape | Storybook — Radio
// ==========================================================================
// Auto-generated from src/jinja/31-modules/radio.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Radio",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Radios: Story = {
    render: () => html`
        <div class="ss-c-demo__group">
            <label class="ss-c-label">Default</label>
            <label for="radio-default-a">
                <input
                    id="radio-default-a"
                    class="ss-c-input--radio"
                    type="radio"
                    name="radio-default"
                    checked
                />
                Option A
            </label>
            <label for="radio-default-b">
                <input
                    id="radio-default-b"
                    class="ss-c-input--radio"
                    type="radio"
                    name="radio-default"
                />
                Option B
            </label>
            <label for="radio-default-c">
                <input
                    id="radio-default-c"
                    class="ss-c-input--radio"
                    type="radio"
                    name="radio-default"
                />
                Option C
            </label>
        </div>

        <div class="ss-c-demo__group">
            <label class="ss-c-label">Custom: Accent Color</label>
            <label for="radio-accent-a">
                <input
                    id="radio-accent-a"
                    class="ss-c-input--radio"
                    type="radio"
                    name="radio-accent"
                    checked
                    style="--color_text_primary: var(--color_accent_primary)"
                />
                Accent A
            </label>
            <label for="radio-accent-b">
                <input
                    id="radio-accent-b"
                    class="ss-c-input--radio"
                    type="radio"
                    name="radio-accent"
                    style="--color_text_primary: var(--color_accent_primary)"
                />
                Accent B
            </label>
        </div>

        <div class="ss-c-demo__group">
            <label class="ss-c-label">Disabled</label>
            <label for="radio-disabled-a">
                <input
                    id="radio-disabled-a"
                    class="ss-c-input--radio"
                    type="radio"
                    name="radio-disabled"
                    disabled
                    checked
                />
                Disabled (checked)
            </label>
            <label for="radio-disabled-b">
                <input
                    id="radio-disabled-b"
                    class="ss-c-input--radio"
                    type="radio"
                    name="radio-disabled"
                    disabled
                />
                Disabled
            </label>
        </div>
    `,
};
