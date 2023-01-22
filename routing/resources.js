let css_resources = [
    "new_styles.css",
    "dash_styles.css",
    "styles.css"
],

js_resources = [
    "index.js",
    "dashboard.js",
    "chat.js"
],

png_resources = [
    "chat.png",
    "paper-plane.png"
],

svg_resources = [
    "user-black.svg",
    "user-white.svg"
];

// get the end of the url
function getEndOfUrl(url) {

    let split = url.split("/");

    return split[split.length-1];

}

let resource;


css_routing = (response, request) => {
    // console.log("CSS ROUTING");

    resource = getEndOfUrl(request.url);

    if(css_resources.indexOf(resource) > -1) {
        response.setHeader('Content-Type', 'text/css');
        return `styles/${resource}`;
    }

    return null;

}

js_routing = (response, request) => {
    // console.log("JS ROUTING");

    resource = getEndOfUrl(request.url);

    if(js_resources.indexOf(resource) > -1) {
        response.setHeader('Content-Type', 'text/javascript');
        return `scripts/${resource}`;
    }

    return null;

}

image_routing = (response, request) => {

    let image_type = request.url.substring(request.url.indexOf(".")+1);

    resource = getEndOfUrl(request.url);

    if(image_type == "png") {

        if(png_resources.indexOf(resource) > -1) {
            response.setHeader('Content-Type', 'image/png');
            return `assets/${resource}`;
        }

    }

    if(image_type == "svg") {

        if(png_resources.indexOf(resource) > -1) {
            response.setHeader('Content-Type', 'image/svg+xml');
            return `assets/${resource}`;
        }

    }

    return null;

}

exports.css_routing = css_routing;
exports.js_routing = js_routing;
exports.image_routing = image_routing;

// exports = {
//     "css_routing" : css_routing,
//     "js_routing" : js_routing,
//     "image_routing" : image_routing
// };