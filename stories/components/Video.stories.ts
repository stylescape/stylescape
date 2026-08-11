// ==========================================================================
// Stylescape | Storybook — Video
// ==========================================================================
// Auto-generated from src/jinja/31-modules/video.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Video",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const VideoWithControls: Story = {
    render: () => html`
        <video class="ss-c-video" controls width="100%">
            <source src="video.mp4" type="video/mp4" />
            <source src="video.webm" type="video/webm" />
            Your browser does not support the video tag.
        </video>
    `,
};

export const VideoWithPoster: Story = {
    render: () => html`
        <video class="ss-c-video" controls poster="thumbnail.jpg" width="100%">
            <source src="video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    `,
};

export const AutoplayMuted: Story = {
    render: () => html`
        <video class="ss-c-video" autoplay muted loop playsinline width="100%">
            <source src="background-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    `,
};

export const Example169AspectRatio: Story = {
    render: () => html`
        <div class="ss-c-video_container ss-c-video_container--16x9">
            <video class="ss-c-video_container__video" controls>
                <source src="video.mp4" type="video/mp4" />
            </video>
        </div>
    `,
};

export const Example43AspectRatio: Story = {
    render: () => html`
        <div class="ss-c-video_container ss-c-video_container--4x3">
            <video class="ss-c-video_container__video" controls>
                <source src="video.mp4" type="video/mp4" />
            </video>
        </div>
    `,
};

export const Example219Cinematic: Story = {
    render: () => html`
        <div class="ss-c-video_container ss-c-video_container--21x9">
            <video class="ss-c-video_container__video" controls>
                <source src="video.mp4" type="video/mp4" />
            </video>
        </div>
    `,
};

export const YouTubeEmbed: Story = {
    render: () => html`
        <div class="ss-c-video_container ss-c-video_container--16x9">
            <iframe
                class="ss-c-video_container__iframe"
                src="https://www.youtube.com/embed/VIDEO_ID"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            ></iframe>
        </div>
    `,
};

export const VimeoEmbed: Story = {
    render: () => html`
        <div class="ss-c-video_container ss-c-video_container--16x9">
            <iframe
                class="ss-c-video_container__iframe"
                src="https://player.vimeo.com/video/VIDEO_ID"
                title="Vimeo video player"
                frameborder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowfullscreen
            ></iframe>
        </div>
    `,
};

export const CustomPlayerUI: Story = {
    render: () => html`
        <div class="ss-c-video_player">
            <video class="ss-c-video_player__video" id="customVideo">
                <source src="video.mp4" type="video/mp4" />
            </video>
            <div class="ss-c-video_player__overlay">
                <button class="ss-c-video_player__play" aria-label="Play">
                    ▶
                </button>
            </div>
            <div class="ss-c-video_player__controls">
                <button class="ss-c-video_player__button" aria-label="Play/Pause">
                    ▶
                </button>
                <div class="ss-c-video_player__progress">
                    <div class="ss-c-video_player__progress-bar"></div>
                </div>
                <span class="ss-c-video_player__time">0:00 / 3:45</span>
                <button class="ss-c-video_player__button" aria-label="Mute">
                    ◀
                </button>
                <input
                    type="range"
                    class="ss-c-video_player__volume"
                    min="0"
                    max="100"
                    value="100"
                />
                <button class="ss-c-video_player__button" aria-label="Fullscreen">
                    □
                </button>
            </div>
        </div>
    `,
};

export const VideoGrid: Story = {
    render: () => html`
        <div class="ss-c-video_gallery">
            <article class="ss-c-video_card">
                <div class="ss-c-video_card__thumbnail">
                    <img src="thumb1.jpg" alt="Video thumbnail" />
                    <span class="ss-c-video_card__duration">3:45</span>
                    <button class="ss-c-video_card__play" aria-label="Play video">
                        ▶
                    </button>
                </div>
                <div class="ss-c-video_card__info">
                    <h4 class="ss-c-video_card__title">Video Title</h4>
                    <p class="ss-c-video_card__meta">1.2K views • 2 days ago</p>
                </div>
            </article>

            <article class="ss-c-video_card">
                <div class="ss-c-video_card__thumbnail">
                    <img src="thumb2.jpg" alt="Video thumbnail" />
                    <span class="ss-c-video_card__duration">5:20</span>
                    <button class="ss-c-video_card__play" aria-label="Play video">
                        ▶
                    </button>
                </div>
                <div class="ss-c-video_card__info">
                    <h4 class="ss-c-video_card__title">Another Video</h4>
                    <p class="ss-c-video_card__meta">3.5K views • 1 week ago</p>
                </div>
            </article>
        </div>
    `,
};

export const HeroWithVideoBackground: Story = {
    render: () => html`
        <div class="ss-c-video_hero">
            <video
                class="ss-c-video_hero__background"
                autoplay
                muted
                loop
                playsinline
            >
                <source src="hero-video.mp4" type="video/mp4" />
            </video>
            <div class="ss-c-video_hero__overlay"></div>
            <div class="ss-c-video_hero__content">
                <h1>Welcome</h1>
                <p>Engaging hero section with video background</p>
                <button class="ss-c-button ss-c-button--primary">Get Started</button>
            </div>
        </div>
    `,
};
