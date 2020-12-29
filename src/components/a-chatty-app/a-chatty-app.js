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
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
}

#chat {
  text-align: left;
}

h2 {
  font-size: 1.5rem;
  font-weight: lighter;
}

.messageContainer {
  border: 1px dotted;
  padding: 5px;
}

.messageContainer h1 {
  font-size: 1rem;
}

.messageContainer p, .messageContainer h1 {
  margin: 0px;
}

#sendButton {
  background-color: #FFFFFF;
  padding: 15px;
  float: right;
}

#sentMessages {
  border: 1px solid;
  padding: 5px;
  min-height: 200px;
}

#messageWrapper {
  display: flex;
}

#messageForm {
  margin-top: 10px;
}

textarea {
  width: 100%;
  margin-right: 2px;
}

#submitButton {
  background-color: #FFFFFF;
}

.hidden {
  display: none;
}
</style>

<h1>The Chatty App</h1>
<form id="nameForm" class="hidden">
    <h2>Choose a username:</h2>
    <input type="text" id="name" autofocus autocomplete="off">
    <input type="submit" value="Submit" id="submitButton">
</form>

<div id="chat" class="hidden">
  <div id="sentMessages"></div>

  <form id="messageForm">
    <label for="writtenMessage">Write something in the chat:</label>
    <div id="messageWrapper">
      <textarea id="writtenMessage" name="writtenMessage" rows="3" cols="30"></textarea>
      <input type="submit" value="Send" id="sendButton">
    </div>
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
      // this._user = ''

      // Select elements from shadow.
      this._nameForm = this.shadowRoot.querySelector('#nameForm')
      this._name = this.shadowRoot.querySelector('#name')
      this._chatArea = this.shadowRoot.querySelector('#chat')
      this._messageBox = this.shadowRoot.querySelector('#sentMessages')
      this._messageForm = this.shadowRoot.querySelector('#messageForm')
      this._writtenMessage = this.shadowRoot.querySelector('#writtenMessage')

      // Bindings for reaching this shadow.
      this._submitName = this._submitName.bind(this)
      this._message = this._message.bind(this)
      this._sendMessage = this._sendMessage.bind(this)
      this._checkForUser = this._checkForUser.bind(this)
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

      // Create a timestamp for the message.
      let time = new Date()
      time = time.toLocaleTimeString()

      // Create a container for the message.
      const messageContainer = document.createElement('div')
      messageContainer.classList.add('messageContainer')
      this._messageBox.appendChild(messageContainer)

      // Add header to the container with timestamp and username.
      const header = document.createElement('h1')
      header.textContent = `[${time}] ${messageObject.username} says:`
      messageContainer.appendChild(header)

      // Add the message to the container.
      const message = document.createElement('p')
      message.textContent = `${messageObject.data}`
      messageContainer.appendChild(message)
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

      // Get the value written into the form.
      const user = this._name.value

      // Save username to local storage.
      localStorage.setItem('chattyAppUser', `${user}`)

      // Now hide the form...
      this._nameForm.classList.add('hidden')
      // And display the chat.
      this._chatArea.classList.remove('hidden')
    }

    /**
     * Handle new submitted message.
     *
     * @param {Event} event - submit event.
     */
    async _sendMessage (event) {
      // Prevent submitting the form.
      event.preventDefault()

      const newMessage = {
        type: 'message',
        username: `${localStorage.getItem('chattyAppUser')}`,
        data: `${this._writtenMessage.value}`
      }

      console.log(newMessage)

      const messageAsJson = await JSON.stringify(newMessage)

      // Send the message to the socket connection.
      SOCKET.send(messageAsJson)

      // Empty the textfield for next message and make it in focus.
      this._writtenMessage.value = ''
      this._writtenMessage.focus()
    }

    /**
     * Check for existing user.
     */
    _checkForUser () {
      const user = localStorage.getItem('chattyAppUser')

      // Is there already a registered user?
      if (user) {
        // Display chat area.
        this._chatArea.classList.remove('hidden')
      } else {
        // Display name submission form to register new user.
        this._nameForm.classList.remove('hidden')
      }
    }
  }
)
