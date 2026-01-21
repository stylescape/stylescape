import { exec } from "child_process";
import micromatch from "micromatch";
import path from "path";
import { promisify } from "util";
import { defineConfig } from "vite";

import { createRequire } from "module";
import serveStatic from "serve-static";
const require = createRequire(import.meta.url); // eslint-disable-line @typescript-eslint/no-unused-vars
const pathToDist = path.resolve("dist");

const execAsync = promisify(exec);
const rootDir = process.cwd(); // eslint-disable-line @typescript-eslint/no-unused-vars

import { parse } from "url";

function getReloadPath() {
    const pathname = parse(
        new URL("http://localhost:3000" + (globalThis.__CURRENT_PATH__ || "/"))
            .pathname,
    ).pathname;
    return pathname.endsWith("/") ? pathname + "index.html" : pathname;
}

const watchGlobs = [
    "src/ts/**/*",
    "src/scss/**/*",
    "src/jinja/**/*",
    "kist.yml",
];

let lastBuild = 0;

async function runKist(server) {
    const now = Date.now();
    if (now - lastBuild < 500) return;
    lastBuild = now;

    // eslint-disable-next-line no-console
    console.log("[Kist] Running build...");
    try {
        const { stdout, stderr } = await execAsync(
            "npx kist --config ./kist.dev.yml",
        );
        // eslint-disable-next-line no-console
        if (stdout) console.log("[Kist] stdout:", stdout);
        // eslint-disable-next-line no-console
        if (stderr) console.error("[Kist] stderr:", stderr);
        // eslint-disable-next-line no-console
        console.log("[Kist] Build complete");

        // setTimeout(() => {
        //     server?.ws.send({
        //         type: 'full-reload',
        //         path: '*'
        //     });
        // }, 200);

        setTimeout(() => {
            const pathToReload = getReloadPath();
            server?.ws.send({
                type: "full-reload",
                path: pathToReload,
            });
        }, 200);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[Kist] Build failed:", err.stderr || err.message);
    }
}

export default defineConfig({
    root: ".",
    publicDir: false,
    server: {
        port: 3000,
        open: true,
        fs: { strict: false },
    },
    resolve: {
        alias: {
            "~": path.resolve(__dirname, "./node_modules"),
        },
    },
    plugins: [
        {
            name: "serve-kist-html",
            configureServer(server) {
                runKist(server);

                server.middlewares.use(
                    "/css",
                    serveStatic(path.join(pathToDist, "css")),
                );
                server.middlewares.use(
                    "/js",
                    serveStatic(path.join(pathToDist, "js")),
                );
                server.middlewares.use(
                    "/font",
                    serveStatic(path.join(pathToDist, "font")),
                );

                // Serve / as index.html
                server.middlewares.use((req, res, next) => {
                    if (req.url === "/") req.url = "/index.html";
                    next();
                });

                // Serve all static HTML/CSS/JS from dist/html
                server.middlewares.use(serveStatic(path.resolve("dist/html")));

                // server.middlewares.use((req, res, next) => {
                //     if (req.url === '/' || req.url === '/index.html') {
                //     req.url = '/dist/html/index.html';
                //     }
                //     next();
                // });

                server.watcher.on("change", (file) => {
                    const relativePath = path.relative(process.cwd(), file);
                    if (micromatch.isMatch(relativePath, watchGlobs)) {
                        // eslint-disable-next-line no-console
                        console.log(`[Kist] File changed: ${relativePath}`);
                        runKist(server);
                    }
                });
            },
        },
    ],
});
