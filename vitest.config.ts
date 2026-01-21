// ============================================================================
// Stylescape | Vitest Configuration
// ============================================================================

import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
    test: {
        // Test environment
        environment: "jsdom",

        // Test file patterns
        include: ["tst/**/*.{test,spec}.{ts,tsx}"],
        exclude: ["node_modules", "dist"],

        // Setup files
        setupFiles: ["./tst/setup.ts"],

        // Coverage configuration
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "lcov"],
            reportsDirectory: "./coverage",
            include: ["src/ts/**/*.ts"],
            exclude: [
                "src/ts/**/*.d.ts",
                "src/ts/**/index.ts",
                "node_modules"
            ],
            thresholds: {
                lines: 60,
                functions: 60,
                branches: 50,
                statements: 60
            }
        },

        // Globals
        globals: true,

        // Reporter
        reporters: ["verbose"],

        // Timeout for tests
        testTimeout: 10000,

        // Watch mode exclusions
        watchExclude: ["node_modules", "dist"]
    },

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src/ts")
        }
    }
})
