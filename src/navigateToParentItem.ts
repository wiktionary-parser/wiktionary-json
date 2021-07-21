import findItemsById from './findItemsById'
import { Item } from './models'

const navigateToParent = (howManyTimes: number, item: Item, items: Item[]): Item => {
    if(howManyTimes === 0) return item

    const parentItem = findItemsById(items, item._parentId)
    if(!parentItem) {
        throw new Error('did not found parent item')
    }


    const newHowManyTimes = parentItem._headingLevel < item._headingLevel ? howManyTimes - 1 : howManyTimes

    return navigateToParent(newHowManyTimes, parentItem, items)
}

export default navigateToParent