import * as cheerio from 'cheerio'
import { Item } from './models';
import findItemsById from './findItemsById';
import navigateToParent from './navigateToParentItem';

let $: cheerio.Root;

const HEADER_ELEMENTS = ['h1','h2', 'h3', 'h4', 'h5']
const isHeaderElement = (e: cheerio.TagElement) => HEADER_ELEMENTS.includes(e.name)
const getHeadingLevel = (headingTag: string) => parseInt(headingTag.substr(1, 1))

const parse = (elementsToParse: cheerio.TagElement[], parsedItems: Item[], lastParsedItem: Item): Item[] => {
    const [e, ...restOfElements] = elementsToParse; 

    if(!e) return parsedItems

    if(isHeaderElement(e)) {
        const levelDifference = getHeadingLevel(e.name) - lastParsedItem._headingLevel
        
        if(levelDifference > 0) {
            //its a child item
            const newHeaderItem: Item = {
                _id: lastParsedItem._id + 1,
                _parentId: lastParsedItem._id,
                _headingLevel: getHeadingLevel(e.name),
                title: $(e).find('span:first-child').html() || '',
                children: [],
                elements: []
            }

            lastParsedItem.children.push(newHeaderItem)

            return parse(restOfElements, parsedItems, newHeaderItem)
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
                title: $(e).find('span:first-child').html() || '',
                children: [],
                elements: []
            }

            parentItem.children.push(newHeaderItem)

            return parse(restOfElements, parsedItems, newHeaderItem)
        }

        if(levelDifference < 0) {

            const positiveDiference = levelDifference * -1 + 1

            const parentItem = navigateToParent(positiveDiference, lastParsedItem, parsedItems)

            const newHeaderItem: Item = {
                _id: lastParsedItem._id + 1,
                _parentId: parentItem._id,
                _headingLevel: getHeadingLevel(e.name),
                title: $(e).find('span:first-child').html() || '',
                children: [],
                elements: []
            }

            parentItem.children.push(newHeaderItem)

            return parse(restOfElements, parsedItems, newHeaderItem)
        }

    }

    //lastParsedItem.elements.push($(e).html())

    return parse(restOfElements, parsedItems, lastParsedItem)
}


const parseContent = (content: Buffer) : Item[] => {
    $ = cheerio.load(content);
    const articleElements = $('.mw-parser-output > *').map((i, e) => e).get()

    const item: Item = {
        _id: 1,
        _parentId: 0,
        _headingLevel: 1,
        title: 'pool',
        children: [],
        elements: []
    }

    return parse(articleElements, [item], item)
}

export default parseContent;