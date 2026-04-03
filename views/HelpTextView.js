import * as Utils from '../utils.js'

export default new class HelpTextView {
    #fn_cancel
    #context = new Utils.ClearableContext()

    activate(text) {
        el_help_text.textContent = text
        this.#context.addEventListener(document, 'mousemove', this.#handle_mouse_move, {})
    }

    deactivate() {
        if (this.#fn_cancel !== undefined) {
            this.#fn_cancel()
            el_help_text_container.classList.remove('_show-help-text', '_show-help-text_fade-out_start', '_show-help-text_fade-out_end')
            this.#fn_cancel = undefined
        }
        this.#context.clear()
    }

    #handle_mouse_move = (ev) => {
        if (this.#fn_cancel !== undefined) {
            this.#fn_cancel()
            el_help_text_container.classList.remove('_show-help-text_fade-out_start', '_show-help-text_fade-out_end')
            this.#fn_cancel = undefined
        }
        
        el_help_text_container.classList.add('_show-help-text')

        this.#fn_cancel = Utils.Cancellable.setTimeout(() => {
            el_help_text_container.classList.add('_show-help-text_fade-out_start')
            this.#fn_cancel = Utils.Cancellable.requestAnimationFrame(() => {
                el_help_text_container.classList.add('_show-help-text_fade-out_end')
                this.#fn_cancel = Utils.Cancellable.addEventListener(el_help_text_container, 'transitionend', ev => {
                el_help_text_container.classList.remove('_show-help-text', '_show-help-text_fade-out_start', '_show-help-text_fade-out_end')
                    this.#fn_cancel = undefined
                }, { once: true })
            })
        }, 2000)
    }
}