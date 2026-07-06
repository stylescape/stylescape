// ==========================================================================
// Stylescape | Storybook — Card
// ==========================================================================
// Auto-generated from src/jinja/31-modules/card.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Card",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div class="ss-c-card" style="max-width: 350px">
            <div class="ss-c-card--header">
                <h4 style="margin: 0">Card Header</h4>
            </div>
            <div class="ss-c-card--body">
                <p>
                    This is the card body content. Cards are flexible
                    containers for displaying related information.
                </p>
            </div>
            <div class="ss-c-card--footer">
                <button class="ss-c-button ss-c-button--small ss-c-button--primary">
                    Action
                </button>
            </div>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div class="ss-c-card" style="max-width: 350px; overflow: hidden">
            <img
                src="https://via.placeholder.com/350x200"
                alt="Card image"
                style="width: 100%; height: 200px; object-fit: cover"
            />
            <div class="ss-c-card--body">
                <h4 style="margin: 0 0 8px">Image Card</h4>
                <p style="margin: 0; opacity: 0.8">
                    A card with a featured image on top for visual content.
                </p>
            </div>
            <div class="ss-c-card--footer">
                <button class="ss-c-button ss-c-button--small">Learn More</button>
            </div>
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div
            class="ss-c-card ss-c-hover"
            style="
                max-width: 350px;
                transition:
                    transform 0.3s,
                    box-shadow 0.3s;
                cursor: pointer;
            "
        >
            <div class="ss-c-card--header">Interactive Card</div>
            <div class="ss-c-card--body">
                <p>
                    Hover over this card to see the lift effect. Perfect for
                    clickable content.
                </p>
            </div>
            <div class="ss-c-card--footer">
                <span style="opacity: 0.6">Click to explore →</span>
            </div>
        </div>
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <div
            style="
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 24px;
            "
        >
            <div class="ss-c-card">
                <div class="ss-c-card--body">
                    <h4 style="margin: 0 0 8px">▦ Analytics</h4>
                    <p style="margin: 0; opacity: 0.8">
                        Track your performance with detailed insights.
                    </p>
                </div>
            </div>
            <div class="ss-c-card">
                <div class="ss-c-card--body">
                    <h4 style="margin: 0 0 8px">⚿ Security</h4>
                    <p style="margin: 0; opacity: 0.8">
                        Enterprise-grade security for your data.
                    </p>
                </div>
            </div>
            <div class="ss-c-card">
                <div class="ss-c-card--body">
                    <h4 style="margin: 0 0 8px">➤ Performance</h4>
                    <p style="margin: 0; opacity: 0.8">
                        Lightning-fast load times guaranteed.
                    </p>
                </div>
            </div>
        </div>
    `,
};

export const SectionTitle5: Story = {
    render: () => html`
        <div
            class="ss-c-card"
            style="display: flex; flex-direction: row; max-width: 500px"
        >
            <img
                src="https://via.placeholder.com/150"
                alt="Card image"
                style="width: 150px; object-fit: cover"
            />
            <div style="display: flex; flex-direction: column; flex: 1">
                <div class="ss-c-card--body">
                    <h4 style="margin: 0 0 8px">Horizontal Layout</h4>
                    <p style="margin: 0; opacity: 0.8">
                        Image on the side for a different presentation.
                    </p>
                </div>
                <div class="ss-c-card--footer">
                    <button class="ss-c-button ss-c-button--small">View</button>
                </div>
            </div>
        </div>
    `,
};
