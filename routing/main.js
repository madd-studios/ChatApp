let routes = {
    "/" : "index.html",
    "/chat": "chat.html",
    "/dashboard": "dashboard.html",
    "404": "404.html",
    "/access_denied": "denied.html",
    "/admin": "admin.html"
};

function ui_router(response, request, override_url = 'none') {

    response.setHeader('Content-Type', 'text/html');


    if(override_url != 'none') {
        return `/templates/${override_url}`;
    }
    else if(routes[request.url]) {
        return `/templates/${routes[request.url]}`;
    }

    console.log("*************FAILURE HERE*******************")
    response.statusCode = 404;
    return `/templates/${routes["404"]}`;
}

function non_ui_router(response, request) {
    
}

exports.ui_router = ui_router;