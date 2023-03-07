/*
* To make the password toggle between clear text and protected characters:
*   1. Add the following css import statement in the CSS text box
*       - @import url("https://cdn.jsdelivr.net/npm/@mdi/font@7.1.96/css/materialdesignicons.min.css")
*   2. Replace __DIV_ID__ placeholder (line 33) with the id of the div containing the password field
*/
function makePasswordToggle(id) {
    var container = document.getElementById(id);
    var password = container.getElementsByTagName("input")[0];
    var toggler = document.createElement("button");
    toggler.setAttribute("type", "button");
    toggler.setAttribute("aria-label", "Show/Hide Password");
    toggler.className = "btn mdi mdi-eye-off-outline position-absolute end-0 top-50 translate-middle-y";
    container.appendChild(toggler);

    function showHidePassword() {
        if (password.type == "password") {
            password.setAttribute("type", "text");
            toggler.classList.add("mdi-eye-outline");
            toggler.classList.remove("mdi-eye-off-outline");
        } else {
            toggler.classList.add("mdi-eye-off-outline");
            toggler.classList.remove("mdi-eye-outline");
            password.setAttribute("type", "password");
        }
        password.focus();
    };

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