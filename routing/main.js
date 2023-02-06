let routes = {
    "/" : "index.html",
    "/chat": "chat.html",
    "/dashboard": "dashboard.html",
    "404": "404.html"
};

function ui_router(response, request) {

    response.setHeader('Content-Type', 'text/html');

    if(routes[request.url]) {
        return `/templates/${routes[request.url]}`;
    }

    response.statusCode = 404;
    return `/templates/${routes["404"]}`;
}

function non_ui_router(response, request) {
    
}

exports.ui_router = ui_router;