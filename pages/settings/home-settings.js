home_init();

function home_init() {
  console.log("pagescript - home_init()")

  const fieldset = document.getElementById("settings");

  getSettingsFromLocalStorage(fieldset.name);

  fieldset.style = "display: block;";
}