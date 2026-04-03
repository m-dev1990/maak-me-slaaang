import SlangenveldView from './SlangenveldView.js'

export default new class SlangenveldTopScoresView {
    #text_cells_array = undefined

    start(top_scores) {
        this.#text_cells_array = []
        let title = 'TOP SCORES'
        let title_start_x = 24 - 1 - title.length
        let title_cells = SlangenveldView.render_cells_content([title_start_x, 1], title)
        this.#text_cells_array.push(...title_cells)

        let title_underline = '-'.repeat(title.length)
        let title_underline_cells = SlangenveldView.render_cells_content([title_start_x, 2], title_underline)
        this.#text_cells_array.push(...title_underline_cells)

        for (let i = 0; i < top_scores.length; i++) {
            let [name, score] = top_scores[i]
            
            let name_str = name.slice(0, 18).padStart(18, ' ')
            let score_str = score.toString()
            score_str = score_str.substring(score_str.length - 3).padStart(3, ' ')
            let row_str = ' ' + name_str + ' ' + score_str + ' '

            let row_cells = SlangenveldView.render_cells_content([0, 4 + i], row_str)

            this.#text_cells_array.push(...row_cells)
        }
    }
    
    clear() {
        SlangenveldView.clear_cells(this.#text_cells_array)
    }
}