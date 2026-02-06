let response = await fetch('structure.html')
let template = await response.text()
/** @type {{ [key: string](state: any): string }} */
let templates = vash.compileBatch(template)

export default templates