// ==========================================================================
// Stylescape | Storybook — Cookie
// ==========================================================================
// Auto-generated from src/jinja/31-modules/cookie.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Cookie",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div
            class="ss-c-cookie-banner"
            style="
                padding: 16px 24px;
                background: var(--color_fill_secondary);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 16px;
            "
        >
            <p style="margin: 0; flex: 1; min-width: 200px">
                We use cookies to enhance your browsing experience. By
                continuing to use this site, you agree to our use of cookies.
            </p>
            <div style="display: flex; gap: 8px">
                <button class="ss-c-button ss-c-button--secondary">Decline</button>
                <button class="ss-c-button ss-c-button--primary">Accept All</button>
            </div>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div
            class="ss-c-cookie-banner"
            style="
                padding: 20px 24px;
                background: var(--color_fill_secondary);
                border-radius: 12px;
            "
        >
            <div style="margin-bottom: 16px">
                <h4 style="margin: 0 0 8px">◉ Cookie Settings</h4>
                <p style="margin: 0; opacity: 0.8">
                    We use cookies to improve your experience. Customize your
                    preferences below.
                </p>
            </div>
            <div
                style="
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 16px;
                "
            >
                <label style="display: flex; align-items: center; gap: 8px">
                    <input type="checkbox" checked disabled />
                    <span>Essential Cookies</span>
                    <small style="opacity: 0.6">(Required)</small>
                </label>
                <label style="display: flex; align-items: center; gap: 8px">
                    <input type="checkbox" checked />
                    <span>Analytics Cookies</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px">
                    <input type="checkbox" />
                    <span>Marketing Cookies</span>
                </label>
            </div>
            <div style="display: flex; gap: 8px">
                <button class="ss-c-button ss-c-button--primary">
                    Save Preferences
                </button>
                <button class="ss-c-button ss-c-button--secondary">Accept All</button>
            </div>
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div
            class="ss-c-cookie-banner ss-c-cookie-banner--compact"
            style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 24px;
                background: var(--color_fill_secondary);
                border-radius: 8px;
            "
        >
            <span>
                ◉ This site uses cookies.
                <a href="#">Learn more</a>
            </span>
            <div style="display: flex; gap: 8px">
                <button class="ss-c-button ss-c-button--small ss-c-button--secondary">
                    Decline
                </button>
                <button class="ss-c-button ss-c-button--small ss-c-button--primary">
                    Accept
                </button>
            </div>
        </div>
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <div
            class="ss-c-cookie-modal"
            style="
                max-width: 500px;
                padding: 24px;
                background: var(--color_fill_primary);
                border: 1px solid var(--color_line_secondary);
                border-radius: 12px;
                box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
            "
        >
            <h3 style="margin: 0 0 16px">Privacy Preferences</h3>
            <p style="margin-bottom: 20px; opacity: 0.8">
                We may store or retrieve information on your browser, mostly in
                the form of cookies.
            </p>

            <div
                style="
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 20px;
                "
            >
                <div
                    style="
                        padding: 12px;
                        background: var(--color_fill_secondary);
                        border-radius: 8px;
                    "
                >
                    <div
                        style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        "
                    >
                        <strong>Strictly Necessary</strong>
                        <span class="ss-c-badge ss-c-badge--success">Always Active</span>
                    </div>
                    <small style="opacity: 0.7">
                        Required for the website to function properly.
                    </small>
                </div>

                <div
                    style="
                        padding: 12px;
                        background: var(--color_fill_secondary);
                        border-radius: 8px;
                    "
                >
                    <div
                        style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 4px;
                        "
                    >
                        <strong>Performance Cookies</strong>
                        <input type="checkbox" checked />
                    </div>
                    <small style="opacity: 0.7">
                        Help us understand how visitors interact with the
                        website.
                    </small>
                </div>

                <div
                    style="
                        padding: 12px;
                        background: var(--color_fill_secondary);
                        border-radius: 8px;
                    "
                >
                    <div
                        style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 4px;
                        "
                    >
                        <strong>Targeting Cookies</strong>
                        <input type="checkbox" />
                    </div>
                    <small style="opacity: 0.7">
                        Used to deliver personalized advertisements.
                    </small>
                </div>
            </div>

            <div style="display: flex; gap: 12px">
                <button class="ss-c-button ss-c-button--secondary" style="flex: 1">
                    Reject All
                </button>
                <button class="ss-c-button ss-c-button--primary" style="flex: 1">
                    Accept All
                </button>
            </div>
        </div>
    `,
};
