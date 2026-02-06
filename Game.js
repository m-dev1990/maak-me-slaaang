function generate_game_state() {
    let snake = generate_snake_state()
    let pomme = generate_pomme_state(snake)

    let game = {
        is_initial: true,
        is_playing: true,
        is_game_over: false,
        snake: snake,
        time: undefined,
        score: 0,
        level: 1,
        pomme: pomme,
        steps: 0,
        move_interval: 250,
    }

    return game
}

function generate_snake_state() {
    let snake = {
        segments: [{
            is_pomme: false,
            // [x, y]
            position: [11, 11],
        }, {
            is_pomme: false,
            position: [12, 11],
        }, {
            is_pomme: false,
            position: [13, 11],
        }, {
            is_pomme: false,
            position: [14, 11],
        }, {
            is_pomme: false,
            position: [15, 11],
        }],
        movement: [1, 0],
    }

    return snake
}

/** @param {typeof app.game.snake} snake */
function generate_pomme_state(snake) {
    while (true) {
        let x = Math.floor(Math.random() * 24)
        let y = Math.floor(Math.random() * 24)
        let pomme_position = [x, y]

        let is_snake = snake.segments.some(segment => segment.position[0] === pomme_position[0] && segment.position[1] === pomme_position[1])
        if (!is_snake) return { position: pomme_position }
    }
}

function update_move() {
    let segment_head_previous = app.game.snake.segments[app.game.snake.segments.length - 1]

    // 1. get next head position
    let position_body_new = segment_head_previous.position
    let position_head_new = [undefined, undefined].map((_, i) => {
        let next_position = position_body_new[i] + app.game.snake.movement[i]
        next_position = ((position_body_new[i] + app.game.snake.movement[i] + 24) % 24)
        return next_position
    })

    let segments_rest_new = app.game.snake.segments.slice(1)
    let is_game_over = segments_rest_new.some(x => x.position[0] === position_head_new[0] && x.position[1] === position_head_new[1])

    if (is_game_over) {
        app.game.is_game_over = true
        return [false, {
            is_game_over: true,
        }]
    }

    // TODO build object later
    let segment_head_next = {
        position: position_head_new,
    }

    // 2. check if head on pomme.
    let pomme_previous = undefined
    let pomme_next = undefined
    let eats_pomme = segment_head_next.position[0] === app.game.pomme.position[0] && segment_head_next.position[1] === app.game.pomme.position[1]

    // 3. if yes, eat pomme
    if (eats_pomme) {
        pomme_previous = app.game.pomme
        pomme_next = generate_pomme_state(app.game.snake)
        segment_head_next.is_pomme = true
        app.game.pomme = pomme_next
    }

    // 4. if no, move tail (else grow)
    let segment_tail_previous = undefined
    if (!eats_pomme) {
        segment_tail_previous = app.game.snake.segments[0]
        app.game.snake.segments.shift()
    }

    app.game.snake.segments.push(segment_head_next)
    app.game.steps = app.game.steps + 1

    let level = undefined
    if (app.game.steps % 24 === 0) {
        app.game.level = app.game.level + 1
        app.game.move_interval = 250 * (Math.log(10) / Math.log(10 + app.game.level))
        level = app.game.level
    }

    let score = undefined
    // TODO update score
    // TODO update object for level
    if (eats_pomme) {
        app.game.score = app.game.score + 1
        score = app.game.score
    }

    let update = {
        eat_pomme: pomme_previous,
        snake_head_new: segment_head_next,
        snake_body_segment_new: segment_head_previous,
        snake_body_segment_old: segment_tail_previous,
        new_pomme: pomme_next,
        level: level,
        score: score,
    }

    return [true, update]
}

const Directions = Object.freeze({
    up:     Object.freeze([0, -1]),
    down:   Object.freeze([0, 1]),
    left:   Object.freeze([-1, 0]),
    right:  Object.freeze([1, 0]),
})

function update_direction(direction) {
    if (direction[0] === app.game.snake.movement[0] && direction[1] === app.game.snake.movement[1]) {
        return
    } else {
        app.game.snake.movement = direction
    }
}

const Game = {
    Directions: Directions,
    generate_game_state: generate_game_state,
    update_direction: update_direction,
    update_move: update_move,
}

export default Game