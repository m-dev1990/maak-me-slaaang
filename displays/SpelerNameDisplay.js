import * as Utils from '../utils.js'
import MainView from '../views/MainView.js'
import SlangenveldView from '../views/SlangenveldView.js'
import HelpTextView from '../views/HelpTextView.js'

/** @type {HTMLInputElement} el_speler_name_input */
let el_speler_name_input = globalThis.el_speler_name_input

export default new class SpelerNameDisplay {
    #context
    #speler_name = ''
    #fn_resolve

    activate() {
        this.#context = new Utils.ClearableContext()
        
        MainView.set_display_class('speler-name')
        HelpTextView.activate('Voer uw naam in en druk op Enter.')
        
        this.#context.addEventListener(el_speler_name_input, 'blur', this.#handle_blur)
        this.#context.addEventListener(el_speler_name_input, 'input', this.#handle_input)
        this.#context.addEventListener(el_speler_name_form, 'submit', this.#handle_submit)
        if (!Utils.has_keyboard) {
            this.#context.addEventListener(document, 'touchstart', this.#handle_touch_start)
        }

        el_speler_name_input.focus()

        return this
    }

    then(fn_resolve) {
        this.#fn_resolve = fn_resolve
    }

    /** @param {Event} ev */
    #handle_input = ev => {
        let speler_name_prev = this.#speler_name
        this.#speler_name = el_speler_name_input.value
        let boxes_to_update_count = Math.max(this.#speler_name.length, speler_name_prev.length)
        for (let i = 0; i < boxes_to_update_count; ++i) {
            let letter = this.#speler_name[i]
            if (letter !== undefined) {
                SlangenveldView.render_cell_content([11 + i, 11], letter)
            } else {
                SlangenveldView.render_cell_content([11 + i, 11], undefined)
            }
        }
    }

    /** @param {FocusEvent} ev */
    #handle_blur = ev => {
        return false
        el_speler_name_input.focus()

    }

    #handle_submit = ev => {
        ev.preventDefault()
        
        if (this.#speler_name.trim() !== '') {
            this.#close()
        }

        return false
    }
    
    #handle_touch_start = ev => {
        if (this.#speler_name.trim() === '') {
            el_speler_name_input.focus()
        } else {
            this.#close()
        }
    }

    #close() {
        this.#context.clear()
        HelpTextView.deactivate()

        for (let x = 0; x < this.#speler_name.length; ++x) {
            SlangenveldView.render_cell_content([11 + x, 11], undefined)
        }

        el_speler_name_form.classList.add('_inactive')

        this.#fn_resolve(this.#speler_name)
    }
}
