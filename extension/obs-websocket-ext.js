const OBSWebSocket = require('obs-websocket-js');

function ows(nodecg) {
  const configConnect = nodecg.bundleConfig.obsWebSocket;

  nodecg.listenFor('owsSwitchScene', (screen) => {
    const obsRep = nodecg.Replicant('obs');
    let obs;

    if (obsRep.value.enabled) {
      obsRep.value.connected = true;
      obs = new OBSWebSocket();
      obs.connect(configConnect)
        .then(() => obs.send('GetSceneList'))
        .then((data) => {
          data.scenes.forEach((scene) => {
            if (scene.name !== data.currentScene && scene.name === screen) {
              console.log(`ows: switching to Scene -> ${scene.name}`); // eslint-disable-line no-console

              setTimeout(() => {
                obs.send('SetCurrentScene', { 'scene-name': scene.name });
                obsRep.value.scene = scene.name;
                obsRep.value.connected = false;
              }, 1500);
            }
          });
        })
        .catch((err) => {
          console.log(err); // eslint-disable-line no-console
          obsRep.value.connected = false;
        });
    }
  });
  nodecg.listenFor('owsSaveBuffer', () => {
    const obs = new OBSWebSocket();
    console.log('Saving'); // eslint-disable-line no-console
    obs.connect(configConnect)
      .then(() => obs.send('SaveReplayBuffer'))
      .catch((err) => {
        obs.send('StartReplayBuffer');
        console.log(err); // eslint-disable-line no-console
        console.log('but started'); // eslint-disable-line no-console
      });
  });

  nodecg.listenFor('owsSetup', (inst) => {
    let obs;
    const obsRep = nodecg.Replicant('obs');
    const cutList = ['Cut', 'Обрезка'];
    let needTransition = cutList[0];

    if (obsRep.value.enabled) {
      obsRep.value.connected = true;

      obs = new OBSWebSocket();
      console.log(inst); // eslint-disable-line no-console
      console.log('ows: Start Instalation'); // eslint-disable-line no-console

      obs.connect(configConnect)
        .then(() => obs.send('GetTransitionList'))
        .then((data) => {
          if (!cutList.includes(data['current-transition'])) {
            console.log('ows: Change transaction type... '); // eslint-disable-line no-console
            for (const tr of data.transitions) {
              if (cutList.includes(tr.name)) {
                needTransition = tr.name;
              }
            }
            obs.send('SetCurrentTransition', { 'transition-name': needTransition });
          }
          console.log(data); // eslint-disable-line no-console
        })
        .catch((err) => {
          console.log(err); // eslint-disable-line no-console
        });

      setTimeout(() => {
        obs.connect(configConnect)
          .then(() => obs.send('GetCurrentSceneCollection'))
          .then((data) => {
            console.log(data); // eslint-disable-line no-console
          });
      }, 2000);
    }
  });
}

module.exports = ows;
