// ============================================================================
// Stylescape | Form Validator
// ============================================================================
// Validates form inputs with customizable rules and error display.
// Supports data-ss-validate attributes for declarative validation.
// ============================================================================

/**
 * Validation rule definition
 */
export interface ValidationRule {
    /** Rule type or custom validator function */
    type:
        | "required"
        | "email"
        | "minLength"
        | "maxLength"
        | "pattern"
        | "match"
        | "custom";
    /** Error message to display */
    message: string;
    /** Value for the rule (e.g., minLength value, pattern regex) */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: any;
    /** Custom validator function */
    validator?: (value: string, field: HTMLInputElement) => boolean;
}

/**
 * Configuration options for FormValidator
 */
export interface FormValidatorOptions {
    /** Validate on input (default: true) */
    validateOnInput?: boolean;
    /** Validate on blur (default: true) */
    validateOnBlur?: boolean;
    /** Show errors inline (default: true) */
    showInlineErrors?: boolean;
    /** CSS class for invalid fields */
    invalidClass?: string;
    /** CSS class for valid fields */
    validClass?: string;
    /** CSS class for error messages */
    errorClass?: string;
    /** Callback when form is valid */
    onValid?: (form: HTMLFormElement) => void;
    /** Callback when form is invalid */
    onInvalid?: (errors: Map<string, string[]>) => void;
    /** Callback on field validation */
    onFieldValidate?: (
        field: HTMLInputElement,
        isValid: boolean,
        errors: string[],
    ) => void;
}

/**
 * Form validator with customizable rules and real-time feedback.
 *
 * @example JavaScript
 * ```typescript
 * const validator = new FormValidator("#myForm", {
 *     onValid: (form) => form.submit()
 * })
 * validator.addRule("email", { type: "email", message: "Invalid email" })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <form data-ss="validate" data-ss-validate-on-blur="true">
 *     <input name="email"
 *            data-ss-validate-required="Email is required"
 *            data-ss-validate-email="Invalid email format">
 *     <input name="password"
 *            data-ss-validate-required="Password is required"
 *            data-ss-validate-min-length="8"
 *            data-ss-validate-min-length-message="Min 8 characters">
 * </form>
 * ```
 */
export class FormValidator {
    private form: HTMLFormElement | null;
    private options: Required<FormValidatorOptions>;
    private rules: Map<string, ValidationRule[]> = new Map();
    private errors: Map<string, string[]> = new Map();

