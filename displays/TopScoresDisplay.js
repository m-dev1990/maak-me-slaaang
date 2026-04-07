import * as Utils from '../utils.js'
import MainView from '../views/MainView.js'
import SlangenveldTopScoresView from '../views/SlangenveldTopScoresView.js'

export default new class TopScoresDisplay {
    #context = new Utils.ClearableContext()
    #fn_res = undefined

    start(top_scores) {
        MainView.set_display_class('top-scores')
        SlangenveldTopScoresView.start(top_scores)
        this.#context.addEventListener(document, 'keydown', this.#handle_keydown, {})
        
        if (!Utils.has_keyboard) {
            this.#context.addEventListener(document, 'touchstart', this.#handle_touchstart, {})
        }

        return this
    }

    then(fn_res) {
        this.#fn_res = fn_res
    }

    #handle_keydown = ev => {
        if (ev.key === 'Enter') {
            this.#close()
        }
    }

    #handle_touchstart = ev => {
        this.#close()
    }

    #close() {
        this.#context.clear()
        SlangenveldTopScoresView.clear()
        this.#fn_res()
        this.#fn_res = undefined
    }
}