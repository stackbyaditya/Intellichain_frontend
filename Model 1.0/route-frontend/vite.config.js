
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        }
    },
    optimizeDeps: {
        include: ['react-map-gl/maplibre', 'mapbox-gl', 'react-chartjs-2', 'chart.js'],
    },
    build: {
        commonjsOptions: {
            include: [/node_modules/],
            transformMixedEsModules: true,
        },
    },
});
