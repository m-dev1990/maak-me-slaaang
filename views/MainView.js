import * as Application from '../application.js'
import * as MainDisplay from '../displays/MainDisplay.js'
import GameOverDisplay from "../displays/GameOverDisplay.js"
import TopScoresDisplay from "../displays/TopScoresDisplay.js"

export default new class MainView {
    set_speler_name(full_name) {
        el_speler_name.textContent = full_name
    }

    set_score(score) {
        el_score.textContent = score
    }

    set_display(display_name) {
        el_app.classList.remove('_display_speler-name', '_display_game-playing', '_display_game-over', '_display_top-scores')
    
        if (display_name === 'speler-name') {
            el_app.classList.add('_display_speler-name')
        } else if (display_name === 'game-playing') {
            el_app.classList.add('_display_game-playing')
        } else if (display_name === 'game-over') {
            el_app.classList.add('_display_game-over')
        } else if (display_name === 'top-scores') {
            el_app.classList.add('_display_top-scores')
        }
    }

    activate_top_scores_link() {
        el_top_scores_link.addEventListener('click', this.#handle_click_top_scores_link)
    }

    deactivate_top_scores_link() {
        el_top_scores_link.removeEventListener('click', this.#handle_click_top_scores_link)
    }

    #handle_click_top_scores_link = (ev) => {
        MainDisplay.close_current_display({ next_view: 'top-scores' })
    }
}