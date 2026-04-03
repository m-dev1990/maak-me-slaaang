import * as Utils from '../utils.js'
import templates from '../structure.js'
import SlangenveldView from './SlangenveldView.js'
import GameEngine from '../engines/GameEngine.js'

let GamePlayingView = {
    start(game) {
        el_score.textContent = app.game.score
        el_app.classList.add('_view-playing')

        this.render_pomme(app.game.pomme)
        for (let i = 0; i < app.game.snake.segments.length; ++i) {
            let segment = app.game.snake.segments[i]

            let i_last = app.game.snake.segments.length - 1
            let is_head = i === i_last

            if (is_head) {
                this.render_tongue_segment(segment)
            } else {
                this.render_body_segment(segment)
            }
        }
    },
    update(update) {
        if (update.eat_pomme !== undefined) {
            SlangenveldView.render_cell_content(update.eat_pomme.position, undefined)
        }

        if (update.new_pomme !== undefined) {
            this.render_pomme(update.new_pomme)
        }

        if (update.snake_body_segment_old !== undefined) {
             SlangenveldView.render_cell_content(update.snake_body_segment_old.position, undefined)
        }

        if (update.snake_body_segment_new) {
            this.render_body_segment(update.snake_body_segment_new)
        }

        if (update.snake_head_new) {
            this.render_tongue_segment(update.snake_head_new)
        }

        if (update.score) {
            el_score.textContent = update.score
        }
    },
    render_pomme(pomme) {
        SlangenveldView.render_cell_content(pomme.position, 'O', {
            color: 'pink',
            is_bold: true,
            rotation_degrees: 0,
            is_plinking: true
        })
    },
    render_tongue_segment(segment) {
        let rotation_degrees
        if (app.game.snake.movement[0] === GameEngine.Directions.up[0] && app.game.snake.movement[1] === GameEngine.Directions.up[1]) {
            rotation_degrees = 0
        } else if (app.game.snake.movement[0] === GameEngine.Directions.right[0] && app.game.snake.movement[1] === GameEngine.Directions.right[1]) {
            rotation_degrees = 90
        } else if (app.game.snake.movement[0] === GameEngine.Directions.down[0] && app.game.snake.movement[1] === GameEngine.Directions.down[1]) {
            rotation_degrees = 180
        } else if (app.game.snake.movement[0] === GameEngine.Directions.left[0] && app.game.snake.movement[1] === GameEngine.Directions.left[1]) {
            rotation_degrees = 270
        }

        SlangenveldView.render_cell_content(segment.position, 'Y', {
            color: 'pink', 
            is_bold: segment.is_pomme,
            rotation_degrees: rotation_degrees,
        })
    },
    render_body_segment(segment) {
        SlangenveldView.render_cell_content(segment.position, 'O', { is_bold: segment.is_pomme })
    },
    clear() {
        let [x, y] = app.game.pomme.position
        SlangenveldView.grid[y][x][Utils.$DOM$].el_slangenveld_vak_content.textContent = ''

        for (let snake_segment of app.game.snake.segments) {
            let [x, y] = snake_segment.position
            SlangenveldView.grid[y][x][Utils.$DOM$].el_slangenveld_vak_content.textContent = ''
        }
    }
}

export default GamePlayingView