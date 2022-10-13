const EventsEmitter = require('events');
const fetch = require('node-fetch');
const WsManager = require('./ws/wsManager');
const getIntents = require('./intent');

class Client extends EventsEmitter {
    constructor({
        intents,
        token,
    }) {
        super();
        if (!intents) global._Error("You must provide intents.")
        if (typeof intents != 'number' && !(intents instanceof Array)) global._Error("Intents must be provided in an array or as intent number!");
        if (intents instanceof Array && intents.length < 1 || intents == 0) global._Error("You must provide intents!")

        this.getToken = function (_) {
            return _.Token ? _.Token : null;
        };
        /*this.prefix = prefix ? prefix : "#";*/ // Coming soon!
        this.intents = intents ? intents : [];
        this.Token = token ? token : null;
    }

    async evaluate(data) {
        eval(data);
    }

    async CreateBot(_) {
        if (!this.Token) global._Error("No Token Provided!");
        await fetch(`https://discord.com/api/users/@me`, {
            headers: {
                "Authorization": `Bot ${this.Token}`
            }
        }).then(req => {
            if (req.status == 429) global.DiscordError("[429] couldn't login!")
            else if (req.status != 200) global.DiscordError(`[${req.status}] Couldn't identify the issue!`)
            return req.json()
        })
            .then(res => {
                if (res?.code === 0) global.DiscordError("Invalid token provided!")
                if (typeof this.intents != 'number' && this.intents instanceof Array) {
                    const intents = getIntents(this.intents)
                    this.intents = intents
                } else if (!(this.intents instanceof Array) && typeof intents == 'number') {
                    this.intents = intents;
                }

                WsManager(this);
            })
    }
}

module.exports = Client;