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
:host {
  display: block;
}

.hidden {
  display: none;
}
</style>

<p>A chatty app here!</p>
<form id="nameForm" class="hidden">
    <h1>Choose a username:</h1>
    <input type="text" id="name" autofocus autocomplete="off">
    <input type="submit" value="Submit">
</form>

<div id="chat">
  <div id="sentMessages"></div>
  <form id="messageForm">
    <label for="writtenMessage">Write something in the chat:</label>

    <textarea id="writtenMessage" name="writtenMessage" rows="3" cols="30"></textarea>

    <input type="submit" value="Send">
  </form>
</div>
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

      // Username
      this._user = ''

      // Select elements from shadow.
      this._nameForm = this.shadowRoot.querySelector('#nameForm')
      this._messageForm = this.shadowRoot.querySelector('#messageForm')

      // Bindings for reaching this shadow.
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      // Check wether there are already a registered user.
      // If not, start application with a name submit form.
      this._checkForUser()
      // Adding event listeners
      SOCKET.addEventListener('open', this._opendedSocket)
      SOCKET.addEventListener('message', this._message)
      SOCKET.addEventListener('error', this._error)
      this._nameForm.addEventListener('submit', this._submitName)
      this._messageForm.addEventListener('submit', this._sendMessage)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      // Removing event listeners.
      SOCKET.removeEventListener('open', this._opendedSocket)
      SOCKET.removeEventListener('message', this._message)
      SOCKET.removeEventListener('error', this._error)
      this._nameForm.removeEventListener('submit', this._submitName)
      this._messageForm.addEventListener('submit', this._sendMessage)
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
    async _message (event) {
      const messageObject = await JSON.parse(event.data)

      console.log(messageObject)

    //   console.log(`User: ${messageObject.username}`)
    //   console.log(`Type: ${messageObject.type}`)
    //   console.log(`Message: ${messageObject.data}`)
    }

    /**
     * Handling error event.
     *
     * @param {Event} event - an error event.
     */
    _error (event) {
      console.log('An error occured...')
      console.log(event)
    }

    /**
     * Handling submitting of username.
     *
     * @param {Event} event - submit event.
     */
    _submitName (event) {
      // Prevent submitting the form.
      event.preventDefault()

      console.log(this.name.value)
      this._user = this.name.value

      document.cookie = `username=${this._user}`
    }

    /**
     * Handle new submitted message.
     *
     * @param {Event} event - submit event.
     */
    _sendMessage (event) {
      // Prevent submitting the form.
      event.preventDefault()
      console.log('message sent')
      console.log(this.writtenMessage.value)

      // Empty the textfield for next message.
      this.writtenMessage.value = ''
      this.writtenMessage.focus()
    }

    /**
     * Check for existing user.
     */
    _checkForUser () {
      if (document.cookie) {
        console.log(document.cookie)
      } else {
        console.log('No cookie...')
        // Display name submission form.
        this._nameForm.classList.remove('hidden')
      }
    }
  }
)
