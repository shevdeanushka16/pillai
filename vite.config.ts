import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import type { ServerResponse, IncomingMessage } from 'node:http'

function orbitSyncPlugin(): Plugin {
  const clients = new Set<ServerResponse>()
  let lastState: Record<string, unknown> | null = null

  return {
    name: 'orbit-sync-plugin',
    configureServer(server) {
      server.middlewares.use('/api/sync/stream', (req: IncomingMessage, res: ServerResponse) => {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
        })
        res.write('\n')
        clients.add(res)

        if (lastState) {
          res.write(`data: ${JSON.stringify(lastState)}\n\n`)
        }

        req.on('close', () => {
          clients.delete(res)
        })
      })

      server.middlewares.use('/api/sync/broadcast', (req: IncomingMessage, res: ServerResponse) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk: Buffer) => {
            body += chunk.toString()
          })
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              lastState = data
              const message = `data: ${body}\n\n`
              for (const client of clients) {
                client.write(message)
              }
              res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              })
              res.end(JSON.stringify({ success: true, clientCount: clients.size }))
            } catch {
              res.writeHead(400)
              res.end('Invalid JSON')
            }
          })
        } else {
          res.writeHead(405)
          res.end()
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), orbitSyncPlugin()],
  server: {
    host: true,
    port: 5173,
  },
})
