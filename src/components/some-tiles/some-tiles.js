/**
 * The some-tiles web component module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

const backImg = (new URL('img/lnu-symbol.png', import.meta.url)).href

/**
 * Define the template
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
  :host {
  display: inline-block;
  width: 85px;
  height: 100px;
  margin: 5px;
  border-radius: 3px;
  border: 3px solid #CCCCCC;
  }

  :host([hidden]) #tile {
    visibility: hidden;
  }

  :host([disabled]) {
    border: 2px dotted #CCCCCC;
    opacity: 0.5;
    pointer-events: none;
  }

  :host([faceup]) #back {
    display: none;
  }

  :host([faceup]) #front {
    display: flex;
  }

  #tile, slot {
    padding: 0px;
    width: 100%;
    height: 100%;
    border: none;
  }

  #tile:focus, #tile:hover {
    outline: 3px solid #000000;
    box-shadow: 0px 10px 30px;
  }

  #front, #back {
    width: 100%;
    height: 100%;
  }

  #front {
    display: none;
  }

  #back {
    background-image: url("${backImg}");
    background-repeat: no-repeat;
    background-color: #ffcc00;
    background-size: 50%;
    background-position: center;
  }

  ::slotted(img) {
    width: 100%;
  }

</style>

<button type="button" id="tile">
    <div part="frontSide" id="front">
      <slot></slot>
    </div>
    <div part="backSide" id="back" faceup></div>
</button>
`

/**
 * Define the custom element.
 */
customElements.define('some-tiles',
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

      this._tile = this.shadowRoot.querySelector('#tile')
    }

    /**
     * Looks for changes in the attributes.
     *
     * @readonly
     * @static
     * @returns {string} - The observed attributes.
     */
    static get observedAttributes () {
      return ['hidden', 'disabled', 'faceup']
    }

    /**
     * Called by the browser when an attribute is changed.
     *
     * @param {string} name - The name of the attribute.
     * @param {any} oldValue - The old attribute value.
     * @param {any} newValue - The new attribute.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'hidden') {
        this._tile.hidden = newValue
      } else if (name === 'disabled') {
        this._tile.disabled = newValue
        this.blur()
      } else if (name === 'faceup') {
        this._tile.faceup = newValue
      }
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      this.addEventListener('click', this._cardClicked)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this.removeEventListener('click', this._cardClicked)
    }

    /**
     * Click event, using mouse or the Enter key for focused element.
     *
     * @param {event} event - Mouse or key press event.
     */
    _cardClicked (event) {
      // If hidden, do nothing further and return.
      if (this.hasAttribute('hidden')) {
        return
      }

      // If card is not faceup, make it faceup.
      if (!this.hasAttribute('faceup')) {
        this.setAttribute('faceup', '')
      } else {
      // If faced up when flipping, remove faceup.
        this.removeAttribute('faceup')
      }

      // Release the custom flippingCard event.
      this.dispatchEvent(new CustomEvent('flippingCard', { bubbles: true }))
    }
  }
)
