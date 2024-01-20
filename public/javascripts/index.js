addEventListener('load', () => {

    main();

});

function main() {

    const ws = new WebSocket('ws://localhost:3000/chat');

    ws.addEventListener('error', console.error);

    ws.addEventListener('open', function open(data) {
        ws.send('Client connected');
    })

    ws.addEventListener('message', function receive(data) {
        console.log(`Received: ${data.data}`);
    });

}