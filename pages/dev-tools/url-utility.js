
function urlEncodeHandler(encode = true) {
  const input = document.getElementById("urlencode-input-input")
  const output = document.getElementById("urlencode-input-output")
  if (encode) {
    output.innerHTML = encodeURI(input.innerHTML);
  } else {
    output.innerHTML = decodeURI(input.innerHTML);
  }
  copyCode('urlencode-input-output');
}