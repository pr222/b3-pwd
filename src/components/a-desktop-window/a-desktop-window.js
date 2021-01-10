/**
 * The a-desktop-window web component module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

const resize = (new URL('img/resize-button.png', import.meta.url)).href

/**
 * Define the HTML template
 */
const template = document.createElement('template')
template.innerHTML = `
<style>

#resizeWrapper {
    max-width: 30px;
}

img {
    width: 100%;
}
</style>

<div id="resizeWrapper">
<img src="${resize}" alt="A resize app window button">
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
