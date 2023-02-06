const { response } = require("express");
const { db_client } = require('./configuration.js');

let token_secret = "PbfEH9QRUP7lZxnw",
    password_salt = "byXyPpJwrUAJ9kSf",
    security_routes = {
        "/signin": signin,
        "/signup": signup
    };

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

    let security_routine = security_router[request.url];

    console.log(request.body);

    // security_routine(request.body);

}

function signin(data) {



}

function signup(data) {



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


exports = {
    "security_router": security_router,
    "token_secret": token_secret,
    "password_salt": password_salt
}