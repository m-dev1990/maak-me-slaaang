import * as Application from '../application.js'
import * as MainDisplay from './MainDisplay.js'
import GameOverKeyboard from '../keyboards/GameOverKeyboard.js'
import MainView from '../views/MainView.js'
import SlangenveldGameOverView from '../views/SlangenveldGameOverView.js'

export default new class GameOverDisplay {
    #fn_resolve
    #context = new Application.ClearableContext()

    start() {
        GameOverKeyboard.activate()
        MainDisplay.set_display('game-over')
        MainView.activate_top_scores_link()
        SlangenveldGameOverView.render()        
        return this
    }

    then(fn_resolve) {
        this.#fn_resolve = fn_resolve
    }

    close(params) {
        GameOverKeyboard.deactivate()
        MainView.deactivate_top_scores_link()
        SlangenveldGameOverView.clear(app.game)
        this.#context.clear()
        this.#fn_resolve(params)
        this.#fn_resolve = undefined
    }
}