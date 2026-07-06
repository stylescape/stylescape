// ==========================================================================
// Stylescape | Storybook — Select
// ==========================================================================
// Auto-generated from src/jinja/31-modules/select.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Select",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div style="max-width: 300px">
            <label
                style="display: block; margin-bottom: 8px; font-weight: 500"
            >
                Country
            </label>
            <select
                class="ss-c-select"
                style="
                    width: 100%;
                    padding: 12px 16px;
                    border: 1px solid var(--color_line_secondary);
                    border-radius: 8px;
                    font-family: inherit;
                    font-size: 14px;
                    background: white;
                    cursor: pointer;
                    appearance: none;
                    background-image: url(&quot;data:image/svg+xml;charset=US-ASCII,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22><path fill=%22%23666%22 d=%22M6 9L1 4h10z%22/></svg>&quot;);
                    background-repeat: no-repeat;
                    background-position: right 12px center;
                "
            >
                <option value="">Select a country</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="de">Germany</option>
                <option value="fr">France</option>
                <option value="jp">Japan</option>
            </select>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div
            style="
                display: flex;
                flex-direction: column;
                gap: 16px;
                max-width: 300px;
            "
        >
            <!-- Small -->
            <div>
                <label
                    style="display: block; margin-bottom: 6px; font-size: 12px"
                >
                    Small
                </label>
                <select
                    class="ss-c-select ss-c-select--small"
                    style="
                        width: 100%;
                        padding: 8px 12px;
                        border: 1px solid var(--color_line_secondary);
                        border-radius: 6px;
                        font-size: 13px;
                    "
                >
                    <option>Option 1</option>
                    <option>Option 2</option>
                </select>
            </div>
            <!-- Medium -->
            <div>
                <label
                    style="display: block; margin-bottom: 6px; font-size: 14px"
                >
                    Medium
                </label>
                <select
                    class="ss-c-select"
                    style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 1px solid var(--color_line_secondary);
                        border-radius: 8px;
                        font-size: 14px;
                    "
                >
                    <option>Option 1</option>
                    <option>Option 2</option>
                </select>
            </div>
            <!-- Large -->
            <div>
                <label
                    style="display: block; margin-bottom: 6px; font-size: 15px"
                >
                    Large
                </label>
                <select
                    class="ss-c-select ss-c-select--large"
                    style="
                        width: 100%;
                        padding: 16px 20px;
                        border: 1px solid var(--color_line_secondary);
                        border-radius: 10px;
                        font-size: 16px;
                    "
                >
                    <option>Option 1</option>
                    <option>Option 2</option>
                </select>
            </div>
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div style="max-width: 300px">
            <label
                style="display: block; margin-bottom: 8px; font-weight: 500"
            >
                Programming Language
            </label>
            <select
                class="ss-c-select"
                style="
                    width: 100%;
                    padding: 12px 16px;
                    border: 1px solid var(--color_line_secondary);
                    border-radius: 8px;
                    font-size: 14px;
                "
            >
                <option value="">Choose a language</option>
                <optgroup label="Frontend">
                    <option value="js">JavaScript</option>
                    <option value="ts">TypeScript</option>
                    <option value="html">HTML/CSS</option>
                </optgroup>
                <optgroup label="Backend">
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                </optgroup>
                <optgroup label="Mobile">
                    <option value="swift">Swift</option>
                    <option value="kotlin">Kotlin</option>
                </optgroup>
            </select>
        </div>
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <div
            style="
                display: flex;
                flex-direction: column;
                gap: 16px;
                max-width: 300px;
            "
        >
            <!-- Disabled -->
            <div>
                <label
                    style="display: block; margin-bottom: 6px; opacity: 0.5"
                >
                    Disabled
                </label>
                <select
                    class="ss-c-select disabled"
                    disabled
                    style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 1px solid var(--color_line_secondary);
                        border-radius: 8px;
                        font-size: 14px;
                        opacity: 0.6;
                        cursor: not-allowed;
                        background: var(--color_fill_secondary);
                    "
                >
                    <option>Disabled option</option>
                </select>
            </div>
            <!-- Error -->
            <div>
                <label style="display: block; margin-bottom: 6px">Error</label>
                <select
                    class="ss-c-select ss-c-error"
                    style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 2px solid var(--color_state_error);
                        border-radius: 8px;
                        font-size: 14px;
                    "
                >
                    <option value="">Please select an option</option>
                </select>
                <span
                    style="
                        display: block;
                        margin-top: 6px;
                        font-size: 13px;
                        color: var(--color_state_error);
                    "
                >
                    This field is required
                </span>
            </div>
            <!-- Success -->
            <div>
                <label style="display: block; margin-bottom: 6px">
                    Success
                </label>
                <select
                    class="ss-c-select ss-c-success"
                    style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 2px solid var(--color_state_success);
                        border-radius: 8px;
                        font-size: 14px;
                    "
                >
                    <option value="valid">Valid selection</option>
                </select>
                <span
                    style="
                        display: block;
                        margin-top: 6px;
                        font-size: 13px;
                        color: var(--color_state_success);
                    "
                >
                    ✓ Selection confirmed
                </span>
            </div>
        </div>
    `,
};

export const SectionTitle5: Story = {
    render: () => html`
        <div style="max-width: 300px">
            <label
                style="display: block; margin-bottom: 8px; font-weight: 500"
            >
                Select Skills (multiple)
            </label>
            <select
                class="ss-c-select ss-c-select--multiple"
                multiple
                size="5"
                style="
                    width: 100%;
                    padding: 8px;
                    border: 1px solid var(--color_line_secondary);
                    border-radius: 8px;
                    font-size: 14px;
                "
            >
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="js">JavaScript</option>
                <option value="react">React</option>
                <option value="vue">Vue</option>
                <option value="angular">Angular</option>
                <option value="node">Node.js</option>
            </select>
            <span
                style="
                    display: block;
                    margin-top: 6px;
                    font-size: 12px;
                    opacity: 0.7;
                "
            >
                Hold Ctrl/Cmd to select multiple
            </span>
        </div>
    `,
};

export const SectionTitle6: Story = {
    render: () => html`
        <div style="max-width: 300px">
            <label
                style="display: block; margin-bottom: 8px; font-weight: 500"
            >
                Sort By
            </label>
            <div style="position: relative">
                <span
                    style="
                        position: absolute;
                        left: 12px;
                        top: 50%;
                        transform: translateY(-50%);
                        font-size: 16px;
                    "
                >
                    ▼
                </span>
                <select
                    class="ss-c-select"
                    style="
                        width: 100%;
                        padding: 12px 16px 12px 40px;
                        border: 1px solid var(--color_line_secondary);
                        border-radius: 8px;
                        font-size: 14px;
                    "
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="az">A to Z</option>
                    <option value="za">Z to A</option>
                    <option value="popular">Most Popular</option>
                </select>
            </div>
        </div>
    `,
};
