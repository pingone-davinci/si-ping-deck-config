
const getPingOneResource = async function (resource) {

  const response = await fetch(`https://api.pingone.${PINGONE_ENV.region}/v1/${resource}`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${PINGONE_ENV.accessToken}`
      }
    });

  let results = {};
  if (response.status === 200) {
    results = await response.json();
  }

  return results;
}

const getPingOneUrl = async function (url) {
  let results = {};
  let response;

  try {
    response = await fetch(url,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${PINGONE_ENV.accessToken}`
        }
      });

    if (response.status === 200) {
      results = await response.json();
    }
  } catch (err) {
    //
  }

  return results;
}

const getPingOneToken = async function () {

  const response = await fetch(`https://auth.pingone.${PINGONE_ENV.region}/${PINGONE_ENV.envId}/as/token`,
    {
      method: "POST",
      body: new URLSearchParams({
        'grant_type': 'client_credentials'
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + btoa(`${PINGONE_ENV.clientId}:${PINGONE_ENV.clientSecret}`)
      }
    });

  let access_token;

  if (response.status === 200) {
    const tokenJson = await response.json();
    access_token = tokenJson.access_token;
  }

  return access_token;
}

const hideAllDivs = async function () {
  clearElementText("pingoneCodeDetails")
  clearElementHTML("pingoneEnvSelect");
  clearElementHTML("pingoneEnvResourceSelect");
  hideElement("settings");
  hideElement("pingoneEnvSelection");
  hideElement("pingoneEnvDetails");
  hideElement("pingoneCodeDetails");
  hideElement("pingoneEnvSelection");
  hideElement("pingoneEnvResourceSelection");
}

const saveEnvironment = async function () {
  console.log("In saveEnvironment()...");
  fieldsetValues = saveFieldsetToLocalStorageArray("envNickname");
  refreshFormTable();
}

const addEnvironment = function () {
  console.log("In addEnvironment()...");
  hideAllDivs();
  showElement("settings");
  clearFieldsetItems();

  const saveButton = document.getElementById("save-environment");
  hideElement("delete-environment")
}

const updateCheckbox = function (element, mode = "CHECK") {
  if (!element) {
    return;
  }

  switch (mode) {
    case "CHECK":
      element.classList.remove("fa-square-o");
      element.classList.add("fa-check-square");
      break;
    case "UNCHECK":
      element.classList.remove("fa-check-square");
      element.classList.add("fa-square-o");
      break;
  }

}

const clearAndSetRows = function (id) {
  const formTable = document.getElementById("form-table");
  const rows = formTable.getElementsByTagName("tr");

  for (const e of rows) {
    e.classList.remove("selected");

    const iconElement = e.querySelector('i');
    iconElement && updateCheckbox(iconElement, "UNCHECK")
  }

  const row = document.getElementById(`nickname-${id}`);
  row.classList.add("selected");

  const selectedIconElement = row.querySelector('i');
  selectedIconElement && updateCheckbox(selectedIconElement, "CHECK")
}

let PINGONE_ENV;

const showEnvironment = async function (id) {
  console.log("In showEvironment()...");
  hideAllDivs();
  clearAndSetRows(id);

  PINGONE_ENV = app.SETTINGS.getProperty("pingone").find((d) => d.envNickname === id);

  loadingSpinner("Getting AccessToken...");
  PINGONE_ENV.accessToken = await getPingOneToken();
  let text = "";

  if (PINGONE_ENV.accessToken) {

    const pingoneEnvSelect = document.getElementById("pingoneEnvSelect");
    const environments = await getPingOneResource("environments");
    // console.log(environments);
    PINGONE_ENV.environments = environments?._embedded.environments;
    PINGONE_ENV.environments.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)


    let options = `<option value="" disabled selected>Please select environment</option>`;
    PINGONE_ENV.environments.forEach((e) => {
      options +=
        `<option value="${e.id}">${e.name}</option>`;
    });
    pingoneEnvSelect.innerHTML = options;
  } else {
    redAlert(`Invalid Credentials for '${PINGONE_ENV.envNickname}' environment.`);
  }

  hideElement('modalBackdrop');

  // showElement("pingoneEnvSelect");
  showElement("pingoneEnvSelection");
  // showElement("pingoneEnvDetails");
}

