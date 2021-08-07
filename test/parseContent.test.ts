import * as fs from 'fs';
import parseContent from '../src/parseContent'

fdescribe('parse content', () => {
    it('should parse', () => {
        const fileBuffer = fs.readFileSync('./test/document.html');
        const result = parseContent(fileBuffer)

        //console.log("result", JSON.stringify(result, undefined, 2))

        const headItem = result[0]

        
        // only the head element
        expect(result.length).toBe(1)

        expect(headItem.title).toBe('pool')
        expect(headItem.children.length).toBe(9)

        const firstChild = headItem.children[0]
        expect(firstChild.title).toBe('English')
        expect(firstChild.children.length).toBe(4)

        const firstChildChild = firstChild.children[0]
        expect(firstChildChild.title).toBe('Pronunciation')
        expect(firstChildChild.children.length).toBe(0)

        const secondChildChild = firstChild.children[1]
        expect(secondChildChild.title).toBe('Etymology 1')
        expect(secondChildChild.children.length).toBe(2)
    })
})