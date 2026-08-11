// ============================================================================
// Stylescape | Storybook — Alert
// ============================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

type AlertArgs = {
    variant: "success" | "warning" | "error" | "info";
    title: string;
    message: string;
};

const meta: Meta<AlertArgs> = {
    title: "Components/Alert",
    tags: ["autodocs"],
    render: ({ variant, title, message }) => html`
        <div class="ss-c-alert--${variant}">
            <strong class="ss-c-alert__title">${title}</strong>
            <span class="ss-c-alert__message">${message}</span>
        </div>
    `,
    args: {
        variant: "info",
        title: "Info",
        message: "This is additional information for your context.",
    },
    argTypes: {
        variant: {
            control: "inline-radio",
            options: ["success", "warning", "error", "info"],
        },
    },
};

export default meta;
type Story = StoryObj<AlertArgs>;

export const Playground: Story = {};

export const Success: Story = {
    args: {
        variant: "success",
        title: "Success",
        message: "Your submission was successful.",
    },
};

export const Warning: Story = {
    args: {
        variant: "warning",
        title: "Warning",
        message: "There are unsaved changes.",
    },
};

export const Error: Story = {
    args: {
        variant: "error",
        title: "Error",
        message: "Something went wrong. Please try again.",
    },
};

export const AllVariants: Story = {
    render: () => html`
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div class="ss-c-alert--success">
                <strong class="ss-c-alert__title">Success</strong>
                <span class="ss-c-alert__message">Your submission was successful.</span>
            </div>
            <div class="ss-c-alert--warning">
                <strong class="ss-c-alert__title">Warning</strong>
                <span class="ss-c-alert__message">There are unsaved changes.</span>
            </div>
            <div class="ss-c-alert--error">
                <strong class="ss-c-alert__title">Error</strong>
                <span class="ss-c-alert__message">Something went wrong. Please try again.</span>
            </div>
            <div class="ss-c-alert--info">
                <strong class="ss-c-alert__title">Info</strong>
                <span class="ss-c-alert__message">This is additional information for your context.</span>
            </div>
        </div>
    `,
};
