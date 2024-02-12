import * as express from 'express';
import * as path from 'path';
export var router = express.Router();
import { __dirname } from '../app.js';

/* GET home page. */
router.get('/', function(req, res, next) {

    // We can always access the subscribers from global.subscribers

    let id;

    do {
        id = Math.random();
    }while (id in Object.keys(global.subscribers));

    res.setHeader('Content-Type', 'application/json');
    // What exactly is this cache header doing?
    res.setHeader("Cache-Control", "no-cache, must-revalidate");

    global.subscribers[id] = res;

    req.on('close', () => {
        delete subscribers[id];
    });

    // global.subscribers.push({req, res});

});

router.post('/', function (req, res, next) {

    console.log("HIT LP CHAT ROUTE");

    const msg = req.body;

    // Loop through all of the long polling subscribers

    if(msg.type === "data") {

        try {
            Object.keys(global.subscribers).forEach(function each(id) {
                global.subscribers[id].end(JSON.stringify({
                    type: "message",
                    data: msg.data
                }));
            });
        } catch(err) {
            console.error(`Line 34: ${err.toString()}`);
            console.error("ERROR when sending longpolling messages from chat");
        }

        // Loop through all of the websocket connections
    
        try{
            global.wss.forEach((ws) => {
                ws.send(JSON.stringify({
                    type: "message",
                    data: msg.data
                }));
            });
        } catch(err) {
            console.error("ERROR when sending websocket messages from chat")
        }
    }

});