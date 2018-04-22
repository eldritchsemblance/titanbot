const config = require('./config')
const { TitanBot } = require('./lib')

TitanBot(config.TOKEN, config.VERBOSE, config.DEBUG).login()
