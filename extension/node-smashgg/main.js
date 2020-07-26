// (async function(){
//     var smashgg = require('smashgg.js');
//     var { Tournament } = smashgg;
//     // var tournament = await Tournament.getTournament('test-tetrox');
//     var tournament = await Tournament.getTournament('saint-punch-2018');
 
//     var players = await tournament.getAllPlayers();
//     var sets = await tournament.getAllSets();
 
//     console.log(players.length + ' players entered ' + tournament.getName() +  ' overall');
//     players.forEach(player => {
//         console.log(
//             'Tag: ' + player.getTag() + '\n',
//             'Name: ' + player.getName() + '\n',
//             'State: ' + player.getState() + '\n'
//         )
//     });
 
//     console.log(sets.length + ' sets were played at ' + tournament.getName());
//     sets.forEach(set => {
//             console.log(
//                 '[%s: %s %s %s - %s %s %s]',
//             set.getRound(),
//             set.getPlayer1().getTag(), //Player object
//             set.getPlayer1().getName(), //Player object
//             set.getPlayer1Score(),
//             set.getPlayer2().getTag(), //Player object
//             set.getPlayer2().getName(), //Player object
//             set.getPlayer2Score()
//         );
//     })
 
//     console.log('Done!');
//     return process.exit(0);
// })()

exports.createClient = function createClient(options) {
    var client = {};
    client.makeRequest = async function(obj) {
        resData = {};
        var smashgg = require('smashgg.js');
        var { Tournament } = smashgg;
        var { PhaseGroup } = smashgg;
        var tournament = await Tournament.getTournament(obj.data.tournament);
        
        console.log('tournament');
        console.log(tournament);
        let ent = tournament.data.entities;
        // console.log(tournament.data);
        var phasefilter = []


        resData.tournament = tournament;
        
        // resData.players = await tournament.getAllPlayers({'isCached':false});
        // resData.sets =  await tournament.getSets({'isCached':false});
        // resData.events =  await tournament.getAllEvents({'isCached':false});

        var cnt = 0;
        ent.groups.forEach(function(grp){
            let phasegroup = new PhaseGroup(grp.id);
            phasegroup.on('ready', function(){
                cnt += 1;
                var ph = ent.phase.find(obj => { return obj.id === grp.phaseId; });
                grp.phaseName = ph.name; 
                grp.evtName = ent.event.find(obj => { return obj.id === ph.eventId; }).name;
                grp.phaseData = phasegroup;
                phasefilter.push(grp);
                if(cnt === ent.groups.length){
                    resData.filter =  phasefilter;
                    obj.callback(resData); //no error, so no err object
                }
                //do stuff with ceo2016
            })
        });


        
    }

    // var tournament =  Tournament.getTournament('saint-punch-2018');
 
    // var players = await tournament.getAllPlayers();
    // var sets = await tournament.getAllSets();
 
    return client;

};