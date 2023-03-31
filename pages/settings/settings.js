

const settingGroup = "pingone";

function pingone_init() {
  // Whatever
  console.log("pagescript - pingone_init()")

  const fieldset = document.getElementById("settings");
  fieldset.onchange = saveSettingsToLocalStorage;

  const button = document.getElementById("dvlogin");
  button.onclick = dvlogin;

  refreshPingOneEnviromentsSelect(fieldset.name, "companyId", "davinci_companies");
  getSettingsFromLocalStorage(fieldset.name);

  fieldset.style = "display: block;";
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
  const fieldset = document.getElementById("settings");
  const inputs = fieldset.getElementsByTagName("input");
  const selects = fieldset.getElementsByTagName("select");
  for (let field of [...inputs, ...selects]) {
    field.value = getSetting(settingGroup, field.id);
  }
};

/**
 * refreshPingOneEnviromentsSelect
 */
function refreshPingOneEnviromentsSelect(settingsGroup, settingId, optionsStorage) {
  const select = document.getElementById(settingId);
  const value = getSetting(settingsGroup, settingId)

  select.innerHTML = "";
  let options = {};

  if (optionsStorage) {
    options = JSON.parse(localStorage.getItem(optionsStorage)) || {};
  }

  // console.log("Options = ", options);

  Object.keys(options)
    .forEach(function eachKey(key) {
      const option = document.createElement("option");
      option.value = options[key];
      option.innerHTML = key;
      // console.log(`key = ${options[key]} ... value = ${value}}`)
      if (options[key] == value) {
        option.selected = true;
      }
      select.appendChild(option);
    });


}




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

/**
 * Convert the pingone_region (.com, .eu, .ca, .asia --> NA,EU, CA, AP)
 */
function getPingOneRegion() {
  switch (getSetting("pingone", "region")) {
    case "eu":
      return "EU";
    case "ca":
      return "CA";
    case "asia":
      return "AP";
    case "com":
    default:
      return "NA";
  }
}



/**
 *
 * dvlogin
 * Login to DaVinci
 *
 */
const dvlogin = async function () {
  const env = getSetting("pingone", "envId");
  const username = getSetting("pingone", "username");
  const password = getSetting("pingone", "password");
  const region = getPingOneRegion();
  let accessToken = undefined;

  localStorage.removeItem("davinci_access_token");
  localStorage.removeItem("davinci_companies");

  if (!env || !username || !password) {
    redAlert("Missing DaVinci Preferences");
  } else {
    blueAlert("Logging in...")
    const response = await fetch("/api/dvlogin",
      {
        method: "POST",
        body: JSON.stringify({
          env,
          username,
          password
        }),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "x-p1-region": region
        }
      });

    let resp = await response.json();

    accessToken = resp?.access_token;
    companies = resp?.companies;
    if (accessToken && companies) {
      localStorage.setItem("davinci_access_token", accessToken);
      localStorage.setItem("davinci_companies", JSON.stringify(companies));
      greenAlert("PingOne/Davinci Login Successful")
    } else if (resp?.message) {
      redAlert(resp.message);
    } else {
      redAlert("Unable to Login");
    }
  }

  refreshPingOneEnviromentsSelect("pingone", "companyId", "davinci_companies");
}
