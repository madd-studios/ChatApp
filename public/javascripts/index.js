// Great explanation of async js: https://www.youtube.com/watch?v=FVZ-A_Akros

// Hoisting explained: https://www.youtube.com/watch?v=EvfRXyKa_GI

const connection = {
    "ws": undefined,
    "connecting": false,
    "isAlive": true
};

const startingTime = Date.now();

addEventListener('load', () => {

    main();

});

function main() {

    init_event_handlers();

}

// Event Functions

function init_event_handlers() {

    document.getElementById("btn-connect").addEventListener("click", click_connect);

    document.getElementById("btn-disconnect").addEventListener("click", click_disconnect);

    document.getElementById("btn-send").addEventListener("click", click_send);

}

function click_connect(event) {

    connection["connecting"] = true;

    connection["ws"] = new WebSocket('ws://localhost:3000/chat');

    connection["ws"].addEventListener('error', function(err) {
        console.log("Failed to connect to websocket...");
        console.error(err);
    });

    // connection["ws"].on('ping', () => {
    //     console.log("Ping from server!");
    //     connection["ws"].isAlive = true;
    // });

    connection["ws"].addEventListener('open', function open(data) {
        add_message('Connected!', true);
        connection["ws"].send(JSON.stringify({
            type: "status",
            data: "Connected to server"
        }));
    })

    connection["ws"].addEventListener('message', function receive(message) {

        const parsedMessage = JSON.parse(message.data);

        console.log(parsedMessage);

        const { type, data } = parsedMessage;

        if(type === 'message') {
            add_message(data);
        }

        if(type === 'ping') {

            console.log(`Ping received: ${(Date.now()-startingTime)/1000}`);

            this.send(JSON.stringify({
                type: "pong",
                data: "heartbeat"
            }))
        }

        connection["ws"].isAlive = true;

        console.log(connection["ws"].isAlive);
        
    });

    connection["connecting"] = false;
}

function click_disconnect(event) {

    if(connection["ws"] && connection["connecting"] === false) {

        connection["ws"].close();

    }

}

function click_send() {
    const msg_box = document.getElementById("msg-draft").getElementsByTagName("input")[0];
    const msg = {
        type: "data",
        data: msg_box.value
    }
    const serialized_msg = JSON.stringify(msg);

    msg_box.value = '';

    connection["ws"].send(serialized_msg);

    // add_message(msg);
    // Do we wan this to add the message or the web socket message listener?
}

// DOM functions

function add_message(msg, special=false) {
    
    const msg_container = document.getElementById("msg-container");

    const msg_element = document.createElement("p");

    special ? msg_element.className="special-msg" : '';

    msg_element.innerText = msg;

    msg_container.appendChild(msg_element);

}

// Heartbeat functionality
const heartbeatMonitor = setInterval(() => {

    console.log(`Conn Obj: ${connection["ws"]}, Alive: ${connection["isAlive"]}`)

    if(connection['ws'] && !connection["ws"]["isAlive"]) {
        console.log()
        connection["ws"].close();
        console.error("Closing connection...");
        console.log(`Closed at: ${(Date.now()-startingTime)/1000}`);
        clearInterval(heartbeatMonitor);

        return;
    }

    connection["ws"]["isAlive"] = false;

}, 3000 + 1000);

