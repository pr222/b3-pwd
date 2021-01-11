/**
 * The a-memory-game web component module.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

// Create all the needed URLs for the game.
const BACKSIDE_URL = (new URL('img/memory-game-00.png', import.meta.url)).href

const IMG_URLS = []

const maxImages = 8

for (let i = 1; i <= maxImages; i++) {
  const IMG = (new URL(`img/memory-game-0${i}.png`, import.meta.url)).href
  IMG_URLS.push(IMG)
}

let timer

/**
 * Define the template
 */
const template = document.createElement('template')
template.innerHTML = `
  <style> 
  :host {
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    color: #222222;
    text-align: center;
  }

  #mainWrapper {
    background-color: #487576;
    padding: 10px;
    min-width: min-content;
  }

  #startMenu, #resultWrapper, #gridWrapper {
    display: block;
    padding: 15px;
    padding-bottom: 25px;
    text-align: center;
    background-color: cadetblue;
  /*  box-shadow: 0px 10px 30px; */
  }

  ul {
    margin: 0px;
    padding: 0px;
  }

  li {
    list-style: none;   
    display: inline-block;   
  }

  button {
    display: block;
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    margin: 5px;
    background-color: #fff39c;
    border-radius: 5px;  
    border: 3px solid #CCCCCC; 
    font-size: 1.3rem;
  }

  button:focus, button:hover {
    outline: none;
    box-shadow: 0px 10px 30px;
    border: 3px solid #222222; 
  }

  #resetButton {
    margin: 0 auto;
  }

  .cred {
    color: #4f4f4f;
    margin-top: 25px;
  }

  .result {
    font-weight: bold;
    font-size: 1.5rem;
    color: #6b1010;
  }

  #grid2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-items: center;
  }

  #grid4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    justify-items: center;
  }

  some-tiles::part(backSide) {
    background-image: url("${BACKSIDE_URL}");
    background-color: #fff39c;
  }

  some-tiles {
    width: 75px;
    height: 90px;
  }

  some-tiles[disabled] {
    border: 2px dotted #CCCCCC;
    opacity: 1;
  }

  #startMenu.hidden, #resultWrapper.hidden, #gridWrapper.hidden {
      display: none;
  }
  </style>

  <div id="mainWrapper">
    <!-- <h1>MEMORY GAME</h1> -->
    <div id="startMenu">
        <h1>Choose a game mode:</h1>
        <ul>
            <li><button type="button" id="buttonSmall">2x2</button></li>
            <li><button type="button" id="buttonMedium">4x2</button></li>
            <li><button type="button" id="buttonBig">4x4</button></li>
        </ul>
    </div>
    <div id="resultWrapper" class="hidden">
        <h1>You made it!</h1>
        <h2>It took you:</h2>
        <p class="result" id="attempts"></p>
        <p class="result" id="time"></p>
        <button type="button" id="resetButton">Reset</button>
        <p class="cred">Illustrations by: Moa Alfredsson</p>
    </div>
    <div id="gridWrapper" class="hidden"></div>
  </div>
`

/**
 * Define the custom element.
 */
