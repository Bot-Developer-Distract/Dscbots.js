<div align="center">
	<br />
	<p>
		<img src="https://cdn.discordapp.com/attachments/1005463875078078485/1028623915708334080/dscbots.png" width="546" alt="dscbots.js" />
	</p>
	<br />
</div>

## Credits
[Goodsie](https://github.com/gidsola) - Helping me with the websocketmanager

## About

dscbots.js is a Node.js module that allows you to interact with the
Discord API without any complications.


- Performant
- 100% coverage of the Discord API
  
## Usage
** **
**Node.js 16.9.0 or newer is required.**

Installing dscbots.js:

```sh-session
npm install dscbots.js
yarn add dscbots.js
pnpm add dscbots.js
```

Setup your bot with the following code:

```js
const Dbot = require('dscbots.js')
const bot = new Dbot.BotClient({
    intents: [Dbot.Intents.FLAGS.GUILD_MESSAGES, Dbot.Intents.FLAGS.DIRECT_MESSAGES],
    token: "<Bot Token>"
})

bot.on('ready', () => {
    console.log(`${bot.user.tag} is ready.`)
})

bot.CreateBot();
```

Afterwards we can create quite simple commands:


```js
const Dbot = require('dscbots.js')
const bot = new Dbot.BotClient({
    intents: [Dbot.Intents.FLAGS.GUILD_MESSAGES, Dbot.Intents.FLAGS.DIRECT_MESSAGES],
    token: "<Bot Token>"
})

bot.on('ready', () => {
    console.log(`${bot.user.tag} is ready.`)
})

bot.on('newMessage', (message) => {
    if (message.author.isBot) return;
    
    if (message.content === '!hello') {
        message.reply("Hi!");
    }
})

bot.CreateBot();
```

You can also set your status!

```js
const Dbot = require('dscbots.js')
const bot = new Dbot.BotClient({
    intents: [Dbot.Intents.FLAGS.GUILD_MESSAGES, Dbot.Intents.FLAGS.DIRECT_MESSAGES],
    token: "<Bot Token>"
})

bot.on('ready', () => {
    console.log(`${bot.user.tag} is ready.`)
    bot.user.setStatus("This server!", "WATCHING");
    // There is currently 2,5s delay to not cause ratelimit!
})

bot.CreateBot();
```

## Help

If you don't understand something in the package, you are experiencing problems, or you just need a gentle
nudge in the right direction, please don't hesitate to join our official [dscbots.js Server](https://discord.gg/YM9KxHpcWb).