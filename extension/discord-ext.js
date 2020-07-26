const Discord = require('discord.js');

function dex(nodecg) {
  const discordVoice = nodecg.Replicant('discordVoice');
  // obsRep.value.connected = true;
  const configConnect = {
    token: nodecg.bundleConfig.discordToken
  };
  const blankUser = { 0: { id: '0', name: '-empty-' } };
  console.log('dex: Loaded...'); // eslint-disable-line no-console

  const client = new Discord.Client();
  discordVoice.value.isBotOnline = false;
  discordVoice.value.users = blankUser;

  function parseUser(user, bool = { bitfield: 0 }) {
    return {
      id: user.id,
      name: user.username,
      avatarURL: user.avatarURL({ format: 'png', size: 256 }),
      voiceStatus: bool.bitfield === 1,
    };
  }

  client.on('message', async (message) => {
    if (message.content === '/hear' && !discordVoice.value.isBotOnline) {
      // Only try to join the sender's voice channel if they are in one themselves
      if (message.member && message.member.voice && message.member.voice.channel) {
        const conn = await message.member.voice.channel.join();
        const dispatcher = conn.play('./bundles/testb/extension/discord-ext/blank.mp3', { passes: 5 });
        const initUsers = blankUser;

        discordVoice.value.isBotOnline = true;
        discordVoice.value.users = blankUser;

        console.log('dex: Play join.mp3...'); // eslint-disable-line no-console

        dispatcher.on('start', () => {
          console.log('dex: Play Starting...'); // eslint-disable-line no-console
        });
        dispatcher.on('finish', () => {
          console.log('dex: Finished playing!'); // eslint-disable-line no-console
        });
        dispatcher.on('end', () => {
          console.log('dex: End Finished playing!'); // eslint-disable-line no-console
        });

        conn.on('error', (error) => {
          console.log('conn Error!', error); // eslint-disable-line no-console
        });

        conn.on('failed', (error) => {
          console.log('conn Fail!', error); // eslint-disable-line no-console
        });

        // console.log(conn.channel.members);

        if (conn.channel.members) {
          for (const member of conn.channel.members) {
            if (!member[1].user.bot) {
              initUsers[member[0]] = parseUser(member[1].user);
            }
          }
          discordVoice.value.users = initUsers;
        }

        conn.on('speaking', (member, bool) => {
          if (member && !member.bot) {
            discordVoice.value.users[member.id] = parseUser(member, bool);
            // console.log(member.username, bool.bitfield === 1);
          }
        });

        // console.log(conn.channel.members);
      } else {
        message.reply('You need to join a voice channel first!');
      }
    }
  });

  // client.on("guildMemberSpeaking", (member, bool) => {
  //   console.log(member, bool);
  // });

  client.login(configConnect.token);

  // .then(conn => {
  //   console.log(conn);
  // });

  // obs.connect(configConnect)
  // .then(() => obs.send('SaveReplayBuffer'))
  // .catch(err => {
  //   obs.send('StartReplayBuffer')
  //   console.log(err);
  //   console.log('but started');
  // });
  nodecg.listenFor('disCheck', () => {
  });
}

module.exports = dex;
