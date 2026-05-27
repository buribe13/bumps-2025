"""
Dev server: serves static files and proxies OpenAI API requests to avoid CORS.
Usage: python3 server.py
"""

import http.server
import json
import socketserver
import ssl
import urllib.error
import urllib.request

try:
    import certifi

    SSL_CONTEXT = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    SSL_CONTEXT = ssl.create_default_context()

PORT = 3000


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        path = getattr(self, "path", "")
        if path.startswith("/.well-known/") or path == "/favicon.ico":
            return
        super().log_message(format, *args)

    def do_GET(self):
        if self.path.startswith("/.well-known/"):
            self.send_error(404)
            return
        super().do_GET()

    def do_POST(self):
        if self.path == "/api/chat":
            self._proxy_openai()
        else:
            self.send_error(404)

    def _proxy_openai(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)
        api_key = self.headers.get("X-API-Key", "")

        req = urllib.request.Request(
            "https://api.openai.com/v1/chat/completions",
            data=body,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}",
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(req, context=SSL_CONTEXT) as resp:
                data = resp.read()
                self.send_response(resp.status)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(data)
        except urllib.error.HTTPError as e:
            error_body = e.read()
            self.send_response(e.code)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(error_body)
        except Exception as e:
            error_msg = json.dumps({"error": {"message": str(e)}})
            self.send_response(502)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(error_msg.encode())

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-API-Key")
        self.end_headers()


if __name__ == "__main__":
    socketserver.ThreadingMixIn.daemon_threads = True

    with socketserver.ThreadingTCPServer(("127.0.0.1", PORT), Handler) as httpd:
        print(f"Serving on http://127.0.0.1:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down.")
