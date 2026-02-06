import * as Application from '../application.js'
import * as MainDisplay from './MainDisplay.js'
import TopScoresKeyboard from '../keyboards/TopScoresKeyboard.js'
import SlangenveldTopScoresView from '../views/SlangenveldTopScoresView.js'

export default new class TopScoresDisplay {
    #fn_res = undefined

    start(top_scores) {
        TopScoresKeyboard.activate()
        MainDisplay.set_display('top-scores')
        SlangenveldTopScoresView.start(top_scores)

        return this
    }

    then(fn_res) {
        this.#fn_res = fn_res
    }

    close() {
        TopScoresKeyboard.deactivate()
        SlangenveldTopScoresView.clear()
        this.#fn_res()
        this.#fn_res = undefined
    }
}