const { createServer } = require("http");
const { Server } = require("socket.io");
// const eiows = require("eiows");
const fs = require('fs');

const httpServer = createServer((req, res) => {
    
    res.setHeader('Content-Type', 'text/html');

    // routing
    let path = './public/';
    switch(req.url) {
        case '/':
            path += 'index.html';
            res.statusCode = 200;
            break;
        case '/chat':
            path += 'chat.html';
            res.statusCode = 200;
            break;
        // CSS Files
        case '/styles.css':
            res.setHeader('Content-Type', 'text/css')
            path = 'styles.css'
            res.statusCode = 200;
            break;
        // JS Files
        case '/client.js':
            res.setHeader('Content-Type', 'text/javascript')
            path += 'client.js';
            res.statusCode = 200;
            break;
        case '/new_styles.css':
            res.setHeader('Content-Type', 'text/css');
            path = 'new_styles.css'
            res.statusCode = 200;
            break;
        default:
            path += '404.html';
            res.statusCode = 404;
        // Resources

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

// io.on("connection", (socket) => {
//     console.log("Client successfully connected");
// });

httpServer.listen(5500, 'localhost', () => {
    console.log("Listening on port 5500");
});

// httpServer.listen(5500);



