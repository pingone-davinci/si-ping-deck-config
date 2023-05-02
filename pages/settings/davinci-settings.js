// /**
//   * refreshPingOneEnviromentsSelect
//   */
// function refreshPingOneEnvironmentsSelect(settingsGroup, settingId, optionsStorage) {
//   const select = document.getElementById(settingId);
//   const value = app.SETTINGS.getProperty(settingsGroup, settingId)

//   select.innerHTML = "";
//   let options = {};

//   if (optionsStorage) {
//     options = JSON.parse(localStorage.getItem(optionsStorage)) || {};
//   }

//   // console.log("Options = ", options);

//   Object.keys(options)
//     .forEach(function eachKey(key) {
//       const option = document.createElement("option");
//       option.value = options[key];
//       option.innerHTML = key;
//       // console.log(`key = ${options[key]} ... value = ${value}}`)
//       if (options[key] == value) {
//         option.selected = true;
//       }
//       select.appendChild(option);
//     });


// }


const fillPingoneEnvIdOptions = function () {
  const select = document.getElementById("pingoneEnvId");

  const pingoneEnvs = app.SETTINGS.getProperty("pingone");

  console.table(pingoneEnvs);

  let html = "<option value='' disabled>PingOne Environment</option>";
  pingoneEnvs.forEach((e) => {
    html += `<option value="${e.envNickname}">${e.envNickname}</option>`
  });

  select.innerHTML = html;
}

const saveTenant = function () {
  console.log("In saveTenant()...");
  saveFieldsetToLocalStorageArray("tenantNickname");
  refreshTenantTable();
}

const addTenant = function () {
  console.log("In addTenant()...");
  fillPingoneEnvIdOptions();
  showElement("settings");
  clearFieldsetItems();

  const saveButton = document.getElementById("save-tenant");
  hideElement("delete-tenant")
}

const editTenant = function (id) {
  console.log("In editTenant()...");
  fillPingoneEnvIdOptions();
  populateFieldsetFromLocalStorageArray("tenantNickname", id);
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
  showElement("delete-tenant")
  // console.log(id);
}

const deleteTenant = function () {
  console.log("In deleteTenant()...");
  const tenantNickname = document.getElementById("tenantNickname");

  const envSettings = app.SETTINGS.getProperty("davinci");

  const index = envSettings.findIndex(function (item) {
    return item["tenantNickname"] === tenantNickname.value;
  });

  if (index != -1) {
    envSettings.splice(index, 1);
  }

  console.log(envSettings);
  app.SETTINGS.saveProperty(envSettings, "davinci");

  clearFieldsetItems();
  hideElement("settings");
  refreshTenantTable();
}

String.prototype.mask = function (start = 3, end = 3, mask = "*") {
  if (start + end > this.length) return this;
  return this.substring(0, start)
    + mask.repeat(this.length - start - end)
    + this.substring(this.length - end);
}

function refreshTenantTable() {
  let formTableHTML = `
  <table id="form-table" width="95%" align="center">
    <tr>
      <th>Nickname</th>
      <th>PingOne Env</th>
      <th>Company ID</th>
    </tr>`;

  const envTable = document.getElementById("tenant-table");

  const tenants = app.SETTINGS.getProperty("davinci");

  // If number of enviroments == 0 or missing, replace with a message to add tenants
  if (!tenants || tenants.length === 0) {
    envTable.innerHTML = "Press the <strong>Add Tenant</strong> button to add settings for a DaVinci Tenant"
    return;
  }

  for (const e in tenants) {
    const tenant = tenants[e];
    const id = tenant?.pingoneEnvId;

    // console.table(tenant);
    const pingoneEnvId = app.SETTINGS.getProperty("pingone").find((d) => d.envNickname === id)
      ? id
      : `<span class="red">*** ${id} *** (Unknown)</span>`;
    formTableHTML += `
      <tr id="nickname-${tenant?.tenantNickname}"onclick="editTenant('${tenant?.tenantNickname}');">
        <td>${tenant?.tenantNickname}</td>
        <td>${pingoneEnvId}</td>
        <td>${tenant?.companyId?.mask(4, 4) || ""}</td>
      </tr>
    `;
  }

  formTableHTML += `
  </table>
  `
  envTable.innerHTML = formTableHTML;
}

function davinci_init() {
  // Whatever
  console.log("pagescript - davinci_init()")

  const addTenantButton = document.getElementById("add-tenant");
  addTenantButton.onclick = addTenant;

  refreshTenantTable();
}