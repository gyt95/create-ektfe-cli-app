import { defineConfig } from 'vite'
import { PortName, ViteConfig } from '../../vite.base.config'
import { name } from './package.json'
const htmlName: PortName = name.split('/')[1].replace(/-/g, '') as PortName

// https://vitejs.dev/config/
export default defineConfig({
  ...ViteConfig({
    htmlName,
    dirname: __dirname,
    // proxy_url: 'http://192.168.2.130:9756',
  }),
})
