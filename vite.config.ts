import Tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import Solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [
    AutoImport({
      dirs: [
        'src/components/**',
        'src/utils/**',
        'src/stores/**',
        'src/business/**',
      ],
      imports: [
        'solid-js',
        '@solidjs/router',
        { 'class-variance-authority': ['cva', 'cx'] },
      ],
      resolvers: [IconsResolver({ extension: 'jsx', prefix: 'Icon' })],
    }),
    Icons({ compiler: 'solid' }),
    Pages(),
    Solid(),
    Tailwindcss(),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/mailihome': 'http://host.docker.internal:28930',
      // '/mailihome': 'https://supd.mailihome.com',
      '/v3/api-docs': 'http://host.docker.internal:28930/',
    },
  },
})
