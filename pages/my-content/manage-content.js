

const contentTypes = {
  "code": "Code Snippet",
  "dvcomponent": "DaVinci Component",
  "flow": "DaVinci Flow",
  "page": "Page",
  "redirect": "Bookmarks",
  "welcome": "Welcome"
}

const states = {
  "private": "Private (User)",
  "test": "Testing",
  "submitted": "Submitted",
  "public": "Public",
  "community": "Community",
  "parter": "Partner"
}

const itemListInputs = {
  usage: {
    listTitle: "Usage",
    displayField: "content",
    listType: "string",
    fields: [
      {
        id: "content",
        label: "Usage",
        width: 100
      }
    ]
  },
  scripts: {
    listTitle: "Scripts",
    displayField: "script",
    listType: "string",
    fields: [
      {
        id: "script",
        label: "Script Location",
        width: 100
      }
    ]
  },
  tags: {
    listTitle: "Tags",
    displayField: "tag",
    listType: "string",
    fields: [
      {
        id: "tag",
        label: "Tag",
        width: 100
      }
    ]
  },
  images: {
    listTitle: "Images",
    displayField: "title",
    fields: [
      {
        id: "title",
        label: "Title",
        width: 25
      },
      {
        id: "url",
        label: "URL",
        width: 50
      },
      {
        id: "description",
        label: "Description",
        width: 25
      }
    ]
  },
  links: {
    listTitle: "Links",
    displayField: "title",
    fields: [
      {
        id: "title",
        label: "Title",
        width: 25
      },
      {
        id: "url",
        label: "URL",
        width: 75
      }
    ]
  }
};

const saveItemContent = function () {
  console.log("In saveItemContent()...");

  const fieldset = document.getElementById("item-data");
  const fieldsetValues = getFieldsetInputs(fieldset.id);

  console.log("links = ", atob(fieldsetValues.links))
  let item = {
    id: `${fieldsetValues.id}`,
    title: `${fieldsetValues.title}`,
    metadata: {
      tags: JSON.parse(atob(fieldsetValues.tags)),
      state: fieldsetValues.state,
      contentType: fieldsetValues.contentType,
      iconClass: fieldsetValues.iconClass,
      updated: getFormattedDate(),
      creator: `${substituteSettings("{{home.name}}")}`,
      creatorEmail: `${substituteSettings("{{home.email}}")}`,
      source: fieldsetValues.source | "",
      raw: fieldsetValues.raw || "",
      scripts: []
    },
    content: {
      description: fieldsetValues.description,
      images: JSON.parse(atob(fieldsetValues.images)),
      links: JSON.parse(atob(fieldsetValues.links)),
      usage: JSON.parse(atob(fieldsetValues.usage)),
      codeSnippet: fieldsetValues.codeSnippet
    }
  }


  document.getElementById("_itemDebug").innerHTML = JSON.stringify(item, null, 2);

  if (item.id || item.metadata.state === "private") {
    updateItem(fieldsetValues.id, item);
  } else {
    redAlert("Adding New Content Not Implmented")
  }
}

function deleteItemContent(itemId) {
  console.log("Inside of deleteItemContent()")

  const item = findItem(itemId);

  if (item.id) {
    console.log(item);
    deleteItem(item);
  }
}

function contributeItemContent(itemId) {
  console.log("Inside of contributeItemContent()")
  redAlert("Contribute not implemented yet")
}

function createHidden(id, value = "") {
  return `
  <input type="hidden" id="${id}" name="${id}" value="${value}"/>`;
}

function createInput(id, label, value = "", editable = true) {
  const disabled = editable ? "" : "disabled";
  return `
  <div class="input-container">
    <input type="text" id="${id}" placeholder=" " value="${value}" ${disabled}/>
    <label>${label}</label>
  </div>`;
}

function createCheckbox(id, label, value = "", editable = true) {
  const disabled = editable ? "" : "disabled";
  return `
  <div class="input-container">
    <input type="checkbox" id="${id}" placeholder=" " value="private" ${disabled}/>
    <label>${label}</label>
  </div>`;
}

function createCode(id, label, value = "", editable = true) {
  // return `
  // <label class="bold ml">${label}</label>
  // <pre class="normal-white-space">
  //     <code class="snippet hljs language-undefined code-wrap utility field-border field-gray-background fa-white"
  //     id="${id}" contenteditable="${editable}">${value}</code>
  // </pre>`;

  return `
  <div class="code-block-with-header">
    <div class="header">
      <div class="title">${label}</div><button class="copy-btn">Copy</button>
    </div>
    <pre>
      <code class="snippet hljs language-undefined" id="${id}" contenteditable="${editable}"></code>
    </pre>
  </div>`
}

