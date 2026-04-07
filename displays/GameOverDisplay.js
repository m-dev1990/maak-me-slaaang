import * as Utils from '../utils.js'
import MainView from '../views/MainView.js'
import SlangenveldGameOverView from '../views/SlangenveldGameOverView.js'

export default new class GameOverDisplay {
    #fn_resolve
    #context = new Utils.ClearableContext()

    start() {
        MainView.set_display_class('game-over')
        SlangenveldGameOverView.render()
        
        this.#context.addEventListener(el_top_scores_link, 'click', this.#handle_click_top_scores_link)
        this.#context.addEventListener(document, 'keydown', this.#handle_keydown, {})      
        if (!Utils.has_keyboard) {
            this.#context.addEventListener(document, 'touchstart', this.#handle_touchstart, {})
        }    
        return this
    }

    then(fn_resolve) {
        this.#fn_resolve = fn_resolve
    }

    #close(params) {
        SlangenveldGameOverView.clear(app.game)
        this.#context.clear()
        this.#fn_resolve(params)
        this.#fn_resolve = undefined
    }

    /**
     * 
     * @param {MouseEvent} ev 
     */
    #handle_click_top_scores_link = ev => {
        this.#close({ next_view: 'top-scores' })
    }

    #handle_keydown = ev => {
        if (ev.key === 'Enter') {
            this.#close()
        }
    }

    #handle_touchstart = ev => {
        let el = ev.target
        if (el === el_top_scores_link) return

        this.#close()
    }
}