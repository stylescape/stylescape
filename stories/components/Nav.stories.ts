// ==========================================================================
// Stylescape | Storybook — Nav
// ==========================================================================
// Auto-generated from src/jinja/31-modules/nav.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Nav",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const HorizontalNav: Story = {
    render: () => html`
        <nav class="ss-c-nav" aria-label="Main navigation">
            <ul class="ss-c-nav__list">
                <li class="ss-c-nav__item ss-c-nav__item--active">
                    <a href="#" class="ss-c-nav__link">Home</a>
                </li>
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link">About</a>
                </li>
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link">Services</a>
                </li>
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link">Contact</a>
                </li>
            </ul>
        </nav>
    `,
};

export const VerticalNav: Story = {
    render: () => html`
        <nav class="ss-c-nav ss-c-nav--vertical" aria-label="Sidebar navigation">
            <ul class="ss-c-nav__list">
                <li class="ss-c-nav__item ss-c-nav__item--active">
                    <a href="#" class="ss-c-nav__link">Dashboard</a>
                </li>
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link">Analytics</a>
                </li>
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link">Reports</a>
                </li>
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link">Settings</a>
                </li>
            </ul>
        </nav>
    `,
};

export const HorizontalPills: Story = {
    render: () => html`
        <nav class="ss-c-nav ss-c-nav--pills" aria-label="Pill navigation">
            <ul class="ss-c-nav__list">
                <li class="ss-c-nav__item ss-c-nav__item--active">
                    <a href="#" class="ss-c-nav__link">Active</a>
                </li>
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link">Link</a>
                </li>
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link">Link</a>
                </li>
                <li class="ss-c-nav__item ss-c-nav__item--disabled">
                    <a
                        href="#"
                        class="ss-c-nav__link"
                        tabindex="-1"
                        aria-disabled="true"
                    >
                        Disabled
                    </a>
                </li>
            </ul>
        </nav>
    `,
};

export const FillPills: Story = {
    render: () => html`
        <nav class="ss-c-nav ss-c-nav--pills ss-c-nav--fill" aria-label="Full width pills">
            <ul class="ss-c-nav__list">
                <li class="ss-c-nav__item ss-c-nav__item--active">
                    <a href="#" class="ss-c-nav__link">Active</a>
                </li>
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link">Much Longer Link</a>
                </li>
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link">Link</a>
                </li>
            </ul>
        </nav>
    `,
};

export const BasicTabs: Story = {
    render: () => html`
        <nav class="ss-c-nav ss-c-nav--tabs" aria-label="Tab navigation">
            <ul class="ss-c-nav__list" role="tablist">
                <li class="ss-c-nav__item" role="presentation">
                    <a
                        href="#"
                        class="ss-c-nav__link ss-c-nav__link--active"
                        role="tab"
                        aria-selected="true"
                    >
                        Active
                    </a>
                </li>
                <li class="ss-c-nav__item" role="presentation">
                    <a
                        href="#"
                        class="ss-c-nav__link"
                        role="tab"
                        aria-selected="false"
                    >
                        Tab 2
                    </a>
                </li>
                <li class="ss-c-nav__item" role="presentation">
                    <a
                        href="#"
                        class="ss-c-nav__link"
                        role="tab"
                        aria-selected="false"
                    >
                        Tab 3
                    </a>
                </li>
            </ul>
        </nav>
    `,
};

export const UnderlineTabs: Story = {
    render: () => html`
        <nav class="ss-c-nav ss-c-nav--tabs ss-c-nav--underline" aria-label="Underline tabs">
            <ul class="ss-c-nav__list" role="tablist">
                <li class="ss-c-nav__item" role="presentation">
                    <a href="#" class="ss-c-nav__link ss-c-nav__link--active" role="tab">
                        Active
                    </a>
                </li>
                <li class="ss-c-nav__item" role="presentation">
                    <a href="#" class="ss-c-nav__link" role="tab">Tab 2</a>
                </li>
                <li class="ss-c-nav__item" role="presentation">
                    <a href="#" class="ss-c-nav__link" role="tab">Tab 3</a>
                </li>
            </ul>
        </nav>
    `,
};

