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

    if(value != prev_state) { errorDisplay(prev_state, {}, false) }

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

    wipeInputs();

}

function checkFields(event) {

    let btn_type = event.currentTarget.id,
        context,
        errors = {},
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
        }

        if(!password.value) {
            errors.password = "Please provide a valid password";
            no_errors = false;
        }
        else {
            errors.password = "";
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
        }

        if(!password.value) {
            errors.password = "Please provide a valid password";
            no_errors = false;
        }
        else {
            errors.password = "";
        }

        if(!email.value) {
            errors.email = "Please provide a valid email";
            no_errors = false;
        }
        else {
            errors.email = "";
        }

    }

    // if(Object.keys(errors).length > 0) {
    //     valid = false;
    // }

    // return valid;

    result.errors = errors;
    result.context = context;

    return result;

}

function login(event) {

    let errors, context, checkFieldsReturn, no_errors; 

    checkFieldsReturn = checkFields(event);

    errors = checkFieldsReturn.errors;

    context = checkFieldsReturn.context;

    no_errors = checkFieldsReturn.no_errors;

    errorDisplay(context, errors, true);

    if(no_errors) {

        // FETCH REQUEST HERE
        // ALSO, MAYBE ERROR DISPLAY SHOULD BE RENAMED AND SHOULD GRAB THE CREDENTIALS...

    }

}

function errorDisplay(context, errors, show) {

    let email_error_cont,
        username_error_cont,
        password_error_cont;

    if(context == "signin") {

        username_error_cont = document.querySelector("#signin-username").parentElement.nextElementSibling;
        password_error_cont = document.querySelector("#signin-password").parentElement.nextElementSibling;

        username_error_cont.innerText = show ? errors.username : "";
        password_error_cont.innerText = show ? errors.password : "";

    }

    if(context == "signup") {
        
        username_error_cont = document.querySelector("#signup-username").parentElement.nextElementSibling;
        email_error_cont = document.querySelector("#signup-email").parentElement.nextElementSibling;
        password_error_cont = document.querySelector("#signup-password").parentElement.nextElementSibling;

        username_error_cont.innerText = show ? errors.username : "";
        password_error_cont.innerText = show ? errors.password : "";
        email_error_cont.innerText = show ? errors.email : "";

    }

}

function wipeInputs() {

    document.querySelector("#signin-username").value = "";
    document.querySelector("#signin-password").value = "";
    document.querySelector("#signup-username").value = "";
    document.querySelector("#signup-password").value = "";
    document.querySelector("#signup-email").value = "";

}


