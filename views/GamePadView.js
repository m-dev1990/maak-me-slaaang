import Game from '../Game.js'
import * as Application from '../application.js'

export default new class GamePadView {
    #context = new Application.ClearableContext()

    start() {
        this.#wire_up_el_game_pad(el_game_pad_up, Game.Directions.up)
        this.#wire_up_el_game_pad(el_game_pad_down, Game.Directions.down)
        this.#wire_up_el_game_pad(el_game_pad_left, Game.Directions.left)
        this.#wire_up_el_game_pad(el_game_pad_right, Game.Directions.right)
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

            fn_cancel = Application.Cancellable.requestAnimationFrame(function () {
                el_game_pad.classList.add('_fading_start')
                fn_cancel = Application.Cancellable.requestAnimationFrame(function () {
                    el_game_pad.classList.add('_fading_end')
                    fn_cancel = Application.Cancellable.addEventListener(el_game_pad, 'transitionend', function () {
                        el_game_pad.classList.remove('_touched', '_fading_start', '_fading_end')
                        fn_cancel = undefined
                    }, { once: true })
                })
            })

            Game.update_direction(direction)
        })
    }
}

