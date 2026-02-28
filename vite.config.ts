/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
const fileNames: string[] = [
  'src',
  'app',
  'assets',
  'components',
  'features',
  'pages',
  'services',
  'store',
  'test',
  'theme',
  'utils',
]

type AliasKey = (typeof fileNames)[number]

const filePaths: Record<AliasKey, string> = fileNames.reduce(
  (acc, cur) => {
    acc[cur] = `/${cur === 'src' ? cur : `src/${cur}`}`
    return acc
  },
  {} as Record<AliasKey, string>,
)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: filePaths,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
})
