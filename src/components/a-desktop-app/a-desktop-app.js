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
    min-height: calc(100vh - 90px);
    max-height: calc(100vh - 90px);
}

#dock {
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
        <button type="button" id="fullscreenButton">Fullscreen</button>
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
      this._fullscreenButton = this.shadowRoot.querySelector('#fullscreenButton')
      this._desktopWrapper = this.shadowRoot.querySelector('#desktopWrapper')
      this._tempButton = this.shadowRoot.querySelector('#tempButton')
      this._memoryButton = this.shadowRoot.querySelector('#memoryButton')
      this._chattyButton = this.shadowRoot.querySelector('#chattyButton')
      this._desktopArea = this.shadowRoot.querySelector('#desktopArea')

      // Bindings for reaching this shadow.
      this._toggleFullscreen = this._toggleFullscreen.bind(this)
      this._openApp = this._openApp.bind(this)
      this._startDrag = this._startDrag.bind(this)
      this._stopDrag = this._stopDrag.bind(this)
      this._dragWindow = this._dragWindow.bind(this)
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      this._fullscreenButton.addEventListener('click', this._toggleFullscreen)
      this._tempButton.addEventListener('click', this._openApp)
      this._memoryButton.addEventListener('click', this._openApp)
      this._chattyButton.addEventListener('click', this._openApp)

      this.addEventListener('closeWindow', this._closeApp)

      this._desktopArea.addEventListener('mousedown', this._startDrag)
      this._desktopArea.addEventListener('mousemove', this._dragWindow)
      this._desktopArea.addEventListener('mouseup', this._stopDrag)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._fullscreenButton.removeEventListener('click', this._toggleFullscreen)
      this._tempButton.removeEventListener('click', this._openApp)
      this._memoryButton.removeEventListener('click', this._openApp)
      this._chattyButton.removeEventListener('click', this._openApp)

      this.removeEventListener('closeWindow', this._closeApp)

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
        // Check if the request method is present on element.
        if (this._desktopWrapper.requestFullscreen) {
          // Act depenting on if fullscreen element is present.
          if (!document.fullscreenElement) {
            await this._desktopWrapper.requestFullscreen()
            console.log('Entered fullscreen with base function')
          } else {
            document.exitFullscreen()
          }
        // Support for Safari
        } else if (this._desktopWrapper.webkitRequestFullscreen) {
          if (!document.webkitFullscreenElement) {
            await this._desktopWrapper.webkitRequestFullscreen()
            console.log('Entered fullscreen supported for Safari')
          } else {
            document.webkitExitFullscreen()
          }
        }
      } catch (err) {
        console.error(err)
      }
    }

    /**
     * Open a application in a new window.
     *
     * @param {Event} event - open an application from the dock.
     */
    _openApp (event) {
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
    }

    /**
     * Close a window.
     *
     * @param {Event} event - a custom closeWindow event.
     */
    _closeApp (event) {
      this.removeChild(event.target)
    }

    /**
     * Start of drag.
     *
     * @param {Event} event - mousedown.
     */
    _startDrag (event) {
      // startingX = event.clientX - xOffset
      // startingY = event.clientY - yOffset

      // Get the current path to find the origin of activated element.
      const currentPath = event.composedPath()

      if (currentPath[0].id === 'topBar' || currentPath[0].id === 'appName') {
        // Set dragging attribute on the custom window-element.
        event.target.setAttribute('dragging', '')
        console.log('START DRAG ON DESKTOP')
      }
    }

    /**
     * Stop dragging.
     *
     * @param {Event} event - mouseup.
     */
    _stopDrag (event) {
      // Get current path for finding the current originated element.
      const currentPath = event.composedPath()

      if (currentPath[0].id === 'topBar' || currentPath[0].id === 'appName') {
        console.log('STOP DRAG ON DESKTOP')
        // Reset dragging status by setting it to draggable.
        event.target.setAttribute('draggable', '')
      }
    }

    /**
     * The dragging of window.
     *
     * @param {Event} event - mousemove.
     */
    _dragWindow (event) {
      // console.log(event.target)
      if (event.target.hasAttribute('dragging')) {
        event.preventDefault()
        console.log('DRAAAG')
      }

      //   console.log(event.target)

      //   if (dragging) {
      //     console.log('Dragging window...')
      //     newX = event.clientX - startingX
      //     newY = event.clientY - startingY

      //     xOffset = newX
      //     yOffset = newY

      //     this._move(newX, newY, event.target)
      //   }

      //   // const newPosX = xLeft - event.clientX
      //   // console.log(newPosX)
      //   // xLeft = newPosX
      //   // const newPosY = yTop - event.clientY
      //   // console.log(newPosY)
      //   // yTop = newPosY
      // }
    }
  }
)
