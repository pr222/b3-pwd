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
    min-height: calc(100vh - 90px);
    margin-bottom: auto;
}

#dock {
    margin-bottom: auto;
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

      // Bindings for reaching this shadow.
    }

    // TODO: Methods
  }
)
