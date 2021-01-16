/**
 * The a-chatty-app web component module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

const KEY = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'

let socket

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
  background-color: #EBEBEB;
  padding: 5px;
  min-width: 455px;
  min-height: 300px;  
}

/* Submit name styles */ 
h2 {
  font-size: 1.5rem;
  font-weight: lighter;
}

/* Chat area styles */
#chat {
  text-align: left;
}

/* Upper bar styles */
#upperBar {
  text-align: center;
  margin-bottom: 10px;
}

/* Container style for sent chat messages */
#sentMessages {
  border: 1px solid;
  padding: 5px;
  height: 300px;
  overflow: auto;
}

/* Styles for individual chat messages */
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

/* Styles for writing new messages */
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

/* Button styles */
#sendButton {
  padding: 15px;
  float: right;
}

#submitButton, #sendButton, button {
  background-color: #FFFFFF;
}

.hidden {
  display: none;
}
</style>

<form id="nameForm" class="hidden">
    <h2>Choose a username:</h2>
    <input type="text" id="name" autofocus autocomplete="off" required>
    <input type="submit" value="Submit" id="submitButton">
    <p>Allowed: Max. 10 characters, with numbers and english letters.</p>
</form>

<div id="chat" class="hidden">
  <div id="upperBar">
    <button type="button">Change username</button>
  </div>

  <div id="sentMessages"></div>

  <form id="messageForm">
    <label for="writtenMessage">Write something in the chat (max 500 chars):</label>
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
      this._onclick = this._onclick.bind(this)
      this._closingSocket = this._closingSocket.bind(this)
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      // Open up a new WebSocket for the chat.
      socket = new WebSocket('wss://cscloud6-127.lnu.se/socket/')

      // Check wether there are already a registered user.
      // If not, apllication starts with a name submit form.
      this._checkForUser()

      // Add event listeners.
      socket.addEventListener('open', this._opendedSocket)
      socket.addEventListener('message', this._message)
      socket.addEventListener('error', this._error)
      socket.addEventListener('close', this._closingSocket)
      this._nameForm.addEventListener('submit', this._submitName)
      this._messageForm.addEventListener('submit', this._sendMessage)
      this._chatArea.addEventListener('click', this._onclick)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      // Make sure to close WebSocket if not already closed.
      socket.close()

      // Remove event listeners.
      socket.removeEventListener('open', this._opendedSocket)
      socket.removeEventListener('message', this._message)
      socket.removeEventListener('error', this._error)
      socket.removeEventListener('close', this._closingSocket)
      this._nameForm.removeEventListener('submit', this._submitName)
      this._messageForm.removeEventListener('submit', this._sendMessage)
      this._chatArea.removeEventListener('click', this._onclick)
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
     * Handling incoming message event.
     *
     * @param {Event} event - a message sent.
     */
    async _message (event) {
      // Convert message from JSON to an object.
      const messageObject = await JSON.parse(event.data)

      // Render the new message into the chat.
      this._renderMessage(messageObject)
    }

    /**
     * Handling error event from socket.
     *
     * @param {Event} event - an error event.
     */
    _error (event) {
      console.error(event.message)
    }

    /**
     * The web socket is closing.
     *
     * @param {Event} event - closing the web socket.
     */
    _closingSocket (event) {
      console.log('The web socket is now closing...')

      // Create a message to display in the chat for the user.
      const message = {
        username: 'Chatty App',
        data: 'Somehow the connection was lost...'
      }

      this._renderMessage(message)
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

      let valid

      // Do not accept non-alphanumeric charachters in username.
      const invalidChars = /\W/g

      if (invalidChars.test(user)) {
        valid = false
        this._name.value = 'Use numbers and letters'
      } else if (user.length > 10) {
        valid = false
        this._name.value = 'Choose max 10 chars'
      } else {
        valid = true
      }

      if (valid) {
        // Save username to local storage.
        localStorage.setItem('chattyAppUser', `${user}`)

        // Render the app.
        this._renderApp('chatArea')

        // Empty the input field.
        this._name.value = ''
      } else {
        // When not valid, reselect box with the relevant input value-message to user.
        this._name.focus()
        this._name.select()
      }
    }

    /**
     * Handle new submitted message and send it so the socket.
     *
     * @param {Event} event - submit event.
     */
    _sendMessage (event) {
      // Prevent submitting the form.
      event.preventDefault()

      const message = this._writtenMessage.value

      if (message.length > 500) {
        console.log('Too long message')
      } else {
        // Prepare an message object to send.
        const newMessage = {
          type: 'message',
          data: `${message}`,
          username: `${localStorage.getItem('chattyAppUser')}`,
          channel: 'my, not so secret, channel',
          key: `${KEY}`
        }

        // Convert the message object to JSON
        const messageAsJson = JSON.stringify(newMessage)

        // Send the message to the socket connection.
        socket.send(messageAsJson)

        // Empty the textfield for next message and make it in focus.
        this._writtenMessage.value = ''
        this._writtenMessage.focus()
      }
    }

    /**
     * Handling click event.
     *
     * @param {Event} event - click event.
     */
    _onclick (event) {
      // Check if "Change username"-button was clicked.
      if (event.target === this._chatArea.querySelector('button')) {
        this._renderApp('submitName')
      }
    }

    /**
     * Check for existing user.
     */
    _checkForUser () {
      // Get the latest info from the local storage.
      const user = localStorage.getItem('chattyAppUser')

      // Is there already a registered user?
      if (user) {
        // Display chat area.
        this._renderApp('chatArea')
      } else {
        // Display name submission form.
        this._renderApp('submitName')
      }
    }

    /**
     * Render the app, with the new view
     * of either 'chatArea' or 'submitName'.
     *
     * @param {string} swapTo - What view to render in the app.
     */
    _renderApp (swapTo) {
      // Choose what view to display.
      if (swapTo === 'chatArea') {
        // Display chat area.
        this._chatArea.classList.remove('hidden')
        // Make sure to hide name form.
        this._nameForm.classList.add('hidden')
      } else if (swapTo === 'submitName') {
        // Display hide name form.
        this._nameForm.classList.remove('hidden')
        // Make sure to hide chat area.
        this._chatArea.classList.add('hidden')
      }
    }

    /**
     * Render a new message into the chat.
     *
     * @param {object} messageObject - The new message to display.
     */
    _renderMessage (messageObject) {
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

      // Make sure to scroll down automatically if overflow.
      this._messageBox.scrollTop = this._messageBox.scrollHeight
    }
  }
)
