import { Item } from '../src/models'
import * as faker from 'faker'
import navigateToParentItem from '../src/navigateToParentItem'

const createItem = (_id: number, _parentId: number, _headingLevel: number) : Item  => ({
  _id,
  _headingLevel,
  _parentId,
  children: [],
  elements: [],
  title: faker.name.title()
})

describe('navigate to parent item', () => {
  const items:Item[] = [createItem(0, 0, 1),createItem(1, 0, 1),createItem(2, 0, 1)]

  items[0].children = [createItem(3, 0, 2),createItem(4, 0, 2),createItem(5, 0, 2)]
  items[1].children = [createItem(6, 1, 2),createItem(7, 1, 2),createItem(8, 1, 2)]
  items[2].children = [createItem(9, 2, 2),createItem(10, 2, 2),createItem(11, 2, 2)]

  items[1].children[0].children = [createItem(12, 6, 3),createItem(13, 6, 3),createItem(14, 6, 3)]
  items[1].children[1].children = [createItem(15, 7, 3),createItem(16, 7, 3),createItem(17, 7, 3)]
  items[1].children[2].children = [createItem(18, 8, 3),createItem(19, 8, 3),createItem(20, 8, 3)]
  
  it('navigate once', () => {
    const childItem = items[1].children[1].children[1]
    const foundItem = navigateToParentItem(1, childItem, items)
    const expectedParentItem = items[1].children[1]
    
    expect(foundItem._id).toBe(expectedParentItem._id)
  })

  it('navigate twice', () => {
    const childItem = items[1].children[1].children[1]
    const foundItem = navigateToParentItem(2, childItem, items)
    const expectedParentItem = items[1]
    
    expect(foundItem._id).toBe(expectedParentItem._id)
  })
})