/**
 * The a-chatty-app web component module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

const SOCKET = new WebSocket('wss://cscloud6-127.lnu.se/socket/')

/**
 * Define the HTML template
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
</style>

<p>A chatty app here!</p>
`
/**
 * Define the custom element.
 */
customElements.define('a-chatty-app',
  /**
   * Anonymous class of this element.
   */
  class extends HTMLElement {
    /**
     * Makes an instance of this type.
     */
    constructor () {
      super()

      // Attach shadow and append template.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // ADD STUFF HERE
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      SOCKET.addEventListener('open', this._opendedSocket)
      SOCKET.addEventListener('message', this._message)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      SOCKET.removeEventListener('open', this._opendedSocket)
      SOCKET.removeEventListener('message', this._message)
    }

    /**
     * The web socket has been opened.
     *
     * @param {Event} event - opening the web socket.
     */
    _opendedSocket (event) {
      console.log('The web socket is now open.')
    }

    /**
     * Handling message event.
     *
     * @param {Event} event - a message sent.
     */
    _message (event) {
      console.log(event)
      console.log(event.data)
      console.log('A message was sent...')
    }
  }
)
