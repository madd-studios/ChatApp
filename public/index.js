const signInButton = document.getElementsByClassName("button")[0];
const errorMessage = document.getElementById("error-message");
const username = document.getElementById("username");

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
    }

}

