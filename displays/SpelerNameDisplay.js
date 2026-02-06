import * as Application from '../application.js'
import * as MainDisplay from './MainDisplay.js'
import SlangenveldView from '../views/SlangenveldView.js'
import HelpTextView from '../views/HelpTextView.js'

/** @type {HTMLInputElement} el_speler_name_input */
let el_speler_name_input = globalThis.el_speler_name_input

export default new class SpelerNameDisplay {
    #context = new Application.ClearableContext()
    #speler_name = ''
    #fn_cancel_help_text
    #fn_resolve
    
    activate() {
        MainDisplay.set_display('speler-name')
        HelpTextView.activate('Voer uw naam in en druk op Enter.')

        this.#context.addEventListener(el_speler_name_input, 'blur', this.#handle_blur)
        this.#context.addEventListener(el_speler_name_input, 'input', this.#handle_input)
        this.#context.addEventListener(el_speler_name_input, 'keydown', this.#handle_keydown)

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
        for (let x = 0; x < boxes_to_update_count; ++x) {
            let letter = this.#speler_name[x]
            if (letter !== undefined) {
                SlangenveldView.render_cell_content([11 + x, 11], letter)
            } else {
                SlangenveldView.render_cell_content([11 + x, 11], undefined)
            }
        }
    }

    /** @param {FocusEvent} ev */
    #handle_blur = ev => {
        el_speler_name_input.focus()
    }

    /** @param {KeyboardEvent} ev */
    #handle_keydown = ev => {
        if (ev.key === 'Enter') {
            if (this.#speler_name.trim() === '') return

            el_speler_name_input.removeEventListener('blur', this.#handle_blur)
            el_speler_name_input.removeEventListener('input', this.#handle_input)
            el_speler_name_input.removeEventListener('keydown', this.#handle_keydown)

            HelpTextView.deactivate()

            for (let x = 0; x < this.#speler_name.length; ++x) {
                SlangenveldView.render_cell_content([11 + 1, 11], undefined)
            }

            el_speler_name_input.classList.add('_inactive')

            this.#fn_resolve(this.#speler_name)
        }
    }
}
