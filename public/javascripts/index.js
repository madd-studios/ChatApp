// Great explanation of async js: https://www.youtube.com/watch?v=FVZ-A_Akros

// Hoisting explained: https://www.youtube.com/watch?v=EvfRXyKa_GI

const connection = {
    "ws": undefined,
    "ws_url": "ws://localhost:3000/chat",
    "lp_url": "http://localhost:3000/lp_chat",
    "connecting": false,
    "isAlive": true,
    "type": "lp",
    "attempts": 0,
    "stopAttempting": false//,
    //"lp_sending": false
    // It might be worth considering disabling a button 
    // if a user sends using longpolling or websocket.
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

function websocket_connect(url) {

    console.log(url);

    connection["ws"] = new WebSocket(url);

    connection["ws"].addEventListener('error', function() {
		console.log(`Failed Attempt ${connection["attempts"]+1}`);
		if(connection["attempts"]+1 < 3) {
            connection["attempts"]++;
			websocket_connect(connection["ws_url"]);
		}
        else {
            connection["ws"].close();
            connection["stopAttempting"] = true;
        }
	});
	connection["ws"].addEventListener('close', function(event) {
		if(event.code === 3001) {
            // Closed by disconnect button
            console.log('Manual disconnection...');
        }
        if(connection["stopAttempting"]) {
            // Fallback to longpolling
            longpoll_connect(connection["lp_url"]);
        }
	})

    connection["ws"].addEventListener('open', () => {
        connection["type"] = "ws"
        connection["connecting"] = false;
        add_message('Connected!', "special");
        connection["ws"].send(JSON.stringify({
            type: "status",
            data: "Connected to server"
        }));
    
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

        setInterval(heartbeatMonitor, 3000 + 1000);

    });
}

// async function longpoll_fetch() {

//     const response = await fetch(connection["lp_url"]);

//     return response.json();

// }

function longpoll_connect(url) {

    // Consider connecting flag 
    
    fetch(connection["lp_url"]).then(async (response) => {
        
        const message = await response.text();

        const parsedMessage = JSON.parse(message);
    
        console.log(parsedMessage);

        const { type, data } = parsedMessage;

        if(type === 'message') {
            add_message(data);
        }

        longpoll_connect(url);

    }).catch((error) => {
        // Add message here that says all forms of connecting failed, server must be down
        console.error(error);
        add_message("ALL CONNECTIONS FAILED, SERVER MUST BE DOWN...", "error");
    });

}

function click_connect(event) {

    // So this flag may not be reuseful because of the nature of long polling 
    // Long polling will have to reconnect for each message
    connection["connecting"] = true;

    if(connection["type"] === "ws") {
        websocket_connect(connection["ws_url"]);
    }

    // Use ws_connection to determine if a web socket connection should be used or a long polling connection
    if(connection["type"] === "lp") {

         // Use Fetch API
         longpoll_connect(connection["lp_url"]);
        
    }

    
}

function click_disconnect(event) {

    if(connection["ws"] && connection["connecting"] === false) {

        connection["ws"].close(3001);

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

    if(connection["type"] === "ws") {
        connection["ws"].send(serialized_msg);
    }
    
    if(connection["type"] === "lp") {
        // Do a fetch post here
        //if(!connection["lp_sending"]) {
            fetch(connection["lp_url"], {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(msg)
            })
        //}
    }
    

    // add_message(msg);
    // Do we wan this to add the message or the web socket message listener?
}

// DOM functions

function add_message(msg, type="message") {
    
    const msg_container = document.getElementById("msg-container");

    const msg_element = document.createElement("p");

    // special ? msg_element.className="special-msg" : '';

    if(type === "message") {
        msg_element.className = '';
    }
    if(type === "special") {
        msg_element.className = "special-msg";
    }
    if(type === "error") {
        msg_element.className = "error-msg";
    }

    msg_element.innerText = msg;

    msg_container.appendChild(msg_element);

}

function heartbeatMonitor() {

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

}




