export default new class MainView {
    #class_previous = undefined

    set_display_class(display_name) {
        el_app.classList.remove(this.#class_previous)
    
        let class_new
        if (display_name === 'speler-name') {
            class_new = '_display_speler-name'
        } else if (display_name === 'game-playing') {
            class_new = '_display_game-playing'
        } else if (display_name === 'game-over') {
            class_new = '_display_game-over'
        } else if (display_name === 'top-scores') {
            class_new = '_display_top-scores'
        }

        el_app.classList.add(class_new)
        this.#class_previous = class_new
    }
}