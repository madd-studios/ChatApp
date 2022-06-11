window.onload = () => {

    const clientSocket = io();

    // Gathered elements

    const chatWindow = document.getElementsByClassName("chat-window")[0];

    clientSocket.on("connect", (socket) => {

        const message = createConnectionMessage();

        chatWindow.appendChild(message);

    });

    function createConnectionMessage() {
        const messageContainerReceived = document.createElement("div");
        messageContainerReceived.className = "message-container-received";
        const messageReceived = document.createElement("div");
        messageReceived.className = "message-received";
        const messager = document.createElement("span");
        messager.className = "messager";
        messager.innerHTML = "Computer";
        const message = document.createElement("span");
        message.innerHTML = "Connected to server!";

        messageReceived.appendChild(messager);
        messageReceived.appendChild(message);
        messageContainerReceived.appendChild(messageReceived);

        return messageContainerReceived;

    }

}

