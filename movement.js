import GameEngine from './engines/GameEngine.js'
import * as TopScoresEngine from './engines/TopScoresEngine.js'
import GameOverDisplay from './displays/GameOverDisplay.js'
import SpelerNameDisplay from "./displays/SpelerNameDisplay.js"
import TopScoresDisplay from './displays/TopScoresDisplay.js'
import * as GamePlayingDisplay from './displays/GamePlayingDisplay.js'

let app = {
    speler_name: {
        first_name: undefined,
    },
    game: undefined,
    top_scores: undefined,
}

globalThis.app = app

let top_scores_promise = (async function load_top_scores () {
    app.top_scores = await TopScoresEngine.load_top_scores()
})()

let speler_name = await SpelerNameDisplay.activate()
app.speler_name.first_name = speler_name

el_speler_name.textContent = app.speler_name.first_name + ' De Slang'

while (true) {
    app.game = GameEngine.generate_game_state()

    let game_playing_view = GamePlayingDisplay.start(app.game)

    app.game.time = Date.now()

    for await (let frame of loop_animation_frames()) {
        let now = Date.now()
        let next_time = app.game.time + app.game.move_interval

        let moves_step = now > next_time
        
        if (moves_step) {
            app.game.time = next_time
            let [has_next, update] = GameEngine.update_move()

            game_playing_view.next(update)
            
            if (!has_next) {
                break
            }
        }
    }

    game_playing_view.return()

    top_scores_promise = (async function handle_new_score () {
        app.top_scores = await TopScoresEngine.handle_new_score(app.speler_name.first_name, app.game.score)
    })()

    let result = await GameOverDisplay.start()

    if (result !== undefined && result.next_view === 'top-scores') {
        await top_scores_promise
        await TopScoresDisplay.start(app.top_scores)
    }
}

async function * loop_animation_frames() {
    while (true) {
        yield { then: (fn_res, fn_rej) => requestAnimationFrame(() => fn_res()) }
    }
}