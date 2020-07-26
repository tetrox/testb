const challonge = require('challonge')

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('Adress to remote: ' + add + ':9090/');
})

function clg(nodecg) {
  const matchesRep = nodecg.Replicant('challongeMatches');
  const playersRep = nodecg.Replicant('challongePlayers');
  const settingsRep = nodecg.Replicant('challongeSettings');
  const apiKey = nodecg.bundleConfig.challongeToken;
  //delay_masters_1
  const client = challonge.createClient({ apiKey });

function getMatches() {
  client.matches.index({
    id: settingsRep.value.url || '',
    callback (err, data) {
      let list = [];
      if (err) { console.log(err); return; } 
      for (const i in data) {
        let m = data[i].match;
        let arr = /(-?\d)-(-?\d)/.exec(m.scoresCsv);        
        let old;

        if (!arr) { arr = ['0', '0', '0']; }
        if (!arr[1]) { arr = ['0', '0']; }
        if (!arr[2]) { arr.push('0'); }

        if (matchesRep.value.find) {
          old = matchesRep.value.find(
            (el) => (el.id === m.id)
          ) || { rate: 3 }
        } else {
          old = { rate: 3 };
        }
        list.push({
          id: m.id,
          players:[
          	m.player1Id || 0,
          	m.player2Id || 0,
          ],
          score: [Number(arr[1]) , Number(arr[2])],
          rate: old.rate
        });
      };
      matchesRep.value = list;
  	}
  });
}

function getPlayers() {
  client.participants.index({
    id: settingsRep.value.url || '',
    callback (err, data) {
      let list = [];
      if (err) { console.log(err); return; } 
      for (const i in data) {
      	let p = data[i].participant;
      	let old = { rate: 3 };
       	for (const j in playersRep.value) {
       	  if (playersRep.value[j].id === p.id) {
       	  	old = playersRep.value[j];
       	  }
        } 
        
      	old.id = p.id;
      	old.name =  p.displayName;
      	old.changedName = old.changedName ? old.changedName : p.displayName;
      	list.push(old);
      };
      playersRep.value = list; 
    }
  });
}
  nodecg.listenFor('challongeUpdateMatches', () => {
  	getMatches();
  });
  nodecg.listenFor('challongeUpdatePlayers', () => {
    getPlayers();
  })

  setInterval(() => {
    if(settingsRep.value.autoUpdate) {
      getMatches();
      getPlayers();
    }
  }, 30000)

}

module.exports = clg;

