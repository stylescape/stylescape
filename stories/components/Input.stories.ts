// ==========================================================================
// Stylescape | Storybook — Input
// ==========================================================================
// Auto-generated from src/jinja/31-modules/input.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Input",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <div class="">
            <label>Default Inline:</label>
            <span>I am</span>
            <label for="input_text_name" class="ss-c-label ss-c-label--hidden">
                Name
            </label>
            <input
                type="text"
                id="input_text_name"
                class="ss-c-input ss-c-input--base--inline"
                placeholder="Name"
            />
            <span>and I live in</span>
            <label for="input_text_place" class="ss-c-label ss-c-label--hidden">
                Place
            </label>
            <input
                type="text"
                id="input_text_place"
                class="ss-c-input ss-c-input--base--inline"
                placeholder="Place"
            />
        </div>
        <div class="">
            <label>Straight Inline:</label>
            <span>I am</span>
            <label for="input_text_name" class="ss-c-label ss-c-label--hidden">
                Name
            </label>
            <input
                type="text"
                id="input_text_name"
                class="ss-c-input ss-c-input--base--inline ss-c-input--style--straight"
                placeholder="Name"
            />
            <span>and I live in</span>
            <label for="input_text_place" class="ss-c-label ss-c-label--hidden">
                Place
            </label>
            <input
                type="text"
                id="input_text_place"
                class="ss-c-input ss-c-input--base--inline ss-c-input--style--straight"
                placeholder="Place"
            />
        </div>
        <div class="">
            <label>Rounded Inline:</label>
            <span>I am</span>
            <label for="input_text_name" class="ss-c-label ss-c-label--hidden">
                Name
            </label>
            <input
                type="text"
                id="input_text_name"
                class="ss-c-input ss-c-input--base--inline ss-c-input--style--rounded"
                placeholder="Name"
            />
            <span>and I live in</span>
            <label for="input_text_place" class="ss-c-label ss-c-label--hidden">
                Place
            </label>
            <input
                type="text"
                id="input_text_place"
                class="ss-c-input ss-c-input--base--inline ss-c-input--style--rounded"
                placeholder="Place"
            />
        </div>
        <div class="">
            <label>Underline Inline:</label>
            <span>I am</span>
            <label for="input_text_name" class="ss-c-label ss-c-label--hidden">
                Name
            </label>
            <input
                type="text"
                id="input_text_name"
                class="ss-c-input ss-c-input--base--inline ss-c-input--style--underline"
                placeholder="Name"
            />
            <span>and I live in</span>
            <label for="input_text_place" class="ss-c-label ss-c-label--hidden">
                Place
            </label>
            <input
                type="text"
                id="input_text_place"
                class="ss-c-input ss-c-input--base--inline ss-c-input--style--underline"
                placeholder="Place"
            />
        </div>
        <div class="">
            <label>Filled Inline:</label>
            <span>I am</span>
            <label for="input_text_name" class="ss-c-label ss-c-label--hidden">
                Name
            </label>
            <input
                type="text"
                id="input_text_name"
                class="ss-c-input ss-c-input--base--inline ss-c-input--style--filled"
                placeholder="Name"
            />
            <span>and I live in</span>
            <label for="input_text_place" class="ss-c-label ss-c-label--hidden">
                Place
            </label>
            <input
                type="text"
                id="input_text_place"
                class="ss-c-input ss-c-input--base--inline ss-c-input--style--filled"
                placeholder="Place"
            />
        </div>
    `,
};

export const SectionTitle2: Story = {
    render: () => html`
        <div class="">
            <label>Default form:</label>
            <label for="input_text_name" class="ss-c-label">Name</label>
            <input
                type="text"
                id="input_text_name"
                class="ss-c-input ss-c-input--base--form"
                placeholder="Name"
            />
        </div>
        <div class="">
            <label>Straight form:</label>
            <label for="input_text_name" class="ss-c-label">Name</label>
            <input
                type="text"
                id="input_text_name"
                class="ss-c-input ss-c-input--base--form ss-c-input--style--straight"
                placeholder="Name"
            />
        </div>
        <div class="">
            <label>Rounded form:</label>
            <label for="input_text_name" class="ss-c-label">Name</label>
            <input
                type="text"
                id="input_text_name"
                class="ss-c-input ss-c-input--base--form ss-c-input--style--rounded"
                placeholder="Name"
            />
        </div>
        <div class="">
            <label>Underline form:</label>
            <label for="input_text_name" class="ss-c-label">Name</label>
            <input
                type="text"
                id="input_text_name"
                class="ss-c-input ss-c-input--base--form ss-c-input--style--underline"
                placeholder="Name"
            />
        </div>
        <div class="">
            <label>Filled form:</label>
            <label for="input_text_name" class="ss-c-label">Name</label>
            <input
                type="text"
                id="input_text_name"
                class="ss-c-input ss-c-input--base--form ss-c-input--style--filled"
                placeholder="Name"
            />
        </div>
    `,
};

export const SectionTitle3: Story = {
    render: () => html`
        <!-- Default -->
        <div class="ss-c-field-group">
            <label for="default" class="ss-c-label">Default</label>
            <input
                id="default"
                type="text"
                class="ss-c-input"
                placeholder="Default"
            />
        </div>

        <!-- Focus -->
        <div class="ss-c-field-group">
            <label for="focus" class="ss-c-label">Focus</label>
            <input
                id="focus"
                type="text"
                class="ss-c-input"
                placeholder="Focus me"
            />
        </div>

        <!-- Disabled -->
        <div class="ss-c-field-group">
            <label for="disabled" class="ss-c-label">Disabled</label>
            <input
                id="disabled"
                type="text"
                class="ss-c-input"
                disabled
                placeholder="Can't type"
            />
        </div>

        <!-- Success -->
        <div class="ss-c-field-group">
            <label for="success" class="ss-c-label">Success</label>
            <input
                id="success"
                type="text"
                class="ss-c-input ss-c-is_success"
                placeholder="Valid input"
            />
        </div>

        <!-- Warning -->
        <div class="ss-c-field-group">
            <label for="warning" class="ss-c-label">Warning</label>
            <input
                id="warning"
                type="text"
                class="ss-c-input ss-c-is_warning"
                placeholder="Might need attention"
            />
        </div>

        <!-- Error -->
        <div class="ss-c-field-group">
            <label for="error" class="ss-c-label">Error</label>
            <input
                id="error"
                type="text"
                class="ss-c-input ss-c-is_error"
                placeholder="Incorrect input"
            />
        </div>

        <!-- Info -->
        <div class="ss-c-field-group">
            <label for="info" class="ss-c-label">Info</label>
            <input
                id="info"
                type="text"
                class="ss-c-input ss-c-is_info"
                placeholder="Helpful context"
            />
        </div>

        <!-- Focus-visible test -->
        <div class="ss-c-field-group">
            <label for="focus-visible" class="ss-c-label">
                Focus-visible (keyboard tab)
            </label>
            <input
                id="focus-visible"
                type="text"
                class="ss-c-input"
                placeholder="Tab into me"
            />
        </div>
    `,
};

export const SectionTitle4: Story = {
    render: () => html`
        <div class="">
            <label>Default form:</label>
            <label for="input_text_name" class="ss-c-label">Name</label>
            <input
                type="text"
                id="input_text_name"
                class="ss-c-input ss-c-input--base--form"
                placeholder="Name"
            />
        </div>
        <div class="">
            <label>Straight form:</label>
            <label for="input_text_name" class="ss-c-label">Name</label>
            <input
                type="text"
                id="input_text_name"
                class="ss-c-input ss-c-input--base--form ss-c-input--style--straight"
                placeholder="Name"
            />
        </div>
        <div class="">
            <label>Rounded form:</label>
            <label for="input_text_name" class="ss-c-label">Name</label>
            <input
                type="text"
                id="input_text_name"
                class="ss-c-input ss-c-input--base--form ss-c-input--style--rounded"
                placeholder="Name"
            />
        </div>
        <div class="">
            <label>Underline form:</label>
            <label for="input_text_name" class="ss-c-label">Name</label>
            <input
                type="text"
                id="input_text_name"
                class="ss-c-input ss-c-input--base--form ss-c-input--style--underline"
                placeholder="Name"
            />
        </div>
        <div class="">
            <label>Filled form:</label>
            <label for="input_text_name" class="ss-c-label">Name</label>
            <input
                type="text"
                id="input_text_name"
                class="ss-c-input ss-c-input--base--form ss-c-input--style--filled"
                placeholder="Name"
            />
        </div>
    `,
};

export const SectionTitle5: Story = {
    render: () => html`
        <form class="ss-c-form--col">
            <label for="name">Name</label>
            <input
                type="text"
                id="name"
                class="ss-c-input"
                placeholder="Your full name"
            />
            <label for="email">Email</label>
            <input
                type="email"
                id="email"
                class="ss-c-input"
                placeholder="you@example.com"
            />
            <label for="bio">Bio</label>
            <textarea
                id="bio"
                class="ss-c-input"
                rows="4"
                placeholder="Tell us something..."
            ></textarea>
            <button type="submit" class="ss-c-button ss-c-button--solid">Submit</button>
            <button type="reset" class="ss-c-button ss-c-button--solid">Reset</button>
        </form>
    `,
};

export const SectionTitle6: Story = {
    render: () => html`
        <form class="ss-c-form--col">
            <div class="ss-c-form__field">
                <label for="name">Name</label>
                <input
                    type="text"
                    id="name"
                    class="ss-c-input"
                    placeholder="Your full name"
                />
            </div>

            <div class="ss-c-form__field">
                <label for="email">Email</label>
                <input
                    type="email"
                    id="email"
                    class="ss-c-input"
                    placeholder="you@example.com"
                />
            </div>

            <div class="ss-c-form__field">
                <label for="bio">Bio</label>
                <textarea
                    id="bio"
                    class="ss-c-input"
                    rows="4"
                    placeholder="Tell us something..."
                ></textarea>
            </div>

            <div class="ss-c-form__control">
                <button type="submit" class="ss-c-button ss-c-button--solid">
                    Submit
                </button>
                <button type="reset" class="ss-c-button ss-c-button--solid">
                    Reset
                </button>
            </div>
        </form>
    `,
};

export const SectionTitle7: Story = {
    render: () => html`
        <form class="ss-c-form--row">
            <label for="name">Name</label>
            <input
                type="text"
                id="name"
                class="ss-c-input"
                placeholder="Your full name"
            />
            <label for="email">Email</label>
            <input
                type="email"
                id="email"
                class="ss-c-input"
                placeholder="you@example.com"
            />
            <label for="bio">Bio</label>
            <textarea
                id="bio"
                class="ss-c-input"
                rows="4"
                placeholder="Tell us something..."
            ></textarea>
            <button type="submit" class="ss-c-button ss-c-button--solid">Submit</button>
            <button type="reset" class="ss-c-button ss-c-button--solid">Reset</button>
        </form>
    `,
};

export const SectionTitle8: Story = {
    render: () => html`
        <form class="ss-c-form--row">
            <div class="ss-c-form__field">
                <label for="name">Name</label>
                <input
                    type="text"
                    id="name"
                    class="ss-c-input"
                    placeholder="Your full name"
                />
            </div>

            <div class="ss-c-form__field">
                <label for="email">Email</label>
                <input
                    type="email"
                    id="email"
                    class="ss-c-input"
                    placeholder="you@example.com"
                />
            </div>

            <div class="ss-c-form__field">
                <label for="bio">Bio</label>
                <textarea
                    id="bio"
                    class="ss-c-input"
                    rows="4"
                    placeholder="Tell us something..."
                ></textarea>
            </div>

            <div class="ss-c-form__control">
                <button type="submit" class="ss-c-button ss-c-button--solid">
                    Submit
                </button>
                <button type="reset" class="ss-c-button ss-c-button--solid">
                    Reset
                </button>
            </div>
        </form>
    `,
};

export const SectionTitle9: Story = {
    render: () => html`
        <div style="max-width: 400px">
            <label
                style="display: block; margin-bottom: 8px; font-weight: 500"
            >
                Description
            </label>
            <textarea
                class="ss-c-textarea"
                rows="4"
                placeholder="Enter your description here..."
                style="
                    width: 100%;
                    padding: 12px;
                    border: 1px solid var(--color_line_secondary);
                    border-radius: 8px;
                    font-family: inherit;
                    font-size: 14px;
                    resize: vertical;
                    box-sizing: border-box;
                "
            ></textarea>
        </div>
    `,
};

export const SectionTitle10: Story = {
    render: () => html`
        <div style="max-width: 400px">
            <label
                style="display: block; margin-bottom: 8px; font-weight: 500"
            >
                Bio
            </label>
            <textarea
                class="ss-c-textarea"
                rows="4"
                maxlength="200"
                placeholder="Tell us about yourself..."
                style="
                    width: 100%;
                    padding: 12px;
                    border: 1px solid var(--color_line_secondary);
                    border-radius: 8px;
                    font-family: inherit;
                    font-size: 14px;
                    resize: vertical;
                    box-sizing: border-box;
                "
            ></textarea>
            <div
                style="
                    display: flex;
                    justify-content: space-between;
                    margin-top: 6px;
                    font-size: 12px;
                    opacity: 0.7;
                "
            >
                <span>Maximum 200 characters</span>
                <span>0 / 200</span>
            </div>
        </div>
    `,
};

export const SectionTitle11: Story = {
    render: () => html`
        <div
            style="
                display: flex;
                flex-direction: column;
                gap: 20px;
                max-width: 400px;
            "
        >
            <!-- Small -->
            <div>
                <label
                    style="display: block; margin-bottom: 6px; font-size: 13px"
                >
                    Small
                </label>
                <textarea
                    class="ss-c-textarea ss-c-textarea--small"
                    rows="2"
                    placeholder="Small textarea..."
                    style="
                        width: 100%;
                        padding: 8px 10px;
                        border: 1px solid var(--color_line_secondary);
                        border-radius: 6px;
                        font-family: inherit;
                        font-size: 13px;
                        resize: vertical;
                        box-sizing: border-box;
                    "
                ></textarea>
            </div>
            <!-- Medium -->
            <div>
                <label
                    style="display: block; margin-bottom: 6px; font-size: 14px"
                >
                    Medium (Default)
                </label>
                <textarea
                    class="ss-c-textarea"
                    rows="3"
                    placeholder="Medium textarea..."
                    style="
                        width: 100%;
                        padding: 12px;
                        border: 1px solid var(--color_line_secondary);
                        border-radius: 8px;
                        font-family: inherit;
                        font-size: 14px;
                        resize: vertical;
                        box-sizing: border-box;
                    "
                ></textarea>
            </div>
            <!-- Large -->
            <div>
                <label
                    style="display: block; margin-bottom: 6px; font-size: 15px"
                >
                    Large
                </label>
                <textarea
                    class="ss-c-textarea ss-c-textarea--large"
                    rows="5"
                    placeholder="Large textarea..."
                    style="
                        width: 100%;
                        padding: 16px;
                        border: 1px solid var(--color_line_secondary);
                        border-radius: 10px;
                        font-family: inherit;
                        font-size: 16px;
                        resize: vertical;
                        box-sizing: border-box;
                    "
                ></textarea>
            </div>
        </div>
    `,
};

export const SectionTitle12: Story = {
    render: () => html`
        <div
                    style="
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                        max-width: 400px;
                    "
                >
                    <!-- Focus State -->
                    <div>
                        <label style="display: block; margin-bottom: 6px">
                            Focused
                        </label>
                        <textarea
                            class="ss-c-textarea focus"
                            rows="3"
                            placeholder="Focused textarea..."
                            style="
                                width: 100%;
                                padding: 12px;
                                border: 2px solid var(--color_fill_primary);
                                border-radius: 8px;
                                font-family: inherit;
                                font-size: 14px;
                                resize: vertical;
                                box-sizing: border-box;
                                outline: none;
                                box-shadow: 0 0 0 3px
                                    rgba(var(--color_fill_primary), 0.2);
                            "
                        ></textarea>
                    </div>
                    <!-- Disabled State -->
                    <div>
                        <label
                            style="display: block; margin-bottom: 6px; opacity: 0.5"
                        >
                            Disabled
                        </label>
                        <textarea
                            class="ss-c-textarea disabled"
                            rows="3"
                            disabled
                            placeholder="Disabled textarea..."
                            style="
                                width: 100%;
                                padding: 12px;
                                border: 1px solid var(--color_line_secondary);
                                border-radius: 8px;
                                font-family: inherit;
                                font-size: 14px;
                                resize: vertical;
                                box-sizing: border-box;
                                background: var(--color_fill_secondary);
                                opacity: 0.6;
                                cursor: not-allowed;
                            "
                        ></textarea>
                    </div>
                    <!-- Error State -->
                    <div>
                        <label style="display: block; margin-bottom: 6px">Error</label>
                        <textarea
                            class="ss-c-textarea ss-c-error"
                            rows="3"
                            placeholder="Error textarea..."
                            style="
                                width: 100%;
                                padding: 12px;
                                border: 2px solid var(--color_state_error);
                                border-radius: 8px;
                                font-family: inherit;
                                font-size: 14px;
                                resize: vertical;
                                box-sizing: border-box;
                            "
                        ></textarea>
                        <span
                            style="
                                display: block;
                                margin-top: 6px;
                                font-size: 13px;
                                color: var(--color_state_error);
                            "
                        >
                            This field is required
                        </span>
                    </div>
                    <!-- Success State -->
                    <div>
                        <label style="display: block; margin-bottom: 6px">
                            Success
                        </label>
                        <textarea
                            class="ss-c-textarea ss-c-success"
                            rows="3"
                            style="
                                width: 100%;
                                padding: 12px;
                                border: 2px solid var(--color_state_success);
                                border-radius: 8px;
                                font-family: inherit;
                                font-size: 14px;
                                resize: vertical;
                                box-sizing: border-box;
                            "
                        >
        Valid content here</textarea
                        >
                        <span
                            style="
                                display: block;
                                margin-top: 6px;
                                font-size: 13px;
                                color: var(--color_state_success);
                            "
                        >
                            ✓ Looks good!
                        </span>
                    </div>
                </div>
    `,
};

export const SectionTitle13: Story = {
    render: () => html`
        <div
            style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
            "
        >
            <!-- Vertical Resize -->
            <div>
                <label
                    style="display: block; margin-bottom: 6px; font-size: 13px"
                >
                    Vertical Resize
                </label>
                <textarea
                    rows="3"
                    placeholder="Resize vertically..."
                    style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid var(--color_line_secondary);
                        border-radius: 6px;
                        font-family: inherit;
                        resize: vertical;
                        box-sizing: border-box;
                    "
                ></textarea>
            </div>
            <!-- Horizontal Resize -->
            <div>
                <label
                    style="display: block; margin-bottom: 6px; font-size: 13px"
                >
                    Horizontal Resize
                </label>
                <textarea
                    rows="3"
                    placeholder="Resize horizontally..."
                    style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid var(--color_line_secondary);
                        border-radius: 6px;
                        font-family: inherit;
                        resize: horizontal;
                        box-sizing: border-box;
                    "
                ></textarea>
            </div>
            <!-- No Resize -->
            <div>
                <label
                    style="display: block; margin-bottom: 6px; font-size: 13px"
                >
                    No Resize
                </label>
                <textarea
                    rows="3"
                    placeholder="Cannot resize..."
                    style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid var(--color_line_secondary);
                        border-radius: 6px;
                        font-family: inherit;
                        resize: none;
                        box-sizing: border-box;
                    "
                ></textarea>
            </div>
        </div>
    `,
};
