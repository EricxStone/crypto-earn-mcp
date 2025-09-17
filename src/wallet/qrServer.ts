import { createServer, Server } from 'http'

export class QrServer {
  public create (qrData: string): Server {
    return createServer((req, res) => {
      if (req.url === '/qr') {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Wallet Connect</title>
              <meta charset="utf-8">
              <style>
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  margin: 0; 
                  padding: 40px; 
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                .container {
                  background: white;
                  border-radius: 16px;
                  padding: 40px;
                  text-align: center;
                  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                  max-width: 400px;
                }
                h1 { color: #333; margin-bottom: 20px; }
                .qr-code { 
                  margin: 20px 0;
                  border-radius: 12px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .uri-text {
                  background: #f8f9fa;
                  padding: 15px;
                  border-radius: 8px;
                  font-family: monospace;
                  font-size: 10px;
                  word-break: break-all;
                  margin-top: 20px;
                  color: #666;
                }
                .status {
                  margin-top: 20px;
                  padding: 10px;
                  border-radius: 6px;
                  background: #e3f2fd;
                  color: #1976d2;
                }
              </style>
              <script>
                // Auto-refresh every 5 seconds to check connection status
                setTimeout(() => location.reload(), 5000);
              </script>
            </head>
            <body>
              <div class="container">
                <h1>🔗 Connect Your Wallet</h1>
                <p>Scan this QR code with your wallet app with crypto earn mcp:</p>
                <img src="${qrData}" alt="Wallet Connect QR Code" class="qr-code" style="width: 250px; height: 250px;" />
              </div>
            </body>
            </html>
          `)
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('404 Not Found')
      }
    })
  }
}
