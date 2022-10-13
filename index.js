const BaseClient = require('./module/BaseClient');global._="dscbots.js";require('./module/ErrorHandler/.js');process.env.DEBUG=false;
const BaseIntents = require('./module/intents')

module.exports = {
    BotClient: BaseClient,
    Intents: BaseIntents,
    version: require('./package.json')['version'],
};