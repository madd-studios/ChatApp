const express = require('express');

// express app
const app = express();

// listen for requests
const server = app.listen(3000);

app.get('/', (req, res) => {

    // this is an express method
    // sets the header automatically
    //res.send('<p>Testing</p>');
    res.sendFile('./public/index.html', { root: __dirname });

});

app.get('/about', (req, res) => {

    // this is an express method
    // sets the header automatically
   //res.send('<p>About</p>');
    res.sendFile('./public/about.html', { root: __dirname });
});

// redirects
app.get('/about-us', (req, res) => {
    res.redirect('/about');
});

// 404 page
app.use((req, res) => {
    // res.sendFile('./public/404.html', { root: __dirname })
    // to send with status code
    res.status(404).sendFile('./public/404.html', { root: __dirname });
})