const selectEnvironmentResource = async function (event) {
  const resource = event.target.value;

  loadingSpinner("Getting Resource(s)...");

  const res = await getPingOneUrl(resource);

  const code = document.getElementById("pingoneCodeDetails")

  code.innerText = JSON.stringify(res, null, 2);

  hideElement('modalBackdrop');

  showElement("pingoneEnvDetails");
}

const selectEnvironment = function (event) {
  const id = event.target.value;

  const environment = PINGONE_ENV.environments.find((e) => e.id === id);
  let html = '<option value="" disabled selected>Please select a resource</option>';

  const links = environment._links;
  const keys = Object.keys(links);
  keys.sort();
  keys.forEach((res) => {
    const href = links[res].href;
    html += `<option value="${href}">${res}</option>`;
  });

  const select = document.getElementById("pingoneEnvResourceSelect");
  select.innerHTML = html;

  showElement("pingoneEnvResourceSelection");
  showElement("pingoneEnvResourceSelect");
}

const editEnvironment = function (id) {
  console.log("In editEvironment()...");
  hideAllDivs();
  populateFieldsetFromLocalStorageArray("envNickname", id);
  clearAndSetRows(id);
  showElement("settings");
  showElement("delete-environment")
  // console.log(id);
}

const deleteEnvironment = function () {
  console.log("In deleteEnvironment()...");
  const envNickname = document.getElementById("envNickname");

  const envSettings = app.SETTINGS.getProperty("pingone");

  const index = envSettings.findIndex(function (item) {
    return item["envNickname"] === envNickname.value;
  });

  if (index != -1) {
    envSettings.splice(index, 1);
  }

  // console.log(envSettings);
  app.SETTINGS.saveProperty(envSettings, "pingone");

  clearFieldsetItems();
  hideAllDivs();
  refreshFormTable();
}

String.prototype.mask = function (start = 3, end = 3, mask = "*") {
  if (start + end > this.length) return this;
  return this.substring(0, start)
    + mask.repeat(this.length - start - end)
    + this.substring(this.length - end);
}

function refreshFormTable() {
  let formTableHTML = `
        <table id = "form-table" width = "95%" align = "center" >
          <tr>
            <th>Admin</th>
          </tr>`;

  const envTable = document.getElementById("environment-table");

  const environments = app.SETTINGS.getProperty("pingone");

  // If number of enviroments == 0 or missing, replace with a message to add environments
  if (!environments || environments.length === 0) {
    envTable.innerHTML = "Press the <strong>Add Admin Enviroment</strong> button to add settings for a PingOne Environment"
    return;
  }

  for (const e in environments) {
    const environment = environments[e];
    // console.table(environment);
    formTableHTML += `
            <tr id = "nickname-${environment?.envNickname}" >
        <td>
          <span class="fa-stack" onclick="showEnvironment('${environment?.envNickname}');">
            <i class="fa fa-square-o fa-stack-2x fa-inverse" style="color: #f5f5f5;"></i>
            <!-- <i class="fa fa-check fa-stack-1x fa-inverse" style="color: #white;"></i> -->
          </span>
          <span class="fa-stack" onclick="editEnvironment('${environment?.envNickname}');">
            <i class="fa fa-square fa-stack-2x fa-inverse" style="color: #4287f5;"></i>
            <i class="fa fa-pencil fa-stack-1x fa-inverse" style="color: white;"></i>
          </span>
          ${environment?.envNickname}</td>
      </tr >
  `;
  }

  formTableHTML += `
  </table >
  `
  envTable.innerHTML = formTableHTML;
}

function pingone_init() {
  // Whatever
  console.log("pagescript - pingone_init()")

  const addEnvButton = document.getElementById("add-environment");
  addEnvButton.onclick = addEnvironment;

  refreshFormTable();
}