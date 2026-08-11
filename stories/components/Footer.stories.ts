// ==========================================================================
// Stylescape | Storybook — Footer
// ==========================================================================
// Auto-generated from src/jinja/31-modules/footer.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Footer",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <footer class="ss-c-footer">
            <section>
                <h4 class="ss-c-footer__title">Product</h4>
                <a href="#">Features</a><a href="#">Pricing</a><a href="#">Changelog</a>
            </section>
            <section>
                <h4 class="ss-c-footer__title">Company</h4>
                <a href="#">About</a><a href="#">Contact</a><a href="#">Careers</a>
            </section>
            <section>
                <h4 class="ss-c-footer__title">Legal</h4>
                <a href="#">Terms</a><a href="#">Privacy</a><a href="#">Cookies</a>
            </section>
        </footer>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <footer class="ss-c-footer ss-c-footer--center">
            <section><p>&copy; 2026 Scape Press. All rights reserved.</p></section>
        </footer>
    `,
};
