// ============================================================================
// Stylescape | Storybook — Badge
// ============================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

type BadgeArgs = {
    label: string;
    tone: "" | "accent" | "info" | "success" | "warning" | "error";
    shape: "" | "squared" | "rounded" | "pill";
};

const TONES = ["", "accent", "info", "success", "warning", "error"] as const;

const meta: Meta<BadgeArgs> = {
    title: "Components/Badge",
    tags: ["autodocs"],
    render: ({ label, tone, shape }) => {
        const classes = [
            "ss-c-badge",
            tone ? `ss-c-${tone}` : "",
            shape ? `ss-c-${shape}` : "",
        ]
            .filter(Boolean)
            .join(" ");
        return html`<span class="${classes}">${label}</span>`;
    },
    args: { label: "Badge", tone: "", shape: "" },
    argTypes: {
        tone: { control: "select", options: TONES },
        shape: {
            control: "inline-radio",
            options: ["", "squared", "rounded", "pill"],
        },
    },
};

export default meta;
type Story = StoryObj<BadgeArgs>;

export const Playground: Story = {};

export const Tones: Story = {
    render: () => html`
        <div style="display:flex; flex-wrap:wrap; gap:0.5rem; align-items:center;">
            ${TONES.map((t) => {
                const cls = ["ss-c-badge", t ? `ss-c-${t}` : ""]
                    .filter(Boolean)
                    .join(" ");
                return `<span class="${cls}">${t || "default"}</span>`;
            }).join("")}
        </div>
    `,
};

export const Shapes: Story = {
    render: () => html`
        <div style="display:flex; flex-wrap:wrap; gap:0.5rem; align-items:center;">
            ${["squared", "rounded", "pill"]
                .map(
                    (s) =>
                        `<span class="ss-c-badge ss-c-accent ss-c-${s}">${s}</span>`,
                )
                .join("")}
        </div>
    `,
};
