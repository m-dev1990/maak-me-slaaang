export const $DOM$ = Symbol()

export class ClearableContext {
    #array_fn_clear = []

    /**
     * 
     * @param {HTMLElement} el 
     * @param {string} event_name 
     * @param {ev => void} fn_listener 
     */
    addEventListener(el, event_name, fn_listener, options) {
        let fn_clear = Cancellable.addEventListener(el, event_name, fn_listener, options)
        this.#array_fn_clear.push(fn_clear)
    }

    addAnimationFrameLoop(fn_iteration) {
        let fn_clear = Cancellable.requestAnimationFrame(handle_animation_frame)
        function handle_animation_frame () {
            fn_iteration()
            fn_clear = Cancellable.requestAnimationFrame(handle_animation_frame)
        }

        function clear() {
            fn_clear()
        }

        this.#array_fn_clear.push(() => clear())
    }

    add_clear_action(fn_clear) {
        this.#array_fn_clear.push(fn_clear)
    }

    clear() {
        for (let fn_clear of this.#array_fn_clear) {
            fn_clear()
        }
    }
}

export const Cancellable = {
    setTimeout: function (fn, delay) {
        let timeoutID = window.setTimeout(fn, delay)
        
        return function cancel() {
            window.clearTimeout(timeoutID)
        }
    },
    requestAnimationFrame: function (fn) {
        let requestID = window.requestAnimationFrame(fn)
        return function cancel() {
            window.cancelAnimationFrame(requestID)
        }
    },
    addEventListener: function (el, event_name, fn_listener, options) {
        el.addEventListener(event_name, fn_listener, options)
        return function cancel() {
            el.removeEventListener(event_name, fn_listener, options)
        }
    },
}



export const has_keyboard = (function has_keyboard () {
    let has_keyboard
    if (navigator.userAgentData?.mobile !== undefined) {
        has_keyboard = !navigator.userAgentData.mobile
    } else {
        has_keyboard = window.innerWidth > 800
    }
    return has_keyboard
})()