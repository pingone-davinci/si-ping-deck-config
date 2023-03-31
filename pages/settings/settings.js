let settingGroup;

function settings_init() {
  console.log("pagescript - settings_init()")

  const fieldset = document.getElementById("settings");
  settingGroup = fieldset.name;

  return fieldset;
}

/*
 * saveSettingsToLocalStorage
 * Saves the settings to local storage.
 */
const saveSettingsToLocalStorage = function (event) {
  SETTINGS[this.name] = getSettingsInputs(this.id);
  localStorage.setItem("SETTINGS", btoa(JSON.stringify(SETTINGS)));
};

/*
 * getSettingsFromLocalStorage
 * Load the settings from local storage.
 */
function getSettingsFromLocalStorage() {
  // console.log(`Getting Settings for group ${settingGroup}`)
  const fieldset = documentg.getElementById("settings");
  const inputs = fieldset.getElementsByTagName("input");
  const selects = fieldset.getElementsByTagName("select");
  for (let field of [...inputs, ...selects]) {
    field.value = getSetting(settingGroup, field.id);
  }
};

/*
 * getSettingsInputs
 * Return a JSON including all input values
 *
 *  - FIELDSETINPUTS - The HTML fieldset id
 */
function getSettingsInputs(fieldsetInputs) {
  const fieldset = document.getElementById(fieldsetInputs);
  const elements = fieldset.querySelectorAll("input,select")

  let settings = {};
  elements.forEach((e) => { settings[e.id] = e.value; })

  return settings;
}


