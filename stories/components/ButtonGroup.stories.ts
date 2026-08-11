// ==========================================================================
// Stylescape | Storybook — Button Group
// ==========================================================================
// Auto-generated from src/jinja/31-modules/button-group.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Button Group",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SimpleButtonGroup: Story = {
    render: () => html`
        <div class="ss-c-button-group" role="group" aria-label="Basic button group">
            <button class="ss-c-button">Left</button>
            <button class="ss-c-button">Middle</button>
            <button class="ss-c-button">Right</button>
        </div>
    `,
};

export const WithLinks: Story = {
    render: () => html`
        <div class="ss-c-button-group" role="group" aria-label="Navigation group">
            <a href="#" class="ss-c-button">Previous</a>
            <a href="#" class="ss-c-button">Current</a>
            <a href="#" class="ss-c-button">Next</a>
        </div>
    `,
};

export const PrimaryGroup: Story = {
    render: () => html`
        <div class="ss-c-button-group" role="group" aria-label="Primary group">
            <button class="ss-c-button ss-c-button--primary">One</button>
            <button class="ss-c-button ss-c-button--primary">Two</button>
            <button class="ss-c-button ss-c-button--primary">Three</button>
        </div>
    `,
};

export const OutlineGroup: Story = {
    render: () => html`
        <div class="ss-c-button-group" role="group" aria-label="Outline group">
            <button class="ss-c-button ss-c-button--outline">One</button>
            <button class="ss-c-button ss-c-button--outline">Two</button>
            <button class="ss-c-button ss-c-button--outline">Three</button>
        </div>
    `,
};

export const MixedVariants: Story = {
    render: () => html`
        <div class="ss-c-button-group" role="group" aria-label="Mixed group">
            <button class="ss-c-button ss-c-button--success">Approve</button>
            <button class="ss-c-button ss-c-button--warning">Review</button>
            <button class="ss-c-button ss-c-button--danger">Reject</button>
        </div>
    `,
};

export const BasicVertical: Story = {
    render: () => html`
        <div
            class="ss-c-button-group ss-c-button-group--vertical"
            role="group"
            aria-label="Vertical group"
        >
            <button class="ss-c-button">Top</button>
            <button class="ss-c-button">Middle</button>
            <button class="ss-c-button">Bottom</button>
        </div>
    `,
};

export const VerticalMenuStyle: Story = {
    render: () => html`
        <div
            class="ss-c-button-group ss-c-button-group--vertical"
            role="group"
            aria-label="Menu"
        >
            <button class="ss-c-button ss-c-button--outline">Dashboard</button>
            <button class="ss-c-button ss-c-button--outline">Settings</button>
            <button class="ss-c-button ss-c-button--outline">Profile</button>
            <button class="ss-c-button ss-c-button--outline">Logout</button>
        </div>
    `,
};

export const SizeVariations: Story = {
    render: () => html`
        <div class="ss-c-button-group ss-c-mb--02" role="group" aria-label="Small group">
            <button class="ss-c-button ss-c-button--sm">Small</button>
            <button class="ss-c-button ss-c-button--sm">Small</button>
            <button class="ss-c-button ss-c-button--sm">Small</button>
        </div>

        <div
            class="ss-c-button-group ss-c-mb--02"
            role="group"
            aria-label="Default group"
        >
            <button class="ss-c-button">Default</button>
            <button class="ss-c-button">Default</button>
            <button class="ss-c-button">Default</button>
        </div>

        <div class="ss-c-button-group" role="group" aria-label="Large group">
            <button class="ss-c-button ss-c-button--lg">Large</button>
            <button class="ss-c-button ss-c-button--lg">Large</button>
            <button class="ss-c-button ss-c-button--lg">Large</button>
        </div>
    `,
};

export const SplitButtonDropdown: Story = {
    render: () => html`
        <div class="ss-c-button-group" role="group" aria-label="Split button">
            <button class="ss-c-button ss-c-button--primary">Save</button>
            <button
                class="ss-c-button ss-c-button--primary ss-c-button--icon"
                aria-label="More options"
            >
                ▼
            </button>
        </div>
    `,
};

export const SingleSelection: Story = {
    render: () => html`
        <div
            class="ss-c-button-group ss-c-button-group--toggle"
            role="group"
            aria-label="View mode"
        >
            <button class="ss-c-button ss-c-button--active" aria-pressed="true">
                List
            </button>
            <button class="ss-c-button" aria-pressed="false">Grid</button>
            <button class="ss-c-button" aria-pressed="false">Table</button>
        </div>
    `,
};

export const MultipleSelection: Story = {
    render: () => html`
        <div
            class="ss-c-button-group ss-c-button-group--toggle"
            role="group"
            aria-label="Text formatting"
        >
            <button class="ss-c-button ss-c-button--active" aria-pressed="true">
                <strong>B</strong>
            </button>
            <button class="ss-c-button" aria-pressed="false"><em>I</em></button>
            <button class="ss-c-button ss-c-button--active" aria-pressed="true">
                <u>U</u>
            </button>
        </div>
    `,
};

export const EditorToolbar: Story = {
    render: () => html`
        <div class="ss-c-toolbar" role="toolbar" aria-label="Editor toolbar">
            <div
                class="ss-c-button-group"
                role="group"
                aria-label="File operations"
            >
                <button class="ss-c-button">New</button>
                <button class="ss-c-button">Open</button>
                <button class="ss-c-button">Save</button>
            </div>
            <div
                class="ss-c-button-group"
                role="group"
                aria-label="Edit operations"
            >
                <button class="ss-c-button">Cut</button>
                <button class="ss-c-button">Copy</button>
                <button class="ss-c-button">Paste</button>
            </div>
            <div class="ss-c-button-group" role="group" aria-label="Format">
                <button class="ss-c-button"><strong>B</strong></button>
                <button class="ss-c-button"><em>I</em></button>
            </div>
        </div>
    `,
};
