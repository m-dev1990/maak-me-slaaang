import * as Application from '../application.js'
import TopScoresDisplay from '../displays/TopScoresDisplay.js'

export default new class TopScoresKeyboard {
    #context = new Application.ClearableContext()

    activate() {
        this.#context.addEventListener(document, 'keydown', this.#handle_keydown, {})
    }

    deactivate() {
        this.#context.clear()
    }

    #handle_keydown = ev => {
        if (ev.key === 'Enter') {
            TopScoresDisplay.close()
        }
    }
}