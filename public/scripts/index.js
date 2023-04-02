/*

    You can make this more robust. If you want to you could define specific criteria 
    that say a username, password, or email has to satisfy and then depending on 
    whether or not this criteria is satisfied a more detailed error message will
    notify the user what exactly is wrong with their input

    SIDE NOTE: also need email in sign up to only accept proper email : "text@text.com"

    SIDE NOTE: maybe down the line, add a component that checks whether or not the user is using an email that actually exists

*/

const signInButton = document.getElementsByClassName("button")[0];
const errorMessage = document.getElementById("error-message");
const username = document.getElementById("username");
let prev_state = "signin";
let notFetching = true;

// let current_context;

function init() {
    // CODE
    console.log("Initializing...");
    current_context = document.querySelector('.context.selected').value;
}

function updateContext(event) {

    // This needs to change the sign in context
    // Go add the html for the sign up forum first then complete this

    // console.log(event.currentTarget.getAttribute("value"));

    /*
        You'll need a way to change the styles of the container to be bigger to accomodate
        more fields. You need a way to change the button colors on the bottom and the sign in button text
        to "Sign Up" and vice versa.
    */

    let value = event.currentTarget.getAttribute("value");

    resetContext();
    // if(value != prev_state) { errorDisplay(prev_state, {}, false) }

    if(value == "signin") {
        console.log("SIGNIN");
        // CODE
        // You may need to change what you're targetting.
        document.querySelector('.login-container').classList.remove('hidden');
        document.querySelector('.signup-container').classList.add('hidden');

        let contexts = document.querySelectorAll('.context');
        contexts.forEach(element => {
            element.classList.remove("selected");
        });
        document.querySelector('.context[value="signin"]').classList.add('selected');

        prev_state = "signin";

    }

    if(value == "signup") {
        console.log("SIGNUP");
        // CODE
        // You may need to change what you're targetting.
        document.querySelector('.signup-container').classList.remove('hidden');
        document.querySelector('.login-container').classList.add('hidden');

        let contexts = document.querySelectorAll('.context');
        contexts.forEach(element => {
            element.classList.remove("selected");
        });
        document.querySelector('.context[value="signup"]').classList.add('selected');

        prev_state = "signup";

    }

}

function checkFields(event) {

    let btn_type = event.currentTarget.id,
        context,
        errors = {},
        credentials = {},
        email,
        username,
        password,
        valid = true,
        result = {},
        no_errors = true;

    console.log(event.currentTarget.id);


    if(btn_type == "signin-btn") {

        context = "signin";

        username = document.querySelector("#signin-username");
        password = document.querySelector("#signin-password");

        console.log(username.value.length);

        if(!username.value) {
            errors.username = "Please provide a valid username or email";
            no_errors = false;
        }
        else {
            errors.username = "";
            credentials.username = username.value;
        }

        if(!password.value) {
            errors.password = "Please provide a valid password";
            no_errors = false;
        }
        else {
            errors.password = "";
            credentials.password = password.value;
        }

    }

    if(btn_type == "signup-btn") {

        context = "signup";

        username = document.querySelector("#signup-username");
        password = document.querySelector("#signup-password");
        email = document.querySelector("#signup-email");

        if(!username.value) {
            errors.username = "Please provide a valid username or email";
            no_errors = false;
        }
        else {
            errors.username = "";
            credentials.username = username.value;
        }

        if(!password.value) {
            errors.password = "Please provide a valid password";
            no_errors = false;
        }
        else {
            errors.password = "";
            credentials.password = password.value;
        }

        if(!email.value) {
            errors.email = "Please provide a valid email";
            no_errors = false;
        }
        else {
            errors.email = "";
            credentials.email = email.value;
        }

    }

    // if(Object.keys(errors).length > 0) {
    //     valid = false;
    // }

    // return valid;

    result.errors = errors;
    result.context = context;
    result.no_errors = no_errors;
    result.credentials = credentials;

    return result;

}

function login(event) {

    console.log("LOGGING IN");

    let errors, context, checkFieldsReturn, no_errors, credentials,
    btn_type = event.currentTarget.id,
    route = null; 

    checkFieldsReturn = checkFields(event);

    errors = checkFieldsReturn.errors;

    context = checkFieldsReturn.context;

    no_errors = checkFieldsReturn.no_errors;

    credentials = checkFieldsReturn.credentials;

    if(!no_errors) {
        errorDisplay(context, errors); 
    }
    // errorDisplay(context, errors, true);
    console.log(`notFetching: ${notFetching}`);
    console.log(`no_errors: ${no_errors}`);

    if(no_errors && notFetching) {

        // FETCH REQUEST HERE
        // ALSO, MAYBE ERROR DISPLAY SHOULD BE RENAMED AND SHOULD GRAB THE CREDENTIALS...
        console.log("ABOUT TO FETCH");

        console.log(credentials);

        notFetching = false;
        if(btn_type == "signup-btn") {
            route = '/signup';
        }
        if(btn_type == "signin-btn") {
            route = '/signin';
        }
        fetch(`${route}`, {
            method: 'POST',
            headers: {
                'Accept': 'applicatin/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        }).then((response) => {
            window.location.replace(
                response.url
              );
            console.log(response);
            // response.json().then(data => console.log(data));
            // notFetching = true;
        });

    }

}

// function errorDisplay(context, errors, show) {
function errorDisplay(context, errors, show) {

    let email_error_cont,
        username_error_cont,
        password_error_cont;

    if(context == "signin") {

        username_error_cont = document.querySelector("#signin-username").parentElement.nextElementSibling;
        password_error_cont = document.querySelector("#signin-password").parentElement.nextElementSibling;

        // username_error_cont.innerText = show ? errors.username : "";
        // password_error_cont.innerText = show ? errors.password : "";

        username_error_cont.innerText = errors.username;
        password_error_cont.innerText = errors.password;

    }

    if(context == "signup") {
        
        username_error_cont = document.querySelector("#signup-username").parentElement.nextElementSibling;
        email_error_cont = document.querySelector("#signup-email").parentElement.nextElementSibling;
        password_error_cont = document.querySelector("#signup-password").parentElement.nextElementSibling;

        // username_error_cont.innerText = show ? errors.username : "";
        // password_error_cont.innerText = show ? errors.password : "";
        // email_error_cont.innerText = show ? errors.email : "";

        username_error_cont.innerText = errors.username;
        password_error_cont.innerText = errors.password;
        email_error_cont.innerText = errors.email;

    }

}

// function wipeInputs() {
function resetContext() {

    // Wipe Inputs
    document.querySelector("#signin-username").value = "";
    document.querySelector("#signin-password").value = "";
    document.querySelector("#signup-username").value = "";
    document.querySelector("#signup-password").value = "";
    document.querySelector("#signup-email").value = "";

    // Wipe Error Messages
    document.querySelector("#signin-username").parentElement.nextElementSibling.innerText = "";
    document.querySelector("#signin-password").parentElement.nextElementSibling.innerText = "";
    document.querySelector("#signup-username").parentElement.nextElementSibling.innerText = "";
    document.querySelector("#signup-email").parentElement.nextElementSibling.innerText = "";
    document.querySelector("#signup-password").parentElement.nextElementSibling.innerText = "";


}


