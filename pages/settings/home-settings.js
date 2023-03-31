
function home_init() {
  console.log("pagescript - home_init()")

  const fieldset = document.getElementById("settings");

  fieldset.onchange = saveSettingsToLocalStorage;

  getSettingsFromLocalStorage(fieldset.name);
}

home_init();
