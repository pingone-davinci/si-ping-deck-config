
const home_init = function () {
  console.log("pagescript - home_init()")

  const fieldset = document.getElementById("settings");

  fieldset.onchange = saveSettingsToLocalStorage;

  getSettingsFromLocalStorage(fieldset.name);
}

home_init();
