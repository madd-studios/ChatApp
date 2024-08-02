addEventListener('load', () => {
    main();
});

function main() {
    init_event_handlers();
}

function init_event_handlers() {
    document.getElementById("sign-in").addEventListener("click", signin_on_click);
}

function signin_on_click(e) {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let post_data = JSON.stringify({
        username: username,
        password: password
    });
    console.log(post_data);

    fetch("/signin", {
        method: "POST",
        body: post_data,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        console.log(response);
    });
    // alert(`Username: ${username}\nPassword: ${password}`);
}