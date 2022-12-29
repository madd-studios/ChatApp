const { createServer } = require("http");
const { Server } = require("socket.io");
// const eiows = require("eiows");
const fs = require('fs');
const httpServer = createServer((req, res) => {
    
    res.setHeader('Content-Type', 'text/html');

    // routing
    let path = './public/';

    if(req.method === 'GET') {
        switch(req.url) {
            case '/':
                path += 'index.html';
                res.statusCode = 200;
                break;
            case '/chat':
                path += 'chat.html';
                res.statusCode = 200;
                break;
            case '/dashboard':
                path += 'dashboard.html';
                res.statusCode = 200;
                break;
            // CSS Files
            case '/styles.css':
                res.setHeader('Content-Type', 'text/css');
                path = 'styles.css'
                res.statusCode = 200;
                break;
            case '/dash_styles.css':
                res.setHeader('Content-Type', 'text/css');
                path = 'dash_styles.css'
                res.statusCode = 200;
                break;
            // JS Files
            case '/client.js':
                res.setHeader('Content-Type', 'text/javascript');
                path += 'client.js';
                res.statusCode = 200;
                break;
            case '/index.js':
                res.setHeader('Content-Type', 'text/javascript');
                path += 'index.js';
                res.statusCode = 200;
                break;
            case '/chat.js':
                res.setHeader('Content-Type', 'text/javascript');
                path += 'chat.js';
                res.statusCode = 200;
                break;
            case '/new_styles.css':
                res.setHeader('Content-Type', 'text/css');
                path = 'new_styles.css'
                res.statusCode = 200;
                break;
            case '/assets/paper-plane.png':
                res.setHeader('Content-Type', 'image/png');
                path += "assets/paper-plane.png";
                res.statusCode = 200;
                break;
            case '/favicon.ico':
                res.setHeader('Content-Type', 'image/svg+xml');
                path += "assets/chat.png";
                res.statusCode = 200;
                break;
            case '/assets/user-white.svg':
                res.setHeader('Content-Type', 'image/svg+xml');
                path += "assets/user-white.svg";
                res.statusCode = 200;
                break;
            case '/assets/user-black.svg':
                res.setHeader('Content-Type', 'image/svg+xml');
                path += "assets/user-black.svg";
                res.statusCode = 200;
                break;

            default:
                path += '404.html';
                res.statusCode = 404;
            // Resources
            
        }
    }
    console.log(`PATH: ${path}`);
    // response
    fs.readFile(path, (err, data) => {
        if (err) {
            console.log("IN readFile");
            console.log(err.message);
            res.end();
        }
        else {
            res.end(data);
        }
    });

    path = "";

});

const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("Client successfully connected");

    socket.on("chat message", (message) => {
        console.log(`Message: ${message}`);
        socket.broadcast.emit("received message", message);
    });

});

httpServer.listen(5500, '0.0.0.0', () => {
    console.log("Listening on port 5500");
});

// httpServer.listen(5500);



