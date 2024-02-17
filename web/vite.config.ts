import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import {VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VitePWA({
    registerType: "autoUpdate",
    workbox: {
      sourcemap: true
    },
    manifest: {
      id: "/index.html",
      name: "Talented Gamblers",
      short_name: "TalentedGamblers",
      description: "App for talented gamblers",
      start_url: "/index.html",
      display: "standalone",
      background_color: "#000000",
      theme_color: "#000000",
      icons: [
        {
          src: "TG192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "TG512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    },
    
 })],
  resolve: {
    alias: {
      '@/src': path.resolve(__dirname, './src'),
      '@/shared': path.resolve(__dirname, '../apisrc/src/shared'),
      "@/types": path.resolve(__dirname, "../apisrc/src/types")
    },
  },
  build: {
    rollupOptions: {
        output:{
            manualChunks(id) {
                if (id.includes('node_modules')) {
                    return id.toString().split('node_modules/')[1].split('/')[0].toString();
                }
            }
        }
    }
}
})
