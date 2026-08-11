// ==========================================================================
// Stylescape | Storybook — Toggle
// ==========================================================================
// Auto-generated from src/jinja/31-modules/toggle.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Toggle",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const BasicToggle: Story = {
    render: () => html`
        <label class="ss-c-toggle_switch">
            <input type="checkbox" />
            <span class="ss-c-toggle_switch__slider"></span>
        </label>

        <label class="ss-c-toggle_switch">
            <input type="checkbox" checked />
            <span class="ss-c-toggle_switch__slider"></span>
        </label>
    `,
};

export const ToggleWithLabel: Story = {
    render: () => html`
        <label class="ss-c-toggle_switch__label">
            <span class="ss-c-toggle_switch__text">Enable notifications</span>
            <span class="ss-c-toggle_switch">
                <input type="checkbox" />
                <span class="ss-c-toggle_switch__slider"></span>
            </span>
        </label>

        <label class="ss-c-toggle_switch__label">
            <span class="ss-c-toggle_switch">
                <input type="checkbox" checked />
                <span class="ss-c-toggle_switch__slider"></span>
            </span>
            <span class="ss-c-toggle_switch__text">Dark mode enabled</span>
        </label>
    `,
};

export const ToggleSizes: Story = {
    render: () => html`
        <label class="ss-c-toggle_switch ss-c-toggle_switch--sm">
            <input type="checkbox" checked />
            <span class="ss-c-toggle_switch__slider"></span>
        </label>
        <span class="ss-c-ml--02 ss-c-mr--04">Small</span>

        <label class="ss-c-toggle_switch">
            <input type="checkbox" checked />
            <span class="ss-c-toggle_switch__slider"></span>
        </label>
        <span class="ss-c-ml--02 ss-c-mr--04">Default</span>

        <label class="ss-c-toggle_switch ss-c-toggle_switch--lg">
            <input type="checkbox" checked />
            <span class="ss-c-toggle_switch__slider"></span>
        </label>
        <span class="ss-c-ml--02">Large</span>
    `,
};

export const DisabledToggle: Story = {
    render: () => html`
        <label class="ss-c-toggle_switch">
            <input type="checkbox" disabled />
            <span class="ss-c-toggle_switch__slider"></span>
        </label>
        <span class="ss-c-ml--02 ss-c-mr--04">Disabled off</span>

        <label class="ss-c-toggle_switch">
            <input type="checkbox" checked disabled />
            <span class="ss-c-toggle_switch__slider"></span>
        </label>
        <span class="ss-c-ml--02">Disabled on</span>
    `,
};

export const BasicTogglePanel: Story = {
    render: () => html`
        <details class="ss-c-toggle_panel">
            <summary class="ss-c-toggle_panel__header">Click to expand</summary>
            <div class="ss-c-toggle_panel__content">
                <p>
                    This content is hidden until the panel is expanded. Click
                    the header again to collapse.
                </p>
            </div>
        </details>
    `,
};

export const InitiallyOpenPanel: Story = {
    render: () => html`
        <details class="ss-c-toggle_panel" open>
            <summary class="ss-c-toggle_panel__header">
                This panel starts open
            </summary>
            <div class="ss-c-toggle_panel__content">
                <p>
                    Use the "open" attribute to have the panel expanded by
                    default.
                </p>
            </div>
        </details>
    `,
};

export const MultiplePanels: Story = {
    render: () => html`
        <details class="ss-c-toggle_panel ss-c-mb--02">
            <summary class="ss-c-toggle_panel__header">Section One</summary>
            <div class="ss-c-toggle_panel__content">
                <p>Content for section one.</p>
            </div>
        </details>

        <details class="ss-c-toggle_panel ss-c-mb--02">
            <summary class="ss-c-toggle_panel__header">Section Two</summary>
            <div class="ss-c-toggle_panel__content">
                <p>Content for section two.</p>
            </div>
        </details>

        <details class="ss-c-toggle_panel">
            <summary class="ss-c-toggle_panel__header">Section Three</summary>
            <div class="ss-c-toggle_panel__content">
                <p>Content for section three.</p>
            </div>
        </details>
    `,
};

export const BasicToggleButton: Story = {
    render: () => html`
        <button class="ss-c-button ss-c-toggle_button" aria-pressed="false">
            Toggle Off
        </button>

        <button
            class="ss-c-button ss-c-toggle_button ss-c-toggle_button--active"
            aria-pressed="true"
        >
            Toggle On
        </button>
    `,
};

export const ToggleButtonGroup: Story = {
    render: () => html`
        <div
            class="ss-c-toggle_button_group"
            role="group"
            aria-label="Text alignment"
        >
            <button
                class="ss-c-button ss-c-toggle_button ss-c-toggle_button--active"
                aria-pressed="true"
            >
                Left
            </button>
            <button class="ss-c-button ss-c-toggle_button" aria-pressed="false">
                Center
            </button>
            <button class="ss-c-button ss-c-toggle_button" aria-pressed="false">
                Right
            </button>
        </div>
    `,
};

export const ColoredToggles: Story = {
    render: () => html`
        <label class="ss-c-toggle_switch ss-c-toggle_switch--primary">
            <input type="checkbox" checked />
            <span class="ss-c-toggle_switch__slider"></span>
        </label>
        <span class="ss-c-ml--02 ss-c-mr--04">Primary</span>

        <label class="ss-c-toggle_switch ss-c-toggle_switch--success">
            <input type="checkbox" checked />
            <span class="ss-c-toggle_switch__slider"></span>
        </label>
        <span class="ss-c-ml--02 ss-c-mr--04">Success</span>

        <label class="ss-c-toggle_switch ss-c-toggle_switch--warning">
            <input type="checkbox" checked />
            <span class="ss-c-toggle_switch__slider"></span>
        </label>
        <span class="ss-c-ml--02 ss-c-mr--04">Warning</span>

        <label class="ss-c-toggle_switch ss-c-toggle_switch--danger">
            <input type="checkbox" checked />
            <span class="ss-c-toggle_switch__slider"></span>
        </label>
        <span class="ss-c-ml--02">Danger</span>
    `,
};
