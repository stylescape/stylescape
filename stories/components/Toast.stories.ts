// ==========================================================================
// Stylescape | Storybook — Toast
// ==========================================================================
// Auto-generated from src/jinja/31-modules/toast.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Toast",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div
            class="ss-c-toast-container"
            style="
                position: relative;
                display: flex;
                flex-direction: column;
                gap: 12px;
            "
        >
            <div
                class="ss-c-toast show"
                style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 16px;
                    background: var(--color_fill_secondary);
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                "
            >
                <div class="ss-c-toast-body">
                    This is a basic toast notification.
                </div>
                <button
                    class="ss-c-toast-close"
                    style="
                        background: none;
                        border: none;
                        font-size: 18px;
                        cursor: pointer;
                    "
                >
                    &times;
                </button>
            </div>

            <div
                class="ss-c-toast ss-c-toast--success show"
                style="
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    background: var(--color_state_success);
                    color: white;
                    border-radius: 8px;
                "
            >
                <div class="ss-c-toast-body">
                    <strong>Success!</strong>
                    Your changes have been saved.
                </div>
                <button
                    class="ss-c-toast-close"
                    style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 18px;
                        cursor: pointer;
                        margin-left: auto;
                    "
                >
                    &times;
                </button>
            </div>

            <div
                class="ss-c-toast ss-c-toast--warning show"
                style="
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    background: var(--color_state_warning);
                    border-radius: 8px;
                "
            >
                <div class="ss-c-toast-body">
                    <strong>Warning:</strong>
                    Please review your input.
                </div>
                <button
                    class="ss-c-toast-close"
                    style="
                        background: none;
                        border: none;
                        font-size: 18px;
                        cursor: pointer;
                        margin-left: auto;
                    "
                >
                    &times;
                </button>
            </div>

            <div
                class="ss-c-toast ss-c-toast--error show"
                style="
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    background: var(--color_state_error);
                    color: white;
                    border-radius: 8px;
                "
            >
                <div class="ss-c-toast-body">
                    <strong>Error:</strong>
                    Something went wrong.
                </div>
                <button
                    class="ss-c-toast-close"
                    style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 18px;
                        cursor: pointer;
                        margin-left: auto;
                    "
                >
                    &times;
                </button>
            </div>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div
            class="ss-c-toast-container"
            style="
                position: relative;
                display: flex;
                flex-direction: column;
                gap: 12px;
            "
        >
            <div
                class="ss-c-toast show"
                style="
                    background: var(--color_fill_secondary);
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                "
            >
                <div
                    class="ss-c-toast-header"
                    style="
                        display: flex;
                        align-items: center;
                        padding: 8px 12px;
                        border-bottom: 1px solid var(--color_line_secondary);
                    "
                >
                    <strong style="flex: 1">Notification</strong>
                    <small style="opacity: 0.7">Just now</small>
                    <button
                        class="ss-c-toast-close"
                        style="
                            background: none;
                            border: none;
                            font-size: 16px;
                            cursor: pointer;
                            margin-left: 8px;
                        "
                    >
                        &times;
                    </button>
                </div>
                <div class="ss-c-toast-body" style="padding: 12px">
                    You have a new message from the team.
                </div>
            </div>
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div
            class="ss-c-toast-container"
            style="
                position: relative;
                display: flex;
                flex-direction: column;
                gap: 12px;
            "
        >
            <div
                class="ss-c-toast show"
                style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    background: var(--color_fill_secondary);
                    border-radius: 8px;
                "
            >
                <span>Item deleted.</span>
                <button
                    class="ss-c-button ss-c-button--small ss-c-button--primary"
                    style="margin-left: auto"
                >
                    Undo
                </button>
            </div>

            <div
                class="ss-c-toast show"
                style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    background: var(--color_fill_secondary);
                    border-radius: 8px;
                "
            >
                <span>New update available.</span>
                <div style="display: flex; gap: 8px; margin-left: auto">
                    <button class="ss-c-button ss-c-button--small ss-c-button--primary">
                        Update
                    </button>
                    <button class="ss-c-button ss-c-button--small ss-c-button--secondary">
                        Later
                    </button>
                </div>
            </div>
        </div>
    `,
};
