
function base64Handler(encode = true) {
  const input = document.getElementById("base64-input")
  const output = document.getElementById("base64-output")
  if (encode) {
    output.innerHTML = btoa(input.innerHTML);
  } else {
    output.innerHTML = atob(input.innerHTML);
  }
  copyCode('base64-output');
}