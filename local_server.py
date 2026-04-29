import http.server
import socketserver
import os

class H(http.server.SimpleHTTPRequestHandler):
    def guess_type(self, path):
        ext = os.path.splitext(path)[1].lower()
        return {
            '.html':'text/html',
            '.css':'text/css',
            '.js':'application/javascript',
            '.png':'image/png',
            '.jpg':'image/jpeg',
            '.jpeg':'image/jpeg',
            '.json':'application/json',
            '.svg':'image/svg+xml'
        }.get(ext, 'application/octet-stream')

print("Starting server on port 8000...")
socketserver.TCPServer(('127.0.0.1', 8000), H).serve_forever()
