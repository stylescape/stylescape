// ==========================================================================
// Stylescape | Storybook — Widget
// ==========================================================================
// Auto-generated from src/jinja/31-modules/widget.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Widget",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div
            class="ss-c-widget"
            style="
                background: white;
                border: 1px solid var(--color_line_secondary);
                border-radius: 12px;
                overflow: hidden;
                max-width: 350px;
            "
        >
            <div
                class="ss-c-widget__header"
                style="
                    padding: 16px 20px;
                    border-bottom: 1px solid var(--color_line_secondary);
                "
            >
                <h4 style="margin: 0; font-size: 16px">Widget Title</h4>
            </div>
            <div class="ss-c-widget__body" style="padding: 20px">
                <p style="margin: 0; opacity: 0.8">
                    This is the widget content area where you can place any
                    content you need.
                </p>
            </div>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div
            style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 16px;
            "
        >
            <div
                class="ss-c-widget ss-c-widget--stats"
                style="
                    padding: 20px;
                    background: white;
                    border: 1px solid var(--color_line_secondary);
                    border-radius: 12px;
                "
            >
                <div
                    style="
                        font-size: 32px;
                        font-weight: 700;
                        color: var(--color_fill_primary);
                    "
                >
                    12,847
                </div>
                <div style="font-size: 14px; opacity: 0.6; margin-top: 4px">
                    Total Users
                </div>
                <div
                    style="
                        font-size: 13px;
                        color: var(--color_state_success);
                        margin-top: 8px;
                    "
                >
                    ↑ 12% from last month
                </div>
            </div>

            <div
                class="ss-c-widget ss-c-widget--stats"
                style="
                    padding: 20px;
                    background: white;
                    border: 1px solid var(--color_line_secondary);
                    border-radius: 12px;
                "
            >
                <div
                    style="
                        font-size: 32px;
                        font-weight: 700;
                        color: var(--color_state_success);
                    "
                >
                    $48,290
                </div>
                <div style="font-size: 14px; opacity: 0.6; margin-top: 4px">
                    Revenue
                </div>
                <div
                    style="
                        font-size: 13px;
                        color: var(--color_state_success);
                        margin-top: 8px;
                    "
                >
                    ↑ 8% from last month
                </div>
            </div>

            <div
                class="ss-c-widget ss-c-widget--stats"
                style="
                    padding: 20px;
                    background: white;
                    border: 1px solid var(--color_line_secondary);
                    border-radius: 12px;
                "
            >
                <div
                    style="
                        font-size: 32px;
                        font-weight: 700;
                        color: var(--color_state_warning);
                    "
                >
                    234
                </div>
                <div style="font-size: 14px; opacity: 0.6; margin-top: 4px">
                    Pending Orders
                </div>
                <div
                    style="
                        font-size: 13px;
                        color: var(--color_state_error);
                        margin-top: 8px;
                    "
                >
                    ↓ 3% from last month
                </div>
            </div>
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div
            class="ss-c-widget ss-c-widget--profile"
            style="
                background: white;
                border: 1px solid var(--color_line_secondary);
                border-radius: 16px;
                overflow: hidden;
                max-width: 300px;
            "
        >
            <div
                style="
                    height: 80px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                "
            ></div>
            <div
                style="
                    padding: 0 20px 20px;
                    margin-top: -40px;
                    text-align: center;
                "
            >
                <div
                    style="
                        width: 80px;
                        height: 80px;
                        margin: 0 auto 12px;
                        background: white;
                        border-radius: 50%;
                        border: 4px solid white;
                        overflow: hidden;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    "
                >
                    <img
                        src="https://picsum.photos/80"
                        alt="Profile"
                        style="width: 100%; height: 100%; object-fit: cover"
                    />
                </div>
                <h4 style="margin: 0 0 4px; font-size: 18px">Sarah Johnson</h4>
                <p style="margin: 0 0 16px; font-size: 14px; opacity: 0.6">
                    Product Designer
                </p>
                <div
                    style="
                        display: flex;
                        justify-content: center;
                        gap: 24px;
                        padding-top: 16px;
                        border-top: 1px solid var(--color_line_secondary);
                    "
                >
                    <div style="text-align: center">
                        <div style="font-weight: 700">248</div>
                        <div style="font-size: 12px; opacity: 0.6">Posts</div>
                    </div>
                    <div style="text-align: center">
                        <div style="font-weight: 700">12.4k</div>
                        <div style="font-size: 12px; opacity: 0.6">
                            Followers
                        </div>
                    </div>
                    <div style="text-align: center">
                        <div style="font-weight: 700">892</div>
                        <div style="font-size: 12px; opacity: 0.6">
                            Following
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <div
            class="ss-c-widget ss-c-widget--weather"
            style="
                padding: 24px;
                background: linear-gradient(135deg, #4facfe, #00f2fe);
                border-radius: 16px;
                color: white;
                max-width: 280px;
            "
        >
            <div
                style="
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 20px;
                "
            >
                <div>
                    <div style="font-size: 14px; opacity: 0.9">
                        San Francisco
                    </div>
                    <div style="font-size: 13px; opacity: 0.7">
                        Tuesday, Jan 21
                    </div>
                </div>
                <div style="font-size: 48px">☀</div>
            </div>
            <div style="font-size: 56px; font-weight: 300; line-height: 1">
                72°
            </div>
            <div style="font-size: 14px; opacity: 0.9; margin-top: 8px">
                Sunny
            </div>
            <div
                style="
                    display: flex;
                    gap: 16px;
                    margin-top: 20px;
                    padding-top: 16px;
                    border-top: 1px solid rgba(255, 255, 255, 0.2);
                    font-size: 13px;
                "
            >
                <span>◊ 45%</span>
                <span>≋ 8 mph</span>
                <span>▮ H: 78° L: 65°</span>
            </div>
        </div>
    `,
};

export const SectionTitle5: Story = {
    render: () => html`
        <div
            class="ss-c-widget ss-c-widget--list"
            style="
                background: white;
                border: 1px solid var(--color_line_secondary);
                border-radius: 12px;
                overflow: hidden;
                max-width: 350px;
            "
        >
            <div
                style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    border-bottom: 1px solid var(--color_line_secondary);
                "
            >
                <h4 style="margin: 0; font-size: 16px">Recent Activity</h4>
                <a
                    href="#"
                    style="
                        font-size: 14px;
                        color: var(--color_fill_primary);
                        text-decoration: none;
                    "
                >
                    View all
                </a>
            </div>
            <div style="max-height: 250px; overflow-y: auto">
                <div
                    style="
                        display: flex;
                        gap: 12px;
                        padding: 12px 20px;
                        border-bottom: 1px solid var(--color_line_secondary);
                    "
                >
                    <div
                        style="
                            width: 36px;
                            height: 36px;
                            background: var(--color_state_success);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-size: 14px;
                        "
                    >
                        ✓
                    </div>
                    <div style="flex: 1">
                        <div style="font-size: 14px">Payment received</div>
                        <div style="font-size: 12px; opacity: 0.6">
                            2 minutes ago
                        </div>
                    </div>
                </div>
                <div
                    style="
                        display: flex;
                        gap: 12px;
                        padding: 12px 20px;
                        border-bottom: 1px solid var(--color_line_secondary);
                    "
                >
                    <div
                        style="
                            width: 36px;
                            height: 36px;
                            background: var(--color_fill_primary);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-size: 14px;
                        "
                    >
                        ✉
                    </div>
                    <div style="flex: 1">
                        <div style="font-size: 14px">
                            New message from John
                        </div>
                        <div style="font-size: 12px; opacity: 0.6">
                            15 minutes ago
                        </div>
                    </div>
                </div>
                <div
                    style="
                        display: flex;
                        gap: 12px;
                        padding: 12px 20px;
                        border-bottom: 1px solid var(--color_line_secondary);
                    "
                >
                    <div
                        style="
                            width: 36px;
                            height: 36px;
                            background: var(--color_state_warning);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-size: 14px;
                        "
                    >
                        ⚠
                    </div>
                    <div style="flex: 1">
                        <div style="font-size: 14px">Server usage warning</div>
                        <div style="font-size: 12px; opacity: 0.6">
                            1 hour ago
                        </div>
                    </div>
                </div>
                <div style="display: flex; gap: 12px; padding: 12px 20px">
                    <div
                        style="
                            width: 36px;
                            height: 36px;
                            background: var(--color_fill_secondary);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                        "
                    >
                        ☻
                    </div>
                    <div style="flex: 1">
                        <div style="font-size: 14px">
                            New user registration
                        </div>
                        <div style="font-size: 12px; opacity: 0.6">
                            3 hours ago
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
};

