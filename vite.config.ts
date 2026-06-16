import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import viteTsConfigPaths from 'vite-tsconfig-paths'

const config = defineConfig(({ isSsrBuild }) => ({
  build: {
    rollupOptions: isSsrBuild ? {} : { output: { manualChunks } },
  },
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    checker({
      typescript: true,
    }),
  ],
}))

function manualChunks(id: string) {
  if (!id.includes('node_modules')) {
    return
  }

  if (id.includes('@tanstack')) {
    return 'tanstack'
  }

  if (id.includes('@base-ui') || id.includes('lucide-react')) {
    return 'ui'
  }

  if (id.includes('react') || id.includes('react-dom')) {
    return 'react'
  }

  return 'vendor'
}

export default config