/*
module.exports = {
  apiKey: 'aZvDUmfSAqizW1XsOqya3BeiEhfgYNAYImn5UvAH',
}
*/
/*
function cle(nodecg) {
  const client = challonge.createClient({
    // apiKey: key
  });

  function findPlayer(players, id) {
    for (let i = 0; i < players.length; i += 1) {
      if (players[i].participant.id === id) { return players[i].participant.name; }
    }

    return 'Error: Player not found';
  }

  function parseMatches(matches, players) {
    const top8 = [];
    const top8matches = [];
    const top8players = {};
    const playerNum = players.length;
    const matchNum = matches.length;
    const indexRoundMatch = ['r1m1', 'r1m2', 'r2m1', 'l1m1', 'l1m2', 'l2m1', 'l2m2', 'l3m1', 'l4m1', 'r3m1', 'r3m2'];

    // let top8matchNum = 0;
    let p1Name = '';
    let p2Name = '';
    let winner = 0;
    let score = ['', ''];
    let p1Id;
    let p2Id;
    // check if less than 8 players
    if (playerNum < 8 && playerNum > 4) {
      // 7 players: 3 WQ matches, 1 Loser's Eighths matches (loser of WQ1 gets L8 bye)
      // 6 players: 2 WQ matches, 0 Loser's Eighths matches
      // 5 players: 1 WQ match,   0 Loser's Eighths matches, 1 LQ match (loser of WS1 gets LQ bye)
      const firstWS = playerNum - 4; // match index of first WS set
      for (let i = 0; i < 3; i += 1) {
        top8matches[i] = matches[firstWS + i];
      }
      if (matchNum % 2 === 0) { // even if no reset, odd if reset
        for (let i = 1; i <= playerNum - 1; i += 1) {
          top8matches[10 - i] = matches[matchNum - i];
        }
      } else {
        for (let i = 1; i <= playerNum; i += 1) {
          top8matches[11 - i] = matches[matchNum - i];
        }
      }
      // top8matchNum = matchNum - firstWS;
    } else if (playerNum <= 4) {
      // 4 players: 0 WQ matches, 0 Loser's Eighths matches,
      //   0 LQ matches (losers of WS get LQ byes)
      // 3 players: 0 WQ matches, 1 WS match, 0 L8 matches,
      //   0 LQ matches, 0 LS matches (loser of WS gets byes into LF)
      // 2 players: 1 WF match, loser gets byes directly into GF
      const winnersFinalsIndex = playerNum - 2; // match index of WF set
      for (let i = 0; i <= winnersFinalsIndex; i += 1) {
        top8matches[2 - i] = matches[winnersFinalsIndex - i];
      }
      if (matchNum % 2 === 0) { // even if no reset, odd if reset
        for (let i = 1; i <= playerNum - 1; i += 1) {
          top8matches[10 - i] = matches[matchNum - i];
        }
      } else {
        for (let i = 1; i <= playerNum; i += 1) {
          top8matches[11 - i] = matches[matchNum - i];
        }
      }
      // top8matchNum = matchNum;
    } else { // playerNum >= 8
      // top8matches:
      //   0-1 = r1, 2 = r2, 3-4 = l1, 5-6 = l2, 7 = l3, 8 = l4, 9 = r3m1, 10 = r3m2 (reset)
      for (let i = 2; i <= 4; i += 1) { // winners semis and finals
        top8matches[4 - i] = matches[playerNum - i];
      }
      if (matchNum % 2 === 0) { // even if no reset, odd if reset
        for (let i = 1; i <= 7; i += 1) { // losers + grand finals
          top8matches[10 - i] = matches[matchNum - i];
        }
      } else {
        for (let i = 1; i <= 8; i += 1) { // losers + 2 grand finals sets
          top8matches[11 - i] = matches[matchNum - i];
        }
      }
      // top8matchNum = top8matches.length;
    }

    for (let i = 0; i < 11; i += 1) {
      // check if match at index exists
      if (!top8matches[i]) {
        // set all vars to blank
        p1Name = '';
        p2Name = '';
        winner = 0;
        score = ['', ''];
      } else {
        // get name associated with p1's id
        if (top8matches[i].match.player1Id) {
          p1Id = top8matches[i].match.player1Id.toString();
          if (!top8players[p1Id]) { // check if id is already in top8players
            top8players[p1Id] = findPlayer(players, p1Id);
          }
          p1Name = top8players[p1Id];
        } else p1Name = '';

        // get name associated with p2's id
        if (top8matches[i].match.player2Id) {
          p2Id = top8matches[i].match.player2Id.toString();
          if (!top8players[p2Id]) { // check if id is already in top8players
            top8players[p2Id] = findPlayer(players, p2Id);
          }
          p2Name = top8players[p2Id];
        } else p2Name = '';

        // get winner
        if (top8matches[i].match.winnerId === p1Id) {
          winner = 1;
        } else if (top8matches[i].match.winnerId === p2Id) {
          winner = 2;
        } else {
          winner = 0;
        }

        // get score (score[0] = p1's score, score[1] = p2's score)
        score = top8matches[i].match.scoresCsv.split('-');
        score.push('');
      }

      top8[i] = {
        roundMatch: indexRoundMatch[i],
        p1name: p1Name,
        p2name: p2Name,
        winner,
        score
      };
    }

    return top8;
  }

  function getMatches(linkData, origCallback) {
    client.setSubdomain(linkData.subdomain);
    client.tournaments.show({
      id: linkData.path,
      callback(err, tournamentData) {
        if (err) { console.log(err); return; } // eslint-disable-line no-console
        // check if tournament is DE
        if (tournamentData.tournament.tournamentType != 'double elimination') { // eslint-disable-line eqeqeq
          console.log('Tournament is not double elimination format. Will not import.'); // eslint-disable-line no-console
          return;
        }
        // group_stages_underway
        console.log(tournamentData.state); // eslint-disable-line no-console
        client.matches.index({
          id: linkData.path,
          callback(err2, matchData) {
            if (err2) { console.log(err2); return; } // eslint-disable-line no-console
            client.participants.index({
              id: linkData.path,
              callback(err3, playerData) {
                if (err3) { console.log(err3); return; } // eslint-disable-line no-console
                const d = new Date().toTimeString().split(' ')[0];
                console.log(`log : [nodecg/ext/challonge] <${d}> GET data (${linkData.path})`); // eslint-disable-line no-console
                const top8 = parseMatches(matchData, playerData);
                const top = {
                  matches: matchData, players: playerData, top8, tournament: tournamentData
                };
                origCallback(top);
              }
            });
          }
        });
      }
    });
  }

  nodecg.listenFor('ssbmChallongeUpdate', (data, callback) => {
    getMatches(data, callback);
  });
}

*/