customElements.define('a-memory-game',
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

      // Properties for the game to keep track of.
      this._cardsInPlay = 0
      this._imageUrls = []
      this._nrOfAttempts = 0
      this._time = 0

      // Select elements from the shadowroot.
      this._app = this.shadowRoot.querySelector('#mainWrapper')
      this._startMenu = this.shadowRoot.querySelector('#startMenu')
      this._grid = this.shadowRoot.querySelector('#gridWrapper')
      this._results = this.shadowRoot.querySelector('#resultWrapper')
      this._resetButton = this.shadowRoot.querySelector('#resetButton')

      // Bindings needed for reaching this shadow.
      this._chooseGame = this._chooseGame.bind(this)
      this._startGame = this._startGame.bind(this)
      this._startTimer = this._startTimer.bind(this)
      this._resetGame = this._resetGame.bind(this)
      this._renderGrid = this._renderGrid.bind(this)
      this._flipCheck = this._flipCheck.bind(this)
    }

    /**
     * Called when the element has been insterted into the DOM.
     */
    connectedCallback () {
      this._startMenu.addEventListener('click', this._chooseGame)
      this.addEventListener('startGame', this._startGame)
      this._results.addEventListener('click', this._resetGame)
      this._grid.addEventListener('flippingCard', this._flipCheck)
      this.addEventListener('matched', this._match)
      this.addEventListener('notMatched', this._match)
      this.addEventListener('gameover', this._gameover)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this._startMenu.removeEventListener('click', this._chooseGame)
      this.removeEventListener('startGame', this._startGame)
      this._results.removeEventListener('click', this._resetGame)
      this._grid.removeEventListener('flippingCard', this._flipCheck)
      this.removeEventListener('matched', this._match)
      this.removeEventListener('notMatched', this._match)
      this.removeEventListener('gameover', this._gameover)
    }

    /**
     * Takes care of click-event for starting the game.
     *
     * @param {Event} event - A 'click' event.
     */
    _chooseGame (event) {
      let gameMode = ''

      // When choosing which game to start.
      if (event.target.id === 'buttonSmall') {
        this._cardsInPlay = 4
        gameMode = 'small'
      } else if (event.target.id === 'buttonMedium') {
        this._cardsInPlay = 8
        gameMode = 'medium'
      } else if (event.target.id === 'buttonBig') {
        this._cardsInPlay = 16
        gameMode = 'big'
      } else {
        // Do nothing if accidentally clicking on something else than the buttons.
        return
      }

      this.dispatchEvent(new CustomEvent('startGame', { bubbles: true, composed: true, detail: { mode: gameMode } }))
    }

    /**
     * Taking care of the start of the game.
     *
     * @param {Event} event - Event starting the game.
     */
    _startGame (event) {
      // Prepare all image URLs for this game round.
      this._createImageUrls()

      // Render grid and add images to it.
      this._renderGrid(`${event.detail.mode}`)

      // Start timer
      this._startTimer()
    }

    /**
     * Reset the game and go back to the starting menu.
     *
     * @param {Event} event - reset the game round.
     */
    _resetGame (event) {
      // Make sure the reset button was what was clicked.
      if (event.target === this._resetButton) {
        // Remove all html within the grid wrapper.
        this._grid.innerHTML = ''

        // Resets for the next round.
        this._cardsInPlay = 0
        this._imageUrls = []
        this._nrOfAttempts = 0
        this._time = 0

        // Display the starting menu and hide the results.
        this._startMenu.classList.remove('hidden')
        this._results.classList.add('hidden')
      }
    }

    /**
     * Handles event when a card is flipped faceup.
     *
     * @param {Event} event - a `flippingCard` event.
     */
    _flipCheck (event) {
      // Get all faced up cards.
      const faceupTiles = this._grid.querySelectorAll('[faceup]')

      // Prevent user from flipping back a card during attempt.
      faceupTiles.forEach(tile => tile.setAttribute('disabled', ''))

      if (faceupTiles.length === 1) {
        // First card in attempt, add increase nr of attempts.
        this._nrOfAttempts += 1
      } else if (faceupTiles.length === 2) {
        let matchedResult
        // Compare the two faced up cards for a match.
        if (faceupTiles[0].isEqualNode(faceupTiles[1])) {
          matchedResult = 'matched'
        } else {
          matchedResult = 'notMatched'
        }
        this.dispatchEvent(new CustomEvent(matchedResult, { bubbles: true, detail: { tiles: faceupTiles } }))
      } else {
        // Flip back all cards if trying to flip more than 2 at one attempt.
        this._flipBackCard(faceupTiles)
      }
    }

    /**
     * When a pair is matching.
     *
     * @param {Event} event - matching cards event.
     */
    _match (event) {
      // Get the pair provided in event details.
      const tiles = event.detail.tiles

      let delay

      if (event.type === 'matched') {
        delay = 1500
      } else if (event.type === 'notMatched') {
        delay = 1000
      }

      window.setTimeout(() => {
        // Reset the pair.
        this._flipBackCard(tiles)

        // Hide the pair if it is a matching pair.
        if (event.type === 'matched') {
          tiles.forEach(tile => tile.setAttribute('hidden', ''))

          // Was this the last matched pair?
          // Get all hidden images and check if all cards in play are hidden.
          // If so, the game is now over.
          const hidden = this._grid.querySelectorAll('[hidden]')

          if (hidden.length === this._cardsInPlay) {
            this.dispatchEvent(new CustomEvent('gameover', { bubbles: true }))
          }
        }
      }, delay)
    }

    /**
     * Handle results when the game is over.
     *
     * @param {Event} event - when the game is over
     */
    _gameover (event) {
      // Stop timer
      clearInterval(timer)

      // Split the time result in minutes and seconds.
      let seconds, minutes

      if (this._time > 60) {
        minutes = Math.floor(this._time / 60)
        seconds = this._time - (minutes * 60)
      } else {
        minutes = 0
        seconds = this._time
      }

      // Hide the grid and display the results page.
      this._grid.classList.add('hidden')
      this._results.classList.remove('hidden')

      // Add the attempts to the page.
      const attempts = this._results.querySelector('#attempts')
      attempts.textContent = `${this._nrOfAttempts} attempts in`

      // Add the time to the page.
      const timeResult = this._results.querySelector('#time')
      timeResult.textContent = `${minutes} minutes and ${seconds} seconds`
    }

    /**
     * Flip back cards face down and make them usable again.
     *
     * @param {Array} tiles - An array of tiles to flip.
     */
    _flipBackCard (tiles) {
      tiles.forEach(tile => tile.removeAttribute('disabled', ''))
      tiles.forEach(tile => tile.removeAttribute('faceup', ''))
    }

    /**
     * Start timer for this game round.
     *
     */
    _startTimer () {
      timer = setInterval(() => {
        this._time++
        // console.log(this._time)
      }, 1000)
    }

    /**
     * Fill array with image URLs in random order.
     *
     * @returns {Array} - Array with image URLs for this game round.
     */
    _createImageUrls () {
      // Get the number of the first unique image URLs to use.
      const imagesToUse = this._cardsInPlay / 2

      // Then add them to the main images-array.
      for (let i = 0; i < imagesToUse; i++) {
        const image = IMG_URLS[i]
        this._imageUrls.push(image)
      }

      // Copy the images to the array to create the pair.
      const copy = this._imageUrls
      this._imageUrls.push(...copy)

      // Now mix them up in a random order using the fisher yates algorithm.
      let newPlacing, temporaryPlacing

      for (let i = this._imageUrls.length - 1; i > 0; i--) {
        newPlacing = Math.floor(Math.random() * (i + 1))
        temporaryPlacing = this._imageUrls[i]
        this._imageUrls[i] = this._imageUrls[newPlacing]
        this._imageUrls[newPlacing] = temporaryPlacing
      }

      return this._imageUrls
    }

    /**
     * Render out cards for current game.
     *
     * @param {string} gameMode - What size of grid should be displayed.
     */
    _renderGrid (gameMode) {
      // Hide the starting page and display grid wrapper.
      this._startMenu.classList.add('hidden')
      this._grid.classList.remove('hidden')

      // Create a div for the grid and add grid with size depending on gameMode.
      const grid = document.createElement('div')

      if (gameMode === 'small') {
        // grid Id styled with number of columns.
        grid.setAttribute('id', 'grid2')

        this._grid.appendChild(grid)
      } else {
        // Both the medium and big gameMode has the same nr of columns.
        grid.setAttribute('id', 'grid4')

        this._grid.appendChild(grid)
      }

      // Create some-tiles and img elements to fill the grid with.
      for (let i = 0; i < this._cardsInPlay; i++) {
        const tile = document.createElement('some-tiles')
        const image = document.createElement('img')

        // Use the links from the image-array to set the image's src.
        const srcLink = this._imageUrls[i]
        image.setAttribute('src', `${srcLink}`)

        tile.appendChild(image)
        grid.appendChild(tile)
      }
    }
  })
