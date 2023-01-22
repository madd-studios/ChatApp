const { createServer } = require("http");
const { Server } = require("socket.io");
const { db_client } = require('./utilities/configuration.js');
const { token_secret, password_salt } = require('./utilities/security.js');
const { css_routing, js_routing, image_routing } = require("./routing/resources.js");
const { router } = require("./routing/main.js");

// const eiows = require("eiows");
const fs = require('fs');

// db_client.query('SELECT * FROM base.users', (err, res) => {
//     if(err) {
//         console.log(err.stack);
//     }
//     else {
//         console.log(res.rows);
//     }
//     db_client.end();
// });



/*
    ROUTING CONFIGURATION

    SIDE NOTE: Maybe in the future you can have a way to pass the req.url to a series of functions
    that have routes related to a certain grouping (maybe styles, js, html). This would be a clean way
    to organize your routing.
*/

const httpServer = createServer((req, res) => {

    console.log(req.url);

    // routing
    let root_path = './public/',
        path,
        file_type;

    if(req.method === 'GET') {

        res.statusCode = 200;

        if(req.url.indexOf(".") > -1) {

            file_type = req.url.substring(req.url.indexOf(".")+1);

            // console.log(file_type);

            switch(file_type) {
                
                case "css":
                    path = css_routing(res, req);
                    break;
                
                case "js":
                    path = js_routing(res, req);
                    break;
                
                default:
                    path = image_routing(res, req);

                if(path == null) {
                    res.statusCode = 404;
                }

            }

        }
        else {

            path = router(res, req);

        }
    }

    
    // console.log(`PATH: ${path}`);
    // response
    fs.readFile(root_path + path, (err, data) => {
        if (err) {
            console.log("IN readFile");
            console.log(err.message);
            res.end();
        }
        else {
            res.end(data);
        }
    });

    // path = "";

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



