import { Item } from '../src/models'
import * as faker from 'faker'
import findItemsById from '../src/findItemsById'

const createItem = () : Item  => ({
  _id: faker.unique(faker.datatype.number),
  _headingLevel: 0,
  _parentId: 0,
  children: [],
  elements: [],
  title: faker.name.title()
})

describe('findItemsById', () => {
  it('find item', () => {
    const items:Item[] = [createItem(),createItem(),createItem()]

    items[0].children = [createItem(),createItem(),createItem()]
    items[0].children[0].children = [createItem(),createItem(),createItem()]
    items[0].children[1].children = [createItem(),createItem(),createItem()]
    items[0].children[2].children = [createItem(),createItem(),createItem()]

    items[1].children = [createItem(),createItem(),createItem()]
    items[1].children[0].children = [createItem(),createItem(),createItem()]
    items[1].children[1].children = [createItem(),createItem(),createItem()]
    items[1].children[2].children = [createItem(),createItem(),createItem()]

    items[2].children = [createItem(),createItem(),createItem()]
    items[2].children[0].children = [createItem(),createItem(),createItem()]
    items[2].children[1].children = [createItem(),createItem(),createItem()]
    items[2].children[2].children = [createItem(),createItem(),createItem()]

    const expectedId = 777
    const expectedTitle = 'expected title'
    items[1].children[1].children[1]._id = expectedId
    items[1].children[1].children[1].title = expectedTitle

    const expectedItem = findItemsById(items, expectedId)
    expect(expectedItem?._id).toBe(expectedId)
    expect(expectedItem?.title).toBe(expectedTitle)

    const unexpectedItem = findItemsById(items, 88888888)
    expect(unexpectedItem).toBeUndefined()
  })
})