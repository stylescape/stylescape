// ==========================================================================
// Stylescape | Storybook — Map
// ==========================================================================
// Auto-generated from src/jinja/31-modules/map.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Map",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div
            id="map"
            style="
                width: 100%;
                height: 400px;
                background: #e0e0e0;
                position: relative;
            "
        >
            <div
                class="ss-c-map_canvas"
                style="width: 100%; height: 100%; position: relative"
            >
                <!-- Map tiles would be rendered here by a mapping library -->
                <div
                    style="
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                        color: #666;
                    "
                >
                    Map Canvas Placeholder
                </div>
            </div>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div
            class="ss-c-layer_control_base"
            style="padding: 16px; background: #f5f5f5; border-radius: 8px"
        >
            <h3>Base Layers</h3>
            <label>
                <span>
                    <input
                        type="radio"
                        name="base-layer"
                        value="streets"
                        checked
                    />
                    <span>Streets</span>
                </span>
            </label>
            <label>
                <span>
                    <input type="radio" name="base-layer" value="satellite" />
                    <span>Satellite</span>
                </span>
            </label>
            <label>
                <span>
                    <input type="radio" name="base-layer" value="terrain" />
                    <span>Terrain</span>
                </span>
            </label>
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div
            class="ss-c-layer_control_overlay"
            style="padding: 16px; background: #f5f5f5; border-radius: 8px"
        >
            <h3>Overlays</h3>
            <label>
                <span>
                    <input type="checkbox" name="overlay" value="traffic" />
                    <span>Traffic</span>
                </span>
            </label>
            <label>
                <span>
                    <input type="checkbox" name="overlay" value="transit" />
                    <span>Transit</span>
                </span>
            </label>
            <label>
                <span>
                    <input type="checkbox" name="overlay" value="bike" />
                    <span>Bike Lanes</span>
                </span>
            </label>
        </div>
    `,
};
