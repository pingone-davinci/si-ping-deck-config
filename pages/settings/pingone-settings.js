/**
  * refreshPingOneEnviromentsSelect
  */
function refreshPingOneEnvironmentsSelect(settingsGroup, settingId, optionsStorage) {
  const select = document.getElementById(settingId);
  const value = SETTINGS.getProperty(settingsGroup, settingId)

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


/**
*
* dvlogin
* Login to DaVinci
*
*/
const dvlogin = async function () {
  const env = SETTINGS.getProperty("pingone.envId");
  const username = SETTINGS.getProperty("pingone.username");
  const password = SETTINGS.getProperty("pingone.password");
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

  refreshPingOneEnvironmentsSelect("pingone", "companyId", "davinci_companies");
}



const saveEnvironment = function () {
  console.log("In saveEnvironment()...");
  saveFieldsetToLocalStorageArray("envNickname");
  refreshFormTable();
}

const addEnvironment = function () {
  console.log("In addEnvironment()...");
  showElement("settings");
  clearFieldsetItems();

  const saveButton = document.getElementById("save-environment");
  hideElement("delete-environment")
}

const editEnvironment = function (id) {
  console.log("In editEvironment()...");
  populateFieldsetFromLocalStorageArray("envNickname", id);
  const formTable = document.getElementById("form-table");
  // console.log(formTable);
  const rows = formTable.getElementsByTagName("tr");
  // console.log(rows);

  for (const e of rows) {
    e.classList.remove("selected");
  }

  const row = document.getElementById(`nickname-${id}`);
  // console.log(row);
  row.classList.add("selected");
  showElement("settings");
  showElement("delete-environment")
  // console.log(id);
}

const deleteEnvironment = function () {
  console.log("In deleteEnvironment()...");
  const envNickname = document.getElementById("envNickname");

  const envSettings = SETTINGS.getProperty("pingone");

  const index = envSettings.findIndex(function (item) {
    return item["envNickname"] === envNickname.value;
  });

  if (index != -1) {
    envSettings.splice(index, 1);
  }

  SETTINGS.saveSetting(envSettings, "pingone");

  clearFieldsetItems();
  hideElement("settings");
  refreshFormTable();
}

function refreshFormTable() {
  let formTableHTML = `
  <table id="form-table" width="95%" align="center">
    <tr>
      <th>Nickname</th>
      <th>Env ID</th>
      <th>Username</th>
    </tr>`;
  // console.log("In refreshFormTable()");

  const envTable = document.getElementById("environment-table");

  const environments = SETTINGS.getProperty("pingone");

  // If number of enviroments == 0 or missing, replace with a message to add environments
  if (!environments || environments.length === 0) {
    envTable.innerHTML = "Press the <strong>Add Enviroment</strong> button to add settings for a PingOne Environment"
    return;
  }

  for (const e in environments) {
    const environment = environments[e];
    // console.table(environment);
    formTableHTML += `
      <tr id="nickname-${environment?.envNickname}"onclick="editEnvironment('${environment?.envNickname}');">
        <td>${environment?.envNickname}</td>
        <td>${environment?.envId}</td>
        <td>${environment?.username}</td>
      </tr>
    `;
  }

  formTableHTML += `
  </table>
  `
  envTable.innerHTML = formTableHTML;
}

function pingone_init() {
  // Whatever
  console.log("pagescript - pingone_init()")

  const fieldset = document.getElementById("settings");

  const addEnvButton = document.getElementById("add-environment");
  addEnvButton.onclick = addEnvironment;

  refreshFormTable();
}