// Focus on the first input element on the page
const focusOnFirstInputElement = () => {
    const element = document.querySelector("input");

    // Set focus on the first input element, if it exists
    if (element) {
        element.focus();
    }
};

// If the page is still loading, wait for it to finish before calling the function
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", focusOnFirstInputElement);
} else {
    // If the page has already finished loading, call the function immediately
    focusOnFirstInputElement();
}
