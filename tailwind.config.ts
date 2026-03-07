import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                digitaliate: {
                    DEFAULT: "#ed273a",
                    dark: "#8e2224",
                    light: "#fdf7f8"
                },
                payboys: {
                    DEFAULT: "#FFC107",
                    dark: "#CC9400",
                    light: "#FFF9E5"
                }
            },
        },
    },
    plugins: [],
};
export default config;
