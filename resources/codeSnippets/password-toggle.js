// Toggle password input field
function makePasswordToggle(containerId) {
    const container = document.getElementById(containerId);
    const passwordInput = container.querySelector("input[type='password']");
    const toggler = document.createElement("button");
    toggler.type = "button";
    toggler.setAttribute("aria-label", "Show/Hide Password");
    toggler.className = "btn mdi mdi-eye-off-outline position-absolute end-0 top-50 translate-middle-y";
    container.appendChild(toggler);

    function showHidePassword() {
        const passwordType = passwordInput.type === "password" ? "text" : "password";
        passwordInput.type = passwordType;
        toggler.classList.toggle("mdi-eye-outline");
        toggler.classList.toggle("mdi-eye-off-outline");
        passwordInput.focus();
    }

    toggler.addEventListener("click", showHidePassword);
}

function start() {
    makePasswordToggle("__DIV_ID__");
}

if (document.readyState === "loading") {
    // Loading hasn't finished yet
    document.addEventListener("DOMContentLoaded", start);
} else {
    // `DOMContentLoaded` has already fired
    start();
}