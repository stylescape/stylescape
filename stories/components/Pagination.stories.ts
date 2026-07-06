// ==========================================================================
// Stylescape | Storybook — Pagination
// ==========================================================================
// Auto-generated from src/jinja/31-modules/pagination.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Pagination",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SimplePagination: Story = {
    render: () => html`
        <nav aria-label="Page navigation">
            <ul class="ss-c-pagination">
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link" aria-label="Previous">
                        ←
                    </a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">1</a>
                </li>
                <li class="ss-c-pagination__item ss-c-pagination__item--active">
                    <a href="#" class="ss-c-pagination__link" aria-current="page">
                        2
                    </a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">3</a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link" aria-label="Next">
                        →
                    </a>
                </li>
            </ul>
        </nav>
    `,
};

export const WithFirstLast: Story = {
    render: () => html`
        <nav aria-label="Page navigation">
            <ul class="ss-c-pagination">
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link" aria-label="First">
                        ««
                    </a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link" aria-label="Previous">
                        «
                    </a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">1</a>
                </li>
                <li class="ss-c-pagination__item ss-c-pagination__item--active">
                    <a href="#" class="ss-c-pagination__link" aria-current="page">
                        2
                    </a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">3</a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link" aria-label="Next">
                        »
                    </a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link" aria-label="Last">
                        »»
                    </a>
                </li>
            </ul>
        </nav>
    `,
};

export const DisabledItems: Story = {
    render: () => html`
        <nav aria-label="Page navigation">
            <ul class="ss-c-pagination">
                <li class="ss-c-pagination__item ss-c-pagination__item--disabled">
                    <a
                        href="#"
                        class="ss-c-pagination__link"
                        tabindex="-1"
                        aria-disabled="true"
                    >
                        Previous
                    </a>
                </li>
                <li class="ss-c-pagination__item ss-c-pagination__item--active">
                    <a href="#" class="ss-c-pagination__link" aria-current="page">
                        1
                    </a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">2</a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">3</a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">Next</a>
                </li>
            </ul>
        </nav>
    `,
};

export const SizeVariations: Story = {
    render: () => html`
        <nav aria-label="Small pagination">
            <ul class="ss-c-pagination ss-c-pagination--sm">
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">«</a>
                </li>
                <li class="ss-c-pagination__item ss-c-pagination__item--active">
                    <a href="#" class="ss-c-pagination__link">1</a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">2</a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">»</a>
                </li>
            </ul>
        </nav>

        <nav aria-label="Default pagination" class="ss-c-mt--02">
            <ul class="ss-c-pagination">
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">«</a>
                </li>
                <li class="ss-c-pagination__item ss-c-pagination__item--active">
                    <a href="#" class="ss-c-pagination__link">1</a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">2</a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">»</a>
                </li>
            </ul>
        </nav>

        <nav aria-label="Large pagination" class="ss-c-mt--02">
            <ul class="ss-c-pagination ss-c-pagination--lg">
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">«</a>
                </li>
                <li class="ss-c-pagination__item ss-c-pagination__item--active">
                    <a href="#" class="ss-c-pagination__link">1</a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">2</a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">»</a>
                </li>
            </ul>
        </nav>
    `,
};

export const Centered: Story = {
    render: () => html`
        <nav aria-label="Centered pagination">
            <ul class="ss-c-pagination ss-c-pagination--center">
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">«</a>
                </li>
                <li class="ss-c-pagination__item ss-c-pagination__item--active">
                    <a href="#" class="ss-c-pagination__link">1</a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">2</a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">3</a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">»</a>
                </li>
            </ul>
        </nav>
    `,
};

export const RightAligned: Story = {
    render: () => html`
        <nav aria-label="Right aligned pagination">
            <ul class="ss-c-pagination ss-c-pagination--end">
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">«</a>
                </li>
                <li class="ss-c-pagination__item ss-c-pagination__item--active">
                    <a href="#" class="ss-c-pagination__link">1</a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">2</a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">3</a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">»</a>
                </li>
            </ul>
        </nav>
    `,
};

export const WithEllipsis: Story = {
    render: () => html`
        <nav aria-label="Ellipsis pagination">
            <ul class="ss-c-pagination">
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">«</a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">1</a>
                </li>
                <li class="ss-c-pagination__item ss-c-pagination__item--ellipsis">
                    <span>…</span>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">4</a>
                </li>
                <li class="ss-c-pagination__item ss-c-pagination__item--active">
                    <a href="#" class="ss-c-pagination__link">5</a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">6</a>
                </li>
                <li class="ss-c-pagination__item ss-c-pagination__item--ellipsis">
                    <span>…</span>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">20</a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">»</a>
                </li>
            </ul>
        </nav>
    `,
};

export const PrevNextWithLabels: Story = {
    render: () => html`
        <nav aria-label="Simple pagination">
            <ul class="ss-c-pagination ss-c-pagination--simple">
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">
                        <span>← Previous</span>
                    </a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">
                        <span>Next →</span>
                    </a>
                </li>
            </ul>
        </nav>
    `,
};

export const PageInfo: Story = {
    render: () => html`
        <nav aria-label="Pagination with info" class="ss-c-pagination__wrapper">
            <span class="ss-c-pagination__info">Page 5 of 20</span>
            <ul class="ss-c-pagination">
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">Previous</a>
                </li>
                <li class="ss-c-pagination__item">
                    <a href="#" class="ss-c-pagination__link">Next</a>
                </li>
            </ul>
        </nav>
    `,
};
