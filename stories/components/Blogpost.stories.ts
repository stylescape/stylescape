// ==========================================================================
// Stylescape | Storybook — Blogpost
// ==========================================================================
// Auto-generated from src/jinja/31-modules/blogpost.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Blogpost",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <article class="ss-c-blogpost" style="max-width: 800px">
            <header class="ss-c-blogpost--header">
                <span
                    class="ss-c-chip"
                    style="
                        display: inline-block;
                        padding: 4px 12px;
                        background: var(--color_fill_secondary);
                        border-radius: 16px;
                        font-size: 12px;
                        margin-bottom: 16px;
                    "
                >
                    Technology
                </span>
                <h2 style="margin: 0 0 12px">
                    Getting Started with CSS Custom Properties
                </h2>
                <div
                    class="ss-c-blogpost--meta"
                    style="
                        display: flex;
                        gap: 16px;
                        opacity: 0.7;
                        font-size: 14px;
                    "
                >
                    <span>By Jane Doe</span>
                    <span>•</span>
                    <time datetime="2024-01-15">January 15, 2024</time>
                    <span>•</span>
                    <span>5 min read</span>
                </div>
            </header>
            <div
                class="ss-c-blogpost--body"
                style="margin-top: 24px; line-height: 1.7"
            >
                <p>
                    Custom properties (sometimes referred to as CSS variables)
                    are entities defined by CSS authors that contain specific
                    values to be reused throughout a document.
                </p>
                <p>
                    They are set using custom property notation and are
                    accessed using the var() function.
                </p>
            </div>
        </article>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <article class="ss-c-blogpost" style="max-width: 800px">
            <figure
                class="ss-c-blogpost--featured-image"
                style="margin: 0 0 24px; border-radius: 12px; overflow: hidden"
            >
                <img
                    src="https://via.placeholder.com/800x400"
                    alt="Featured image"
                    style="width: 100%; display: block"
                />
                <figcaption
                    style="
                        padding: 12px;
                        background: var(--color_fill_secondary);
                        font-size: 14px;
                        opacity: 0.8;
                    "
                >
                    Photo by John Smith on Unsplash
                </figcaption>
            </figure>
            <header class="ss-c-blogpost--header">
                <h2 style="margin: 0 0 12px">
                    Building Modern Web Applications
                </h2>
                <div
                    class="ss-c-blogpost--meta"
                    style="
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        font-size: 14px;
                    "
                >
                    <img
                        src="https://via.placeholder.com/40"
                        alt="Author"
                        style="width: 40px; height: 40px; border-radius: 50%"
                    />
                    <div>
                        <div style="font-weight: 600">Alex Johnson</div>
                        <time datetime="2024-01-10" style="opacity: 0.7">
                            January 10, 2024
                        </time>
                    </div>
                </div>
            </header>
            <div
                class="ss-c-blogpost--body"
                style="margin-top: 24px; line-height: 1.7"
            >
                <p>
                    Modern web development has evolved significantly over the
                    past decade. From simple static pages to complex
                    single-page applications, the landscape continues to
                    change.
                </p>
            </div>
        </article>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div style="display: grid; gap: 24px; max-width: 800px">
            <article
                class="ss-c-blogpost ss-c-card"
                style="display: flex; gap: 20px; padding: 20px"
            >
                <img
                    src="https://via.placeholder.com/200x150"
                    alt="Thumbnail"
                    style="
                        width: 200px;
                        height: 150px;
                        object-fit: cover;
                        border-radius: 8px;
                    "
                />
                <div style="flex: 1">
                    <span
                        style="
                            font-size: 12px;
                            text-transform: uppercase;
                            opacity: 0.6;
                        "
                    >
                        Design
                    </span>
                    <h3 style="margin: 8px 0">
                        Introduction to Design Systems
                    </h3>
                    <p style="opacity: 0.8; font-size: 14px; margin: 0 0 12px">
                        Learn how to build scalable and consistent design
                        systems...
                    </p>
                    <div style="font-size: 13px; opacity: 0.6">
                        March 5, 2024 · 8 min read
                    </div>
                </div>
            </article>
            <article
                class="ss-c-blogpost ss-c-card"
                style="display: flex; gap: 20px; padding: 20px"
            >
                <img
                    src="https://via.placeholder.com/200x150"
                    alt="Thumbnail"
                    style="
                        width: 200px;
                        height: 150px;
                        object-fit: cover;
                        border-radius: 8px;
                    "
                />
                <div style="flex: 1">
                    <span
                        style="
                            font-size: 12px;
                            text-transform: uppercase;
                            opacity: 0.6;
                        "
                    >
                        Development
                    </span>
                    <h3 style="margin: 8px 0">React Hooks Deep Dive</h3>
                    <p style="opacity: 0.8; font-size: 14px; margin: 0 0 12px">
                        Understanding the power of React hooks for state
                        management...
                    </p>
                    <div style="font-size: 13px; opacity: 0.6">
                        February 28, 2024 · 12 min read
                    </div>
                </div>
            </article>
        </div>
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <footer
            class="ss-c-blogpost--footer"
            style="
                max-width: 800px;
                padding-top: 24px;
                border-top: 1px solid var(--color_line_secondary);
            "
        >
            <div
                style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                "
            >
                <div class="ss-c-blogpost--tags" style="display: flex; gap: 8px">
                    <span
                        class="ss-c-chip"
                        style="
                            padding: 6px 14px;
                            background: var(--color_fill_secondary);
                            border-radius: 20px;
                            font-size: 13px;
                        "
                    >
                        #css
                    </span>
                    <span
                        class="ss-c-chip"
                        style="
                            padding: 6px 14px;
                            background: var(--color_fill_secondary);
                            border-radius: 20px;
                            font-size: 13px;
                        "
                    >
                        #webdev
                    </span>
                    <span
                        class="ss-c-chip"
                        style="
                            padding: 6px 14px;
                            background: var(--color_fill_secondary);
                            border-radius: 20px;
                            font-size: 13px;
                        "
                    >
                        #frontend
                    </span>
                </div>
                <div
                    class="ss-c-blogpost--share"
                    style="display: flex; gap: 12px; align-items: center"
                >
                    <span style="font-size: 14px; opacity: 0.7">Share:</span>
                    <button
                        style="
                            padding: 8px 12px;
                            border: none;
                            background: #1da1f2;
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                        "
                    >
                        Twitter
                    </button>
                    <button
                        style="
                            padding: 8px 12px;
                            border: none;
                            background: #0077b5;
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                        "
                    >
                        LinkedIn
                    </button>
                </div>
            </div>
            <div
                class="ss-c-blogpost--author-bio"
                style="
                    margin-top: 24px;
                    padding: 20px;
                    background: var(--color_fill_secondary);
                    border-radius: 12px;
                    display: flex;
                    gap: 16px;
                "
            >
                <img
                    src="https://via.placeholder.com/80"
                    alt="Author"
                    style="width: 80px; height: 80px; border-radius: 50%"
                />
                <div>
                    <h4 style="margin: 0 0 8px">About the Author</h4>
                    <p
                        style="
                            margin: 0;
                            opacity: 0.8;
                            font-size: 14px;
                            line-height: 1.6;
                        "
                    >
                        Jane is a senior developer with 10+ years of experience
                        in web technologies. She writes about CSS, JavaScript,
                        and web accessibility.
                    </p>
                </div>
            </div>
        </footer>
    `,
};
