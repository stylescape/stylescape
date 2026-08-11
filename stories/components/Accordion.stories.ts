// ==========================================================================
// Stylescape | Storybook — Accordion
// ==========================================================================
// Auto-generated from src/jinja/31-modules/accordion.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Accordion",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SingleAccordion: Story = {
    render: () => html`
        <details class="ss-c-accordion">
            <summary class="ss-c-accordion__header">
                <span class="ss-c-accordion__title">Accordion Title</span>
                <span class="ss-c-accordion__icon"></span>
            </summary>
            <div class="ss-c-accordion__content">
                <p>
                    This is the accordion content. It can contain any HTML
                    elements including text, images, lists, and more.
                </p>
            </div>
        </details>
    `,
};

export const InitiallyOpen: Story = {
    render: () => html`
        <details class="ss-c-accordion" open>
            <summary class="ss-c-accordion__header">
                <span class="ss-c-accordion__title">
                    This accordion starts open
                </span>
                <span class="ss-c-accordion__icon"></span>
            </summary>
            <div class="ss-c-accordion__content">
                <p>
                    Use the "open" attribute on the details element to have it
                    expanded by default.
                </p>
            </div>
        </details>
    `,
};

export const StackedAccordions: Story = {
    render: () => html`
        <div class="ss-c-accordion_group">
            <details class="ss-c-accordion">
                <summary class="ss-c-accordion__header">
                    <span class="ss-c-accordion__title">What is Stylescape?</span>
                    <span class="ss-c-accordion__icon"></span>
                </summary>
                <div class="ss-c-accordion__content">
                    <p>
                        Stylescape is a visual identity framework that provides
                        a comprehensive design system for building consistent
                        user interfaces.
                    </p>
                </div>
            </details>

            <details class="ss-c-accordion">
                <summary class="ss-c-accordion__header">
                    <span class="ss-c-accordion__title">How do I get started?</span>
                    <span class="ss-c-accordion__icon"></span>
                </summary>
                <div class="ss-c-accordion__content">
                    <p>
                        Install Stylescape via npm and import the styles into
                        your project. Check the documentation for detailed
                        setup instructions.
                    </p>
                </div>
            </details>

            <details class="ss-c-accordion">
                <summary class="ss-c-accordion__header">
                    <span class="ss-c-accordion__title">Is it customizable?</span>
                    <span class="ss-c-accordion__icon"></span>
                </summary>
                <div class="ss-c-accordion__content">
                    <p>
                        Yes! Stylescape uses CSS custom properties that can be
                        easily customized to match your brand colors,
                        typography, and spacing.
                    </p>
                </div>
            </details>
        </div>
    `,
};

export const ExclusiveAccordionNameAttribute: Story = {
    render: () => html`
        <div class="ss-c-accordion_group">
            <details class="ss-c-accordion" name="faq-group" open>
                <summary class="ss-c-accordion__header">
                    <span class="ss-c-accordion__title">First Question</span>
                    <span class="ss-c-accordion__icon"></span>
                </summary>
                <div class="ss-c-accordion__content">
                    <p>
                        Only one accordion in this group can be open at a time.
                    </p>
                </div>
            </details>

            <details class="ss-c-accordion" name="faq-group">
                <summary class="ss-c-accordion__header">
                    <span class="ss-c-accordion__title">Second Question</span>
                    <span class="ss-c-accordion__icon"></span>
                </summary>
                <div class="ss-c-accordion__content">
                    <p>Opening this will automatically close the other.</p>
                </div>
            </details>

            <details class="ss-c-accordion" name="faq-group">
                <summary class="ss-c-accordion__header">
                    <span class="ss-c-accordion__title">Third Question</span>
                    <span class="ss-c-accordion__icon"></span>
                </summary>
                <div class="ss-c-accordion__content">
                    <p>This behavior uses the native HTML "name" attribute.</p>
                </div>
            </details>
        </div>
    `,
};

export const BorderedAccordion: Story = {
    render: () => html`
        <details class="ss-c-accordion ss-c-accordion--bordered">
            <summary class="ss-c-accordion__header">
                <span class="ss-c-accordion__title">Bordered Style</span>
                <span class="ss-c-accordion__icon"></span>
            </summary>
            <div class="ss-c-accordion__content">
                <p>This accordion has a visible border around it.</p>
            </div>
        </details>
    `,
};

export const FilledAccordion: Story = {
    render: () => html`
        <details class="ss-c-accordion ss-c-accordion--filled">
            <summary class="ss-c-accordion__header">
                <span class="ss-c-accordion__title">Filled Background</span>
                <span class="ss-c-accordion__icon"></span>
            </summary>
            <div class="ss-c-accordion__content">
                <p>This accordion has a filled background color.</p>
            </div>
        </details>
    `,
};

export const FlushAccordion: Story = {
    render: () => html`
        <div class="ss-c-accordion_group ss-c-accordion_group--flush">
            <details class="ss-c-accordion">
                <summary class="ss-c-accordion__header">
                    <span class="ss-c-accordion__title">Flush Item One</span>
                    <span class="ss-c-accordion__icon"></span>
                </summary>
                <div class="ss-c-accordion__content">
                    <p>
                        No outer borders or rounded corners for a cleaner look.
                    </p>
                </div>
            </details>

            <details class="ss-c-accordion">
                <summary class="ss-c-accordion__header">
                    <span class="ss-c-accordion__title">Flush Item Two</span>
                    <span class="ss-c-accordion__icon"></span>
                </summary>
                <div class="ss-c-accordion__content">
                    <p>
                        Works well when embedded in cards or other containers.
                    </p>
                </div>
            </details>
        </div>
    `,
};

export const MixedContent: Story = {
    render: () => html`
        <details class="ss-c-accordion">
            <summary class="ss-c-accordion__header">
                <span class="ss-c-accordion__title">
                    Accordion with Rich Content
                </span>
                <span class="ss-c-accordion__icon"></span>
            </summary>
            <div class="ss-c-accordion__content">
                <h4>Section Heading</h4>
                <p>Paragraph content explaining the section.</p>
                <ul>
                    <li>List item one</li>
                    <li>List item two</li>
                    <li>List item three</li>
                </ul>
                <button class="ss-c-button ss-c-button--primary">Action Button</button>
            </div>
        </details>
    `,
};