function createInputArray(id, valueArray = []) {
  console.log(`createInputArray() - `, valueArray);
  const itemList = itemListInputs[id];
  const fields = itemList.fields;
  const label = itemList.listTitle;
  const listField = itemList.displayField;
  const listType = itemList.listType;

  let html = `
  <h3>${label}</h3>
    <ul class="draggable-list" id="${id}-list">
      `
  valueArray.forEach((o) => {
    let listVal;

    if (listType === "string") {
      listVal = o;
    } else {
      listVal = o[listField];
    }

    let hiddenField;
    if (listType === "string") {
      hiddenField = createHidden(`${id}-obj`, btoa(o));
    } else {
      hiddenField = createHidden(`${id}-obj`, btoa(JSON.stringify(o)));
    }
    html += `
      <li class="draggable-item" draggable="true" >
        ${hiddenField}
        ${listVal}
        <button onclick="removeListItem(this, '${id}', '${listType}')" class="clear-button"><i class="fa fa-times fa-small" aria-hidden="true"></i></button>
      </li >
    `
  });

  html += `
	</ul >
  <fieldset id="${id}-fieldset">
    <div style="display:flex; width: 100%">`;

  fields.forEach((i) => {
    html += `
    <div class="input-container mr" style="width:${i.width}%">
      <input type="text" id="${i.id}" placeholder=" "/>
      <label>${i.label}</label>
    </div>
    `
  });

  html += `
    <button id="add-item" onclick="addListItem('${id}', '${listField}', '${listType}');" class="action-button add-button blue">
      <i class="fa fa-check fa-small" aria-hidden="true"></i>
    </button>
  </fieldset>
    `
  return html;
}

function updateListObj(id, objList, listType) {
  const hiddenElements = objList.querySelectorAll("input");

  let newValArray = [];

  hiddenElements.forEach((e) => {
    if (listType === "string") {
      newValArray.push(atob(e.value));
    } else {
      newValArray.push(JSON.parse(atob(e.value)));
    }
  });

  const fieldset = document.getElementById("item-data");
  const allElements = fieldset.querySelectorAll("input");

  const hiddenField = Array.from(allElements).find((e) => e.id === id);

  hiddenField.value = btoa(JSON.stringify(newValArray));

  console.log("updateListObj = ", newValArray);
}

function addListItem(fieldId, listField, listType) {
  var linkFieldset = document.getElementById(`${fieldId}-fieldset`);
  const elements = linkFieldset.querySelectorAll("input,select")

  let settings = {};
  elements.forEach((e) => {
    settings[e.id] = e.value;
    e.value = "";
  })

  const val = settings[listField];
  console.log("addListItem() - settings = ", console.table(settings))
  var objList = document.getElementById(`${fieldId}-list`);

  if (val.length > 0) {
    var listItem = document.createElement("li");
    listItem.classList.add("draggable-item");
    listItem.setAttribute("draggable", "true");
    if (listType === "string") {
      listItem.innerHTML = createHidden(`${fieldId}-obj`, btoa(val)) + val + ` <button onclick="removeListItem(this, '${fieldId}', '${listType}')" class="clear-button"><i class="fa fa-times fa-small" aria-hidden="true"></i></button>`;
    } else {
      listItem.innerHTML = createHidden(`${fieldId}-obj`, btoa(JSON.stringify(settings))) + val + ` <button onclick="removeListItem(this, '${fieldId}', '${listType}')" class="clear-button"><i class="fa fa-times fa-small" aria-hidden="true"></i></button>`;
    }
    objList.appendChild(listItem);
  }


  updateListObj(fieldId, objList, listType);
}


function createSelect(id, label, options, value = "", editable = true) {

  console.table(options);
  console.log(`value = ${value} `)
  // if (!editable) {
  //   const val = options[value] || "";
  //   return `
  //   <div class="input-container" >
  //     <input type="text" id="${id}" placeholder=" " value="${val}" disabled/>
  //     <label>${label}</label>
  //   </div > `;
  // }

  // const disabled = editable ? "" : "disabled"
  let selectHTML = `
    <div class="select line-border mt-l" >
      <select id="${id}" class="field-gray-background">
        `
  for (const option in options) {
    if (editable || value === option) {
      const selected = value === option ? "selected" : "";
      selectHTML += `<option value="${option}" ${selected}>${options[option]}</option>`
    }
  }

  selectHTML += `
      </select>
  </div > `

  return selectHTML;
}

function removeTag(button) {
  button.parentNode.parentNode.removeChild(button.parentNode);
}

/*
 * populateItemFieldset
 *
 * Populate the fieldset items from a set of properties.
 */
