const http = require('http');
const fs = require('fs');

const port = 3000;
const host = "localhost";

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    // res.setHeader('Content-Type', 'text/html');
    // res.write('<h1>Fuck my job</h1>');
    // res.write('<h2>I want to get better at coding</h2>');
    // res.end();

    let path = './public/';
    switch(req.url) {
        case '/':
            path += 'index.html';
            res.statusCode = 200;
            break;
        case '/about':
            path += 'about.html';
            res.statusCode = 200;
            break;
        case '/about-us':
            res.statusCode = 301;
            res.setHeader('Location', '/about');
            break;    
        default:
            path += '404.html';
            res.statusCode = 404;
            break;
    }

    // send an html file
    res.setHeader('Content-Type', 'text/html');

    fs.readFile(path, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            res.write(data);
            
        }
        res.end();
        // res.end(data) works
    });

});

server.listen(port, host, () => {
    console.log('listening for requests on port 3000');
});

