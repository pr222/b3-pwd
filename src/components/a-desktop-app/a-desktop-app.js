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
    display: flex;
    flex-direction: column;

}

#desktopArea {
    flex: 1;
    min-height: calc(100vh - 140px);
    margin-bottom: auto;
}

#dock {
    margin-bottom: auto;
    display: flex;
    justify-content: center;
    background-color: #404040;
    padding: 10px;
}

#dock img {
    max-width: 100px;
    margin: 10px;
}

.dockIcon:hover, .dockIcon:active {
    outline: 3px solid #a6a6a6;
    cursor: pointer;
}
</style>

<div id="desktopWrapper">
    <div id="desktopArea">
        <slot></slot>
    </div>
    <div id="dock">
        <img class="dockIcon" src="${tempButton}" alt="Temp icon">
        <img class="dockIcon" src="${memoryButton}" alt="Memory App Icon">
        <img class="dockIcon" src="${chattyButton}" alt="Chat App Icon">
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

      // Bindings for reaching this shadow.
    }

    // TODO: Methods
  }
)
