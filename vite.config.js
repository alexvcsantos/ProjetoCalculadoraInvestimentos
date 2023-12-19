import tailwindcss from "tailwindcss"
import { resolve } from "path"
import { defineConfig } from "vite"

export default defineConfig({
    base: "/ProjetoCalculadoraInvestimentos/",
    plugins: [],
    resolve: {
        /*something*/
    },
    css: {
        postcss: {
            plugins: [tailwindcss],
        },
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "./index.html"),
            },
        },
    },
})