export const SectionTitle6: Story = {
    render: () => html`
        <div
            class="ss-c-widget ss-c-widget--chart"
            style="
                background: white;
                border: 1px solid var(--color_line_secondary);
                border-radius: 12px;
                overflow: hidden;
                max-width: 400px;
            "
        >
            <div
                style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    border-bottom: 1px solid var(--color_line_secondary);
                "
            >
                <h4 style="margin: 0; font-size: 16px">Weekly Sales</h4>
                <select
                    style="
                        padding: 6px 12px;
                        border: 1px solid var(--color_line_secondary);
                        border-radius: 6px;
                        font-size: 13px;
                    "
                >
                    <option>This Week</option>
                    <option>Last Week</option>
                </select>
            </div>
            <div style="padding: 20px">
                <div
                    style="
                        display: flex;
                        align-items: flex-end;
                        gap: 12px;
                        height: 120px;
                        margin-bottom: 12px;
                    "
                >
                    <div
                        style="
                            flex: 1;
                            background: var(--color_fill_secondary);
                            height: 40%;
                            border-radius: 4px 4px 0 0;
                        "
                    ></div>
                    <div
                        style="
                            flex: 1;
                            background: var(--color_fill_secondary);
                            height: 65%;
                            border-radius: 4px 4px 0 0;
                        "
                    ></div>
                    <div
                        style="
                            flex: 1;
                            background: var(--color_fill_secondary);
                            height: 45%;
                            border-radius: 4px 4px 0 0;
                        "
                    ></div>
                    <div
                        style="
                            flex: 1;
                            background: var(--color_fill_primary);
                            height: 80%;
                            border-radius: 4px 4px 0 0;
                        "
                    ></div>
                    <div
                        style="
                            flex: 1;
                            background: var(--color_fill_secondary);
                            height: 55%;
                            border-radius: 4px 4px 0 0;
                        "
                    ></div>
                    <div
                        style="
                            flex: 1;
                            background: var(--color_fill_secondary);
                            height: 70%;
                            border-radius: 4px 4px 0 0;
                        "
                    ></div>
                    <div
                        style="
                            flex: 1;
                            background: var(--color_fill_secondary);
                            height: 50%;
                            border-radius: 4px 4px 0 0;
                        "
                    ></div>
                </div>
                <div
                    style="
                        display: flex;
                        justify-content: space-between;
                        font-size: 12px;
                        opacity: 0.6;
                    "
                >
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                </div>
            </div>
        </div>
    `,
};

export const SectionTitle7: Story = {
    render: () => html`
        <div style="display: flex; gap: 16px; flex-wrap: wrap">
            <div
                class="ss-c-widget ss-c-widget--squared"
                style="
                    padding: 20px;
                    background: var(--color_fill_secondary);
                    border-radius: 0;
                    min-width: 120px;
                    text-align: center;
                "
            >
                Squared
            </div>
            <div
                class="ss-c-widget"
                style="
                    padding: 20px;
                    background: var(--color_fill_secondary);
                    border-radius: 8px;
                    min-width: 120px;
                    text-align: center;
                "
            >
                Default
            </div>
            <div
                class="ss-c-widget ss-c-widget--rounded"
                style="
                    padding: 20px;
                    background: var(--color_fill_secondary);
                    border-radius: 16px;
                    min-width: 120px;
                    text-align: center;
                "
            >
                Rounded
            </div>
            <div
                class="ss-c-widget ss-c-widget--pill"
                style="
                    padding: 20px 32px;
                    background: var(--color_fill_secondary);
                    border-radius: 50px;
                    min-width: 120px;
                    text-align: center;
                "
            >
                Pill
            </div>
        </div>
    `,
};
