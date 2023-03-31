
function urlEncodeHandler(encode = true) {
  const input = document.getElementById("urlencode-input")
  const output = document.getElementById("urlencode-output")
  if (encode) {
    output.innerHTML = encodeURI(input.innerHTML);
  } else {
    output.innerHTML = decodeURI(input.innerHTML);
  }
  copyCode('urlencode-output');
}