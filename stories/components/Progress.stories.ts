// ==========================================================================
// Stylescape | Storybook — Progress
// ==========================================================================
// Auto-generated from src/jinja/31-modules/progress.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Progress",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <progress value="3333" max="10000">33%</progress>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div style="max-width: 400px">
            <div
                class="ss-c-progress_bar"
                style="
                    width: 100%;
                    height: 8px;
                    background: var(--color_fill_secondary);
                    border-radius: 4px;
                    overflow: hidden;
                "
            >
                <div
                    class="ss-c-progress_bar--fill"
                    style="
                        width: 65%;
                        height: 100%;
                        background: var(--color_fill_primary);
                        transition: width 0.3s;
                    "
                ></div>
            </div>
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div style="max-width: 400px">
            <div
                style="
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    font-size: 14px;
                "
            >
                <span>Uploading file...</span>
                <span>75%</span>
            </div>
            <div
                class="ss-c-progress_bar"
                style="
                    width: 100%;
                    height: 10px;
                    background: var(--color_fill_secondary);
                    border-radius: 5px;
                    overflow: hidden;
                "
            >
                <div
                    class="ss-c-progress_bar--fill"
                    style="
                        width: 75%;
                        height: 100%;
                        background: var(--color_fill_primary);
                    "
                ></div>
            </div>
        </div>
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <div
            style="
                display: flex;
                flex-direction: column;
                gap: 20px;
                max-width: 400px;
            "
        >
            <!-- Small -->
            <div>
                <label
                    style="
                        font-size: 12px;
                        opacity: 0.7;
                        display: block;
                        margin-bottom: 4px;
                    "
                >
                    Small
                </label>
                <div
                    class="ss-c-progress_bar ss-c-progress_bar--small"
                    style="
                        width: 100%;
                        height: 4px;
                        background: var(--color_fill_secondary);
                        border-radius: 2px;
                        overflow: hidden;
                    "
                >
                    <div
                        style="
                            width: 40%;
                            height: 100%;
                            background: var(--color_fill_primary);
                        "
                    ></div>
                </div>
            </div>
            <!-- Medium -->
            <div>
                <label
                    style="
                        font-size: 12px;
                        opacity: 0.7;
                        display: block;
                        margin-bottom: 4px;
                    "
                >
                    Medium
                </label>
                <div
                    class="ss-c-progress_bar ss-c-progress_bar--medium"
                    style="
                        width: 100%;
                        height: 8px;
                        background: var(--color_fill_secondary);
                        border-radius: 4px;
                        overflow: hidden;
                    "
                >
                    <div
                        style="
                            width: 60%;
                            height: 100%;
                            background: var(--color_fill_primary);
                        "
                    ></div>
                </div>
            </div>
            <!-- Large -->
            <div>
                <label
                    style="
                        font-size: 12px;
                        opacity: 0.7;
                        display: block;
                        margin-bottom: 4px;
                    "
                >
                    Large
                </label>
                <div
                    class="ss-c-progress_bar ss-c-progress_bar--large"
                    style="
                        width: 100%;
                        height: 16px;
                        background: var(--color_fill_secondary);
                        border-radius: 8px;
                        overflow: hidden;
                    "
                >
                    <div
                        style="
                            width: 80%;
                            height: 100%;
                            background: var(--color_fill_primary);
                        "
                    ></div>
                </div>
            </div>
        </div>
    `,
};

export const SectionTitle5: Story = {
    render: () => html`
        <div
            style="
                display: flex;
                flex-direction: column;
                gap: 16px;
                max-width: 400px;
            "
        >
            <!-- Success -->
            <div>
                <label
                    style="font-size: 13px; display: block; margin-bottom: 6px"
                >
                    Completed ✓
                </label>
                <div
                    class="ss-c-progress_bar"
                    style="
                        width: 100%;
                        height: 10px;
                        background: var(--color_fill_secondary);
                        border-radius: 5px;
                        overflow: hidden;
                    "
                >
                    <div
                        style="
                            width: 100%;
                            height: 100%;
                            background: var(--color_state_success);
                        "
                    ></div>
                </div>
            </div>
            <!-- Warning -->
            <div>
                <label
                    style="font-size: 13px; display: block; margin-bottom: 6px"
                >
                    Storage Used ⚠
                </label>
                <div
                    class="ss-c-progress_bar"
                    style="
                        width: 100%;
                        height: 10px;
                        background: var(--color_fill_secondary);
                        border-radius: 5px;
                        overflow: hidden;
                    "
                >
                    <div
                        style="
                            width: 85%;
                            height: 100%;
                            background: var(--color_state_warning);
                        "
                    ></div>
                </div>
            </div>
            <!-- Error -->
            <div>
                <label
                    style="font-size: 13px; display: block; margin-bottom: 6px"
                >
                    Critical ✕
                </label>
                <div
                    class="ss-c-progress_bar"
                    style="
                        width: 100%;
                        height: 10px;
                        background: var(--color_fill_secondary);
                        border-radius: 5px;
                        overflow: hidden;
                    "
                >
                    <div
                        style="
                            width: 95%;
                            height: 100%;
                            background: var(--color_state_error);
                        "
                    ></div>
                </div>
            </div>
            <!-- Info -->
            <div>
                <label
                    style="font-size: 13px; display: block; margin-bottom: 6px"
                >
                    Syncing ℹ
                </label>
                <div
                    class="ss-c-progress_bar"
                    style="
                        width: 100%;
                        height: 10px;
                        background: var(--color_fill_secondary);
                        border-radius: 5px;
                        overflow: hidden;
                    "
                >
                    <div
                        style="
                            width: 45%;
                            height: 100%;
                            background: var(--color_state_info);
                        "
                    ></div>
                </div>
            </div>
        </div>
    `,
};

export const SectionTitle6: Story = {
    render: () => html`
        <div
            style="
                display: flex;
                flex-direction: column;
                gap: 20px;
                max-width: 400px;
            "
        >
            <!-- Striped -->
            <div>
                <label
                    style="font-size: 13px; display: block; margin-bottom: 6px"
                >
                    Striped Pattern
                </label>
                <div
                    class="ss-c-progress_bar"
                    style="
                        width: 100%;
                        height: 16px;
                        background: var(--color_fill_secondary);
                        border-radius: 8px;
                        overflow: hidden;
                    "
                >
                    <div
                        style="
                            width: 60%;
                            height: 100%;
                            background: repeating-linear-gradient(
                                45deg,
                                var(--color_fill_primary),
                                var(--color_fill_primary) 10px,
                                rgba(255, 255, 255, 0.2) 10px,
                                rgba(255, 255, 255, 0.2) 20px
                            );
                        "
                    ></div>
                </div>
            </div>
            <!-- Indeterminate -->
            <div>
                <label
                    style="font-size: 13px; display: block; margin-bottom: 6px"
                >
                    Indeterminate Loading
                </label>
                <div
                    class="ss-c-progress_bar ss-c-progress_bar--indeterminate"
                    style="
                        width: 100%;
                        height: 8px;
                        background: var(--color_fill_secondary);
                        border-radius: 4px;
                        overflow: hidden;
                        position: relative;
                    "
                >
                    <div
                        style="
                            position: absolute;
                            width: 30%;
                            height: 100%;
                            background: var(--color_fill_primary);
                            animation: indeterminate 1.5s infinite linear;
                            border-radius: 4px;
                        "
                    ></div>
                </div>
            </div>
        </div>
        <style>
            @keyframes indeterminate {
                0% {
                    left: -30%;
                }
                100% {
                    left: 100%;
                }
            }
        </style>
    `,
};

export const SectionTitle7: Story = {
    render: () => html`
        <div style="max-width: 450px">
            <div
                style="
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    font-size: 13px;
                "
            >
                <span>Storage Usage</span>
                <span>78 GB / 100 GB</span>
            </div>
            <div
                class="ss-c-progress_bar"
                style="
                    width: 100%;
                    height: 20px;
                    background: var(--color_fill_secondary);
                    border-radius: 10px;
                    overflow: hidden;
                    display: flex;
                "
            >
                <div
                    style="
                        width: 45%;
                        height: 100%;
                        background: var(--color_state_info);
                    "
                    title="Documents: 45GB"
                ></div>
                <div
                    style="
                        width: 20%;
                        height: 100%;
                        background: var(--color_state_success);
                    "
                    title="Photos: 20GB"
                ></div>
                <div
                    style="
                        width: 13%;
                        height: 100%;
                        background: var(--color_state_warning);
                    "
                    title="Videos: 13GB"
                ></div>
            </div>
            <div
                style="
                    display: flex;
                    gap: 16px;
                    margin-top: 12px;
                    font-size: 12px;
                    flex-wrap: wrap;
                "
            >
                <span style="display: flex; align-items: center; gap: 6px">
                    <span
                        style="
                            width: 12px;
                            height: 12px;
                            background: var(--color_state_info);
                            border-radius: 3px;
                        "
                    ></span>
                    Documents
                </span>
                <span style="display: flex; align-items: center; gap: 6px">
                    <span
                        style="
                            width: 12px;
                            height: 12px;
                            background: var(--color_state_success);
                            border-radius: 3px;
                        "
                    ></span>
                    Photos
                </span>
                <span style="display: flex; align-items: center; gap: 6px">
                    <span
                        style="
                            width: 12px;
                            height: 12px;
                            background: var(--color_state_warning);
                            border-radius: 3px;
                        "
                    ></span>
                    Videos
                </span>
                <span style="display: flex; align-items: center; gap: 6px">
                    <span
                        style="
                            width: 12px;
                            height: 12px;
                            background: var(--color_fill_secondary);
                            border-radius: 3px;
                        "
                    ></span>
                    Free
                </span>
            </div>
        </div>
    `,
};
