// ==========================================================================
// Stylescape | Storybook — Label
// ==========================================================================
// Auto-generated from src/jinja/31-modules/label.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Label",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <!-- Small Input -->
        <div class="">
            <label class="ss-c-label ss-c-label--sm">Small Input</label>
            <input
                type="text"
                class="ss-c-input ss-c-input--sm"
                placeholder="Small size (sm)"
            />
        </div>

        <!-- Medium (Default) Input -->
        <div class="">
            <label class="ss-c-label ss-c-label--md">Medium Input (Default)</label>
            <input
                type="text"
                class="ss-c-input ss-c-input--md"
                placeholder="Medium size (md)"
            />
        </div>

        <!-- Large Input -->
        <div class="">
            <label class="ss-c-label ss-c-label--lg">Large Input</label>
            <input
                type="text"
                class="ss-c-input ss-c-input--lg"
                placeholder="Large size (lg)"
            />
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <!-- Disabled Label -->
        <div class="">
            <label class="ss-c-label ss-c-label--muted">Disabled Label</label>
            <input
                type="text"
                class="ss-c-input"
                disabled
                placeholder="Disabled Label"
            />
        </div>

        <!-- Accent/Info Label -->
        <div class="">
            <label class="ss-c-label">Info Label</label>
            <input
                type="text"
                class="ss-c-input ss-c-is_info"
                placeholder="Info Label"
            />
        </div>

        <!-- Success Label -->
        <div class="">
            <label class="ss-c-label">Success Label</label>
            <input
                type="text"
                class="ss-c-input ss-c-is_success"
                placeholder="Success Label"
            />
        </div>

        <!-- Warning Label -->
        <div class="">
            <label class="ss-c-label">Warning Label</label>
            <input
                type="text"
                class="ss-c-input ss-c-is_warning"
                placeholder="Warning Label"
            />
        </div>

        <!-- Error Label -->
        <div class="">
            <label class="ss-c-label">Error Label</label>
            <input
                type="text"
                class="ss-c-input ss-c-is_error"
                placeholder="Error Label"
            />
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <label for="demo-input-1">Default Label</label>
        <input type="text" id="demo-input-1" class="ss-c-input ss-c-input--base" placeholder="Input field">
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 24px;">
            <div>
                <label class="ss-c-label ss-c-label--sm" for="demo-sm">Small Label (.label--sm)</label>
                <input type="text" id="demo-sm" class="ss-c-input ss-c-input--base ss-c-input--sm" placeholder="Small input">
            </div>

            <div>
                <label class="ss-c-label ss-c-label--md" for="demo-md">Medium Label (.label--md)</label>
                <input type="text" id="demo-md" class="ss-c-input ss-c-input--base ss-c-input--md" placeholder="Medium input">
            </div>

            <div>
                <label class="ss-c-label ss-c-label--lg" for="demo-lg">Large Label (.label--lg)</label>
                <input type="text" id="demo-lg" class="ss-c-input ss-c-input--base ss-c-input--lg" placeholder="Large input">
            </div>
        </div>
    `,
};

export const SectionTitle5: Story = {
    render: () => html`
        <div style="display: flex; gap: 12px; align-items: center;">
            <label class="ss-c-label ss-c-label--hidden" for="search-field">Search</label>
            <input type="search" id="search-field" class="ss-c-input ss-c-input--base" placeholder="Search...">
            <button class="ss-c-button ss-c-button--base ss-c-button--primary">Search</button>
        </div>
    `,
};

export const SectionTitle6: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 24px;">
            <div>
                <label class="ss-c-label" for="required-field">
                    Email Address <span style="color: var(--color_error);">*</span>
                </label>
                <input type="email" id="required-field" class="ss-c-input ss-c-input--base" placeholder="name@example.com" required>
            </div>

            <div>
                <label class="ss-c-label" for="optional-field">
                    Phone Number <span style="opacity: 0.6; font-weight: 400;">(optional)</span>
                </label>
                <input type="tel" id="optional-field" class="ss-c-input ss-c-input--base" placeholder="+1 (555) 000-0000">
            </div>
        </div>
    `,
};

export const SectionTitle7: Story = {
    render: () => html`
        <form style="display: flex; flex-direction: column; gap: 20px; max-width: 400px;">
            <div>
                <label class="ss-c-form-label" for="form-name">Full Name</label>
                <input type="text" id="form-name" class="ss-c-input ss-c-input--base" placeholder="John Doe">
            </div>

            <div>
                <label class="ss-c-form-label ss-c-form-label--sm" for="form-email">Email (Small Label)</label>
                <input type="email" id="form-email" class="ss-c-input ss-c-input--base" placeholder="john@example.com">
            </div>

            <div>
                <label class="ss-c-form-label ss-c-form-label--lg" for="form-message">Message (Large Label)</label>
                <textarea id="form-message" class="ss-c-input ss-c-input--base" rows="3" placeholder="Your message..."></textarea>
            </div>
        </form>
    `,
};

export const SectionTitle8: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
            <!-- Text Input -->
            <div>
                <label class="ss-c-label" for="text-input">Text Input</label>
                <input type="text" id="text-input" class="ss-c-input ss-c-input--base" placeholder="Enter text">
            </div>

            <!-- Select -->
            <div>
                <label class="ss-c-label" for="select-input">Select Dropdown</label>
                <select id="select-input" class="ss-c-input ss-c-input--base">
                    <option value="">Choose an option</option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                </select>
            </div>

            <!-- Textarea -->
            <div>
                <label class="ss-c-label" for="textarea-input">Textarea</label>
                <textarea id="textarea-input" class="ss-c-input ss-c-input--base" rows="3" placeholder="Enter longer text..."></textarea>
            </div>

            <!-- Checkbox -->
            <div style="display: flex; align-items: center; gap: 8px;">
                <input type="checkbox" id="checkbox-input" class="ss-c-input--checkbox">
                <label for="checkbox-input">Checkbox Label</label>
            </div>

            <!-- Radio Group -->
            <fieldset style="border: none; padding: 0; margin: 0;">
                <legend class="ss-c-label" style="margin-bottom: 8px;">Radio Group</legend>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="radio" id="radio-1" name="radio-group" class="ss-c-input--radio">
                        <label for="radio-1">Option A</label>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="radio" id="radio-2" name="radio-group" class="ss-c-input--radio">
                        <label for="radio-2">Option B</label>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="radio" id="radio-3" name="radio-group" class="ss-c-input--radio">
                        <label for="radio-3">Option C</label>
                    </div>
                </div>
            </fieldset>
        </div>
    `,
};

export const SectionTitle9: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <label for="inline-1" style="min-width: 100px;">Username</label>
                <input type="text" id="inline-1" class="ss-c-input ss-c-input--base ss-c-input--base--inline" placeholder="Enter username">
            </div>

            <div style="display: flex; align-items: center; gap: 12px;">
                <label for="inline-2" style="min-width: 100px;">Password</label>
                <input type="password" id="inline-2" class="ss-c-input ss-c-input--base ss-c-input--base--inline" placeholder="Enter password">
            </div>
        </div>
    `,
};
