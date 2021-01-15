/**
 * The a-desktop-window web component module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

const resizeImg = (new URL('img/resize-lines.png', import.meta.url)).href
const closeButton = (new URL('img/close-window-button.png', import.meta.url)).href
const xLeft = 30
const yTop = 10
const WIDTH = 'max-content'
const HEIGHT = 'max-content'

let startingX, startingY, newX, newY

let xOffset = 0
let yOffset = 0
// let dragging = false

/**
 * Define the HTML template
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
:host {
    font-family: Arial, Helvetica, sans-serif;
    display: block;
    margin: 10px;
    padding: 0px;
    border: 2px solid #404040;
    border-radius: 3px;
    background-color: #808080;
    width: ${WIDTH};
    height: ${HEIGHT};
    position: absolute;
    left: ${xLeft}px;
    top: ${yTop}px;
}

#topBar {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #404040;
    cursor: move;
    height: 30px;
}

#topBar h1 {
    color: #a6a6a6;
    font-size: 1.25rem;
    font-weight: normal;
    margin: 0px;
    margin-right: auto;
    margin-left: 10px;
}

#app {
/*    height: 100%; */
    overflow: auto;
    max-height: calc(100vh - 200px);   
}

#closeButton {
    border: none;
    outline: none;
    line-height: 0;
    padding: 0px;
    background-size: 30px;
    width: 30px;
    height: 30px;
    margin: 3px;
    cursor: pointer;
}

#closeImg:hover, #closeImg:active, #closeButton:focus {
   outline: 3px solid #a6a6a6;
}

#closeButton {
    background-image: url('${closeButton}');
}

#resize {
    max-width: 15px;
    max-height: 15px;
    padding: 3px;
    border: 3px solid #404040;
    cursor: nwse-resize;
    background-color: #737373;
}

#bottom {
    display: flex;
    justify-content: flex-end;
    align-content: stretch;
}

img {
    width: 100%;
}
</style>

<div id="windowWrapper">
    <!--
    <div id="topBar">
       <h1>
            <slot>Application</slot>
        </h1> 

        <h1 id="appName"></h1>

        <div id="close">
            <button type="button" id="closeButton"></button>
        </div>  
    -->

    <slot name="topBar" id="topBar">
        <h1 id="appName"></h1>
        <div id="close">
            <button type="button" id="closeButton"></button>
        </div>
    </slot>


    </div>
    <div id="app">
        <slot name="an-application">Place an application here...</slot>
    </div>
    <div id="bottom">
        <div id="resize">
            <img src="${resizeImg}" alt="A resize app window button">
        </div>
    </div>
</div>
`
/**
 * Define the custom element.
 */
customElements.define('a-desktop-window',
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
      this._resize = this.shadowRoot.querySelector('#resize')
      this._close = this.shadowRoot.querySelector('#closeButton')
      this._topBar = this.shadowRoot.querySelector('#topBar')
      this._appName = this.shadowRoot.querySelector('#appName')

      // Bindings for reaching this shadow.
      this._startDrag = this._startDrag.bind(this)
      this._stopDrag = this._stopDrag.bind(this)
      //   this._dragWindow = this._dragWindow.bind(this)
      this._closeWindow = this._closeWindow.bind(this)
      //   this._move = this._move.bind(this)
      this.attributeChangedCallback = this.attributeChangedCallback.bind(this)
    }

    /**
     * Looks for changes in the attributes.
     *
     * @readonly
     * @static
     * @returns {string} - The observed attributes.
     */
    static get observedAttributes () {
      return ['draggable', 'dragging', 'app-name']
    }

    /**
     * Called by the browser when an attribute is changed.
     *
     * @param {string} name - The name of the attribute.
     * @param {any} oldValue - The old attribute value.
     * @param {any} newValue - The new attribute.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'draggable') {
        this.removeAttribute('dragging')
        // this._topBar.removeEventListener('mousemove', this._move)
      } else if (name === 'dragging') {
        // this._topBar.addEventListener('mousemove', this._move)
      } else if (name === 'app-name') {
        // Display the provided name in the topBar.
        this._appName.textContent = newValue
      }
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      this._close.addEventListener('click', this._closeWindow)
      // this._topBar.addEventListener('mousedown', this._startDrag)
      //   this._topBar.addEventListener('mousemove', this._dragWindow)
      // this._topBar.addEventListener('mouseup', this._stopDrag)
    // this._resize.addEventListener('mousedown', this._startResize)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._close.removeEventListener('click', this._closeWindow)
      // this._topBar.removeEventListener('mousedown', this._startDrag)
      //   this._topBar.removeEventListener('mousemove', this._dragWindow)
      // this._topBar.removeEventListener('mouseup', this._stopDrag)
      // this._resize.removeEventListener('mousedown', this._startResize)
    }

    /**
     * Send out a close window event.
     *
     * @param {Event} event - 'click' on the close-button.
     */
    _closeWindow (event) {
      this.dispatchEvent(new CustomEvent('closeWindow', { bubbles: true }))
    }

    /**
     * Start of drag.
     *
     * @param {Event} event - mousedown.
     */
    _startDrag (event) {
    //   event.preventDefault()
    //   startingX = event.clientX - xOffset
    //   startingY = event.clientY - yOffset

    //   console.log(event.target.id)
    //   if (event.target.id === 'topBar' || event.currentTarget.id === 'topBar') {
    //     if (event.target.id !== 'closeButton') {
    //       console.log('Start-event initiated...')
    //       // dragging = true
    //       this.dispatchEvent(new CustomEvent('startDrag', { bubbles: true }, { detail: { dragging: true, startingX: startingX, startingY } }))
    //     }
    //   }
    }

    /**
     * Stop dragging.
     *
     * @param {Event} event - mouseup.
     */
    _stopDrag (event) {
      //  console.log(event.target)
      if (event.target.id !== 'closeButton') {
        console.log('Stop-drag initiated...')
        // dragging = false
        this.dispatchEvent(new CustomEvent('stopDrag', { bubbles: true }, { detail: { dragging: false } }))
      }
    }

    /**
     * The dragging of window.
     *
     * @param {Event} event - mousemove.
     */
    // _dragWindow (event) {
    //   event.preventDefault()

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
    //   // = `${}px`
    //   //  = `${}px`
    // }

    // _move(x, y, element) {
    //   // this.style.transform = `translate3d(${x}px, ${y}px, 0)`
    //   this.style.left = `${x}px`
    //   this.style.top = `${y}px`
    // }

    _move (event) {
      console.log('moving window...')
    }

    /**
     * Start of rezise.
     *
     * @param {Event} event - start resizing.
     */
    _startResize (event) {
      console.log('You began resizing by mousedown')
    }
  }
)
