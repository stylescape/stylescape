// ==========================================================================
// Stylescape | Storybook — Toc
// ==========================================================================
// Auto-generated from src/jinja/31-modules/toc.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Toc",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <nav class="ss-c-toc" aria-label="Table of Contents">
            <h4
                class="ss-c-toc__title"
                style="
                    margin: 0 0 12px;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    opacity: 0.7;
                "
            >
                Contents
            </h4>
            <ul
                class="ss-c-toc__list"
                style="list-style: none; margin: 0; padding: 0"
            >
                <li class="ss-c-toc__item">
                    <a
                        href="#section-1"
                        class="ss-c-toc__link active"
                        style="
                            display: block;
                            padding: 8px 12px;
                            text-decoration: none;
                            border-left: 2px solid var(--color_fill_primary);
                            background: var(--color_fill_secondary);
                            border-radius: 0 4px 4px 0;
                        "
                    >
                        Introduction
                    </a>
                </li>
                <li class="ss-c-toc__item">
                    <a
                        href="#section-2"
                        class="ss-c-toc__link"
                        style="
                            display: block;
                            padding: 8px 12px;
                            text-decoration: none;
                            border-left: 2px solid transparent;
                        "
                    >
                        Getting Started
                    </a>
                </li>
                <li class="ss-c-toc__item">
                    <a
                        href="#section-3"
                        class="ss-c-toc__link"
                        style="
                            display: block;
                            padding: 8px 12px;
                            text-decoration: none;
                            border-left: 2px solid transparent;
                        "
                    >
                        Installation
                    </a>
                </li>
                <li class="ss-c-toc__item">
                    <a
                        href="#section-4"
                        class="ss-c-toc__link"
                        style="
                            display: block;
                            padding: 8px 12px;
                            text-decoration: none;
                            border-left: 2px solid transparent;
                        "
                    >
                        Configuration
                    </a>
                </li>
                <li class="ss-c-toc__item">
                    <a
                        href="#section-5"
                        class="ss-c-toc__link"
                        style="
                            display: block;
                            padding: 8px 12px;
                            text-decoration: none;
                            border-left: 2px solid transparent;
                        "
                    >
                        Usage Examples
                    </a>
                </li>
            </ul>
        </nav>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <nav class="ss-c-toc ss-c-toc--nested" aria-label="Table of Contents">
            <h4 style="margin: 0 0 16px; font-size: 16px; font-weight: 600">
                On This Page
            </h4>
            <ul
                style="
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    font-size: 14px;
                "
            >
                <li>
                    <a
                        href="#"
                        style="
                            display: block;
                            padding: 6px 0;
                            text-decoration: none;
                            font-weight: 500;
                        "
                    >
                        1. Introduction
                    </a>
                    <ul
                        style="list-style: none; margin: 0; padding-left: 16px"
                    >
                        <li>
                            <a
                                href="#"
                                style="
                                    display: block;
                                    padding: 4px 0;
                                    text-decoration: none;
                                    opacity: 0.8;
                                "
                            >
                                1.1 Overview
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                style="
                                    display: block;
                                    padding: 4px 0;
                                    text-decoration: none;
                                    opacity: 0.8;
                                "
                            >
                                1.2 Prerequisites
                            </a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a
                        href="#"
                        style="
                            display: block;
                            padding: 6px 0;
                            text-decoration: none;
                            font-weight: 500;
                        "
                    >
                        2. Installation
                    </a>
                    <ul
                        style="list-style: none; margin: 0; padding-left: 16px"
                    >
                        <li>
                            <a
                                href="#"
                                style="
                                    display: block;
                                    padding: 4px 0;
                                    text-decoration: none;
                                    opacity: 0.8;
                                "
                            >
                                2.1 npm
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                style="
                                    display: block;
                                    padding: 4px 0;
                                    text-decoration: none;
                                    opacity: 0.8;
                                "
                            >
                                2.2 CDN
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                style="
                                    display: block;
                                    padding: 4px 0;
                                    text-decoration: none;
                                    opacity: 0.8;
                                "
                            >
                                2.3 Manual Download
                            </a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a
                        href="#"
                        style="
                            display: block;
                            padding: 6px 0;
                            text-decoration: none;
                            font-weight: 500;
                        "
                    >
                        3. Configuration
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        style="
                            display: block;
                            padding: 6px 0;
                            text-decoration: none;
                            font-weight: 500;
                        "
                    >
                        4. API Reference
                    </a>
                </li>
            </ul>
        </nav>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <nav
            class="ss-c-toc ss-c-toc--numbered"
            aria-label="Table of Contents"
            style="max-width: 300px"
        >
            <ol
                style="
                    margin: 0;
                    padding: 0;
                    counter-reset: toc-counter;
                    list-style: none;
                "
            >
                <li style="counter-increment: toc-counter">
                    <a
                        href="#"
                        style="
                            display: flex;
                            align-items: baseline;
                            gap: 8px;
                            padding: 10px 0;
                            text-decoration: none;
                            border-bottom: 1px solid
                                var(--color_line_secondary);
                        "
                    >
                        <span
                            style="
                                font-weight: 600;
                                color: var(--color_fill_primary);
                            "
                        >
                            01
                        </span>
                        <span>Getting Started</span>
                    </a>
                </li>
                <li style="counter-increment: toc-counter">
                    <a
                        href="#"
                        style="
                            display: flex;
                            align-items: baseline;
                            gap: 8px;
                            padding: 10px 0;
                            text-decoration: none;
                            border-bottom: 1px solid
                                var(--color_line_secondary);
                        "
                    >
                        <span
                            style="
                                font-weight: 600;
                                color: var(--color_fill_primary);
                            "
                        >
                            02
                        </span>
                        <span>Core Concepts</span>
                    </a>
                </li>
                <li style="counter-increment: toc-counter">
                    <a
                        href="#"
                        style="
                            display: flex;
                            align-items: baseline;
                            gap: 8px;
                            padding: 10px 0;
                            text-decoration: none;
                            border-bottom: 1px solid
                                var(--color_line_secondary);
                        "
                    >
                        <span
                            style="
                                font-weight: 600;
                                color: var(--color_fill_primary);
                            "
                        >
                            03
                        </span>
                        <span>Components</span>
                    </a>
                </li>
                <li style="counter-increment: toc-counter">
                    <a
                        href="#"
                        style="
                            display: flex;
                            align-items: baseline;
                            gap: 8px;
                            padding: 10px 0;
                            text-decoration: none;
                            border-bottom: 1px solid
                                var(--color_line_secondary);
                        "
                    >
                        <span
                            style="
                                font-weight: 600;
                                color: var(--color_fill_primary);
                            "
                        >
                            04
                        </span>
                        <span>Customization</span>
                    </a>
                </li>
                <li style="counter-increment: toc-counter">
                    <a
                        href="#"
                        style="
                            display: flex;
                            align-items: baseline;
                            gap: 8px;
                            padding: 10px 0;
                            text-decoration: none;
                        "
                    >
                        <span
                            style="
                                font-weight: 600;
                                color: var(--color_fill_primary);
                            "
                        >
                            05
                        </span>
                        <span>Advanced Topics</span>
                    </a>
                </li>
            </ol>
        </nav>
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <div
            class="ss-c-toc-card"
            style="
                max-width: 400px;
                padding: 20px;
                background: var(--color_fill_secondary);
                border-radius: 12px;
            "
        >
            <div
                style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid var(--color_line_secondary);
                "
            >
                <span style="font-size: 24px">▤</span>
                <div>
                    <h4 style="margin: 0; font-size: 16px">
                        Table of Contents
                    </h4>
                    <p style="margin: 0; font-size: 13px; opacity: 0.7">
                        5 sections in this guide
                    </p>
                </div>
            </div>
            <ul style="list-style: none; margin: 0; padding: 0">
                <li>
                    <a
                        href="#"
                        style="
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            padding: 8px;
                            border-radius: 6px;
                            text-decoration: none;
                            transition: background 0.2s;
                        "
                    >
                        ▭ Introduction
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        style="
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            padding: 8px;
                            border-radius: 6px;
                            text-decoration: none;
                            transition: background 0.2s;
                        "
                    >
                        ⚙ Setup & Installation
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        style="
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            padding: 8px;
                            border-radius: 6px;
                            text-decoration: none;
                            transition: background 0.2s;
                        "
                    >
                        ◆ Components Overview
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        style="
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            padding: 8px;
                            border-radius: 6px;
                            text-decoration: none;
                            transition: background 0.2s;
                        "
                    >
                        ◐ Theming Guide
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        style="
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            padding: 8px;
                            border-radius: 6px;
                            text-decoration: none;
                            transition: background 0.2s;
                        "
                    >
                        ? FAQ
                    </a>
                </li>
            </ul>
        </div>
    `,
};

export const SectionTitle5: Story = {
    render: () => html`
        <aside
            class="ss-c-toc-floating"
            style="
                width: 220px;
                padding: 16px;
                background: white;
                border: 1px solid var(--color_line_secondary);
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            "
        >
            <h5
                style="
                    margin: 0 0 12px;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    opacity: 0.6;
                "
            >
                Quick Links
            </h5>
            <ul
                style="
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    font-size: 13px;
                "
            >
                <li>
                    <a
                        href="#"
                        class="active"
                        style="
                            display: block;
                            padding: 6px 10px;
                            margin: 2px 0;
                            text-decoration: none;
                            background: var(--color_fill_primary);
                            color: white;
                            border-radius: 4px;
                        "
                    >
                        Overview
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        style="
                            display: block;
                            padding: 6px 10px;
                            margin: 2px 0;
                            text-decoration: none;
                            border-radius: 4px;
                        "
                    >
                        Features
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        style="
                            display: block;
                            padding: 6px 10px;
                            margin: 2px 0;
                            text-decoration: none;
                            border-radius: 4px;
                        "
                    >
                        Installation
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        style="
                            display: block;
                            padding: 6px 10px;
                            margin: 2px 0;
                            text-decoration: none;
                            border-radius: 4px;
                        "
                    >
                        Examples
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        style="
                            display: block;
                            padding: 6px 10px;
                            margin: 2px 0;
                            text-decoration: none;
                            border-radius: 4px;
                        "
                    >
                        API Docs
                    </a>
                </li>
            </ul>
            <div
                style="
                    margin-top: 12px;
                    padding-top: 12px;
                    border-top: 1px solid var(--color_line_secondary);
                "
            >
                <a
                    href="#top"
                    style="
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        font-size: 12px;
                        text-decoration: none;
                        opacity: 0.7;
                    "
                >
                    ↑ Back to top
                </a>
            </div>
        </aside>
    `,
};

export const SectionTitle6: Story = {
    render: () => html`
        <div
            class="ss-c-toc-inline"
            style="
                padding: 16px;
                background: var(--color_fill_secondary);
                border-radius: 8px;
                border-left: 4px solid var(--color_fill_primary);
            "
        >
            <strong
                style="
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                "
            >
                Jump to:
            </strong>
            <span
                style="
                    display: inline-flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-left: 12px;
                "
            >
                <a
                    href="#"
                    style="
                        text-decoration: none;
                        padding: 4px 10px;
                        background: white;
                        border-radius: 4px;
                        font-size: 13px;
                    "
                >
                    Intro
                </a>
                <a
                    href="#"
                    style="
                        text-decoration: none;
                        padding: 4px 10px;
                        background: white;
                        border-radius: 4px;
                        font-size: 13px;
                    "
                >
                    Setup
                </a>
                <a
                    href="#"
                    style="
                        text-decoration: none;
                        padding: 4px 10px;
                        background: white;
                        border-radius: 4px;
                        font-size: 13px;
                    "
                >
                    Usage
                </a>
                <a
                    href="#"
                    style="
                        text-decoration: none;
                        padding: 4px 10px;
                        background: white;
                        border-radius: 4px;
                        font-size: 13px;
                    "
                >
                    Examples
                </a>
                <a
                    href="#"
                    style="
                        text-decoration: none;
                        padding: 4px 10px;
                        background: white;
                        border-radius: 4px;
                        font-size: 13px;
                    "
                >
                    FAQ
                </a>
            </span>
        </div>
    `,
};
