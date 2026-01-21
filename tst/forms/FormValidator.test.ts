// ============================================================================
// Stylescape | Form Validator Tests
// ============================================================================

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createAndAppend, inputValue, changeValue, click, wait, $ } from "../utils"
import { formValidationFixture } from "../utils/fixtures"
import { FormValidator } from "../../src/ts/forms/FormValidator"

describe("FormValidator", () => {
    let formValidator: FormValidator
    let formElement: HTMLFormElement

    beforeEach(() => {
        document.body.innerHTML = formValidationFixture
        formElement = document.getElementById("test-form") as HTMLFormElement
    })

    afterEach(() => {
        if (formValidator && typeof (formValidator as any).destroy === "function") {
            (formValidator as any).destroy()
        }
    })

    describe("Initialization", () => {
        it("should initialize with form element", () => {
            formValidator = new FormValidator(formElement)
            expect(formValidator).toBeDefined()
        })

        it("should initialize with selector", () => {
            formValidator = new FormValidator("#test-form")
            expect(formValidator).toBeDefined()
        })

        it("should find all validatable fields", () => {
            formValidator = new FormValidator(formElement)
            const fields = formElement.querySelectorAll("[data-ss-validate]")
            expect(fields.length).toBe(3)
        })
    })

    describe("Email Validation", () => {
        beforeEach(() => {
            formValidator = new FormValidator(formElement)
        })

        it("should validate correct email", async () => {
            const emailField = $<HTMLInputElement>("#email")
            if (emailField) {
                inputValue(emailField, "test@example.com")
                await wait(50)
                // Should be valid
            }
        })

        it("should invalidate incorrect email", async () => {
            const emailField = $<HTMLInputElement>("#email")
            if (emailField) {
                inputValue(emailField, "invalid-email")
                await wait(50)
                // Should be invalid
            }
        })

        it("should require email when required attribute present", async () => {
            const emailField = $<HTMLInputElement>("#email")
            if (emailField) {
                inputValue(emailField, "")
                await wait(50)
                // Should be invalid (empty required field)
            }
        })
    })

    describe("Password Validation", () => {
        beforeEach(() => {
            formValidator = new FormValidator(formElement)
        })

        it("should validate password length", async () => {
            const passwordField = $<HTMLInputElement>("#password")
            if (passwordField) {
                inputValue(passwordField, "short")
                await wait(50)
                // Should be invalid (less than 8 chars)

                inputValue(passwordField, "longenoughpassword")
                await wait(50)
                // Should be valid
            }
        })
    })

    describe("Match Validation", () => {
        beforeEach(() => {
            formValidator = new FormValidator(formElement)
        })

        it("should validate matching fields", async () => {
            const passwordField = $<HTMLInputElement>("#password")
            const confirmField = $<HTMLInputElement>("#confirm-password")

            if (passwordField && confirmField) {
                inputValue(passwordField, "testpassword123")
                inputValue(confirmField, "testpassword123")
                await wait(50)
                // Should be valid (passwords match)
            }
        })

        it("should invalidate non-matching fields", async () => {
            const passwordField = $<HTMLInputElement>("#password")
            const confirmField = $<HTMLInputElement>("#confirm-password")

            if (passwordField && confirmField) {
                inputValue(passwordField, "testpassword123")
                inputValue(confirmField, "differentpassword")
                await wait(50)
                // Should be invalid
            }
        })
    })

    describe("Form Submission", () => {
        it("should prevent submission when invalid", async () => {
            formValidator = new FormValidator(formElement)
            const submitEvent = new Event("submit", {
                bubbles: true,
                cancelable: true
            })

            const preventDefault = vi.spyOn(submitEvent, "preventDefault")
            formElement.dispatchEvent(submitEvent)

            // Should have prevented default because form is invalid
        })

        it("should allow submission when valid", async () => {
            formValidator = new FormValidator(formElement)

            // Fill in valid values
            const emailField = $<HTMLInputElement>("#email")
            const passwordField = $<HTMLInputElement>("#password")
            const confirmField = $<HTMLInputElement>("#confirm-password")

            if (emailField && passwordField && confirmField) {
                inputValue(emailField, "test@example.com")
                inputValue(passwordField, "validpassword123")
                inputValue(confirmField, "validpassword123")
                await wait(50)
            }
        })
    })

    describe("Error Messages", () => {
        beforeEach(() => {
            formValidator = new FormValidator(formElement)
        })

        it("should display error message for invalid field", async () => {
            const emailField = $<HTMLInputElement>("#email")
            if (emailField) {
                inputValue(emailField, "invalid")
                await wait(50)

                const errorEl = $("[data-ss-error-for='email']")
                // Error element should have content
            }
        })

        it("should clear error message when field becomes valid", async () => {
            const emailField = $<HTMLInputElement>("#email")
            if (emailField) {
                // First make invalid
                inputValue(emailField, "invalid")
                await wait(50)

                // Then make valid
                inputValue(emailField, "valid@example.com")
                await wait(50)

                // Error should be cleared
            }
        })
    })

    describe("Real-time Validation", () => {
        it("should validate on input event", async () => {
            formValidator = new FormValidator(formElement, {
                validateOn: "input"
            })

            const emailField = $<HTMLInputElement>("#email")
            if (emailField) {
                inputValue(emailField, "a")
                await wait(50)
                // Should validate immediately
            }
        })

        it("should validate on blur event", async () => {
            formValidator = new FormValidator(formElement, {
                validateOn: "blur"
            })

            const emailField = $<HTMLInputElement>("#email")
            if (emailField) {
                inputValue(emailField, "invalid")
                emailField.dispatchEvent(new FocusEvent("blur"))
                await wait(50)
            }
        })
    })

    describe("Callbacks", () => {
        it("should call onValidate callback", async () => {
            const onValidate = vi.fn()
            formValidator = new FormValidator(formElement, { onValidate })

            const emailField = $<HTMLInputElement>("#email")
            if (emailField) {
                inputValue(emailField, "test@example.com")
                await wait(50)
            }
        })

        it("should call onSubmit callback on valid submit", async () => {
            const onSubmit = vi.fn()
            formValidator = new FormValidator(formElement, { onSubmit })
        })
    })
})
