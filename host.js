const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3030;
const DOCS = path.join(__dirname, "docs");

const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".webp": "image/webp",
    ".txt": "text/plain"
};

const server = http.createServer((req, res) => {

    let filePath = path.join(
        DOCS,
        req.url === "/" ? "index.html" : req.url
    );

    // Prevent directory traversal
    if (!filePath.startsWith(DOCS)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (err, content) => {

        if (err) {

            if (err.code === "ENOENT") {

                fs.readFile(path.join(DOCS, "404.html"), (err404, page404) => {

                    if (!err404) {
                        res.writeHead(404, {
                            "Content-Type": "text/html"
                        });
                        res.end(page404);
                    } else {
                        res.writeHead(404);
                        res.end("404 - File Not Found");
                    }

                });

            } else {

                res.writeHead(500);
                res.end("Server Error");

            }

            return;
        }

        const ext = path.extname(filePath).toLowerCase();

        res.writeHead(200, {
            "Content-Type": mimeTypes[ext] || "application/octet-stream"
        });

        res.end(content);

    });

});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
});