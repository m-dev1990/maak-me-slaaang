import * as Application from '../application.js'
import Game from '../Game.js'

export default new class GamePlayingKeyboard {
    #context = new Application.ClearableContext()

    activate() {
        this.#context.addEventListener(document, 'keydown', this.#handle_key_down)
    }

    deactivate() {
        this.#context.clear()
    }

    #handle_key_down(ev) {
        if (ev.key.startsWith('Arrow')) {
            if (ev.key === 'ArrowUp') {
                Game.update_direction(Game.Directions.up)
            }
            if (ev.key === 'ArrowDown') {
                Game.update_direction(Game.Directions.down)
            }
            if (ev.key === 'ArrowLeft') {
                Game.update_direction(Game.Directions.left)
            }
            if (ev.key === 'ArrowRight') {
                Game.update_direction(Game.Directions.right)
            }
        }
    }
}