let login_dropdown;

function init() {
    // CODE
    console.log("Initializing...");

    login_dropdown = document.querySelector(".login-dropdown");

    // You need to look into bubbling here!
    // document.onclick = (event) => { hideLoginDropdown(); };

}

function toggleLoginDropdown() {

    console.log(login_dropdown);

    if(login_dropdown.classList.contains("hidden")) {
        login_dropdown.classList.remove("hidden");
    }
    else {
        login_dropdown.classList.add("hidden");
    }

}

function hideLoginDropdown() {
    
    login_dropdown.classList.add("hidden");

}