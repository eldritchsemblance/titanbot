const { DiscordBot } = require('./discordbot')
const EclipsePhase = require('./eclipsephase')

const testAction = (args) => {
  const targetNumber = parseInt(args[0])
  let result = ''
  if (targetNumber && targetNumber > 0 && targetNumber <= 100) {
    let test = EclipsePhase.makeTest(targetNumber)
    const critical = test.isCritical ? '***Critical ' : ''
    const success = test.isSuccess ? 'Success!' : 'Failure!'
    result = `Test vs. **${targetNumber}** = **${
      test.roll
    }**: ${critical}${success}${test.isCritical ? '***' : ''}`
  } else {
    result = 'Test Error: Target Number must be a positive integer 100 or less.'
  }

  return result
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

  if (count && count > 0 && count <= 255) {
    let roll = EclipsePhase.rollDice(count)
    result = `Rolling **${count}**d10: **${roll.total}** [${roll.rolls}]`
  } else {
    result = 'Roll Error: Number of dice must be a reasonable positive integer.'
  }

  return result
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
