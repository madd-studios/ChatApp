import { WebSocket } from 'ws';

addEventListener('load', () => {

    main();

});

function main() {

    const ws = new WebSocket('http://localhost:8080');

    ws.on('error', console.error);

    ws.on('open', function open(data) {
        ws.send('Client connected');
    })

    ws.on('message', function receive(data) {
        console.log(`Received: ${data}`);
    });

}