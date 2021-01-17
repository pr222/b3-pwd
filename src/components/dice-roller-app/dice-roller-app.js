/**
 * The dice roller app web component module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Define the HTML template
 */
const template = document.createElement('template')
template.innerHTML = `
<style>

</style>

<form id="rollerForm">
    <label for="d4">D4</label>
    <select id="d4" name="d4">
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
    </select>
    <input type="submit" value="Roll Dice" id="rollDiceButton">
</form>
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
      this._rollerForm = this.shadowRoot.querySelector('#rollerForm')
      this._rollDiceButton = this.shadowRoot.querySelector('#rollDiceButton')
      this._d4 = this.shadowRoot.querySelector('#d4')

      // Bindings for reaching this shadow.
      this._initiateRolls = this._initiateRolls.bind(this)
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      this._rollerForm.addEventListener('submit', this._initiateRolls)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._rollerForm.removeEventListener('submit', this._initiateRolls)
    }

    /**
     * Roll the chosen dice.
     *
     * @param {Event} event - submits dice to roll.
     */
    _initiateRolls (event) {
      event.preventDefault()
      console.log('Try roll some dice!')

      // Get current option-value from the d4 selection.
      const d4s = parseInt(this._d4.value)

      if (d4s >= 1) {
        const total = []

        for (let i = 1; i <= d4s; i++) {
          console.log(`Rolled die nr ${i}`)
          const roll = this._rollDie(4)
          console.log(roll)
          total.push(roll)
        }
        console.log(total)
        console.log(Math.max(...total))
        console.log(Math.min(...total))
        const sum = total.reduce((a, b) => a + b, 0)
        console.log(sum)
      }
    }

    /**
     * Rolls a die.
     *
     * @param {number} maxVal - the max number on the die.
     * @returns {number} - The rolled result.
     */
    _rollDie (maxVal) {
      return Math.floor(Math.random() * (maxVal) + 1)
    }
  }
)
