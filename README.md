# si-ping-deck-config

# preferences.json
The `preferences.json` defines the preferencs usedn when the preference button/cog is clicked.  At the top level, the json is broken up by the different tabs that are used in the Preferences.

Example (top-level):
```json
{
  "tab1": {  },
  "tab2": {  }
}
```

For each `tab-id`, the tab definition contains 2 required components (`title` and `inputs`)

* title (String) - Used as the tab name
* inputs (Array of elements) - Defines how each element should be presented

Example (tab-id level):
```json
{
   "title": "Tab Name",
   "inputs": [ { }, { } ]
```

For each type of Input/Element, there are different types of attributes.  Depending on the type, the attributes may change.  Defaults denoted by the * below.

* id (String) - ID used to store the preference.  The tabId along with and underscore and this Id will create the full preference.
* type (String) - One of (`input`*, `password`, `dropdown`, `button`, `html`)
* label (String) - String used to display a label before the element in the Preferences
* tooltip (String) - Currently not used.

Example (Preference with a `text` input of a name and a label of `Full Name`
```json
{
  "id": "name",
  "label": "Full Name",
  "type": "text",
  "tooltip": "This is your full name"
}
```

Example (Prefence with a `password` input and a label of `Secret Info`
```json
{
  "id": "secretPassword",
  "label": "Secret Info",
  "type": "password",
}
```

TODO: Example of Dropdown
TODO: Example of Button
TODO: Example of Html
