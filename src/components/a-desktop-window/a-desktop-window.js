/**
 * The a-desktop-window web component module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

const resizeImg = (new URL('img/resize-lines.png', import.meta.url)).href
const closeButton = (new URL('img/close-window-button.png', import.meta.url)).href
const X = '300px'
const Y = '10px'
const WIDTH = 'max-content'
const HEIGHT = 'max-content'

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
    left: ${X};
    top: ${Y};     
}

#topBar {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #404040;
    cursor: move;  
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
    height: 100%;
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
    <div id="topBar">
        <h1>
            <slot>Application</slot>
        </h1>
        <div id="close">
            <button type="button" id="closeButton"></button>
        </div>
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

      // Bindings for reaching this shadow.
    }

    // TODO: Methods
  }
)
