// ==========================================================================
// Stylescape | Storybook — Drilldown
// ==========================================================================
// Auto-generated from src/jinja/31-modules/drilldown.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Drilldown",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <form name="form1" id="form1" action="/action_page.php">
            Subjects:
            <select name="subject" id="subject">
                <option value="" selected="selected">Select subject</option>
            </select>
            <br />
            <br />
            Topics:
            <select name="topic" id="topic">
                <option value="" selected="selected">
                    Please select subject first
                </option>
            </select>
            <br />
            <br />
            Chapters:
            <select name="chapter" id="chapter">
                <option value="" selected="selected">
                    Please select topic first
                </option>
            </select>
            <br />
            <br />
            <input type="submit" value="Submit" />
        </form>
    `,
};
