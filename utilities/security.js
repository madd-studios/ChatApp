const { response } = require("express");
const { db_client } = require('./configuration.js');
const jwt  = require("jsonwebtoken");

let token_secret = "PbfEH9QRUP7lZxnw",
    password_salt = "byXyPpJwrUAJ9kSf",
    crypto_algo = "HS256",
    security_routes = {
        "/signin": signin,
        "/signup": signup
    };
let body = [];

function security_router(response, request) {

    // This is just serving as a template

    // response.setHeader('Content-Type', 'text/html');

    // if(routes[request.url]) {
    //     return `/templates/${routes[request.url]}`;
    // }

    // response.statusCode = 404;
    // return `/templates/${routes["404"]}`;

    // WHAT DO I EVEN USE FOR A HEADER?? HOW DO I EVEN HANDLE A REDIRECT??

    // NEED TO USE ROUTINES TO BUILD COOKIE WITH JWT AS WELL AS CHECKING THE USER!
    // NEED QUERIES THAT WILL CHECK FOR USER!
    // NEED TO BUILD ERRORS DEPENDING ON WHAT FAILED
    // ALSO, REORGANIZE YOUR CODE (ROUTING, SECURITY, ETC)

    let security_routine = security_routes[request.url];

    security_routine(response, request);

    // security_routine(request.body);

}

function signin(response, request) {

    let credentials,
        signin_status;

    // console.log(`request.url.host: ${request.url}`);
    
    request.on('error', (err) => {
        console.error(err);
    }).on("data", (chunk) => {
        body.push(chunk);
    }).on("end", async () => {
        body = Buffer.concat(body).toString();
        credentials = JSON.parse(body);

        signin_status = await checkCredentials(credentials);

        //console.log(`http://${request.headers["host"]}/dashboard`);

        if(signin_status.authenticate) {
            console.log("SUCCESSFULLY AUTHENTICATED");
            response.setHeader('Content-Type', 'text/html');
            response.statusCode = 301;
            response.setHeader('Location', `http://${request.headers["host"]}/dashboard`);
            createCookie(response, credentials);
            // response.writeHead(301, {Location: `http://${request.headers["host"]}/dashboard`});
            // console.log(response.getHeaders());
            response.end();
        }
        else {
            console.log("FAILED TO AUTHENTICATE");
            response.setHeader('Content-Type', 'application/json');
            response.statusCode = 210;
            //response.setHeader('Location', `http://${request.headers["host"]}/`);
            response.end(JSON.stringify({"message": "Failed login"}));
        }

        
        body = [];
    });
    

}

function signup(response, request) {

    let credentials,
        signup_status;

    // console.log(`request.url.host: ${request.url}`);
    
    request.on('error', (err) => {
        console.error(err);
    }).on("data", (chunk) => {
        body.push(chunk);
    }).on("end", async () => {
        body = Buffer.concat(body).toString();
        credentials = JSON.parse(body);

        signup_status = await addCredentialsToDB(credentials);

        console.log(`http://${request.headers["host"]}/dashboard`);

        if(signup_status.authenticate) {
            console.log("SUCCESSFULLY AUTHENTICATED");
            response.setHeader('Content-Type', 'text/html');
            createCookie(response, credentials);
            response.statusCode = 301;
            response.setHeader('Location', `http://${request.headers["host"]}/dashboard`);
            // response.writeHead(301, {Location: `http://${request.headers["host"]}/dashboard`});
            // console.log(response.getHeaders());
            response.end();
        }
        else {
            console.log("FAILED TO AUTHENTICATE");
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({"message": "Failed login"}));
        }

        
        body = [];
    });

}

function createCookie(res, credentials) {

    console.log("CREATING COOKIE");

    let token = jwt.sign({"username": credentials.username, "email": credentials.email, "password": credentials.password},
                           token_secret,
                           {'algorithm': crypto_algo});

    console.log(`Token: ${token}`);

    res.setHeader('Set-Cookie', [`token=${token}`]);

}

// JWT FUNCTIONALITY

function get_user(user) {

    let sql = "SELECT *" +
              "FROM base.user" + 
              `WHERE email LIKE ${user} OR username LIKE ${user}`

    db_client.query(sql, (err, res) => {

        console.log(res.rows);

    });

}

async function addCredentialsToDB(credentials) {
    let authenticate = false,
        errors = {};
    
    let res = await db_client.query(
        `SELECT * FROM base.users
         WHERE username LIKE '${credentials.username}' OR email LIKE '${credentials.username}'`
    );

    if(res.length > 0) {
        errors.user = "User already exists";
    }
    else {
        authenticate = true;
    }
    // Need a way to check if user exists and if the password matches

    db_client.query(
        `INSERT INTO base.users (username, email, password, created_on) VALUES
        ('${credentials.username}', '${credentials.email}', '${credentials.password}', NOW())`
    );

    // NEED A WAY TO CHECK IF DB FAILED
    // SHOULD I USE A 500 SERVER HTML PAGE?

    // res = await db_client.query(
    //     `SELECT * FROM base.users
    //      WHERE username LIKE '${credentials.username}' OR email LIKE '${credentials.username}'`
    // );



    return {
        errors: errors,
        authenticate: authenticate
    }
}

async function checkCredentials(credentials) {

    let authenticate = false;
    let errors = {};
    
    const res = await db_client.query(
        `SELECT * FROM base.users
         WHERE username LIKE '${credentials.username}' OR email LIKE '${credentials.username}'`
    );

    // Need a way to check if user exists and if the password matches

    if(res.length == 0) {
        errors.user = "Could not find user...";
    }
    else if(res.rows[0].password != credentials.password) {
        errors.password = "Incorrect password";
    }
    else {
        authenticate = true;
    }

    return {
        errors: errors,
        authenticate: authenticate
    }

    // console.log(`res.rows[0]: ${res.rows[0].email}`);

    

}

exports.security_router = security_router;
exports.token_secret = token_secret;
exports.password_salt = password_salt;