/**
 * The a-desktop-app web component module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

const memoryButton = (new URL('img/memory-app-button.png', import.meta.url)).href
const chattyButton = (new URL('img/chatty-app-button.png', import.meta.url)).href
const tempButton = (new URL('img/template-app-button.png', import.meta.url)).href

/**
 * Define the HTML template
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
:host {
    padding: 0px;
    background-color: #EBEBEB;
    width: 100%;
    display: block;
    flex-direction: column;

}

#desktopArea {
   /* flex: 1; */
    min-height: calc(100vh - 90px);
    max-height: calc(100vh - 90px);
  /*  margin-bottom: auto; */
  
}

#dock {
  /*  margin-bottom: auto; */
    display: flex;
    justify-content: center;
    background-color: #404040;
    padding: 5px;
}

#tempButton {
    background-image: url('${tempButton}');
}

#memoryButton {
    background-image: url('${memoryButton}');
}

#chattyButton {
    background-image: url('${chattyButton}');
}

.dockIcon {
    border: none;
    outline: none;
    line-height: 0;
    padding: 0px;
    margin: 5px;
    background-size: 70px;
    height: 70px;
    width: 70px;
    opacity: 0.75;      
}

.dockIcon:active, .dockIcon:hover, .dockIcon:focus {
    outline: 3px solid #a6a6a6;
}

.dockIcon:focus {
    opacity: 1.0;

}
</style>

<div id="desktopWrapper">
    <div id="desktopArea">
        <slot></slot>
    </div>
    <div id="dock">
        <button type="button" id="tempButton" class="dockIcon"></button>
        <button type="button" id="memoryButton" class="dockIcon"></button>
        <button type="button" id="chattyButton" class="dockIcon"></button>
    </div>
</div>
`
/**
 * Define the custom element.
 */
customElements.define('a-desktop-app',
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
      this._tempButton = this.shadowRoot.querySelector('#tempButton')
      this._memoryButton = this.shadowRoot.querySelector('#memoryButton')
      this._chattyButton = this.shadowRoot.querySelector('#chattyButton')

      // Bindings for reaching this shadow.
      this._openApp = this._openApp.bind(this)
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      this._tempButton.addEventListener('click', this._openApp)
      this._memoryButton.addEventListener('click', this._openApp)
      this._chattyButton.addEventListener('click', this._openApp)

      this.addEventListener('closeWindow', this._closeApp)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._tempButton.removeEventListener('click', this._openApp)
      this._memoryButton.removeEventListener('click', this._openApp)
      this._chattyButton.removeEventListener('click', this._openApp)

      this.removeEventListener('closeWindow', this._closeApp)
    }

    /**
     * Open a application in a new window.
     *
     * @param {Event} event - open an application from the dock.
     */
    _openApp (event) {
      // Create a window and add to page.
      const window = this.appendChild(document.createElement('a-desktop-window'))

      console.log(event.target)
      console.log(event.target.id)

      let appName, appElement

      if (event.target.id === 'tempButton') {
        appName = 'A Random App'
        appElement = 'div'
      } else if (event.target.id === 'memoryButton') {
        appName = 'Memory Game'
        appElement = 'a-memory-game'
      } else if (event.target.id === 'chattyButton') {
        appName = 'Chatty App'
        appElement = 'a-chatty-app'
      }

      // Create a slot to display title of the app's name.
      const title = document.createElement('slot')
      title.textContent = `${appName}`
      window.appendChild(title)

      // Create the app element and add into window.
      const app = document.createElement(`${appElement}`)
      app.setAttribute('slot', 'an-application')
      window.appendChild(app)
    }

    /**
     * Close a window.
     *
     * @param {Event} event - a custom closeWindow event.
     */
    _closeApp (event) {
      this.removeChild(event.target)
    }
  }
)
