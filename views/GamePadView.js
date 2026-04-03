import GameEngine from '../engines/GameEngine.js'
import * as Utils from '../utils.js'

export default new class GamePadView {
    #context = new Utils.ClearableContext()

    start() {
        this.#wire_up_el_game_pad(el_game_pad_up, GameEngine.Directions.up)
        this.#wire_up_el_game_pad(el_game_pad_down, GameEngine.Directions.down)
        this.#wire_up_el_game_pad(el_game_pad_left, GameEngine.Directions.left)
        this.#wire_up_el_game_pad(el_game_pad_right, GameEngine.Directions.right)
    }

    stop() {
        this.#context.clear()
    }

    #wire_up_el_game_pad(el_game_pad, direction) {
        let fn_cancel = undefined
        this.#context.addEventListener(el_game_pad, 'touchstart', function handle_touch_start() {
            if (fn_cancel) {
                fn_cancel()
                el_game_pad.classList.remove('_touched', '_fading_start', '_fading_end')
                fn_cancel = undefined
            }

            el_game_pad.classList.add('_touched')

            fn_cancel = Utils.Cancellable.requestAnimationFrame(function () {
                el_game_pad.classList.add('_fading_start')
                fn_cancel = Utils.Cancellable.requestAnimationFrame(function () {
                    el_game_pad.classList.add('_fading_end')
                    fn_cancel = Utils.Cancellable.addEventListener(el_game_pad, 'transitionend', function () {
                        el_game_pad.classList.remove('_touched', '_fading_start', '_fading_end')
                        fn_cancel = undefined
                    }, { once: true })
                })
            })

            GameEngine.update_direction(direction)
        })
    }
}

