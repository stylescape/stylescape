// ==========================================================================
// Stylescape | Storybook — Hero
// ==========================================================================
// Auto-generated from src/jinja/31-modules/hero.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Hero",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <section
            class="ss-c-hero"
            style="
                min-height: 400px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 60px 24px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 16px;
            "
        >
            <div class="ss-c-hero__content" style="max-width: 600px">
                <h1
                    style="margin: 0 0 16px; font-size: 48px; font-weight: 700"
                >
                    Welcome to Stylescape
                </h1>
                <p style="margin: 0 0 32px; font-size: 18px; opacity: 0.9">
                    Build beautiful, responsive interfaces with our design
                    system.
                </p>
                <div
                    class="ss-c-hero__actions"
                    style="display: flex; gap: 16px; justify-content: center"
                >
                    <button
                        style="
                            padding: 14px 32px;
                            background: white;
                            color: #667eea;
                            border: none;
                            border-radius: 8px;
                            font-weight: 600;
                            cursor: pointer;
                        "
                    >
                        Get Started
                    </button>
                    <button
                        style="
                            padding: 14px 32px;
                            background: transparent;
                            color: white;
                            border: 2px solid white;
                            border-radius: 8px;
                            font-weight: 600;
                            cursor: pointer;
                        "
                    >
                        Learn More
                    </button>
                </div>
            </div>
        </section>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <section
            class="ss-c-hero ss-c-hero--split"
            style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                min-height: 500px;
                background: var(--color_fill_secondary);
                border-radius: 16px;
                overflow: hidden;
            "
        >
            <div
                class="ss-c-hero__content"
                style="
                    padding: 60px 48px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                "
            >
                <span
                    style="
                        display: inline-block;
                        padding: 6px 12px;
                        background: var(--color_fill_primary);
                        color: white;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 600;
                        width: fit-content;
                        margin-bottom: 20px;
                    "
                >
                    NEW RELEASE
                </span>
                <h1
                    style="
                        margin: 0 0 16px;
                        font-size: 42px;
                        font-weight: 700;
                        line-height: 1.2;
                    "
                >
                    Create stunning designs effortlessly
                </h1>
                <p
                    style="
                        margin: 0 0 32px;
                        font-size: 16px;
                        opacity: 0.8;
                        line-height: 1.6;
                    "
                >
                    Stylescape provides all the components you need to build
                    professional websites. From atoms to organisms, everything
                    is customizable.
                </p>
                <div class="ss-c-hero__actions" style="display: flex; gap: 12px">
                    <button
                        style="
                            padding: 14px 28px;
                            background: var(--color_fill_primary);
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-weight: 600;
                            cursor: pointer;
                        "
                    >
                        Start Free Trial
                    </button>
                    <button
                        style="
                            padding: 14px 28px;
                            background: white;
                            border: 1px solid var(--color_line_secondary);
                            border-radius: 8px;
                            font-weight: 500;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        "
                    >
                        <span>▶</span>
                        Watch Demo
                    </button>
                </div>
            </div>
            <div
                class="ss-c-hero__image"
                style="
                    background: linear-gradient(
                        135deg,
                        #f093fb 0%,
                        #f5576c 100%
                    );
                    display: flex;
                    align-items: center;
                    justify-content: center;
                "
            >
                <div
                    style="
                        width: 200px;
                        height: 200px;
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 20px;
                    "
                ></div>
            </div>
        </section>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <section
            class="ss-c-hero ss-c-hero--bg"
            style="
                position: relative;
                min-height: 500px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 60px 24px;
                border-radius: 16px;
                overflow: hidden;
            "
        >
            <!-- Background image layer -->
            <div
                class="ss-c-hero__bg"
                style="
                    position: absolute;
                    inset: 0;
                    background: url(&quot;https://picsum.photos/1200/600&quot;)
                        center/cover;
                    z-index: 0;
                "
            ></div>
            <!-- Overlay -->
            <div
                class="ss-c-hero__overlay"
                style="
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.6);
                    z-index: 1;
                "
            ></div>
            <!-- Content -->
            <div
                class="ss-c-hero__content"
                style="
                    position: relative;
                    z-index: 2;
                    max-width: 700px;
                    color: white;
                "
            >
                <h1
                    style="margin: 0 0 20px; font-size: 52px; font-weight: 700"
                >
                    Explore the Possibilities
                </h1>
                <p style="margin: 0 0 32px; font-size: 18px; opacity: 0.9">
                    Discover how our platform can transform your workflow and
                    boost productivity.
                </p>
                <button
                    style="
                        padding: 16px 40px;
                        background: white;
                        color: #1a1a2e;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        font-size: 16px;
                        cursor: pointer;
                    "
                >
                    Get Started Today
                </button>
            </div>
        </section>
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <section
            class="ss-c-hero ss-c-hero--stats"
            style="
                padding: 80px 48px;
                background: linear-gradient(
                    to right,
                    #0f0c29,
                    #302b63,
                    #24243e
                );
                color: white;
                border-radius: 16px;
            "
        >
            <div style="max-width: 1000px; margin: 0 auto; text-align: center">
                <h1
                    style="margin: 0 0 16px; font-size: 44px; font-weight: 700"
                >
                    Trusted by Developers Worldwide
                </h1>
                <p style="margin: 0 0 48px; font-size: 18px; opacity: 0.8">
                    Join thousands of teams building better products with
                    Stylescape.
                </p>

                <div
                    class="ss-c-hero__stats"
                    style="
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 32px;
                    "
                >
                    <div class="ss-c-stat">
                        <div
                            style="
                                font-size: 48px;
                                font-weight: 700;
                                margin-bottom: 8px;
                            "
                        >
                            10K+
                        </div>
                        <div
                            style="
                                font-size: 14px;
                                opacity: 0.7;
                                text-transform: uppercase;
                                letter-spacing: 1px;
                            "
                        >
                            Downloads
                        </div>
                    </div>
                    <div class="ss-c-stat">
                        <div
                            style="
                                font-size: 48px;
                                font-weight: 700;
                                margin-bottom: 8px;
                            "
                        >
                            500+
                        </div>
                        <div
                            style="
                                font-size: 14px;
                                opacity: 0.7;
                                text-transform: uppercase;
                                letter-spacing: 1px;
                            "
                        >
                            Components
                        </div>
                    </div>
                    <div class="ss-c-stat">
                        <div
                            style="
                                font-size: 48px;
                                font-weight: 700;
                                margin-bottom: 8px;
                            "
                        >
                            99%
                        </div>
                        <div
                            style="
                                font-size: 14px;
                                opacity: 0.7;
                                text-transform: uppercase;
                                letter-spacing: 1px;
                            "
                        >
                            Satisfaction
                        </div>
                    </div>
                    <div class="ss-c-stat">
                        <div
                            style="
                                font-size: 48px;
                                font-weight: 700;
                                margin-bottom: 8px;
                            "
                        >
                            24/7
                        </div>
                        <div
                            style="
                                font-size: 14px;
                                opacity: 0.7;
                                text-transform: uppercase;
                                letter-spacing: 1px;
                            "
                        >
                            Support
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `,
};

export const SectionTitle5: Story = {
    render: () => html`
        <section
            class="ss-c-hero ss-c-hero--minimal"
            style="
                padding: 100px 48px;
                text-align: center;
                background: white;
                border: 1px solid var(--color_line_secondary);
                border-radius: 16px;
            "
        >
            <div style="max-width: 800px; margin: 0 auto">
                <h1
                    style="
                        margin: 0 0 24px;
                        font-size: 56px;
                        font-weight: 800;
                        line-height: 1.1;
                        letter-spacing: -2px;
                    "
                >
                    Design systems
                    <br />
                    made simple.
                </h1>
                <p
                    style="
                        margin: 0 0 40px;
                        font-size: 20px;
                        opacity: 0.6;
                        line-height: 1.6;
                    "
                >
                    Everything you need to build consistent, beautiful
                    interfaces.
                </p>
                <div
                    class="ss-c-hero__form"
                    style="
                        display: flex;
                        gap: 12px;
                        justify-content: center;
                        max-width: 400px;
                        margin: 0 auto;
                    "
                >
                    <input
                        type="email"
                        placeholder="Enter your email"
                        style="
                            flex: 1;
                            padding: 14px 20px;
                            border: 1px solid var(--color_line_secondary);
                            border-radius: 8px;
                            font-size: 16px;
                        "
                    />
                    <button class="ss-c-button--primary"

                    >
                        Get Access
                    </button>
                </div>
            </div>
        </section>
    `,
};

export const SectionTitle6: Story = {
    render: () => html`
        <section
            class="ss-c-hero ss-c-hero--video"
            style="
                position: relative;
                min-height: 500px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 60px 24px;
                border-radius: 16px;
                overflow: hidden;
                background: #1a1a2e;
            "
        >
            <!-- Video placeholder (simulated) -->
            <div
                class="ss-c-hero__video"
                style="
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        45deg,
                        #1a1a2e 25%,
                        #302b63 50%,
                        #1a1a2e 75%
                    );
                    background-size: 400% 400%;
                    animation: gradientMove 8s ease infinite;
                    z-index: 0;
                "
            ></div>
            <!-- Overlay -->
            <div
                class="ss-c-hero__overlay"
                style="
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.4);
                    z-index: 1;
                "
            ></div>
            <!-- Content -->
            <div
                class="ss-c-hero__content"
                style="
                    position: relative;
                    z-index: 2;
                    max-width: 600px;
                    color: white;
                "
            >
                <h1
                    style="margin: 0 0 20px; font-size: 48px; font-weight: 700"
                >
                    Immersive Experiences
                </h1>
                <p style="margin: 0 0 32px; font-size: 18px; opacity: 0.9">
                    Create captivating video backgrounds that engage your
                    audience.
                </p>
                <button
                    style="
                        padding: 16px 32px;
                        background: rgba(255, 255, 255, 0.2);
                        color: white;
                        border: 2px solid white;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        backdrop-filter: blur(4px);
                    "
                >
                    Watch Showreel
                </button>
            </div>
        </section>

        <style>
            @keyframes gradientMove {
                0% {
                    background-position: 0% 50%;
                }
                50% {
                    background-position: 100% 50%;
                }
                100% {
                    background-position: 0% 50%;
                }
            }
        </style>
    `,
};
