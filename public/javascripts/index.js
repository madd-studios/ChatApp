const connection = {
    "ws": undefined,
    "connecting": false,
    "isAlive": true
};

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

    connection["ws"].addEventListener('ping', () => {
        console.log("Ping from server!");
        connection["ws"].isAlive = true;
    });

    connection["ws"].addEventListener('open', function open(data) {
        add_message('Connected!', true);
        connection["ws"].send(JSON.stringify({
            type: "status",
            data: "Connected to server"
        }));
    })

    connection["ws"].addEventListener('message', function receive(data) {

        const msg = data.data;

        connection["ws"].isAlive = true;

        add_message(msg);
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

    if(!connection["isAlive"]) {
        connection["ws"].close();
        console.error("Closing connection...");
    }

    connection["isAlive"] = false;

}, 3000 + 1000);

