# wiktionary-json
Parse a wiktionary article to JSON

### Installation
`npm i wiktionary-json`

### Usage
```js
const wiktionaryJson = require('wiktionary-json')

// parse content from a full wiktionary page HTML
const content = wiktionaryJson('<html>...')
```

### Parsed result structure
```json
[{
  "headingLevel":1,
  "title":"plasma",
  "children":[
    {
        "headingLevel":2,
        "title":"English",
        "children":[
          {
              "headingLevel":3,
              "title":"Pronunciation",
              "children":[...]
          }
        ]
    },
    {
        "headingLevel":2,
        "title":"Estonian[edit]",
        "children":[...]
    }
  ]
}]
```