export const IconNavigation: Story = {
    render: () => html`
        <nav class="ss-c-nav ss-c-nav--vertical" aria-label="Icon navigation">
            <ul class="ss-c-nav__list">
                <li class="ss-c-nav__item ss-c-nav__item--active">
                    <a href="#" class="ss-c-nav__link">
                        <span class="ss-c-nav__icon">⌂</span>
                        <span class="ss-c-nav__text">Home</span>
                    </a>
                </li>
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link">
                        <span class="ss-c-nav__icon">☻</span>
                        <span class="ss-c-nav__text">Profile</span>
                    </a>
                </li>
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link">
                        <span class="ss-c-nav__icon">⚙</span>
                        <span class="ss-c-nav__text">Settings</span>
                    </a>
                </li>
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link">
                        <span class="ss-c-nav__icon">✉</span>
                        <span class="ss-c-nav__text">Messages</span>
                        <span class="ss-c-nav__badge">3</span>
                    </a>
                </li>
            </ul>
        </nav>
    `,
};

export const IconOnlyNavigation: Story = {
    render: () => html`
        <nav class="ss-c-nav ss-c-nav--icons" aria-label="Icon-only navigation">
            <ul class="ss-c-nav__list">
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link" aria-label="Home">⌂</a>
                </li>
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link" aria-label="Search">⌕</a>
                </li>
                <li class="ss-c-nav__item ss-c-nav__item--active">
                    <a href="#" class="ss-c-nav__link" aria-label="Notifications">
                        ♪
                    </a>
                </li>
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link" aria-label="Profile">☻</a>
                </li>
            </ul>
        </nav>
    `,
};

export const CollapsibleSubmenu: Story = {
    render: () => html`
        <nav
            class="ss-c-nav ss-c-nav--vertical ss-c-nav--nested"
            aria-label="Nested navigation"
        >
            <ul class="ss-c-nav__list">
                <li class="ss-c-nav__item ss-c-nav__item--active">
                    <a href="#" class="ss-c-nav__link">Dashboard</a>
                </li>
                <li class="ss-c-nav__item ss-c-nav__item--expandable">
                    <a href="#" class="ss-c-nav__link">
                        <span>Products</span>
                        <span class="ss-c-nav__arrow">▼</span>
                    </a>
                    <ul class="ss-c-nav__submenu">
                        <li class="ss-c-nav__item">
                            <a href="#" class="ss-c-nav__link">All Products</a>
                        </li>
                        <li class="ss-c-nav__item">
                            <a href="#" class="ss-c-nav__link">Categories</a>
                        </li>
                        <li class="ss-c-nav__item">
                            <a href="#" class="ss-c-nav__link">Inventory</a>
                        </li>
                    </ul>
                </li>
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link">Orders</a>
                </li>
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link">Customers</a>
                </li>
            </ul>
        </nav>
    `,
};

export const GroupedNavigation: Story = {
    render: () => html`
        <nav class="ss-c-nav ss-c-nav--vertical" aria-label="Grouped navigation">
            <span class="ss-c-nav__heading">Main</span>
            <ul class="ss-c-nav__list">
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link">Dashboard</a>
                </li>
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link">Analytics</a>
                </li>
            </ul>
            <hr class="ss-c-nav__divider" />
            <span class="ss-c-nav__heading">Account</span>
            <ul class="ss-c-nav__list">
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link">Profile</a>
                </li>
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link">Settings</a>
                </li>
                <li class="ss-c-nav__item">
                    <a href="#" class="ss-c-nav__link">Logout</a>
                </li>
            </ul>
        </nav>
    `,
};
