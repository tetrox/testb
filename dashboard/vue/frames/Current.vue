<template lang="pug">
#current
  el-row.game(:span='24')
    p Game
    el-select(placeholder="Select" :value="currentGame" @change='setGame(index, $event)')
      el-option(v-for='(opt, key) in games'  :value='opt.value'  :label="opt.text" :key="key")
  el-row.screens
    el-col(v-for='(btn, key) in buttons' :key="key" :span='12')
      el-button(
        :id='btn'
        :type='btnType(btn)'
        @click='setScreen(btn)'
      ) {{ btn }}
  br
</template>

<script>
export default {
  data() {
    return {
      currentGame: 'GG',
      currentScreen: 'fight',
      buttons: [
        'fight',
        // 'bracket',
        'wait',
        // 'stream',
        // 'players'
        // 'gameplay',
        'empty',
      ],
      games: [
        { value: 'T7', text: 'Tekken 7' },
        { value: 'SF', text: 'Street Fighter V Arcade Edition' },
        { value: 'GG', text: 'Guilty Gear XRD Rev2' },
        { value: 'SS', text: 'Samsho' },
        { value: 'MK', text: 'Mortal Kombat 11' },
        { value: 'UN', text: 'Under Night In-Birth Exe:Late[st]' },
        { value: 'OT', text: 'Other' },
      ],
      reps: {
        screen: null,
        game: null,
      },
    };
  },
  mounted() {
    if (typeof NodeCG !== 'undefined') {
      NodeCG.waitForReplicants(
        nodecg.Replicant('currentScreen'),
        nodecg.Replicant('currentGame'),
      ).then(() => {
        this.reps.screen = nodecg.Replicant('currentScreen');
        this.reps.game = nodecg.Replicant('currentGame');
        this.reps.screen.on('change', (newVal) => {
          if (this.currentScreen !== newVal) {
            this.currentScreen = newVal.screen;
          }
        });
        this.reps.game.on('change', (newVal) => {
          if (this.currentGame !== newVal) {
            this.currentGame = newVal;
          }
        });
      });
    }
  },
  methods: {
    setScreen(screen) {
      if (this.currentScreen !== screen) {
        this.reps.screen.value = { screen };
        nodecg.sendMessage('owsSwitchScene', screen);
      }
    },
    setGame(i, game) {
      if (this.currentGame !== game) {
        this.reps.game.value = game;
      }
    },
    btnType(btn) {
      return btn === this.currentScreen ? 'danger' : 'info';
    },
  },
};
</script>
<style lang="sass">
#current
  padding-top: 2px
  .screens .el-button
    text-transform: uppercase
  .el-row
    .el-col
      width: calc(50% - 4px)
      margin: 2px

  .el-button
    // width: calc(100% - 2px)
    width: 100%

  .el-select
    flex-basis: 80%

  .game
    margin: 4px 2px
    display: flex
      width: calc(100% - 4px)
    p
      margin: 0
      height: 40px
      width: 75px
      display: flex
      align-items: center
      background-color: #E4E7ED
      color: #6155BD
      justify-content: center
      flex-basis: 20%
      min-width: 60px

  .gName
    color: #fff
    padding: .375rem 12px
    text-align: center
</style>
