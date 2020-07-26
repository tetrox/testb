/* eslint-disable global-require */
function ind(nodecg) {
  require('./node-challonge-ext')(nodecg);
  require('./node-smashgg-ext')(nodecg);
  require('./obs-websocket-ext')(nodecg);
  require('./discord-ext')(nodecg);
}

module.exports = ind;
