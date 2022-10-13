const Dbot = require('./index')
const bot = new Dbot.BotClient({
    intents: [Dbot.Intents.FLAGS.GUILD_MESSAGES, Dbot.Intents.FLAGS.DIRECT_MESSAGES],
    token: "ODg2Njc3NDE1NDk2MTQyODQ5.G7DaE6.l9idEhEQMiepSAIDhDBt7AwDZCaHl59kn9Ve-0",
});

bot.on('ready', () => {
    console.log(`${bot.user.tag} is ready.`)
    bot.user.setStatus("epic games", "WATCHING");
})

bot.CreateBot();