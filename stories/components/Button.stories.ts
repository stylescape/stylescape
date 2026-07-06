// ============================================================================
// Stylescape | Storybook — Button
// ============================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

type ButtonArgs = {
    label: string;
    variant:
        | "primary"
        | "secondary"
        | "outline"
        | "ghost"
        | "link"
        | "accent"
        | "success"
        | "warning"
        | "danger"
        | "info";
    size: "size-xs" | "size-sm" | "size-md" | "size-lg" | "size-xl";
    shape: "" | "pill" | "rounded" | "square";
    disabled: boolean;
};

const VARIANTS = [
    "primary",
    "secondary",
    "outline",
    "ghost",
    "link",
    "accent",
    "success",
    "warning",
    "danger",
    "info",
] as const;

const meta: Meta<ButtonArgs> = {
    title: "Components/Button",
    tags: ["autodocs"],
    render: ({ label, variant, size, shape, disabled }) => {
        const classes = [
            "ss-c-button",
            `ss-c-button--${variant}`,
            `ss-c-button--${size}`,
            shape ? `ss-c-button--${shape}` : "",
        ]
            .filter(Boolean)
            .join(" ");
        return html`
            <button class="${classes}" ${disabled ? "disabled" : ""}>
                ${label}
            </button>
        `;
    },
    args: {
        label: "Button",
        variant: "primary",
        size: "size-md",
        shape: "",
        disabled: false,
    },
    argTypes: {
        variant: { control: "select", options: VARIANTS },
        size: {
            control: "inline-radio",
            options: ["size-xs", "size-sm", "size-md", "size-lg", "size-xl"],
        },
        shape: {
            control: "inline-radio",
            options: ["", "pill", "rounded", "square"],
        },
        disabled: { control: "boolean" },
    },
};

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Playground: Story = {};

export const Variants: Story = {
    render: () =>
        html`
            <div style="display:flex; flex-wrap:wrap; gap:0.75rem;">
                ${VARIANTS.map(
                    (v) =>
                        `<button class="ss-c-button ss-c-button--${v}">${v}</button>`,
                ).join("")}
            </div>
        `,
};

export const Sizes: Story = {
    render: () =>
        html`
            <div style="display:flex; align-items:center; flex-wrap:wrap; gap:0.75rem;">
                ${["size-xs", "size-sm", "size-md", "size-lg", "size-xl"]
                    .map(
                        (s) =>
                            `<button class="ss-c-button ss-c-button--primary ss-c-button--${s}">${s}</button>`,
                    )
                    .join("")}
            </div>
        `,
};

export const Disabled: Story = {
    args: { label: "Disabled", disabled: true },
};
