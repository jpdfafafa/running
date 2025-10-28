const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  // 获取请求路径
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  
  // 处理文件扩展名
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  switch (extname) {
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
  }

  // 读取文件并响应
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// 启动服务
server.listen(port, () => {
  console.log(`服务器已启动：http://localhost:${port}`);
});

   