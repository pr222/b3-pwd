/**
 * The a-desktop-app web component module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

const memoryButton = (new URL('img/memory-app-button.png', import.meta.url)).href
const chattyButton = (new URL('img/chatty-app-button.png', import.meta.url)).href
const diceButton = (new URL('img/dice-app-button.png', import.meta.url)).href

let xPos, yPos

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
    min-height: calc(100vh - 90px);
    max-height: calc(100vh - 90px);
}

#fullscreenButton {
  border: none;
  outline: none;
  color: #546f54;
  background-color: #8fbc8f;
  padding: 15px;
  margin: 15px;
  position: absolute;
  bottom: 8px;
}

#fullscreenButton:active, #fullscreenButton:hover, #fullscreenButton:focus {
    outline: 5px solid #d7d7d7;  
}

#dock {
    display: flex;
    justify-content: center;
    background-color: #404040;
    padding: 5px;
}

#diceButton {
    background-image: url('${diceButton}');
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
        <button type="button" id="fullscreenButton">Toggle fullscreen</button>
        <slot></slot>
    </div>
    <div id="dock">
        <button type="button" id="diceButton" class="dockIcon"></button>
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
      this._zIndexes = []

      // Attach shadow and append template.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Select elements from shadow.
      this._fullscreenButton = this.shadowRoot.querySelector('#fullscreenButton')
      this._desktopWrapper = this.shadowRoot.querySelector('#desktopWrapper')
      this._diceButton = this.shadowRoot.querySelector('#diceButton')
      this._memoryButton = this.shadowRoot.querySelector('#memoryButton')
      this._chattyButton = this.shadowRoot.querySelector('#chattyButton')
      this._desktopArea = this.shadowRoot.querySelector('#desktopArea')

      // Bindings for reaching this shadow.
      this._toggleFullscreen = this._toggleFullscreen.bind(this)
      this._fullscreenChanged = this._fullscreenChanged.bind(this)
      this._openApp = this._openApp.bind(this)
      this._checkForWindow = this._checkForWindow.bind(this)
      this._startDrag = this._startDrag.bind(this)
      this._stopDrag = this._stopDrag.bind(this)
      this._dragWindow = this._dragWindow.bind(this)
      this._bringForward = this._bringForward.bind(this)
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      this._fullscreenButton.addEventListener('click', this._toggleFullscreen)
      document.addEventListener('fullscreenchange', this._fullscreenChanged)

      this._diceButton.addEventListener('click', this._openApp)
      this._memoryButton.addEventListener('click', this._openApp)
      this._chattyButton.addEventListener('click', this._openApp)

      this.addEventListener('closeWindow', this._closeApp)

      this._desktopArea.addEventListener('click', this._checkForWindow)
      this._desktopArea.addEventListener('mousedown', this._startDrag)
      this._desktopArea.addEventListener('mousemove', this._dragWindow)
      this._desktopArea.addEventListener('mouseup', this._stopDrag)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._fullscreenButton.removeEventListener('click', this._toggleFullscreen)
      document.removeEventListener('fullscreenchange', this._fullscreenChanged)

      this._diceButton.removeEventListener('click', this._openApp)
      this._memoryButton.removeEventListener('click', this._openApp)
      this._chattyButton.removeEventListener('click', this._openApp)

      this.removeEventListener('closeWindow', this._closeApp)

      this._desktopArea.removeEventListener('click', this._checkForWindow)
      this._desktopArea.removeEventListener('startDrag', this._startDrag)
      this._desktopArea.removeEventListener('mousemove', this._dragWindow)
      this._desktopArea.removeEventListener('stopDrag', this._stopDrag)
    }

    /**
     * Try going fullscreen.
     *
     * @param {Event} event - click on fullscreen button.
     */
    async _toggleFullscreen (event) {
      try {
        // Default is supported in current Chrome and Firefox.
        if (this._desktopWrapper.requestFullscreen) {
          if (!document.fullscreenElement) {
            await this._desktopWrapper.requestFullscreen()
          } else {
            document.exitFullscreen()
            this._resetWindows()
          }
        // Support for Safari
        } else if (this._desktopWrapper.webkitRequestFullscreen) {
          if (!document.webkitFullscreenElement) {
            await this._desktopWrapper.webkitRequestFullscreen()
          } else {
            document.webkitExitFullscreen()
            this._resetWindows()
          }
        }
      } catch (err) {
        console.error(err)
      }
    }

    /**
     * Check if event changed from fullscreen,
     * reset positions of the app windows in that case.
     *
     * @param {Event} event - on fullscreenchange
     */
    _fullscreenChanged (event) {
      if (!document.fullscreenElement) {
        this._resetWindows()
      }
    }

    /**
     * Open a application in a new window.
     *
     * @param {Event} event - open an application from the dock.
     */
    _openApp (event) {
      let appName, appElement

      if (event.target.id === 'diceButton') {
        appName = 'Dice Roller'
        appElement = 'dice-roller-app'
      } else if (event.target.id === 'memoryButton') {
        appName = 'Memory Game'
        appElement = 'a-memory-game'
      } else if (event.target.id === 'chattyButton') {
        appName = 'Chatty App'
        appElement = 'a-chatty-app'
      }

      // Create a window and add to page.
      const window = this.appendChild(document.createElement('a-desktop-window'))

      // Add app name to top bar.
      window.setAttribute('app-name', `${appName}`)

      // Make it draggable.
      window.setAttribute('draggable', '')

      // Create the app element and add into named slot in the window.
      const app = document.createElement(`${appElement}`)
      app.setAttribute('slot', 'an-application')
      window.appendChild(app)

      this._bringForward(window)
    }

    /**
     * Close a window removing it from the DOM.
     *
     * @param {Event} event - a custom closeWindow event.
     */
    _closeApp (event) {
      this.removeChild(event.target)
    }

    /**
     * Check if a desktop window was clicked and bring it forward.
     *
     * @param {Event} event - click
     */
    _checkForWindow (event) {
      const desktopWindow = customElements.get('a-desktop-window')

      if (event.target instanceof desktopWindow) {
        this._bringForward(event.target)
      } else if (event.target.parentElement instanceof desktopWindow) {
        this._bringForward(event.target.parentElement)
      }
    }

    /**
     * Start of drag.
     *
     * @param {Event} event - mousedown.
     */
    _startDrag (event) {
      // Get the current path to find the origin of activated element.
      const currentPath = event.composedPath()

      if (currentPath[0].id === 'topBar' || currentPath[0].id === 'appName') {
        // Set dragging attribute on the custom window-element.
        event.target.setAttribute('dragging', '')

        // Make sure it is brougth in front of other windows.
        this._bringForward(event.target)

        // Get the starting positions.
        xPos = event.clientX - event.target.style.left.slice(0, -2)
        yPos = event.clientY - event.target.style.top.slice(0, -2)
      }
    }

    /**
     * Stop dragging.
     *
     * @param {Event} event - mouseup.
     */
    _stopDrag (event) {
      const isDragging = document.querySelector('[dragging]')

      if (isDragging) {
        // Reset dragging status by setting it to draggable.
        isDragging.setAttribute('draggable', '')
      }
    }

    /**
     * The dragging of window.
     *
     * @param {Event} event - mousemove.
     */
    _dragWindow (event) {
      const draggedWindow = document.querySelector('[dragging]')

      if (draggedWindow) {
        event.preventDefault()

        // Find current mouse position in relation to the starting position.
        const currentX = event.clientX - xPos
        const currentY = event.clientY - yPos

        // Change style for the new current position.
        draggedWindow.style.left = `${currentX}px`
        draggedWindow.style.top = `${currentY}px`
      }
    }

    /**
     * Resets the position of all app windows to the same position.
     */
    _resetWindows () {
      const windowApps = document.querySelectorAll('[draggable]')

      for (const windowApp of windowApps) {
        windowApp.style.left = '40px'
        windowApp.style.top = '10px'
      }
    }

    /**
     * Bring an element forward.
     *
     * @param {HTMLElement} element - an element to bring forward.
     */
    _bringForward (element) {
      // Increase the highest z-index assigned yet.
      const z = this._zIndexes.length + 1

      // Update length of already assigned z-indexes.
      this._zIndexes.push(z)

      // Add the new index to the element's style.
      element.style.zIndex = z
    }
  }
)
