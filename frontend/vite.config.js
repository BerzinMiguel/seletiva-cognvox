import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Necessário para o Docker expor o IP
    port: 80,    // Porta exigida no teste
    watch: {
      usePolling: true // Melhora o funcionamento no Windows
    }
  }
})