async function populateItemFieldset(item, pkAttr) {
  // console.log(`Getting Settings for group ${ settingGroup }`)

  const fieldset = getFieldset();
  const listFieldsDiv = document.getElementById("listFieldsDiv");

  let fieldsetHTML = "";

  console.log("populateItemFieldset - ", item);
  fieldsetHTML += createHidden("_id", item._id);
  fieldsetHTML += createHidden("id", item.id);
  fieldsetHTML += createSelect("contentType", "Content Type", contentTypes, item.metadata.contentType, (item.id ? false : true));
  fieldsetHTML += createSelect("state", "State", states, item.metadata.state, (item.metadata.state === "private" ? false : true));
  // fieldsetHTML += createCheckbox("private", "Private", item.metadata.private);
  fieldsetHTML += createInput("title", "Title", item.title);
  fieldsetHTML += createInput("iconClass", "Icon Class", item.iconClass);
  fieldsetHTML += createInput("description", "Description", item.content.description);

  let listFieldsHTML = "";

  fieldsetHTML += createHidden("tags", btoa(JSON.stringify(item.metadata.tags || [])));
  listFieldsHTML += createInputArray("tags", item.metadata.tags);

  switch (item.metadata.contentType) {
    case "code":
    case "dvcomponent":
      console.log("Creating CODE fieldset");
      fieldsetHTML += createCode("codeSnippet", "Code Snippet");
      break;
    case "page":
      fieldsetHTML += createInput("source", "Source", item.metadata.source);
      fieldsetHTML += createHidden("scripts", btoa(JSON.stringify(item.metadata.scripts)));
      listFieldsHTML += createInputArray("scripts", item.metadata.scripts);
      break;
    default:
    // redAlert(`Content Type(${item.metadata.contentType}) not implemented`);
  }

  fieldsetHTML += createHidden("usage", btoa(JSON.stringify(item.content.usage || [])));
  listFieldsHTML += createInputArray("usage", item.content.usage);
  fieldsetHTML += createHidden("images", btoa(JSON.stringify(item.content.images || [])));
  listFieldsHTML += createInputArray("images", item.content.images);
  fieldsetHTML += createHidden("links", btoa(JSON.stringify(item.content.links || [])));
  listFieldsHTML += createInputArray("links", item.content.links);

  listFieldsHTML += `
    <div class="centered" >
    <button id="save-item" onclick="saveItemContent();" class="action-button blue">Save</button>`;

  if (item.metadata.state === "private" && item.id) {
    listFieldsHTML += `
    <button id="contribute-item" onclick="contributeItemContent('${item.id}');" class="action-button blue ml">Contribute</button>
    <button id="delete-item" onclick="deleteItemContent('${item.id}');" class="action-button red ml">Delete</button>
    `
  }
  listFieldsHTML += `
  </div >
    `;

  fieldset.innerHTML = fieldsetHTML;
  listFieldsDiv.innerHTML = listFieldsHTML;

  if (item.content.codeSnippet) {
    const codeSnippetBlock = document.getElementById("codeSnippet");
    codeSnippetBlock.innerText = item.content.codeSnippet;
  }

  var draggedItem = null;

  document.addEventListener("dragstart", function (event) {
    draggedItem = event.target;
    event.dataTransfer.setData("text", "");
  });

  document.addEventListener("dragover", function (event) {
    event.preventDefault();
  });

  document.addEventListener("drop", function (event) {
    event.preventDefault();
    if (event.target.classList.contains("draggable-item")) {
      var droppedItem = event.target;
      if (draggedItem != droppedItem) {
        var droppedIndex = Array.prototype.indexOf.call(droppedItem.parentNode.children, droppedItem);
        var draggedIndex = Array.prototype.indexOf.call(draggedItem.parentNode.children, draggedItem);
        if (draggedIndex < droppedIndex) {
          droppedItem.parentNode.insertBefore(draggedItem, droppedItem.nextSibling);
        } else {
          droppedItem.parentNode.insertBefore(draggedItem, droppedItem);
        }
      }
    }
  });

};

function removeListItem(button, id, listType) {
  console.log(`removeListItem(..., ${id})`)
  button.parentNode.parentNode.removeChild(button.parentNode);

  updateListObj(id, document.getElementById(`${id}-list`), listType);
}

const editItemContent = function (item) {
  console.log("In editItemContent()...");
  const fieldset = getFieldset();

  hideElement("add-item")

  console.log(`fieldset.name = ${fieldset.name} `)
  console.log(item);

  populateItemFieldset(item);

  document.getElementById("_itemDebug").innerHTML = JSON.stringify(item, null, 2);

  showElement("item-data");
  // showElement("delete-item")
  // console.log(id);
}


function my_content_init() {
  if (editItem) {
    console.log(`Editting item ${editItem.title} `)

    editItemContent(editItem);
  } else {

    let empty = {
      title: "",
      metadata: {
        tags: [

        ],
        contentType: "",
        state: "private",
        private: false,
        iconClass: "",
        updated: getFormattedDate(),
        creator: `${substituteSettings("{{home.name}}")}`,
        creatorEmail: `${substituteSettings("{{home.email}}")}`,
        source: "",
        scripts: []
      },
      content: {
        description: "",
        images: [],
        links: [],
        usage: []
      }
    }

    editItemContent(empty)
  }

}
