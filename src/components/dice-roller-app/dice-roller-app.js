/**
 * The dice roller app web component module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

import { rollGroupOfDice } from './rollDice.js'

/**
 * Define the HTML template
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
:host {
    display: block;
    padding: 5px;
}

.chooseDice {
    padding: 5px;
}
</style>

<div id="diceAppWrapper">
    <div class="chooseDice">
        <label for="d4Options">D4</label>
        <select id="d4Options" name="d4Options">
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
    </div>

    <div class="chooseDice">
        <label for="d6Options">D6</label>
        <select id="d6Options" name="d6Options">
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
    </div>

    <button type="button" id="rollDiceButton">Roll Dice</button>
</div>
`
/**
 * Define the custom element.
 */
customElements.define('dice-roller-app',
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
      this._rollDiceButton = this.shadowRoot.querySelector('#rollDiceButton')
      this._d4Options = this.shadowRoot.querySelector('#d4Options')
      this._d6Options = this.shadowRoot.querySelector('#d6Options')

      // Bindings for reaching this shadow.
      this._initiateRolls = this._initiateRolls.bind(this)
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      this._rollDiceButton.addEventListener('click', this._initiateRolls)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._rollDiceButton.removeEventListener('click', this._initiateRolls)
    }

    /**
     * Roll the chosen dice.
     *
     * @param {Event} event - submits dice to roll.
     */
    _initiateRolls (event) {
      // Get current option-value from the d4 selection.
      const d4s = parseInt(this._d4Options.value)
      const d6s = parseInt(this._d6Options.value)

      if (d4s >= 1) {
        const groupD4 = rollGroupOfDice(4, d4s)
        console.log(groupD4)
      }

      if (d6s >= 1) {
        const groupD6 = rollGroupOfDice(6, d6s)
        console.log(groupD6)
      }
    }
  }
)
