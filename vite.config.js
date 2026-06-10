import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import os from 'node:os'
import path from 'node:path'

// 專案位於 OneDrive 同步資料夾內，OneDrive 會鎖住 Vite 預打包產生的暫存檔，
// 造成 dev server "Access is denied"。將快取目錄移到系統暫存資料夾（不被 OneDrive 同步）即可解決。
const cacheDir = path.join(os.tmpdir(), 'nutrition-demo-vite-cache')

export default defineConfig({
  plugins: [react(), tailwindcss()],
  cacheDir,
})
