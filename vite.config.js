import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'api-send-quote-dev',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/send-quote' && req.method === 'POST') {
              let body = ''
              req.on('data', (chunk) => {
                body += chunk
              })
              req.on('end', async () => {
                try {
                  process.env.RESEND_API_KEY = env.RESEND_API_KEY || process.env.RESEND_API_KEY
                  const { default: handler } = await import('./api/send-quote.js')
                  const mockRes = {
                    status(code) {
                      res.statusCode = code
                      return this
                    },
                    json(data) {
                      res.setHeader('Content-Type', 'application/json')
                      res.end(JSON.stringify(data))
                    },
                  }
                  const mockReq = {
                    method: req.method,
                    body: body ? JSON.parse(body) : {},
                  }
                  await handler(mockReq, mockRes)
                } catch (err) {
                  res.statusCode = 500
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ error: err.message }))
                }
              })
              return
            }
            next()
          })
        },
      },
    ],
    server: {
      host: true,
      port: 5173,
    },
    base: './',
    build: {
      cssTarget: 'chrome61',
    },
  }
})
