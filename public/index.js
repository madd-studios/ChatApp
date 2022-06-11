window.onload = () => {

    const signInButton = document.getElementsByClassName("button")[0];
    const errorMessage = document.getElementById("error-message");
    const username = document.getElementById("username");

    signInButton.onclick = (e) => {
        const input = username.value;
        const url = 'http://127.0.0.1:5500'

        if (input) {
            window.location = "chat.html";
        }
        else {
            errorMessage.style.display = "block";
        }
    }

}