const moment = require('moment')
const winston = require('winston')
const Discord = require('discord.js')

class DiscordBot {
  constructor(options = {}) {
    this.client = options.client || new Discord.Client()

    this.token = options.token || ''
    this.name = options.name || 'Bot'
    this.prefix = options.prefix || ''
    this.commands = options.commands || []
    this.verbose = options.verbose || false
    this.debug = options.debug || false

    this.logger = options.logger || winston

    this.client.on('ready', (event) => {
      this.logger.info(
        `Login: ${this.client.user.tag} ${moment().format()}`
      )
    })

    this.client.on('message', (message) => {
      if (this.prefix && this.commands.length) {
        const parts = message.content.split(' ')
        if (parts[0] == this.prefix && parts.length > 1) {
          const commandText = parts[1].trim().toLowerCase()
          const args = parts.length > 2 ? parts.slice(2) : []
          const matchedCommand = this.commands.find((command) => {
            return command.text === commandText
          })

          let reply = ''
          let channel = null
          if (matchedCommand) {
            reply = matchedCommand.action(args)
          } else {
            channel = message.author
            switch (commandText) {
              case 'help':
              reply = this.generateHelp(args)
              break
              case 'info':
              const uptime = this.client.uptime
              const uptimeSpan = moment.duration(uptime).humanize()
              const uptimeSince = moment().subtract(uptime).format()
              reply = `${this.name} as ${this.client.user.tag} on ${
                this.client.guilds.size
              } server${
                this.client.guilds.size  > 1 ? 's' : ''
              } since ${uptimeSince} (${uptimeSpan} ago)
              `
              break
              case 'install':
              reply = 'Not supported'
              break
              default:
              break
            }
          }

          if (reply) {
            this.replyToMessage(message, reply, channel)
          }

        }

      }

    })

    this.client.on("guildCreate", (guild) => {
      this.logger.info(`Joined: ${guild.name} (${guild.id})`)
      this.client.user.setActivity(`Online: ${this.client.guilds.size}`)
    })

    this.client.on("guildDelete", (guild) => {
      this.logger.info(`Removed: ${guild.name} (${guild.id})`)
      this.client.user.setActivity(`Online: ${this.client.guilds.size}`)
    })

  }

  generateHelp(args) {
    const generateHeader = (topic = '') => {
      return `***${this.name} Help${topic ? `: ${topic}` : ''}***`
    }

    if (args.length) {
      const commandText = args[0].trim().toLowerCase()
      switch (commandText) {
        case 'help':
        return `${generateHeader(commandText)}\
        \`\`\`${this.prefix} help: This message.\
        \n\n${this.prefix} help *topic*: Show help on a topic\`\`\``
        break
        case 'info':
        return `${generateHeader(commandText)}\
        \`\`\`${this.prefix} info: Show system information\`\`\``
        case 'install':
        return `${generateHeader(commandText)}\
        \`\`\`\${this.prefix} invite: Get an invitation url to install \
        ${this.name}\`\`\``
        default:
        break
      }

      const matchedCommand = this.commands.find((command) => {
        return command.text === commandText
      })

      return matchedCommand && matchedCommand.helpText ?
      `${generateHeader(matchedCommand.text)}\
      \`\`\`${matchedCommand.helpText}\`\`\`` :
      `${generateHeader()}\
      \`\`\`There is no help available for ${commandText}\`\`\``

    } else {
      return `${generateHeader()}\
      \`\`\`${this.commands.map((command) => {
        return `${this.prefix} ${command.helpText}`
      }).join('\n\n')}\`\`\``
    }

  }

  replyToMessage(message, reply = '', channel = null) {
    if (!reply) {
      return
    }

    const maxLength = 2000
    const isMessageSafe = reply.length <= maxLength
    const tooLongReply = `\
    Error: Response too long. Discord only allows ${maxLength} characters.\
    `
    const content = isMessageSafe ? reply : tooLongReply
    const verboseMessage = this.isVerbose ? ` ${message}` : ''
    try {
      if (channel) {
        channel.send(content)
      } else if (message) {
        message.reply(content)
      }

      if (!isMessageSafe) {
        const warningMessage = `${moment().format()}: Oversized response: ${
          message.id
        }:${verboseMessage} (${message.author})`
        this.logger.warn(warningMessage)
      }

    } catch (error) {
      const errorMessage = `${moment().format()}:  Error replying to message ${
        message.id
      }:${verboseMessage} (${error})`
      this.logger.error(errorMessage)
    }

  }

  login(token = this.token) {
    return this.client.login(token)
  }

}

module.exports = { DiscordBot }
