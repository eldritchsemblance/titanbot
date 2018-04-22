const { DiscordBot } = require('./discordbot')
const EclipsePhase = require('./eclipsephase')

const testAction = (args) => {
  const targetNumber = parseInt(args[0])
  const result = targetNumber && targetNumber > 0 ?
  EclipsePhase.makeTest(targetNumber) :
  `Test Error: Target Number must be a positive integer.`
  return `${result}`
}

const testHelpText = 'test *number*: Make a test, success <= *target number*'

const testText = 'test'

const testCommand = {
  text: testText,
  action: testAction,
  helpText: testHelpText,
}

const rollAction = (args) => {
  const count = parseInt(args[0])
  const result = count && count > 0 ? EclipsePhase.rollDice(count) :
  'Roll Error: Number of dice must be a positive integer.'
  return `${result}`
}

const rollHelpText = 'roll *count*: Roll *count* d10 and total the result.'

const rollText = 'roll'

const rollCommand = {
  text: rollText,
  action: rollAction,
  helpText: rollHelpText,
}

const TitanBot = (token, verbose = false, debug = false) => {
  const options = {
    token,
    verbose,
    debug,
    name: 'TITAN',
    prefix: '/ep',
    commands: [testCommand, rollCommand]
  }

  return new DiscordBot(options)
}

module.exports = { TitanBot }
