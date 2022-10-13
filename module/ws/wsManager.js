const fs = require('node:fs');
const WebSocket = require('ws');
const api = require(`mapih`);
const platfrom = require("os").platform();
const fetch = require('node-fetch');
const gateway_url1 = 'wss://gateway.discord.gg/?v=10&encoding=json';
const API_URL = 'https://discord.com/api/v10';
const timestamp = api.Utils.Timestamp;

module.exports = function (clientData) {
    const events = clientData;
    var presence = {};
    sessionStart(gateway_url1, false);
    function sessionStart(gateway_url, reconnect) {
        const socketEmitter = new WebSocket(gateway_url);
        var session = { seq: null, resuming: false, heartbeatACK: true };
        var cache = [];
        var { RESUMEABLE, activities_id, activities_name } = require('./enum')
        var Formats = {
            ////////////////////////////////// ToUpperCase formats //////////////////////////////////
            "PNG": "png",
            "JPG": "jpg",
            "JPEG": "jpeg",
            "WEBP": "webp",
            "GIF": "gif",
            "AUTO": "webp",
            ////////////////////////////////// ToLowerCase formats //////////////////////////////////
            "png": "png",
            "jpg": "jpg",
            "jpeg": "jpeg",
            "webp": "webp",
            "gif": "gif",
            "auto": "webp"
        };

        socketEmitter.on('error', (e) => {
            global.DiscordError(e.stack.toString())
        });

        socketEmitter.on('open', async () => {
            if (process.env.DEBUG == "true") {
                console.info(timestamp.default(), '-----------------------------------------------------');
                console.info(timestamp.default(), `-= Gateway: "Open" =-`);
                console.info(timestamp.default(), '-----------------------------------------------------');
            };
        });

        socketEmitter.on('message', async (data_) => {
            const data = JSON.parse(data_);
            const payloadData = data.d;
            if (data.s != undefined) session.seq = data.s;

            const data_t = {
                "READY": async () => {
                    session.application_id = payloadData.application.id;
                    session.session_id = payloadData.session_id;
                    session.resume_session_id = session.session_id;
                    session.resume_gateway_url = payloadData.resume_gateway_url + `/?v=10&encoding=json`;
                    session.hb = setInterval(() => {
                        if (session.heartbeatACK) {
                            if (process.env.DEBUG == "true")
                                console.info(timestamp.default(), 'Heartbeat');
                            session.heartbeatACK = false;
                            socketEmitter.send(JSON.stringify({ "op": 1, "d": session.seq }));
                        } else socketEmitter.close(1002);
                    }, session.heartbeat_interval);

                    if (process.env.DEBUG == "true") {
                        console.info(
                            'session ID:', payloadData.session_id, 'Application ID:', payloadData.application.id,
                            '\nUser ID:', payloadData.user.id, 'Logged in as:', payloadData.user.username + '#' + payloadData.user.discriminator,
                            '\nGuilds:', payloadData.guilds.length
                        );
                        console.info(timestamp.default(), '-----------------------------------------------------');
                        console.info(timestamp.default(), 'Session created, Service Ready.\n');
                    }
                    // Return Data \\
                    clientData.user = payloadData.user;
                    clientData.username = payloadData.user.username;
                    clientData.id = payloadData.user.id;
                    clientData.avatar = payloadData.user.avatar;
                    clientData.user.tag = payloadData.user.username + '#' + payloadData.user.discriminator;
                    clientData.user.AvatarURL = function (Avataroptions = {}) {
                        const format = Avataroptions?.format;
                        if (format) {
                            if (typeof format != 'string') return global._Error("Image format must be an string.");
                            if (!Formats[format]) return global._Error("Invalid image format!");

                            return `https://cdn.discordapp.com/avatars/${payloadData.user.id}/${payloadData.user.avatar}.${Formats[format]}`
                        } else {
                            return `https://cdn.discordapp.com/avatars/${payloadData.user.id}/${payloadData.user.avatar}`
                        }
                    }
                    /**
                     * 
                     * @param {String} message - The message it will display on the status.
                     * @param {String|Number} type - The type of status it will display.
                     */
                    clientData.user.setStatus = function (message, type) {
                        if (!message||typeof(message)!='string') return global._Error("The message must be a string!");
                        if (!type||typeof(type)!='string') return global._Error("The status must be a string");
                        if (!(activities_name[type])) global._Error("The activity type is invalid!")
                        presence = {
                            name: message,
                            type: activities_name[type]
                        }
                        setTimeout(function () {
                            sessionStart(gateway_url1, true)
                        }, 2500)
                    }

                    if (reconnect != true || reconnect == false) {
                        clientData.emit('ready', clientData);
                    }
                },
                "MESSAGE_CREATE": async () => {
                    ////////////////////////////////// main contents //////////////////////////////////
                    const message = {};
                    message.content = payloadData.content;
                    message.author = {};
                    message.author.username = payloadData.author.username;
                    message.author.id = payloadData.author.id;
                    message.author.discriminator = payloadData.author.discriminator;
                    message.author.tag = payloadData.author.username + "#" + payloadData.author.discriminator;
                    message.author.isBot = payloadData.author.bot ? payloadData.author.bot : false;
                    message.channel = await fetch(`${API_URL}/channels/${payloadData.channel_id}`, {
                        headers: {
                            "Authorization": `Bot ${clientData.Token}`
                        }
                    })
                        .then(response => response.json())
                        .then(DiscordResponse => DiscordResponse);

                    ////////////////////////////////// functions //////////////////////////////////
                    message.author.AvatarURL = function (Avataroptions = {}) {
                        const format = Avataroptions?.format;
                        if (format) {
                            if (typeof format != 'string') return global._Error("Image format must be an string.");
                            if (!Formats[format]) return global._Error("Invalid image format!");

                            return `https://cdn.discordapp.com/avatars/${payloadData.author.id}/${payloadData.author.avatar}.${Formats[format]}`
                        } else {
                            return `https://cdn.discordapp.com/avatars/${payloadData.author.id}/${payloadData.author.avatar}`
                        }
                    }

                    message.channel.send = function (MessageContent) {
                        if (!MessageContent) return global._Error("Message content must be provided when sending an message.");
                        if (typeof MessageContent != "string") return global._Error("The provided message content must be a string.");

                        const MessageBody = JSON.stringify({
                            content: MessageContent.toString(),
                        })

                        fetch(`${API_URL}/channels/${payloadData.channel_id}/messages`, {
                            method: "POST",
                            body: MessageBody,
                            headers: {
                                "content-type": "application/json",
                                "Authorization": `Bot ${clientData.Token}`
                            }
                        })
                            .then(response => response.json());
                    };

                    message.reply = async function (MessageContent) {
                        if (!MessageContent) return global._Error("Message content must be provided when sending an message.");
                        if (typeof MessageContent != "string") return global._Error("The provided message content must be a string.");

                        const MessageBody = JSON.stringify({
                            content: MessageContent.toString(),
                            message_reference: {
                                message_id: payloadData.id,
                            }
                        });

                       await fetch(`${API_URL}/channels/${payloadData.channel_id}/messages`, {
                            method: "POST",
                            body: MessageBody,
                            headers: {
                                "content-type": "application/json",
                                "Authorization": `Bot ${clientData.Token}`
                            }
                        })
                            .then(response => response.json())
                            .then(d_res => message['id'] = d_res.id)
                            return new Promise((res, rej) => {
                                try { 
                                    res(message)
                                } catch (e) {
                                    rej(e)
                                    global._Error(`${e}`)
                                }
                            })
                    }

                    message.delete = function () {
                        fetch(`${API_URL}/channels/${payloadData.channel_id}/messages/${payloadData.id}`, {
                            method: "DELETE",
                            headers: {
                                "content-type": "application/json",
                                "Authorization": `Bot ${clientData.Token}`
                            }
                        })
                            //.then(response => response.json());
                    };

                    ////////////////////////////////// EVENT RUN //////////////////////////////////
                    cache.push(message);
                    clientData.emit("cacheCallback", cache);
                    clientData.emit('newMessage', message);
                },
                "RESUMED": async () => {
                    session.hb = setInterval(() => {
                        if (session.heartbeatACK) {
                            if (process.env.DEBUG == "true")
                                console.info(timestamp.default(), 'Heartbeat');
                            session.heartbeatACK = false;
                            socketEmitter.send(JSON.stringify({ "op": 1, "d": session.seq }));
                        } else socketEmitter.close(1002);
                    }, session.heartbeat_interval);
                    if (process.env.DEBUG == "true")
                        console.info(timestamp.default(), 'Gateway: Resumed', payloadData);
                    clientData.emit('resumed', payloadData);
                }
            }

            const data_op = [];

            data_op[0] = () => {
                try {
                    (data_t[data.t]) ? data_t[data.t]() : (async () => {
                        events.emit(`${data.t}`.toLowerCase(), payloadData);
                    })();
                } catch (e) {
                    global.DiscordError(e.stack.toString())
                }
            }

            data_op[1] = async () => {
                if (process.env.DEBUG == "true")
                    console.info(timestamp.default(), 'Heartbeat Requested');
                socketEmitter.send(JSON.stringify({ "op": 1, "d": session.seq }));
            };

            data_op[7] = async () => {
                socketEmitter.close(1012);
            };

            data_op[9] = async () => {
                if (process.env.DEBUG == "true")
                    console.log('OpCode: 9 -- data.d', data.d);
                (data.d) ? socketEmitter.close(5000) : socketEmitter.close(1011);
            };

            data_op[10] = async () => {
                if (process.env.DEBUG == "true") {
                    console.info(timestamp.default(), '-----------------------------------------------------');
                    console.info(timestamp.default(), `{-= Gateway: "Hello" =-}`);
                    console.info(timestamp.default(), '-----------------------------------------------------');
                }

                session.heartbeat_interval = payloadData.heartbeat_interval;

                session.resuming ? socketEmitter.send(JSON.stringify({ "op": 6, "d": { "token": clientData.Token, "session_id": session.resume_session_id, "seq": session.resume_seq } }))
                    : socketEmitter.send(JSON.stringify({
                        "op": 2,
                        "d": {
                            "token": clientData.Token,
                            "properties": {
                                "os": "linux",
                                "browser": "Test",
                                "device": "Test"
                            },
                            "shard": [0, 1],
                            "presence": {
                                "activities": [presence],
                                "status": "online",
                                "since": 0,
                                "afk": false
                            },
                            "intents": clientData.intents,
                        }
                    }));
            };

            data_op[11] = async () => {
                if (process.env.DEBUG == "true")
                    console.info(timestamp.default(), 'Heartbeat Acknowledged');
                session.heartbeatACK = true;
            };

            try {
                data_op[data.op]();
            } catch (e) {
                global.DiscordError(e.stack.toString())
            }
        });

        socketEmitter.on('close', code => {
            clearInterval(session.hb);

            RESUMEABLE[code] ? (() => {
                session.resume_seq = session.seq;
                session.resuming = true;
                setTimeout(function () { sessionStart(session.resume_gateway_url, true) }, 1000);
            })() : (() => {
                session.restarting = true;
                setTimeout(function () { sessionStart(gateway_url1, true) }, 1000);
            })()
        }, { once: true });
    }
}