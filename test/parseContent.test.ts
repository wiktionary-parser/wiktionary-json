import * as fs from 'fs';
import parseContent from '../src/parseContent'

fdescribe('parse content', () => {

    const fileBuffer = fs.readFileSync('./test/document.html');
    const result = parseContent(fileBuffer)
    console.log("result", result)
    console.log()

    fs.writeFileSync('./ople.json', JSON.stringify(result, undefined, 2))

    it('should parse', () => {
        expect('c').toBe('c')
    })
})