const focusOnFirstInputElement = () => {
    document.getElementById("__ELEMENT_ID__").focus();
};

/**
 * If page isn't loaded yet, wait for the page to load, then focus on first
 * input element.
 */
if (document.readyState === "loading") {
    // Loading hasn't finished yet
    document.addEventListener("DOMContentLoaded", focusOnFirstInputElement);
} else {
    // `DOMContentLoaded` has already fired
    focusOnFirstInputElement();
}