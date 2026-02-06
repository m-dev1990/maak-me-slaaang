import MainView from '../views/MainView.js'
import GameOverDisplay from './GameOverDisplay.js'
import TopScoresDisplay from './TopScoresDisplay.js'

let display_name

export function set_display(display_name_) {
    display_name = display_name_

    MainView.set_display(display_name)
}

export function close_current_display(next_view) {
    if (display_name === 'speler-name') {
        throw new Error('not implemented')
    } else if (display_name === 'game-playing') {
        throw new Error('not implemented')
    } else if (display_name === 'game-over') {
        GameOverDisplay.close(next_view)
    } else if (display_name === 'top-scores') {
        TopScoresDisplay.close(next_view)
    }
}