// ============================================================================
// Stylescape | Fetch Client
// ============================================================================
// A robust HTTP client for making API requests with built-in error handling.
// Can be initialized via data-ss-fetch attributes for declarative AJAX.
// ============================================================================

/**
 * Configuration options for FetchClient
 */
export interface FetchClientOptions {
    /** Base URL for all requests */
    baseUrl?: string;
    /** Default headers to include in all requests */
    headers?: Record<string, string>;
    /** Default timeout in milliseconds */
    timeout?: number;
    /** Whether to include credentials (cookies) */
    credentials?: RequestCredentials;
}

/**
 * Response wrapper with status information
 */
export interface FetchResponse<T = unknown> {
    data: T;
    status: number;
    statusText: string;
    headers: Headers;
    ok: boolean;
}

/**
 * A flexible HTTP client for making API requests.
 *
 * @example
 * ```typescript
 * const api = new FetchClient({ baseUrl: "/api" })
 * const users = await api.get("/users")
 * await api.post("/users", { name: "John" })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <form data-ss="fetch-form"
 *       data-ss-fetch-form-url="/api/submit"
 *       data-ss-fetch-form-method="POST">
 * </form>
 * ```
 */
export class FetchClient {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;
    private timeout: number;
    private credentials: RequestCredentials;

    constructor(options: FetchClientOptions = {}) {
        this.baseUrl = options.baseUrl || "";
        this.timeout = options.timeout || 30000;
        this.credentials = options.credentials || "same-origin";
        this.defaultHeaders = {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            ...options.headers,
        };
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Make a GET request
     */
    async get<T = unknown>(
        endpoint: string,
        params?: Record<string, string>,
        options?: RequestInit,
    ): Promise<FetchResponse<T>> {
        const url = this.buildUrl(endpoint, params);
        return this.request<T>(url, { ...options, method: "GET" });
    }

    /**
     * Make a POST request
     */
    async post<T = unknown>(
        endpoint: string,
        body?: unknown,
        options?: RequestInit,
    ): Promise<FetchResponse<T>> {
        const url = this.buildUrl(endpoint);
        return this.request<T>(url, {
            ...options,
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    /**
     * Make a PUT request
     */
    async put<T = unknown>(
        endpoint: string,
        body?: unknown,
        options?: RequestInit,
    ): Promise<FetchResponse<T>> {
        const url = this.buildUrl(endpoint);
        return this.request<T>(url, {
            ...options,
            method: "PUT",
            body: JSON.stringify(body),
        });
    }

    /**
     * Make a PATCH request
     */
    async patch<T = unknown>(
        endpoint: string,
        body?: unknown,
        options?: RequestInit,
    ): Promise<FetchResponse<T>> {
        const url = this.buildUrl(endpoint);
        return this.request<T>(url, {
            ...options,
            method: "PATCH",
            body: JSON.stringify(body),
        });
    }

    /**
     * Make a DELETE request
     */
    async delete<T = unknown>(
        endpoint: string,
        options?: RequestInit,
    ): Promise<FetchResponse<T>> {
        const url = this.buildUrl(endpoint);
        return this.request<T>(url, { ...options, method: "DELETE" });
    }

    /**
     * Submit a form via AJAX
     */
    async submitForm<T = unknown>(
        form: HTMLFormElement,
        options?: RequestInit,
    ): Promise<FetchResponse<T>> {
        const formData = new FormData(form);
        const url = form.action || window.location.href;
        const method = form.method?.toUpperCase() || "POST";

        return this.request<T>(url, {
            ...options,
            method,
            body: formData,
            headers: {
                ...this.getHeaders(),
                // Remove Content-Type to let browser set it with boundary for FormData
            },
        });
    }

    /**
     * Get CSRF token from cookies (for Django, Laravel, etc.)
     */
    getCSRFToken(cookieName: string = "csrftoken"): string {
        const cookies = document.cookie.split(";");
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split("=");
            if (name === cookieName) {
                return decodeURIComponent(value);
            }
        }
        return "";
    }

    /**
     * Set a default header for all future requests
     */
    setHeader(key: string, value: string): void {
        this.defaultHeaders[key] = value;
    }

    /**
     * Set the base URL
     */
    setBaseUrl(url: string): void {
        this.baseUrl = url;
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private async request<T>(
        url: string,
        options: RequestInit = {},
    ): Promise<FetchResponse<T>> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...this.getHeaders(),
                    ...(options.headers as Record<string, string>),
                },
                credentials: this.credentials,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            let data: T;
            const contentType = response.headers.get("Content-Type") || "";

            if (contentType.includes("application/json")) {
                data = await response.json();
            } else if (contentType.includes("text/")) {
                data = (await response.text()) as unknown as T;
            } else {
                data = (await response.blob()) as unknown as T;
            }

            const result: FetchResponse<T> = {
                data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                ok: response.ok,
            };

            if (!response.ok) {
                throw new FetchError(
                    `HTTP ${response.status}: ${response.statusText}`,
                    result,
                );
            }

            return result;
        } catch (error) {
            clearTimeout(timeoutId);

            if (error instanceof FetchError) {
                throw error;
            }

            if ((error as Error).name === "AbortError") {
                throw new FetchError("Request timeout", null);
            }

            throw new FetchError((error as Error).message, null);
        }
    }

    private buildUrl(
        endpoint: string,
        params?: Record<string, string>,
    ): string {
        const url = new URL(endpoint, this.baseUrl || window.location.origin);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        return url.toString();
    }

    private getHeaders(): Record<string, string> {
        return { ...this.defaultHeaders };
    }
}

/**
 * Custom error class for fetch errors
 */
export class FetchError extends Error {
    response: FetchResponse | null;

    constructor(message: string, response: FetchResponse | null) {
        super(message);
        this.name = "FetchError";
        this.response = response;
    }
}

// ============================================================================
// Default Instance
// ============================================================================

/** Default FetchClient instance */
export const fetchClient = new FetchClient();

export default FetchClient;
