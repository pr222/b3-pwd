/**
 * The dice roller app web component module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

import { rollGroupOfDice } from './rollDice.js'

/**
 * Define the main HTML template for the module.
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
:host {
    display: block;
    padding: 5px;
    background-color: #e48888;
    width: 600px;
    min-height: 300px;
}

#diceAppWrapper {
    display: grid;
    grid-template-columns: 1fr, auto;
    grid-template-areas: "chooseDice results";
}

#chooseDiceWrapper {
    grid-area: chooseDice;
    padding: 10px;
}

.chooseDice {
    padding: 5px;
}

#results {
    grid-area: results;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-between;
}
</style>

<div id="diceAppWrapper">
    <div id="chooseDiceWrapper">
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

    <div id="results"></div>
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
      this._results = this.shadowRoot.querySelector('#results')

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
      // Remove previous results if present.
      while (this._results.firstChild) {
        this._results.removeChild(this._results.firstChild)
      }

      // Get current option-values the selections.
      const d4s = parseInt(this._d4Options.value)
      const d6s = parseInt(this._d6Options.value)

      let totalResults = []

      if (d4s >= 1) {
        const groupD4 = rollGroupOfDice(4, d4s)
        console.log(groupD4)
        
        this._renderDice(d4s, groupD4, 'd4')
        totalResults.push(groupD4.totalResult)
      }

      if (d6s >= 1) {
        const groupD6 = rollGroupOfDice(6, d6s)
        console.log(groupD6)
        
        this._renderDice(d6s, groupD6, 'd6')
        totalResults.push(groupD6.totalResult)
      }

      totalResults = totalResults.reduce((a, b) => a + b, 0)
      console.log(totalResults)

      // Only display results if any dice where rolled.
      if (totalResults >= 1) {
        this._renderTotalResult(totalResults)
      } 
    }

    /**
     * Render canvases with visual results.
     *
     * @param {number} nrOfRolls - number of attempted rolls.
     * @param {object} dicePool - representing the rolled results.
     * @param {string} die - the type of die to be displayed.
     */
    _renderDice (nrOfRolls, dicePool, die) {
      for (let i = 0; i < nrOfRolls; i++) {
        const canvas = document.createElement('canvas')
        canvas.setAttribute('width', '150')
        canvas.setAttribute('height', '150')
        this._results.appendChild(canvas)

        const context = canvas.getContext('2d')
        context.font = '20px Arial'
        console.log(dicePool.allRolls[i])

        if (die === 'd4') {
            console.log('render a D4')
        } else if (die === 'd6') {
            console.log('Render a D6')
        }
        context.fillText(`${dicePool.allRolls[i]}`, 10, 30)
      }
    }

    /**
     * Render total result.
     *
     * @param {number} result - total result.
     */
    _renderTotalResult (result) {
        const canvas = document.createElement('canvas')
        canvas.setAttribute('width', '150')
        canvas.setAttribute('height', '150')
        this._results.appendChild(canvas)
        
        const context = canvas.getContext('2d')
        const width = 150
        const height = 150

        // Make a rectangle to present the results in.
        context.fillStyle = '#CCCCCC'
        context.fillRect(0, (height/4), width, (height/2))

        // Add text with the total results.
        context.fillStyle = '#000000'
        context.font = '20px Arial'
        context.textAlign = 'center'
        context.fillText('Total Results:', (width/2), (height/2))
        context.fillText(`${result}`, (width/2), 2*(height/3))
    }
  }
)
