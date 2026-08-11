// ==========================================================================
// Stylescape | Storybook — Placeholder
// ==========================================================================
// Auto-generated from src/jinja/31-modules/placeholder.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Placeholder",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div class="ss-c-placeholder ss-c-placeholder--text" style="max-width: 500px">
            <div
                class="ss-c-placeholder__line"
                style="
                    height: 20px;
                    width: 100%;
                    background: linear-gradient(
                        90deg,
                        var(--color_fill_secondary) 25%,
                        var(--color_line_secondary) 50%,
                        var(--color_fill_secondary) 75%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 4px;
                    margin-bottom: 8px;
                "
            ></div>
            <div
                class="ss-c-placeholder__line"
                style="
                    height: 20px;
                    width: 90%;
                    background: linear-gradient(
                        90deg,
                        var(--color_fill_secondary) 25%,
                        var(--color_line_secondary) 50%,
                        var(--color_fill_secondary) 75%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 4px;
                    margin-bottom: 8px;
                "
            ></div>
            <div
                class="ss-c-placeholder__line"
                style="
                    height: 20px;
                    width: 75%;
                    background: linear-gradient(
                        90deg,
                        var(--color_fill_secondary) 25%,
                        var(--color_line_secondary) 50%,
                        var(--color_fill_secondary) 75%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 4px;
                "
            ></div>
        </div>
        <style>
            @keyframes shimmer {
                0% {
                    background-position: 200% 0;
                }
                100% {
                    background-position: -200% 0;
                }
            }
        </style>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div
            class="ss-c-placeholder ss-c-placeholder--card"
            style="
                max-width: 320px;
                padding: 16px;
                background: white;
                border: 1px solid var(--color_line_secondary);
                border-radius: 12px;
            "
        >
            <div
                style="
                    aspect-ratio: 16/9;
                    background: linear-gradient(
                        90deg,
                        var(--color_fill_secondary) 25%,
                        var(--color_line_secondary) 50%,
                        var(--color_fill_secondary) 75%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 8px;
                    margin-bottom: 16px;
                "
            ></div>
            <div
                style="
                    height: 24px;
                    width: 70%;
                    background: linear-gradient(
                        90deg,
                        var(--color_fill_secondary) 25%,
                        var(--color_line_secondary) 50%,
                        var(--color_fill_secondary) 75%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 4px;
                    margin-bottom: 12px;
                "
            ></div>
            <div
                style="
                    height: 16px;
                    width: 100%;
                    background: linear-gradient(
                        90deg,
                        var(--color_fill_secondary) 25%,
                        var(--color_line_secondary) 50%,
                        var(--color_fill_secondary) 75%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 4px;
                    margin-bottom: 8px;
                "
            ></div>
            <div
                style="
                    height: 16px;
                    width: 85%;
                    background: linear-gradient(
                        90deg,
                        var(--color_fill_secondary) 25%,
                        var(--color_line_secondary) 50%,
                        var(--color_fill_secondary) 75%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 4px;
                "
            ></div>
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div
            class="ss-c-placeholder ss-c-placeholder--profile"
            style="
                display: flex;
                align-items: center;
                gap: 16px;
                max-width: 400px;
            "
        >
            <div
                style="
                    width: 64px;
                    height: 64px;
                    flex-shrink: 0;
                    background: linear-gradient(
                        90deg,
                        var(--color_fill_secondary) 25%,
                        var(--color_line_secondary) 50%,
                        var(--color_fill_secondary) 75%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 50%;
                "
            ></div>
            <div style="flex: 1">
                <div
                    style="
                        height: 20px;
                        width: 60%;
                        background: linear-gradient(
                            90deg,
                            var(--color_fill_secondary) 25%,
                            var(--color_line_secondary) 50%,
                            var(--color_fill_secondary) 75%
                        );
                        background-size: 200% 100%;
                        animation: shimmer 1.5s infinite;
                        border-radius: 4px;
                        margin-bottom: 10px;
                    "
                ></div>
                <div
                    style="
                        height: 14px;
                        width: 80%;
                        background: linear-gradient(
                            90deg,
                            var(--color_fill_secondary) 25%,
                            var(--color_line_secondary) 50%,
                            var(--color_fill_secondary) 75%
                        );
                        background-size: 200% 100%;
                        animation: shimmer 1.5s infinite;
                        border-radius: 4px;
                    "
                ></div>
            </div>
        </div>
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <div class="ss-c-placeholder ss-c-placeholder--list" style="max-width: 500px">
            <div
                style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 0;
                    border-bottom: 1px solid var(--color_line_secondary);
                "
            >
                <div
                    style="
                        width: 48px;
                        height: 48px;
                        flex-shrink: 0;
                        background: linear-gradient(
                            90deg,
                            var(--color_fill_secondary) 25%,
                            var(--color_line_secondary) 50%,
                            var(--color_fill_secondary) 75%
                        );
                        background-size: 200% 100%;
                        animation: shimmer 1.5s infinite;
                        border-radius: 8px;
                    "
                ></div>
                <div style="flex: 1">
                    <div
                        style="
                            height: 16px;
                            width: 70%;
                            background: linear-gradient(
                                90deg,
                                var(--color_fill_secondary) 25%,
                                var(--color_line_secondary) 50%,
                                var(--color_fill_secondary) 75%
                            );
                            background-size: 200% 100%;
                            animation: shimmer 1.5s infinite;
                            border-radius: 4px;
                            margin-bottom: 8px;
                        "
                    ></div>
                    <div
                        style="
                            height: 12px;
                            width: 40%;
                            background: linear-gradient(
                                90deg,
                                var(--color_fill_secondary) 25%,
                                var(--color_line_secondary) 50%,
                                var(--color_fill_secondary) 75%
                            );
                            background-size: 200% 100%;
                            animation: shimmer 1.5s infinite;
                            border-radius: 4px;
                        "
                    ></div>
                </div>
            </div>
            <div
                style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 0;
                    border-bottom: 1px solid var(--color_line_secondary);
                "
            >
                <div
                    style="
                        width: 48px;
                        height: 48px;
                        flex-shrink: 0;
                        background: linear-gradient(
                            90deg,
                            var(--color_fill_secondary) 25%,
                            var(--color_line_secondary) 50%,
                            var(--color_fill_secondary) 75%
                        );
                        background-size: 200% 100%;
                        animation: shimmer 1.5s infinite;
                        border-radius: 8px;
                    "
                ></div>
                <div style="flex: 1">
                    <div
                        style="
                            height: 16px;
                            width: 55%;
                            background: linear-gradient(
                                90deg,
                                var(--color_fill_secondary) 25%,
                                var(--color_line_secondary) 50%,
                                var(--color_fill_secondary) 75%
                            );
                            background-size: 200% 100%;
                            animation: shimmer 1.5s infinite;
                            border-radius: 4px;
                            margin-bottom: 8px;
                        "
                    ></div>
                    <div
                        style="
                            height: 12px;
                            width: 35%;
                            background: linear-gradient(
                                90deg,
                                var(--color_fill_secondary) 25%,
                                var(--color_line_secondary) 50%,
                                var(--color_fill_secondary) 75%
                            );
                            background-size: 200% 100%;
                            animation: shimmer 1.5s infinite;
                            border-radius: 4px;
                        "
                    ></div>
                </div>
            </div>
            <div
                style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 0;
                "
            >
                <div
                    style="
                        width: 48px;
                        height: 48px;
                        flex-shrink: 0;
                        background: linear-gradient(
                            90deg,
                            var(--color_fill_secondary) 25%,
                            var(--color_line_secondary) 50%,
                            var(--color_fill_secondary) 75%
                        );
                        background-size: 200% 100%;
                        animation: shimmer 1.5s infinite;
                        border-radius: 8px;
                    "
                ></div>
                <div style="flex: 1">
                    <div
                        style="
                            height: 16px;
                            width: 65%;
                            background: linear-gradient(
                                90deg,
                                var(--color_fill_secondary) 25%,
                                var(--color_line_secondary) 50%,
                                var(--color_fill_secondary) 75%
                            );
                            background-size: 200% 100%;
                            animation: shimmer 1.5s infinite;
                            border-radius: 4px;
                            margin-bottom: 8px;
                        "
                    ></div>
                    <div
                        style="
                            height: 12px;
                            width: 45%;
                            background: linear-gradient(
                                90deg,
                                var(--color_fill_secondary) 25%,
                                var(--color_line_secondary) 50%,
                                var(--color_fill_secondary) 75%
                            );
                            background-size: 200% 100%;
                            animation: shimmer 1.5s infinite;
                            border-radius: 4px;
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
            class="ss-c-placeholder ss-c-placeholder--image"
            style="display: flex; gap: 16px; flex-wrap: wrap"
        >
            <div
                style="
                    width: 150px;
                    aspect-ratio: 1;
                    background: linear-gradient(
                        90deg,
                        var(--color_fill_secondary) 25%,
                        var(--color_line_secondary) 50%,
                        var(--color_fill_secondary) 75%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                "
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    opacity="0.3"
                >
                    <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                    ></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
            </div>
            <div
                style="
                    width: 200px;
                    aspect-ratio: 16/9;
                    background: linear-gradient(
                        90deg,
                        var(--color_fill_secondary) 25%,
                        var(--color_line_secondary) 50%,
                        var(--color_fill_secondary) 75%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                "
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    opacity="0.3"
                >
                    <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                    ></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
            </div>
        </div>
    `,
};

export const SectionTitle6: Story = {
    render: () => html`
        <div class="ss-c-placeholder ss-c-placeholder--pulse" style="max-width: 400px">
            <div style="display: flex; gap: 16px; margin-bottom: 16px">
                <div
                    style="
                        width: 80px;
                        height: 80px;
                        flex-shrink: 0;
                        background: var(--color_fill_secondary);
                        border-radius: 8px;
                        animation: pulse 2s ease-in-out infinite;
                    "
                ></div>
                <div style="flex: 1">
                    <div
                        style="
                            height: 20px;
                            width: 80%;
                            background: var(--color_fill_secondary);
                            border-radius: 4px;
                            margin-bottom: 10px;
                            animation: pulse 2s ease-in-out infinite;
                        "
                    ></div>
                    <div
                        style="
                            height: 14px;
                            width: 60%;
                            background: var(--color_fill_secondary);
                            border-radius: 4px;
                            animation: pulse 2s ease-in-out infinite;
                        "
                    ></div>
                </div>
            </div>
            <div
                style="
                    height: 14px;
                    width: 100%;
                    background: var(--color_fill_secondary);
                    border-radius: 4px;
                    margin-bottom: 8px;
                    animation: pulse 2s ease-in-out infinite;
                "
            ></div>
            <div
                style="
                    height: 14px;
                    width: 90%;
                    background: var(--color_fill_secondary);
                    border-radius: 4px;
                    animation: pulse 2s ease-in-out infinite;
                "
            ></div>
        </div>
        <style>
            @keyframes pulse {
                0%,
                100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.5;
                }
            }
        </style>
    `,
};

export const SectionTitle7: Story = {
    render: () => html`
        <div
            class="ss-c-placeholder ss-c-placeholder--table"
            style="
                max-width: 600px;
                border: 1px solid var(--color_line_secondary);
                border-radius: 8px;
                overflow: hidden;
            "
        >
            <div
                style="
                    display: flex;
                    gap: 16px;
                    padding: 12px 16px;
                    background: var(--color_fill_secondary);
                "
            >
                <div
                    style="
                        flex: 2;
                        height: 16px;
                        background: linear-gradient(
                            90deg,
                            var(--color_line_secondary) 25%,
                            white 50%,
                            var(--color_line_secondary) 75%
                        );
                        background-size: 200% 100%;
                        animation: shimmer 1.5s infinite;
                        border-radius: 4px;
                    "
                ></div>
                <div
                    style="
                        flex: 1;
                        height: 16px;
                        background: linear-gradient(
                            90deg,
                            var(--color_line_secondary) 25%,
                            white 50%,
                            var(--color_line_secondary) 75%
                        );
                        background-size: 200% 100%;
                        animation: shimmer 1.5s infinite;
                        border-radius: 4px;
                    "
                ></div>
                <div
                    style="
                        flex: 1;
                        height: 16px;
                        background: linear-gradient(
                            90deg,
                            var(--color_line_secondary) 25%,
                            white 50%,
                            var(--color_line_secondary) 75%
                        );
                        background-size: 200% 100%;
                        animation: shimmer 1.5s infinite;
                        border-radius: 4px;
                    "
                ></div>
            </div>
            <div
                style="
                    display: flex;
                    gap: 16px;
                    padding: 16px;
                    border-bottom: 1px solid var(--color_line_secondary);
                "
            >
                <div
                    style="
                        flex: 2;
                        height: 14px;
                        background: linear-gradient(
                            90deg,
                            var(--color_fill_secondary) 25%,
                            var(--color_line_secondary) 50%,
                            var(--color_fill_secondary) 75%
                        );
                        background-size: 200% 100%;
                        animation: shimmer 1.5s infinite;
                        border-radius: 4px;
                    "
                ></div>
                <div
                    style="
                        flex: 1;
                        height: 14px;
                        background: linear-gradient(
                            90deg,
                            var(--color_fill_secondary) 25%,
                            var(--color_line_secondary) 50%,
                            var(--color_fill_secondary) 75%
                        );
                        background-size: 200% 100%;
                        animation: shimmer 1.5s infinite;
                        border-radius: 4px;
                    "
                ></div>
                <div
                    style="
                        flex: 1;
                        height: 14px;
                        background: linear-gradient(
                            90deg,
                            var(--color_fill_secondary) 25%,
                            var(--color_line_secondary) 50%,
                            var(--color_fill_secondary) 75%
                        );
                        background-size: 200% 100%;
                        animation: shimmer 1.5s infinite;
                        border-radius: 4px;
                    "
                ></div>
            </div>
            <div
                style="
                    display: flex;
                    gap: 16px;
                    padding: 16px;
                    border-bottom: 1px solid var(--color_line_secondary);
                "
            >
                <div
                    style="
                        flex: 2;
                        height: 14px;
                        background: linear-gradient(
                            90deg,
                            var(--color_fill_secondary) 25%,
                            var(--color_line_secondary) 50%,
                            var(--color_fill_secondary) 75%
                        );
                        background-size: 200% 100%;
                        animation: shimmer 1.5s infinite;
                        border-radius: 4px;
                    "
                ></div>
                <div
                    style="
                        flex: 1;
                        height: 14px;
                        background: linear-gradient(
                            90deg,
                            var(--color_fill_secondary) 25%,
                            var(--color_line_secondary) 50%,
                            var(--color_fill_secondary) 75%
                        );
                        background-size: 200% 100%;
                        animation: shimmer 1.5s infinite;
                        border-radius: 4px;
                    "
                ></div>
                <div
                    style="
                        flex: 1;
                        height: 14px;
                        background: linear-gradient(
                            90deg,
                            var(--color_fill_secondary) 25%,
                            var(--color_line_secondary) 50%,
                            var(--color_fill_secondary) 75%
                        );
                        background-size: 200% 100%;
                        animation: shimmer 1.5s infinite;
                        border-radius: 4px;
                    "
                ></div>
            </div>
            <div style="display: flex; gap: 16px; padding: 16px">
                <div
                    style="
                        flex: 2;
                        height: 14px;
                        background: linear-gradient(
                            90deg,
                            var(--color_fill_secondary) 25%,
                            var(--color_line_secondary) 50%,
                            var(--color_fill_secondary) 75%
                        );
                        background-size: 200% 100%;
                        animation: shimmer 1.5s infinite;
                        border-radius: 4px;
                    "
                ></div>
                <div
                    style="
                        flex: 1;
                        height: 14px;
                        background: linear-gradient(
                            90deg,
                            var(--color_fill_secondary) 25%,
                            var(--color_line_secondary) 50%,
                            var(--color_fill_secondary) 75%
                        );
                        background-size: 200% 100%;
                        animation: shimmer 1.5s infinite;
                        border-radius: 4px;
                    "
                ></div>
                <div
                    style="
                        flex: 1;
                        height: 14px;
                        background: linear-gradient(
                            90deg,
                            var(--color_fill_secondary) 25%,
                            var(--color_line_secondary) 50%,
                            var(--color_fill_secondary) 75%
                        );
                        background-size: 200% 100%;
                        animation: shimmer 1.5s infinite;
                        border-radius: 4px;
                    "
                ></div>
            </div>
        </div>
    `,
};
