/**
 * A module for rolling dice.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Rolls a die.
 *
 * @exports
 * @param {number} maxVal - the max number on the die.
 * @returns {number} - The rolled result.
 */
export function rollDie (maxVal) {
  return Math.floor(Math.random() * (maxVal) + 1)
}

/**
 * Roll a group of dice.
 *
 * @exports
 * @param {number} maxVal - max value of one die.
 * @param {number} howMany - how many dice to roll.
 * @returns {object} - Representation of roll results.
 */
export function rollGroupOfDice (maxVal, howMany) {
  const rolls = []

  for (let i = 1; i <= howMany; i++) {
    const roll = rollDie(maxVal)
    rolls.push(roll)
  }

  const max = Math.max(...rolls)
  const min = Math.min(...rolls)
  const sum = rolls.reduce((a, b) => a + b, 0)

  const stats = {
    allRolls: rolls,
    maxResult: max,
    minResult: min,
    totalResult: sum
  }

  return stats
}
