

let pingOne;

const hideAllDivs = async function () {
  clearElementText("pingoneCodeDetails")
  clearElementHTML("pingoneEnvSelect");
  clearElementHTML("pingoneEnvResourceSelect");
  hideElement("settings");
  hideElement("pingoneEnvSelection");
  hideElement("pingoneResourceDetails");
  hideElement("pingoneCodeDetails");
  hideElement("pingoneEnvSelection");
  hideElement("pingoneEnvResourceSelection");
  hideElement("pingoneDetails");
}

const saveEnvironment = async function () {
  console.log("In saveEnvironment()...");
  fieldsetValues = saveFieldsetToLocalStorageArray("envNickname");
  refreshFormTable();
  showEnvironment(fieldsetValues.envNickname);
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

const clearAndSetRows = function (id, enableCheck) {
  const formTable = document.getElementById("form-table");
  if (formTable) {
    const rows = formTable.getElementsByTagName("tr");

    for (const e of rows) {
      e.classList.remove("selected");

      const iconElement = e.querySelector('i');
      iconElement && updateCheckbox(iconElement, "UNCHECK")
    }

    if (id) {
      const row = document.getElementById(`nickname-${id}`);
      row.classList.add("selected");

      if (enableCheck) {
        const selectedIconElement = row.querySelector('i');
        selectedIconElement && updateCheckbox(selectedIconElement, "CHECK")
      }
    }
  }
}

const showEnvironment = async function (nickname) {
  const environment = app.SETTINGS.getProperty("pingone").find((d) => d.envNickname === nickname);
  hideAllDivs();
  clearAlert();

  try {
    loadingSpinner("Refreshing Environment...");
    clearAndSetRows(nickname, false);

    pingOne = await PingOne.createAsync(environment);
    const environments = pingOne.getEnvironments();

    refreshPingOneDetails();
    refreshFormTable();
    clearAndSetRows(nickname, true);
  } catch (err) {
    console.log("Error during showEnvironment ", err);
    redAlert(`Unable to authenticate with provided crendentials.`)
    editEnvironment(environment.envNickname);
  } finally {
    hideElement('modalBackdrop');
  }
}

const selectEnvironmentResource = async function (event) {
  const selectedOption = event.target.options[event.target.selectedIndex]

  loadingSpinner("Getting Resource(s)...");

  const res = await pingOne.getPingOneUrl(selectedOption.value);

  setElementText("pingoneCodeDetails", JSON.stringify(res, null, 2));
  setElementText("pingoneResourceDetailsTitle", `PingOne Resource - ${selectedOption.textContent}`);

  hideElement('modalBackdrop');

  showElement("pingoneResourceDetails");
}

const selectEnvironment = function (event) {
  const id = event.target.value;


  const environment = pingOne.getEnvironment(id);
  pingOne.activeEnv = environment;
  console.log("After set...")
  console.dir(pingOne);
  refreshFormTable();
  clearAndSetRows(pingOne?.envNickname, true);
  refreshPingOneDetails();
  return;

  let html = '<option value="" disabled selected>Please select a resource</option>';

  console.dir(environment);
  const links = environment._links;
  const keys = Object.keys(links);
  keys.sort();
  keys.forEach((res) => {
    const href = links[res].href;
    html += `<option value="${href}">${res}</option>`;
  });

  setElementHTML("pingoneEnvResourceSelect", html);

  showElement("pingoneEnvResourceSelection");
  showElement("pingoneEnvResourceSelect");
}

const editEnvironment = function (id) {
  console.log("In editEvironment()...");
  PingOne.clear();
  hideAllDivs();
  populateFieldsetFromLocalStorageArray("envNickname", id);
  clearAndSetRows(id, false);
  showElement("settings");
  showElement("delete-environment")
  // console.log(id);
}

const deleteEnvironment = function () {
  console.log("In deleteEnvironment()...");

  const envSettings = app.SETTINGS.getProperty("pingone");

  const index = envSettings.findIndex(function (item) {
    return item["envNickname"] === getElementValue("envNickname");
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

function refreshPingOneDetails() {
  if (!pingOne?.getAccessToken()) {
    console.log(pingOne);
    return;
  }

  let html = `
  <hr>
  <h3>${pingOne.envNickname}</h3>
  `;
  html += TextField.create("orgName", `Organization - ${pingOne.api.organization.id}`, pingOne.orgName, false).render();

  let activeEnvName = pingOne.activeEnv?.name;
  console.log("ActiveEnvName = ", activeEnvName)
  console.log("refreshPingOneDetails - ", pingOne.activeEnv);

  if (!activeEnvName) {
    const environments = pingOne.getEnvironments();

    if (environments?.length === 1) {
      pingOne.activeEnv = environments[0];
      activeEnvName = pingOne.activeEnv.name
    } else {
      pingOne.activeEnv = undefined;
      let options = `<option value="" disabled selected>Please select environment</option>`;
      environments.forEach((e) => {
        options +=
          `<option value="${e.id}">${e.name}</option>`;
      });

      setElementHTML("pingoneEnvSelect", options);
      showElement("pingoneEnvSelection");
    }
  }

  if (activeEnvName) {
    html += TextField.create("envName", `Environment - ${pingOne.activeEnv.id}`, activeEnvName, false).render();
    hideElement("pingoneEnvSelection");
  }

  setElementHTML("pingoneDetails", html);

  if (activeEnvName) {
    hideElement("pingoneDetails");
  } else {
    showElement("pingoneDetails");
  }
}

function refreshFormTable() {
  let formTableHTML = `
        <table id="form-table" style="table-layout: auto;" width="95%" align="center" >
          <tr>
            <th width="1%"></th>
            <th width="1%"></th>
            <th></th>
          </tr>`;

  const admEnvs = app.SETTINGS.getProperty("pingone");

  // If number of enviroments == 0 or missing, replace with a message to add environments
  if (!admEnvs || admEnvs.length === 0) {
    setElementHTML("environment-table", "Press the <strong>Add Admin Enviroment</strong> button to add settings for a PingOne Environment");
    return;
  }

  console.log(pingOne?.toString());
  const currentEnvNickname = pingOne?.envNickname;


  for (const e in admEnvs) {
    const admEnv = admEnvs[e];
    // console.table(environment);
    formTableHTML += `
      <tr id = "nickname-${admEnv?.envNickname}" >
        <td style="border: 0px;" >
          <span class="fa-stack" onclick="showEnvironment('${admEnv?.envNickname}');">
            <i class="fa fa-square-o fa-stack-2x fa-inverse" style="color: #f5f5f5;"></i>
            <!-- <i class="fa fa-check fa-stack-1x fa-inverse" style="color: #white;"></i> -->
          </span>
        </td>
        <td style="border: 0px;" >
          <span class="fa-stack" onclick="editEnvironment('${admEnv?.envNickname}');">
            <i class="fa fa-square fa-stack-2x fa-inverse" style="color: #4287f5;"></i>
            <i class="fa fa-pencil fa-stack-1x fa-inverse" style="color: white;"></i>
          </span>
        </td>
    `;

    if (admEnv.envNickname === currentEnvNickname) {
      console.log("inside of refreshFormTalble", pingOne);
      console.log("activeEnv", pingOne.activeEnv);
      console.log("envName = ", pingOne.activeEnv?.name)
      formTableHTML += `
        <td>
          ${admEnv.envNickname}<br><br>
          Org - ${pingOne.api.organization.name}<br>
          Env - ${pingOne.activeEnv?.name || "<span class='red'> None selected...See options below. </span>"}</td>
      </tr >
    `;
    } else {
      formTableHTML += `
        <td>
          ${admEnv.envNickname}
      </tr >
    `;
    }
  }

  formTableHTML += `
  </table >
  `
  setElementHTML("environment-table", formTableHTML)
}

async function pingone_init() {
  // Whatever
  console.log("pagescript - pingone_init()")

  const addEnvButton = document.getElementById("add-environment");
  addEnvButton.onclick = addEnvironment;

  loadingSpinner("Refreshing Environment...");
  pingOne = await PingOne.getAsync();
  refreshPingOneDetails();
  refreshFormTable();
  clearAndSetRows(pingOne?.envNickname, true);
  hideElement('modalBackdrop');
}