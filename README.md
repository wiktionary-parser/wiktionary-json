# wiktionary-json
Parse a wiktionary article to JSON

### Installation
`npm i wiktionary-json`

### Usage
```js
const wiktionaryJson = require('wiktionary-json')

// download and read content from the internet
const content = wiktionaryJson.parseFromUrl('https://en.wiktionary.org/wiki/plasma')

// or parse content from already downloaded wiktionary page/html
const content = wiktionaryJson.parserFromHTML('<html>...')
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
