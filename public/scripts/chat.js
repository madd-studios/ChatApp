window.onload = () => {

    const clientSocket = io();

    // Gathered elements

    const chatWindow = document.getElementsByClassName("chat-window")[0];
    const sendButton = document.getElementsByClassName("send-button")[0];

    sendButton.addEventListener("click", sendMessage);

    clientSocket.on("received message", (message) => {

        console.log(`RECEIVED MESSAGE: ${message}`);

        receiveMessage(message);
    });

    function createMessage(message_content, send_or_receive) {
        const messageContainer = document.createElement("div");
        if (send_or_receive === "send") {
            messageContainer.className = "message sent-message";
        }
        else if (send_or_receive === "receive") {
            messageContainer.className = "message received-message";
        }
        else {
            return;
        }
        const message = document.createElement("span");
        message.innerHTML = message_content;

        messageContainer.appendChild(message);

        console.log(messageContainer);

        return messageContainer;

    }
    
    function sendMessage() {

        console.log("SENDING MESSAGE");

        const text_box = document.getElementsByClassName("text-box")[0];

        const message = text_box.value;

        console.log(`MESSAGE: ${message}`);

        const sentMessage = createMessage(message, "send");

        chatWindow.appendChild(sentMessage);

        text_box.value = "";

        clientSocket.emit('chat message', message);

    }

    function receiveMessage(message) {

        const receivedMessage = createMessage(message, "receive");

        console.log(receivedMessage instanceof Node);
        console.log(chatWindow instanceof Node);

        chatWindow.appendChild(receivedMessage);

    }

}

