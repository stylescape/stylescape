// ============================================================================
// Stylescape | Fetch Client Tests
// ============================================================================

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";
import {
    FetchClient,
    FetchError,
    fetchClient,
} from "../../src/ts/utilities/FetchClient";

type FakeResponseInit = {
    status?: number;
    statusText?: string;
    contentType?: string;
    body?: unknown;
};

function fakeResponse({
    status = 200,
    statusText = "OK",
    contentType = "application/json",
    body = {},
}: FakeResponseInit = {}) {
    return {
        status,
        statusText,
        ok: status >= 200 && status < 300,
        headers: { get: (h: string) => (h === "Content-Type" ? contentType : null) },
        json: async () => body,
        text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
        blob: async () => body,
    };
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
    fetchMock = vi.fn(async () => fakeResponse());
    vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe("FetchClient", () => {
    describe("request methods", () => {
        it("performs a GET and unwraps JSON data", async () => {
            fetchMock.mockResolvedValueOnce(
                fakeResponse({ body: { id: 1, name: "John" } }),
            );
            const api = new FetchClient({ baseUrl: "https://x.test" });

            const res = await api.get("/users");

            expect(res.ok).toBe(true);
            expect(res.status).toBe(200);
            expect(res.data).toEqual({ id: 1, name: "John" });
            const [url, init] = fetchMock.mock.calls[0];
            expect(url).toBe("https://x.test/users");
            expect(init.method).toBe("GET");
        });

        it("appends query params to GET requests", async () => {
            const api = new FetchClient({ baseUrl: "https://x.test" });
            await api.get("/search", { q: "hello", page: "2" });

            const [url] = fetchMock.mock.calls[0];
            expect(url).toContain("q=hello");
            expect(url).toContain("page=2");
        });

        it("serialises the body and sets method for POST", async () => {
            const api = new FetchClient({ baseUrl: "https://x.test" });
            await api.post("/users", { name: "Ada" });

            const [, init] = fetchMock.mock.calls[0];
            expect(init.method).toBe("POST");
            expect(init.body).toBe(JSON.stringify({ name: "Ada" }));
            expect((init.headers as Record<string, string>)["Content-Type"]).toBe(
                "application/json",
            );
        });

        it("supports PUT, PATCH and DELETE", async () => {
            const api = new FetchClient({ baseUrl: "https://x.test" });
            await api.put("/u/1", { a: 1 });
            await api.patch("/u/1", { b: 2 });
            await api.delete("/u/1");

            expect(fetchMock.mock.calls[0][1].method).toBe("PUT");
            expect(fetchMock.mock.calls[1][1].method).toBe("PATCH");
            expect(fetchMock.mock.calls[2][1].method).toBe("DELETE");
        });

        it("parses text responses when Content-Type is text/*", async () => {
            fetchMock.mockResolvedValueOnce(
                fakeResponse({ contentType: "text/plain", body: "plain body" }),
            );
            const api = new FetchClient();
            const res = await api.get("https://x.test/thing");
            expect(res.data).toBe("plain body");
        });
    });

    describe("error handling", () => {
        it("throws a FetchError on non-ok responses", async () => {
            fetchMock.mockResolvedValueOnce(
                fakeResponse({ status: 404, statusText: "Not Found" }),
            );
            const api = new FetchClient({ baseUrl: "https://x.test" });

            await expect(api.get("/missing")).rejects.toBeInstanceOf(
                FetchError,
            );
        });

        it("exposes the response on the thrown FetchError", async () => {
            fetchMock.mockResolvedValueOnce(
                fakeResponse({ status: 500, statusText: "Server Error" }),
            );
            const api = new FetchClient({ baseUrl: "https://x.test" });

            await api.get("/boom").catch((err: FetchError) => {
                expect(err).toBeInstanceOf(FetchError);
                expect(err.response?.status).toBe(500);
            });
            expect.assertions(2);
        });

        it("maps an AbortError to a timeout FetchError", async () => {
            const abort = Object.assign(new Error("aborted"), {
                name: "AbortError",
            });
            fetchMock.mockRejectedValueOnce(abort);
            const api = new FetchClient({ baseUrl: "https://x.test" });

            await expect(api.get("/slow")).rejects.toMatchObject({
                name: "FetchError",
                message: "Request timeout",
            });
        });

        it("wraps generic network errors in a FetchError", async () => {
            fetchMock.mockRejectedValueOnce(new Error("network down"));
            const api = new FetchClient({ baseUrl: "https://x.test" });

            await expect(api.get("/x")).rejects.toMatchObject({
                name: "FetchError",
                message: "network down",
            });
        });
    });

    describe("configuration helpers", () => {
        it("merges custom default headers into requests", async () => {
            const api = new FetchClient({
                baseUrl: "https://x.test",
                headers: { Authorization: "Bearer token" },
            });
            await api.get("/me");

            const [, init] = fetchMock.mock.calls[0];
            expect(
                (init.headers as Record<string, string>).Authorization,
            ).toBe("Bearer token");
        });

        it("setHeader adds a header used by later requests", async () => {
            const api = new FetchClient({ baseUrl: "https://x.test" });
            api.setHeader("X-Custom", "42");
            await api.get("/a");

            const [, init] = fetchMock.mock.calls[0];
            expect((init.headers as Record<string, string>)["X-Custom"]).toBe(
                "42",
            );
        });

        it("setBaseUrl changes the resolved request URL", async () => {
            const api = new FetchClient();
            api.setBaseUrl("https://api.example.com");
            await api.get("/ping");

            expect(fetchMock.mock.calls[0][0]).toBe(
                "https://api.example.com/ping",
            );
        });

        it("reads a CSRF token from document.cookie", () => {
            document.cookie = "csrftoken=abc123";
            const api = new FetchClient();
            expect(api.getCSRFToken()).toBe("abc123");
            expect(api.getCSRFToken("missing")).toBe("");
        });
    });

    describe("submitForm", () => {
        it("sends form data using the form's method", async () => {
            const form = document.createElement("form");
            form.action = "https://x.test/submit";
            form.method = "post";
            form.innerHTML = `<input name="email" value="a@b.c" />`;
            document.body.appendChild(form);

            const api = new FetchClient();
            await api.submitForm(form);

            const [url, init] = fetchMock.mock.calls[0];
            expect(url).toBe("https://x.test/submit");
            expect(init.method).toBe("POST");
            expect(init.body).toBeInstanceOf(FormData);
        });
    });

    describe("default instance", () => {
        it("exports a ready-to-use singleton", async () => {
            expect(fetchClient).toBeInstanceOf(FetchClient);
            await fetchClient.get("https://x.test/ok");
            expect(fetchMock).toHaveBeenCalled();
        });
    });
});
