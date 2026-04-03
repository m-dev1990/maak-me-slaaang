import * as Utils from '../utils.js'
import templates from '../structure.js'

// 2. Setup static game content
/** @type {HTMLDivElement} */
let elContent = globalThis.elContent

let content_HTML = templates.app({})
elContent.innerHTML = content_HTML

/** @type {HTMLDivElement} el_slangenveld_positioner */
let el_slangenveld_positioner = globalThis.el_slangenveld_positioner
/** @type {HTMLDivElement} el_slangenveld_raster */
let el_slangenveld_raster = globalThis.el_slangenveld_raster
/** @type {HTMLDivElement} el_slangenveld */
let el_slangenveld = globalThis.el_slangenveld
/** @type {HTMLDivElement} el_main */
let el_main = globalThis.el_main
/** @type {HTMLElement} */
let el_speler_name = globalThis.el_speler_name
/** @type {HTMLElement} */
let el_score = globalThis.el_score


let arr_el_slangenveld_vak = Array.from(elContent.getElementsByTagName('m-slangenveld-vak'))

let el_game_positioner = globalThis.el_game_positioner

/**
 * @typedef {{
 *   [key in Utils.$DOM$]: {
 *      el_slangenveld_vak: HTMLElement,
 *      el_slangenveld_vak_content: HTMLElement,
 *   }
 * }} tSlangenveldVak
 * 
 * @type {tSlangenveldVak[][]} grid
 *
 */
let grid = new Array(24).fill(undefined).map(x => new Array(24).fill(undefined))

for (let el_slangenveld_vak of arr_el_slangenveld_vak) {
    let y = Number.parseInt(el_slangenveld_vak.getAttribute('y')) - 1
    let x = Number.parseInt(el_slangenveld_vak.getAttribute('x')) - 1

    let el_slangenveld_vak_content = el_slangenveld_vak.querySelector('m-slangenveld-vak-content')

    grid[y][x] = {
        position: [x, y],
        [Utils.$DOM$]: {
            el_slangenveld_vak: el_slangenveld_vak,
            el_slangenveld_vak_content: el_slangenveld_vak_content,
        }
    }
}

// 3. Start resizing slangenveld
;(function start_resizing_slangenveld() {
    window.addEventListener('resize', function handle_resize(ev) {
        size_slangenveld()
    })

    size_slangenveld()

    function size_slangenveld() {
        let height = el_slangenveld_positioner.clientHeight
        let width = el_slangenveld_positioner.clientWidth
        let shortest_side_size = Math.min(height, width)
        let cell_size = Math.floor((shortest_side_size - 23) / 24)
        let font_size = Math.floor((cell_size * 0.65) / 2) * 2
        
        el_slangenveld.style.lineHeight = font_size + 'px'
        el_slangenveld.style.fontSize = font_size + 'px'

        if (el_slangenveld_positioner.clientWidth < el_slangenveld_positioner.clientHeight) {
            el_slangenveld.classList.remove('_horizontal')
            el_slangenveld.classList.add('_vertical')
        } else {
            el_slangenveld.classList.remove('_vertical')
            el_slangenveld.classList.add('_horizontal')
        }
    }
})()

export default new class SlangenveldView {
    grid = grid
    render_cells_content(position, array_content, params) {
        params = this.#complete_default_params(params)

        let text_cells = []
        for (let i = 0; i < array_content.length; ++i) {
            let content = array_content[i]
            if (content.trim() === '') continue
            let x = position[0] + i
            let y = position[1]
            let cell = this.#render_cell_content([x, y], content, params)
            text_cells.push(cell)
        }
        return text_cells
    }

    render_cell_content(position, content, params) {
        params = this.#complete_default_params(params)
        return this.#render_cell_content(position, content, params)
    }

    clear_cells(cells) {
        for (let cell of cells) {
            this.#render_cell_content(cell.position, undefined)
        }
    }

    #complete_default_params(params) {
        return Object.assign({
            color: 'green',
            is_bold: false,
            rotation_degrees: 0,
            is_plinking: false,
        }, params)   
    }

    #render_cell_content(position, content, params) {
        let cell = this.grid[position[1]][position[0]]
        let cellDOM = cell[Utils.$DOM$]
        
        if (cellDOM.el_slangenveld_vak_content !== undefined) {
            cellDOM.el_slangenveld_vak_content.remove()
            cellDOM.el_slangenveld_vak_content = undefined
        }
        
        if (content !== undefined) {
            let el_slangenveld_vak_content = window.document.createElement('m-slangenveld-vak-content')
            el_slangenveld_vak_content.textContent = content

            if (params.color === 'green') {
                el_slangenveld_vak_content.classList.add('_green')
            } else if (params.color === 'pink') {
                el_slangenveld_vak_content.classList.add('_pink')
            }

            if (params.is_bold) {
                el_slangenveld_vak_content.classList.add('_bold')
            }

            if (params.rotation_degrees !== 0) {
                if (params.rotation_degrees === 90) {
                    el_slangenveld_vak_content.classList.add('_rotated_90_deg')
                } else if (params.rotation_degrees === 180) {
                    el_slangenveld_vak_content.classList.add('_rotated_180_deg')
                } else if (params.rotation_degrees === 270) {
                    el_slangenveld_vak_content.classList.add('_rotated_270_deg')
                }
            }

            if (params.is_plinking) {
                el_slangenveld_vak_content.classList.add('_plinking')
            }

            cellDOM.el_slangenveld_vak_content = el_slangenveld_vak_content
            cellDOM.el_slangenveld_vak.append(el_slangenveld_vak_content)

            return cell
        }
    }
}