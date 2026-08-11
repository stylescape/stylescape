// ==========================================================================
// Stylescape | Storybook — Carousel
// ==========================================================================
// Auto-generated from src/jinja/31-modules/carousel.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Carousel",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div
            style="
                position: relative;
                width: 100%;
                max-width: 600px;
                overflow: hidden;
                border-radius: 12px;
            "
        >
            <div style="display: flex; transition: transform 0.5s ease">
                <div
                    style="
                        min-width: 100%;
                        height: 300px;
                        background: linear-gradient(
                            135deg,
                            #667eea 0%,
                            #764ba2 100%
                        );
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 24px;
                        font-weight: 600;
                    "
                >
                    Slide 1
                </div>
                <div
                    style="
                        min-width: 100%;
                        height: 300px;
                        background: linear-gradient(
                            135deg,
                            #f093fb 0%,
                            #f5576c 100%
                        );
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 24px;
                        font-weight: 600;
                    "
                >
                    Slide 2
                </div>
                <div
                    style="
                        min-width: 100%;
                        height: 300px;
                        background: linear-gradient(
                            135deg,
                            #4facfe 0%,
                            #00f2fe 100%
                        );
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 24px;
                        font-weight: 600;
                    "
                >
                    Slide 3
                </div>
            </div>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div
            style="
                position: relative;
                width: 100%;
                max-width: 600px;
                border-radius: 12px;
                overflow: hidden;
            "
        >
            <div
                style="
                    height: 300px;
                    background: linear-gradient(
                        135deg,
                        #667eea 0%,
                        #764ba2 100%
                    );
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                    font-weight: 600;
                "
            >
                Slide Content
            </div>
            <!-- Navigation Arrows -->
            <button
                style="
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                "
            >
                ←
            </button>
            <button
                style="
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                "
            >
                →
            </button>
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div
            style="
                position: relative;
                width: 100%;
                max-width: 600px;
                border-radius: 12px;
                overflow: hidden;
            "
        >
            <div
                style="
                    height: 300px;
                    background: linear-gradient(
                        135deg,
                        #43e97b 0%,
                        #38f9d7 100%
                    );
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                    font-weight: 600;
                "
            >
                Active Slide
            </div>
            <!-- Indicators -->
            <div
                style="
                    position: absolute;
                    bottom: 16px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 8px;
                "
            >
                <span
                    style="
                        width: 24px;
                        height: 4px;
                        border-radius: 2px;
                        background: white;
                    "
                ></span>
                <span
                    style="
                        width: 12px;
                        height: 4px;
                        border-radius: 2px;
                        background: rgba(255, 255, 255, 0.5);
                    "
                ></span>
                <span
                    style="
                        width: 12px;
                        height: 4px;
                        border-radius: 2px;
                        background: rgba(255, 255, 255, 0.5);
                    "
                ></span>
                <span
                    style="
                        width: 12px;
                        height: 4px;
                        border-radius: 2px;
                        background: rgba(255, 255, 255, 0.5);
                    "
                ></span>
            </div>
        </div>
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <div
            style="
                position: relative;
                width: 100%;
                overflow: hidden;
                padding: 20px 0;
            "
        >
            <div
                style="
                    display: flex;
                    gap: 16px;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    padding: 0 16px;
                    scrollbar-width: none;
                "
            >
                <div
                    style="
                        min-width: 200px;
                        scroll-snap-align: start;
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                    "
                >
                    <div
                        style="
                            height: 120px;
                            background: linear-gradient(
                                135deg,
                                #667eea 0%,
                                #764ba2 100%
                            );
                        "
                    ></div>
                    <div style="padding: 16px">
                        <h4 style="margin: 0 0 8px">Card 1</h4>
                        <p style="margin: 0; font-size: 14px; opacity: 0.7">
                            Description text
                        </p>
                    </div>
                </div>
                <div
                    style="
                        min-width: 200px;
                        scroll-snap-align: start;
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                    "
                >
                    <div
                        style="
                            height: 120px;
                            background: linear-gradient(
                                135deg,
                                #f093fb 0%,
                                #f5576c 100%
                            );
                        "
                    ></div>
                    <div style="padding: 16px">
                        <h4 style="margin: 0 0 8px">Card 2</h4>
                        <p style="margin: 0; font-size: 14px; opacity: 0.7">
                            Description text
                        </p>
                    </div>
                </div>
                <div
                    style="
                        min-width: 200px;
                        scroll-snap-align: start;
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                    "
                >
                    <div
                        style="
                            height: 120px;
                            background: linear-gradient(
                                135deg,
                                #4facfe 0%,
                                #00f2fe 100%
                            );
                        "
                    ></div>
                    <div style="padding: 16px">
                        <h4 style="margin: 0 0 8px">Card 3</h4>
                        <p style="margin: 0; font-size: 14px; opacity: 0.7">
                            Description text
                        </p>
                    </div>
                </div>
                <div
                    style="
                        min-width: 200px;
                        scroll-snap-align: start;
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                    "
                >
                    <div
                        style="
                            height: 120px;
                            background: linear-gradient(
                                135deg,
                                #43e97b 0%,
                                #38f9d7 100%
                            );
                        "
                    ></div>
                    <div style="padding: 16px">
                        <h4 style="margin: 0 0 8px">Card 4</h4>
                        <p style="margin: 0; font-size: 14px; opacity: 0.7">
                            Description text
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `,
};

export const SectionTitle5: Story = {
    render: () => html`
        <div class="ss-c-carousel ss-c-carousel-slider">
            <div class="ss-c-carousel-fixed-item">
                <button class="ss-c-button">Fixed CTA</button>
            </div>
            <div class="ss-c-carousel-item active" id="carousel-slide-1">
                <img src="/img/demo1.jpg" alt="Slide 1" />
                <div class="ss-c-carousel-caption">
                    <h2>Slide One</h2>
                    <p>This is the first slide.</p>
                </div>
            </div>
            <div class="ss-c-carousel-item" id="carousel-slide-2">
                <img src="/img/demo2.jpg" alt="Slide 2" />
                <div class="ss-c-carousel-caption">
                    <h2>Slide Two</h2>
                    <p>This is the second slide.</p>
                </div>
            </div>
            <div class="ss-c-carousel-item" id="carousel-slide-3">
                <img src="/img/demo3.jpg" alt="Slide 3" />
                <div class="ss-c-carousel-caption">
                    <h2>Slide Three</h2>
                    <p>This is the third slide.</p>
                </div>
            </div>
            <div class="ss-c-indicators">
                <span
                    class="ss-c-indicator-item active"
                    data-target="#carousel-slide-1"
                ></span>
                <span
                    class="ss-c-indicator-item"
                    data-target="#carousel-slide-2"
                ></span>
                <span
                    class="ss-c-indicator-item"
                    data-target="#carousel-slide-3"
                ></span>
            </div>
        </div>
    `,
};

export const SectionTitle6: Story = {
    render: () => html`
        <div
            class="ss-c-slideshow"
            style="
                position: relative;
                max-width: 600px;
                aspect-ratio: 16/9;
                overflow: hidden;
                border-radius: 12px;
            "
        >
            <div class="ss-c-slideshow__slides" style="display: flex; height: 100%">
                <div
                    class="ss-c-slideshow__slide active"
                    style="
                        min-width: 100%;
                        background: linear-gradient(
                            135deg,
                            #667eea 0%,
                            #764ba2 100%
                        );
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 24px;
                        font-weight: 500;
                    "
                >
                    Slide 1
                </div>
            </div>
            <button
                class="ss-c-slideshow__prev"
                style="
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 44px;
                    height: 44px;
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                "
            >
                ←
            </button>
            <button
                class="ss-c-slideshow__next"
                style="
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 44px;
                    height: 44px;
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                "
            >
                →
            </button>
        </div>
    `,
};

export const SectionTitle7: Story = {
    render: () => html`
        <div
            class="ss-c-slideshow"
            style="
                position: relative;
                max-width: 600px;
                aspect-ratio: 16/9;
                overflow: hidden;
                border-radius: 12px;
            "
        >
            <div class="ss-c-slideshow__slides" style="height: 100%">
                <div
                    class="ss-c-slideshow__slide active"
                    style="
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(
                            135deg,
                            #f093fb 0%,
                            #f5576c 100%
                        );
                    "
                ></div>
            </div>
            <div
                class="ss-c-slideshow__indicators"
                style="
                    position: absolute;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 10px;
                "
            >
                <button
                    class="ss-c-slideshow__dot active"
                    style="
                        width: 12px;
                        height: 12px;
                        background: white;
                        border: none;
                        border-radius: 50%;
                        cursor: pointer;
                        opacity: 1;
                    "
                ></button>
                <button
                    class="ss-c-slideshow__dot"
                    style="
                        width: 12px;
                        height: 12px;
                        background: white;
                        border: none;
                        border-radius: 50%;
                        cursor: pointer;
                        opacity: 0.5;
                    "
                ></button>
                <button
                    class="ss-c-slideshow__dot"
                    style="
                        width: 12px;
                        height: 12px;
                        background: white;
                        border: none;
                        border-radius: 50%;
                        cursor: pointer;
                        opacity: 0.5;
                    "
                ></button>
                <button
                    class="ss-c-slideshow__dot"
                    style="
                        width: 12px;
                        height: 12px;
                        background: white;
                        border: none;
                        border-radius: 50%;
                        cursor: pointer;
                        opacity: 0.5;
                    "
                ></button>
            </div>
        </div>
    `,
};

export const SectionTitle8: Story = {
    render: () => html`
        <div
            class="ss-c-slideshow"
            style="
                position: relative;
                max-width: 600px;
                aspect-ratio: 16/9;
                overflow: hidden;
                border-radius: 12px;
            "
        >
            <div
                class="ss-c-slideshow__slide"
                style="
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        135deg,
                        #4facfe 0%,
                        #00f2fe 100%
                    );
                "
            >
                <div
                    class="ss-c-slideshow__caption"
                    style="
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        padding: 40px 24px 24px;
                        background: linear-gradient(
                            transparent,
                            rgba(0, 0, 0, 0.7)
                        );
                        color: white;
                    "
                >
                    <h3 style="margin: 0 0 8px; font-size: 20px">
                        Amazing Landscape
                    </h3>
                    <p style="margin: 0; opacity: 0.9; font-size: 14px">
                        Discover the beauty of nature
                    </p>
                </div>
            </div>
            <button
                class="ss-c-slideshow__prev"
                style="
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(4px);
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    color: white;
                    font-size: 16px;
                "
            >
                ←
            </button>
            <button
                class="ss-c-slideshow__next"
                style="
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(4px);
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    color: white;
                    font-size: 16px;
                "
            >
                →
            </button>
        </div>
    `,
};

export const SectionTitle9: Story = {
    render: () => html`
        <div class="ss-c-slideshow ss-c-slideshow--thumbnails" style="max-width: 600px">
            <div
                style="
                    position: relative;
                    aspect-ratio: 16/9;
                    overflow: hidden;
                    border-radius: 12px;
                    margin-bottom: 12px;
                "
            >
                <div
                    class="ss-c-slideshow__slide"
                    style="
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(
                            135deg,
                            #43e97b 0%,
                            #38f9d7 100%
                        );
                    "
                ></div>
            </div>
            <div class="ss-c-slideshow__thumbs" style="display: flex; gap: 8px">
                <button
                    class="ss-c-slideshow__thumb active"
                    style="
                        flex: 1;
                        aspect-ratio: 16/9;
                        background: linear-gradient(
                            135deg,
                            #43e97b 0%,
                            #38f9d7 100%
                        );
                        border: 3px solid var(--color_fill_primary);
                        border-radius: 6px;
                        cursor: pointer;
                    "
                ></button>
                <button
                    class="ss-c-slideshow__thumb"
                    style="
                        flex: 1;
                        aspect-ratio: 16/9;
                        background: linear-gradient(
                            135deg,
                            #fa709a 0%,
                            #fee140 100%
                        );
                        border: 3px solid transparent;
                        border-radius: 6px;
                        cursor: pointer;
                        opacity: 0.7;
                    "
                ></button>
                <button
                    class="ss-c-slideshow__thumb"
                    style="
                        flex: 1;
                        aspect-ratio: 16/9;
                        background: linear-gradient(
                            135deg,
                            #667eea 0%,
                            #764ba2 100%
                        );
                        border: 3px solid transparent;
                        border-radius: 6px;
                        cursor: pointer;
                        opacity: 0.7;
                    "
                ></button>
                <button
                    class="ss-c-slideshow__thumb"
                    style="
                        flex: 1;
                        aspect-ratio: 16/9;
                        background: linear-gradient(
                            135deg,
                            #f093fb 0%,
                            #f5576c 100%
                        );
                        border: 3px solid transparent;
                        border-radius: 6px;
                        cursor: pointer;
                        opacity: 0.7;
                    "
                ></button>
            </div>
        </div>
    `,
};

export const SectionTitle10: Story = {
    render: () => html`
        <div
            class="ss-c-slideshow ss-c-slideshow--fullscreen"
            style="
                position: relative;
                max-width: 700px;
                aspect-ratio: 16/9;
                overflow: hidden;
                border-radius: 12px;
                background: #000;
            "
        >
            <div
                class="ss-c-slideshow__slide"
                style="
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        135deg,
                        #0f0c29 0%,
                        #302b63 50%,
                        #24243e 100%
                    );
                    display: flex;
                    align-items: center;
                    justify-content: center;
                "
            >
                <div style="text-align: center; color: white">
                    <h2
                        style="
                            margin: 0 0 16px;
                            font-size: 36px;
                            font-weight: 300;
                        "
                    >
                        Welcome
                    </h2>
                    <p style="margin: 0 0 24px; opacity: 0.8">
                        Explore our collection
                    </p>
                    <button
                        style="
                            padding: 12px 32px;
                            background: white;
                            color: #302b63;
                            border: none;
                            border-radius: 24px;
                            font-weight: 500;
                            cursor: pointer;
                        "
                    >
                        Get Started
                    </button>
                </div>
            </div>
            <div
                style="
                    position: absolute;
                    bottom: 24px;
                    left: 24px;
                    color: white;
                    font-size: 14px;
                "
            >
                <span style="opacity: 0.7">01</span>
                /
                <span>04</span>
            </div>
            <div
                style="
                    position: absolute;
                    bottom: 24px;
                    right: 24px;
                    display: flex;
                    gap: 8px;
                "
            >
                <button
                    style="
                        width: 48px;
                        height: 48px;
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        border-radius: 50%;
                        color: white;
                        cursor: pointer;
                    "
                >
                    ←
                </button>
                <button
                    style="
                        width: 48px;
                        height: 48px;
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        border-radius: 50%;
                        color: white;
                        cursor: pointer;
                    "
                >
                    →
                </button>
            </div>
        </div>
    `,
};

export const SectionTitle11: Story = {
    render: () => html`
        <div class="ss-c-slideshow ss-c-slideshow--cards" style="padding: 20px 0">
            <div
                style="
                    display: flex;
                    gap: 16px;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    padding: 0 16px;
                "
            >
                <div
                    class="ss-c-slideshow__card"
                    style="
                        min-width: 280px;
                        scroll-snap-align: start;
                        background: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    "
                >
                    <div
                        style="
                            aspect-ratio: 4/3;
                            background: linear-gradient(
                                135deg,
                                #667eea 0%,
                                #764ba2 100%
                            );
                        "
                    ></div>
                    <div style="padding: 16px">
                        <h4 style="margin: 0 0 8px">Card Title</h4>
                        <p style="margin: 0; font-size: 14px; opacity: 0.7">
                            Short description text
                        </p>
                    </div>
                </div>
                <div
                    class="ss-c-slideshow__card"
                    style="
                        min-width: 280px;
                        scroll-snap-align: start;
                        background: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    "
                >
                    <div
                        style="
                            aspect-ratio: 4/3;
                            background: linear-gradient(
                                135deg,
                                #f093fb 0%,
                                #f5576c 100%
                            );
                        "
                    ></div>
                    <div style="padding: 16px">
                        <h4 style="margin: 0 0 8px">Another Card</h4>
                        <p style="margin: 0; font-size: 14px; opacity: 0.7">
                            Description here
                        </p>
                    </div>
                </div>
                <div
                    class="ss-c-slideshow__card"
                    style="
                        min-width: 280px;
                        scroll-snap-align: start;
                        background: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    "
                >
                    <div
                        style="
                            aspect-ratio: 4/3;
                            background: linear-gradient(
                                135deg,
                                #4facfe 0%,
                                #00f2fe 100%
                            );
                        "
                    ></div>
                    <div style="padding: 16px">
                        <h4 style="margin: 0 0 8px">Third Card</h4>
                        <p style="margin: 0; font-size: 14px; opacity: 0.7">
                            More content
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `,
};

export const SectionTitle12: Story = {
    render: () => html`
        <div class="ss-c-slideshow ss-c-slideshow--progress" style="max-width: 600px">
            <div
                class="ss-c-slideshow__progress"
                style="display: flex; gap: 4px; margin-bottom: 12px"
            >
                <div
                    style="
                        flex: 1;
                        height: 3px;
                        background: var(--color_fill_primary);
                        border-radius: 2px;
                    "
                ></div>
                <div
                    style="
                        flex: 1;
                        height: 3px;
                        background: var(--color_line_secondary);
                        border-radius: 2px;
                    "
                ></div>
                <div
                    style="
                        flex: 1;
                        height: 3px;
                        background: var(--color_line_secondary);
                        border-radius: 2px;
                    "
                ></div>
                <div
                    style="
                        flex: 1;
                        height: 3px;
                        background: var(--color_line_secondary);
                        border-radius: 2px;
                    "
                ></div>
            </div>
            <div
                style="
                    position: relative;
                    aspect-ratio: 16/9;
                    overflow: hidden;
                    border-radius: 12px;
                "
            >
                <div
                    class="ss-c-slideshow__slide"
                    style="
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(
                            135deg,
                            #fa709a 0%,
                            #fee140 100%
                        );
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    "
                >
                    <div style="text-align: center; color: white">
                        <span style="font-size: 48px">◎</span>
                        <h3 style="margin: 16px 0 8px">Step 1 of 4</h3>
                        <p style="margin: 0; opacity: 0.9">
                            Getting started with the basics
                        </p>
                    </div>
                </div>
            </div>
            <div
                style="
                    display: flex;
                    justify-content: space-between;
                    margin-top: 16px;
                "
            >
                <button
                    style="
                        padding: 10px 24px;
                        background: var(--color_fill_secondary);
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                    "
                >
                    Previous
                </button>
                <button
                    style="
                        padding: 10px 24px;
                        background: var(--color_fill_primary);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                    "
                >
                    Next Step
                </button>
            </div>
        </div>
    `,
};

export const SectionTitle13: Story = {
    render: () => html`
        <div
            class="ss-c-slideshow"
            style="
                position: relative;
                width: 100%;
                max-width: 600px;
                aspect-ratio: 16/9;
                overflow: hidden;
                border-radius: 12px;
            "
        >
            <div
                class="ss-c-slideshow--slides"
                style="display: flex; transition: transform 0.5s ease"
            >
                <div
                    class="ss-c-slideshow--slide"
                    style="
                        min-width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 24px;
                    "
                >
                    Slide 1
                </div>
                <div
                    class="ss-c-slideshow--slide"
                    style="
                        min-width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #f093fb, #f5576c);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 24px;
                    "
                >
                    Slide 2
                </div>
                <div
                    class="ss-c-slideshow--slide"
                    style="
                        min-width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #4facfe, #00f2fe);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 24px;
                    "
                >
                    Slide 3
                </div>
            </div>
            <button
                class="ss-c-slideshow--prev"
                style="
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 44px;
                    height: 44px;
                    border: none;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                "
            >
                ←
            </button>
            <button
                class="ss-c-slideshow--next"
                style="
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 44px;
                    height: 44px;
                    border: none;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                "
            >
                →
            </button>
        </div>
    `,
};

export const SectionTitle14: Story = {
    render: () => html`
        <div
            class="ss-c-slideshow"
            style="
                position: relative;
                width: 100%;
                max-width: 600px;
                aspect-ratio: 16/9;
                overflow: hidden;
                border-radius: 12px;
            "
        >
            <div class="ss-c-slideshow--slides">
                <div
                    class="ss-c-slideshow--slide active"
                    style="
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #43e97b, #38f9d7);
                    "
                ></div>
            </div>
            <div
                class="ss-c-slideshow--indicators"
                style="
                    position: absolute;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 10px;
                "
            >
                <button
                    class="ss-c-slideshow--indicator active"
                    style="
                        width: 12px;
                        height: 12px;
                        border: none;
                        background: white;
                        border-radius: 50%;
                        cursor: pointer;
                        opacity: 1;
                    "
                ></button>
                <button
                    class="ss-c-slideshow--indicator"
                    style="
                        width: 12px;
                        height: 12px;
                        border: none;
                        background: white;
                        border-radius: 50%;
                        cursor: pointer;
                        opacity: 0.5;
                    "
                ></button>
                <button
                    class="ss-c-slideshow--indicator"
                    style="
                        width: 12px;
                        height: 12px;
                        border: none;
                        background: white;
                        border-radius: 50%;
                        cursor: pointer;
                        opacity: 0.5;
                    "
                ></button>
                <button
                    class="ss-c-slideshow--indicator"
                    style="
                        width: 12px;
                        height: 12px;
                        border: none;
                        background: white;
                        border-radius: 50%;
                        cursor: pointer;
                        opacity: 0.5;
                    "
                ></button>
            </div>
        </div>
    `,
};

export const SectionTitle15: Story = {
    render: () => html`
        <div
            class="ss-c-slideshow"
            style="
                position: relative;
                width: 100%;
                max-width: 600px;
                aspect-ratio: 16/9;
                overflow: hidden;
                border-radius: 12px;
            "
        >
            <div
                class="ss-c-slideshow--slide"
                style="
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #fa709a, #fee140);
                "
            >
                <div
                    class="ss-c-slideshow--caption"
                    style="
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        padding: 40px 24px 24px;
                        background: linear-gradient(
                            transparent,
                            rgba(0, 0, 0, 0.7)
                        );
                        color: white;
                    "
                >
                    <h3 style="margin: 0 0 8px; font-size: 20px">
                        Beautiful Sunset
                    </h3>
                    <p style="margin: 0; opacity: 0.9; font-size: 14px">
                        A stunning view captured at golden hour with vibrant
                        colors filling the sky.
                    </p>
                </div>
            </div>
            <div
                class="ss-c-slideshow--counter"
                style="
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    padding: 6px 12px;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 20px;
                    color: white;
                    font-size: 13px;
                "
            >
                1 / 5
            </div>
        </div>
    `,
};

export const SectionTitle16: Story = {
    render: () => html`
        <div class="ss-c-slideshow-container" style="max-width: 600px">
            <div
                class="ss-c-slideshow--main"
                style="
                    width: 100%;
                    aspect-ratio: 16/9;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border-radius: 12px;
                    margin-bottom: 12px;
                "
            ></div>
            <div
                class="ss-c-slideshow--thumbnails"
                style="display: flex; gap: 8px; overflow-x: auto"
            >
                <div
                    class="ss-c-slideshow--thumb active"
                    style="
                        flex-shrink: 0;
                        width: 80px;
                        height: 60px;
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        border-radius: 6px;
                        cursor: pointer;
                        border: 3px solid var(--color_fill_primary);
                    "
                ></div>
                <div
                    class="ss-c-slideshow--thumb"
                    style="
                        flex-shrink: 0;
                        width: 80px;
                        height: 60px;
                        background: linear-gradient(135deg, #f093fb, #f5576c);
                        border-radius: 6px;
                        cursor: pointer;
                        opacity: 0.7;
                    "
                ></div>
                <div
                    class="ss-c-slideshow--thumb"
                    style="
                        flex-shrink: 0;
                        width: 80px;
                        height: 60px;
                        background: linear-gradient(135deg, #4facfe, #00f2fe);
                        border-radius: 6px;
                        cursor: pointer;
                        opacity: 0.7;
                    "
                ></div>
                <div
                    class="ss-c-slideshow--thumb"
                    style="
                        flex-shrink: 0;
                        width: 80px;
                        height: 60px;
                        background: linear-gradient(135deg, #43e97b, #38f9d7);
                        border-radius: 6px;
                        cursor: pointer;
                        opacity: 0.7;
                    "
                ></div>
                <div
                    class="ss-c-slideshow--thumb"
                    style="
                        flex-shrink: 0;
                        width: 80px;
                        height: 60px;
                        background: linear-gradient(135deg, #fa709a, #fee140);
                        border-radius: 6px;
                        cursor: pointer;
                        opacity: 0.7;
                    "
                ></div>
            </div>
        </div>
    `,
};

export const SectionTitle17: Story = {
    render: () => html`
        <div
            class="ss-c-slideshow ss-c-slideshow--fade"
            style="
                position: relative;
                width: 100%;
                max-width: 600px;
                aspect-ratio: 16/9;
                border-radius: 12px;
                overflow: hidden;
            "
        >
            <div
                class="ss-c-slideshow--slide"
                style="
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, #a8edea, #fed6e3);
                    opacity: 1;
                    transition: opacity 0.5s;
                "
            ></div>
            <div
                class="ss-c-slideshow--slide"
                style="
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, #d299c2, #fef9d7);
                    opacity: 0;
                    transition: opacity 0.5s;
                "
            ></div>
            <div
                class="ss-c-slideshow--slide"
                style="
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, #89f7fe, #66a6ff);
                    opacity: 0;
                    transition: opacity 0.5s;
                "
            ></div>
            <div
                class="ss-c-slideshow--controls"
                style="
                    position: absolute;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 8px;
                "
            >
                <button
                    style="
                        padding: 8px 16px;
                        border: none;
                        background: rgba(255, 255, 255, 0.9);
                        border-radius: 6px;
                        cursor: pointer;
                    "
                >
                    Previous
                </button>
                <button
                    style="
                        padding: 8px 16px;
                        border: none;
                        background: rgba(255, 255, 255, 0.9);
                        border-radius: 6px;
                        cursor: pointer;
                    "
                >
                    Next
                </button>
            </div>
        </div>
    `,
};
