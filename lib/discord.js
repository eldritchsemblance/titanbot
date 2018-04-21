export default class Bot {
  constructor(options = {}) {
    this.client = this.options.client || new require('discord.js').Client()

    this.token = options.token || ''
    this.commandPrefix = options.commandPrefix || ''
    this.commands = options.commands || []
    this.verbose = options.verbose || false
    this.debug = options.debug || false

    this.logger = options.logger || require('winston').createLogger()

    this.client.on('ready', options.onReady || () => {
      logger.info(`Logged in as ${client.user.tag}!`)
    })

    this.client.on('message', (message) => {
      if (this.commandPrefix && this.commands.length) {
        const parts = message.parts.split(' ')
        if (parts[0] == this.commandPrefix && parts.length > 1) {
          const commandText = parts[1]
          const arguments = parts.length > 2 ? parts.slice(2,-1) : []
          const matchedCommand = this.commands.find((command) => {
            return command.text === commandText
          })

          if (matchedCommand) {
            const reply = matchedCommand.action(arguments)
            if (reply) {
              replyToMessage(message, reply)
            }

          }

        }

      }

    })

  }

  replyToMessage(message, reply) {
    const maxLength = 2000
    const isMessageSafe = reply.length <= maxLength
    const tooLongReply = `\
    Error: Response too long. Discord only allows ${maxLength} characters.\
    `
    const content = isMessageSafe ? reply : tooLongReply
    const verboseMessage = this.isVerbose ? ` ${message}` : ''
      message.reply(content)
      if (!isMessageSafe) {
        const warningMessage = `\
        Oversized response: ${message.id}:${verboseMessage} (${message.author})\
        `
        this.logger.warn(warningMessage)
      }

    } catch (error) {
      const errorMessage = `\
      Error replying to message ${message.id}:${verboseMessage} (${error})\
      `
      this.logger.error(errorMessage)
    }

  }

}
