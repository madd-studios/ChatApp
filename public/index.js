const signInButton = document.getElementsByClassName("button")[0];
const errorMessage = document.getElementById("error-message");
const username = document.getElementById("username");

// signInButton.onclick = (e) => {
//     const input = username.value;
//     const url = 'http://127.0.0.1:5500'

//     if (input) {
//         window.location = "chat.html";
//     }
//     else {
//         errorMessage.style.display = "block";
//     }
// }

function init() {
    // CODE
    console.log("Initializing...");
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
    }

    if(value == "signup") {
        console.log("SIGNUP");
        // CODE
    }

}

