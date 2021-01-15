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
      this._desktopArea = this.shadowRoot.querySelector('#desktopArea')

      // Bindings for reaching this shadow.
      this._openApp = this._openApp.bind(this)
      this._startDrag = this._startDrag.bind(this)
      this._stopDrag = this._stopDrag.bind(this)
      this._dragWindow = this._dragWindow.bind(this)
      this._move = this._move.bind(this)
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      this._tempButton.addEventListener('click', this._openApp)
      this._memoryButton.addEventListener('click', this._openApp)
      this._chattyButton.addEventListener('click', this._openApp)

      this.addEventListener('closeWindow', this._closeApp)

      this._desktopArea.addEventListener('mousedown', this._startDrag)
      //   this._desktopArea.addEventListener('mousemove', this._dragWindow)
      this._desktopArea.addEventListener('mouseup', this._stopDrag)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._tempButton.removeEventListener('click', this._openApp)
      this._memoryButton.removeEventListener('click', this._openApp)
      this._chattyButton.removeEventListener('click', this._openApp)

      this.removeEventListener('closeWindow', this._closeApp)

      this._desktopArea.removeEventListener('startDrag', this._startDrag)
      //  this._desktopArea.removeEventListener('mousemove', this._dragWindow)
      this._desktopArea.removeEventListener('stopDrag', this._stopDrag)
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
      event.preventDefault()
      console.log(event.target)
      // console.log(event.composedPath())
      event.target.setAttribute('dragging', '')
      //   console.log(event.detail)
      //   console.log(event.detail.dragging)
      //   console.log(event.detail.startX)
      //   console.log(event.detail.startY)
      //   const alreadyDragging = Array.from(document.querySelectorAll('[dragging]'))
      //   console.log(alreadyDragging)
      // event.target.addEventListener('mousemove', this._dragWindow)
      // startingX = event.clientX - xOffset
      // startingY = event.clientY - yOffset
      // console.log(event.path)
      const currentPath = event.composedPath()
      console.log(currentPath)
      console.log(currentPath[0])
      console.log(currentPath[0].id)
      // console.log(event.path[0].id)
      // console.log(event.target.id)
      if (currentPath[0].id === 'topBar' || currentPath[0].id === 'appName') {
        if (event.target.id !== 'closeButton') {
          console.log('START DRAG ON DESKTOP')
          event.target.addEventListener('mousemove', this._dragWindow)
        // this._desktopArea.addEventListener('mousemove', this._dragWindow)
        // dragging = true
        }
      }
    }

    /**
     * Stop dragging.
     *
     * @param {Event} event - mouseup.
     */
    _stopDrag (event) {
    //   const alreadyDragging = Array.from(document.querySelectorAll('[dragging]'))
    //   // console.log(alreadyDragging)
      // console.log(event.target)
      //  event.target.removeEventListener('mousemove', this._dragWindow)
      // console.log('STOP DRAG ON DESKTOP')
      //   if (event.target.id === 'topBar') {
      //     console.log('Stop dragging...')
      //     dragging = false
      //   }
      const currentPath = event.composedPath()

      if (currentPath[0].id === 'topBar' || currentPath[0].id === 'appName') {
        // if (event.target.id !== 'closeButton') {
        console.log('STOP DRAG ON DESKTOP')
        event.target.setAttribute('draggable', '')
        event.target.removeEventListener('mousemove', this._dragWindow)
        // }
      }
      //   if (event.path[0].id === 'topBar' || event.target.id === 'title') {
      //     // if (event.target.id !== 'closeButton') {
      //     console.log('STOP DRAG ON DESKTOP')
      //     // dragging = true
      //     // }
      //   }
    }

    /**
     * The dragging of window.
     *
     * @param {Event} event - mousemove.
     */
    _dragWindow (event) {
      // event.preventDefault()
      // console.log(event.target)
      if (event.target.hasAttribute('dragging')) {
        console.log('DRAAAG')
      } else {
        console.log('not to drag')
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
    }

    /**
     * Move?
     *
     * @param {*} x -
     * @param {*} y -
     * @param {*} element -
     */
    _move (x, y, element) {
      // element.style.transform = `translate3d(${x}px, ${y}px, 0)`
      this.style.left = `${x}px`
      this.style.top = `${y}px`
    }
  }
)
