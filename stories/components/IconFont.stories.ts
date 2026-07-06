// ==========================================================================
// Stylescape | Storybook — Icon Font
// ==========================================================================
// Auto-generated from src/jinja/31-modules/icon-font.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Icon Font",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div
            style="
                display: flex;
                gap: 24px;
                flex-wrap: wrap;
                align-items: center;
            "
        >
            <span
                class="ss-c-icon-font"
                style="
                    font-family: &quot;Material Icons&quot;, sans-serif;
                    font-size: 24px;
                "
            >
                home
            </span>
            <span
                class="ss-c-icon-font"
                style="
                    font-family: &quot;Material Icons&quot;, sans-serif;
                    font-size: 24px;
                "
            >
                search
            </span>
            <span
                class="ss-c-icon-font"
                style="
                    font-family: &quot;Material Icons&quot;, sans-serif;
                    font-size: 24px;
                "
            >
                settings
            </span>
            <span
                class="ss-c-icon-font"
                style="
                    font-family: &quot;Material Icons&quot;, sans-serif;
                    font-size: 24px;
                "
            >
                favorite
            </span>
            <span
                class="ss-c-icon-font"
                style="
                    font-family: &quot;Material Icons&quot;, sans-serif;
                    font-size: 24px;
                "
            >
                mail
            </span>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div
            style="display: flex; gap: 32px; flex-wrap: wrap; align-items: end"
        >
            <div style="text-align: center">
                <span style="font-size: 16px; display: block">★</span>
                <span
                    style="
                        font-size: 11px;
                        opacity: 0.6;
                        margin-top: 4px;
                        display: block;
                    "
                >
                    16px
                </span>
            </div>
            <div style="text-align: center">
                <span style="font-size: 24px; display: block">★</span>
                <span
                    style="
                        font-size: 11px;
                        opacity: 0.6;
                        margin-top: 4px;
                        display: block;
                    "
                >
                    24px
                </span>
            </div>
            <div style="text-align: center">
                <span style="font-size: 32px; display: block">★</span>
                <span
                    style="
                        font-size: 11px;
                        opacity: 0.6;
                        margin-top: 4px;
                        display: block;
                    "
                >
                    32px
                </span>
            </div>
            <div style="text-align: center">
                <span style="font-size: 48px; display: block">★</span>
                <span
                    style="
                        font-size: 11px;
                        opacity: 0.6;
                        margin-top: 4px;
                        display: block;
                    "
                >
                    48px
                </span>
            </div>
            <div style="text-align: center">
                <span style="font-size: 64px; display: block">★</span>
                <span
                    style="
                        font-size: 11px;
                        opacity: 0.6;
                        margin-top: 4px;
                        display: block;
                    "
                >
                    64px
                </span>
            </div>
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div
            style="display: flex; gap: 24px; flex-wrap: wrap; font-size: 32px"
        >
            <span style="color: var(--color_fill_primary)">♦</span>
            <span style="color: var(--color_state_success)">✔</span>
            <span style="color: var(--color_state_warning)">⚠</span>
            <span style="color: var(--color_state_error)">✖</span>
            <span style="color: var(--color_state_info)">ℹ</span>
        </div>
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <div style="display: flex; gap: 16px; flex-wrap: wrap">
            <span
                style="
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    background: var(--color_fill_primary);
                    color: white;
                    border-radius: 8px;
                    font-size: 24px;
                "
            >
                ⚙
            </span>
            <span
                style="
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    background: var(--color_state_success);
                    color: white;
                    border-radius: 50%;
                    font-size: 24px;
                "
            >
                ✓
            </span>
            <span
                style="
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    background: var(--color_fill_secondary);
                    border-radius: 8px;
                    font-size: 24px;
                "
            >
                ♪
            </span>
            <span
                style="
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    border: 2px solid var(--color_line_secondary);
                    border-radius: 8px;
                    font-size: 24px;
                "
            >
                ⭐
            </span>
        </div>
    `,
};

export const SectionTitle5: Story = {
    render: () => html`
        <div style="display: flex; gap: 12px; flex-wrap: wrap">
            <button
                style="
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    border: none;
                    background: var(--color_fill_primary);
                    color: white;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                "
            >
                <span>+</span>
                Add Item
            </button>
            <button
                style="
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    border: none;
                    background: var(--color_state_error);
                    color: white;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                "
            >
                <span>␡</span>
                Delete
            </button>
            <button
                style="
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    border: 1px solid var(--color_line_secondary);
                    background: transparent;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                "
            >
                <span>⇧</span>
                Export
            </button>
            <button
                style="
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 44px;
                    height: 44px;
                    border: none;
                    background: var(--color_fill_secondary);
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                "
            >
                ⚙
            </button>
        </div>
    `,
};

export const SectionTitle6: Story = {
    render: () => html`
        <ul style="list-style: none; padding: 0; margin: 0; max-width: 300px">
            <li
                style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 0;
                    border-bottom: 1px solid var(--color_line_secondary);
                "
            >
                <span style="font-size: 20px">▤</span>
                <span>Documents</span>
            </li>
            <li
                style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 0;
                    border-bottom: 1px solid var(--color_line_secondary);
                "
            >
                <span style="font-size: 20px">▭</span>
                <span>Images</span>
            </li>
            <li
                style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 0;
                    border-bottom: 1px solid var(--color_line_secondary);
                "
            >
                <span style="font-size: 20px">♪</span>
                <span>Music</span>
            </li>
            <li
                style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 0;
                "
            >
                <span style="font-size: 20px">▷</span>
                <span>Videos</span>
            </li>
        </ul>
    `,
};
