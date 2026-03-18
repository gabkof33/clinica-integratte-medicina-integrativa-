const http = require("http");
const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const publicDir = path.join(rootDir, "public");
const allowedRoots = [publicDir, path.join(rootDir, "assets"), path.join(rootDir, "data")];

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function resolvePath(urlPath) {
  const safePath = decodeURIComponent(urlPath.split("?")[0]);
  if (safePath === "/") {
    return path.join(publicDir, "index.html");
  }

  if (safePath.startsWith("/assets/") || safePath.startsWith("/data/")) {
    return path.normalize(path.join(rootDir, safePath.replace(/^\/+/, "")));
  }

  return path.normalize(path.join(publicDir, safePath.replace(/^\/+/, "")));
}

function isAllowed(filePath) {
  return allowedRoots.some((allowedRoot) => filePath.startsWith(allowedRoot));
}

const server = http.createServer((request, response) => {
  const filePath = resolvePath(request.url || "/");

  if (!isAllowed(filePath)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Acesso negado.");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      const status = error.code === "ENOENT" ? 404 : 500;
      response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(status === 404 ? "Arquivo nao encontrado." : "Erro interno do servidor.");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, { "Content-Type": mimeTypes[extension] || "application/octet-stream" });
    response.end(content);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Servidor ativo em http://localhost:${port}`);
});
