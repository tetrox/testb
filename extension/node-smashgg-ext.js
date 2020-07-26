const smashgg = require('./node-smashgg');

function sgg(nodecg) {
  const client = smashgg.createClient({});

  function getMatches(linkData, origCallback) {
    client.makeRequest({
      data: linkData,
      callback(a) {
        origCallback(a);
      }
    });
  }

  nodecg.listenFor('ssbmSGGUpdate', (data, callback) => {
    getMatches(data, callback);
  });
}

module.exports = sgg;
