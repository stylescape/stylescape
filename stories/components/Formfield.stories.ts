// ==========================================================================
// Stylescape | Storybook — Formfield
// ==========================================================================
// Auto-generated from src/jinja/31-modules/formfield.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Formfield",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const TextInputField: Story = {
    render: () => html`
        <div class="ss-c-formfield">
            <label class="ss-c-formfield__label" for="name">Full Name</label>
            <input
                class="ss-c-formfield__input"
                type="text"
                id="name"
                placeholder="Enter your name"
            />
        </div>
    `,
};

export const RequiredField: Story = {
    render: () => html`
        <div class="ss-c-formfield ss-c-formfield--required">
            <label class="ss-c-formfield__label" for="email">Email Address</label>
            <input
                class="ss-c-formfield__input"
                type="email"
                id="email"
                placeholder="you@example.com"
                required
            />
        </div>
    `,
};

export const WithHelperText: Story = {
    render: () => html`
        <div class="ss-c-formfield">
            <label class="ss-c-formfield__label" for="password">Password</label>
            <input
                class="ss-c-formfield__input"
                type="password"
                id="password"
                placeholder="Enter password"
            />
            <span class="ss-c-formfield__hint">Must be at least 8 characters</span>
        </div>
    `,
};

export const SuccessState: Story = {
    render: () => html`
        <div class="ss-c-formfield ss-c-formfield--success">
            <label class="ss-c-formfield__label" for="username">Username</label>
            <input
                class="ss-c-formfield__input"
                type="text"
                id="username"
                value="johndoe"
            />
            <span class="ss-c-formfield__hint ss-c-formfield__hint--success">
                Username is available
            </span>
        </div>
    `,
};

export const ErrorState: Story = {
    render: () => html`
        <div class="ss-c-formfield ss-c-formfield--error">
            <label class="ss-c-formfield__label" for="email-error">Email</label>
            <input
                class="ss-c-formfield__input"
                type="email"
                id="email-error"
                value="invalid-email"
            />
            <span class="ss-c-formfield__hint ss-c-formfield__hint--error">
                Please enter a valid email address
            </span>
        </div>
    `,
};

export const WarningState: Story = {
    render: () => html`
        <div class="ss-c-formfield ss-c-formfield--warning">
            <label class="ss-c-formfield__label" for="password-warn">
                Password
            </label>
            <input
                class="ss-c-formfield__input"
                type="password"
                id="password-warn"
                value="weak"
            />
            <span class="ss-c-formfield__hint ss-c-formfield__hint--warning">
                Password strength: Weak
            </span>
        </div>
    `,
};

export const BasicRadioGroup: Story = {
    render: () => html`
        <fieldset class="ss-c-formfield ss-c-formfield--group">
            <legend class="ss-c-formfield__label">Select an option</legend>
            <div class="ss-c-formfield__options">
                <label class="ss-c-formfield__radio">
                    <input type="radio" name="option" value="1" checked />
                    <span class="ss-c-formfield__radio-label">Option One</span>
                </label>
                <label class="ss-c-formfield__radio">
                    <input type="radio" name="option" value="2" />
                    <span class="ss-c-formfield__radio-label">Option Two</span>
                </label>
                <label class="ss-c-formfield__radio">
                    <input type="radio" name="option" value="3" />
                    <span class="ss-c-formfield__radio-label">Option Three</span>
                </label>
            </div>
        </fieldset>
    `,
};

export const InlineRadioGroup: Story = {
    render: () => html`
        <fieldset class="ss-c-formfield ss-c-formfield--group">
            <legend class="ss-c-formfield__label">Payment Method</legend>
            <div class="ss-c-formfield__options ss-c-formfield__options--inline">
                <label class="ss-c-formfield__radio">
                    <input type="radio" name="payment" value="card" checked />
                    <span class="ss-c-formfield__radio-label">Credit Card</span>
                </label>
                <label class="ss-c-formfield__radio">
                    <input type="radio" name="payment" value="paypal" />
                    <span class="ss-c-formfield__radio-label">PayPal</span>
                </label>
                <label class="ss-c-formfield__radio">
                    <input type="radio" name="payment" value="bank" />
                    <span class="ss-c-formfield__radio-label">Bank Transfer</span>
                </label>
            </div>
        </fieldset>
    `,
};

export const CheckboxGroup: Story = {
    render: () => html`
        <fieldset class="ss-c-formfield ss-c-formfield--group">
            <legend class="ss-c-formfield__label">Select your interests</legend>
            <div class="ss-c-formfield__options">
                <label class="ss-c-formfield__checkbox">
                    <input
                        type="checkbox"
                        name="interest"
                        value="design"
                        checked
                    />
                    <span class="ss-c-formfield__checkbox-label">Design</span>
                </label>
                <label class="ss-c-formfield__checkbox">
                    <input
                        type="checkbox"
                        name="interest"
                        value="development"
                    />
                    <span class="ss-c-formfield__checkbox-label">Development</span>
                </label>
                <label class="ss-c-formfield__checkbox">
                    <input type="checkbox" name="interest" value="marketing" />
                    <span class="ss-c-formfield__checkbox-label">Marketing</span>
                </label>
            </div>
        </fieldset>
    `,
};

export const SingleCheckbox: Story = {
    render: () => html`
        <div class="ss-c-formfield">
            <label class="ss-c-formfield__checkbox">
                <input type="checkbox" name="terms" required />
                <span class="ss-c-formfield__checkbox-label">
                    I agree to the terms and conditions
                </span>
            </label>
        </div>
    `,
};

export const SelectDropdown: Story = {
    render: () => html`
        <div class="ss-c-formfield">
            <label class="ss-c-formfield__label" for="country">Country</label>
            <select class="ss-c-formfield__select" id="country">
                <option value="">Select a country</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="ca">Canada</option>
                <option value="au">Australia</option>
            </select>
        </div>
    `,
};

export const Textarea: Story = {
    render: () => html`
        <div class="ss-c-formfield">
            <label class="ss-c-formfield__label" for="message">Message</label>
            <textarea
                class="ss-c-formfield__textarea"
                id="message"
                rows="4"
                placeholder="Enter your message"
            ></textarea>
            <span class="ss-c-formfield__hint">Maximum 500 characters</span>
        </div>
    `,
};

export const DisabledInput: Story = {
    render: () => html`
        <div class="ss-c-formfield ss-c-formfield--disabled">
            <label class="ss-c-formfield__label" for="disabled-input">
                Disabled Field
            </label>
            <input
                class="ss-c-formfield__input"
                type="text"
                id="disabled-input"
                value="Cannot be edited"
                disabled
            />
        </div>
    `,
};
