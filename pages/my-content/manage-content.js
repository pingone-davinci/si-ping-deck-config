

const saveMyContent = function () {
  console.log("In saveMyContent()...");

  const fieldset = getFieldset();
  const fieldsetValues = getFieldsetInputs(fieldset.id);

  let item = {
    "id": `${fieldsetValues.id}`,
    "title": `${fieldsetValues.title}`,
    "metadata": {
      "categories": [
        `My Content`
      ],
      "contentType": `${fieldsetValues.contentType}`,
      "iconClass": "",
      "updated": `${getFormattedDate()}`,
      "creator": `${substituteSettings("{{home.name}}")}`,
      "creatorEmail": `${substituteSettings("{{home.email}}")}`,
      "raw": `${fieldsetValues.raw}`,
      "scripts": []
    },
    "content": {
      "description": `${fieldsetValues.description}`,
      "images": [],
    }
  }

  if (fieldsetValues.imgURL) {
    item.content.images.push({ url: `${fieldsetValues.imgURL}` });
  }

  saveObjectToLocalStorageArray("id", "title", item);
  refreshContentFormTable();

}

const addMyContent = function () {
  console.log("In addMyContent()...");
  showElement("settings");
  clearFieldsetItems();

  const idField = document.getElementById("id");
  idField.value = self.crypto.randomUUID();

  const saveButton = document.getElementById("save-item");
  hideElement("delete-item")
}

const editMyContent = function (id) {
  console.log("In editMyContent()...");

  const fieldset = getFieldset();
  const settingValues = getSetting(fieldset.name);
  console.log(`id = ${id}`)
  console.log(settingValues);
  const fieldSettings = settingValues.find((o) => o.id === id);

  console.log(fieldSettings);
  const obj = {
    id: fieldSettings.id,
    title: fieldSettings.title,
    contentType: fieldSettings.metadata.contentType,
    description: fieldSettings.content.description,
    imgURL: fieldSettings.content.images[0]?.url,
    raw: fieldSettings.metadata.raw
  }

  populateFieldset(obj);
  const formTable = document.getElementById("form-table");

  const rows = formTable.getElementsByTagName("tr");

  for (const e of rows) {
    e.classList.remove("selected");
  }

  const row = document.getElementById(`id-${id}`);
  // console.log(row);
  row.classList.add("selected");
  showElement("settings");
  showElement("delete-item")
  // console.log(id);
}

const deleteMyContent = function () {
  console.log("In deleteMyContent()...");
  const id = document.getElementById("id");

  const settings = getSetting("items");

  const index = settings.findIndex(function (item) {
    return item["id"] === id.value;
  });

  if (index != -1) {
    settings.splice(index, 1);
  }

  SETTINGS.pingone = settings;

  saveSettings();
  clearFieldsetItems();
  hideElement("settings");
  refreshContentFormTable();
}

function getContentTypeName(contentType) {
  switch (contentType) {
    case "code":
      return "Code Snippet"
    case "dvcomponent":
      return "DaVinci Component"
    default:
      return contentType;
  }
}

async function refreshContentFormTable() {
  let formTableHTML = `
  <table id="form-table" width="95%" align="center">
    <tr>
      <th>Title</th>
      <th>Type</th>
      <th>Description</th>
    </tr>`;
  // console.log("In refreshContentFormTable()");

  const envTable = document.getElementById("item-table");

  const myContents = getSetting("items");

  // If number of enviroments == 0 or missing, replace with a message to add environments
  if (!myContents || myContents.length === 0) {
    envTable.innerHTML = "Press the <strong>Add New Content</strong> button to add settings for a PingOne Environment"
    return;
  }

  for (const e in myContents) {
    console.table(e);
    const myContent = myContents[e];
    // console.table(environment);
    const contentTypeStr = getContentTypeName(myContent?.metadata?.contentType);

    formTableHTML += `
      <tr id="id-${myContent?.id}"onclick="editMyContent('${myContent?.id}');">
        <td>${myContent?.title}</td>
        <td>${contentTypeStr}</td>
        <td>${myContent?.content?.description}</td>
      </tr>
    `;
  }

  formTableHTML += `
  </table>
  `
  envTable.innerHTML = formTableHTML;


  //TODO OPTIMIZE?

  // Update content list to reflect changes
  await buildCombinedItemsList(false);
  filteredItems = combinedItemsList.filter(item => (
    item.metadata?.categories?.includes(CATEGORY_MY_CONTENT)
  ));
  renderItemsList(filteredItems);

  highlightItemInList("Manage My Content");

}

contribMyContent = function () {
  saveMyContent();
  console.log("In contributeMyContent()...");

  if (!getSetting("home", "email") || !getSetting("home", "name")) {
    redAlert("Name and Email are REQUIRED in Home Settings")
    return;
  }

  const fieldset = getFieldset();
  const items = getSetting(fieldset.name);
  const idField = document.getElementById("id");

  const item = items.find((o) => o.id === idField.value);

  console.log(item);
  submitContent(item);
}

function my_content_init() {
  // Whatever
  console.log("pagescript - my_content_init()")

  const fieldset = document.getElementById("settings");

  const addButton = document.getElementById("add-item");
  addButton.onclick = addMyContent;

  refreshContentFormTable();
}