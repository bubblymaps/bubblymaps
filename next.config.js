/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    output: "standalone",
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    allowedDevOrigins: [
        "https://bubblymaps.org",
        "https://beta.bubblymaps.org",
        "https://devtest.bubblymaps.org",
    ]
};

export default config;