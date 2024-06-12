import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { crx, defineManifest } from '@crxjs/vite-plugin'

const manifest = defineManifest({
  "manifest_version": 3,
  "name": "blobUrlTest",
  "version": "1.0.0",
  "description": "just a simple test",
  "permissions": [
    "runtime",
    "offscreen"
  ],
  "action": {
    "default_popup": "index.html",
    "default_title": "blobUrl test"
  },
  "content_scripts": [{
    "js": [
      "src/content.tsx"
    ],
    "matches": [
      "<all_urls>"
    ],
  }],
  "background": {
    "service_worker": "src/background.ts"
  },
  "web_accessible_resources":[
    {
      "resources":["*"],
      "matches":["<all_urls>"],
      "use_dynamic_url":true,
    }
  ]
})
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  build: {
    target: ['edge90', 'chrome90', 'firefox90', 'safari15'],
    rollupOptions: {
      input: {
        OffScreenHTML:path.resolve(__dirname,'offScreenHTML.html')
      },
    },
  },
  server: { port: 3000, hmr: { port: 3000 } }
})
