// ==========================================================================
// Stylescape | Storybook — Ribbon
// ==========================================================================
// Auto-generated from src/jinja/31-modules/ribbon.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Ribbon",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div class="ss-c-ribbon ss-c-ribbon--top">
            <div class="ss-c-ribbon__slot--horizontal_left">Top Ribbon</div>
        </div>
        <br />
        <div class="ss-c-ribbon ss-c-ribbon--top">
            <div class="ss-c-ribbon__slot--horizontal_center">Top Ribbon</div>
        </div>
        <br />
        <div class="ss-c-ribbon ss-c-ribbon--top">
            <div class="ss-c-ribbon__slot--horizontal_right">Top Ribbon</div>
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div class="ss-c-ribbon ss-c-ribbon--top">
            <div class="ss-c-ribbon__slot--horizontal_left">
                <details>
                    <summary class="ss-c-flex ss-c-justify--center ss-c-align--center">
                        Top Ribbon
                        <i class="ss-c-i i_shape_triangle_fill_md_down"></i>
                    </summary>

                    <ul class="ss-c-ribbon__panel ss-c-left">
                        <h4 class="ss-c-ribbon__panel__section__header">Projects</h4>

                        <ul class="ss-c-ribbon__panel__section">
                            <li class="ss-c-ribbon__panel__section__item">
                                <a href="#">Lorem Ipsum</a>
                            </li>
                            <li class="ss-c-ribbon__panel__section__item">
                                <a href="#">Lorem Ipsum</a>
                            </li>
                        </ul>

                        <hr class="ss-c-ribbon__panel__line" />

                        <h4 class="ss-c-ribbon__panel__section__header">Studies</h4>

                        <ul class="ss-c-ribbon__panel__section">
                            <li class="ss-c-ribbon__panel__section__item">
                                <a href="#">Lorem Ipsum</a>
                            </li>
                            <li class="ss-c-ribbon__panel__section__item">
                                <a href="#">Lorem Ipsum</a>
                            </li>
                        </ul>
                    </ul>
                </details>
            </div>
        </div>
        <br />
        <div class="ss-c-ribbon ss-c-ribbon--top">
            <div class="ss-c-ribbon__slot--horizontal_center">
                <details>
                    <summary class="ss-c-flex ss-c-justify--center ss-c-align--center">
                        Top Ribbon
                        <i class="ss-c-i i_shape_triangle_fill_md_down"></i>
                    </summary>

                    <ul class="ss-c-ribbon__panel ss-c-center">
                        <h4 class="ss-c-ribbon__panel__section__header">Projects</h4>

                        <ul class="ss-c-ribbon__panel__section">
                            <li class="ss-c-ribbon__panel__section__item">
                                <a href="#">Lorem Ipsum</a>
                            </li>
                            <li class="ss-c-ribbon__panel__section__item">
                                <a href="#">Lorem Ipsum</a>
                            </li>
                        </ul>

                        <hr class="ss-c-ribbon__panel__line" />

                        <h4 class="ss-c-ribbon__panel__section__header">Studies</h4>

                        <ul class="ss-c-ribbon__panel__section">
                            <li class="ss-c-ribbon__panel__section__item">
                                <a href="#">Lorem Ipsum</a>
                            </li>
                            <li class="ss-c-ribbon__panel__section__item">
                                <a href="#">Lorem Ipsum</a>
                            </li>
                        </ul>
                    </ul>
                </details>
            </div>
        </div>
        <br />
        <div class="ss-c-ribbon ss-c-ribbon--top">
            <div class="ss-c-ribbon__slot--horizontal_right">
                <details>
                    <summary class="ss-c-flex ss-c-justify--center ss-c-align--center">
                        Top Ribbon
                        <i class="ss-c-i i_shape_triangle_fill_md_down"></i>
                    </summary>

                    <ul class="ss-c-ribbon__panel ss-c-right">
                        <h4 class="ss-c-ribbon__panel__section__header">Projects</h4>

                        <ul class="ss-c-ribbon__panel__section">
                            <li class="ss-c-ribbon__panel__section__item">
                                <a href="#">Lorem Ipsum</a>
                            </li>
                            <li class="ss-c-ribbon__panel__section__item">
                                <a href="#">Lorem Ipsum</a>
                            </li>
                        </ul>

                        <hr class="ss-c-ribbon__panel__line" />

                        <h4 class="ss-c-ribbon__panel__section__header">Studies</h4>

                        <ul class="ss-c-ribbon__panel__section">
                            <li class="ss-c-ribbon__panel__section__item">
                                <a href="#">Lorem Ipsum</a>
                            </li>
                            <li class="ss-c-ribbon__panel__section__item">
                                <a href="#">Lorem Ipsum</a>
                            </li>
                        </ul>
                    </ul>
                </details>
            </div>
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <div class="ss-c-ribbon ss-c-ribbon--top">
            <div class="ss-c-ribbon__slot--horizontal_left">
                <nav id="ribbon__nav" class="ss-c-ribbon__nav" role="navigation">
                    <ul id="ribbon__nav__list" class="ss-c-ribbon__nav__list">
                        <li class="ss-c-ribbon__nav__list__item">
                            <a href="/" class="ss-c-ribbon__nav__list__item__text">
                                Studio
                            </a>
                        </li>
                        <li class="ss-c-ribbon__nav__list__item">
                            <a href="/" class="ss-c-ribbon__nav__list__item__text">
                                Stories
                            </a>
                        </li>
                        <li class="ss-c-ribbon__nav__list__item">
                            <a href="/" class="ss-c-ribbon__nav__list__item__text">
                                Services
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <br />
        <div class="ss-c-ribbon ss-c-ribbon--top">
            <div class="ss-c-ribbon__slot--horizontal_center">
                <nav id="ribbon__nav" class="ss-c-ribbon__nav" role="navigation">
                    <ul id="ribbon__nav__list" class="ss-c-ribbon__nav__list">
                        <li class="ss-c-ribbon__nav__list__item">
                            <a href="/" class="ss-c-ribbon__nav__list__item__text">
                                Studio
                            </a>
                        </li>
                        <li class="ss-c-ribbon__nav__list__item">
                            <a href="/" class="ss-c-ribbon__nav__list__item__text">
                                Stories
                            </a>
                        </li>
                        <li class="ss-c-ribbon__nav__list__item">
                            <a href="/" class="ss-c-ribbon__nav__list__item__text">
                                Services
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <br />
        <div class="ss-c-ribbon ss-c-ribbon--top">
            <div class="ss-c-ribbon__slot--horizontal_right">
                <nav id="ribbon__nav" class="ss-c-ribbon__nav" role="navigation">
                    <ul id="ribbon__nav__list" class="ss-c-ribbon__nav__list">
                        <li class="ss-c-ribbon__nav__list__item">
                            <a href="/" class="ss-c-ribbon__nav__list__item__text">
                                Studio
                            </a>
                        </li>
                        <li class="ss-c-ribbon__nav__list__item">
                            <a href="/" class="ss-c-ribbon__nav__list__item__text">
                                Stories
                            </a>
                        </li>
                        <li class="ss-c-ribbon__nav__list__item">
                            <a href="/" class="ss-c-ribbon__nav__list__item__text">
                                Services
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    `,
};

export const TopRibbonMenuInline: Story = {
    render: () => html`
        <div class="ss-c-ribbon ss-c-ribbon--top">
            <div class="ss-c-ribbon__slot--horizontal_left">
                <menu id="ribbon__menu" class="ss-c-ribbon__menu" role="menubar">
                    <li class="ss-c-ribbon__menu__item">
                        <button class="ss-c-ribbon__button">
                            <a href="">
                                <i class="ss-c-i i_symbol_swirl_left_02"></i>
                            </a>
                        </button>
                    </li>
                    <li class="ss-c-ribbon__menu__item">
                        <button class="ss-c-ribbon__button">
                            <span class="ss-c-i">☰</span>
                        </button>
                    </li>
                    <li class="ss-c-ribbon__menu__item">
                        <button class="ss-c-ribbon__button">
                            <span class="ss-c-i">⊞</span>
                        </button>
                    </li>
                    <li class="ss-c-ribbon__menu__item">
                        <button class="ss-c-ribbon__button">
                            <span class="ss-c-i">⌘</span>
                        </button>
                    </li>
                </menu>
            </div>
        </div>
        <br />
        <div class="ss-c-ribbon ss-c-ribbon--top">
            <div class="ss-c-ribbon__slot--horizontal_center">
                <menu id="ribbon__menu" class="ss-c-ribbon__menu" role="menubar">
                    <li class="ss-c-ribbon__menu__item">
                        <button class="ss-c-ribbon__button">
                            <a href="">
                                <i class="ss-c-i i_symbol_swirl_left_02"></i>
                            </a>
                        </button>
                    </li>
                    <li class="ss-c-ribbon__menu__item">
                        <button class="ss-c-ribbon__button">
                            <span class="ss-c-i">☰</span>
                        </button>
                    </li>
                    <li class="ss-c-ribbon__menu__item">
                        <button class="ss-c-ribbon__button">
                            <span class="ss-c-i">⊞</span>
                        </button>
                    </li>
                    <li class="ss-c-ribbon__menu__item">
                        <button class="ss-c-ribbon__button">
                            <span class="ss-c-i">⌘</span>
                        </button>
                    </li>
                </menu>
            </div>
        </div>
        <br />
        <div class="ss-c-ribbon ss-c-ribbon--top">
            <div class="ss-c-ribbon__slot--horizontal_right">
                <menu id="ribbon__menu" class="ss-c-ribbon__menu" role="menubar">
                    <li class="ss-c-ribbon__menu__item">
                        <button class="ss-c-ribbon__button">
                            <a href="">
                                <i class="ss-c-i i_symbol_swirl_left_02"></i>
                            </a>
                        </button>
                    </li>
                    <li class="ss-c-ribbon__menu__item">
                        <button class="ss-c-ribbon__button">
                            <span class="ss-c-i">☰</span>
                        </button>
                    </li>
                    <li class="ss-c-ribbon__menu__item">
                        <button class="ss-c-ribbon__button">
                            <span class="ss-c-i">⊞</span>
                        </button>
                    </li>
                    <li class="ss-c-ribbon__menu__item">
                        <button class="ss-c-ribbon__button">
                            <span class="ss-c-i">⌘</span>
                        </button>
                    </li>
                </menu>
            </div>
        </div>
    `,
};

export const TopRibbonSlots: Story = {
    render: () => html`
        <div class="ss-c-ribbon ss-c-ribbon--top">
            <div class="ss-c-ribbon__search">
                <form
                    id="ribbon__search__form"
                    class="ss-c-ribbon__search__form"
                    role="search"
                >
                    <button
                        type="submit"
                        id="ribbon__search_button"
                        class="ss-c-ribbon__search_button"
                    >
                        <i class="ss-c-i i_ui_search"></i>
                    </button>
                    <input
                        type="text"
                        id="ribbon__search__input"
                        class="ss-c-ribbon__search__input"
                        placeholder="Search..."
                    />
                </form>
            </div>
        </div>
        <br />
        <div class="ss-c-ribbon ss-c-ribbon--top">
            <div class="ss-c-ribbon__slot--horizontal_center">
                <div class="ss-c-ribbon__search">
                    <form
                        id="ribbon__search__form"
                        class="ss-c-ribbon__search__form"
                        role="search"
                    >
                        <button
                            type="submit"
                            id="ribbon__search_button"
                            class="ss-c-ribbon__search_button"
                        >
                            <i class="ss-c-i i_ui_search"></i>
                        </button>
                        <input
                            type="text"
                            id="ribbon__search__input"
                            class="ss-c-ribbon__search__input"
                            placeholder="Search..."
                        />
                    </form>
                </div>
            </div>
        </div>
        <br />
        <div class="ss-c-ribbon ss-c-ribbon--top">
            <div class="ss-c-ribbon__slot--horizontal_right">
                <div class="ss-c-ribbon__search">
                    <form
                        id="ribbon__search__form"
                        class="ss-c-ribbon__search__form"
                        role="search"
                    >
                        <button
                            type="submit"
                            id="ribbon__search_button"
                            class="ss-c-ribbon__search_button"
                        >
                            <i class="ss-c-i i_ui_search"></i>
                        </button>
                        <input
                            type="text"
                            id="ribbon__search__input"
                            class="ss-c-ribbon__search__input"
                            placeholder="Search..."
                        />
                    </form>
                </div>
            </div>
        </div>
    `,
};
