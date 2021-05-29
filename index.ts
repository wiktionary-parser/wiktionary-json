import fs from 'fs'
import cheerio from 'cheerio'

interface Item {
  _id: number
  _parentId: number
  _headingLevel: number
  title: string
  children: Item[]
}

const fileBuffer = fs.readFileSync('./document.html');
const $ = cheerio.load(fileBuffer);
const headerElements = [0, 'h1','h2', 'h3', 'h4', 'h5']

const isHeaderElement = (e: cheerio.TagElement) => headerElements.includes(e.name)

const getHeaderElementDifference = (e: cheerio.TagElement, currentLevel: number) => {
    const elementIndex = headerElements.findIndex((x) => x === e.name)

    if(elementIndex < 0) {
        throw new Error('header element does not exist')
    }

    return elementIndex - currentLevel;
}

const getHeadingLevel = (headingTag: string) => parseInt(headingTag.substr(1, 1))

const navigateToParent = (howManyTimes: number, item: Item, items: Item[]): Item => {
    if(howManyTimes === 0) return item

    const parentItem = findItemsById(items, item._parentId)
    if(!parentItem) {
        throw new Error('did not found parent item')
    }


    const newHowManyTimes = parentItem._headingLevel < item._headingLevel ? howManyTimes - 1 : howManyTimes

    return navigateToParent(newHowManyTimes, parentItem, items)
}

const findItemsById = (items: Item[], id: number) : Item | undefined => {
    const [item, ...restOfItems] = items

    if(!item) return

    if(item._id === id) {
        return item
    }

    if(item.children.length > 0) {
        const foundInChildrenItem = findItemsById(item.children, id)
        if(foundInChildrenItem) {
            return foundInChildrenItem
        }
    }

    return findItemsById(restOfItems, id)
}

const parseInnerContent = (elementsToParse: cheerio.TagElement[], parsedItems: Item[], lastParsedItem: Item): void => {
    const [e, ...restOfElements] = elementsToParse; 

    if(!e) return

    if(isHeaderElement(e)) {
        const levelDifference = getHeadingLevel(e.name) - lastParsedItem._headingLevel

        if(levelDifference > 0) {
            const newHeaderItem: Item = {
                _id: lastParsedItem._id + 1,
                _parentId: lastParsedItem._id,
                _headingLevel: getHeadingLevel(e.name),
                title: $(e).find('span:first-child').text(),
                children: [],
            }

            lastParsedItem.children.push(newHeaderItem)
            
            return parseInnerContent(restOfElements, parsedItems, newHeaderItem)
        }
        
        if(levelDifference == 0) {
            const parentItem = findItemsById(parsedItems, lastParsedItem._parentId)

            if(!parentItem) {
                throw new Error('note faunde')
            }

            const newHeaderItem: Item = {
                _id: lastParsedItem._id + 1,
                _parentId: parentItem._id,
                _headingLevel: getHeadingLevel(e.name),
                title: $(e).find('span:first-child').text(),
                children: [],
            }

            parentItem.children.push(newHeaderItem)

            return parseInnerContent(restOfElements, parsedItems, newHeaderItem)
        }


        if(levelDifference < 0) {
            const positiveDiference = levelDifference * -1 + 1

            const parentItem = navigateToParent(positiveDiference, lastParsedItem, parsedItems)

            const newHeaderItem: Item = {
                _id: lastParsedItem._id + 1,
                _parentId: parentItem._id,
                _headingLevel: getHeadingLevel(e.name),
                title: $(e).find('span:first-child').text(),
                children: [],
            }

            parentItem.children.push(newHeaderItem)

            return parseInnerContent(restOfElements, parsedItems, newHeaderItem)
        }
    }
    
    return parseInnerContent(restOfElements, parsedItems, lastParsedItem)
}

const articleElements = $('.mw-parser-output > *').map((i, e) => e).get()

const item: Item = {
    _id: 1,
    _parentId: 0,
    _headingLevel: 1,
    title: 'pool',
    children: []
}
const parsedItems = [item]
parseInnerContent(articleElements, parsedItems, item)

console.log(JSON.stringify(parsedItems, undefined, 2))


/*




$('.mw-parser-output > *').each(function(i, e) {
    if(e.name === 'h2') {
        const language = $(e).children('span:first-child').text()
        objs.push({
            title: language,
            items: []
        })

        return
    }

    const obj = objs[objs.length - 1]
    
    if(e.name === 'h3') {
        const itemTitle = $(e).children('span:first-child').text().toLocaleLowerCase()
        obj.items.push({
            title: itemTitle,
            items: []
        })

        return
    }

    // parse inner content
    if(e.name === 'h4') {
        const itemTitle = $(e).children('span:first-child').text().toLocaleLowerCase()
        const lastItem = obj.items[obj.items.length - 1]
        lastItem && lastItem.items.push({
            title: itemTitle,
            items: []
        })

        return
    }

    const lastItem = obj && obj.items[obj.items.length - 1]
    if(obj && lastItem) {
        const xxx = lastItem.items[lastItem.items.length - 1]
        console.log("xxx", xxx)
        xxx && xxx.items.push($(e).text())
    }





    if(currentObject === 'pronunciation') {
        $(e).find('ul > li').each((j, e2) => {
            const description = $(e2).find('> .qualifier-content').text()
            const pronounce = $(e2).find('> .IPA').text()

            if(pronounce) {
                obj['pronunciation'].push({
                    description, pronounce
                })
            }

            console.log(`${description} <> ${pronounce}`)
        })
    }
});

*/