require('dotenv').config()

const TOKEN = process.env.TOKEN || ''
const VERBOSE = process.env.verbose || false
const DEBUG = process.env.debug || false

module.exports = { TOKEN, VERBOSE, DEBUG }
