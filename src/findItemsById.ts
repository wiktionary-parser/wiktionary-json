import { Item } from './models';

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

export default findItemsById