#!/usr/bin/env python3
import http.server
import socketserver
import os
import threading
import webbrowser
from urllib.parse import unquote

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers to allow cross-origin requests
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()
    
    def guess_type(self, path):
        # Handle CSS files properly
        if path.endswith('.css'):
            return 'text/css'
        elif path.endswith('.js'):
            return 'application/javascript'
        elif path.endswith('.svg'):
            return 'image/svg+xml'
        return super().guess_type(path)
    
    def do_GET(self):
        # Handle requests to serve the main page
        if self.path == '/' or self.path == '':
            self.path = '/gosuslugi-wrapper-burger-working-linked.html'
        
        # Decode URL-encoded paths (important for Cyrillic filenames)
        self.path = unquote(self.path)
        
        return super().do_GET()

if __name__ == "__main__":
    PORT = 8000
    DIRECTORY = "/app"
    
    class TCPServer(socketserver.TCPServer):
        allow_reuse_address = True
    
    # Change to the directory containing the website files
    os.chdir(DIRECTORY)
    
    # Create server
    with TCPServer(("0.0.0.0", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"Serving website at http://localhost:{PORT}")
        print(f"Available HTML files:")
        print(f"  - Main site: http://localhost:{PORT}")
        print(f"  - Output 1: http://localhost:{PORT}/output.html")
        print(f"  - Output 2: http://localhost:{PORT}/output2.html")
        print(f"  - Burger version: http://localhost:{PORT}/gosuslugi-wrapper-burger-working-linked.html")
        print(f"\nPress Ctrl+C to stop the server")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            httpd.shutdown()