import MainView from '../views/MainView.js'
import GameEngine from '../engines/GameEngine.js'
import GamePlayingView from '../views/SlangenveldGamePlayingView.js'
import GamePadView from '../views/GamePadView.js'
import * as Utils from '../utils.js'

export function * start(game) {
    let context = new Utils.ClearableContext()

    let _error
    try {
        MainView.set_display_class('game-playing')
        GamePadView.start()
        GamePlayingView.start(game)

        context.addEventListener(document, 'keydown', handle_key_down)

        while (true) {
            let update = yield
            GamePlayingView.update(update)
        }
    } catch (error) {
        _error = error
        return
    } finally {
        context.clear()
        GamePlayingView.clear()
        GamePadView.stop()
    }

    function handle_key_down(ev) {
        if (ev.key === 'ArrowUp') {
            GameEngine.update_direction(GameEngine.Directions.up)
        }
        if (ev.key === 'ArrowDown') {
            GameEngine.update_direction(GameEngine.Directions.down)
        }
        if (ev.key === 'ArrowLeft') {
            GameEngine.update_direction(GameEngine.Directions.left)
        }
        if (ev.key === 'ArrowRight') {
            GameEngine.update_direction(GameEngine.Directions.right)
        }
    }
}