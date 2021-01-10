/**
 * The a-desktop-window web component module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

const resizeImg = (new URL('img/resize-lines.png', import.meta.url)).href
const closeButton = (new URL('img/close-window-button.png', import.meta.url)).href

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
  width: max-content;  /************ TEMP **********/
}

#windowWrapper {
    display: block;
    min-width: min-content;
    min-height: min-content;
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
    font-size: 2rem;
    font-weight: normal;
    margin: 0px;
    margin-right: auto;
    margin-left: 10px;
}

#app {
    height: 100%;
}

#close img {
    max-width: 50px;
    margin: 3px;
    cursor: pointer;
}

#closeImg:hover, #closeImg:active {
   outline: 3px solid #a6a6a6;
}

#resize {
    max-width: 25px;
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
    display: block;
    width: 100%;
}
</style>

<div id="windowWrapper">
    <div id="topBar">
        <h1><slot>Application</slot></h1>
        <div id="close"><img id="closeImg" src="${closeButton}" alt="A close app window button"></div>
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
