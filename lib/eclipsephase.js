const { d10, d100 } = require('./dice')

const makeTest = (targetNumber) => {
  const roll = d100() - 1
  return {
    roll,
    tensDie: Math.floor(roll / 10),
    onesDie: roll % 10,
    isCritical: roll % 11 === 0,
    isSuccess: roll <= targetNumber,
  }

}

const rollDice = (count) => {
  const reducer = (accumulator, currentValue) => {
    return accumulator + currentValue
  }

  const rolls = d10(count)
  return {
    rolls,
    total: rolls.reduce(reducer, 0),
  }

}

module.exports = { makeTest, rollDice }
