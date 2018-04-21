const MersenneTwister = require('mersenne-twister')

function* random(min, max) {
  const mersenneGenerator = new MersenneTwister();
  while(true) {
    yield Math.floor(mersenneGenerator.random() * (max - min + 1)) + min;
  }
}

const die = (sides) => {
  const randomGenerator = random(1, sides)
  return (number) => {
    return number && Number.isInteger(number) && number > 0 ?
    Array.from({ length: number }, () => {
      return randomGenerator.next().value
    }) : randomGenerator.next().value
  }
}

const d2 = die(2)
const d3 = die(3)
const d4 = die(4)
const d6 = die(6)
const d8 = die(8)
const d10 = die(10)
const d12 = die(12)
const d20 = die(20)
const d30 = die(30)
const d100 = die(100)


module.exports = {
  die,
  d2,
  d3,
  d4,
  d6,
  d8,
  d10,
  d12,
  d20,
  d30,
  d100,
}
