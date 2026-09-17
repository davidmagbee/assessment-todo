import 'dotenv/config'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'

// Start transforms routes and server boundaries before React compilation.
const config = defineConfig({
  server: { watch: { ignored: ['**/coverage/**'] } },
  resolve: { tsconfigPaths: true },
  plugins: [tanstackStart(), nitro(), viteReact()],
})

export default config