    constructor(
        formSelectorOrElement: string | HTMLFormElement,
        options: FormValidatorOptions = {},
    ) {
        this.form =
            typeof formSelectorOrElement === "string"
                ? document.querySelector<HTMLFormElement>(
                      formSelectorOrElement,
                  )
                : formSelectorOrElement;

        this.options = {
            validateOnInput: options.validateOnInput !== false,
            validateOnBlur: options.validateOnBlur !== false,
            showInlineErrors: options.showInlineErrors !== false,
            invalidClass: options.invalidClass ?? "input--invalid",
            validClass: options.validClass ?? "input--valid",
            errorClass: options.errorClass ?? "input__error",
            onValid: options.onValid ?? (() => {}),
            onInvalid: options.onInvalid ?? (() => {}),
            onFieldValidate: options.onFieldValidate ?? (() => {}),
        };

        if (!this.form) {
            console.warn("[Stylescape] FormValidator form not found");
            return;
        }

        this.init();
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Add validation rule for a field
     */
    public addRule(fieldName: string, rule: ValidationRule): void {
        const existing = this.rules.get(fieldName) || [];
        existing.push(rule);
        this.rules.set(fieldName, existing);
    }

    /**
     * Remove all rules for a field
     */
    public removeRules(fieldName: string): void {
        this.rules.delete(fieldName);
    }

    /**
     * Validate entire form
     */
    public validate(): boolean {
        this.errors.clear();
        let isValid = true;

        this.getFields().forEach((field) => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (isValid) {
            if (this.form) this.options.onValid(this.form);
        } else {
            this.options.onInvalid(this.errors);
        }

        return isValid;
    }

    /**
     * Validate a single field
     */
    public validateField(field: HTMLInputElement): boolean {
        const fieldName = field.name;
        const value = field.value.trim();
        const rules = this.rules.get(fieldName) || [];
        const fieldErrors: string[] = [];

        // Add rules from data attributes
        const dataRules = this.parseDataRules(field);
        const allRules = [...rules, ...dataRules];

        for (const rule of allRules) {
            if (!this.checkRule(rule, value, field)) {
                fieldErrors.push(rule.message);
            }
        }

        // Update errors map
        if (fieldErrors.length > 0) {
            this.errors.set(fieldName, fieldErrors);
        } else {
            this.errors.delete(fieldName);
        }

        // Update UI
        this.updateFieldUI(field, fieldErrors);
        this.options.onFieldValidate(
            field,
            fieldErrors.length === 0,
            fieldErrors,
        );

        return fieldErrors.length === 0;
    }

    /**
     * Get all errors
     */
    public getErrors(): Map<string, string[]> {
        return new Map(this.errors);
    }

    /**
     * Get errors for a specific field
     */
    public getFieldErrors(fieldName: string): string[] {
        return this.errors.get(fieldName) || [];
    }

    /**
     * Clear all validation state
     */
    public clear(): void {
        this.errors.clear();
        this.getFields().forEach((field) => {
            field.classList.remove(
                this.options.invalidClass,
                this.options.validClass,
            );
            this.removeErrorMessage(field);
        });
    }

    /**
     * Destroy the validator
     */
    public destroy(): void {
        this.form?.removeEventListener("submit", this.handleSubmit);
        this.getFields().forEach((field) => {
            field.removeEventListener("input", this.handleFieldInput);
            field.removeEventListener("blur", this.handleFieldBlur);
        });
        this.form = null;
        this.rules.clear();
        this.errors.clear();
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private init(): void {
        if (!this.form) return;

        // Prevent default form submission
        this.form.addEventListener("submit", this.handleSubmit);

        // Add field listeners
        this.getFields().forEach((field) => {
            if (this.options.validateOnInput) {
                field.addEventListener("input", this.handleFieldInput);
            }
            if (this.options.validateOnBlur) {
                field.addEventListener("blur", this.handleFieldBlur);
            }
        });

        // Set novalidate to use custom validation
        this.form.setAttribute("novalidate", "");
    }

    private handleSubmit = (e: Event): void => {
        e.preventDefault();
        if (this.validate() && this.form) {
            this.options.onValid(this.form);
        }
    };

    private handleFieldInput = (e: Event): void => {
        this.validateField(e.target as HTMLInputElement);
    };

    private handleFieldBlur = (e: Event): void => {
        this.validateField(e.target as HTMLInputElement);
    };

    private getFields(): HTMLInputElement[] {
        if (!this.form) return [];
        return Array.from(
            this.form.querySelectorAll<HTMLInputElement>(
                "input:not([type='submit']):not([type='button']), textarea, select",
            ),
        );
    }

    private parseDataRules(field: HTMLInputElement): ValidationRule[] {
        const rules: ValidationRule[] = [];
        const prefix = "data-ss-validate-";

        // Required
        if (field.hasAttribute(`${prefix}required`)) {
            rules.push({
                type: "required",
                message:
                    field.getAttribute(`${prefix}required`) ||
                    "This field is required",
            });
        }

        // Email
        if (field.hasAttribute(`${prefix}email`)) {
            rules.push({
                type: "email",
                message:
                    field.getAttribute(`${prefix}email`) ||
                    "Invalid email address",
            });
        }

        // Min length
        const minLength = field.getAttribute(`${prefix}min-length`);
        if (minLength) {
            rules.push({
                type: "minLength",
                value: parseInt(minLength, 10),
                message:
                    field.getAttribute(`${prefix}min-length-message`) ||
                    `Minimum ${minLength} characters required`,
            });
        }

        // Max length
        const maxLength = field.getAttribute(`${prefix}max-length`);
        if (maxLength) {
            rules.push({
                type: "maxLength",
                value: parseInt(maxLength, 10),
                message:
                    field.getAttribute(`${prefix}max-length-message`) ||
                    `Maximum ${maxLength} characters allowed`,
            });
        }

        // Pattern
        const pattern = field.getAttribute(`${prefix}pattern`);
        if (pattern) {
            rules.push({
                type: "pattern",
                value: new RegExp(pattern),
                message:
                    field.getAttribute(`${prefix}pattern-message`) ||
                    "Invalid format",
            });
        }

        // Match another field
        const match = field.getAttribute(`${prefix}match`);
        if (match) {
            rules.push({
                type: "match",
                value: match,
                message:
                    field.getAttribute(`${prefix}match-message`) ||
                    "Fields do not match",
            });
        }

        return rules;
    }

    private checkRule(
        rule: ValidationRule,
        value: string,
        field: HTMLInputElement,
    ): boolean {
        switch (rule.type) {
            case "required":
                return value.length > 0;

            case "email":
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

            case "minLength":
                return value.length >= rule.value;

            case "maxLength":
                return value.length <= rule.value;

            case "pattern":
                return rule.value.test(value);

            case "match": {
                const matchField = this.form?.querySelector<HTMLInputElement>(
                    `[name="${rule.value}"]`,
                );
                return matchField ? value === matchField.value : false;
            }

            case "custom":
                return rule.validator ? rule.validator(value, field) : true;

            default:
                return true;
        }
    }

    private updateFieldUI(field: HTMLInputElement, errors: string[]): void {
        const isValid = errors.length === 0;

        field.classList.toggle(this.options.invalidClass, !isValid);
        field.classList.toggle(
            this.options.validClass,
            isValid && field.value.length > 0,
        );

        // Update ARIA
        field.setAttribute("aria-invalid", String(!isValid));

        // Show/hide error message
        if (this.options.showInlineErrors) {
            this.removeErrorMessage(field);
            if (!isValid) {
                this.showErrorMessage(field, errors[0]);
            }
        }
    }

    private showErrorMessage(field: HTMLInputElement, message: string): void {
        const errorId = `${field.name}-error`;
        const errorEl = document.createElement("div");
        errorEl.id = errorId;
        errorEl.className = this.options.errorClass;
        errorEl.textContent = message;
        errorEl.setAttribute("role", "alert");

        field.setAttribute("aria-describedby", errorId);
        field.parentNode?.insertBefore(errorEl, field.nextSibling);
    }

    private removeErrorMessage(field: HTMLInputElement): void {
        const errorId = `${field.name}-error`;
        const errorEl = document.getElementById(errorId);
        errorEl?.remove();
        field.removeAttribute("aria-describedby");
    }
}

export default FormValidator;
