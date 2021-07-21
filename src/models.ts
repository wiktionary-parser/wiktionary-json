interface Item {
    _id: number
    _parentId: number
    _headingLevel: number
    title: string
    children: Item[]
    elements: any[]
}

export { Item }