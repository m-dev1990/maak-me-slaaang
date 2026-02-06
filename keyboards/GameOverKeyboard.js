import * as Application from '../application.js'
import GameOverDisplay from '../displays/GameOverDisplay.js'

export default new class GameOverKeyboard {
    #context = new Application.ClearableContext()

    activate() {
        this.#context.addEventListener(document, 'keydown', this.#handle_keydown, {})
    }

    deactivate() {
        this.#context.clear()
    }

    #handle_keydown = ev => {
        if (ev.key === 'Enter') {
            GameOverDisplay.close()
        }
    }
}