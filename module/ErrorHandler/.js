const colors = require('colors')
const _ = global._
class _Error extends Error {
  constructor(message) {
    super(message);
    this.name = `[${_}]`.yellow;
  }
}
class _Discord extends Error {
  constructor(message) {
    super(message);
    this.name = `[Discord]`.blue; 
  }
}

global._Error = function (err) {
  throw new _Error(`${err}`.red)
};

global.DiscordError = function (err) {
  throw new _Discord(`${err}`.red)
};