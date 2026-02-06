import Game from './Game.js'
import GameOverView from './views/SlangenveldGameOverView.js'
import GamePlayingView from './views/SlangenveldGamePlayingView.js'
import SlangenveldTopScoresView from './views/SlangenveldTopScoresView.js'
import GamePadView from './views/GamePadView.js'
import GameOverDisplay from './displays/GameOverDisplay.js'
import SpelerNameDisplay from "./displays/SpelerNameDisplay.js"
import templates from './structure.js'
import * as Application from './application.js'
import GamePlayingKeyboard from './keyboards/GamePlayingKeyboard.js'
import MainView from './views/MainView.js'
import * as MainDisplay from './displays/MainDisplay.js'
import TopScoresDisplay from './displays/TopScoresDisplay.js'

let app = {
    speler_name: {
        first_name: undefined,
        get full_name() {
            return this.first_name + ' De Slang'
        }
    },
    game: undefined,
}

globalThis.app = app

let top_scores = await fetch('https://maak-me-slaaang-server.vercel.app/top.json').then(x => x.json())

let speler_name = await SpelerNameDisplay.activate()

app.speler_name.first_name = speler_name

MainView.set_speler_name(app.speler_name.full_name)

export async function start_game() {
    
    while (true) {
        let old_game = app.game
        app.game = Game.generate_game_state()

        MainDisplay.set_display('game-playing')
        GamePadView.start()
        GamePlayingKeyboard.activate()
        GamePlayingView.start(app.game)
        
        app.game.time = Date.now()

        let game_context = new Application.ClearableContext()

        for await (let frame of loop_animation_frames()) {
            let now = Date.now()
            let next_time = app.game.time + app.game.move_interval

            let moves_step = now > next_time
            
            if (moves_step) {
                app.game.time = next_time
                let [has_next, update] = Game.update_move()
                GamePlayingView.update(update)

                if (!has_next) {
                    break
                }
            }
        }

        game_context.clear()
        GamePlayingView.clear()
        GamePlayingKeyboard.deactivate()
        GamePadView.stop()

        let top_score_10 = undefined
        if (top_scores.length === 10) {
            top_score_10 = top_scores[9][1]
        }
        
        let top_scores_promise = undefined
        if (top_score_10 === undefined || top_score_10 < app.game.score) {
            top_scores_promise = (async function () {
                await fetch('https://maak-me-slaaang-server.vercel.app/score', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify([app.speler_name.first_name, app.game.score]),
                })
                let top_scores_response = await fetch('https://maak-me-slaaang-server.vercel.app/top.json')
                top_scores = await top_scores_response.json()
            })()
        }

        let result = await GameOverDisplay.start()

        if (result !== undefined && result.next_view === 'top-scores') {
            await top_scores_promise
            await TopScoresDisplay.start(top_scores)
        }
    }
}

async function * loop_animation_frames() {
    while (true) {
        yield { then: (fn_res, fn_rej) => requestAnimationFrame(() => fn_res()) }
    }
}

start_game()
