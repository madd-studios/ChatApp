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

// MIGHT NEED TO ADD TO THIS.
// AT THE MOMENT YOU CAN ONLY GET EMAIL OR USERNAME FROM USER
// SO WHEN YOU SET THE COOKIE YOU WON'T HAVE THE USERNAME OR THE EMAIL
// YOU MAY HAVE TO GET THE USERNAME/PASSWORD FROM THE QUERY RESULTS
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
            
            // Kind of sloppy but works
            credentials.username = signin_status.username;
            credentials.email = signin_status.email;

            console.log(`signin: ${credentials.username} ${credentials.email} ${credentials.password}`);

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


// Need functionality here for whenever a user signs up, they get access
// to all of the necessary views
/*
    I feel like your security set up in pg is trash. Why create all of these redundant records just to say that a user has access to something?
    It's not specifically tailored like your job, instead, why not set up a simple flag saying if the user is a user or an admin and then have a cross reference
    table that defines which types have access to views
    ex: dashboard a
        dashboard u
        admin a
        index a
        index u
*/

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

    console.log(`createCookie credentials: ${credentials.email} ${credentials.username}`);

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

    console.log(`res row 0: ${res.rows[0].username}`);
    console.log(`res row 0: ${res.rows[0].email}`);
    console.log(`res row 0: ${res.rows[0].password}`);

    return {
        errors: errors,
        authenticate: authenticate,
        username: res.rows[0].username,
        email: res.rows[0].email
    }

    // console.log(`res.rows[0]: ${res.rows[0].email}`);

    

}

function parseCookie(cookies) {

    let cookie_map = {}

    if(!cookies) {
        return cookie_map;
    }

    
    let cookies_arr = cookies.split(";");

    for(let i = 0; i < cookies_arr.length; i++) {

        let temp_cookie = cookies_arr[i].split("=");

        cookie_map[temp_cookie[0]] = temp_cookie[1];

        if(temp_cookie[0] == 'token') {
            break;
        }

    }

    return cookie_map;

}

async function check_access(req, res, func) {

    /*
        What do I need to do to check access? 

        Well first off, what is coming in?

        The request provides us the host, the request url, and cookies!

        For now we just need to take in the cookie
        Figure out who the user is and if they have access to the given view

        If they do, then allow them to proceed, otherwise, redirect them to access denied

        This should also have functionality to check if the user is on the login page then reroute them 
        to the dashboard if they're already logged in , otherwise just check if they're going to the login and 
        return that view for a user to login

    */

    // First get cookie from the request and figure out if the token is valid
    // What should the app do if the token is invalid, I guess just access denied
    
    // First let's log the cookie

    console.log(`Checking: ${Object.keys(req.headers)}`);
    console.log(`Headers: ${req.headers.cookie}`);
    console.log(`URL: ${req.url}`);

    // Nice, we got the cookie, so now, remove the token= and verify it
    let ui_route;
    let cookies = parseCookie(req.headers.cookie);
    //let request_url = req.url;

    if(!('token' in cookies) && req.url != '/') {
        res.writeHead(302, {'Location': `http://${req.headers.host}/`});
        return 'redirect';
    }
    else if(!('token' in cookies) && req.url == '/') {
        console.log("****************WE ARE HITTING THE RIGHT ROUTE****************");
        ui_route = func(res, req);
        return ui_route;
    }
    else if(req.url == '/logout') {
        res.setHeader('Set-Cookie', [`token=deleted`]);
        res.writeHead(302, {'Location': `http://${req.headers.host}/`});
        return 'redirect';
    }


    // if(!('token' in cookies) && req.url == '/') {
    //     ui_route = func(res, req, '/');
    //     return ui_route;
    // }

    

    await jwt.verify(cookies.token, token_secret, async function(err, decoded) {
        if(err) {
            console.log(`***VERIFY ERROR***: ${err}`);
            console.log(`***VERIFY TOKEN***: ${cookies.token}`);
            console.log(`***VERIFY TOKEN***: ${Object.keys(cookies).length}`);
            // ui_route = func(res, req, '/access_denied');
            if(req.url == '/') {
                ui_route = func(res, req);
                return ui_route;
            }
            else {
                res.writeHead(302, {'Location': `http://${req.headers.host}/`});
                return 'redirect';
            }
            
            //return func_result;
        }
        else {
            console.log(`***DECODED***: ${decoded}`);

            // Change logic here to be a redirect
            if(req.url == '/') {
                res.writeHead(302, {'Location': `http://${req.headers.host}/dashboard`});
                return 'redirect';
            }

            let db_res = await db_client.query(
                `SELECT vta.view_code, vta.access
                FROM base.view_type_access as vta
                INNER JOIN base.views as v
                    ON v.view = vta.view_code
                INNER JOIN base.users as u
                    ON u.type = vta.access
                WHERE (u.username = '${decoded.username}' or u.email = '${decoded.email}')
                and v.path = '${req.url }'`

            )

            if(db_res.rows.length > 0) {
                // UI ROUTER HERE
                ui_route = func(res, req);
                console.log(`!!!ui_route!!!: ${ui_route}`);
                //return func_result;
            }
            else {
                res.writeHead(302, {'Location': `http://${request.headers.host}/`});
                return 'redirect';
                //return func_result;
            }

        }
    })

    return ui_route;
    
    // let res = await db_client.query(
    //     `SELECT * FROM base.users
    //      WHERE username LIKE '${credentials.username}' OR email LIKE '${credentials.username}'`
    // );

    

}

exports.security_router = security_router;
exports.token_secret = token_secret;
exports.password_salt = password_salt;
exports.check_access = check_access;