import SlangenveldView from './SlangenveldView.js'
import templates from '../structure.js'

export default new class GameOverView {
    #text_cells_array = undefined
    render() {
        let game_over_text_array = [...'GAME OVER! '.split(''), ':-(']
        this.#text_cells_array = SlangenveldView.render_cells_content([11, 11], game_over_text_array)
    }
    clear(game) {
        SlangenveldView.clear_cells(this.#text_cells_array)
        this.#text_cells_array = undefined
    }
}