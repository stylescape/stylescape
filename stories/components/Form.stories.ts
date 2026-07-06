// ==========================================================================
// Stylescape | Storybook — Form
// ==========================================================================
// Auto-generated from src/jinja/31-modules/form.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Form",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const SectionTitle: Story = {
    render: () => html`
        <form class="ss-c-form--col" method="post" action="/authentication/login/">
            <div class="ss-c-form__field">
                <input
                    type="text"
                    name="username"
                    id="id_username"
                    class="ss-c-form__field__input"
                    minlength="3"
                    maxlength="30"
                    placeholder="Username"
                    required
                    aria-labelledby="id_username_label"
                    aria-describedby="id_username_help id_username_error"
                />
                <label
                    for="id_username"
                    title="Please provide a username."
                    id="id_username_label"
                    class="ss-c-form__field__label"
                >
                    Username
                </label>
                <span id="id_username_help" class="ss-c-form__field__help">
                    Please provide a username.
                </span>
                <span
                    id="id_username_error"
                    class="ss-c-form__field__error"
                    aria-live="polite"
                >
                    Required. 30 characters or fewer. Letters and digits.
                </span>
            </div>

            <div class="ss-c-form__field">
                <input
                    type="password"
                    name="password"
                    id="id_password"
                    class=""
                    minlength="3"
                    maxlength="30"
                    placeholder="Password"
                    required
                    aria-labelledby="id_username_label"
                    aria-describedby="id_password_help id_password_error"
                />
                <label for="id_password" id="id_password_label" class="">
                    Password
                </label>
                <span id="id_password_help" class="ss-c-form__field__help">
                    Required. 8 characters or more.
                </span>
                <span
                    id="id_password_error"
                    class="ss-c-form__field__error"
                    aria-live="polite"
                >
                    Required. 8 characters or more.
                </span>
            </div>

            <div class="ss-c-form__field">
                <label for="id_remember_me" class="">Remember Me</label>
                <input
                    type="checkbox"
                    name="remember_me"
                    id="id_remember_me"
                    class=""
                />
                <span id="id_remember_me_help" class="ss-c-form__field__help">
                    Keep me logged in for 30 days.
                </span>
                <span
                    id="id_remember_me_error"
                    class="ss-c-form__field__error"
                    aria-live="polite"
                >
                    Keep me logged in for 30 days.
                </span>
            </div>

            <button
                type="button"
                class="ss-c-toggle-password"
                data-password-toggle="id_password"
                aria-pressed="false"
            >
                ◉ Toggle
            </button>

            <button type="submit" class="ss-c-button ss-c-button--solid">Login</button>

            <p>
                <span class="ss-c-req">*</span>
                - Required field
            </p>
        </form>
    `,
};
