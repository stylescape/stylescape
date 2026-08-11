// ==========================================================================
// Stylescape | Storybook — Chip
// ==========================================================================
// Auto-generated from src/jinja/31-modules/chip.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Chip",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div style="display: flex; gap: 8px; flex-wrap: wrap">
            <span class="ss-c-chip">Basic Chip</span>
            <span class="ss-c-chip">Design</span>
            <span class="ss-c-chip">Development</span>
            <span class="ss-c-chip">Marketing</span>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div style="display: flex; gap: 8px; flex-wrap: wrap">
            <span
                class="ss-c-chip"
                style="display: inline-flex; align-items: center; gap: 8px"
            >
                <img
                    src="https://via.placeholder.com/24"
                    alt="User"
                    style="width: 24px; height: 24px; border-radius: 50%"
                />
                John Doe
            </span>
            <span
                class="ss-c-chip"
                style="display: inline-flex; align-items: center; gap: 8px"
            >
                <img
                    src="https://via.placeholder.com/24"
                    alt="User"
                    style="width: 24px; height: 24px; border-radius: 50%"
                />
                Jane Smith
            </span>
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div style="display: flex; gap: 8px; flex-wrap: wrap">
            <span
                class="ss-c-chip"
                style="display: inline-flex; align-items: center; gap: 8px"
            >
                JavaScript
                <button
                    class="ss-c-chip__close"
                    style="
                        background: none;
                        border: none;
                        cursor: pointer;
                        font-size: 14px;
                        opacity: 0.7;
                    "
                >
                    &times;
                </button>
            </span>
            <span
                class="ss-c-chip"
                style="display: inline-flex; align-items: center; gap: 8px"
            >
                TypeScript
                <button
                    class="ss-c-chip__close"
                    style="
                        background: none;
                        border: none;
                        cursor: pointer;
                        font-size: 14px;
                        opacity: 0.7;
                    "
                >
                    &times;
                </button>
            </span>
            <span
                class="ss-c-chip"
                style="display: inline-flex; align-items: center; gap: 8px"
            >
                Python
                <button
                    class="ss-c-chip__close"
                    style="
                        background: none;
                        border: none;
                        cursor: pointer;
                        font-size: 14px;
                        opacity: 0.7;
                    "
                >
                    &times;
                </button>
            </span>
        </div>
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <div style="display: flex; gap: 8px; flex-wrap: wrap">
            <span
                class="ss-c-chip"
                style="background: var(--color_state_info); color: white"
            >
                Info
            </span>
            <span
                class="ss-c-chip"
                style="background: var(--color_state_success); color: white"
            >
                Success
            </span>
            <span class="ss-c-chip" style="background: var(--color_state_warning)">
                Warning
            </span>
            <span
                class="ss-c-chip"
                style="background: var(--color_state_error); color: white"
            >
                Error
            </span>
        </div>
    `,
};

export const SectionTitle5: Story = {
    render: () => html`
        <div style="display: flex; gap: 8px; flex-wrap: wrap">
            <span
                class="ss-c-chip"
                style="
                    background: transparent;
                    border: 1px solid var(--color_line_primary);
                "
            >
                Outlined
            </span>
            <span
                class="ss-c-chip"
                style="
                    background: transparent;
                    border: 1px solid var(--color_state_info);
                    color: var(--color_state_info);
                "
            >
                Info
            </span>
            <span
                class="ss-c-chip"
                style="
                    background: transparent;
                    border: 1px solid var(--color_state_success);
                    color: var(--color_state_success);
                "
            >
                Success
            </span>
        </div>
    `,
};

export const SectionTitle6: Story = {
    render: () => html`
        <div
            class="ss-c-chips-input"
            style="
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                padding: 8px 12px;
                border: 1px solid var(--color_line_secondary);
                border-radius: 8px;
                min-height: 48px;
                align-items: center;
            "
        >
            <span
                class="ss-c-chip"
                style="
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 13px;
                "
            >
                Tag 1
                <button
                    style="
                        background: none;
                        border: none;
                        cursor: pointer;
                        font-size: 12px;
                    "
                >
                    &times;
                </button>
            </span>
            <span
                class="ss-c-chip"
                style="
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 13px;
                "
            >
                Tag 2
                <button
                    style="
                        background: none;
                        border: none;
                        cursor: pointer;
                        font-size: 12px;
                    "
                >
                    &times;
                </button>
            </span>
            <input
                type="text"
                placeholder="Add tag..."
                style="
                    border: none;
                    outline: none;
                    flex: 1;
                    min-width: 100px;
                    background: transparent;
                "
            />
        </div>
    `,
};
