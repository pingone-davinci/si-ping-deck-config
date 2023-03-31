home_init();

function home_init() {
  console.log("pagescript - home_init()")

  const fieldset = settings_init();

  getSettingsFromLocalStorage();

  fieldset.style = "display: block;";
}